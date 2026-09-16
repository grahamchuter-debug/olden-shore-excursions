/**
 * O-8 — API target isolation + retention planner tests.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getOldenBookingsApiUrl,
  isPublicBookingEnabled,
  OLDEN_TEST_BOOKINGS_API_URL,
  resolveOldenBookingsApiTarget,
  resolveOldenPublicBookingStatus,
} from "../../src/lib/booking/commercial-config";
import {
  ANONYMISED_CUSTOMER_EMAIL,
  planRetentionActions,
} from "./retention";

test("TEST UI mode returns TEST Worker URL and enables booking", () => {
  const env = { NEXT_PUBLIC_OLDEN_BOOKING_UI: "test" };
  const target = resolveOldenBookingsApiTarget(env);
  assert.equal(target.mode, "test");
  assert.equal(target.url, OLDEN_TEST_BOOKINGS_API_URL);
  assert.equal(getOldenBookingsApiUrl(env), OLDEN_TEST_BOOKINGS_API_URL);
  assert.equal(resolveOldenPublicBookingStatus(env), "BOOKING_ENABLED");
  assert.equal(isPublicBookingEnabled(resolveOldenPublicBookingStatus(env)), true);
});

test("production default cannot enable booking and does not fall back to TEST URL", () => {
  const env = {};
  const target = resolveOldenBookingsApiTarget(env);
  assert.equal(target.mode, "locked");
  assert.equal(target.url, null);
  assert.equal(getOldenBookingsApiUrl(env), null);
  assert.equal(resolveOldenPublicBookingStatus(env), "PRODUCTION_READY_LOCKED");
  assert.equal(isPublicBookingEnabled(resolveOldenPublicBookingStatus(env)), false);
});

test("live UI without PROD API URL fails closed", () => {
  const env = { NEXT_PUBLIC_OLDEN_BOOKING_UI: "live" };
  const target = resolveOldenBookingsApiTarget(env);
  assert.equal(target.mode, "locked");
  assert.equal(target.url, null);
  assert.equal(resolveOldenPublicBookingStatus(env), "PRODUCTION_READY_LOCKED");
});

test("live UI cannot use TEST Worker URL", () => {
  const env = {
    NEXT_PUBLIC_OLDEN_BOOKING_UI: "live",
    NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL: OLDEN_TEST_BOOKINGS_API_URL,
  };
  const target = resolveOldenBookingsApiTarget(env);
  assert.equal(target.mode, "locked");
  assert.equal(target.url, null);
  assert.equal((target as { reason?: string }).reason, "test_url_not_allowed_for_live");
});

test("live UI with explicit non-TEST production API URL is selectable", () => {
  const env = {
    NEXT_PUBLIC_OLDEN_BOOKING_UI: "live",
    NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL: "https://olden-bookings-prod.example.workers.dev",
  };
  const target = resolveOldenBookingsApiTarget(env);
  assert.equal(target.mode, "production");
  assert.equal(target.url, "https://olden-bookings-prod.example.workers.dev");
  assert.equal(resolveOldenPublicBookingStatus(env), "BOOKING_ENABLED");
});

test("live UI enables only LIVE_BOOKING_PRODUCT_SLUGS products", async () => {
  const { resolveProductPublicBookingStatus } = await import(
    "../../src/lib/booking/commercial-config"
  );
  const env = {
    NEXT_PUBLIC_OLDEN_BOOKING_UI: "live",
    NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL: "https://olden-bookings-prod.example.workers.dev",
  };
  assert.equal(
    resolveProductPublicBookingStatus("briksdal-glacier-olden-lake", env),
    "BOOKING_ENABLED",
  );
  assert.equal(
    resolveProductPublicBookingStatus("private-briksdal-glacier-olden-lake", env),
    "PRODUCTION_READY_LOCKED",
  );
});

test("O-12 commercial-config uses static NEXT_PUBLIC process.env members for client inlining", async () => {
  const { readFileSync } = await import("node:fs");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const here = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(here, "../../src/lib/booking/commercial-config.ts"), "utf8");
  assert.match(src, /process\.env\.NEXT_PUBLIC_OLDEN_BOOKING_UI/);
  assert.match(src, /process\.env\.NEXT_PUBLIC_OLDEN_BOOKINGS_API_URL/);
  assert.doesNotMatch(src, /process\.env as EnvLike/);
});

test("retention planner anonymises due contact and clears aged email payloads", () => {
  const plan = planRetentionActions({
    nowIso: "2030-01-01T00:00:00.000Z",
    bookings: [
      {
        id: "b1",
        booking_reference: "W2ODE-RET1",
        cruise_date: "2027-07-15",
        created_at: "2027-06-01T00:00:00.000Z",
        customer_name: "Alex",
        customer_email: "alex@example.com",
      },
      {
        id: "b2",
        booking_reference: "W2ODE-RET2",
        cruise_date: "2029-12-01",
        created_at: "2029-11-01T00:00:00.000Z",
        customer_name: "Sam",
        customer_email: "sam@example.com",
      },
    ],
    emailOutbox: [
      {
        id: "e1",
        booking_reference: "W2ODE-RET1",
        created_at: "2027-06-01T00:00:00.000Z",
        payload_json: "{\"html\":\"x\"}",
      },
    ],
    processedEvents: [{ event_id: "evt1", processed_at: "2027-06-01T00:00:00.000Z" }],
  });

  assert.ok(plan.some((item) => item.kind === "booking_contact" && item.bookingReference === "W2ODE-RET1"));
  assert.ok(!plan.some((item) => item.bookingReference === "W2ODE-RET2" && item.kind === "booking_contact"));
  assert.ok(plan.some((item) => item.kind === "email_payload"));
  assert.ok(plan.some((item) => item.kind === "processed_event"));
  assert.notEqual(ANONYMISED_CUSTOMER_EMAIL, "alex@example.com");
});
