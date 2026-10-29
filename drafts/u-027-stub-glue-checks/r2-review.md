PASS

## review-agent: U-027 stub glue round 2 (head 7c0291f)

### Blocking
None.

### Verified
- Item 1: `src/app/(checkout)/layout.tsx:4` imports `@/styles/base.css`; nothing names Sentry; `tests/checkout-no-sentry.test.ts` passes in a scratch run.
- Item 2: `demoMeta`, `taxTreatment`, `taxMinor` moved into `demoSummary` in `src/lib/demoCheckout.ts`; `DemoSummary` widened with `TaxTreatment` from `orderSummary.ts`; `DemoOrderSummary` spreads `summary`; every field matches an `OrderSummary` prop; tsc clean; render unchanged.
- Item 3: title "Your experience (demo)", asserted by a new test; the old title remains only in `OrderSummary`'s own stories and tests.
- Item 4: `demoHoldId` and `demoOrderReference` no longer exported; no importers; the test asserts the literal paths.
- Nothing else changed in the round 2 delta.
- Merge `7c0291f`: `bookHref` intact (view model line 365, set at 457 via `demoCheckoutPath`, used at `ExperiencePage.tsx:116`, carried by the fixtures, asserted by the tests); tsc clean on the merged tree.
- Scratch run on `7c0291f` (src/lib, tests, checkout, ExperiencePage): 3422 of 3423 pass; the one failure is the 5 s timeout in `tests/db/email.db.test.ts` (database webhook rate-limit test, untouched code, no database available), treated as environmental.

### Round 1 findings
- The pasta-title note is resolved by item 3.
- The `experiencePage.ts` import of `demoCheckout.ts` still holds, marked for U-047b and U-041 to swap together.
- Other round 1 conclusions hold; the delta adds no loops, queries, logging or ticket comments.

### Non-blocking
- `src/app/(checkout)/_demo/DemoOrderSummary.tsx:7-8`: the `TODO(U-047b)` comment sits above the doc comment and reads as part of it; cosmetic.

### Unconfirmed
- Full unit suite, e2e, storybook and build not rerun (builder's gates).
