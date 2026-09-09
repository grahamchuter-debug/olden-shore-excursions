/**
 * Phase 6I Stage B1 — refund path regression tests.
 * Mocks/stubs only. Never calls Stripe LIVE.
 */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { BookingRow } from "./db";
import { countEmailOutbox, getBookingByReference, insertBooking } from "./db";
import { markRefundedFromCharge } from "./fulfill";
import { createMemoryD1 } from "./memory-d1";
import { declineBooking } from "./operator-actions";
import {
  createOperatorReviewToken,
  hashOperatorToken,
  listUnresolvedRequestedBookings,
  OPERATOR_TOKEN_TTL_MS,
  OPS_RESPONSE_SLA_HOURS,
  reissueOperatorReviewToken,
  validateOperatorReviewToken,
  type OperatorActionTokenRow,
  type OperatorAuditRow,
} from "./operator-tokens";
import { LIVE_PAYMENTS_CODE_ENABLED } from "./live-gate";
import worker from "./index";
import { setStripeFactoryForTests } from "./stripe";
import type { EmailOutboxRow } from "./db";

afterEach(() => {
  setStripeFactoryForTests(null);
});

type RefundCall = {
  params: {
    payment_intent?: string;
    amount?: number;
    reason?: string;
    metadata?: Record<string, string>;
  };
  opts?: { idempotencyKey?: string };
};

function paidBooking(reference: string, overrides: Partial<BookingRow> = {}): BookingRow {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    booking_reference: reference,
    booking_session_id: `sess-${reference}`,
    destination_id: "olden",
    product_id: "briksdal-glacier-olden-lake",
    product_name: "Briksdal Glacier & Olden Lake",
    cruise_date: "2026-09-11",
    ship_name: "MSC Seaside",
    ship_slug: "msc",
    guest_count: 1,
    adults: 1,
    children: 0,
    infants: 0,
    unit_amount_cents: 9600,
    amount_total_cents: 9600,
    currency: "eur",
    customer_name: "Graham Test",
    customer_email: "customer@example.com",
    customer_phone: "+447700900123",
    operational_notes: null,
    status: "requested",
    payment_status: "paid",
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: `pi_test_${reference}`,
    stripe_refund_id: null,
    idempotency_key: `idem-${reference}`,
    payload_json: "{}",
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

function baseEnv(db: D1Database, overrides: Record<string, unknown> = {}): Env {
  return {
    PAYMENTS_MODE: "test",
    BOOKINGS_ENABLED: "true",
    STRIPE_SECRET_KEY: "sk_test_refund_mock",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    EMAIL_SENDING_ENABLED: "true",
    EMAIL_FROM: "bookings@notifications.wowatour.com",
    EMAIL_FROM_NAME: "Olden Shore Excursions",
    EMAIL_REPLY_TO: "hello@oldenshoreexcursions.com",
    RESEND_API_KEY: "re_test_mock",
    SITE_BASE_URL: "http://localhost:4321",
    CORS_ALLOWED_ORIGINS: "http://localhost:4321",
    OPERATOR_TOKEN: "operator-header-secret",
    DB: db,
    ...overrides,
  } as unknown as Env;
}

function installStripeMock(args: {
  refundStatus?: string;
  refundAmount?: number;
  refundFail?: boolean;
  onCreate?: (call: RefundCall) => void;
}) {
  const calls: RefundCall[] = [];
  setStripeFactoryForTests(() => {
    return {
      refunds: {
        create: async (params: RefundCall["params"], opts?: RefundCall["opts"]) => {
          const call = { params, opts };
          calls.push(call);
          args.onCreate?.(call);
          if (args.refundFail) throw new Error("stripe_refund_mock_failed");
          return {
            id: `re_mock_${calls.length}`,
            status: args.refundStatus ?? "succeeded",
            amount: args.refundAmount ?? 9600,
          };
        },
      },
      checkout: {
        sessions: {
          retrieve: async () => ({
            payment_status: "paid",
            payment_intent: "pi_should_not_be_needed",
          }),
        },
      },
      webhooks: {
        constructEventAsync: async () => {
          throw new Error("not used in these tests");
        },
      },
    } as never;
  });
  return calls;
}

function installResendMock(mode: "success" | "fail") {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (url.includes("api.resend.com")) {
      if (mode === "fail") {
        return new Response(JSON.stringify({ message: "resend_mock_fail" }), { status: 500 });
      }
      return new Response(JSON.stringify({ id: "msg_mock_1" }), { status: 200 });
    }
    return original(input, init);
  }) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

