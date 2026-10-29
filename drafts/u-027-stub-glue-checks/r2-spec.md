PASS

## spec-compliance: U-027 stub glue round 2 (head 7c0291f)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- Unit, e2e and build not rerun; the merge check is by reading: `bookHref` typed at `src/lib/experiencePage.ts:365`, built at `:457`, present in all three `ExperiencePage.fixtures.ts` views (49, 89, 119), asserted at `experiencePage.test.ts:418` and `ExperiencePage.test.tsx:121`. Builder's gates on 7c0291f taken as reported.

### Round 2 items
1. PASS: `src/app/(checkout)/layout.tsx:4` imports `@/styles/base.css`, matching the guest layout; base.css names no Sentry and the guard test checks only TS/TSX imports. `checkout-390-dark-after.png` shows the dark canvas under the heading.
2. PASS: `demoMeta`, `taxTreatment`, `taxMinor` in `src/lib/demoCheckout.ts:24-35,40-52`; `DemoOrderSummary.tsx` spreads the summary.
3. PASS: `src/lib/demoCheckout.ts:41` sets `title: 'Your experience (demo)'`.
4. PASS: `demoHoldId` and `demoOrderReference` are non-exported consts; no use outside the file.

### Round 1 IN SCOPE, still holding
Book link at the TODO(U-041) slot (`ExperiencePage.tsx:114-116`); checkout and orders pages with their TODOs; `checkoutPath`, `orderPath` in `routes.ts:78-79`; `e2e/demo-checkout.spec.ts` unchanged; `RoutePlaceholder` still used (31 references).

### Nothing else changed
The round 2 delta is exactly four files (`DemoOrderSummary.tsx`, `layout.tsx`, `demoCheckout.test.ts`, `demoCheckout.ts`); the merge touched no checkout or e2e files and keeps `bookHref` intact.
