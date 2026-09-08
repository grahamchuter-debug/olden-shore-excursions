/**
 * Public commercial config for Olden Shore Excursions (Phase O-2).
 * INTERNAL supplier costs / fulfilment notes must never be rendered here.
 *
 * Gate values:
 * - PRODUCTION_READY_LOCKED — journey visible; live pay disabled
 * - BOOKING_ENABLED — live checkout allowed (also requires Worker unlock)
 */
export const OLDEN_PUBLIC_BOOKING_STATUS = "PRODUCTION_READY_LOCKED" as const;

export type OldenPublicBookingStatus =
  | "PRODUCTION_READY_LOCKED"
  | "BOOKING_ENABLED";

export const oldenCommercialConfig = {
  /** Test Worker URL — replace after deploy; prod stays locked in O-2. */
  bookingsApiUrl: "https://olden-bookings-test.workers.dev",
  email: "hello@oldenshoreexcursions.com",
  siteName: "Olden Shore Excursions",
  defaultPublicBookingStatus: OLDEN_PUBLIC_BOOKING_STATUS,
  cancellation:
    "Free cancellation up to 48 hours before departure. Cancellations made within 48 hours of departure are non-refundable. If we are unable to confirm your excursion, you will receive a full refund. If your cruise ship does not call at Olden, you will receive a full refund.",
  paymentNotConfirmation:
    "After payment, we arrange your excursion with the local operator and email confirmation separately. Payment does not mean the excursion is confirmed yet.",
  unableToConfirm:
    "If we are unable to confirm your excursion after payment, you will receive a full refund to your original payment method.",
  meetingInstructions:
    "Meeting instructions will be provided with your confirmed excursion details.",
  overTenGuidance:
    "Travelling with more than 10 guests? Contact us and we'll check availability for your group.",
  products: {
    "briksdal-glacier-olden-lake": {
      productId: "briksdal-glacier-olden-lake",
      slug: "briksdal-glacier-olden-lake",
      name: "Briksdal Glacier & Olden Lake",
      productPath: "/excursions/briksdal-glacier-olden-lake",
      bookingPath: "/book/briksdal-glacier-olden-lake",
      receivedPath: "/book/briksdal-glacier-olden-lake/received",
      adultEur: 96,
      childEur: 56,
      infantEur: 0,
      durationLabel: "4 hours",
      maxGuests: 10,
      requiresWalkingAck: true,
      publicBookingStatus: OLDEN_PUBLIC_BOOKING_STATUS,
      displayPrice: "Adult 12+ €96 · Child 3–11 €56 · Infant 0–2 FREE",
    },
  },
} as const;

export function isPublicBookingEnabled(
  status: OldenPublicBookingStatus = oldenCommercialConfig.defaultPublicBookingStatus,
): boolean {
  return status === "BOOKING_ENABLED";
}
