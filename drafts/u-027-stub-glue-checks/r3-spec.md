PASS

## spec-compliance: U-027 stub glue round 3 (head f8dee66)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- Unit, e2e, build and storybook not rerun; builder's gates on f8dee66 taken as reported.

### Round 3 items
1. PASS: `_demo/DemoPage.tsx:15` renders `<PageHeading title={title}>{children}</PageHeading>` inside `.page`, with the alert, summary and button as children (`checkout/[holdId]/page.tsx:17-26`, `orders/[reference]/page.tsx:15-24`). `DemoPage.module.css` keeps only the column. `PageHeading.tsx` and its CSS are byte-identical to `652fafd`; its `.page > a` rules give the lone "Pay (demo)" its own width from 768 px up, as accepted.
2. PASS: merge `f44abfc` is clean; its 18 main-side files do not overlap the 16 branch-side files; branch content unchanged from round 2 except the round 3 files; `checkoutPath`, `orderPath`, `bookHref`, the base.css import all intact; no Sentry import in the checkout group.

### Round 1 items 1 to 6 and round 2 items 1 to 4
All still hold at head (Book link at the TODO(U-041) slot; checkout and orders stubs with their TODOs; fixtures in `demoCheckout.ts` with its test; e2e spec present and the route headings still match; `RoutePlaceholder` kept, 14 other importers; evidence present including the three `-r3.png`; base.css import; neutral title; two consts private).

### Out of scope
- Whole branch against `main` is 16 files, all in scope or PM-authorized; nothing under `docs/`, `.github/`, `.claude/`.

### Evidence
- `checkout-390-light-r3.png` and `checkout-390-dark-r3.png` are byte-identical to the round 2 `-after` files (390 px unchanged); `checkout-1280-light-r3.png` differs, consistent with the accepted width change.
