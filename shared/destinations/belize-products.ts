import { belizeBookingCore } from "./belize";
import type { AgeBand, BookableProductConfig, ProductCapacity, ProductPricing } from "../world-booking/types";

/**
 * Operational routing: Wow A Tour ops mailbox for Graham’s manual fulfilment.
 * Public customers never see SEG. Graham places corresponding bookings via his
 * established SEG affiliate / white-label account using INTERNAL supply refs only.
 */
const OPERATIONS = {
  id: "wow-a-tour-operations",
  displayName: "Wow A Tour",
  notificationEmail: "info@wowatour.com",
  routingStatus: "production_ready" as const,
};

const REQUEST_SETTLEMENT = "charge_refund" as const;

/** Graham online max — never describe as supplier / vehicle / boat capacity. */
const BELIZE_CAPACITY: ProductCapacity = {
  minGuests: 1,
  maxGuestsPerBooking: 10,
  maxGuestsPerBookingSource: "approved",
  supplierGroupSize: null,
  maxGuestsPerGuide: null,
};

/** Cave tubing — single individual rate; infants not permitted. */
const CAVE_AGE_BANDS: readonly AgeBand[] = [
  { id: "adult", label: "Guests (8+ / 48\"+)", minAge: 8, maxAge: null, pricingStatus: "priced" },
  { id: "child", label: "Children", minAge: null, maxAge: null, pricingStatus: "not_sold" },
  { id: "infant", label: "Infants", minAge: 0, maxAge: 7, pricingStatus: "not_sold" },
];

/** Turtle snorkel — Adult 12+, Child 6–11; infants not permitted. */
const TURTLE_AGE_BANDS: readonly AgeBand[] = [
  { id: "adult", label: "Adults (12+)", minAge: 12, maxAge: null, pricingStatus: "priced" },
  { id: "child", label: "Children (6–11)", minAge: 6, maxAge: 11, pricingStatus: "priced" },
  { id: "infant", label: "Infants (under 6)", minAge: 0, maxAge: 5, pricingStatus: "not_sold" },
];

/** Altun Ha — Adult 11+, Child 4–10; no under-4 online band. */
const ALTUN_AGE_BANDS: readonly AgeBand[] = [
  { id: "adult", label: "Adults (11+)", minAge: 11, maxAge: null, pricingStatus: "priced" },
  { id: "child", label: "Children (4–10)", minAge: 4, maxAge: 10, pricingStatus: "priced" },
  { id: "infant", label: "Under 4", minAge: 0, maxAge: 3, pricingStatus: "not_sold" },
];

function flatGuestUsd(amount: number): ProductPricing {
  return {
    model: "flat_per_guest",
    currency: "USD",
    pricePerGuest: amount,
    adultAmount: amount,
    childAmount: null,
    childPricingStatus: "not_sold",
    infantAmount: null,
    infantPricingStatus: "not_sold",
    pricingNeedsConfirmation: false,
  };
}

function adultChildUsd(adultAmount: number, childAmount: number): ProductPricing {
  return {
    model: "adult_child",
    currency: "USD",
    adultAmount,
    childAmount,
    childPricingStatus: "priced",
    infantAmount: null,
    infantPricingStatus: "not_sold",
    pricingNeedsConfirmation: false,
  };
}

const SHARED_PENDING = [
  "Customer cancellation APPROVED: free up to 14 days before excursion; within 14 days non-refundable.",
  "Unable to confirm after payment: full refund to original payment method.",
  "Meeting: exact instructions after confirmation.",
  "Fulfilment: Graham places corresponding booking via established SEG affiliate / white-label route (INTERNAL).",
  "Payment received ≠ excursion confirmed.",
  "Online max 10 guests per booking (Graham online limit — not supplier capacity).",
  "LIVE_PAYMENTS_CODE_ENABLED true from Phase 13G Graham unlock (request-to-book).",
  "commercial_status=SEG_FULFILMENT_READY · fulfilment_mode=SEG_MANUAL · supplier=UNKNOWN · direct_supplier_status=NOT_CONTACTED · net_cost=UNKNOWN · margin=UNKNOWN",
] as const;

