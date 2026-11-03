# Demo re-plan, 2026-11-02

Dave, 2026-11-02: Ramble is a demo and a test bed for performance and other experiments, not a site for real users. Sprint 2 is stabilization and audit fixes. Sprint 3 is login and the admin side. Work that only a real business needs comes out of the plan.

This replaces `drafts/sprint-2-production-ready.md`. The frozen plan stays as it is; each change below goes in `delta-log.md` once Dave approves it. Board statuses are from 2026-11-02. The forecast has not been rerun.

**Status: draft for Dave.** Every placement below is the PM's proposal.

## Sprint 2: stabilization and audit fixes

| Item | What | Notes |
|---|---|---|
| Maintenance waves 2 to 4 | The rest of the 206 audit tickets (`audits/maintenance-triage-2026-11-01.md`) | Wave 2 is ready: lane `maint-wave-2` |
| Close what is in flight | U-033 (filter drawer), U-037 (guide-only entries), U-102 (security: only the fake-secret dry run and the weekly gitleaks fixture allowlist are left) | |
| Test audit | Cut tests that repeat each other or pin copy; keep money, holds, webhook, race and authorization tests; check coverage and a mutation sample before and after | From the production-ready draft |
| Comment cleanup | Apply the repo's comment rule; every `TODO` names a live ticket | From the production-ready draft |
| Architecture drift and dead code | `architecture.md` against the islands that grew off it (N1030-8); unused code and dependencies | From the production-ready draft |
| U-105 Booking-path smoke and nightly suite | Keeps the demo from breaking quietly | Stabilization, not launch |
| U-051 Checkout failure states | The gaps the Figma failure flows show | Bugs a demo viewer can hit |
| Client islands review | Every island against the allowlist, its JS cost, whether it earns its place | Dave, 2026-11-01, end of sprint |
| Plan Sprint 3 | Scope manifests for the login and admin units below | Last item of the sprint |

Dropped from the production-ready draft: the dictionary (parked below), backups and restore, runbooks, Sentry, BotID, the firewall rule.

## Sprint 3: login and admin

The chain, in dependency order. U-002, U-020 and U-025 are already on `main`.

| Unit | What | Proposal |
|---|---|---|
| U-004a | Sign-in links, roles and sessions | Keep. Email links for every role, staff included (Dave, 2026-11-02) |
| U-022 | Authorization matrix test | Keep; it proves each role sees only what it should. Depends on U-004a instead of U-004b |
| U-073 | Ops shell, email sign-in screen, audit rows | Keep, without the passkey screen and the step-up prompt. Moves the dev mailbox behind the ops role |
| U-112 | Staff and roles admin, including the first admin by seed or CLI | Keep; without it nobody is admin. Invites are email sign-in links; no passkey enrolment, reset or step-up |
| U-076a | Edit and publish editorial copy | Keep: the start of the CMS |
| U-076b | Home and collections admin | Keep |
| U-076c | Pages and documents admin | Keep |
| U-074a, U-074b | Host setup and the experience editor | Keep: editing experiences is the other half of the CMS |
| U-107 | Guest account: my bookings | Keep: the guest side of login |

U-004b (passkeys and step-up) is cut, below. Units that depended on it now depend on U-004a.

Probably more than one sprint at the old pace; agent actuals have run at 4 to 42 percent of estimate, so the forecast refit decides.

## Test bed: kept, after Sprint 3

What makes the site useful for performance work and experiments.

| Unit | What |
|---|---|
| U-095 | Lighthouse budgets and lab runs in CI |
| U-089 | Web-vitals field data |
| U-119 | Vercel Analytics and Speed Insights |
| U-086 | Events table and beacons |
| U-096 | Load test |
| U-013 | Concurrency spike on Neon |
| U-034 | Keyword search |
| U-042 | Structured data and share images |
| U-092 | Sitemaps, robots and crawler checks |
| U-100 | Accessibility pass |

**Open for Dave:** the other experiments he has in mind. Each becomes a unit here.

## Parked: features, built only when an experiment needs them

| Area | Units |
|---|---|
| Gifting | U-017, U-062a, U-062b, U-063, U-064a, U-064b, U-065a, U-065b, U-066a, U-066b |
| Manage, cancel and refund a booking | U-055, U-056, U-057, U-059, U-106, U-109, U-052 |
| Reviews | U-044, U-060, U-061 |
| Host side | U-067, U-068, U-069, U-070, U-072 |
| Ops beyond the CMS | U-074c, U-075, U-077, U-078, U-083a, U-083b, U-108, U-113 |
| Catalog and pages | U-032, U-036, U-038, U-043, U-091 |
| Reminders and seed | U-058, U-021b |
| Design system | U-028, U-029 (Code Connect) |
| Measurement | U-087, U-090 |
| Copy | The dictionary track |

## Cut: only a real business needs these

| Unit | What | Why it goes |
|---|---|---|
| U-004b | Passkeys and step-up | Dave, 2026-11-02: email links for staff too. One admin on a demo; saves about 2 days and the preview-domain problem |
| U-046 | Stripe Connect adapter | The demo runs on the fake payment adapter (ADR 0003) |
| U-053 | Checkout script inventory and PCI | No real card data |
| U-071 | Host statements and payouts | No real hosts paid |
| U-079a, U-079b | Weekly release, reconciliation | No real money |
| U-080, U-081, U-110 | Finance export, disputes, money-held view | No real money |
| U-082 | Spreadsheet import | No real supply to onboard |
| U-084 | Trust and safety | No real hosts or guests |
| U-085 | Privacy requests | No real personal data |
| U-088 | Investor report and funnel | No investors |
| U-093, U-094a, U-094b | Redirect map, post-launch fixes, old-site shutdown | No old site to move from |
| U-097, U-114 | Uptime, SLO, synthetic booking | No users to keep up for |
| U-098, U-099, U-115 | Backups, runbooks, launch cutover | No launch |
| U-101, U-103, U-104 | Device matrix, staged releases, launch readiness | No launch |

A cut unit can come back if an experiment needs it. Cutting it means marking it on the board and logging it in `delta-log.md`; the frozen plan files do not change.

## After approval

1. Log the decision and each cut in `delta-log.md`.
2. Move the board: Sprint field for the Sprint 2 and 3 units, a cut status for the cut ones, nothing for the parked ones.
3. Refit the forecast and refresh the roadmap.
4. Open lane `maint-wave-2`.
