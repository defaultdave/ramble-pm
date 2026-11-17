# Audit fixes triage, 2026-11-17

Read-only triage of the 40 open `audit` issues against origin/main d2f8f8f. Tier: critical = auth, money, workflows, merge-desk, lint/TS configs. PROTECTED = `.github/`, `.claude/`, rulesets, lint/tsconfig, `scripts/merge-desk/`.

| # | ID | verdict | size | tier | files | lane conflict | group | note |
|---|----|---------|------|------|-------|---------------|-------|------|
| 319 | BC-14 | REAL (partial) | S | critical | `src/lib/ledger.ts` (requireMinor), `src/lib/integers.ts`, `src/lib/jobs.ts`, `src/lib/sessions.ts`, `src/lib/time.ts` | none | C-A | pricing.ts already uses `requireIntegerInRange`; `requireMinor` at ledger.ts:358 and the jobs/sessions date windows remain |
| 326 | BC-21 | FIXED | - | - | - | - | close | `startCheckoutPayment` returns `maintenanceRefusal(...)` first, `src/server/checkout.ts:93-96`, `src/lib/checkout.ts:504` |
| 367 | H-23 | UNVERIFIABLE | M | standard | evidence only | none | none | needs axe/keyboard/320px sweep on a Neon preview or demo deploy; a measurement, no code |
| 735 | N1102-1 | FIXED | - | - | - | - | close | `recallsStoredSuccess` exists in `src/lib/fakePayment.ts`, used at `src/server/fakePaymentDelivery.ts:38`, with unit tests in `fakePayment.test.ts:11` |
| 791 | N1102-57 | REAL (partial) | M | standard | `playwright.config.ts`, `e2e/checkout.spec.ts`, seed script | none | none | client skip is done (`NEXT_PUBLIC_BOT_CHALLENGE` in `botid-client.ts:15`, `withBotId` only when live in `next.config.ts:52`); a seeded e2e database is still missing. Owner decision on scope |
| 830 | TA-24 | STALE | - | - | - | - | close | no test asserts `is final`; the only matches are the SQL guard in `migrations/0007` and a doc comment in `db/legal.ts:130` |
| 834 | TA-27 | REAL | S | standard | `src/lib/confirmOrder.test.ts:23`, `checkout.fixtures.ts:11`, `holds.fixtures.ts:3` plus ~11 other test files | none | S-G | `at` still declared in 3 files; helper and UUID parts not re-counted |
| 835 | TA-28 | REAL | L | standard | `guests.db`, `holds-races`, `orders.db`, `ledger.db`, sessions, settings, pulse, export, `CheckoutPage`, `BookingFlow` tests | none | S-G | nine missing tests; consider splitting per test file |
| 890 | N1104-1 | REAL | XS | standard (PROTECTED: `.claude/standards/architecture.md`) | `.claude/standards/architecture.md`, `docs/plan/delta-log.md`, or `FilterBar/NoScriptFilters.tsx` | none | decision | needs Dave: approve the island (allowlist line is PROTECTED, a human edit) or replace it with a server route. `NoScriptFilters.tsx:1` is still `'use client'`, allowlist does not name it |
| 891 | N1104-2 | REAL | XS | standard | `src/components/ExperienceGallery/ExperienceGallery.module.css:15-18` | none | S-D | still an inset shadow only; actual defect (WCAG 2.4.7) |
| 892 | N1104-3 | REAL | XS | standard | `src/components/Footer/Footer.module.css:84-89` | none | S-C | ring gap still `--color-bg-inverse`; actual defect (WCAG 1.4.11) |
| 893 | N1104-4 | REAL | S | standard | `src/components/ExperienceGallery/GalleryStrip.tsx:28-49` | none | S-D | tabIndex dropped when `scrolls` flips; actual defect |
| 991 | IMG-1 | REAL | XS | standard | `src/components/Card/Card.tsx:16` | none | S-D | `horizontal: '168px'` still there; judgement/tuning, not a defect (96 px frame not re-measured) |
| 992 | IMG-2 | REAL | XS | standard | `src/components/Card/Card.tsx:15` | none | S-D | `100vw` on phones; judgement, tuning item |
| 993 | IMG-3 | REAL | S | standard | `src/components/ExperienceGallery/ExperienceGallery.tsx:15`, image config | none | S-D | judgement; owner decision on source-size cap |
| 994 | IMG-4 | REAL | S | standard | `src/components/ExperienceGallery/ExperienceGallery.tsx:15-16` | none | S-D | judgement/measurement item (container queries vs `vw` sizes) |
| 995 | IMG-5 | REAL | S | standard | `src/components/Photo/Photo.tsx:40,51` | none | S-D | `fill` with no stored width/height; judgement item, needs owner decision |
| 996 | IMG-6 | UNVERIFIABLE | M | standard | storage fake, seed, H-17 | none | none | measurement item: real-photo LCP cannot be measured locally; no code fix without a storage decision |
| 997 | IMG-7 | REAL | S | standard | `src/components/Photo/Photo.tsx` | none | S-D | no `onError` anywhere in Photo.tsx; actual defect, no-JS half needs a CSS-only fallback |
| 998 | N1105-1 | REAL | XS | critical (PROTECTED: ruleset) | repo ruleset 25513279, `DECISIONS.md`/`STATUS.md` wording | none | decision | needs Dave: ruleset change (add `human-read` as required); no CODEOWNERS file in repo; the merge-desk runbook still frames it as step E0 |
| 999 | N1105-2 | REAL | S | critical (PROTECTED: `scripts/merge-desk/`) | `scripts/merge-desk/scope-check.ts:5` | none | C-D | `PROTECTED` now has `eslint.config` and `tsconfig` but still lacks `.gitleaks*`, `package.json`, `pnpm-lock.yaml`, `vitest.config`, `knip.json`, `playwright.config`, `scripts/test-size.ts`; needs Dave |
| 1000 | N1105-3 | REAL | XS | standard | `src/lib/botChallenge.ts:31`, `src/lib/botCheck.ts:33`, `next.config.ts`, `src/server/ports/rate-limit/bot-check.ts`, `botChallenge.test.ts` | none | S-A | two copies still exist |
| 1001 | N1111-1 | REAL | M | critical (auth) | `src/server/auth/handler.ts:58`, `src/lib/rateLimits.ts:35`, `src/server/ports/rate-limit/bot-check.ts:20` | YES: `src/server/auth/handler.ts` (sign-in link path), guest-signin lane | C-B | per-address limit only; `TODO(U-004a)` still in bot-check.ts; needs Dave decision on the lockout fix shape |
| 1002 | N1111-2 | REAL | S | standard | `src/app/(guest)/hosts/[slug]/page.tsx:60`, `src/app/(guest)/picks/CollectionRoute.tsx:54` | none | S-F | `notFound()` after uncached data read inside the shell; not reproduced here, needs a `next start` repro |
| 1003 | N1111-3 | REAL | XS | standard | `src/components/Input/Input.module.css:41-55`, `src/app/(guest)/contact/ContactForm.module.css` | none | S-C | invalid rule still after the focus rule; actual defect. Sign-in uses Input but its files are not touched |
| 1004 | N1111-4 | REAL | M | critical (auth tables, retention) | `src/server/pulse.ts`, new purge in `src/server/db/`, `src/lib/privacy.ts:138`, retention schedule | no: files are outside the guest-signin lane paths (data purge, not the link path); coordinate with 1001 on volume | C-B | nothing purges `auth_verifications` or expired `auth_sessions`; only `rate_limits` is purged |
| 1005 | N1111-5 | REAL | M | critical (auth) | `src/app/api/auth/confirm-sign-in/route.ts`, `src/app/api/auth/end-session/route.ts`, `src/server/auth/forms.ts` | YES: `src/server/auth/forms.ts` and the confirm-sign-in route (sign-in link path), guest-signin lane | C-B | needs Dave: Server Actions versus a DECISIONS row extending B15 |
| 1006 | N1111-6 | REAL | M | standard | `src/server/actions/privateSession.ts`, `src/server/actions/contact.ts`, `src/lib/support.ts`, `src/lib/privateSession.ts`, `src/lib/formFields.ts` | none | S-A | no `runGuardedForm` yet; do before 1007 |
| 1007 | N1111-7 | REAL | XS | standard | `src/server/actions/contact.ts:27`, `src/lib/support.ts` | none | S-A | `opsNotice` still in the action |
| 1008 | N1111-8 | REAL | XS | standard | `src/app/(guest)/guide/[slugAndId]/page.tsx:45`, `src/lib/pages/guide.ts`, `src/app/(guest)/README.md:459` | none | S-A | `canonicalPath` still in the page file; README line must change with it |
| 1009 | N1112-1 | REAL | M | standard | `src/server/db/orderMove.ts:116-120,219-233`, `src/server/db/sessionReminder.ts`, `src/lib/bookingEmails.ts` | none | S-F | move enqueues only the confirmation; reminder is never re-timed |
| 1010 | N1112-2 | REAL | S | standard | `src/components/CheckField/CheckField.tsx`, `src/components/HostSetup/ExperienceForm.tsx` | none | S-C | no `aria-invalid` or `aria-describedby`; actual defect (WCAG 1.3.1, 3.3.1) |
| 1011 | N1112-3 | REAL | S | standard | `src/components/HostSetup/HostForm.tsx:91-101`, `src/components/Availability/AvailabilityView.tsx:100-116` | none (HostForm is used by `(ops)/ops/hosts/new`, not a lane path) | S-C | after 1010; actual defect |
| 1012 | N1112-4 | REAL | S | standard | `src/components/HostSessions/HostSessionForms.tsx:54-70,171-177`, `HostSessions.tsx` | none (component, not the `(host)/host/sessions/[id]/cancel` route) | S-C | success notice unmounts with the form; actual defect (WCAG 2.4.3, 4.1.3) |
| 1013 | N1112-5 | REAL | XS | standard | `src/server/db/staffRoles.ts:163`, `src/lib/hostStaff.ts` | none | S-B | cap decision still inline; judgement call per the issue |
| 1014 | N1112-6 | REAL | M | standard | `src/server/hostStaff.ts`, `src/server/hostGuestLists.ts`, `src/server/hostSessions.ts`, `src/lib/hostStaff.ts`, `src/lib/hostGuestLists.ts`, `src/app/(host)/README.md` | none | S-B | three loaders still call `getCaller` by hand; the gate is the access boundary, so review carefully |
| 1015 | N1112-7 | REAL | S | standard | `src/server/db/hostDashboard.ts`, `src/server/db/hostGuestLists.ts:32`, `src/server/db/bookingRows.ts` | none | S-B | `seatsOf` still private to hostGuestLists |
| 1016 | N1112-8 | REAL | S | standard | `src/server/db/hostSetup.ts:117-140`, `src/server/actions/hosts.ts:42-55`, `src/lib/hostSettings.ts:48` | none | S-F | `updateHost` still returns only `{status}`, no revalidate |
| 1017 | N1112-9 | REAL | XS | standard | `src/lib/pages/help.ts:31`, new `src/lib/text.ts`, `src/server/db/help.ts`, `src/server/db/hostGuestLists.ts`, `src/server/db/opsSessions.ts` | none | S-B | three importers, not two (opsSessions also imports it) |
| 1018 | N1113-1 | REAL | S | critical (money) | `src/server/db/orderRefundRetry.ts:62-71`, `src/lib/refundRetry.ts`, db test | none | C-A | `clearRefundFailed` still runs after one retry; whether `applyRefundEvent` re-flags the order is untraced |

## Proposed batches

Standard tier, disjoint files across batches:

- S-A, lib decisions and duplicate guards: 1006, 1007, 1008, 1000.
- S-B, host-area dedupe: 1017, 1015, 1013, 1014 (1014 last; it touches the access gate).
- S-C, form and focus accessibility: 892, 1003, 1010, 1011, 1012.
- S-D, gallery and photo: 891, 893, 997, 991, 992, then 993, 994, 995 only after an owner decision on the sizing approach.
- S-F, data and route fixes: 1002, 1009, 1016.
- S-G, test debt: 834, then 835 (split 835 by test file if needed).

Critical tier:

- C-A, money: 1018, 319.
- C-B, auth, lane-conflicted (guest-signin lane owns the sign-in link path): 1001, 1005, 1004. Hold until that lane lands.
- C-D, PROTECTED, Dave only: 999.

Not batched: 998 (ruleset, Dave), 890 (Dave decision), 791 (decision on e2e database scope), 367 and 996 (measurements), 326, 735, 830 (close as fixed or stale).