async function listAudit(env: Env, reference: string): Promise<OperatorAuditRow[]> {
  const result = await env.DB.prepare(`SELECT * FROM operator_audit_log WHERE booking_reference = ?`)
    .bind(reference)
    .all<OperatorAuditRow>();
  return result.results ?? [];
}

async function listOutbox(env: Env, reference: string): Promise<EmailOutboxRow[]> {
  const result = await env.DB.prepare(`SELECT * FROM email_outbox WHERE booking_reference = ?`)
    .bind(reference)
    .all<EmailOutboxRow>();
  return result.results ?? [];
}

async function postDeclineAction(env: Env, reference: string, token: string, extra: Record<string, string> = {}) {
  const body = new URLSearchParams({
    ref: reference,
    t: token,
    action: "decline",
    confirmRefund: "yes",
    ...extra,
  });
  return worker.fetch(
    new Request("http://bookings.test/operator/review/action", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }),
    env,
  );
}

test("refund A: successful full refund via tokenised operator path", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-A";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    const response = await postDeclineAction(env, reference, token);
    assert.equal(response.status, 200);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.payment_status, "refunded");
    assert.equal(booking?.status, "supplier_declined");
    assert.equal(booking?.stripe_refund_id, "re_mock_1");
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.params.payment_intent, `pi_test_${reference}`);
    assert.equal(calls[0]?.params.amount, undefined);
    assert.equal(calls[0]?.params.reason, undefined);
    assert.notEqual(calls[0]?.params.reason, "requested_by_customer");
    assert.equal(calls[0]?.params.metadata?.refund_cause, "unable_to_confirm");
    assert.equal(calls[0]?.opts?.idempotencyKey, `refund:${reference}`);
    assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 1);
    const outbox = await listOutbox(env, reference);
    assert.equal(outbox[0]?.status, "sent");
    const payload = JSON.parse(outbox[0]?.payload_json ?? "{}") as { text?: string; subject?: string };
    assert.match(payload.text ?? "", /couldn't confirm|could not confirm/i);
    assert.doesNotMatch(payload.text ?? "", /SEG|supplier declined|CASLJUNSOUVAN/i);
    assert.doesNotMatch(payload.text ?? "", /Controlled production test/i);
  } finally {
    restoreFetch();
  }
});

test("refund B: expired token — Stripe not called, no state change", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-B";
  await insertBooking(env, paidBooking(reference));
  const raw = "expired-token-value-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const tokenHash = await hashOperatorToken(raw);
  await env.DB.prepare(
    `INSERT INTO operator_action_tokens (id, booking_reference, token_hash, expires_at, consumed_at, created_at)
     VALUES (?, ?, ?, ?, NULL, ?)`,
  )
    .bind(crypto.randomUUID(), reference, tokenHash, new Date(Date.now() - 60_000).toISOString(), new Date().toISOString())
    .run();
  const calls = installStripeMock({});
  const response = await postDeclineAction(env, reference, raw);
  assert.equal(response.status, 403);
  assert.equal(calls.length, 0);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.payment_status, "paid");
  assert.equal(booking?.status, "requested");
  assert.equal(booking?.stripe_refund_id, null);
});

test("refund C: token for wrong booking — Stripe not called", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-C1";
  const other = "W2ODE-REFUND-C2";
  await insertBooking(env, paidBooking(reference));
  await insertBooking(env, paidBooking(other));
  const token = await createOperatorReviewToken(env, other);
  const calls = installStripeMock({});
  const response = await postDeclineAction(env, reference, token);
  assert.equal(response.status, 403);
  assert.equal(calls.length, 0);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.payment_status, "paid");
});

test("refund D: reused token — second action rejected, no second refund", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-D";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    const first = await postDeclineAction(env, reference, token);
    assert.equal(first.status, 200);
    assert.equal(calls.length, 1);
    const second = await postDeclineAction(env, reference, token);
    assert.equal(second.status, 403);
    assert.equal(calls.length, 1);
    assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 1);
  } finally {
    restoreFetch();
  }
});

test("refund E: already refunded booking — Stripe not called again", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-E";
  await insertBooking(
    env,
    paidBooking(reference, {
      payment_status: "refunded",
      status: "supplier_declined",
      stripe_refund_id: "re_existing",
    }),
  );
  const calls = installStripeMock({});
  const result = await declineBooking(env, reference, { source: "token", tokenId: "tok-e" });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.duplicate, true);
  assert.equal(calls.length, 0);
  assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 0);
});

