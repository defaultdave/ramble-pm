# MVP re-plan, 2026-11-10

**Status: draft for Dave.** Every placement below is the PM's proposal. Nothing changes on the board or in `delta-log.md` until Dave approves it. The frozen plan files stay as they are.

## 1. Goal and what changes

Ramble becomes Dave's testing site: an MVP-complete prototype with the whole guest front end, host tools and the ops admin. The guest side covers browse, search, experience pages, booking, checkout on the fake payment adapter, manage/cancel/move, reminders, reviews, account and gifting. A unit is in when a guest, host or ops person uses it to do something in the product, and reduced versions are preferred. A unit that exists only to run a real business or a launch is cut: real payments, finance, payouts, reconciliation, launch ops, the legacy site, compliance and investors. The test-bed units stay as a separate track.

What changes from `drafts/demo-replan-2026-11-02.md`:
- **Unparked into the MVP, mostly as lite versions:**
  - Manage, cancel and refund: U-055, U-056, U-057, U-059, U-106
  - Host side: U-067, U-068, U-069, U-070, U-072
  - Ops beyond the CMS: U-074c, U-075, U-077, U-078, U-083a, U-083b, U-108, U-113, and U-084 in reduced form
  - Reviews: U-060, U-044, U-061
  - Catalog and pages: U-032, U-036, U-038, U-043, U-091
  - Seed and reminders: U-021b, U-058
  - Gifting core: U-017, U-062a, U-062b, U-063, U-064a, U-064b
- **Moved from Test bed into the MVP:** U-034 keyword search, because it is a guest function.
- **Newly cut:**
  - U-029, U-087, U-090 (were parked)
  - U-052, U-109 (money-safety hardening)
  - U-065a, U-065b, U-066a, U-066b (gift exchange, expiry and reinstatement)
  - Everything already cut on 11-02 stays cut.
- **Eight new units** for gaps the manifests do not cover (section 3).
- **The Sprint 2 and Sprint 3 Plan values give way to MVP-1, MVP-2 and MVP-3.** These are the swarm waves in section 4: a unit's Plan value is the wave whose lane holds it. Maintenance waves, the test audit, comment cleanup and the islands review stay as Maintenance. BC-21 (startPayment ignores the checkout maintenance flag) folds into U-051.

**Skeptic changes accepted:**
- U-017 keeps token_version and the gift kind of bumpTokenVersion.
- U-105 keeps a minimal Playwright axe helper.
- U-100 also depends on U-051.
- U-038 renders any `legal_documents` key, waivers included, and adds a notice template and job kind (1.25 d).
- U-043 lands after U-038 and reuses its notice (1 d).
- U-042 no longer depends on U-036.
- U-044 is in because U-060 is in.
- U-051 is cut to 0.5 d, since S8 decline already ships in FakePaymentForm.
- U-106 tests the refused submit after the sweep, not a late success.
- U-107's dependency on U-022 becomes soft.
- U-070 is kept, with U-056 and U-059 as lite units.
- U-072 adds no new schema and uses role_grants.
- U-062a keeps the postProviderFee call.
- U-062a no longer depends on U-051. U-064a runs after U-017 and U-062a, not after U-063.
- U-063 gets a "send now" option.
- U-064b and U-064a share one in-date predicate, which lives in U-017.
- U-074b and U-074c are ops-side only. U-074a's owner invite is testable once U-067 lands.
- Every manifest that still names a cut unit is re-pointed: U-022, U-073, U-112, U-077, U-108 and U-113 drop U-004b; U-077 drops U-079a; U-108 drops U-017. U-084 drops the U-075 edge.
- U-059 takes the `session_cancelled` refund-path branch (+0.25 d).
- U-055 starts against the refund-job interface, and U-056 merges first.

**Overruled or changed:**
- **U-004a seeded personas:** these go into **U-022**, not U-004a. In wave 1 the seed fixtures are already being edited by the checkout lane, and U-022 needs one seeded principal per role anyway. U-112 keeps a CLI grant for databases that have not been seeded.
- **U-084:** no host status column. "Suspend host" pauses all of that host's experiences, and "suspend experience" maps to the existing `paused` status. This keeps it at 0.5 d, which answers the skeptic's "tight" note by cutting scope.
- **U-038 contact form:** it writes a `support_requests` row as well as sending the email. The classifier's email-only version would leave U-083a, which is IN, with nothing to list.
- **U-113:** the buyer refund is dropped, since gift refunds (U-066a) are cut. U-017 drops the refund_pending, refunded and expired_refunded states that only those paths use.
- **Tester mailbox gap:** no new unit. U-073 keeps the U-006 shared-secret unlock as a second way into /ops/mailbox on non-production deployments (+0.25 d). That way a tester signed in as a guest or host can still read their sign-in links.

