PASS

## spec-compliance: U-045b "Fake payment UI and event simulator" (head a1af608)

### Blocking
None.

- IN 1: the form, wallet buttons, challenge and wallet sheets; six test numbers (`src/lib/fakeCard.ts:17-52`); decline copy in `src/lib/fakePayment.ts`; 3-D Secure pass and fail (`planChallenge`); wallet success and cancel; one server entry (`confirmFakePayment`). Every rule a tested lib function. 14 stories, one per state. Tokens only, 44 px targets, focus styles, visually hidden labels, `aria-invalid`, `aria-describedby`, `role="alert"`.
- IN 2: `src/lib/eventDelivery.ts` plans late, out-of-order and repeated delivery, bounded (5 repeats, one day, 100 events), seeded, no timers or network; `tests/support/paymentEvents.ts` plays deliveries with no real timer.
- IN 3: the banner says no real payment or card; only the six test numbers; no keys.
- IN 4: evidence present.
- First caller: both `TODO(U-045b)` markers in `fake.ts` gone; `gateway.ts` calls the two factories.
- OUT OF SCOPE untouched.

### Non-blocking
- `src/server/actions/fakePayment.ts:14` carries `TODO(U-047b): first caller` (allowed by B7).
- No `@media` rules in the form CSS; single column, not a gap.

### Unconfirmed
- Visual match to Figma checked by token use only.