test("refund F: Stripe refund failure — remains paid/requested, audit refund_failed", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-F";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  installStripeMock({ refundFail: true });
  const response = await postDeclineAction(env, reference, token);
  assert.equal(response.status, 502);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.payment_status, "paid");
  assert.equal(booking?.status, "requested");
  assert.equal(booking?.stripe_refund_id, null);
  const audit = await listAudit(env, reference);
  assert.ok(audit.some((row) => row.result === "refund_failed"));
  assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 0);
});

test("refund G: Stripe success + email delivery failure — refund kept, outbox retryable", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-G";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("fail");
  try {
    const response = await postDeclineAction(env, reference, token);
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.payment_status, "refunded");
    assert.equal(booking?.status, "supplier_declined");
    assert.equal(booking?.stripe_refund_id, "re_mock_1");
    const outbox = await listOutbox(env, reference);
    assert.equal(outbox.length, 1);
    assert.equal(outbox[0]?.kind, "customer_declined");
    assert.equal(outbox[0]?.status, "failed");
  } finally {
    restoreFetch();
  }
});

test("refund H: duplicate charge.refunded webhook — state stable, no duplicate email", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-H";
  const pi = `pi_test_${reference}`;
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    await postDeclineAction(env, reference, token);
    assert.equal(calls.length, 1);
    assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 1);
    await markRefundedFromCharge(env, pi, true);
    await markRefundedFromCharge(env, pi, true);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.payment_status, "refunded");
    assert.equal(booking?.status, "supplier_declined");
    assert.equal(await countEmailOutbox(env, reference, "customer_declined"), 1);
    assert.equal(calls.length, 1);
  } finally {
    restoreFetch();
  }
});

test("O-12 charge.refunded persists stripe_refund_id and keeps confirmed status", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-ID";
  const pi = `pi_test_${reference}`;
  await insertBooking(
    env,
    paidBooking(reference, {
      status: "confirmed",
      payment_status: "paid",
      stripe_payment_intent_id: pi,
      stripe_refund_id: null,
    }),
  );
  await markRefundedFromCharge(env, pi, true, "re_o12_persist");
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.status, "confirmed");
  assert.equal(booking?.payment_status, "refunded");
  assert.equal(booking?.stripe_refund_id, "re_o12_persist");

  // Null must not wipe an existing refund id (COALESCE behaviour).
  await markRefundedFromCharge(env, pi, true, null);
  const again = await getBookingByReference(env, reference);
  assert.equal(again?.stripe_refund_id, "re_o12_persist");
});

test("O-12 refundIdFromCharge reads newest re_ id from charge.refunds.data", async () => {
  const { refundIdFromCharge } = await import("./fulfill");
  const id = refundIdFromCharge({
    refunds: {
      data: [{ id: "re_newest" }, { id: "re_older" }],
    },
  } as never);
  assert.equal(id, "re_newest");
  assert.equal(refundIdFromCharge({ refunds: { data: [] } } as never), null);
});

test("refund I: client-supplied amount tampering ignored — server full refund only", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-I";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    const response = await postDeclineAction(env, reference, token, {
      amount: "1",
      amountCents: "1",
      refundAmount: "50",
    });
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.params.amount, undefined);
    assert.equal(calls[0]?.params.payment_intent, `pi_test_${reference}`);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.amount_total_cents, 9600);
    assert.equal(booking?.payment_status, "refunded");
  } finally {
    restoreFetch();
  }
});

test("refund J: LIVE header decline without valid operator authorisation — forbidden", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db, {
    PAYMENTS_MODE: "live",
    STRIPE_SECRET_KEY: "sk_live_refund_mock",
    OPERATOR_TOKEN: "operator-header-secret",
  });
  const reference = "W2ODE-REFUND-J";
  await insertBooking(env, paidBooking(reference));
  const calls = installStripeMock({});
  const response = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/decline", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Olden-Operator-Token": "operator-header-secret",
      },
      body: JSON.stringify({ reference, amount: 1 }),
    }),
    env,
  );
  assert.equal(response.status, 403);
  const data = (await response.json()) as { code?: string };
  assert.equal(data.code, "OPERATOR_FORBIDDEN");
  assert.equal(calls.length, 0);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.payment_status, "paid");
  assert.equal(booking?.status, "requested");
});

