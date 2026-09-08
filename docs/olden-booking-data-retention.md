# Olden booking data retention (operational)

Conservative operational policy for World 2.0 Olden direct booking data held in
Cloudflare D1. This is **not legal advice**. Adjust with counsel if needed.

## Principles

- Keep what is needed for fulfilment, support, refunds, accounting, and disputes.
- Separate long-lived financial/audit identifiers from short-lived contact copies.
- Prefer **anonymisation** of contact fields over destroying the booking row.
- **Do not auto-delete production data** until a production database exists and
  an operator explicitly runs a dry-run then apply job.

Code constants: `shared/world-booking/retention.ts`  
Dry-run helper: `scripts/retention-olden-bookings.ts`

## Retention by category

| Category | Period | Action |
|---|---|---|
| Financial / booking audit row (amounts, status, refs, operator audit) | 84 months (~7 years) from cruise date (else created_at) | Retain |
| Stripe identifiers | 84 months | Retain |
| Customer name / email / phone | 24 months from cruise date | Anonymise |
| Operational notes | 24 months | Clear with contact anonymisation |
| Email outbox HTML/text payload | 12 months from outbox created_at | Clear payload; keep status/metadata |
| Webhook `processed_events` | 24 months from processed_at | Delete row |

## Deletion / anonymisation approach

1. **Dry-run** — list candidates with `planRetentionActions` / script.
2. **Apply (future, authorised)** — set contact fields to redacted placeholders;
   replace outbox `payload_json` with a redacted stub; delete aged processed events.
3. Never auto-confirm or auto-refund as part of retention.

## Manual / scripted mechanism

```bash
npx tsx scripts/retention-olden-bookings.ts --dry-run
```

Production apply is intentionally not wired until production D1 exists.

## Privacy page

Public privacy copy should later mention booking retention windows. Flagged for a
future public-content update — not deployed in O-8.
