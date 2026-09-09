/**
 * Olden booking security / commercial gate tests (O-13 launch).
 * No live Stripe calls in unit tests. Uses Worker preview mode + shared pricing authority.
 * LIVE_PAYMENTS_CODE_ENABLED is true; other live gates (unlock, bookings, secrets) still apply.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import worker from "./index";
import { LIVE_PAYMENTS_CODE_ENABLED, liveCheckoutBlock, bookingsAreEnabled } from "./live-gate";
import { assertStripeTestSecret, StripeModeError } from "./stripe-guard";
import { findOldenBookingProduct, OLDEN_BOOKING_PRODUCTS } from "../../../shared/destinations/olden-products";
import {
  assertClientTotalMatches,
  calculateBookingQuote,
  requestedCustomerEmail,
  destinationBrandFromCore,
  statusAfterPaymentSuccess,
  validateCruise,
  validateCustomer,
} from "../../../shared/world-booking";
import { oldenBookingCore } from "../../../shared/destinations/olden";

const PRODUCT_ID = "briksdal-glacier-olden-lake";

const previewEnv = {
  PAYMENTS_MODE: "preview",
  BOOKINGS_ENABLED: "true",
  CORS_ALLOWED_ORIGINS: "http://localhost:3000",
  SITE_BASE_URL: "http://localhost:3000",
} as unknown as Env;

function payload(
  sessionId: string,
  guests = { adults: 2, children: 0, infants: 0 },
  overrides: Record<string, unknown> = {},
  productId = PRODUCT_ID,
) {
  const product = findOldenBookingProduct(productId)!;
  const quote = calculateBookingQuote(product, guests);
  return {
    productId,
    bookingSessionId: sessionId,
    guests,
    customer: { name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" },
    cruise: {
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "regal-princess",
      cruiseLine: "Princess Cruises",
      isCustomShip: true,
      scheduleMatched: false,
    },
    confirmationAcknowledged: true,
    eligibilityAcknowledged: true,
    clientDisplayedTotalCents: quote.amountCents,
    ...overrides,
  };
}

function jsonReq(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("LIVE_PAYMENTS_CODE_ENABLED is true for Olden O-13 public launch", () => {
  assert.equal(LIVE_PAYMENTS_CODE_ENABLED, true);
});

test("production liveCheckoutBlock requires unlock even when code flag is on", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  const ready = liveCheckoutBlock(
    {
      PAYMENTS_MODE: "live",
      LIVE_PAYMENTS_UNLOCK: "OLDEN_LIVE_UNLOCK",
      BOOKINGS_ENABLED: "true",
      STRIPE_SECRET_KEY: "sk_live_fake",
      STRIPE_WEBHOOK_SECRET: "whsec_fake",
      SITE_BASE_URL: "https://oldenshoreexcursions.com",
      DB: {} as D1Database,
    },
    product,
  );
  assert.equal(ready, null);

  const missingUnlock = liveCheckoutBlock(
    {
      PAYMENTS_MODE: "live",
      BOOKINGS_ENABLED: "true",
      STRIPE_SECRET_KEY: "sk_live_fake",
      STRIPE_WEBHOOK_SECRET: "whsec_fake",
      SITE_BASE_URL: "https://oldenshoreexcursions.com",
      DB: {} as D1Database,
    },
    product,
  );
  assert.ok(missingUnlock);
  assert.equal(missingUnlock!.code, "LIVE_UNLOCK_REQUIRED");

  const bookingsOff = liveCheckoutBlock(
    {
      PAYMENTS_MODE: "live",
      LIVE_PAYMENTS_UNLOCK: "OLDEN_LIVE_UNLOCK",
      BOOKINGS_ENABLED: "false",
      STRIPE_SECRET_KEY: "sk_live_fake",
      STRIPE_WEBHOOK_SECRET: "whsec_fake",
      SITE_BASE_URL: "https://oldenshoreexcursions.com",
      DB: {} as D1Database,
    },
    product,
  );
  assert.ok(bookingsOff);
  assert.equal(bookingsOff!.code, "BOOKINGS_DISABLED");
});

test("BOOKINGS_ENABLED=false kill switch", () => {
  assert.equal(bookingsAreEnabled({ BOOKINGS_ENABLED: "false" }), false);
});

test("Briksdal live request mode with EUR 96/56/0", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  assert.equal(product.availability, "live");
  assert.equal(product.bookingMode, "request");
  assert.equal(product.pricing.currency, "EUR");
  assert.equal(product.pricing.adultAmount, 96);
  assert.equal(product.pricing.childAmount, 56);
  assert.equal(product.pricing.infantAmount, 0);
  assert.equal(product.capacity.maxGuestsPerBooking, 10);
  assert.equal(OLDEN_BOOKING_PRODUCTS.length, 1);
});

test("EUR pricing cents: adult 9600, adult+child 15200, adult+infant 9600", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  assert.equal(calculateBookingQuote(product, { adults: 1, children: 0, infants: 0 }).amountCents, 9600);
  assert.equal(calculateBookingQuote(product, { adults: 1, children: 1, infants: 0 }).amountCents, 15200);
  assert.equal(calculateBookingQuote(product, { adults: 1, children: 0, infants: 1 }).amountCents, 9600);
});

test("zero-adult booking rejected", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  assert.throws(() => calculateBookingQuote(product, { adults: 0, children: 1, infants: 0 }));
});

test("max 10 guests ok; 11 guests rejected", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  assert.doesNotThrow(() => calculateBookingQuote(product, { adults: 10, children: 0, infants: 0 }));
  assert.throws(() => calculateBookingQuote(product, { adults: 11, children: 0, infants: 0 }));
});

test("preview Worker records requested booking with W2ODE- prefix", async () => {
  const sessionId = `ode-sess-${Date.now()}`;
  const first = await worker.fetch(
    jsonReq("http://bookings.test/api/bookings/request", payload(sessionId, { adults: 2, children: 0, infants: 0 })),
    previewEnv,
  );
  const firstJson = (await first.json()) as { ok: boolean; status: string; reference: string };
  assert.equal(firstJson.ok, true);
  assert.equal(firstJson.status, "requested");
  assert.equal(statusAfterPaymentSuccess("request"), "requested");
  assert.match(firstJson.reference, /^W2ODE-/);
});

test("client price tampering rejected", async () => {
  const tampered = payload(`tamper-${Date.now()}`, { adults: 2, children: 0, infants: 0 }, { clientDisplayedTotalCents: 1 });
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/request", tampered), previewEnv);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "PRICE");
});

test("unknown product rejected", async () => {
  const bad = payload(`unk-${Date.now()}`, { adults: 1, children: 0, infants: 0 }, { productId: "not-an-olden-product" });
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/request", bad), previewEnv);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "UNKNOWN_PRODUCT");
});

test("missing consent rejected", async () => {
  const body = payload(`consent-${Date.now()}`, { adults: 1, children: 0, infants: 0 }, { confirmationAcknowledged: false });
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/request", body), previewEnv);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "CONSENT");
});

test("missing walking suitability ack rejected", async () => {
  const body = payload(`walk-${Date.now()}`, { adults: 1, children: 0, infants: 0 }, { eligibilityAcknowledged: false });
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/request", body), previewEnv);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "ELIGIBILITY");
});

test("past date rejection", () => {
  assert.ok(
    validateCruise({
      date: "2020-01-01",
      shipName: "Ship",
      shipSlug: "s",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    }),
  );
});

test("invalid email / zero party / missing fields", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  assert.throws(() => calculateBookingQuote(product, { adults: 0, children: 0, infants: 0 }));
  assert.ok(validateCruise({ date: "nope", shipName: "Ship", shipSlug: "s", cruiseLine: "", isCustomShip: true, scheduleMatched: false }));
  assert.ok(validateCustomer({ name: "Alex Traveller", email: "bad", phone: "+447700900123" }));
  assert.equal(validateCustomer({ name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" }), null);
});

test("ops request heading is Olden", () => {
  const src = readFileSync(new URL("./notify.ts", import.meta.url), "utf8");
  assert.match(src, /NEW OLDEN BOOKING REQUEST/);
  assert.doesNotMatch(src, /NEW BELIZE BOOKING REQUEST|NEW ST LUCIA BOOKING REQUEST/);
});

test("missing customer fields rejected by preview Worker", async () => {
  const body = payload(`miss-${Date.now()}`, { adults: 1, children: 0, infants: 0 }, {
    customer: { name: "", email: "alex@example.com", phone: "+447700900123" },
  });
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/request", body), previewEnv);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "CUSTOMER");
});

test("assertClientTotalMatches rejects mismatch", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  const quote = calculateBookingQuote(product, { adults: 2, children: 0, infants: 0 });
  assert.throws(() => assertClientTotalMatches(quote, quote.amountCents - 100));
});

test("assertStripeTestSecret rejects live keys", () => {
  assert.equal(assertStripeTestSecret("sk_test_abc123"), "sk_test_abc123");
  assert.throws(
    () => assertStripeTestSecret("sk_live_abc123"),
    (error: unknown) => error instanceof StripeModeError && error.code === "LIVE_KEY_REJECTED",
  );
});

test("checkout kill switch returns BOOKINGS_DISABLED", async () => {
  const env = { ...previewEnv, PAYMENTS_MODE: "test", BOOKINGS_ENABLED: "false", STRIPE_SECRET_KEY: "sk_test_x" } as unknown as Env;
  const response = await worker.fetch(jsonReq("http://bookings.test/api/bookings/checkout", payload(`kill-${Date.now()}`)), env);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "BOOKINGS_DISABLED");
});

test("bad webhook signature rejected (missing header)", async () => {
  const env = {
    PAYMENTS_MODE: "test",
    STRIPE_SECRET_KEY: "sk_test_abc",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    BOOKINGS_ENABLED: "true",
  } as unknown as Env;
  const response = await worker.fetch(
    new Request("http://bookings.test/api/stripe/webhook", { method: "POST", body: "{}" }),
    env,
  );
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(response.status, 400);
  assert.equal(data.code, "SIGNATURE");
});

test("TEST_ONLY_EMAIL_OVERRIDE applies only in PAYMENTS_MODE=test", async () => {
  const { resolveOutboundRecipient } = await import("./email");
  const intended = "synthetic.customer@example.com";
  const override = "hello@oldenshoreexcursions.com";

  const inTest = resolveOutboundRecipient(
    { PAYMENTS_MODE: "test", TEST_ONLY_EMAIL_OVERRIDE: override },
    intended,
  );
  assert.equal(inTest.to, override);
  assert.equal(inTest.overridden, true);

  const inLive = resolveOutboundRecipient(
    { PAYMENTS_MODE: "live", TEST_ONLY_EMAIL_OVERRIDE: override },
    intended,
  );
  assert.equal(inLive.to, intended);
  assert.equal(inLive.overridden, false);
});

test("Stripe Link disabled at Olden session level (checkout source)", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "routes/checkout.ts"), "utf8");
  assert.match(src, /payment_method_types:\s*\[\s*["']card["']\s*\]/);
  assert.match(src, /wallet_options:\s*\{[\s\S]*link:\s*\{\s*display:\s*["']never["']/);
});

test("no public cost leak or SEG in customer-facing email copy", () => {
  const product = findOldenBookingProduct(PRODUCT_ID)!;
  const brand = destinationBrandFromCore(oldenBookingCore);
  const email = requestedCustomerEmail({
    reference: "W2ODE-SECURE1",
    product,
    cruise: {
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 1, children: 0, infants: 0 },
    amountLabel: "EUR €96",
    customerName: "Alex",
    brand,
  });
  const blob = [email.subject, ...email.bodyLines, email.customerHeading ?? ""].join("\n");
  assert.doesNotMatch(blob, /\bSEG\b|Shore Excursions Group|adult_cost|child_cost|82|41|margin|GP\b/i);
});

test("internal product notes keep costs off public paths; no SEG in public paths", () => {
  for (const product of OLDEN_BOOKING_PRODUCTS) {
    const notes = (product.supplierReferenceNotes || []).join("\n");
    assert.match(notes, /DIRECT_SUPPLIER_MANUAL/);
    assert.match(notes, /adult_cost=82/);
    assert.doesNotMatch(product.productPath, /SEG|cost|82|41/i);
    assert.doesNotMatch(product.bookingPath, /SEG|cost|82|41/i);
    assert.doesNotMatch(notes, /\bSEG\b|SEG_MANUAL/i);
  }
});

test("production live code flag enabled in live-gate source", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "live-gate.ts"), "utf8");
  assert.match(src, /LIVE_PAYMENTS_CODE_ENABLED\s*=\s*true/);
  assert.doesNotMatch(src, /LIVE_PAYMENTS_CODE_ENABLED\s*=\s*false/);
});

test("service name is olden-bookings", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "index.ts"), "utf8");
  assert.match(src, /service:\s*["']olden-bookings["']/);
});

test("frontend commercial-config defaults to PRODUCTION_READY_LOCKED without TEST UI env", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(
    join(here, "../../../src/lib/booking/commercial-config.ts"),
    "utf8",
  );
  assert.match(src, /OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT\s*=\s*"PRODUCTION_READY_LOCKED"/);
  assert.match(src, /NEXT_PUBLIC_OLDEN_BOOKING_UI/);
  assert.match(src, /===\s*"test"/);
  assert.match(
    src,
    /OLDEN_TEST_BOOKINGS_API_URL/,
    /olden-bookings-test\.dark-violet-8d91\.workers\.dev/,
  );
  assert.match(src, /test_url_not_allowed_for_live/);
  assert.match(src, /missing_prod_api_url/);
  assert.match(src, /resolveOldenBookingsApiTarget/);
  assert.doesNotMatch(src, /sk_(test|live)_/);
  assert.doesNotMatch(src, /whsec_/);
});

test("package deploy/build scripts do not enable TEST booking UI", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(here, "../../../package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };
  assert.equal(pkg.scripts.build.includes("OLDEN_BOOKING_UI"), false);
  assert.equal(pkg.scripts.deploy.includes("OLDEN_BOOKING_UI"), false);
  assert.match(pkg.scripts["dev:booking-test"] || "", /NEXT_PUBLIC_OLDEN_BOOKING_UI=test/);
  assert.match(pkg.scripts["build:booking-test"] || "", /NEXT_PUBLIC_OLDEN_BOOKING_UI=test/);
});

test("TEST Worker SITE_BASE_URL is local-safe; prod wrangler keeps public domain", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const testCfg = readFileSync(join(here, "../wrangler.jsonc"), "utf8");
  const prodCfg = readFileSync(join(here, "../wrangler.prod.jsonc"), "utf8");
  assert.match(testCfg, /"SITE_BASE_URL":\s*"http:\/\/localhost:3000"/);
  assert.match(testCfg, /"EMAIL_SENDING_ENABLED":\s*"false"/);
  assert.match(testCfg, /"EMAIL_REPLY_TO":\s*"hello@oldenshoreexcursions\.com"/);
  assert.match(prodCfg, /"SITE_BASE_URL":\s*"https:\/\/oldenshoreexcursions\.com"/);
  assert.match(prodCfg, /"BOOKINGS_ENABLED":\s*"true"/);
  assert.match(prodCfg, /"EMAIL_SENDING_ENABLED":\s*"true"/);
  assert.match(prodCfg, /"EMAIL_REPLY_TO":\s*"hello@oldenshoreexcursions\.com"/);
  assert.doesNotMatch(prodCfg, /localhost:3000/);
});
