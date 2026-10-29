PASS

## spec-compliance: U-027 "Order summary, booking bar, booking panel" (head 8706832)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- None. Checks were read-only against the diff `2bc8c4e...87068322712bec7235599a89aad112f2741b598e` and the head tree. I did not run the test suite or e2e; the builder reports those gates as passing.

### IN SCOPE check
1. Book link on experience page: PASS. `src/components/ExperiencePage/ExperiencePage.tsx:112-118` renders a primary `ButtonLink` to `view.bookHref` at the existing TODO(U-041) slot. `bookHref` is built via `demoCheckoutPath` (`src/lib/demoCheckout.ts`), which uses the `checkoutPath` route helper (`src/lib/routes.ts:78`). The link is not interactive beyond navigation.
2. `/checkout/[holdId]`: PASS. `src/app/(checkout)/checkout/[holdId]/page.tsx` has the h1 "Checkout", an info `Alert` (no payment taken), `DemoOrderSummary` with `demoSummary`, and a primary "Pay (demo)" `ButtonLink` to `demoOrderPath` (`/orders/RMB-DEMO01`). TODO(U-047b) is at line 9. Fixture data is in `src/lib/demoCheckout.ts` with `src/lib/demoCheckout.test.ts`. No db, query, or server action code was added.
3. `/orders/[reference]`: PASS. `src/app/(checkout)/orders/[reference]/page.tsx` has the h1 "Order confirmation", a success `Alert`, the same `DemoOrderSummary`, and a "Browse more experiences" link to `browsePath`. TODO(U-050) is at line 8.
4. Playwright spec and tests: PASS. `e2e/demo-checkout.spec.ts` is new and covers the click-through. No existing test asserted the placeholder for these routes; `e2e/routes.ts:65-67` still matches the h1 "Order confirmation".
5. `RoutePlaceholder` retained: PASS. It is still imported by other routes at head (gift, gifts checkout, manage, accessibility, contact, gifts, guide, help, legal, neighborhoods), so keeping it is correct.
6. Evidence: PASS. `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-027-stub-glue/` holds the 12 before and after PNGs the builder lists (experience, checkout, confirmation at 390 and 1280). I checked presence only, not content.

### OUT OF SCOPE check
- No holds, `reserveSpaces`, pickers, interactive BookingBar or BookingPanel, payments, startPayment, db, schema, migration, server action, email, or new shared components or hooks.
- No changes under `docs/plan/`, `.github/`, or `.claude/`.
- Touched files are the 15 listed in the diff. Each is in scope or is one of the PM-authorized consequences: `routes.ts` and `routes.test.ts`, `experiencePage.ts` and its test, the `ExperiencePage` fixtures and test, and the route-private `src/app/(checkout)/_demo/`.
- `_demo/` is in the authorized route-private set. `DemoOrderSummary` holds only expanded state, which the PM authorized.
