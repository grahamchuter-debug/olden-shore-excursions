# OLDEN WORLD 2.0 — PHASE O-2

## Briksdal page upgrade + direct request-to-book / PRODUCTION LOCKED

**Date:** 2026-09-08  
**Baseline HEAD:** `d41dc4f707474826823e18f325b8c87ab26073b6`  
**URL preserved:** `/excursions/briksdal-glacier-olden-lake`

---

## What shipped in code

### Page
- Accurate 4-hour product copy, itinerary, walking suitability, prices €96 / €56 / FREE
- Little Red Church on route; meeting at Olden cruise terminal area
- 48-hour free cancellation customer policy
- Gallery 8 local Wikimedia-attributed images with on-page credits
- CTA → `/book/briksdal-glacier-olden-lake` (public checkout **locked**)

### Booking architecture (Belize/St Lucia pattern)
- `shared/world-booking/**`
- `shared/destinations/olden.ts` + `olden-products.ts`
- `workers/bookings/**` (test + prod wrangler shells)
- Prefix: **W2ODE-**
- Currency: **EUR**
- Max online guests: **10**
- Child/booster seat conditional fields → `operationalNotes`
- Lifecycle: payment → `requested` → operator confirm / decline+refund

### Production gates (ALL FALSE for live)
| Gate | Value |
| --- | --- |
| `LIVE_PAYMENTS_CODE_ENABLED` | `false` (code) |
| Prod `BOOKINGS_ENABLED` | `"false"` |
| Prod `EMAIL_SENDING_ENABLED` | `"false"` |
| Public UI status | `PRODUCTION_READY_LOCKED` |

Unlock phrase (secret, not set): `OLDEN_LIVE_UNLOCK`

---

## INTERNAL fulfilment (never publish)

```yaml
fulfilment_mode: DIRECT_SUPPLIER_MANUAL
supplier: Norway Excursions
adult_sell_eur: 96
adult_cost_eur: 82
child_sell_eur: 56
child_cost_eur: 41
infant_sell_eur: 0
commercial_review: AFTER_6_MONTHS
future_action: REQUEST_COMMISSION_OR_TRADE_MODEL
```

---

## Cloudflare / secrets — Graham actions required

Wrangler was **not logged in** in this agent environment (`Failed to fetch auth token`).

### 1. Authenticate
```bash
cd /Users/graham.chuter/Desktop/Norway-World-2.0/olden-shore-excursions
npx wrangler login
```

### 2. Create D1 and patch UUIDs into wrangler configs
```bash
npx wrangler d1 create olden-bookings-test
npx wrangler d1 create olden-bookings-prod
# Replace PLACEHOLDER / 00000000-… database_id values in:
#   workers/bookings/wrangler.jsonc
#   workers/bookings/wrangler.prod.jsonc
npx wrangler d1 migrations apply olden-bookings-test --remote --config workers/bookings/wrangler.jsonc
npx wrangler d1 migrations apply olden-bookings-prod --remote --config workers/bookings/wrangler.prod.jsonc
```

### 3. Deploy Workers (still locked)
```bash
npm run bookings:deploy:test
npm run bookings:deploy:prod
```
Update `src/lib/booking/commercial-config.ts` `bookingsApiUrl` to the test Worker URL after deploy.

### 4. Secrets — set via dashboard or wrangler; **do not paste into Cursor**
```bash
# TEST Worker
npx wrangler secret put STRIPE_SECRET_KEY --config workers/bookings/wrangler.jsonc
npx wrangler secret put STRIPE_WEBHOOK_SECRET --config workers/bookings/wrangler.jsonc
npx wrangler secret put OPERATOR_TEST_TOKEN --config workers/bookings/wrangler.jsonc
# optional later:
# npx wrangler secret put RESEND_API_KEY --config workers/bookings/wrangler.jsonc

# PROD Worker — create secrets but keep BOOKINGS_ENABLED=false
npx wrangler secret put STRIPE_SECRET_KEY --config workers/bookings/wrangler.prod.jsonc
npx wrangler secret put STRIPE_WEBHOOK_SECRET --config workers/bookings/wrangler.prod.jsonc
npx wrangler secret put OPERATOR_TOKEN --config workers/bookings/wrangler.prod.jsonc
# DO NOT set LIVE_PAYMENTS_UNLOCK until O-3+ controlled unlock
```

### 5. Site deploy (content + locked booking UI)
```bash
npm run build && npx wrangler deploy
```

### Email sending domain
Transactional sender not yet configured for Olden.  
Current reply-to: `hello@oldenshoreexcursions.com`  
From pattern used in Worker vars: `bookings@notifications.wowatour.com` (shared Wow A Tour notifications domain — verify SPF/DKIM ownership before enabling `EMAIL_SENDING_ENABLED`).

---

## Pre-existing dirty file

`scripts/sync-olden-schedules.mjs` — **untouched, unstaged, not committed**.

---

## Next phase

**PHASE O-3 — TEST/SANDBOX LIFECYCLE PROOF**

After wrangler login + D1 + test secrets:
1. TEST checkout with Stripe test cards
2. Webhook → requested/paid
3. Operator confirm / decline+refund proof
4. Email templates dry-run (sending still false until proven)
5. Keep production locked