test("refund live path: tokenised LIVE review allowed when LIVE_PAYMENTS_CODE_ENABLED is true", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db, {
    PAYMENTS_MODE: "live",
    STRIPE_SECRET_KEY: "sk_live_refund_mock",
  });
  const reference = "W2ODE-REFUND-LIVE";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const page = await worker.fetch(
    new Request(
      `http://bookings.test/operator/review?ref=${encodeURIComponent(reference)}&t=${encodeURIComponent(token)}&step=decline`,
    ),
    env,
  );
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /Unable to confirm|Decline|Refund/i);

  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    const action = await postDeclineAction(env, reference, token, {
      auditReason: "O-13 live tokenised decline allowed",
    });
    assert.equal(action.status, 200);
    assert.equal(calls.length, 1);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.status, "supplier_declined");
    assert.equal(booking?.payment_status, "refunded");
  } finally {
    restoreFetch();
  }
});


test("operator confirm via single-use token", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-CONFIRM-A";
  await insertBooking(env, paidBooking(reference));
  const token = await createOperatorReviewToken(env, reference);
  const restoreFetch = installResendMock("success");
  try {
    const body = new URLSearchParams({ ref: reference, t: token, action: "confirm" });
    const response = await worker.fetch(
      new Request("http://bookings.test/operator/review/action", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }),
      env,
    );
    assert.equal(response.status, 200);
    const booking = await getBookingByReference(env, reference);
    assert.equal(booking?.status, "confirmed");
    assert.equal(booking?.payment_status, "paid");
    assert.equal(await countEmailOutbox(env, reference, "customer_confirmed"), 1);

    const second = await worker.fetch(
      new Request("http://bookings.test/operator/review/action", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }),
      env,
    );
    assert.equal(second.status, 403);
    assert.equal(await countEmailOutbox(env, reference, "customer_confirmed"), 1);
  } finally {
    restoreFetch();
  }
});

test("payment failure marks payment_failed not confirmed", async () => {
  const { markPaymentFailedFromIntent } = await import("./fulfill");
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-PAYFAIL-A";
  const now = new Date().toISOString();
  await insertBooking(
    env,
    paidBooking(reference, {
      status: "payment_pending",
      payment_status: "unpaid",
      stripe_payment_intent_id: "pi_fail_test",
      created_at: now,
      updated_at: now,
    }),
  );
  await markPaymentFailedFromIntent(env, { id: "pi_fail_test", metadata: { booking_ref: reference } } as never);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.status, "payment_failed");
  assert.equal(booking?.payment_status, "failed");
  assert.notEqual(booking?.status, "confirmed");
});

test("fulfillPaidBooking sets requested/paid idempotently (not confirmed)", async () => {
  const { fulfillPaidBooking } = await import("./fulfill");
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-PAID-A";
  await insertBooking(
    env,
    paidBooking(reference, {
      status: "payment_pending",
      payment_status: "unpaid",
    }),
  );
  const first = await fulfillPaidBooking(env, (await getBookingByReference(env, reference))!);
  assert.equal(first.status, "requested");
  assert.equal(first.payment_status, "paid");
  const second = await fulfillPaidBooking(env, first);
  assert.equal(second.status, "requested");
  assert.equal(second.payment_status, "paid");
  assert.notEqual(second.status, "confirmed");
});

test("operator decline refund omits customer-requested reason (unable_to_confirm metadata)", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REFUND-REASON";
  await insertBooking(env, paidBooking(reference));
  const calls = installStripeMock({});
  const restoreFetch = installResendMock("success");
  try {
    const result = await declineBooking(env, reference, { source: "header" });
    assert.equal(result.ok, true);
    assert.equal(calls[0]?.params.reason, undefined);
    assert.doesNotMatch(JSON.stringify(calls[0]?.params ?? {}), /requested_by_customer/);
    assert.equal(calls[0]?.params.metadata?.refund_cause, "unable_to_confirm");
  } finally {
    restoreFetch();
  }
});

