# Items raised closing Sprint 1 (2026-11-01)

**Scope:** non-blocking items from the check rounds on PR 677 (cache), PR 678 (U-035), U-020, the PF-7 fix and the checkout fixes. Raised by reviewers and builders, verified by the check that raised them. Not a full pass.

## Items

| ID | Item | Lens | From | Status |
|---|---|---|---|---|
| SC-1 | `src/server/coverPhotos.ts:25` repeats the per-experience tag loop; use `tagExperiences`. | Code and DRY | PR 677 review | open |
| SC-2 | `LandingPage.module.css` page-shell rules are near-verbatim from `browse/page.module.css`; share one. | Code and DRY | U-035 review | open |
| SC-3 | `LandingResults` repeats the try, read, log, error-view shape of `BrowseContent` and `HomeContent`; one helper. | Code and DRY | U-035 review | open |
| SC-4 | Guest routes: the first request for an unlisted unknown slug answers 200 with `noindex`, later ones 404. Pin the behaviour in U-091's crawler-view test. | Architecture | U-035 review and QA | open |
| SC-5 | The landing error state's h1 and tab title are the generic "Things to do in New York" and do not name the page. | Accessibility | U-035 QA | open |
| SC-6 | "Browse all experiences" and "Clear all filters" sit about 20 px right of the text above them. | Visual | U-035 QA | open |
| SC-7 | A dead `audit-export` day stays dead: its dedupe key holds and nothing re-drives it. Needs an ops re-drive. | Architecture | U-020 review | open |
| SC-8 | No login role uses `audit_writer`, so the trigger is the only guard, and the table owner can disable it. No unit owns the connection split. | Architecture | U-020 review | open |
| SC-9 | The export's one-hour grace is not enforced: nothing sets `idle_in_transaction_session_timeout`, `transaction_timeout` or `maxDuration`, so a late commit could miss a write-once object. | Architecture | U-020 review | open |
| SC-10 | Unexported rows only warn in the log, with no alert, and days older than the 7-day lookback never export. `queueAuditExports` failures also raise no alert. | Architecture | U-020 review | open |
| SC-11 | `failureOutcome` duck-types `permanent`; use a typed marker `StorageError` satisfies, so a third-party error cannot dead-letter a job. | Architecture | U-020 architecture | open |
| SC-12 | `putOnce` skips an existing key without comparing content. | Architecture | U-020 review | open |
| SC-13 | The locked audit store (R2 with object lock) does not exist, so no audit export runs. Needs the owner's account and an adapter unit; gate U-055's first production deploy on it. | Architecture | U-020 ruling | open |
| SC-14 | Browse's no-script chip groups repeat the drawer's, so a new filter must be added twice, and the hidden-field loop repeats `TargetButton`'s. | Code and DRY | PF-7 review | open |
| SC-15 | `CheckoutFrame.module.css` repeats `.skip` from `GuestShell.module.css`. | Code and DRY | PF-7 review | open |
| SC-16 | `new Date()` carries `TODO(U-005)` in browse, home and `LandingRoute.tsx`, but the clock port exists; move all three. | Architecture | U-035 builder | open |
| SC-17 | `.payment:focus` and `.state:focus` in `CheckoutPage.module.css` hide focus with `outline: none`, as the h1 did. | Accessibility | Checkout builder | open |
| SC-18 | `focusBookingNotice('[role="dialog"]')` takes the first dialog on the page; scope it to the sheet. | Accessibility | Checkout architecture | open |
| SC-19 | `tests/support/importGraph.ts`: the type-import regex has no line anchor, so prose before an import can hide it from the Sentry guard. Also `tests/bot-check-scope.test.ts:11` and `tests/cache/conventions.test.ts:214` carry their own walkers. | Code and DRY | Checkout review | open |
| SC-20 | Published pages are not warmed after release, so first requests render cold; ADR 0001 expects warming. Carry on U-104. | Performance | U-035 ruling | open |
| SC-21 | `src/lib/privacy.ts` still describes the hourly R2 dump as running; it waits on U-098. | Code and DRY | U-020 fixer | open |
| SC-22 | An error thrown in `(checkout)/(site)/layout.tsx` still renders the plain `SiteShell`: raw skip link, bare "Ramble" link, no footer. BC-58 fixed the checkout page's own error state only. | Visual | Checkout QA | open |
| SC-23 | After an in-page re-hold the previous header and `main` stay in the DOM with `display: none`, so the page has two `main#main`. | Accessibility | Checkout QA | open |
| SC-24 | The bare `Composites/BookingSheet` story still shows 38.8 px cells at 320 px; the shipped sheet is 44 px. | Visual | Checkout QA | open |
| SC-25 | Browse's first load with JavaScript off shows only the first 5 cards (PF-7's known limit); landing pages past about 3 KB of results cut the same way. Home and the experience page keep their skeletons with JavaScript off. | Accessibility | PF-7 QA | open |
