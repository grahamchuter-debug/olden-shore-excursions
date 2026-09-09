/**
 * Public commercial config for Olden Shore Excursions.
 * INTERNAL supplier costs / fulfilment notes must never be rendered here.
 *
 * Gate values:
 * - PRODUCTION_READY_LOCKED — journey visible; checkout disabled (default for
 *   production `npm run build` / `npm run deploy`)
 * - BOOKING_ENABLED — checkout allowed in the UI only when an explicit UI mode
 *   AND a matching API target are both valid
 *
 * TEST unlock (explicit, build-time):
 *   NEXT_PUBLIC_OLDEN_BOOKING_UI=test
 *   → always targets the isolated TEST Worker URL
 *
 * Future production unlock (explicit; not used by normal build/deploy):
 *   NEXT_PUBLIC_OLDEN_BOOKING_UI=live
 *   NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL=<production Worker origin>
 *   → fails closed if the production URL is missing or points at TEST
 *
 * Production deploys must NOT set those envs. Without them, status stays locked
 * and getOldenBookingsApiUrl() returns null (never the TEST Worker).
 */

import { OLDEN_CANCELLATION_COPY } from "../../../shared/destinations/olden-products";

export type OldenPublicBookingStatus =
  | "PRODUCTION_READY_LOCKED"
  | "BOOKING_ENABLED";

/** Hard default — production static builds bake this in when env is unset. */
export const OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT =
  "PRODUCTION_READY_LOCKED" as const satisfies OldenPublicBookingStatus;

/**
 * Isolated Cloudflare TEST booking Worker (O-3 / O-4 proven).
 * Live production builds must not embed this URL — only the TEST UI env keeps it.
 */
export const OLDEN_TEST_BOOKINGS_API_URL =
  process.env.NEXT_PUBLIC_OLDEN_BOOKING_UI === "test"
    ? "https://olden-bookings-test.dark-violet-8d91.workers.dev"
    : "";

export type OldenBookingsApiTarget =
  | { mode: "test"; url: string }
  | { mode: "production"; url: string }
  | { mode: "locked"; url: null; reason: string };

type EnvLike = Record<string, string | undefined>;

function readEnv(env: EnvLike | undefined): EnvLike {
  if (env) return env;
  // NEXT_PUBLIC_* must be referenced as static process.env.KEY members so Next can
  // inline them into the client bundle. Casting process.env and reading dynamically
  // leaves the browser without values → PRODUCTION_READY_LOCKED after hydration.
  return {
    NEXT_PUBLIC_OLDEN_BOOKING_UI: process.env.NEXT_PUBLIC_OLDEN_BOOKING_UI,
    NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL: process.env.NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL,
  };
}

function isTestWorkerUrl(url: string): boolean {
  const normalized = url.trim().replace(/\/$/, "");
  if (OLDEN_TEST_BOOKINGS_API_URL && normalized === OLDEN_TEST_BOOKINGS_API_URL) return true;
  // Hostname guard remains even when the full TEST URL constant is stripped from live builds.
  return /olden-bookings-test/i.test(normalized);
}

/**
 * Explicit API target selection. Never falls back from production/live to TEST.
 */
export function resolveOldenBookingsApiTarget(env?: EnvLike): OldenBookingsApiTarget {
  const e = readEnv(env);
  const uiMode = (e.NEXT_PUBLIC_OLDEN_BOOKING_UI ?? "").trim();
  const prodUrl = (e.NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL ?? "").trim().replace(/\/$/, "");

  if (uiMode === "test") {
    if (!OLDEN_TEST_BOOKINGS_API_URL) {
      return { mode: "locked", url: null, reason: "missing_test_api_url" };
    }
    return { mode: "test", url: OLDEN_TEST_BOOKINGS_API_URL };
  }

  if (uiMode === "live") {
    if (!prodUrl) {
      return { mode: "locked", url: null, reason: "missing_prod_api_url" };
    }
    if (isTestWorkerUrl(prodUrl)) {
      return { mode: "locked", url: null, reason: "test_url_not_allowed_for_live" };
    }
    return { mode: "production", url: prodUrl };
  }

  return { mode: "locked", url: null, reason: "production_ready_locked" };
}

/**
 * True only when the frontend was built/started with the explicit TEST UI flag.
 * Never infer from hostname alone.
 */
export function isOldenBookingTestUiEnabled(env?: EnvLike): boolean {
  return (readEnv(env).NEXT_PUBLIC_OLDEN_BOOKING_UI ?? "").trim() === "test";
}

/** Resolved public status for this build. */
export function resolveOldenPublicBookingStatus(env?: EnvLike): OldenPublicBookingStatus {
  const target = resolveOldenBookingsApiTarget(env);
  return target.mode === "locked" ? OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT : "BOOKING_ENABLED";
}

/**
 * Booking API base URL for checkout.
 * - TEST UI → TEST Worker
 * - live UI + explicit prod URL → production Worker
 * - otherwise → null (fail closed; never TEST fallback)
 */
export function getOldenBookingsApiUrl(env?: EnvLike): string | null {
  return resolveOldenBookingsApiTarget(env).url;
}

/** @deprecated Prefer resolveOldenPublicBookingStatus() — kept for call-site clarity. */
export const OLDEN_PUBLIC_BOOKING_STATUS = OLDEN_PUBLIC_BOOKING_STATUS_DEFAULT;

export const oldenCommercialConfig = {
  get bookingsApiUrl(): string | null {
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
