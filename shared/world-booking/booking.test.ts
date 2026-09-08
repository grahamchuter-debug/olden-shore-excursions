/**
 * Shared booking engine tests — Olden Phase O-2 (Briksdal Glacier & Olden Lake).
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  findOldenBookingProduct,
  OLDEN_BOOKING_PRODUCTS,
  OLDEN_CANCELLATION_COPY,
  formatOldenChildSeatRequestNotes,
} from "../destinations/olden-products";
import { oldenBookingCore } from "../destinations/olden";
import {
  assertClientTotalMatches,
  calculateBookingQuote,
  createBookingReference,
  destinationBrandFromCore,
  requestedCustomerEmail,
  statusAfterPaymentSuccess,
  supplierRequestEmail,
  validateCruise,
  validateCustomer,
} from "./index";

const brand = destinationBrandFromCore(oldenBookingCore);
const briksdal = findOldenBookingProduct("briksdal-glacier-olden-lake");
assert.ok(briksdal);

test("one Olden product ID present", () => {
  assert.equal(OLDEN_BOOKING_PRODUCTS.length, 1);
  assert.equal(OLDEN_BOOKING_PRODUCTS[0]!.id, "briksdal-glacier-olden-lake");
});

test("Briksdal EUR adult 96 child 56 infant 0", () => {
  assert.equal(briksdal!.pricing.model, "adult_child");
  assert.equal(briksdal!.pricing.currency, "EUR");
  assert.equal(briksdal!.pricing.adultAmount, 96);
  assert.equal(briksdal!.pricing.childAmount, 56);
  assert.equal(briksdal!.pricing.infantAmount, 0);
  assert.equal(briksdal!.pricing.infantPricingStatus, "priced");
  assert.equal(calculateBookingQuote(briksdal!, { adults: 1, children: 0, infants: 0 }).amountCents, 9600);
  assert.equal(calculateBookingQuote(briksdal!, { adults: 1, children: 1, infants: 0 }).amountCents, 15200);
  assert.equal(calculateBookingQuote(briksdal!, { adults: 1, children: 0, infants: 1 }).amountCents, 9600);
  assert.equal(calculateBookingQuote(briksdal!, { adults: 2, children: 1, infants: 1 }).amountCents, 24800);
});

test("adult required; infant free still requires adult", () => {
  assert.throws(() => calculateBookingQuote(briksdal!, { adults: 0, children: 1, infants: 0 }));
  assert.throws(() => calculateBookingQuote(briksdal!, { adults: 0, children: 0, infants: 1 }));
});

test("max 10 guests; zero party rejected", () => {
  assert.equal(briksdal!.capacity.maxGuestsPerBooking, 10);
  assert.doesNotThrow(() => calculateBookingQuote(briksdal!, { adults: 10, children: 0, infants: 0 }));
  assert.throws(() => calculateBookingQuote(briksdal!, { adults: 11, children: 0, infants: 0 }));
  assert.throws(() => calculateBookingQuote(briksdal!, { adults: 0, children: 0, infants: 0 }));
  assert.doesNotThrow(() => calculateBookingQuote(briksdal!, { adults: 5, children: 4, infants: 1 }));
  assert.throws(() => calculateBookingQuote(briksdal!, { adults: 5, children: 5, infants: 1 }));
});

test("client total must match server quote", () => {
  const quote = calculateBookingQuote(briksdal!, { adults: 2, children: 0, infants: 0 });
  assert.doesNotThrow(() => assertClientTotalMatches(quote, 19200));
  assert.throws(() => assertClientTotalMatches(quote, 1));
});

test("payment success status is requested not confirmed", () => {
  assert.equal(statusAfterPaymentSuccess("request"), "requested");
});

test("booking references use Olden W2ODE prefix", () => {
  assert.match(createBookingReference(oldenBookingCore), /^W2ODE-/);
  assert.equal(oldenBookingCore.bookingRefPrefix, "W2ODE");
});

test("customer and cruise validation", () => {
  assert.equal(
    validateCustomer({ name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" }),
    null,
  );
  assert.ok(validateCustomer({ name: "A", email: "x", phone: "1" }));
  assert.ok(validateCustomer({ name: "Alex Traveller", email: "bad", phone: "+447700900123" }));
  assert.ok(
    validateCruise({
      date: "nope",
      shipName: "Ship",
      shipSlug: "s",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    }),
  );
  assert.ok(
    validateCruise({
      date: "2020-01-01",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    }),
  );
  assert.equal(
    validateCruise({
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    }),
    null,
  );
});

test("48-hour cancellation copy", () => {
  assert.match(OLDEN_CANCELLATION_COPY.customerCancellation, /48 hours/);
  assert.doesNotMatch(OLDEN_CANCELLATION_COPY.customerCancellation, /14 days/);
  assert.match(OLDEN_CANCELLATION_COPY.unableToConfirm, /full refund/i);
  assert.match(OLDEN_CANCELLATION_COPY.shipMissOlden, /Olden/i);
  assert.match(OLDEN_CANCELLATION_COPY.paymentNotConfirmation, /not.*confirmed/i);
});

test("customer requested email is not confirmation and leaks no costs/SEG", () => {
  const email = requestedCustomerEmail({
    reference: "W2ODE-TESTREF1",
    product: briksdal!,
    cruise: {
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 2, children: 0, infants: 0 },
    amountLabel: "EUR €192",
    customerName: "Alex",
    brand,
  });
  assert.match(email.subject, /request/i);
  assert.doesNotMatch(email.subject, /confirmed/i);
  const body = email.bodyLines.join("\n");
  assert.match(body, /not confirmed/i);
  assert.doesNotMatch(body, /\bSEG\b|Shore Excursions Group|adult_cost|child_cost|Norway Excursions/i);
});

test("ops request email includes product and contact", () => {
  const email = supplierRequestEmail({
    reference: "W2ODE-TESTREF1",
    product: briksdal!,
    cruise: {
      date: "2027-06-10",
      shipName: "Regal Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 2, children: 0, infants: 0 },
    customer: { name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" },
    amountLabel: "EUR €192",
    operationalNotes: "Walking suitability acknowledged",
    destinationLabel: "Olden Shore Excursions — new booking request",
  });
  assert.match(email.subject, /W2ODE-TESTREF1/);
  assert.match(email.shell.destinationLabel, /Olden/i);
});

test("request mode live catalogue for Briksdal", () => {
  assert.equal(briksdal!.bookingMode, "request");
  assert.equal(briksdal!.availability, "live");
  assert.equal(briksdal!.pricing.currency, "EUR");
  assert.equal(briksdal!.paymentSettlement, "charge_refund");
});

test("child seat notes helper formats structured operational text", () => {
  const notes = formatOldenChildSeatRequestNotes([
    { required: true, ageYears: 4, weightKg: 18, heightCm: 105, notes: "booster preferred" },
  ]);
  assert.match(notes, /Child seat/);
  assert.match(notes, /age 4y/);
  assert.match(notes, /weight 18 kg/);
});
