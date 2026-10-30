PASS

## spec-compliance: U-047b round 3 (head 435d30b)

Static check of `98096b2..435d30b` (70 files) and `8c8d1bb..b1780d6` (17 files). Blocking: none.
The 12 scope-line clauses still pass; migrations match 98096b2; `requireHoldTransition` in `claimLapsedHold` under the locks (`src/server/db/rehold.ts`).
Round 3: `OrderSummary` opt-in `openFrom?: 'tablet'` renders a plain `<h2>` head with title, meta, total (`fixedHead`) and `data-open-from`; other callers unchanged; `CheckoutPage.tsx:227` opts in. `isPrerenderEnd` (`src/lib/prerender.ts`) walks at most 3 causes and matches only "During prerendering,"; `rethrowOrLog` rethrows on it without logging; any other error logs as before. `try_later` only when the reserve limit blocks before anything is touched (`src/server/actions/rehold.ts:31`); network failure `unreachable` (`CheckoutPage.tsx:167`); post-claim refusals set `released` (`checkoutFlow.ts:240`), hide the retry, show "Your earlier hold has ended" and "Choose another date" (`CheckoutPage.tsx:520`). After a re-hold `/checkout/<id>?rehold=1` (`routes.ts:79`), `focusTitle` (`page.tsx:78`), h1 `tabIndex={-1}` focused (`CheckoutPage.tsx:119, 212`). Other components only lose `TODO(U-047b)` comments. Scope clean; known overlaps not failed.
