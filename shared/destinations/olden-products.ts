import { oldenBookingCore } from "./olden";
import type { AgeBand, BookableProductConfig, ProductCapacity, ProductPricing } from "../world-booking/types";

/**
 * Operational routing: Wow A Tour ops mailbox for Graham’s manual fulfilment.
 * Customer Reply-To stays hello@oldenshoreexcursions.com (EMAIL_REPLY_TO / bookingEmail).
 * Public customers never see SEG, Norway Excursions costs, or margins.
 */
const OPERATIONS = {
  id: "olden-shore-ops",
  displayName: "Olden Shore Excursions Operations",
  notificationEmail: "info@wowatour.com",
  routingStatus: "production_ready" as const,
};

const REQUEST_SETTLEMENT = "charge_refund" as const;

/** Graham online max — never describe as supplier / vehicle / coach capacity. */
const OLDEN_CAPACITY: ProductCapacity = {
  minGuests: 1,
  maxGuestsPerBooking: 10,
  maxGuestsPerBookingSource: "approved",
  supplierGroupSize: null,
  maxGuestsPerGuide: null,
};

/** Briksdal — Adult 12+, Child 3–11, Infant 0–2 (free). */
const BRIKSDAL_AGE_BANDS: readonly AgeBand[] = [
  { id: "adult", label: "Adults (12+)", minAge: 12, maxAge: null, pricingStatus: "priced" },
  { id: "child", label: "Children (3–11)", minAge: 3, maxAge: 11, pricingStatus: "priced" },
  { id: "infant", label: "Infants (0–2)", minAge: 0, maxAge: 2, pricingStatus: "priced" },
];

function adultChildEur(adultAmount: number, childAmount: number, infantAmount: number): ProductPricing {
  return {
    model: "adult_child",
    currency: "EUR",
    adultAmount,
    childAmount,
    childPricingStatus: "priced",
    infantAmount,
    infantPricingStatus: "priced",
    pricingNeedsConfirmation: false,
  };
}

const SHARED_PENDING = [
  "Customer cancellation APPROVED: free up to 48 hours before excursion; within 48 hours non-refundable.",
  "Unable to confirm after payment: full refund to original payment method.",
  "Ship misses Olden / supplier or weather cancel after confirmation: full refund.",
  "Meeting: exact instructions after confirmation.",
  "Fulfilment: Graham places corresponding booking via Norway Excursions direct (INTERNAL — DIRECT_SUPPLIER_MANUAL).",
  "Payment received ≠ excursion confirmed.",
  "Online max 10 guests per booking (Graham online limit — not supplier capacity).",
  "LIVE_PAYMENTS_CODE_ENABLED false until Phase O-3+ Graham unlock (request-to-book).",
  "Walking: ~45–60 minutes to glacier lake viewpoint; first section most challenging; then relatively even.",
  "Difficulty 2–3 / physically fit; proper footwear and weather layers; respect track warning signs.",
  "Mobility / stroller: do not publish blanket claim — ask before booking until supplier confirms for Graham’s fulfilment.",
  "Child-seat / booster: collect via customer.operationalNotes as structured text when frontend gathers fields (see formatOldenChildSeatRequestNotes).",
] as const;

export const OLDEN_CANCELLATION_COPY = {
  customerCancellation:
    "Free cancellation up to 48 hours before your excursion. Cancellations made within 48 hours of departure are non-refundable. If we are unable to confirm your excursion after payment, you will receive a full refund to your original payment method. If your ship misses Olden or the excursion is cancelled after confirmation, you will receive a full refund.",
  freeWindow: "Free cancellation up to 48 hours before your excursion.",
  insideWindow: "Cancellations made within 48 hours of departure are non-refundable.",
  unableToConfirm:
    "If we are unable to confirm your excursion after payment, you will receive a full refund to your original payment method.",
  shipMissOlden:
    "If your ship misses Olden or the excursion is cancelled after confirmation, you will receive a full refund.",
  paymentNotConfirmation:
    "After payment, we'll arrange your excursion and send your confirmation as soon as it is confirmed. Payment does not mean the excursion is confirmed yet.",
  /** Automated confirmation only — supplier tour ticket (joining document) is sent manually. */
  meetingInstructions:
    "Your tour ticket, including your meeting instructions, will be sent separately.",
  overTenGuidance: "For groups larger than 10, email hello@oldenshoreexcursions.com before requesting.",
} as const;

