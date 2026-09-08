/**
 * Belize product/pricing/business-rule regression against fixtures copied from
 * the live Belize repo. Does NOT mount Belize into the Olden Worker.
 *
 * Authority: shared/destinations/belize*.ts (regression fixtures).
 * Belize production Worker remains in Caribbean-World-2.0/Belize-Shore-Excursion.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  BELIZE_BOOKING_PRODUCTS,
  BELIZE_CANCELLATION_COPY,
  belizeBookingCore,
  findBelizeBookingProduct,
} from "../../../shared/destinations/belize-regression";
import {
  calculateBookingQuote,
  createBookingReference,
  destinationBrandFromCore,
  requestedCustomerEmail,
  statusAfterPaymentSuccess,
  supplierRequestEmail,
} from "../../../shared/world-booking";
import { findOldenBookingProduct } from "../../../shared/destinations/olden-products";
import { formatOldenChildSeatRequestNotes } from "../../../shared/destinations/olden-products";

const brand = destinationBrandFromCore(belizeBookingCore);
const cave = findBelizeBookingProduct("belize-cave-tubing");
const turtle = findBelizeBookingProduct("turtle-snorkel-and-island-time");
const altun = findBelizeBookingProduct("altun-ha-and-belize-city-overview");

test("Belize product IDs still resolve (three RTB products)", () => {
  assert.ok(cave);
  assert.ok(turtle);
  assert.ok(altun);
  assert.equal(BELIZE_BOOKING_PRODUCTS.length, 3);
  assert.deepEqual(
    BELIZE_BOOKING_PRODUCTS.map((p) => p.id).sort(),
    ["altun-ha-and-belize-city-overview", "belize-cave-tubing", "turtle-snorkel-and-island-time"].sort(),
  );
});

test("Belize prices remain USD 86 / 115·85 / 89·79", () => {
  assert.equal(cave!.pricing.currency, "USD");
  assert.equal(cave!.pricing.model, "flat_per_guest");
  assert.equal(calculateBookingQuote(cave!, { adults: 1, children: 0, infants: 0 }).amountCents, 8600);
  assert.equal(calculateBookingQuote(cave!, { adults: 2, children: 0, infants: 0 }).amountCents, 17200);

  assert.equal(turtle!.pricing.currency, "USD");
  assert.equal(turtle!.pricing.adultAmount, 115);
  assert.equal(turtle!.pricing.childAmount, 85);
  assert.equal(turtle!.pricing.infantPricingStatus, "not_sold");
  assert.equal(calculateBookingQuote(turtle!, { adults: 1, children: 1, infants: 0 }).amountCents, 20000);
  assert.throws(() => calculateBookingQuote(turtle!, { adults: 1, children: 0, infants: 1 }));

  assert.equal(altun!.pricing.adultAmount, 89);
  assert.equal(altun!.pricing.childAmount, 79);
  assert.equal(altun!.pricing.infantPricingStatus, "not_sold");
});

test("Belize age bands / capacity remain unchanged", () => {
  assert.equal(cave!.ageBands.find((b) => b.id === "adult")?.minAge, 8);
  assert.equal(turtle!.ageBands.find((b) => b.id === "adult")?.minAge, 12);
  assert.equal(turtle!.ageBands.find((b) => b.id === "child")?.minAge, 6);
  assert.equal(altun!.ageBands.find((b) => b.id === "adult")?.minAge, 11);
  assert.equal(altun!.ageBands.find((b) => b.id === "child")?.minAge, 4);
  for (const p of BELIZE_BOOKING_PRODUCTS) {
    assert.equal(p.capacity.maxGuestsPerBooking, 10);
    assert.equal(p.bookingMode, "request");
    assert.equal(p.paymentSettlement, "charge_refund");
  }
});

test("Belize destination core prefix and currency unchanged", () => {
  assert.equal(belizeBookingCore.bookingRefPrefix, "W2BZE");
  assert.equal(belizeBookingCore.currencyCode, "USD");
  assert.equal(belizeBookingCore.siteHostname, "belizeshoreexcursion.com");
  assert.match(createBookingReference(belizeBookingCore), /^W2BZE-/);
});

test("Belize cancellation copy remains 14-day window (not Olden 48h)", () => {
  assert.match(BELIZE_CANCELLATION_COPY.customerCancellation, /14 days/i);
  assert.doesNotMatch(BELIZE_CANCELLATION_COPY.customerCancellation, /48 hours/i);
});

test("Belize payment success remains requested not confirmed", () => {
  assert.equal(statusAfterPaymentSuccess("request"), "requested");
  assert.notEqual(statusAfterPaymentSuccess("request"), "confirmed");
});

test("Belize customer email brand and no Olden leakage", () => {
  const email = requestedCustomerEmail({
    brand,
    product: cave!,
    reference: "W2BZE-REGTEST1",
    cruise: {
      date: "2026-11-15",
      shipName: "Test Ship",
      shipSlug: "test-ship",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 2, children: 0, infants: 0 },
    amountLabel: "USD $172",
    customerName: "Alex",
  });
  assert.match(email.subject, /request/i);
  assert.match(email.shell.eyebrow ?? "", /Belize/i);
  const body = email.bodyLines.join("\n");
  assert.match(body, /W2BZE-REGTEST1/);
  assert.doesNotMatch(body, /Olden|Briksdal|W2ODE|48 hours|child seat|booster/i);
  assert.doesNotMatch(body, /\bSEG\b|adult_cost|gross profit|€82/i);
});

test("Belize ops email routing stays Wow A Tour / Belize branded", () => {
  const email = supplierRequestEmail({
    product: cave!,
    reference: "W2BZE-REGTEST1",
    cruise: {
      date: "2026-11-15",
      shipName: "Test Ship",
      shipSlug: "test-ship",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 1, children: 0, infants: 0 },
    amountLabel: "USD $86",
    customer: { name: "Alex", email: "alex@example.com", phone: "+15551212" },
    destinationLabel: "Belize Shore Excursions — new booking request",
  });
  assert.match(email.subject, /W2BZE-REGTEST1/);
  assert.match(email.shell.destinationLabel, /Belize/i);
  assert.equal(cave!.supplier.notificationEmail, "info@wowatour.com");
  assert.doesNotMatch(email.body, /hello@oldenshoreexcursions\.com|Briksdal|W2ODE/i);
});

test("Belize finder cannot resolve Olden product IDs", () => {
  assert.equal(findBelizeBookingProduct("briksdal-glacier-olden-lake"), undefined);
  assert.equal(findBelizeBookingProduct("olden"), undefined);
});

test("Olden finder cannot resolve Belize product IDs", () => {
  assert.equal(findOldenBookingProduct("belize-cave-tubing"), undefined);
  assert.equal(findOldenBookingProduct("turtle-snorkel-and-island-time"), undefined);
  assert.equal(findOldenBookingProduct("altun-ha-and-belize-city-overview"), undefined);
});

test("Belize products do not inherit Olden child-seat notes helper as a required field", () => {
  for (const p of BELIZE_BOOKING_PRODUCTS) {
    assert.ok(!("childSeatRequired" in p));
    assert.ok(!JSON.stringify(p.pendingCommercialRules).includes("formatOldenChildSeatRequestNotes"));
  }
  // Helper exists for Olden only; calling it does not attach to Belize products.
  const notes = formatOldenChildSeatRequestNotes([{ required: true, ageYears: 4, weightKg: 18, heightCm: 100 }]);
  assert.match(notes, /Child seat/);
  assert.equal(cave!.requiredCustomerFields.includes("name"), true);
});

test("Olden Worker routes must not import Belize product finder", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const roots = [
    join(here, "index.ts"),
    join(here, "notify.ts"),
    join(here, "operator-actions.ts"),
    join(here, "routes/checkout.ts"),
    join(here, "routes/operator-review.ts"),
  ];
  for (const file of roots) {
    const src = readFileSync(file, "utf8");
    assert.doesNotMatch(src, /findBelizeBookingProduct|belize-products|belize-regression/);
    assert.match(src, /findOldenBookingProduct/);
  }
});
