PASS

## qa-agent: U-027 stub glue, merge of main (head e8dac1c)

### Blocking
None.

### Merge resolution
- `main` (56e66d2) is an ancestor of e8dac1c; `git diff 56e66d2 e8dac1c -- src/lib/experiencePage.ts` is exactly the `demoCheckoutPath` import, the `bookHref` field with its TODO(U-041) doc comment, and the `bookHref` value; main's refactor intact.
- The branch against main is the same 15 files (+258/-22); 14 byte-identical to f8dee66; the checkout layout identical to main's; nothing main added is undone.

### Gates (scratch copy of e8dac1c)
format:check, lint, typecheck, knip clean; unit 3695; e2e 159 through the lock (a logged `CachedReadError` from the placeholder database failed no test); storybook:test 194; build pass.

### Production build at 390 px, light and dark
- Checkout: canvas rgb(251,246,238) light, rgb(24,19,15) dark; h1 "Checkout"; demo alert, "Your experience (demo)", $85 x 2 guests, $170.00, Pay (demo); no sideways scroll.
- Pay (demo) to `/orders/RMB-DEMO01`: "Your demo order is confirmed" with the same summary, correct canvas, no sideways scroll, both schemes.
- "Browse more experiences" to `/new-york/browse` in both schemes.

### Non-blocking
- Browse shows "We couldn't load experiences" (no database in the scratch setup); renders correctly.
- The site header and footer render unstyled on checkout and confirmation (`SiteShell`, pre-existing).
- The Book link not opened in a browser; its tests pass.

### Evidence
`qa-m-checkout-390-{light,dark}.png`, `qa-m-confirmation-390-{light,dark}.png`, `qa-m-browse-390-{light,dark}.png`.
