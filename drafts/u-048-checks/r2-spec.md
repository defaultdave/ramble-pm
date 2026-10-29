PASS

## spec-compliance: U-048 round 2 (head 6de1064)

Static read.
- Stranded success fixed under the ruling: `confirm` case `afterConfirm(result.status) === 'retry'` calls `recordRetry(tx, event, 'confirm_unavailable')`; `succeeded` kept; `eventRetry` (`src/lib/providerEvents.ts:507-525`) counts the try, backs off, key `process-provider-event:<id>:<tries>`; at `maxEventAttempts` `runAfter` null and `gave_up`; no alert before the cap; `alertFor` (`:556-580`) raises `payment-confirm-unavailable` keyed `event:<id>:gave-up`; tests at `tests/db/provider-events.db.test.ts:400` (retry then a working seam via `jobRegistry` confirms) and `:464` (give-up key).
- Duplicate payment: returns `left`, one alert per event.
- Events lock named first in the header (`lockOrderEvents`); `retrieve` moved to `prepareProviderEvent` before `db.transaction` (`readEventToLookUp` on `db`); post-lock re-read with the two-handler test at `:856`.
- `lockOrderRow(tx, idempotencyKey)` kept; `lockOrderById(tx, orderId)` at lock 4; one header 0 events, 1 device, 2 session, 3 hold, 4 order, 5 attempt alone, 6 gift; provider path takes 0, 2, 3, 4.
- Drain and registry: `prepare` optional, run only when present; `ClaimedJob.payload` additive; `prepare` inside the `try`. U-005 and U-054 job kinds unaffected.
- Merges: `readHoldSettings(tx).paymentGraceMinutes` used; `extendedPayingUntil` kept apart; PR diff exactly the 20 files.
Non-blocking: the locked order row's hold and session ids are not re-compared with the unlocked read (matters only if an order's hold can change); U-049 must replace the seam (the cap of 25 and the give-up alert bound the wait).
