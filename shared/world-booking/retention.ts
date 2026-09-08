/**
 * Olden / World-booking operational data retention policy (code constants).
 * Conservative operational guidance — not legal advice. Do not auto-delete
 * production data until a production DB exists and ops authorises a run.
 */

export type RetentionCategory =
  | "financial_audit"
  | "customer_contact"
  | "email_outbox_content"
  | "operational_notes"
  | "stripe_identifiers"
  | "processed_events";

export type RetentionRule = {
  category: RetentionCategory;
  retainMonths: number;
  action: "retain" | "anonymise_contact" | "clear_payload" | "delete_row";
  rationale: string;
};

/**
 * Periods measured from excursion cruise_date when available, else booking created_at.
 * Financial/audit rows are retained longer than marketing-style contact copies.
 */
export const OLDEN_BOOKING_RETENTION_RULES: readonly RetentionRule[] = [
  {
    category: "financial_audit",
    retainMonths: 84,
    action: "retain",
    rationale: "Booking amount, status, references, and operator audit support accounting/disputes (~7 years).",
  },
  {
    category: "stripe_identifiers",
    retainMonths: 84,
    action: "retain",
    rationale: "Stripe session/PaymentIntent/refund IDs needed for finance reconciliation and chargebacks.",
  },
  {
    category: "customer_contact",
    retainMonths: 24,
    action: "anonymise_contact",
    rationale: "Name/email/phone needed for support around the trip; anonymise after support window.",
  },
  {
    category: "operational_notes",
    retainMonths: 24,
    action: "anonymise_contact",
    rationale: "May contain PII; clear with contact anonymisation after support window.",
  },
  {
    category: "email_outbox_content",
    retainMonths: 12,
    action: "clear_payload",
    rationale: "HTML/text duplicates customer content; keep send status/metadata longer via outbox row.",
  },
  {
    category: "processed_events",
    retainMonths: 24,
    action: "delete_row",
    rationale: "Webhook idempotency store; two years is enough for duplicate-event investigation.",
  },
] as const;

export const ANONYMISED_CUSTOMER_NAME = "[redacted]";
export const ANONYMISED_CUSTOMER_EMAIL = "redacted@invalid.example";
export const ANONYMISED_CUSTOMER_PHONE = "";
export const ANONYMISED_NOTES = "";
export const CLEARED_EMAIL_PAYLOAD = JSON.stringify({
  redacted: true,
  note: "payload cleared under retention policy",
});

export type RetentionCandidate = {
  kind: "booking_contact" | "email_payload" | "processed_event";
  id: string;
  bookingReference?: string;
  dueAt: string;
  action: RetentionRule["action"];
  category: RetentionCategory;
};

function addMonthsIso(isoDate: string, months: number): string {
  const base = /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T00:00:00.000Z` : isoDate;
  const d = new Date(base);
  if (Number.isNaN(d.getTime())) return isoDate;
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString();
}

export function retentionAnchorIso(booking: {
  cruise_date: string;
  created_at: string;
}): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(booking.cruise_date)) return booking.cruise_date;
  return booking.created_at;
}

export function contactAnonymisationDueAt(booking: {
  cruise_date: string;
  created_at: string;
}): string {
  const rule = OLDEN_BOOKING_RETENTION_RULES.find((item) => item.category === "customer_contact")!;
  return addMonthsIso(retentionAnchorIso(booking), rule.retainMonths);
}

export function emailPayloadClearDueAt(createdAt: string): string {
  const rule = OLDEN_BOOKING_RETENTION_RULES.find((item) => item.category === "email_outbox_content")!;
  return addMonthsIso(createdAt, rule.retainMonths);
}

export function processedEventDeleteDueAt(processedAt: string): string {
  const rule = OLDEN_BOOKING_RETENTION_RULES.find((item) => item.category === "processed_events")!;
  return addMonthsIso(processedAt, rule.retainMonths);
}

/** Pure planner for dry-run / future scripted runs. Does not mutate storage. */
export function planRetentionActions(input: {
  nowIso?: string;
  bookings: Array<{
    id: string;
    booking_reference: string;
    cruise_date: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
  }>;
  emailOutbox: Array<{ id: string; booking_reference: string; created_at: string; payload_json: string }>;
  processedEvents: Array<{ event_id: string; processed_at: string }>;
}): RetentionCandidate[] {
  const now = Date.parse(input.nowIso ?? new Date().toISOString());
  const out: RetentionCandidate[] = [];

  for (const booking of input.bookings) {
    const dueAt = contactAnonymisationDueAt(booking);
    if (Date.parse(dueAt) <= now && booking.customer_email !== ANONYMISED_CUSTOMER_EMAIL) {
      out.push({
        kind: "booking_contact",
        id: booking.id,
        bookingReference: booking.booking_reference,
        dueAt,
        action: "anonymise_contact",
        category: "customer_contact",
      });
    }
  }

  for (const row of input.emailOutbox) {
    const dueAt = emailPayloadClearDueAt(row.created_at);
    if (Date.parse(dueAt) <= now && !row.payload_json.includes('"redacted":true')) {
      out.push({
        kind: "email_payload",
        id: row.id,
        bookingReference: row.booking_reference,
        dueAt,
        action: "clear_payload",
        category: "email_outbox_content",
      });
    }
  }

  for (const event of input.processedEvents) {
    const dueAt = processedEventDeleteDueAt(event.processed_at);
    if (Date.parse(dueAt) <= now) {
      out.push({
        kind: "processed_event",
        id: event.event_id,
        dueAt,
        action: "delete_row",
        category: "processed_events",
      });
    }
  }

  return out;
}