export const BELIZE_CANCELLATION_COPY = {
  customerCancellation:
    "Free cancellation up to 14 days before your excursion. Cancellations made within 14 days of departure are non-refundable. If we are unable to confirm your excursion after payment, you will receive a full refund to your original payment method.",
  freeWindow: "Free cancellation up to 14 days before your excursion.",
  insideWindow: "Cancellations made within 14 days of departure are non-refundable.",
  unableToConfirm:
    "If we are unable to confirm your excursion after payment, you will receive a full refund to your original payment method.",
  paymentNotConfirmation:
    "After payment, we'll arrange your excursion and send your confirmation as soon as it is confirmed. Payment does not mean the excursion is confirmed yet.",
  meetingInstructions: "Meeting instructions will be provided with your confirmed excursion details.",
  overTenGuidance: "For groups larger than 10, email hello@belizeshoreexcursion.com before requesting.",
} as const;

const CAVE: BookableProductConfig = {
  id: "belize-cave-tubing",
  destinationId: belizeBookingCore.id,
  slug: "belize-cave-tubing",
  name: "Belize Cave Tubing",
  durationLabel: "About 5 hours",
  bookingMode: "request",
  availability: "live",
  bookingPath: "/book/belize-cave-tubing",
  receivedPath: "/book/belize-cave-tubing/received",
  confirmedPath: "/book/belize-cave-tubing/received",
  productPath: "/belize-cave-tubing.html",
  pricing: flatGuestUsd(86),
  ageBands: CAVE_AGE_BANDS,
  capacity: BELIZE_CAPACITY,
  requiredCustomerFields: ["name", "email", "phone"],
  supplier: OPERATIONS,
  paymentSettlement: REQUEST_SETTLEMENT,
  schedulePortSlug: "belize",
  pendingCommercialRules: [
    ...SHARED_PENDING,
    "Individual USD 86 · Infants NOT permitted · min age 8 · min height 48 inches",
    "Shared excursion (SEG Standard) — do not publish Small Group or guaranteed 20–50 capacity",
    "Physical: ~30-min loose-gravel walk, river wading rocky bottom, fitness required; neck/back/hip / pregnant should not participate",
    "Accessibility: do not claim wheelchair either way (SEG silent)",
    "Inclusions: guide, AC transport, tube, miner's lamp, ~2hr cave float. Food/drink NOT included.",
    "Meeting: Cruise Ship Tender Pier; exact instructions after confirmation",
    "Ack required: all participants ≥8 years and ≥48 inches tall; booking contact must be adult",
  ],
  supplierReferenceNotes: [
    "INTERNAL SUPPLY: SEG_MANUAL · CABZTUBE",
    "INTERNAL CODE: CABZTUBE",
    "Supplier contact: UNKNOWN · NOT_CONTACTED · net/margin UNKNOWN",
    "Fulfilment: place via established SEG affiliate / white-label route (manual — do not automate).",
    "Selling: USD 86 each eligible guest · no child discount · infants not permitted.",
    "Customer cancellation: Free cancellation up to 14 days before your excursion. Cancellations made within 14 days of departure are non-refundable.",
    "Unable to confirm after payment: full refund to original payment method.",
  ],
};

