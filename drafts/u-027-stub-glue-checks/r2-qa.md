PASS

## qa-agent: U-027 stub glue round 2 (head 7c0291f)

### Blocking
None.

### Round 2 items
1. Canvas fix done: `src/app/(checkout)/layout.tsx` adds `import '@/styles/base.css'` only. In a production build, body is the dark surface rgb(24,19,15) in dark scheme with the cream h1 rgb(251,246,238) legible at 320 and 390 px on `/checkout/[holdId]` and `/orders/[reference]`; light scheme dark h1 on cream. Round 1 finding resolved. Sentry guard holds (unit test and e2e pass).
2. Fixture values in `src/lib/demoCheckout.ts`; `DemoOrderSummary` spreads `summary`.
3. Both pages show "Your experience (demo)", pinned by a test.
4. `demoHoldId` and `demoOrderReference` not exported; knip clean.
- Nothing else changed in the round 2 delta; the merge commit introduced no breakage (3663 unit pass; e2e passes). The Book link not opened in a browser (no database in the e2e server, as round 1).

### Gates (scratch copy of 7c0291f)
format:check, lint, typecheck pass; test 3663; knip clean; build pass; e2e 159; storybook:test 183.

### Production build, both pages
- Dark and light at 320 and 390 px: canvas correct, heading legible, no sideways scroll in all eight combinations.
- Keyboard reaches the header links with a visible focus ring.
- Click-through at 390 px: checkout shows the demo alert, "Your experience (demo)", $85 x 2 guests, $170.00; Pay (demo) goes to `/orders/RMB-DEMO01` with the demo-confirmed alert and the same summary; "Browse more experiences" lands on `/new-york/browse`.

### Non-blocking
- The site header and footer render unstyled on these pages; same as round 1, outside this diff.

### Evidence
- `checkout-390-dark-before.png`, `checkout-390-dark-after.png`, `confirmation-390-dark-before.png`, `confirmation-390-dark-after.png` (builder).
- `qa-r2-checkout-{320,390}-{dark,light}-after.png`, `qa-r2-confirmation-{320,390}-{dark,light}-after.png`: both pages, both schemes, both widths.
- `qa-r2-checkout-{320,390}-{dark,light}-focus-after.png`: keyboard focus ring.
- `qa-r2-flow-confirmation-390-light-after.png`, `qa-r2-browse-390-light-after.png`: the click-through.
