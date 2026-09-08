# Olden operator runbook — paid/requested SLA & token recovery

## SLA

| Window | Expectation |
|---|---|
| 0–24h after payment (`OPS_RESPONSE_SLA_HOURS`) | Ops confirms or declines the booking |
| 24–48h (`OPS_ESCALATION_HOURS`) | Escalate internally; chase unresolved list |
| 72h | Original review token expires |

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
