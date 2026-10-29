## U-027 stub glue: builder report

**Scope check:** Built: Book link, stub checkout and confirmation, fixture module and unit test, Playwright click-through, evidence. Did not build: holds, pickers, BookingPanel, payments, startPayment, any db, schema, server action, or email, new shared components, other checkout routes, docs/plan, .github, .claude.

### 1. Branch and head
`unit/U-027-stub-glue`, builder head `8a68ff895f4686675b6fc64a9b77bf386320a7a1` on origin/main `71b4ece` (rebased mid-build onto U-031's `routes.ts`). The PM then merged `origin/main` at `2bc8c4e` (standards only): head `87068322712bec7235599a89aad112f2741b598e`.

### 2. What was built
- Experience page: `ExperiencePage.tsx` renders a primary "Book" `ButtonLink` at the existing TODO(U-041) slot (comment kept). `ExperiencePageView` gains `bookHref`, built in `buildExperiencePage` as `/checkout/<fixture hold id>?experience=<experience id>`. The three fixtures in `ExperiencePage.fixtures.ts` carry it. Always shown (the view does not expose bookable sessions).
- `src/lib/demoCheckout.ts` (TODO(U-047b)): fixture hold id, order reference `RMB-DEMO01`, `demoCheckoutPath`, `demoOrderPath`, `demoSummary` (one line, $85 x 2 guests, $170.00).
- `src/lib/routes.ts`: `checkoutPath(holdId)` and `orderPath(reference)`, tested in `routes.test.ts`.
- `src/app/(checkout)/checkout/[holdId]/page.tsx` (TODO(U-047b)): heading, info Alert (demo, no payment taken), `OrderSummary`, primary "Pay (demo)" `ButtonLink` to `/orders/RMB-DEMO01`.
- `src/app/(checkout)/orders/[reference]/page.tsx` (TODO(U-050)): heading, success Alert, the same `OrderSummary`, "Browse more experiences" link.
- Route-private `src/app/(checkout)/_demo/`: `DemoOrderSummary.tsx`, `DemoPage.tsx`, `DemoPage.module.css`.
- `e2e/demo-checkout.spec.ts`.

### 3. Decisions
- Checkout line not labelled from the experience: `getExperiencePage` loads `src/server/env.ts`, which names Sentry, breaking `tests/checkout-no-sentry.test.ts`. The `experience` param is carried but ignored. The same constraint applies to U-047b.
- `DemoOrderSummary` is a client wrapper holding `OrderSummary`'s expanded state (a server page cannot pass `onToggle`); starts expanded.
- e2e starts at the checkout address the Book link builds, clicks Pay (demo), checks confirmation, follows its link to browse; the e2e server has no database, so home and the experience page render error states. The Book link is covered by the ExperiencePage component test and the buildExperiencePage test.
- `RoutePlaceholder` kept (other routes use it; knip clean).
- No existing test asserted the placeholder text for these routes (the e2e route spec checks only the h1 and title, both still match).

### 4. Reuse
Used: `ButtonLink`, `Alert`, `OrderSummary`, `formatPrice`, `guestsLabel`, `browsePath` and the other `routes.ts` builders, `e2e/fixtures.ts`. Extended: `routes.ts` with `checkoutPath`, `orderPath`. New: `demoCheckout.ts` exports (checked `routes.ts`, `orderSummary.ts`, `money.ts`; nothing holds a demo fixture; the module goes with U-047b); `DemoOrderSummary`, `DemoPage` route-private, marked for removal.

### 5. Gates (after the rebase)
format:check, lint, typecheck pass; `pnpm test` 163 files, 3623 tests pass; knip clean; `env -u DATABASE_URL pnpm build` pass; e2e through the lock with CI=1: 159 passed; storybook:test 32 files, 183 tests pass; gitleaks over origin/main..HEAD: no leaks. No db gates (no db code).

### 6. Not done
Only the experience-based label and the home-to-Book e2e steps, explained above.

### 7. Suggestions
- U-047b should read the experience through a Sentry-free path, or the `checkout-no-sentry` guard needs a deliberate decision.
- Once the e2e server has a database, extend `e2e/demo-checkout.spec.ts` to start from home.

### Evidence
`evidence/pr/unit-U-027-stub-glue/` in ramble-pm, light scheme:
- `experience-390-light-before.png`, `experience-390-light-after.png`: experience page at phone width without and with the Book button (Storybook story, light and dark stacked).
- `experience-1280-light-before.png`, `experience-1280-light-after.png`: same at desktop width.
- `checkout-390-light-before.png`, `checkout-390-light-after.png`: checkout as the old placeholder and as the stub, phone width.
- `checkout-1280-light-before.png`, `checkout-1280-light-after.png`: same at desktop width.
- `confirmation-390-light-before.png`, `confirmation-390-light-after.png`: confirmation as placeholder and stub, phone width.
- `confirmation-1280-light-before.png`, `confirmation-1280-light-after.png`: same at desktop width.
Experience shots come from Storybook (the local database cannot serve guest reads); checkout and confirmation shots from dev servers, whose header and footer render unstyled in dev, identically before and after.
