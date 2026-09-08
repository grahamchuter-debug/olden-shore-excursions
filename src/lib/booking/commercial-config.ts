/**
 * Public commercial config for Olden Shore Excursions.
 * INTERNAL supplier costs / fulfilment notes must never be rendered here.
 *
 * Gate values:
 * - PRODUCTION_READY_LOCKED — journey visible; checkout disabled (default for
 *   production `npm run build` / `npm run deploy`)
 * - BOOKING_ENABLED — checkout allowed in the UI (TEST Worker only for O-5)
 *
 * TEST unlock (explicit, build-time):
 *   NEXT_PUBLIC_OLDEN_BOOKING_UI=test
 *
 * Production deploys must NOT set that env. Without it, status stays locked and
 * accidental production site deploys cannot open Stripe TEST checkout.
 */

import { OLDEN_CANCELLATION_COPY } from "../../../shared/destinations/olden-products";

export type OldenPublicBookingStatus =
  | "PRODUCTION_READY_LOCKED"
  | "BOOKING_ENABLED";

/** Hard default — production static builds bake this in when env is unset. */
export const OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT =
  "PRODUCTION_READY_LOCKED" as const satisfies OldenPublicBookingStatus;

/** Isolated Cloudflare TEST booking Worker (O-3 / O-4 proven). */
export const OLDEN_TEST_BOOKINGS_API_URL =
  "https://olden-bookings-test.dark-violet-8d91.workers.dev";

/**
 * True only when the frontend was built/started with the explicit TEST UI flag.
 * Never infer from hostname alone.
 */
export function isOldenBookingTestUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_OLDEN_BOOKING_UI === "test";
}

/** Resolved public status for this build. */
export function resolveOldenPublicBookingStatus(): OldenPublicBookingStatus {
  return isOldenBookingTestUiEnabled()
    ? "BOOKING_ENABLED"
    : OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT;
}

/**
 * Booking API base URL. O-5 only ever targets the TEST Worker.
 * There is no production booking Worker to point at.
 */
export function getOldenBookingsApiUrl(): string {
  return OLDEN_TEST_BOOKINGS_API_URL;
}

/** @deprecated Prefer resolveOldenPublicBookingStatus() — kept for call-site clarity. */
export const OLDEN_PUBLIC_BOOKING_STATUS = OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT;

export const oldenCommercialConfig = {
  get bookingsApiUrl() {
    return getOldenBookingsApiUrl();
  },
  email: "hello@oldenshoreexcursions.com",
  siteName: "Olden Shore Excursions",
  get defaultPublicBookingStatus(): OldenPublicBookingStatus {
    return resolveOldenPublicBookingStatus();
  },
  cancellation: OLDEN_CANCELLATION_COPY.customerCancellation,
  paymentNotConfirmation: OLDEN_CANCELLATION_COPY.paymentNotConfirmation,
  unableToConfirm: OLDEN_CANCELLATION_COPY.unableToConfirm,
  meetingInstructions: OLDEN_CANCELLATION_COPY.meetingInstructions,
  overTenGuidance: OLDEN_CANCELLATION_COPY.overTenGuidance,
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
      get publicBookingStatus(): OldenPublicBookingStatus {
        return resolveOldenPublicBookingStatus();
      },
      displayPrice: "Adult 12+ €96 · Child 3–11 €56 · Infant 0–2 FREE",
    },
  },
} as const;

export function isPublicBookingEnabled(
  status: OldenPublicBookingStatus = resolveOldenPublicBookingStatus(),
): boolean {
  return status === "BOOKING_ENABLED";
}