## 2. Unit table

Days are likely agent-days after the lite cuts. **Tier** is the record value. "→Std" marks a proposed re-tier, which needs Dave. The MVP-n values follow the waves in section 4.

| Unit | Issue | Title | Verdict | Plan | Lite cuts / amendments | Depends | Days | Tier |
|---|---|---|---|---|---|---|---|---|
| U-004a | 5 | Sign-in links, roles, sessions | IN | MVP-1 | No BotID (default). Personas move to U-022 | — | 2 | Critical |
| U-022 | 29 | Authorization matrix test | IN | MVP-1 | +Seeded personas with role_grants: guest; owner and staff on 2 seeded hosts; ops; admin. Test-only: any auth fix it finds goes in a follow-up | U-004a | 1.5 | Critical |
| U-017 | 23 | Gift tables and state machine | IN-LITE | MVP-1 | Drop the re-hash path and the refund states. Keep token_version, gift bumpTokenVersion, send_at, orders.gift_id FK, and the shared `giftInDate` predicate | — | 1 | Critical |
| U-102 | 130 | Scanning and secrets | IN-LITE | MVP-1 | gitleaks fixture allowlist, dismiss alert #1, close. Drop the rotation runbook, MFA checklist and dry run. PM item, no builder | — | 0.25 | Standard |
| U-105 | 133 | Booking-path smoke | IN-LITE | MVP-1 | Seeded Postgres for the e2e server; browse→hold→pay→confirm spec as a required check; minimal axe helper, non-blocking | — | 1.75 | Standard |
| U-051 | 61 | Checkout failure states | IN-LITE | MVP-1 | S10 from a seeded refunded_after_lapse order, Figma check of S6–S9, plus BC-21 | — | 0.5 | Standard |
| U-033 | 39 | Extra filters | IN-LITE | MVP-1 | Price band (2–3 bands), age (all/kids/21+), indoor/outdoor. Drop access and group size | — | 1 | Standard |
| U-034 | 40 | Keyword search | IN | MVP-1 | websearch_to_tsquery on a generated tsvector, one GIN index, a field on browse only | — | 0.75 | Standard |
| U-032 | 38 | Zero results with ways forward | IN-LITE | MVP-1 | ≤3 "remove this filter (N)" suggestions, enumerated generically over browseParamNames, S2 only | U-033, U-034 | 0.5 | Standard |
| U-036 | 42 | Picks and gift guide pages | IN | MVP-1 | No sponsor slot; collection position order | — | 0.5 | Standard |
| U-037 | 43 | Guide-only entries | IN | MVP-1 | "Cooking you can book" uses the existing browse read | — | 0.5 | Standard |
| U-038 | 44 | Help, legal, accessibility, contact | IN-LITE | MVP-1 | Legal render first (any current published key, waivers included), no version list. 6–8 help articles, ILIKE title search. Static a11y page. Contact = formGuard + rate-limit key + support_requests row + new generic ops-notice template and job kind. No BotID | — | 1.25 | Standard |
| U-073 | 88 | Ops shell and audit wiring | IN-LITE | MVP-2 | No passkey or step-up. Nav shell, audit rows, mailbox behind ops role **or** the U-006 secret off production | U-004a, NEW-2 | 1.75 | Critical |
| U-074a | 90 | Host setup | IN-LITE | MVP-2 | No payout account. One acceptance against the current legal version. Owner sign-in-link invite. +/ops/hosts index and detail | U-073 | 1.5 | Critical |
| U-074b | 91 | Experience editor | IN | MVP-2 | Ops routes only, reads cancellation tiers without editing policies.ts. +/ops/experiences index by status, host, category | U-074a | 3.5 | Standard |
| U-075 | 93 | Experience review and approval | IN-LITE | MVP-2 | Queue, approve/reject to live, tag invalidation, alt-text check. Drop tax treatment, guide-only clearing and the rights gate | U-074b | 1 | Standard |
| U-084 | 109 | Trust and safety | IN-LITE | MVP-2 | Pause/unpause an experience (`paused`); host = pause all its experiences. Audit row and tags. No schema, documents, intake or takedown | U-073 | 0.5 | Standard |
| U-074c | 92 | Availability setup | IN-LITE | MVP-2 | Ops only: template/allocation form and seat cap. Rolling generator moves to NEW-3. Drop the walkthrough, booking-system label and one-off event sessions | U-074b, NEW-3 | 1.5 | Standard |
| U-056 | 66 | Refund processing | IN-LITE | MVP-2 | Fake-adapter refund job, cash posting on succeeded, failed reversal, refunds.split test. Drop transfer reversal, the releasing retry, host-share reversal and the queue UI | — | 1.5 | Critical |
| U-106 | 59 | Paying-hold lapse | IN-LITE | MVP-2 | Void the order and cancel the attempt in the existing holds sweep (no pulse.ts edit). Test that a submit after the sweep is refused and routes to expired/re-hold | — | 0.5 | Critical |
| U-055 | 65 | Manage booking, cancelBooking | IN-LITE | MVP-2 | As classified, +host cancellation notice. giftReinstated hook is a no-op returning false; a gift-paid cancel refunds 0 | U-056 (merge order) | 2.75 | Critical |
| U-057 | 67 | Move a booking | IN-LITE | MVP-2 | Same-price date of the same experience only | U-055 | 1.5 | Critical |
| U-059 | 69 | Session cancellation fan-out | IN-LITE | MVP-2 | cancelSession in a new `db/cancelSession.ts`, calling existing hold release (no edits to sessions.ts or holds.ts). One full refund per order, email with other dates, +session_cancelled branch in refundPath.ts. No commission return | U-056 | 1.75 | Critical |
| U-067 | 82 | Host shell and access | IN | MVP-2 | +/host dashboard: upcoming sessions with seats sold against allocation, recent bookings | U-004a | 1.25 | Critical |
| U-068 | 83 | Publish a week, edit sessions | IN-LITE | MVP-2 | Drop the usability check and allocation view. +Cancel an unbooked session, add a one-off date | U-067, NEW-3 | 2 | Critical |
| U-069 | 84 | Guest lists | IN-LITE | MVP-2 | Print stylesheet, no share. +/host/bookings search by reference or name | U-067 | 1 | Standard |
| U-043 | 49 | Private session request | IN-LITE | MVP-2 | private_requests table, form, reuses U-038's notice job. No anonymize, PII entry or BotID | U-038 | 1 | Standard |
| U-091 | 116 | Slug history | IN-LITE | MVP-2 | Wrong or stale slug 301s on experience and guide addresses only | — | 0.75 | Standard |
| U-058 | 68 | Reminder emails | IN-LITE | MVP-2 | 24 h reminder enqueued at confirm via db/bookingEmails.ts (no pulse.ts). No weather note | — | 0.5 | Standard |
| U-021b | 28 | Curated content and photo pool | IN-LITE | MVP-2 | About 40 experiences, about 20 hosts, about 10 guide entries; agent copy plus tone checklist; generated photos with alt text | — | 1.5 | Standard |
| U-112 | 89 | Staff and roles admin | IN-LITE | MVP-2 | Email-link invites, grant/revoke and audit, CLI grant. +/ops/audit viewer over readAuditPage. No passkeys or step-up | U-073, U-022 | 2 | Critical |
| U-083a | 107 | Support queue | IN | MVP-2 | +Mark resolved with a note. No email reply | U-073, U-038 | 0.75 | Standard |
| U-107 | 72 | Guest account | IN | MVP-2 | /account upcoming and past linking to manage; header account link. Own guest-scope test | U-004a, NEW-1, U-055 (U-022 soft) | 1.5 | Critical |
| U-072 | 87 | Host staff access | IN-LITE | MVP-2 | One read-only staff role via U-112's grant function in role_grants. No schema | U-067, U-112 | 1 | Critical |
| U-077 | 97 | Ops bookings, cancel, refund | IN-LITE | MVP-2 | Search by email or reference (also lists that guest's orders), cancel, fake refund, refund-failed queue, resend, void links. No transfer.failed or step-up | U-073, U-055, U-056 | 2.25 | Critical |
| U-108 | 99 | Ops session management | IN-LITE | MVP-2 | Find sessions, cancel with impact via cancelSession, updateAllocation, pause the experience and cancel its future sessions. No gift emails or step-up | U-073, U-059 | 1.75 | Critical |
| U-063 | 75 | Gift delivery | IN-LITE | MVP-3 | Lock, scheduled→delivered, email in one transaction; "send now" default; readable in /ops/mailbox. No caps or refund skip | U-017 | 1 | Critical →Std |
| U-062a | 73 | purchaseGift and confirm | IN-LITE | MVP-3 | Keep postProviderFee. Drop the late-success test. Keep gifts-off refusal and the token_hash write | U-017, U-063 | 2 | Critical |
| U-064a | 76 | redeemGift and confirm | IN-LITE | MVP-3 | Double-redeem test, holds.gift_id FK, zero-due confirm using giftInDate. No exchange | U-017, U-062a, U-057 (holds.ts) | 2 | Critical |
| U-064b | 77 | Gift redemption page | IN-LITE | MVP-3 | Expired (giftInDate) and redeemed states only, no exchange link, noindex | U-064a | 1 | Critical →Std |
| U-113 | 98 | Ops gift support | IN-LITE | MVP-3 | Search, detail, resend or re-address with bumpTokenVersion and audit. No buyer refund, step-up or close-out | U-073, U-063 | 1 | Critical |
| U-076a | 94 | Editorial editing and publish | IN | MVP-3 | No axe rows; calls tagsForChange without editing src/server/cache | U-073 | 1.6 | Standard |
| U-076b | 95 | Home and collections admin | IN | MVP-3 | — | U-076a | 1 | Standard |
| U-076c | 96 | Pages and documents admin | IN | MVP-3 | +Category/neighborhood add, rename, reorder, retire (new db/taxonomy.ts). Wires existing legal.ts functions without editing it | U-076a, U-038 (soft) | 1.7 | Standard |
| U-078 | 100 | Settings and ops switches | IN | MVP-3 | +Read-only cancellation tier list | U-073 | 1.25 | Standard |
| U-062b | 74 | Gift checkout and scheduled pages | IN-LITE | MVP-3 | Entry on 03 only; reuse U-051 states; plain buyer email | U-062a, U-051 | 1.5 | Standard |
| U-060 | 70 | Review invites and storage | IN-LITE | MVP-3 | Invite, reviews table, form. +Seed ≥5 verified reviews on 4 experiences, past orders for the guest persona, dev "send invite now" | — | 1.75 | Standard |
| U-044 | 50 | Review display | IN-LITE | MVP-3 | ≥5 threshold, ≤10 listed, no sort or replies | U-060 | 0.75 | Standard |
| U-061 | 71 | Review moderation | IN-LITE | MVP-3 | Ops hide/unhide with audit. No report flow | U-060, U-073 | 0.5 | Standard |
| U-083b | 108 | Private requests queue | IN | MVP-3 | — | U-073, U-043 | 0.5 | Standard |
| U-070 | 85 | Host cancels a booked session | IN-LITE | MVP-3 | Cancel only (no retime); impact shown first, then cancelSession | U-068, U-059 | 1 | Critical |
| U-086 | 111 | Events table and beacons | TEST-BED | Test bed | Drop the synthetic flag | — (after U-064a: confirmOrder/holds) | 1.25 | Critical |
| U-089 | 114 | Web-vitals field data | TEST-BED | Test bed | To the U-086 beacon; p75 SQL view | U-086 | 0.5 | Standard |
| U-092 | 117 | Sitemaps, robots, crawler | TEST-BED | Test bed | One sitemap | — | 1 | Standard |
| U-095 | 121 | Lighthouse budgets | TEST-BED | Test bed | Per-PR LHCI on home, browse, experience; no Android lab | — | 1 | Standard |
| U-096 | 122 | Load test | TEST-BED | Test bed | Browse plus hold-hoarding only; drops U-051, U-059 and U-106 scenarios explicitly | — | 2 | Standard |
| U-100 | 128 | Accessibility pass | TEST-BED | Test bed | Route-list axe matrix on U-105's helper plus a missing-row check; manual walk optional | U-105, U-051 | 1.75 | Standard |
| U-042 | 48 | Structured data, share images | TEST-BED | Test bed | JSON-LD and OG on experiences only | — | 0.75 | Standard |
| U-119 | 151 | Vercel Analytics, Speed Insights | TEST-BED | Test bed | Built (#163); close the issue | — | 0 | Standard |
| U-004b | 6 | Passkeys and step-up | CUT | Cut | | | 0 | Critical |
| U-029 | 35 | Code Connect mapping | CUT | Cut | | | 0 | Standard |
| U-046 | 53 | Stripe Connect adapter | CUT | Cut | | | 0 | Critical |
| U-109 | 58 | Refund path in confirmOrder | CUT | Cut | Stub fails safe; U-059 takes the session_cancelled branch | | 0 | Critical |
| U-052 | 62 | Payment race tests | CUT | Cut | | | 0 | Critical |
| U-053 | 63 | Script inventory and PCI | CUT | Cut | | | 0 | Standard |
| U-065a | 78 | Gift exchange: confirm | CUT | Cut | | | 0 | Critical |
| U-065b | 79 | Gift exchange: page | CUT | Cut | | | 0 | Critical |
| U-066a | 80 | Gift expiry and refunds | CUT | Cut | | | 0 | Critical |
| U-066b | 81 | Gift reinstatement | CUT | Cut | No-op hook in U-055 | | 0 | Critical |
| U-071 | 86 | Statements and payouts | CUT | Cut | | | 0 | Standard |
| U-079a | 101 | Weekly release | CUT | Cut | | | 0 | Critical |
| U-079b | 102 | Reconciliation | CUT | Cut | | | 0 | Critical |
| U-080 | 103 | Finance export | CUT | Cut | | | 0 | Standard |
| U-110 | 104 | Money-held view | CUT | Cut | | | 0 | Standard |
| U-081 | 105 | Dispute record | CUT | Cut | | | 0 | Critical |
| U-082 | 106 | Spreadsheet import | CUT | Cut | | | 0 | Standard |
| U-085 | 110 | Privacy requests | CUT | Cut | | | 0 | Critical |
| U-087 | 112 | Attribution capture | CUT | Cut | | | 0 | Standard |
| U-088 | 113 | Investor report | CUT | Cut | | | 0 | Critical |
| U-090 | 115 | Live dashboard and cohorts | CUT | Cut | | | 0 | Standard |
| U-093 | 118 | Redirect map, guide import | CUT | Cut | | | 0 | Standard |
| U-094a | 119 | Post-launch redirect fixes | CUT | Cut | | | 0 | Standard |
| U-094b | 120 | Decommission old site | CUT | Cut | | | 0 | Standard |
| U-097 | 123 | Uptime, SLO | CUT | Cut | | | 0 | Standard |
| U-114 | 124 | Synthetic booking isolation | CUT | Cut | | | 0 | Critical |
| U-098 | 125 | Backups and restore | CUT | Cut | | | 0 | Standard |
| U-099 | 126 | Runbooks | CUT | Cut | | | 0 | Standard |
| U-115 | 127 | Cutover runbook | CUT | Cut | | | 0 | Standard |
| U-101 | 129 | Device matrix, wallets | CUT | Cut | | | 0 | Standard |
| U-103 | 131 | Staged releases, freeze | CUT | Cut | | | 0 | Standard |
| U-104 | 132 | Launch readiness review | CUT | Cut | | | 0 | Standard |

**If Dave puts gifting OUT**, nine units come out of MVP-3: U-017, U-063, U-062a, U-062b, U-064a, U-064b and U-113 are cut (9.5 d). U-036 hides the Gifts header button and the gift entry, and U-078's default for giftsEnabled becomes false. In wave 1, NEW-8 takes U-017's slot.

## 3. New units

| ID | Title | IN SCOPE | OUT OF SCOPE | Depends | Days | Tier |
|---|---|---|---|---|---|---|
| NEW-1 | Sign-in screens | /sign-in (email form, rate-limit key); check-your-email, expired-link and used-link states; the landing page on U-004a's verify route; sign-out; `next` redirect limited to same-origin paths; sign-in entry in the header | Passkeys, social login, account page (U-107), ops nav (U-073) | U-004a | 0.75 | Critical (session and redirect handling) |
| NEW-2 | Ops admin UI kit | DataTable (sort, cursor pagination, empty and error states), Select, Textarea, SearchField, StatusBadge with a filter bar, ConfirmDestructive dialog, flash/toast after a Server Action; Storybook stories under axe | Any ops page or data function | — | 1.25 | Standard |
| NEW-3 | Rolling session horizon | Pulse step that runs generateSessions to keep 12 weeks of sessions ahead of now, idempotent; DST test | Template UI (U-074c), host week view (U-068) | — | 0.75 | Standard |
| NEW-4 | Test-site console /ops/dev | Ops/admin only, refused in production. Jobs list (status, attempts, last error), run one job, drain, trigger pulse; set or advance the Clock port so a tester can reach hold lapse, reminders, review invites and gift send | Fake-gateway outcome controls (FakePaymentForm already has them), data reset (NEW-5) | U-073, NEW-2 | 1.25 | Standard |
| NEW-5 | Reset demo data | Confirm-guarded admin action and CLI that wipe orders, holds, gifts, reviews, messages and jobs, then rerun the seed. Hard refusal in production, with a test | Partial resets, scheduled resets | NEW-4 | 0.5 | Standard |
| NEW-6 | Host listings and settings | /host/experiences read-only (status, price options, cancellation terms, waiver); /host/settings to edit notificationEmail, name and about | Host-side experience editing, payouts | U-067, U-074b | 0.75 | Standard |
| NEW-7 | Ops dashboard | /ops landing: counts and links for the approval queue, refund-failed, support, private requests, today's sessions, recent audit rows | Metrics, charts, finance numbers | U-073, NEW-2, U-075, U-077, U-083a, U-083b | 0.5 | Standard |
| NEW-8 | Host profile page | /hosts/[slug] on the browse template: about, the host's live experiences, cancellation terms; link from the experience page's host block | Host reviews, contact form | — | 0.75 | Standard |

Logged as out, with no unit:
- Gift cards for a money amount (PRD-34)
- Wishlists and the map view (PRD Later)
- "Act as host" from ops (testers sign in as the seeded host persona)
- A full guest person view in ops (U-077's email search covers lookup)

## 4. Swarm waves

There are five builder slots. A slot runs one lane at a time, and when a lane finishes, the next wave's lane takes its slot. A gate is a merge that must land before a unit starts. Times are cumulative likely agent-days with no human-read wait counted.

**File rule.** Lanes that run at the same time own disjoint source files. The exception is a set of append-only registration points: `package.json`/`pnpm-lock.yaml`, `src/server/db/migrations/` (journal and numbering), `src/server/db/schema/index.ts`, `src/server/jobs/registry.ts`, `src/lib/email/templates.ts`, and the seed and fixture index. Builders only add their own entries there, and the single merge lane resolves the rebase. Without that exception every email, job and migration unit would have to run in one lane, about 20 days in series.

Ownership rules:
- `src/server/auth/` belongs to W1-A, then W2-E.
- `src/server/cache/` belongs to W2-A.
- `src/server/db/sessions.ts` belongs to W2-C, then W2-A.
- `holds.ts` and `ledger.ts` belong to W2-B, then W3-A after the gates shown.
- `confirmOrder.ts` belongs to W3-A.
- `SiteShell` belongs to W2-C.

### Wave 1: startable today (slots 1–5)

| Lane | Slot | Units in order | Touches | Critical (Dave's read) | Window |
|---|---|---|---|---|---|
| W1-A Auth | 1 | U-004a → NEW-1 → U-022 | src/server/auth/, schema/people.ts, src/app/api/auth/, src/proxy.ts, (guest)/sign-in/, components/Header/, src/lib/email/ (sign-in template), tests/db/authz*, src/server/db/seed/personas.ts | U-004a, NEW-1, U-022 | 0–4.25 |
| W1-B Guest pages | 2 | U-037 → U-036 → U-038 (legal render first PR) | (guest)/guide/, picks/, gifts/, help/, legal/, accessibility/, contact/; src/lib/pages/{guide,picks,giftGuide,help,legal}; db/editorial.ts; db/catalog.ts; server/experiencePage.ts; components/ExperiencePage/; actions/contact.ts; formGuard.ts; jobs/opsNotice*; schema support_requests; fixtures/help.ts | — | 0–2.25 |
| W1-C Browse | 3 | U-033 → U-034 → U-032 | src/lib/filters.ts, filterBar.ts, db/browse.ts, filterOptions.ts, schema/catalog.ts (tsvector), components/FilterBar/, FilterDrawer/, BrowseResults/, lib/pages/browse.ts, server/browse.ts | — | 0–2.25 |
| W1-D Checkout and smoke | 4 | U-051 (+BC-21) → U-105 | components/CheckoutPage/, OrderConfirmation/, (checkout)/checkout/[holdId]/, src/server/checkout.ts, fixtures (S10 order), e2e/, playwright.config.ts, .github/workflows/ci.yml, nightly-smoke.yml | — | 0–2.25 |
| W1-E Kit and gift base | 5 | NEW-2 → U-017 | components/{DataTable,Select,Textarea,SearchField,StatusBadge,ConfirmDestructive,Flash}/; schema/gifts.ts, schema/orders.ts and ledger.ts (FK only), lib/transitions.ts, capabilityTokens.ts, server/tokens.ts | U-017 | 0–2.25 |

U-102 is done by the PM and needs no builder slot. U-119 needs only the issue closed.

### Wave 2

| Lane | Slot (from) | Units in order | Gates | Touches | Critical | Window |
|---|---|---|---|---|---|---|
| W2-A Ops supply | 5 (W1-E) | U-073 → U-074a → U-074b → U-075 → U-084 → U-074c → NEW-6 | U-004a, NEW-2; U-074c after W2-C ends (sessions.ts); NEW-6 after U-067 | (ops)/layout.tsx, ops/page.tsx, ops/mailbox/, ops/hosts/, ops/experiences/, ops/review/; actions/mailbox.ts, ports/email/mailbox*, db/audit.ts, db/catalog.ts, db/photos.ts, server/photos/, server/cache/, db/legal.ts, db/sessions.ts (U-074c only), (host)/host/{experiences,settings}/ (NEW-6) | U-073, U-074a | 2.25–12.75 |
| W2-B Money | 4 (W1-D) | U-056 → U-106 → U-055 → U-057 → U-059 | — | jobs/refund*, db/ledger.ts, db/providerEvents.ts, ports/payments/fake.ts, db/holds.ts, db/checkout.ts, db/policies.ts, db/orders*, actions/orders.ts, (checkout)/(site)/manage/, components/ManageBooking/, db/refundPath.ts, db/cancelSession.ts (new), email templates/Booking* | all five | 2.25–10.25 |
| W2-C Host | 2 (W1-B) | U-067 → NEW-3 → U-068 → U-069 | U-004a (NEW-1 soft) | (host)/layout.tsx, host/page.tsx, host/sessions/, host/bookings/; components/SiteShell/, components/Host*/; db/sessions.ts, lib/sessions.ts, server/pulse.ts, actions/hostSessions.ts, db/hostGuestLists.ts | U-067, U-068 | 2.25–7.25 |
| W2-D Guest extras | 3 (W1-C) | U-043 → U-091 → U-058 → NEW-8 → U-021b | U-038 | experiences/[slugAndId]/, guide/[slugAndId]/ (301 only), (guest)/hosts/, components/BookingPanel/, ExperiencePage/ host block, lib/routes.ts, server/experiencePage.ts, actions/privateSession.ts, schema private_requests, db/bookingEmails.ts, jobs/reminder*, src/lib/seed/fixtures/, public/ | — | 2.25–6.75 |
| W2-E Roles and accounts | 1 (W1-A) | U-112 → U-083a → U-107 → U-072 → U-077 → U-108 | U-073, U-022; U-107 after U-055; U-072 after U-067; U-108 after U-059 | src/server/auth/, schema/people.ts, scripts/grant-role*, (ops)/ops/staff/, ops/audit/, ops/support/, ops/bookings/, ops/sessions/; (guest)/account/, components/Header/ (account link), db/guests.ts; (host)/host/staff/; db/opsBookings.ts, actions/ops*.ts | U-112, U-107, U-072, U-077, U-108 | 4.25–13.5 |

### Wave 3

| Lane | Slot (from) | Units in order | Gates | Touches | Critical | Window |
|---|---|---|---|---|---|---|
| W3-A Gifting | 3 (W2-D) | U-063 → U-062a → U-064a → U-064b → U-113 | U-017; U-062a after U-056 (ledger.ts); U-064a after U-057 (holds.ts) | jobs/deliverGift*, db/gifts*.ts, db/confirmOrder.ts, db/ledger.ts, db/holds.ts, db/locks.ts, actions/gifts.ts, (checkout)/(site)/gift/[token]/, db/checkoutView.ts, (ops)/ops/gifts/ | U-063, U-062a, U-064a, U-064b, U-113 (U-063 and U-064b →Std if Dave agrees) | 6.75–13.75 |
| W3-B CMS and gift checkout | 2 (W2-C) | U-076a → U-076b → U-076c → U-078 → U-062b | U-073; U-062b after U-062a | (ops)/ops/editorial/, ops/settings/, lib/richText/, components/RichTextEditor/, actions/editorial.ts, actions/settings.ts, db/settings.ts, db/taxonomy.ts (new); (checkout)/(site)/gifts/checkout/, components/GiftCheckout/, experiences/[slugAndId]/ gift entry | — | 7.25–14.3 |
| W3-C Reviews and host cancel | 4 (W2-B) | U-060 → U-044 → U-061 → U-083b → U-070 | U-073, U-059, U-068 | schema/reviews, jobs/reviewInvite*, (checkout)/(site)/review/, fixtures/reviews.ts, db/browse.ts, db/home.ts, lib/experienceCards.ts, components/ExperienceCard/, ExperiencePage/reviews, (ops)/ops/reviews/, ops/requests/, (host)/host/sessions/[id]/cancel | U-070 | 10.25–14.75 |
| W3-D Test console | 5 (W2-A) | NEW-4 → NEW-5 → NEW-7 | U-073, NEW-2; NEW-7 after U-075, U-077, U-083a, U-083b | (ops)/ops/dev/, (ops)/ops/page.tsx (dashboard), ports/clock, db/seed/reset.ts | — | 12.75–15.0 |

### Wave 4: test bed

Run after MVP-3 in this order: U-095, U-092, U-042, U-086 (after U-064a), U-089, U-096, U-100 (after U-105, U-051, and ideally after every MVP route exists).

A builder waiting on a human-read may pick up U-095 (lighthouserc, its own CI job) or U-092 (app/sitemap.ts, app/robots.ts) in that slot, provided no running lane holds those files.

## 5. Dave-only items

1. **Approve this re-plan.** Then the PM logs it in `delta-log.md`, adds MVP-1, MVP-2 and MVP-3 as `Plan` options on board #19, and sets every row.
2. **Decide on gifting: IN-LITE (recommended) or OUT.** This decides W1-E's second unit and seven units in W3-A and W3-B.
3. **Human-read approvals on the critical units**, 25 in all:
   - Auth: U-004a, NEW-1, U-022
   - Gifting: U-017, U-063, U-062a, U-064a, U-064b, U-113
   - Ops: U-073, U-074a, U-112, U-077, U-108
   - Money: U-056, U-106, U-055, U-057, U-059
   - Host: U-067, U-068, U-070
   - Accounts: U-107, U-072
   - Test bed: U-086

   Read U-004a, U-073 and U-074a first: they sit on the critical path. Re-tiering U-063 and U-064b to Standard would remove two of the reads.
4. **Secrets and rulesets:**
   - Set the Better Auth secret and the sign-in-link signing key in Vercel (U-004a).
   - Provide a Neon API key or a branch database URL as a GitHub Actions secret for U-105's e2e database.
   - Add U-105's smoke as a required check in the ruleset.
   - Confirm the U-006 mailbox shared secret is set on the testing deployment.
5. **Issues** (the PM prints the `gh` commands; Dave runs or approves them):
   - Close the 32 cut issues as not planned: #6, 35, 53, 58, 62, 63, 78, 79, 80, 81, 86, 101, 102, 103, 104, 105, 106, 110, 112, 113, 115, 118, 119, 120, 123, 124, 125, 126, 127, 129, 131, 132.
   - Close #151 (U-119) as done.
   - Create the eight NEW-n issues.
   - Edit issue bodies to re-point dependencies: #29, #88, #89, #97, #98 and #99 drop U-004b; #97 drops U-079a; #99 drops U-017; #48 drops U-036. Also apply the lite cuts listed in section 2.
6. **U-102:** yes to the gitleaks allowlist, and dismiss secret-scanning alert #1 (owner action).
7. **U-119:** turn on Web Analytics and Speed Insights in the Vercel project.
8. **Forecast:** still do not run `board-dates.ts --run` until the Plan-field drop-list change lands. The 11-02 note stands.
9. **Optional:** Dave's manual keyboard and screen-reader walk of checkout (U-100) is no longer a gate.

## 6. Totals

| Verdict | Units | Days |
|---|---|---|
| IN | 14 | 18.3 |
| IN-LITE | 37 | 46.75 |
| New units | 8 | 6.5 |
| **MVP total** | **59** | **71.55** |
| TEST-BED | 8 | 8.25 |
| CUT | 32 | 0 |
| Open units classified | 91 (+8 new) | |

- **Gifting share of the MVP:** 7 units, 9.5 days, cut if Dave says OUT.
- **Dependency critical path: 10.25 agent-days.** It runs U-004a (2) → U-073 (1.75) → U-074a (1.5) → U-074b (3.5) → U-074c (1.5). U-075 (1) → NEW-7 (0.5) ties it. Three human-reads sit on this path: U-004a, U-073 and U-074a.
- **Schedule with five builders: about 15 agent-days** for wave 3 to end, set by W3-D, with W3-C at 14.75. Each critical unit's human-read wait adds to that.
- Agent actuals have run at 4 to 42 percent of estimate, so the calendar refit decides the real dates.

Source files: /Users/davidfleming/Workspace/ramble-pm/drafts/.units-open-2026-11-10.json, /Users/davidfleming/Workspace/ramble-pm/drafts/demo-replan-2026-11-02.md, /Users/davidfleming/Workspace/ramble-pm/STATUS.md.