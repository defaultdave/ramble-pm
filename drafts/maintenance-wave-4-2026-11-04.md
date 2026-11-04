# Maintenance wave 4, the drain (2026-11-04)

Dave, 2026-11-04: drain the maintenance backlog before adding work, combine tickets, keep only what needs doing. The filing bar (DECISIONS 2026-11-04) sorted 206 open audit tickets (79 nightly in `drafts/nightly-triage-2026-11-04.md`, 127 older in `drafts/backlog-sorted-2026-11-04.tsv`):

Outcome | Tickets | Where
--- | --- | ---
Build, in 7 combined PRs below | 23 | lanes `maint-wave-4a`, `maint-wave-4b`
Close as below the bar | 64 nightly + 79 older (143) | `drafts/digest-nightly-2026-11-04.tsv`, `drafts/digest-backlog-2026-11-04.tsv` (close with `tools/audit-digest.ts --run`)
Close as carried by a unit | 25 | in the backlog list, reason "not maintenance"
Owner pack | 9 for Dave, 5 PM actions | below
Test audit (TA) | 16 | lane `test-fixes`, as approved 2026-11-03
Done in `integration`, closes on promotion | BC-9 (#315) | promotion PR body

The planned wave 4 (P19, P21 to P24 in the 2026-11-01 triage) is replaced by this list: their digest rows (H-74, H-75, N1101-4, SC-15, N1030-17) close.

## The 7 PRs

Each lane re-checks file overlap against `origin/main` and open PRs before launch, and checks the owning unit's tier for the base (critical tier into `integration`). Re-verify every row on `origin/main` first; a row already fixed closes without code.

PR | Tickets | Size | Files (from the triage; re-check) | Lane
--- | --- | --- | --- | ---
W4-A1 `checkout-page-a11y` | N1102-43 #777, N1102-67 #801, N1102-69 #803, N1102-70 #804, N1031-21 #475, N1031-23 #477 | M | CheckoutPage.tsx, lib/pages/checkoutFlow.ts, FakePaymentForm.tsx, lib/fakePaymentFlow.ts, Alert.module.css, the hold timer component and css | 4a
W4-A2 `checkout-shells` | N1102-53 #787, SC-22 #706, N1031-19 #473 | M | app/(checkout)/checkout/[holdId]/page.tsx, app/renderPerRequest.tsx, app/(checkout)/error.tsx, SiteShell.tsx (a client-safe styled frame with footer) | 4a
W4-B `money-server` | BC-21 #326, N1102-1 #735 | S | server/actions/checkout.ts, server/checkout.ts, server/db/checkout.ts, lib/fakePayment.ts, server/fakePaymentDelivery.ts | 4a (critical tier, into `integration`)
W4-C `browse-filters` | N1102-59 #793, N1102-45 #779, N1102-46 #780, BC-56 #349, N1030-18 #444 | M | FilterBar.tsx (+ new chip island), LazyDatePicker.tsx, useDismissableDetails.ts, WhenDetails.tsx, SiteMenu, lib/pages/browse.ts, lib/time.ts, server/db/browse.ts | 4b
W4-D `landing-errors` | N1102-44 #778, N1102-47 #781 | S | LandingRoute.tsx, LandingPage.tsx, e2e/landing.spec.ts, ErrorNotice.tsx, Notices.test.tsx | 4b
W4-E `home-server` | H-38 #373, N1102-2 #736, BC-14 #319 | M | server/db/home.ts, schema/catalog.ts, migration 0024, server/db/editorial.ts, the requireMinor/requireInt twins and date windows in lib/jobs.ts, sessions.ts | 4b (carries the wave's one migration)
W4-F `gallery-island` | BE-11 #357, BE-17 #359; close BE-16 #358 (fixed by PR 820) | S | ExperienceGallery.tsx, .module.css, lib/pages/experience.ts, new island, B8 allowlist line (Dave's file) | 4b

## Owner pack (one sheet for Dave)

- Standards edits in `.claude/standards/architecture.md`, one PR the PM prepares and Dave bypass-merges: N1102-3 #737 (StickyAside allowlist row), N1102-4 #738 (`useWhenDisclosure` approval), N1030-7 #433, N1030-8 #434, BC-15 #320, and W4-F's B8 line.
- Dave's actions: N1030-1 #427 and H-11 #363 (Neon console), SC-13 #697 (R2 account), N1102-57 #791 (BotID blocks local checkout perf runs; recommend a local `initBotId` skip).
- PM actions, no Dave time: H-22 #366, H-23 #367, H-34 #370, H-35 #371, SC-7 #691.
