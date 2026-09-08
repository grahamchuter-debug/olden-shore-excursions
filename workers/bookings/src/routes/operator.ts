import { jsonResponse } from "../cors";
import { confirmBooking, declineBooking } from "../operator-actions";
import {
  listUnresolvedRequestedBookings,
  OPS_ESCALATION_HOURS,
  OPS_RESPONSE_SLA_HOURS,
  reissueOperatorReviewToken,
} from "../operator-tokens";

/**
 * Strong operator header authentication.
 * Live mode requires OPERATOR_TOKEN only (never OPERATOR_TEST_TOKEN).
 * Independent of LIVE_PAYMENTS_CODE_ENABLED — support tooling ≠ payment creation.
 */
export function operatorHeaderAuthenticated(request: Request, env: Env): boolean {
  const mode = String(env.PAYMENTS_MODE ?? "");
  const expected =
    mode === "live"
      ? (env.OPERATOR_TOKEN ?? "").trim()
      : (env.OPERATOR_TOKEN ?? "").trim() || (env.OPERATOR_TEST_TOKEN ?? "").trim();
  if (!expected) return false;
  const header = request.headers.get("X-Olden-Operator-Token")?.trim();
  return Boolean(header && header === expected);
}

/**
 * Header confirm/decline remain unavailable in live mode.
 * Live confirm/decline uses the single-use review-token portal once live payments are unlocked.
 */
function operatorMutationAllowed(request: Request, env: Env): boolean {
  if (String(env.PAYMENTS_MODE) === "live") return false;
  return operatorHeaderAuthenticated(request, env);
}

/**
 * Recovery tooling (unresolved list + review-token reissue) is allowed in live mode
 * when the production OPERATOR_TOKEN header is present. Does not create payments,
 * confirm, or refund.
 */
function operatorRecoveryAllowed(request: Request, env: Env): boolean {
  return operatorHeaderAuthenticated(request, env);
}

async function readReference(request: Request): Promise<string | null> {
  const body = (await request.json().catch(() => null)) as { reference?: string } | null;
  const reference = body?.reference?.trim();
  return reference || null;
}

export async function handleOperatorConfirm(request: Request, env: Env): Promise<Response> {
  if (!operatorMutationAllowed(request, env)) {
    return jsonResponse({ ok: false, code: "OPERATOR_FORBIDDEN", message: "Operator confirm requires authentication." }, 403);
  }
  const reference = await readReference(request);
  if (!reference) return jsonResponse({ ok: false, code: "REFERENCE", message: "Booking reference is required." }, 400);

  const result = await confirmBooking(env, reference, { source: "header" });
  if (!result.ok) {
    return jsonResponse({ ok: false, code: result.code, message: result.message }, result.httpStatus);
  }
  return jsonResponse({
    ok: true,
    reference: result.reference,
    status: result.status,
    payment_status: result.payment_status,
    refunded: false,
    duplicate: result.duplicate ?? false,
  });
}

export async function handleOperatorDecline(request: Request, env: Env): Promise<Response> {
  if (!operatorMutationAllowed(request, env)) {
    return jsonResponse({ ok: false, code: "OPERATOR_FORBIDDEN", message: "Operator decline requires authentication." }, 403);
  }
  const reference = await readReference(request);
  if (!reference) return jsonResponse({ ok: false, code: "REFERENCE", message: "Booking reference is required." }, 400);

  const result = await declineBooking(env, reference, { source: "header" });
  if (!result.ok) {
    return jsonResponse({ ok: false, code: result.code, message: result.message }, result.httpStatus);
  }
  return jsonResponse({
    ok: true,
    reference: result.reference,
    status: result.status,
    payment_status: result.payment_status,
    refundId: result.refundId,
    refundStatus: result.refundStatus,
    refunded: result.refunded,
    amountRefundedCents: result.amountRefundedCents,
    duplicate: result.duplicate ?? false,
  });
}

/**
 * Reissue a review link for a paid/requested booking (token expiry recovery).
 * Auth-gated; permitted in live mode with OPERATOR_TOKEN. Never confirms/refunds.
 */
export async function handleOperatorReissueReview(request: Request, env: Env): Promise<Response> {
  if (!operatorRecoveryAllowed(request, env)) {
    return jsonResponse(
      { ok: false, code: "OPERATOR_FORBIDDEN", message: "Operator reissue requires authentication." },
      403,
    );
  }
  const reference = await readReference(request);
  if (!reference) return jsonResponse({ ok: false, code: "REFERENCE", message: "Booking reference is required." }, 400);

  const result = await reissueOperatorReviewToken(env, reference);
  if (!result.ok) {
    const status = result.code === "NOT_FOUND" ? 404 : 409;
    return jsonResponse({ ok: false, code: result.code, message: result.message }, status);
  }
  return jsonResponse({
    ok: true,
    reference: result.reference,
    reviewUrl: result.reviewUrl,
    invalidatedPrior: result.invalidatedPrior,
    // Token returned only over authenticated operator channel — never email to customer.
    token: result.token,
  });
}

/** Ops chase list: paid/requested bookings older than SLA/escalation thresholds. */
export async function handleOperatorUnresolved(request: Request, env: Env): Promise<Response> {
  if (!operatorRecoveryAllowed(request, env)) {
    return jsonResponse(
      { ok: false, code: "OPERATOR_FORBIDDEN", message: "Operator unresolved list requires authentication." },
      403,
    );
  }
  const url = new URL(request.url);
  const hoursParam = Number(url.searchParams.get("olderThanHours") || OPS_RESPONSE_SLA_HOURS);
  const olderThanHours = Number.isFinite(hoursParam) && hoursParam >= 0 ? hoursParam : OPS_RESPONSE_SLA_HOURS;
  const bookings = await listUnresolvedRequestedBookings(env, olderThanHours);
  return jsonResponse({
    ok: true,
    olderThanHours,
    slaHours: OPS_RESPONSE_SLA_HOURS,
    escalationHours: OPS_ESCALATION_HOURS,
    count: bookings.length,
    bookings,
  });
}
