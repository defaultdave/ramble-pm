FAIL

## architecture-audit: U-045b "Fake payment UI and event simulator" (head a1af608)

### Blocking
- B2, `src/components/FakePaymentForm/FakePaymentForm.tsx:393`: `FieldErrors` runs `cardFieldOrder.filter((field) => errors[field] !== undefined)` in the component, choosing which errors show and in what order. Fix: a `src/lib/fakeCard.ts` function (for example `visibleErrors(errors)` returning the ordered `{field, message}` list) with a unit test, sharing ordering with `firstErrorField`; the component only maps its result.

B2 cleared, round 1: flow state and notices in `lib/fakePaymentFlow`; card formatting, validation, outcome and plan in `lib/fakeCard` and `lib/fakePayment`; the `view` pick and the `succeeded` callback are control flow; the action's Zod parse, `fakeConfirmResult`, `isRefusalCode` are in lib and the secret check is the ruled capability guard; gateway is wiring; `eventDelivery` and the test simulator in the right layers.

Other rules: B4, B8, B1, B3, B7, B12 pass; no inline styles (B16); `formatMoney`, `secureEqual`, `createRandom` reused (B17).

### Non-blocking
- `FakePaymentForm.tsx:85` (`Pay ${formatMoney(amountMinor)}`) and `:304` (wallet sheet title) build display strings in the component; trivial joins, a `payLabel` or `walletSheetTitle` lib function would settle a strict reading.
- `FakePaymentForm.tsx:119` calls `new Date()` in the component and passes it to `validateCard`; allowed (B12 covers server and lib).
- Missing rate limit on the confirm action, as ruled; log for U-047b.

### Unconfirmed
- Token-only CSS in the module files not read line by line.
