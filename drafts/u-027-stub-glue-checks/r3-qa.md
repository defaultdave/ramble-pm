PASS

## qa-agent: U-027 stub glue round 3 (head f8dee66)

### Blocking
None.

### Round 3 scope
- The round 3 delta (`f44abfc` to `f8dee66`) touches only `src/app/(checkout)/_demo/DemoPage.tsx` and `DemoPage.module.css`; `PageHeading` untouched.
- The merge broke nothing: the checkout layout gives a canvas (body rgb(24,19,15) dark, rgb(251,246,238) light); `bookHref` tests pass; the Sentry guard test and e2e pass.
- Round 1 and round 2 findings resolved or still non-blocking.

### Gates (scratch copy of f8dee66)
format:check, lint, typecheck, knip clean; unit 3686; build pass; e2e 159; storybook:test 187.

### Production build, both pages, dark and light at 320, 390, 1280 px
- All 12 combinations: correct canvas, legible h1, no sideways scroll.
- Keyboard reaches "Pay (demo)" in all 6 checkout combinations with a visible 2 px outline and ring.
- "Pay (demo)" is 272 px at 320, 342 px at 390, 125 px at 1280 (accepted).
- Click-through at 390 px: demo alert, "Your experience (demo)", $85 x 2 guests, $170.00; Pay (demo) to `/orders/RMB-DEMO01` with the confirmed alert; "Browse more experiences" lands on `/new-york/browse`.

### Non-blocking
- The site header and footer render unstyled on these pages (`SiteShell`, pre-existing, outside this diff).
- The experience page's Book link not opened in a browser (no database in the e2e server).

### Evidence
Checkout, dark, before (white canvas) and after:
![checkout 390 dark before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/checkout-390-dark-before.png)
![checkout 390 dark after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-checkout-390-dark-after.png)

Checkout, light, before (placeholder) and after:
![checkout 390 light before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/checkout-390-light-before.png)
![checkout 390 light after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-checkout-390-light-after.png)

Confirmation, dark and light after:
![confirmation 390 dark after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-confirmation-390-dark-after.png)
![confirmation 390 light after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-confirmation-390-light-after.png)

Desktop and focus:
![checkout 1280 light after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-checkout-1280-light-after.png)
![checkout 390 dark focus on Pay](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-027-stub-glue/qa-r3-checkout-390-dark-focus-after.png)
