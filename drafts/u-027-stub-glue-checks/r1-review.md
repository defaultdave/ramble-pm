PASS

## review-agent: U-027 "Order summary, booking bar, booking panel" stub glue (head 8706832)

I read the diff and the builder's worktree. I did not run the test suite, e2e or the build myself. The gate results below are the builder's own report.

### Blocking
None.

- Scope: All 15 files fall under IN SCOPE or the PM-authorized consequences. That covers routes.ts, the bookHref field, the _demo/ helpers, and the checkout and orders pages. I found no holds, server actions, database code, new queries or edits to .github/, .claude/ or docs/plan/.
- Duplication: I found nothing that duplicates existing code. checkoutPath and orderPath extend src/lib/routes.ts. The summary line reuses formatPrice and guestsLabel. The pages reuse Alert, ButtonLink and OrderSummary. The demoCheckout.ts fixtures are the only module holding checkout demo data.
- Unbounded work: There are no loops, queries or inputs without a limit.
- Database versus Zod: No database or Zod changes, so no CHECK or NOT NULL gaps.
- Failing open: The checkout and order pages ignore their URL params and fall back to fixture data. That is the intended stub behaviour, marked TODO(U-047b) and TODO(U-050). It repairs no input, makes no auth decision and calls no provider.
- Data in logs: No logging was added.
- Comments: The only ticket mentions are TODO(U-xxx) markers, plus the kept U-041 slot comment the PM authorized.
- Tests: The Book link is covered by a component test and a buildExperiencePage test. The routes and the demo fixture module each have a test. The e2e spec covers the click-through from checkout to confirmation to browse. It has no database to start from home, which the brief explains.

### Non-blocking
- src/lib/demoCheckout.ts:30 and src/app/(checkout)/_demo/DemoOrderSummary.tsx:8: the demo line is titled "Hand-rolled pasta class" and dated "Sat, Nov 14" whatever experience the guest booked. The brief authorizes a static line, and the code carries TODO(U-047b). Be aware the click-through will show a kayak experience page leading to a pasta-class summary.
- src/lib/experiencePage.ts:9 imports from demoCheckout.ts, a module that goes away with U-047b. U-047b and U-041 must swap that import together.
- The Reuse section of the builder report matches what I found.

### Unconfirmed
- The experience-page evidence screenshots in evidence/pr/unit-U-027-stub-glue/ come from Storybook, per the builder's note. I did not open them.
- The builder reports 163 test files with 3623 tests passing, 159 e2e tests passing, and clean format, lint, typecheck, knip and build runs. I did not re-run any of these.
