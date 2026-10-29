PASS

## spec-compliance: U-048 "Webhook intake" (head 05cf1a7)

Static read against the pattern note, units.yaml, design doc 4.2.3. 16 criteria PASS: raw body cap 413; signature 400 logging kind only; one-transaction insert with ON CONFLICT and one job only on create, no Caller; advisory lock then session, hold, order, time after locks; retrieve-matching, unmatched retry, alert at 5, give-up at 25; pure `providerEventAction` with table tests per row; succeeded/failed/requires_action/canceled rows; Q3 deferred types; transitions through U-015 functions, `processed_at` in the same transaction; late/out-of-order/repeated delivery equals in-order (db test 863); Q1 seam and Q2 alert; Q4 one route; 18 files under src/ or tests/.
Blocking: none.
Non-blocking:
- Q1 deviation: the job completes and nothing re-enqueues `confirm_unavailable` (or `duplicate_payment`) events; U-049's and U-109's scopes do not mention a drain. U-049 must ship a drain (select `provider_events` with `processed_at` null, type `payment.succeeded`, attempt `succeeded` or live; enqueue `process-provider-event` with a fresh dedupe key), or a payment that succeeds before U-049 is never confirmed. Same for U-109. Re-confirm path covered by db test 409.
- `order-events:{id}` lock taken before the session lock but not listed in the `locks.ts` lock-order header.
- `retrieve` called inside the job's open transaction.
- Locked order row's hold and session ids not compared with the unlocked read (only matters if an order's hold can change).
- `lockOrderRow` overlap with U-047a.
Unconfirmed: whether any unit moves an order from `payment_failed` back to `pending_payment` on a retry; if none does, tries 2 to 5 only update the attempt and the order is never voided.
