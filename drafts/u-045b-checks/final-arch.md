PASS

## architecture-audit: U-045b "Fake payment UI and event simulator" (head 6d0cb7d)

### Blocking
None.

- Round 1 B2 resolved: `visibleErrors(errors)` in `src/lib/fakeCard.ts:172` picks and orders the errors and `firstErrorField` shares it; `FieldErrors` only maps. Focus targets (`onSheet`, `focusTarget`) are in `src/lib/fakePaymentFlow.ts`; the component only calls `.focus()`. The merge touched no rule-bearing code.
- B2 by layer: the component takes flow, notices, focus, formatting, validation, outcome and plan from lib; the rest is rendering or state writes; `new Date()` at line 119 allowed (B12 covers server and lib). The action Zod-parses first (B5), maps results with `fakeConfirmResult` and `isRefusalCode` in lib, guards with `secureEqual` (ruled), rethrows other errors (B13), and takes the client secret as its capability (B6 n/a). The gateway is wiring with `server-only` (B3); `fake.ts` only loses its two TODO markers. Lib modules import only lib and zod; `tests/support/paymentEvents.ts` may import adapters.
- B1, B3, B4, B7 (TODO(U-047b) first-caller markers), B8 (the allowlisted checkout payment form), B9 to B15 pass; B16: no inline style, only 2 px outline and 1 px visually-hidden values.

### Non-blocking
- Strict B2 candidates: `Pay ${formatMoney(amountMinor)}` and the wallet sheet heading are trivial joins over lib values; a `payLabel` or `walletSheetTitle` lib function would settle them.
- B17 cleared: `formatMoney`, `secureEqual`, `createRandom`, `Alert`, `Button` reused; no duplicate found.
- Missing rate limit on the confirm action: ruled in round 1; log for U-047b.

### Unconfirmed
- The CSS modules were checked by grep for literals, not line by line.
