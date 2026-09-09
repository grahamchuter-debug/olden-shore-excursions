# Olden operator runbook — fulfilment, SLA & token recovery

## Production fulfilment workflow

Automated confirmation is **not** the customer’s tour ticket. The supplier-issued
ticket is the joining document (meeting instructions, pickup/meeting details,
and related operational information).

Required sequence after a successful payment:

1. **PAID / REQUESTED** — booking sits in World 2.0 as paid + requested  
2. Verify supplier availability  
3. **CONFIRM** the booking in World 2.0 (or **DECLINE** + full refund if unavailable)  
4. Automated confirmation email is sent to the customer  
5. Obtain the **supplier-issued tour ticket**  
6. **SEND SUPPLIER TICKET MANUALLY** to the customer (required)  
7. Operational fulfilment complete  

### SEND SUPPLIER TICKET MANUALLY

This is a **required operator step after confirmation**.

- Do **not** treat the automated confirmation email as the tour ticket  
- Send the supplier ticket separately to the customer’s email  
- The ticket must include the applicable joining / meeting instructions  
- Do **not** invent meeting points, pickup times, emergency numbers, or voucher
  wording in World 2.0 automated mail  

No supplier-ticket automation in World 2.0 for this phase.

## SLA

| Window | Expectation |
|---|---|
| 0–24h after payment (`OPS_RESPONSE_SLA_HOURS`) | Ops confirms or declines the booking |
| 24–48h (`OPS_ESCALATION_HOURS`) | Escalate internally; chase unresolved list |
| 72h | Original review token expires |
| After CONFIRM | Obtain supplier ticket and **send it manually** to the customer |

Do **not** auto-confirm. Do **not** auto-refund unless an operator explicitly declines.

## Chase unresolved bookings

Authenticated TEST operator (header `X-Olden-Operator-Token`):

```http
GET /api/bookings/operator/unresolved?olderThanHours=24
```

Returns paid/`requested` bookings older than the threshold.

## Reissue review token

When a link expired or was lost, and the booking is still `requested` + `paid`:

```http
POST /api/bookings/operator/reissue-review
X-Olden-Operator-Token: <secret>
Content-Type: application/json

{ "reference": "W2ODE-…" }
```

Effects:
- invalidates prior **unconsumed** tokens for that booking
- issues a new 72h token + review URL
- writes `operator_audit_log` action `reissue`

Live `PAYMENTS_MODE=live` continues to block **header** confirm/decline
(those use the single-use review portal once live payments are unlocked).

Recovery endpoints remain available in live mode with the production
`OPERATOR_TOKEN` header (`X-Olden-Operator-Token`). They do not require
`LIVE_PAYMENTS_CODE_ENABLED=true` and never confirm or refund.

## Email / outbox note (O-10E)

Isolated synthetic Worker outbox delivery (O-10E) was **not** implemented: the
production outbox path is driven by real booking/operator lifecycle events
(payment fulfilment and confirm/decline). Do not add a temporary production
endpoint solely for email smoke tests. The first controlled live transaction
(with public frontend still locked) may serve as Worker → outbox → Resend proof.