test("reissue review token invalidates prior token and audits", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db, { OPERATOR_PORTAL_BASE_URL: "https://olden-bookings-test.example" });
  const reference = "W2ODE-REISSUE-A";
  await insertBooking(env, paidBooking(reference));
  const first = await createOperatorReviewToken(env, reference);
  const reissued = await reissueOperatorReviewToken(env, reference);
  assert.equal(reissued.ok, true);
  if (!reissued.ok) return;
  assert.equal(reissued.invalidatedPrior, 1);
  assert.ok(reissued.reviewUrl?.includes(reference));
  const oldValidation = await validateOperatorReviewToken(env, reference, first);
  assert.equal(oldValidation.ok, false);
  const newValidation = await validateOperatorReviewToken(env, reference, reissued.token);
  assert.equal(newValidation.ok, true);
  const audit = await listAudit(env, reference);
  assert.ok(audit.some((row) => row.action_type === "reissue" && row.result === "token_reissued"));
});

test("reissue is rejected for confirmed bookings", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const reference = "W2ODE-REISSUE-B";
  await insertBooking(env, paidBooking(reference, { status: "confirmed" }));
  const result = await reissueOperatorReviewToken(env, reference);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.code, "NOT_ACTIONABLE");
});

test("unresolved list surfaces aged paid/requested bookings only", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db);
  const now = Date.now();
  const oldCreated = new Date(now - (OPS_RESPONSE_SLA_HOURS + 2) * 60 * 60 * 1000).toISOString();
  const freshCreated = new Date(now - 60 * 60 * 1000).toISOString();
  await insertBooking(
    env,
    paidBooking("W2ODE-STALE-1", { created_at: oldCreated, updated_at: oldCreated }),
  );
  await insertBooking(
    env,
    paidBooking("W2ODE-STALE-2", {
      status: "confirmed",
      created_at: oldCreated,
      updated_at: oldCreated,
    }),
  );
  await insertBooking(
    env,
    paidBooking("W2ODE-FRESH-1", { created_at: freshCreated, updated_at: freshCreated }),
  );
  const rows = await listUnresolvedRequestedBookings(env, OPS_RESPONSE_SLA_HOURS, now);
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.booking_reference, "W2ODE-STALE-1");
});

test("authenticated reissue endpoint returns review URL", async () => {
  const db = createMemoryD1();
  const env = baseEnv(db, { OPERATOR_PORTAL_BASE_URL: "https://olden-bookings-test.example" });
  const reference = "W2ODE-REISSUE-HTTP";
  await insertBooking(env, paidBooking(reference));
  const response = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/reissue-review", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Olden-Operator-Token": "operator-header-secret",
      },
      body: JSON.stringify({ reference }),
    }),
    env,
  );
  assert.equal(response.status, 200);
  const body = (await response.json()) as { ok: boolean; reviewUrl?: string };
  assert.equal(body.ok, true);
  assert.match(body.reviewUrl ?? "", /operator\/review/);
});

function liveRecoveryEnv(db: D1Database, overrides: Record<string, unknown> = {}): Env {
  return baseEnv(db, {
    PAYMENTS_MODE: "live",
    STRIPE_SECRET_KEY: "sk_live_recovery_mock",
    OPERATOR_TOKEN: "operator-live-secret",
    OPERATOR_TEST_TOKEN: "operator-test-secret-must-not-work-in-live",
    OPERATOR_PORTAL_BASE_URL: "https://olden-bookings-prod.example",
    ...overrides,
  });
}

test("O-8B live unresolved + valid operator auth allowed with LIVE_PAYMENTS_CODE_ENABLED", async () => {
  assert.equal(LIVE_PAYMENTS_CODE_ENABLED, true);
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const now = Date.now();
  const oldCreated = new Date(now - 30 * 60 * 60 * 1000).toISOString();
  await insertBooking(
    env,
    paidBooking("W2ODE-LIVE-UNRES-1", { created_at: oldCreated, updated_at: oldCreated }),
  );
  const res = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/unresolved?olderThanHours=24", {
      headers: { "X-Olden-Operator-Token": "operator-live-secret" },
    }),
    env,
  );
  assert.equal(res.status, 200);
  const body = (await res.json()) as { ok: boolean; count: number; bookings: Array<{ booking_reference: string }> };
  assert.equal(body.ok, true);
  assert.equal(body.count, 1);
  assert.equal(body.bookings[0]?.booking_reference, "W2ODE-LIVE-UNRES-1");
});

test("O-8B live unresolved without auth rejected", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const res = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/unresolved"),
    env,
  );
  assert.equal(res.status, 403);
  const body = (await res.json()) as { code?: string };
  assert.equal(body.code, "OPERATOR_FORBIDDEN");
});

test("O-8B live unresolved rejects OPERATOR_TEST_TOKEN", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const res = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/unresolved", {
      headers: { "X-Olden-Operator-Token": "operator-test-secret-must-not-work-in-live" },
    }),
    env,
  );
  assert.equal(res.status, 403);
});

