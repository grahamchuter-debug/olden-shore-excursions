/**
 * Belize destination booking core.
 * Product catalogue: shared/destinations/belize-products.ts
 * Public editorial tours: equity .html pages via scripts/build-site.py
 * Internal supply mapping: product.supplierReferenceNotes (never public HTML)
 */
import type { DestinationBookingCore } from "../world-booking/types";

export const belizeBookingCore = {
  id: "belize",
  siteName: "Belize Shore Excursions",
  siteHostname: "belizeshoreexcursion.com",
  siteUrl: "https://belizeshoreexcursion.com",
  bookingEmail: "hello@belizeshoreexcursion.com",
  originatingSite: "belizeshoreexcursion.com",
  originatingPort: "Belize City, Belize",
  bookingRefPrefix: "W2BZE",
  sessionKeyPrefix: "w2-bz-booking",
  sessionKeyVersion: 1,
  currencyCode: "USD",
  bookableWindow: {
    start: "2026-09-01",
    end: "2028-12-31",
  },
  /** No Belize schedule import — cruise date/ship are customer-entered. */
  schedulePortSlug: "belize",
  customShipSlug: "not-listed",
  contactPath: "/contact",
  termsPath: "/terms",
  privacyPath: "/privacy",
} as const satisfies DestinationBookingCore;
