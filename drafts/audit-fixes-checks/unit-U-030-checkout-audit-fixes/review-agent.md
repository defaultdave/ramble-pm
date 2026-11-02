PASS

## review-agent: U-030 "Checkout audit fixes" (head 89e6ece)

Scope: the diff (base 053bd1a, 20 files) touches only the four audit rows in scope: BC-58 (#351), BC-29 (#333), BC-35 (#339), BC-39 (#341). No out-of-scope files. No README or CLAUDE.md change is needed: no user-facing surface is added, removed, or renamed, and no doc names `CheckoutFrame` or the old page-level frame.

How I checked: scratch worktree at 89e6ece (removed), `pnpm install --offline`, `next build`, `next start`, a headless browser against it, and a static Storybook build of the same head. `tsc --noEmit`, eslint (max-warnings 0), knip, and prettier are clean on the changed paths. The 24 test files touching the changed code pass (245 tests). The full suite was not rerun.

### Blocking
None.

### BC-54 (#347, `retry` vs `reset`): CONFIRMED does not reproduce on Next 16.4.2. The PM can close it.
- `node_modules/next/package.json` reports 16.4.2 (`package.json` has `"next": "^16.4.2"`).
- `node_modules/next/dist/client/components/error-boundary.js:112-114` renders the error component with `error`, `reset: this.reset` and `retry: this.retry`. `retry` (lines 43-48) calls `startTransition(() => { router.refresh(); this.reset(); })`. `error-boundary.d.ts` types both props (lines 5-6 and 31-32).
- The root and global boundary reach the same handler: `errors/root-error-boundary.js:27` renders `_errorboundary.ErrorBoundary`, so `global-error.tsx` also receives `retry`. `(guest)`, `(host)`, `(ops)`, `(checkout)` and the new `checkout/error.tsx` all take `{ retry }`.
- `tests/error-boundaries.test.tsx` runs `ErrorNotice` and every boundary (guest, checkout, host, ops, root) with a `retry` spy and asserts the Try again button receives that same function. It passes. It proves the components are wired to `retry`; it does not prove Next supplies `retry`. The node_modules lines above prove that part, so close the ticket on both together.

### The checkout layout (BC-58): no double frame, no missing frame
Rendered against the built head, counting skip links, `main`, `#main`, and `footer` in the DOM after hydration, at 390 px wide:

| Path | Result | skip / main / footer |
|---|---|---|
| `/checkout` (no id) | not-found | 1 / 1 / 1 |
| `/checkout/sample` (malformed) | not-found | 1 / 1 / 1 |
| `/checkout/a/b` (catch-all) | not-found | 1 / 1 / 1 |
| `/orders/RMB-NOPE00`, `/gift`, `/manage` | not-found | 1 / 1 / 1 |
| `/gift/x` | page | 1 / 1 / 1 |
| `/checkout/<well-formed id>` with a device cookie, database unreachable | page's own read-error state, h1 "Checkout" | 1 / 1 / 1 |

Why: `(checkout)/not-found.tsx` sits above `checkout/layout.tsx` in the boundary tree, so `notFound()` from any page under `checkout/` replaces the layout and its page with `GuestShell` alone. The `(site)` routes never see the new layout. The RSC payload shows the checkout layout's skip link rendered before the `error` boundary of its own segment, so the layout frame stays up around `checkout/error.tsx`.

Hold countdown: `CheckoutPage.tsx:154-166` still renders its own `Header` with `CheckoutHoldTimer` and `<main id="main">`. The old `CheckoutFrame` wrapper only added the skip link and footer, so the DOM is identical (fragment). The skip link's `#main` target resolves in every row above. `page.test.tsx` and the CheckoutPage tests pass. Not exercised: the timer ticking against a seeded hold (no database here); nothing in the diff touches it.

### `(checkout)/error.tsx` comment: TRUE
An error boundary renders inside its own segment's layout, so it cannot catch that layout's errors. It does catch the layouts of its child segments. Therefore `(checkout)/error.tsx` is the boundary for a throw from `(site)/layout.tsx` or `checkout/layout.tsx`, and `checkout/error.tsx` and `(site)/error.tsx` cannot catch those. Staying on `SiteShell` is right: it is a client module and `GuestShell` reaches zod through `siteNav`. I confirmed the ordering from the RSC payload and from `error-boundary.js`; I did not force a throw in a layout.

### `tests/checkout-client-modules.test.ts`: it catches what it claims
Mutations run in the scratch worktree:
- `checkout/error.tsx` imports `GuestShell`: FAILS (correct).
- `checkout/error.tsx` imports a helper that imports `siteNav` (indirect): FAILS (correct).
- A new `'use client'` file `checkout/loading.tsx` importing `GuestShell`: FAILS two tests, the fixed-list one and the closure one (correct).
- A type-only import of `siteNav`, directly or through a helper: passes (correct, erased at build).
The third test pins that the walker can reach both forbidden files through `not-found.tsx`, so a walker that goes blind would not pass silently.

### `tests/support/importGraph.ts`: the type-import strip is weaker in one way
Skipping `import type` and `export type ... from` is right: both are erased, and inline `import { type T, a }` and `import('x')` stay counted. The regex `/\b(?:import|export)\s+type\b[^;'"]*?from\s*['"][^'"]+['"]/g` has no line anchor, so it can swallow a real import that follows prose or an unterminated `export type`. I ran it:
- `// We export type guards here\nimport * as Sentry from '@sentry/nextjs';` returns `[]`. The Sentry import is invisible, so `checkout-no-sentry.test.ts` passes on a real violation.
- `export type A = string\nimport { s } from '@sentry/nextjs'` (no semicolon) also returns `[]`.
It needs a comment or semicolon-less type before the import with no `;` or quote between. Prettier adds semicolons, so the second form cannot occur in this repo, and the first is unlikely; it is non-blocking, but it is a fail-open in a PCI guard. Fix: anchor to the line start, `/^[ \t]*(?:import|export)\s+type\b[^;'"]*?\sfrom\s*['"][^'"]+['"]/gm`, and add a test row for the prose case.

### `DatePicker.module.css` (BC-35): correct, with one shared-component effect
Computed styles in the built Storybook, Default story:
- Unavailable future day: color `rgb(92, 80, 72)` (text-secondary), `line-through`, weight 400.
- Past day (React Aria sets both `data-disabled` and `data-unavailable`): color `rgb(138, 123, 110)` (text-disabled), `text-decoration: none`. The disabled rule is later in source at equal specificity and sets `text-decoration: none`, so past days keep the disabled color and gain no strike. The screenshot at 320 px agrees (days 1 to 17 grey and plain, 18 to 21 and 23 struck, 22 plain, 24 selected).
- Available and selected days unchanged. `.cell[data-selected][data-disabled]` is unaffected.
Shared use: `BookingChoices` (sheet and panel) and the FilterBar "When" calendar (`WhenDetails`, `LazyDatePicker`). The strike-through now also appears on no-session days in the FilterBar. That matches the semantics ("no sessions"), but the ticket was about the sheet; tell the owner.

### 20 px padding borrow below 360 px (BC-35): no clipping, no sideways scroll
Built Storybook, `sheet-time-chosen-light` and `sheet-sold-out-before-hold`, widths 300 to 800:
- 320 px: calendar spans x 4 to 316, day cells 44.0 px wide, dialog body `scrollWidth` equals `clientWidth` (320), document `scrollWidth` 320.
- 359 px: calendar 4 to 355, cells 44 px, no overflow.
- 360 px and up: margin is 0, calendar at x 24, cells 44 px, no overflow. At 300 px cells shrink to 41.7 px, which is below the 320 px floor the ticket names.
- The sheet's inline padding is 24 px (`.sheet .body` in `Dialog.module.css:129-131`), so the 20 px borrow leaves 4 px. The panel's padding is 24 px (`BookingPanel.module.css:10`), so a viewport under 360 px cannot overflow it either (not rendered at that width).
- Month nav "Previous" sits at x 4 to 48 and "Next" at 272 to 316, so their 4 px focus ring reaches x 0 and is not cut by the body's `overflow-y: auto`. It fits with no spare room: if `--space-5` or the ring width changes, the ring clips.

### `focusBookingNotice` (BC-39): panel behaviour unchanged
The panel effect is the old code moved: same selector `section[aria-label="Book this experience"] [data-booking-notice]`, same `if (notice)` guard, same `[notice]` dependency. The sheet adds `[role="dialog"] [data-booking-notice]` on the same dependency. The only element carrying `data-booking-notice` is in `BookingChoices.tsx:80`, which both islands render, so each selector finds its own notice. The new test in `BookingFlow.test.tsx` refuses in the sheet, expects the alert to have focus, presses Escape, and expects the dialog closed (passes). The existing panel test still passes.

### BC-29 (OrderSummary heading and focus ring)
`<span class="text">` became `<div class="text">`; `.text` is `display: flex`, so the layout is the same. A test asserts the h2 has no `span` ancestor. `.title:focus` (outline none) became `:focus-visible` with a 2 px ring; in the built story `after-rehold-focuses-title`, the h1 is the active element, `:focus-visible` is true, and the outline is `solid 2px`. A mouse-initiated re-hold shows no ring, which is the browser's `:focus-visible` rule and matches the old look for that input.

### Non-blocking
- `tests/support/importGraph.ts` strip regex: see above. Audit item for the PM: tighten and add a row.
- `DatePicker.module.css`: nothing automated pins the unavailable strike-through or the past-day disabled color. The cascade depends on rule order. A play assertion on the Default story (computed `text-decoration-line` for an unavailable future day and for a past day) would hold it. No story or test asserts the 44 px width at 320 px either.
- `tests/checkout-client-modules.test.ts` first test hard-codes the three error files. Any new `'use client'` file in the group fails it until the list is edited. That is a deliberate tripwire, but it will surprise the next builder.
- The month-nav buttons also move to 4 px from the screen edge below 360 px, because the whole `.calendar` block borrows the padding. Visually tight; no defect.

### Unconfirmed
- Hold countdown ticking against a seeded hold (no database in this run). Nothing in the diff touches `CheckoutHoldTimer` or `CheckoutPage`.
- A real throw from a layout reaching `(checkout)/error.tsx` was not forced; the claim rests on Next's boundary order, read from `error-boundary.js` and the RSC payload.