const TURTLE: BookableProductConfig = {
  id: "turtle-snorkel-and-island-time",
  destinationId: belizeBookingCore.id,
  slug: "turtle-snorkel-and-island-time",
  name: "Turtle Snorkel and Island Time",
  durationLabel: "About 5 hours",
  bookingMode: "request",
  availability: "live",
  bookingPath: "/book/turtle-snorkel-and-island-time",
  receivedPath: "/book/turtle-snorkel-and-island-time/received",
  confirmedPath: "/book/turtle-snorkel-and-island-time/received",
  productPath: "/turtle-snorkel-and-island-time.html",
  pricing: adultChildUsd(115, 85),
  ageBands: TURTLE_AGE_BANDS,
  capacity: BELIZE_CAPACITY,
  requiredCustomerFields: ["name", "email", "phone"],
  supplier: OPERATIONS,
  paymentSettlement: REQUEST_SETTLEMENT,
  schedulePortSlug: "belize",
  pendingCommercialRules: [
    ...SHARED_PENDING,
    "Adult USD 115 (12+) · Child USD 85 (6–11) · Infants NOT permitted · require ≥1 adult",
    "Under 12: life jacket + accompanied by adult",
    "Shared excursion · NOT wheelchair accessible · must step vehicle, climb boat, swim",
    "Meeting: ~2-min walk from tender pier",
    "Inclusions: two snorkel sites, ~90 min water time, Caye Caulker island time. Lunch not included. Wildlife never guaranteed.",
    "Do not over-emphasise manatees.",
  ],
  supplierReferenceNotes: [
    "INTERNAL SUPPLY: SEG_MANUAL · CABZTURTLE",
    "INTERNAL CODE: CABZTURTLE",
    "Supplier contact: UNKNOWN · NOT_CONTACTED · net/margin UNKNOWN",
    "Fulfilment: place via established SEG affiliate / white-label route (manual — do not automate).",
    "Selling: Adult USD 115 · Child USD 85 · infants not permitted.",
    "Customer cancellation: Free cancellation up to 14 days before your excursion. Cancellations made within 14 days of departure are non-refundable.",
    "Unable to confirm after payment: full refund to original payment method.",
  ],
};

const ALTUN: BookableProductConfig = {
  id: "altun-ha-and-belize-city-overview",
  destinationId: belizeBookingCore.id,
  slug: "altun-ha-and-belize-city-overview",
  name: "Altun-Ha and Belize City Overview",
  durationLabel: "About 4 hours",
  bookingMode: "request",
  availability: "live",
  bookingPath: "/book/altun-ha-and-belize-city-overview",
  receivedPath: "/book/altun-ha-and-belize-city-overview/received",
  confirmedPath: "/book/altun-ha-and-belize-city-overview/received",
  productPath: "/altun-ha-and-belize-city-overview.html",
  pricing: adultChildUsd(89, 79),
  ageBands: ALTUN_AGE_BANDS,
  capacity: BELIZE_CAPACITY,
  requiredCustomerFields: ["name", "email", "phone"],
  supplier: OPERATIONS,
  paymentSettlement: REQUEST_SETTLEMENT,
  schedulePortSlug: "belize",
  pendingCommercialRules: [
    ...SHARED_PENDING,
    "Adult USD 89 (11+) · Child USD 79 (4–10) · NO under-4 online · NO free infant · require ≥1 adult",
    "Not recommended for children aged 3 and under — contact before booking if advice needed",
    "Shared excursion · Meeting: Cruise Ship Tender Pier",
    "Inclusions: guided countryside drive, Altun Ha, Belize City overview, beverage",
    "Terrain: packed dirt/grass, inclines, uneven steps, bumpy road — do not invent wheelchair suitability",
  ],
  supplierReferenceNotes: [
    "INTERNAL SUPPLY: SEG_MANUAL · CABZALTUN",
    "INTERNAL CODE: CABZALTUN",
    "VERIFIED BOOKABLE BY GRAHAM (Phase 13C)",
    "Supplier contact: UNKNOWN · NOT_CONTACTED · net/margin UNKNOWN",
    "Fulfilment: place via established SEG affiliate / white-label route (manual — do not automate).",
    "Selling: Adult USD 89 · Child USD 79 · no under-4 online band.",
    "Customer cancellation: Free cancellation up to 14 days before your excursion. Cancellations made within 14 days of departure are non-refundable.",
    "Unable to confirm after payment: full refund to original payment method.",
  ],
};

export const BELIZE_BOOKING_PRODUCTS: readonly BookableProductConfig[] = [CAVE, TURTLE, ALTUN];

export function findBelizeBookingProduct(productId: string): BookableProductConfig | undefined {
  return BELIZE_BOOKING_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
}
