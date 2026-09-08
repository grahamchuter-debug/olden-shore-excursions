/**
 * Olden destination booking core.
 * Product catalogue: shared/destinations/olden-products.ts
 * Public editorial tours: Next.js excursion pages under /excursions/*
 * Internal supply mapping: product.supplierReferenceNotes (never public)
 */
import type { DestinationBookingCore } from "../world-booking/types";

export const oldenBookingCore = {
  id: "olden",
  siteName: "Olden Shore Excursions",
  siteHostname: "oldenshoreexcursions.com",
  siteUrl: "https://oldenshoreexcursions.com",
  bookingEmail: "hello@oldenshoreexcursions.com",
  originatingSite: "oldenshoreexcursions.com",
  originatingPort: "Olden, Norway",
  bookingRefPrefix: "W2ODE",
  sessionKeyPrefix: "w2-ode-booking",
  sessionKeyVersion: 1,
  currencyCode: "EUR",
  bookableWindow: {
    start: "2026-04-01",
    end: "2028-09-30",
  },
  /** Cruise schedules available via Olden port slug; date/ship still customer-entered at checkout. */
  schedulePortSlug: "olden",
  customShipSlug: "not-listed",
  contactPath: "/contact",
  termsPath: "/terms",
  privacyPath: "/privacy",
} as const satisfies DestinationBookingCore;