/**
 * Child-seat / booster request data is NOT a first-class API field.
 * Frontend and ops should append structured text into `customer.operationalNotes`
 * (also persisted as booking.operational_notes). Never put costs or SEG refs here.
 */
export type OldenChildSeatRequest = {
  required: boolean;
  ageYears?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  notes?: string | null;
};

/** Formats child-seat request lines for `customer.operationalNotes`. */
export function formatOldenChildSeatRequestNotes(seats: readonly OldenChildSeatRequest[]): string {
  if (!seats.length) return "";
  const lines = ["Child seat / booster request:"];
  seats.forEach((seat, index) => {
    const parts = [
      seat.required ? "required" : "not required",
      seat.ageYears != null ? `age ${seat.ageYears}y` : null,
      seat.weightKg != null ? `weight ${seat.weightKg} kg` : null,
      seat.heightCm != null ? `height ${seat.heightCm} cm` : null,
      seat.notes?.trim() || null,
    ].filter(Boolean);
    lines.push(`  Seat ${index + 1}: ${parts.join(" · ")}`);
  });
  return lines.join("\n");
}

const BRIKSDAL: BookableProductConfig = {
  id: "briksdal-glacier-olden-lake",
  destinationId: oldenBookingCore.id,
  slug: "briksdal-glacier-olden-lake",
  name: "Briksdal Glacier & Olden Lake",
  durationLabel: "4 hours",
  bookingMode: "request",
  availability: "live",
  bookingPath: "/book/briksdal-glacier-olden-lake",
  receivedPath: "/book/briksdal-glacier-olden-lake/received",
  confirmedPath: "/book/briksdal-glacier-olden-lake/received",
  productPath: "/excursions/briksdal-glacier-olden-lake",
  pricing: adultChildEur(96, 56, 0),
  ageBands: BRIKSDAL_AGE_BANDS,
  capacity: OLDEN_CAPACITY,
  requiredCustomerFields: ["name", "email", "phone"],
  supplier: OPERATIONS,
  paymentSettlement: REQUEST_SETTLEMENT,
  schedulePortSlug: "olden",
  pendingCommercialRules: [
    ...SHARED_PENDING,
    "Adult EUR 96 (12+) · Child EUR 56 (3–11) · Infant EUR 0 (0–2) · require ≥1 adult",
    "Ack required: walking suitability (~45–60 min; first section most challenging) via eligibilityAcknowledged",
    "Shared excursion · Meeting: Olden cruise terminal area; exact instructions after confirmation",
    "Inclusions: bus fare, guided tour, back-in-time guarantee. Food/drink not included.",
    "Route (supplier-backed): Olden → Little Red Church → Olden Lake → Rustøen → Briksdal Inn → walk to glacier lake viewpoint → return Olden (stop order may vary)",
  ],
  supplierReferenceNotes: [
    "INTERNAL ONLY — never publish to customers, emails, or public HTML",
    "fulfilment_mode=DIRECT_SUPPLIER_MANUAL",
    "supplier=Norway Excursions",
    "supplier_product_url=https://www.norwayexcursions.com/en/tour/olden-the-amazing-briksdal-glacier/",
    "adult_cost=82 · child_cost=41 · infant_cost=0 (verify) · adult_gp=14 · child_gp=15",
    "commercial_review=AFTER_6_MONTHS",
    "future_action=REQUEST_COMMISSION_OR_TRADE_MODEL",
    "NEVER expose costs, margins, GP, or supplier net publicly",
    "Selling: Adult EUR 96 · Child EUR 56 · Infant EUR 0",
    "Customer cancellation: Free cancellation up to 48 hours before your excursion. Cancellations within 48 hours are non-refundable.",
    "Unable to confirm after payment / ship miss Olden: full refund to original payment method.",
  ],
};

export const OLDEN_BOOKING_PRODUCTS: readonly BookableProductConfig[] = [BRIKSDAL];

export function findOldenBookingProduct(productId: string): BookableProductConfig | undefined {
  return OLDEN_BOOKING_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
}
