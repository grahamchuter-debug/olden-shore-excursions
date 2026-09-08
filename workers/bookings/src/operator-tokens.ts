import { getBookingByReference } from "./db";

export type OperatorActionTokenRow = {
  id: string;
  booking_reference: string;
  token_hash: string;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
};

export type OperatorAuditRow = {
  id: string;
  booking_reference: string;
  action_type: string;
  result: string;
  source: string;
  token_id: string | null;
  detail: string | null;
  created_at: string;
};

type TokenEnv = { DB: D1Database };

export const OPERATOR_TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

/** Ops should action paid/requested bookings within this window. */
export const OPS_RESPONSE_SLA_HOURS = 24;

/** Escalate / reissue review link if still unresolved after this window. */
export const OPS_ESCALATION_HOURS = 48;

export type StaleRequestedBooking = {
  booking_reference: string;
  product_id: string;
  cruise_date: string;
  customer_email: string;
  amount_total_cents: number;
  currency: string;
  created_at: string;
  age_hours: number;
};

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashOperatorToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return bytesToHex(new Uint8Array(digest));
}

export function generateOperatorToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return bytesToHex(bytes);
}

export function buildOperatorReviewUrl(baseUrl: string, reference: string, token: string): string {
  const root = baseUrl.replace(/\/$/, "");
  const params = new URLSearchParams({ ref: reference, t: token });
  return `${root}/operator/review?${params.toString()}`;
}

export async function createOperatorReviewToken(env: TokenEnv, bookingReference: string): Promise<string> {
  const token = generateOperatorToken();
  const tokenHash = await hashOperatorToken(token);
  const now = Date.now();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO operator_action_tokens (id, booking_reference, token_hash, expires_at, consumed_at, created_at)
     VALUES (?, ?, ?, ?, NULL, ?)`,
  )
    .bind(id, bookingReference, tokenHash, new Date(now + OPERATOR_TOKEN_TTL_MS).toISOString(), new Date(now).toISOString())
    .run();
  return token;
}

export type OperatorTokenValidation =
  | { ok: true; tokenId: string; bookingReference: string }
  | { ok: false; code: "INVALID" | "EXPIRED" | "USED" | "MISMATCH" | "NOT_FOUND" };

export async function validateOperatorReviewToken(
  env: TokenEnv,
  bookingReference: string,
  token: string,
): Promise<OperatorTokenValidation> {
  const trimmedRef = bookingReference.trim();
  const trimmedToken = token.trim();
  if (!trimmedRef || !trimmedToken) return { ok: false, code: "INVALID" };

  const tokenHash = await hashOperatorToken(trimmedToken);
  const row = await env.DB.prepare(
    `SELECT * FROM operator_action_tokens WHERE token_hash = ? LIMIT 1`,
  )
    .bind(tokenHash)
    .first<OperatorActionTokenRow>();

  if (!row) return { ok: false, code: "INVALID" };
  if (row.booking_reference !== trimmedRef) return { ok: false, code: "MISMATCH" };
  if (row.consumed_at) return { ok: false, code: "USED" };
  if (Date.parse(row.expires_at) <= Date.now()) return { ok: false, code: "EXPIRED" };
  return { ok: true, tokenId: row.id, bookingReference: trimmedRef };
}

export async function consumeOperatorReviewToken(env: TokenEnv, tokenId: string): Promise<void> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE operator_action_tokens SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL`,
  )
    .bind(now, tokenId)
    .run();
}

export async function recordOperatorAudit(
  env: TokenEnv,
  args: {
    bookingReference: string;
    actionType: "confirm" | "decline" | "reissue";
    result: string;
    source: "header" | "token";
    tokenId?: string | null;
    detail?: string | null;
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO operator_audit_log (id, booking_reference, action_type, result, source, token_id, detail, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      args.bookingReference,
      args.actionType,
      args.result.slice(0, 120),
      args.source,
      args.tokenId ?? null,
      args.detail?.slice(0, 400) ?? null,
      new Date().toISOString(),
    )
    .run();
}

export function operatorPortalBaseUrl(env: { OPERATOR_PORTAL_BASE_URL?: string; SITE_BASE_URL?: string }): string | null {
  const explicit = env.OPERATOR_PORTAL_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return null;
}

/**
 * Invalidate unused review tokens for a booking (e.g. before reissue).
 * Consumed tokens are left untouched for audit history.
 */
export async function invalidateUnconsumedOperatorTokens(
  env: TokenEnv,
  bookingReference: string,
): Promise<number> {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE operator_action_tokens
     SET consumed_at = ?
     WHERE booking_reference = ? AND consumed_at IS NULL`,
  )
    .bind(now, bookingReference.trim())
    .run();
  return Number(result.meta?.changes ?? 0);
}

/**
 * Reissue a fresh operator review token for a paid/requested booking.
 * Does not auto-confirm or auto-refund. Preserves audit trail.
 */
export async function reissueOperatorReviewToken(
  env: TokenEnv & { OPERATOR_PORTAL_BASE_URL?: string; SITE_BASE_URL?: string },
  bookingReference: string,
): Promise<
  | { ok: true; reference: string; token: string; reviewUrl: string | null; invalidatedPrior: number }
  | { ok: false; code: string; message: string }
> {
  const booking = await getBookingByReference(env, bookingReference);
  if (!booking) {
    return { ok: false, code: "NOT_FOUND", message: "Booking not found." };
  }
  if (booking.payment_status !== "paid" || booking.status !== "requested") {
    return {
      ok: false,
      code: "NOT_ACTIONABLE",
      message: "Only paid, unconfirmed (requested) bookings can receive a reissued review link.",
    };
  }

  const invalidatedPrior = await invalidateUnconsumedOperatorTokens(env, booking.booking_reference);
  const token = await createOperatorReviewToken(env, booking.booking_reference);
  const portalBase = operatorPortalBaseUrl(env);
  const reviewUrl = portalBase
    ? buildOperatorReviewUrl(portalBase, booking.booking_reference, token)
    : null;

  await recordOperatorAudit(env, {
    bookingReference: booking.booking_reference,
    actionType: "reissue",
    result: "token_reissued",
    source: "header",
    detail: `invalidated_prior=${invalidatedPrior}`,
  });

  return {
    ok: true,
    reference: booking.booking_reference,
    token,
    reviewUrl,
    invalidatedPrior,
  };
}

/**
 * List paid/requested bookings older than the given threshold (ops chase list).
 * No auto-confirm / auto-refund — surfacing only.
 */
export async function listUnresolvedRequestedBookings(
  env: TokenEnv,
  olderThanHours: number,
  nowMs: number = Date.now(),
): Promise<StaleRequestedBooking[]> {
  const cutoff = new Date(nowMs - Math.max(0, olderThanHours) * 60 * 60 * 1000).toISOString();
  const rows =
    (
      await env.DB.prepare(
        `SELECT booking_reference, product_id, cruise_date, customer_email, amount_total_cents, currency, created_at
         FROM bookings
         WHERE status = 'requested' AND payment_status = 'paid' AND created_at <= ?
         ORDER BY created_at ASC`,
      )
        .bind(cutoff)
        .all<{
          booking_reference: string;
          product_id: string;
          cruise_date: string;
          customer_email: string;
          amount_total_cents: number;
          currency: string;
          created_at: string;
        }>()
    ).results ?? [];

  return rows.map((row) => ({
    ...row,
    age_hours: Math.max(0, Math.round((nowMs - Date.parse(row.created_at)) / (60 * 60 * 1000))),
  }));
}
