/**
 * Dry-run retention planner for Olden booking data.
 * Does not connect to production D1 and does not mutate data.
 *
 *   npx tsx scripts/retention-olden-bookings.ts --dry-run
 */
import {
  OLDEN_BOOKING_RETENTION_RULES,
  planRetentionActions,
} from "../shared/world-booking/retention";

const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--apply");

if (!dryRun) {
  console.error("Apply mode is disabled until a production D1 exists and ops authorises a run.");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      mode: "dry-run",
      note: "No database connection. Policy constants only.",
      rules: OLDEN_BOOKING_RETENTION_RULES,
      samplePlan: planRetentionActions({
        nowIso: "2030-01-01T00:00:00.000Z",
        bookings: [
          {
            id: "sample-booking",
            booking_reference: "W2ODE-SAMPLE1",
            cruise_date: "2027-07-15",
            created_at: "2027-06-01T00:00:00.000Z",
            customer_name: "Sample Guest",
            customer_email: "sample@example.com",
          },
        ],
        emailOutbox: [
          {
            id: "sample-outbox",
            booking_reference: "W2ODE-SAMPLE1",
            created_at: "2027-06-01T00:00:00.000Z",
            payload_json: "{\"html\":\"secret\"}",
          },
        ],
        processedEvents: [
          { event_id: "evt_sample", processed_at: "2027-06-01T00:00:00.000Z" },
        ],
      }),
    },
    null,
    2,
  ),
);
