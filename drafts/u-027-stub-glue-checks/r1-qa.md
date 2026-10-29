FAIL

## qa-agent: U-027 "Order summary, booking bar, booking panel" (stub glue) (head 8706832)

### Blocking
- `/checkout/[holdId]` and `/orders/[reference]` in dark scheme: the h1 is cream (rgb 251,246,238) while body, html and main compute to a transparent background, so the heading sits on the browser's white canvas, nearly invisible; the dark alert and summary card sit on white. The `(checkout)` route group sets no page surface. Reproduced at 320 and 390 px in a production build. Light scheme is fine.

### Non-blocking
- After a client-side Pay (demo), the previous route's h1 stays in the DOM, hidden; framework route retention, not this unit.
- The header and footer render unstyled on the checkout and orders pages in production; pre-existing, not in this diff.
- No sideways scroll at 320 or 390 px in either scheme; keyboard reaches the summary toggle then Pay (demo) with a visible focus ring; the confirmation's browse link works.

### Unconfirmed
- The experience page's Book link was not walked in a browser (no database in the e2e server); covered by component tests and the Storybook shot.

### Gates (scratch copy of 8706832)
format:check, lint, typecheck pass; test 3623 pass; knip clean; build pass; e2e 159 pass; storybook:test 183 pass.

### Evidence
- `qa-checkout-320-dark-after.png`, `qa-checkout-390-dark-after.png`: the dark-scheme finding.
- `qa-checkout-320-dark-focus-after.png`, `qa-checkout-390-dark-focus-after.png`: Pay (demo) focused in dark.
- `qa-checkout-320-light-after.png`, `qa-checkout-390-light-after.png`, `qa-checkout-320-light-focus-after.png`, `qa-checkout-390-light-focus-after.png`: light scheme and focus.
- `qa-confirmation-320-light-after.png`, `qa-confirmation-390-light-after.png`, `qa-confirmation-320-dark-after.png`, `qa-confirmation-390-dark-after.png`: confirmation in both schemes.
- `qa-browse-390-light-after.png`: browse reached from the confirmation link.