test("O-8B live reissue + valid auth allowed for eligible booking", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const reference = "W2ODE-LIVE-REISSUE-1";
  await insertBooking(env, paidBooking(reference));
  const prior = await createOperatorReviewToken(env, reference);
  const before = Date.now();
  const res = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/reissue-review", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Olden-Operator-Token": "operator-live-secret",
      },
      body: JSON.stringify({ reference }),
    }),
    env,
  );
  assert.equal(res.status, 200);
  const body = (await res.json()) as {
    ok: boolean;
    token?: string;
    invalidatedPrior?: number;
    reviewUrl?: string;
  };
  assert.equal(body.ok, true);
  assert.equal(body.invalidatedPrior, 1);
  assert.ok(body.token);
  assert.match(body.reviewUrl ?? "", /operator\/review/);

  const oldCheck = await validateOperatorReviewToken(env, reference, prior);
  assert.equal(oldCheck.ok, false);

  const newCheck = await validateOperatorReviewToken(env, reference, body.token!);
  assert.equal(newCheck.ok, true);

  const tokenRow = await env.DB.prepare(`SELECT * FROM operator_action_tokens WHERE token_hash = ? LIMIT 1`)
    .bind(await hashOperatorToken(body.token!))
    .first<OperatorActionTokenRow>();
  assert.ok(tokenRow);
  const ttlMs = Date.parse(tokenRow!.expires_at) - before;
  assert.ok(ttlMs > OPERATOR_TOKEN_TTL_MS - 5_000);
  assert.ok(ttlMs < OPERATOR_TOKEN_TTL_MS + 5_000);

  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.status, "requested");
  assert.equal(booking?.payment_status, "paid");
  assert.equal(booking?.stripe_refund_id, null);

  const audit = await listAudit(env, reference);
  assert.ok(audit.some((row) => row.action_type === "reissue" && row.result === "token_reissued"));
});

test("O-8B live reissue without auth rejected", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const reference = "W2ODE-LIVE-REISSUE-2";
  await insertBooking(env, paidBooking(reference));
  const res = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/reissue-review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference }),
    }),
    env,
  );
  assert.equal(res.status, 403);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.status, "requested");
  assert.equal(booking?.payment_status, "paid");
});

test("O-8B customer/session credentials cannot call operator recovery", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const reference = "W2ODE-LIVE-REISSUE-3";
  await insertBooking(
    env,
    paidBooking(reference, {
      stripe_checkout_session_id: "cs_live_customer_probe",
    }),
  );

  const unresolved = await worker.fetch(
    new Request(
      `http://bookings.test/api/bookings/operator/unresolved?ref=${encodeURIComponent(reference)}&session_id=cs_live_customer_probe`,
    ),
    env,
  );
  assert.equal(unresolved.status, 403);

  const reissue = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/reissue-review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        reference,
        session_id: "cs_live_customer_probe",
        bookingSessionId: "sess-customer",
      }),
    }),
    env,
  );
  assert.equal(reissue.status, 403);

  const session = await worker.fetch(
    new Request(
      `http://bookings.test/api/bookings/session?ref=${encodeURIComponent(reference)}&session_id=cs_live_customer_probe`,
    ),
    env,
  );
  // Session may 502 without Stripe mock — either way it must not unlock operator routes.
  assert.notEqual(session.status, 403);
  assert.ok(session.status === 200 || session.status === 502 || session.status === 503);
});

test("O-8B live header confirm/decline remain forbidden (separate from recovery)", async () => {
  const db = createMemoryD1();
  const env = liveRecoveryEnv(db);
  const reference = "W2ODE-LIVE-MUTATE-1";
  await insertBooking(env, paidBooking(reference));
  const confirm = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/confirm", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Olden-Operator-Token": "operator-live-secret",
      },
      body: JSON.stringify({ reference }),
    }),
    env,
  );
  assert.equal(confirm.status, 403);
  const decline = await worker.fetch(
    new Request("http://bookings.test/api/bookings/operator/decline", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Olden-Operator-Token": "operator-live-secret",
      },
      body: JSON.stringify({ reference }),
    }),
    env,
  );
  assert.equal(decline.status, 403);
  const booking = await getBookingByReference(env, reference);
  assert.equal(booking?.status, "requested");
  assert.equal(booking?.payment_status, "paid");
});
