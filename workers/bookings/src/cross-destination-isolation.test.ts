/**
 * Cross-destination isolation + Olden live-gate hardness (Phase O-2 gate).
 * Proves client-supplied destination/product IDs cannot cross price authority.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import worker from "./index";
import {
  LIVE_PAYMENTS_CODE_ENABLED,
  LIVE_UNLOCK_PHRASE,
  liveCheckoutBlock,
  bookingsAreEnabled,
} from "./live-gate";
import { findOldenBookingProduct, formatOldenChildSeatRequestNotes } from "../../../shared/destinations/olden-products";
import { findBelizeBookingProduct } from "../../../shared/destinations/belize-regression";
import { calculateBookingQuote, assertClientTotalMatches } from "../../../shared/world-booking";

const previewEnv = {
  PAYMENTS_MODE: "preview",
  BOOKINGS_ENABLED: "true",
  CORS_ALLOWED_ORIGINS: "http://localhost:3000",
  SITE_BASE_URL: "http://localhost:3000",
} as unknown as Env;

function oldenPayload(overrides: Record<string, unknown> = {}) {
  const product = findOldenBookingProduct("briksdal-glacier-olden-lake")!;
  const guests = (overrides.guests as { adults: number; children: number; infants: number } | undefined) ?? {
    adults: 2,
    children: 0,
    infants: 0,
  };
  const quote = calculateBookingQuote(product, guests);
  return {
    productId: "briksdal-glacier-olden-lake",
    bookingSessionId: `iso-${Date.now()}-${Math.random()}`,
    guests,
    customer: {
      name: "Alex Traveller",
      email: "alex@example.com",
      phone: "+447700900123",
    },
    cruise: {
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    confirmationAcknowledged: true,
    eligibilityAcknowledged: true,
    clientDisplayedTotalCents: quote.amountCents,
    ...overrides,
  };
}

function jsonReq(path: string, body: unknown) {
  return new Request(`http://bookings.test${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("LIVE_PAYMENTS_CODE_ENABLED remains false on Olden Worker", () => {
  assert.equal(LIVE_PAYMENTS_CODE_ENABLED, false);
  assert.equal(LIVE_UNLOCK_PHRASE, "OLDEN_LIVE_UNLOCK");
});

test("live Checkout blocked even if BOOKINGS_ENABLED=true, PAYMENTS_MODE=live, live-format key present", () => {
  const product = findOldenBookingProduct("briksdal-glacier-olden-lake")!;
  const block = liveCheckoutBlock(
    {
      PAYMENTS_MODE: "live",
      BOOKINGS_ENABLED: "true",
      LIVE_PAYMENTS_UNLOCK: "OLDEN_LIVE_UNLOCK",
      STRIPE_SECRET_KEY: "sk_live_FAKE_NOT_A_REAL_SECRET",
      STRIPE_WEBHOOK_SECRET: "whsec_FAKE",
      SITE_BASE_URL: "https://oldenshoreexcursions.com",
      DB: {} as D1Database,
    },
    product,
  );
  assert.ok(block);
  assert.equal(block!.code, "LIVE_PAYMENTS_BLOCKED");
});

test("live Checkout Worker path rejects when PAYMENTS_MODE=live while code flag false", async () => {
  const env = {
    ...previewEnv,
    PAYMENTS_MODE: "live",
    BOOKINGS_ENABLED: "true",
    LIVE_PAYMENTS_UNLOCK: "OLDEN_LIVE_UNLOCK",
    STRIPE_SECRET_KEY: "sk_live_FAKE_NOT_A_REAL_SECRET",
    STRIPE_WEBHOOK_SECRET: "whsec_FAKE",
    SITE_BASE_URL: "https://oldenshoreexcursions.com",
  } as unknown as Env;
  const response = await worker.fetch(jsonReq("/api/bookings/checkout", oldenPayload()), env);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "LIVE_PAYMENTS_BLOCKED");
});

test("BOOKINGS_ENABLED=false still kills checkout even in test mode", async () => {
  assert.equal(bookingsAreEnabled({ BOOKINGS_ENABLED: "false" }), false);
  const env = {
    ...previewEnv,
    PAYMENTS_MODE: "test",
    BOOKINGS_ENABLED: "false",
    STRIPE_SECRET_KEY: "sk_test_x",
  } as unknown as Env;
  const response = await worker.fetch(jsonReq("/api/bookings/checkout", oldenPayload()), env);
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "BOOKINGS_DISABLED");
});

test("Olden Worker rejects Belize product IDs (no cross-destination price)", async () => {
  const belizeIds = [
    "belize-cave-tubing",
    "turtle-snorkel-and-island-time",
    "altun-ha-and-belize-city-overview",
  ];
  for (const productId of belizeIds) {
    const belizeProduct = findBelizeBookingProduct(productId)!;
    const quote = calculateBookingQuote(belizeProduct, { adults: 1, children: 0, infants: 0 });
    const response = await worker.fetch(
      jsonReq(
        "/api/bookings/request",
        oldenPayload({
          productId,
          clientDisplayedTotalCents: quote.amountCents,
          eligibilityAcknowledged: true,
        }),
      ),
      previewEnv,
    );
    const data = (await response.json()) as { ok: boolean; code: string };
    assert.equal(data.ok, false, `expected reject for ${productId}`);
    assert.equal(data.code, "UNKNOWN_PRODUCT");
  }
});

test("client cannot force Belize USD amount onto Olden Briksdal quote", () => {
  const olden = findOldenBookingProduct("briksdal-glacier-olden-lake")!;
  const quote = calculateBookingQuote(olden, { adults: 1, children: 0, infants: 0 });
  assert.equal(quote.currency, "EUR");
  assert.equal(quote.amountCents, 9600);
  assert.throws(() => assertClientTotalMatches(quote, 8600));
  assert.doesNotThrow(() => assertClientTotalMatches(quote, 9600));
});

test("client currency/amount fields ignored; server EUR pricing wins", async () => {
  const response = await worker.fetch(
    jsonReq(
      "/api/bookings/request",
      oldenPayload({
        currency: "USD",
        amountCents: 8600,
        unitPrice: 86,
        successUrl: "https://evil.example/success",
        cancelUrl: "https://evil.example/cancel",
      }),
    ),
    previewEnv,
  );
  const data = (await response.json()) as {
    ok: boolean;
    reference?: string;
    status?: string;
    code?: string;
  };
  assert.equal(data.ok, true);
  assert.match(data.reference ?? "", /^W2ODE-/);
  assert.equal(data.status, "requested");
});

test("tampered client total rejected even with Belize cents", async () => {
  const response = await worker.fetch(
    jsonReq("/api/bookings/request", oldenPayload({ clientDisplayedTotalCents: 8600 })),
    previewEnv,
  );
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "PRICE");
});

test("Olden requires eligibilityAcknowledged (walking) — cannot skip", async () => {
  const response = await worker.fetch(
    jsonReq("/api/bookings/request", oldenPayload({ eligibilityAcknowledged: false })),
    previewEnv,
  );
  const data = (await response.json()) as { ok: boolean; code: string };
  assert.equal(data.ok, false);
  assert.equal(data.code, "ELIGIBILITY");
});

test("Olden infant 0–2 remains free and does not inherit Belize infant bans", () => {
  const olden = findOldenBookingProduct("briksdal-glacier-olden-lake")!;
  assert.equal(olden.pricing.infantAmount, 0);
  assert.equal(olden.pricing.infantPricingStatus, "priced");
  assert.equal(
    calculateBookingQuote(olden, { adults: 1, children: 0, infants: 2 }).amountCents,
    9600,
  );

  const turtle = findBelizeBookingProduct("turtle-snorkel-and-island-time")!;
  assert.equal(turtle.pricing.infantPricingStatus, "not_sold");
  assert.throws(() => calculateBookingQuote(turtle, { adults: 1, children: 0, infants: 1 }));
});

test("Olden child-seat request is operationalNotes only", async () => {
  const seatNotes = formatOldenChildSeatRequestNotes([
    { required: true, ageYears: 5, weightKg: 20, heightCm: 110, notes: "booster preferred" },
  ]);
  assert.match(seatNotes, /Child seat \/ booster request/);
  const guests = { adults: 1, children: 1, infants: 0 };
  const response = await worker.fetch(
    jsonReq(
      "/api/bookings/request",
      oldenPayload({
        guests,
        clientDisplayedTotalCents: calculateBookingQuote(
          findOldenBookingProduct("briksdal-glacier-olden-lake")!,
          guests,
        ).amountCents,
        customer: {
          name: "Alex Traveller",
          email: "alex@example.com",
          phone: "+447700900123",
          operationalNotes: seatNotes,
        },
      }),
    ),
    previewEnv,
  );
  const data = (await response.json()) as { ok: boolean; reference?: string };
  assert.equal(data.ok, true);
  assert.match(data.reference ?? "", /^W2ODE-/);
});

test("Belize cannot inherit Olden eligibility walking requirement via product resolution", () => {
  const turtle = findBelizeBookingProduct("turtle-snorkel-and-island-time")!;
  assert.ok(turtle);
  assert.equal(findOldenBookingProduct(turtle.id), undefined);
});
