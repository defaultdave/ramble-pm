PASS

## review-agent: U-047b round 3 (head 435d30b)

### Blocking
None.

### Non-blocking
- `rethrowOrLog` now rethrows on `isPrerenderEnd` (`src/lib/prerender.ts`). It matches only a message containing "During prerendering," on the error or within 3 causes, so it cannot swallow an ordinary database error. It is a message match, so a Next.js wording change would bring the log line back, not hide anything.
- `?t=` token in history and logs (BC-20, carried from round 2).

### Round 2 findings
- Desktop toggle: fixed. `OrderSummary.module.css` hides the toggle with `display: none` from 768 px, so it is out of the tab order and the tree. The checkout stylesheet no longer reaches into `OrderSummary`. `openFrom` is opt-in; `CheckoutPage.tsx` is the only caller that passes it, so other callers are unchanged. Stories cover desktop and phone.
- Re-hold copy: `try_later` and `unreachable` are returned only before the claim or when the answer never arrived, and keep the retry. Every refusal after the claim sets `released`, which hides the retry and shows the experience link.
- Merge: `git diff 98096b2 435d30b -- src/server/db/migrations` is empty. `claimLapsedHold` calls `requireHoldTransition` under the locks.
- Scope: no new out-of-scope files. The `zonedShortDayLabel` and `orderConfirmationPath` overlaps are ignored as the brief says.
- Unconfirmed from round 2 is closed: no copy in `src` says details are saved.
- Tests run in a scratch copy of 435d30b: 104 passed across 9 files (prerender, monitoring, checkoutFlow, CheckoutPage, OrderSummary, checkout page).

### Unconfirmed
- I did not rerun the db, e2e or Storybook suites or do the browser QA checks; those are the qa-agent's.
