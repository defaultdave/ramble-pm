PASS

## architecture-audit: U-048 round 2 (head 6de1064)

Static read. All ten round 1 B2 findings fixed: `isRefusedSignature` (`paymentWebhook.ts:36`); `intakeResponse` for 200/400/413/429 and Retry-After; `ProcessProviderEventPayloadSchema` and `EventMetadataSchema` in lib (no `.toLowerCase()` in the data layer); `eventRetry` returns `tries`, `runAfter`, `alert`; `orderMove`, `reopenHoldId`, `extendHold` in the action type; missing order as `order: null`; `afterConfirm(status)`; `alertFor(result, eventId)` including `:gave-up`; `isProviderMismatch`.
Non-blocking: retry ruling in lib; drain and registry change safe (`prepare` optional, one extra `findJob`, failures go through `recordFailure`; U-054's jobs unaffected); B1 holds with the provider call outside the transaction; lock order consistent, no cycle; scope 20 files; B2 borderline `processedAt !== null` early returns (`db/providerEvents.ts:267`, `:291`) and `!isPaymentEventType(type)` (`:269`) as idempotency guards (a lib predicate later); B7 `readEventToLookUp` and `prepare` have callers; carried: U-049 takes the events lock first, U-049 or U-109 sweeps unprocessed events.
Unconfirmed: merge equivalence beyond parents (8c93abd, 3287b4e) and the 20-file PR diff; no tests run.
