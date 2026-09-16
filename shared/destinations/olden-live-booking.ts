/**
 * Product-scoped live Stripe checkout allowlist for Olden.
 *
 * Live cards stay off for every product not listed here, even when
 * LIVE_PAYMENTS_CODE_ENABLED / LIVE_PAYMENTS_UNLOCK / PAYMENTS_MODE=live
 * are already true on the Worker.
 *
 * Add slugs deliberately — never enable the whole destination at once.
 */
export const LIVE_BOOKING_PRODUCT_SLUGS = ["briksdal-glacier-olden-lake"] as const;

export type LiveBookingProductSlug = (typeof LIVE_BOOKING_PRODUCT_SLUGS)[number];

export function isLiveBookingProductSlug(productIdOrSlug: string): boolean {
  const id = productIdOrSlug.trim();
  return (LIVE_BOOKING_PRODUCT_SLUGS as readonly string[]).includes(id);
}

/** Canonical production Olden bookings Worker (never the TEST Worker). */
export const OLDEN_PROD_BOOKINGS_API_URL =
  "https://olden-bookings-prod.dark-violet-8d91.workers.dev";
