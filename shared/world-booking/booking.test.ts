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
  confirmedCustomerEmail,
  createBookingReference,
  declinedCustomerEmail,
  destinationBrandFromCore,
  renderCustomerBookingEmailText,
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
    operationalNotes: "Walking suitability acknowledged: yes",
    destinationLabel: "Olden Shore Excursions — new booking request",
    stripeCheckoutSessionId: "cs_test_example",
    stripePaymentIntentId: "pi_test_example",
  });
  assert.match(email.subject, /W2ODE-TESTREF1/);
  assert.match(email.shell.destinationLabel, /Olden/i);
  assert.match(email.body, /DIRECT_SUPPLIER_MANUAL/);
  assert.match(email.body, /Walking suitability acknowledged/);
  assert.match(email.body, /cs_test_example/);
  assert.doesNotMatch(email.body, /SEG affiliate|white-label route|send the customer to SEG/i);
  assert.doesNotMatch(email.body, /Belize|W2BZE/i);
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

test("requested email avoids brand-name greeting and remains not confirmed", () => {
  const email = requestedCustomerEmail({
    reference: "W2ODE-O6PREV1",
    product: briksdal!,
    cruise: {
      date: "2027-07-15",
      shipName: "Sky Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 1, children: 1, infants: 0 },
    amountLabel: "EUR €152",
    customerName: "Olden Frontend Test",
    brand,
  });
  const body = email.bodyLines.join("\n");
  assert.doesNotMatch(body, /Thanks Olden/i);
  assert.match(body, /not confirmed/i);
  assert.match(email.shell.statusLabel, /Awaiting confirmation/i);
  assert.doesNotMatch(email.shell.statusLabel, /^Confirmed$/i);
  assert.match(body, /W2ODE-O6PREV1/);
  assert.match(body, /EUR €152|€152/);
  assert.doesNotMatch(body, /Belize|W2BZE|SEG/i);
  assert.equal(email.shell.eyebrow, "Olden Shore Excursions");
});

test("confirmed email uses confirmed language only for confirmed template", () => {
  const email = confirmedCustomerEmail({
    reference: "W2ODE-O6CONF1",
    product: briksdal!,
    cruise: {
      date: "2027-07-15",
      shipName: "Sky Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 1, children: 0, infants: 0 },
    amountLabel: "EUR €96",
    customerName: "Alex Traveller",
    meetingInstructions: OLDEN_CANCELLATION_COPY.meetingInstructions,
    brand,
  });
  const body = email.bodyLines.join("\n");
  assert.match(email.subject, /confirmed/i);
  assert.equal(email.shell.headline, "Your excursion is confirmed");
  assert.equal(email.shell.statusTone, "confirmed");
  assert.match(email.shell.statusLabel, /^Confirmed$/i);
  assert.match(body, /places are confirmed/i);
  assert.match(body, /tour ticket/i);
  assert.match(body, /meeting instructions.*sent separately|sent separately/i);
  assert.doesNotMatch(body, /Belize|SEG|Norway Excursions|voucher|emergency|pickup time|meeting point:/i);
  assert.equal(email.shell.eyebrow, "Olden Shore Excursions");
});

test("O-10F confirmed email does not invent joining details or supplier internals", () => {
  const email = confirmedCustomerEmail({
    reference: "W2ODE-O10F-CONF",
    product: briksdal!,
    cruise: {
      date: "2027-07-15",
      shipName: "Sky Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 2, children: 0, infants: 0 },
    amountLabel: "EUR €192",
    customerName: "Alex Traveller",
    meetingInstructions: OLDEN_CANCELLATION_COPY.meetingInstructions,
    brand,
  });
  const rendered = renderCustomerBookingEmailText(email.shell);
  assert.match(rendered, /Your excursion is confirmed/);
  assert.match(rendered, /Your tour ticket, including your meeting instructions, will be sent separately/);
  assert.doesNotMatch(rendered, /SEG|Norway Excursions|adult_cost|info@wowatour\.com|fulfilment_mode/i);
  assert.doesNotMatch(rendered, /emergency (number|phone)|what to bring|voucher code|pickup at/i);
});

test("unable-to-confirm email apologises and refunds without customer-cancel blame", () => {
  const email = declinedCustomerEmail({
    reference: "W2ODE-O6DECL1",
    product: briksdal!,
    cruise: {
      date: "2027-07-15",
      shipName: "Sky Princess",
      shipSlug: "not-listed",
      cruiseLine: "",
      isCustomShip: true,
      scheduleMatched: false,
    },
    guests: { adults: 1, children: 0, infants: 0 },
    amountLabel: "EUR €96",
    customerName: "Alex Traveller",
    refundState: "refund_pending",
    brand,
  });
  const body = email.bodyLines.join("\n");
  assert.match(email.subject, /request/i);
  assert.doesNotMatch(email.subject, /confirmed/i);
  assert.match(body, /could not confirm|couldn't confirm/i);
  assert.match(body, /full refund|refunded|initiated a full refund/i);
  assert.doesNotMatch(body, /you cancelled|your cancellation|SEG|Belize/i);
  const text = renderCustomerBookingEmailText(email.shell);
  assert.match(text, /^Need help\?$/m);
  assert.doesNotMatch(text, /Need help with your request\?/i);
  assert.match(text, /hello@oldenshoreexcursions\.com/);
  assert.doesNotMatch(text, /info@wowatour\.com|adult_cost|Norway Excursions/i);
});

test("Olden ops_request routes to info@wowatour.com; customer Reply-To identity stays hello@", () => {
  assert.equal(briksdal!.supplier.notificationEmail, "info@wowatour.com");
  assert.equal(oldenBookingCore.bookingEmail, "hello@oldenshoreexcursions.com");

  const cruise = {
    date: "2027-07-15",
    shipName: "Sky Princess",
    shipSlug: "not-listed",
    cruiseLine: "",
    isCustomShip: true,
    scheduleMatched: false,
  } as const;
  const guests = { adults: 1, children: 0, infants: 0 };

  for (const email of [
    requestedCustomerEmail({
      reference: "W2ODE-O6B-RT",
      product: briksdal!,
      cruise,
      guests,
      amountLabel: "EUR €96",
      customerName: "Alex Traveller",
      brand,
    }),
    confirmedCustomerEmail({
      reference: "W2ODE-O6B-RT",
      product: briksdal!,
      cruise,
      guests,
      amountLabel: "EUR €96",
      customerName: "Alex Traveller",
      brand,
    }),
    declinedCustomerEmail({
      reference: "W2ODE-O6B-RT",
      product: briksdal!,
      cruise,
      guests,
      amountLabel: "EUR €96",
      customerName: "Alex Traveller",
      refundState: "refunded",
      brand,
    }),
  ]) {
    const rendered = renderCustomerBookingEmailText(email.shell);
    assert.match(rendered, /hello@oldenshoreexcursions\.com/);
    assert.doesNotMatch(rendered, /info@wowatour\.com/);
    assert.doesNotMatch(rendered, /adult_cost|child_cost|Norway Excursions|fulfilment_mode/i);
  }

  const ops = supplierRequestEmail({
    reference: "W2ODE-O6B-RT",
    product: briksdal!,
    cruise,
    guests,
    customer: { name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" },
    amountLabel: "EUR €96",
    destinationLabel: "Olden Shore Excursions — new booking request",
  });
  assert.match(ops.body, /DIRECT_SUPPLIER_MANUAL/);
  assert.doesNotMatch(ops.body, /SEG affiliate/i);
});

