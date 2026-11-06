# Status

**Updated:** 2026-11-04 evening by the lead. **One merge lane:** Dave merged PR 905 (process audit 5.3): every unit now targets `main`; critical-tier PRs need the `human-read` check, which passes only on Dave's approval of the head. `integration`, syncs and promotions are retired; `integration` is 0 commits ahead of `main` and no PR targets it. PR 858 (sweep finished lanes at claim) also merged. Test fixes are done (W1 to W11, the 800-line limit enforced by PR 903). Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `pr-showcase` | Read-only: find a merged PR that shows the agent team running and checking itself (evidence images, checks with feedback that changed the code); no code, no tickets | PM pr-showcase, 2026-11-06 | closed: showcase picks PR 273 (lead), 246, 228; answered in chat, nothing changed in ramble | 2026-11-06 15:45 |
| `role-tests` | The duplicated "can create the role a second time" tests in `tests/db/audit.db.test.ts` and `tests/db/ledger-guard.db.test.ts` (TB-1, from the test-bloat measurement 2026-11-04); no other test file | PM role-tests, 2026-11-04 (from a Cleo handoff) | handed off: PR 899 open, four checks posted, review requested, auto-merge queued | 2026-11-04 14:05 |
| `maint-tail` | The agent-fixable open audit tickets left after wave 4: #793, #791, #315, #363, #835 (race tests only) | PM maint-tail, 2026-11-04 (swarm) | handed off: #793 closed; PR 863 round 2 pushed (head 308f02c, four checks posted); PR 862 queued; #315 and #363 to the lead | 2026-11-04 12:40 |
| `pf7-island` | Sprint 1 close follow-ups: PF-7 client island, PRs 489 and 520, U-102 | continuation of the earlier lead chat, 2026-11-01 (night) | handed off: PR 715 merged, 489 and 713 merged, 520 closed; U-102's rest is in Next | 2026-11-02 14:20 |
| `maint-wave-1` | Maintenance wave 1: PRs P01 to P07 from `audits/maintenance-triage-2026-11-01.md` | PM maint-wave-1, 2026-11-01 (night) | handed off: all seven PRs merged | 2026-11-02 02:00 |
| `maint-wave-2` | Maintenance wave 2: PRs P08 to P14, P25, N1030-10 in P10 from `audits/maintenance-triage-2026-11-01.md` | PM maint-wave-2, 2026-11-02 (evening) | handed off: 8 of 9 PRs merged or queued (see lane entry) | 2026-11-02 23:55 |
| `lead` | Shared status, `## Next`, roadmap, memory; finish-off swarm (test waves, maintenance tail) | PM lead, 2026-11-04 (morning, swarm) | active | 2026-11-04 09:45 |
| `maint-wave-4a` | Wave 4 drain, checkout: W4-A1, W4-A2, W4-B from `drafts/maintenance-wave-4-2026-11-04.md` | PM maint-wave-4a, 2026-11-04 (night) | handed off: PRs 848 (into `integration`), 850, 851 open, checks posted, auto-merge queued | 2026-11-04 01:05 |
| `maint-wave-4b` | Wave 4 drain, browse, landing, home, gallery: W4-C to W4-F from `drafts/maintenance-wave-4-2026-11-04.md` | PM maint-wave-4b, 2026-11-04 (night) | handed off: PRs 849, 853, 855, 857 merged into `main`, 856 into `integration`; #793 and #319 stay open | 2026-11-04 01:25 |
| `maint-wave-3` | Maintenance wave 3: P15 to P20 plus P26 `ticket-comments` (N1031-15) from `audits/maintenance-triage-2026-11-01.md` | PM maint-wave-3, 2026-11-03 (night) | handed off: 831, 820, 837, 825, 840, 846 and sync 845 merged; 838 and 839 were in CI at hand-off | 2026-11-04 00:20 |
| `test-fixes` | Test audit fixes from `audits/test-audit-2026-11-03.md`: waves W1 to W11 (TA-1 to TA-23, TA-25, TA-26, TA-29; size work W10 and the 800-line limit W11) | PM test-fixes (takeover), 2026-11-04 | handed off: every wave merged but W11 (PR 903, `ENFORCE_HARD_LIMIT`), checks posted, auto-merge queued; open items in `### Next chat: test-fixes` | 2026-11-04 16:50 |
| `test-audit` | Test audit first pass, findings only: the largest test files and the 8 `test-audit` track rows in `audits/maintenance-triage-2026-11-01.md`; sets the test size target; no code | PM test-audit, 2026-11-03 | handed off: findings in `audits/test-audit-2026-11-03.md` (TA-1 to TA-28, 8 waves); no tickets filed | 2026-11-03 |
| `critical-path` | U-005 then U-014a into `integration` (released 2026-10-29 12:10), PR 222 through the next promotion; then U-014b, U-048 (critical, holds and webhook side of the money path) | critical-path lane, 2026-10-29 (afternoon) | handed off | 2026-10-29 13:05 |
| `audit-fixes` | Every open audit item that is a clear fix and not part of the `src/lib` refactor: home `open` rows, BE-13, BE-8, BE-7 (with a `src/lib`-owned predicate; PR D of the refactor consolidates it), BE-14, BE-1, nightly N1029-1 to 7, 10, 11; fix-rounds PRs with before-and-after evidence | PM audit-fixes, 2026-11-01 (late morning) | handed off | 2026-11-01 13:50 |
| `e2e-money` | The end-to-end prototype on the fake payment adapter: stub glue (merged), U-019 and U-045b (merged), U-015, U-016, U-054, U-047a, U-047b, U-049, U-050, U-040, U-041, and since 2026-10-29 16:30 the critical-path money units U-014a, U-014b, U-048 (Dave) | e2e-money lane, 2026-10-30 (evening: BC-37, BC-38 glue, click-through, BC-1, BC-48) | handed off | 2026-10-30 21:00 |
| `lib-refactor` | H-18 PRs A to G, one at a time, plus the DRY audit items they absorb (`drafts/lib-layout-refactor.md`); the follow-up component PRs after G | lib-refactor lane, 2026-10-29 (evening) | handed off | 2026-10-29 21:05 |
| `home-feedback` | Dave's prototype feedback on the home page, 2026-10-31: font swap jump, hero search Guests field, hero and header search against Figma (PF-1 to PF-3) | PM home-feedback, 2026-10-31 | handed off | 2026-10-31 10:25 |
| `browse-perf` | Dave's browse feedback, 2026-10-31: LCP image lazy-loaded, filter button slow to hydrate and closes on double click | PM browse-perf, 2026-11-01 | handed off | 2026-11-01 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: lead (Maintenance triage)
- **2026-11-04 early morning, handed off.** Dave: test audit now (DECISIONS 2026-11-03). Lanes `test-audit` (report published `a3f5bb6`), `maint-wave-3` and `test-fixes` ran from this chat and are handed off. Filed 100 audit tickets with `audit-tickets.ts --run`: TA-2 to TA-29 new (#814 to #836; nine TA rows map to existing tickets) plus the unfiled nightly N1102-1 to 70 and N1103-1 to 9 (filed untriaged, the routine step). PR 838 (P15) failed `db` on `holds.db.test.ts` "refuses a paying hold and changes nothing": two `Date.now()` calls let `payingUntil` fall a millisecond before `expiresAt` (check `holds_paying_until_not_before_expiry`); not P15's. Reran the failed job: passed, 838 merged at `d0203cc`. Cause recorded on TA-26 (#833), fix after the next promotion because W1c split this file in `integration`. #359 (BE-17) was closed by PR 820's `Closes` though BE-17 was reverted: Dave reopens it. P20 (840) touched two files outside its manifest (`UpcomingSessionsContent.tsx`, `BookingContent.tsx`, the only callers of the error view); accepted, delta-log.
- Older entries: `lanes/lead.md`.

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts (from the PRD, tracked work, not decisions)
| Q | Needs | Feeds |
|---|---|---|
| Q-11 | Answered by the spike (docs only): FareHarbor, Peek Pro, Mindbody need a partner program; Acuity yes (host on Premium); Square no; Eventbrite read-only. Launch on allocations (ADR 0002). Still needed: Marcus's tally of hosts by system | P4 estimate |
| Q-12 | NYC sales tax map | Launch; tax display is already decided by PRD-78 |
| Q-13 | Sponsor contract: what the $60k needs | Launch scope, gift cards (PRD-34) |
| Q-14 | Launch-day catalog size | P4 |
| Q-16 | Lawyer engaged | Terms, waivers, seller-of-record confirmation |
| Q-19 | Monthly burn | Risk ratings in P4 |
| Q-20 | Newsletter traffic per issue | ADR R7 |
| Q-21 | Investor's GMV bar | G6 |

In this demo, the client facts have no one to ask. Where a fact blocks a decision, the PM proposes a working assumption and logs it as one.

## Blocked on Dave
Consolidated 2026-11-04 night for the STATUS.md size limit: only items still open. The original dated lists, with their struck-through and resolved items, are in `lanes/lead.md`. Nothing here blocks the current goal.

1. **`CLAUDE.md` gate bullet** (SC-27's second half): branch `pm/claude-md-db-generate` (`b10fbf3`) is pushed but not merged. CLAUDE.md is protected, so you open the PR and bypass-merge it. The next production deploy needs `db-migrate-production` for migration 0022.
2. **Your files, `.claude/standards/architecture.md`:** the B6 money-path exemption (BC-15); B13 wording (N1030-7); the `lib/pages` zone and island allowlist (N1030-8); the B3 exemption for the `process.env.NEXT_RUNTIME` guard in `src/instrumentation.ts`, and line 44's nonce wording; an `image` port in the layers table (U-010). Before U-014a and U-047a work resumes: whether B6 covers Caller-less configuration reads and transaction-joined writes (DECISIONS, U-018 ruling). In `stack-decisions.md`, SEC-10 still says "Report-only first".
3. **U-102 (#130):** MFA confirmation, then the PM finishes the rest (listed under Next, "Demo re-plan approved").
4. **The App:** confirm it has Issues read and write.
5. **Vercel:** the beacon firewall rule (commands in PR 193's body), BotID, and `SENTRY_DSN` plus `SENTRY_BROWSER_DSN` (the browser one at build time too) once the Sentry projects exist. **Sentry:** the server and browser projects, the ops address, the three alert rules in `docs/runbooks/alerting.md`. **GitHub:** private vulnerability reporting, so `security.txt`'s contact works.
6. **Small PRs on protected paths:** allowlist U-007's fake Stripe fixtures for push-time gitleaks (delta-log 2026-10-26); skip the `expire preview branch` job on Dependabot PRs; add the lint and TypeScript config files to `PROTECTED` in `scripts/merge-desk/scope-check.ts`.
7. **Method Layer 0** (open decision 3): not needed until P6.

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Goal set by Dave, 2026-11-04 night (lead):** finish the test fixes and every maintenance wave, draining the maintenance tickets as far as possible, before Sprint 3 (login and admin) starts. Filing bar adopted (DECISIONS 2026-11-04): open audit tickets 222 to 54. Plan: `drafts/maintenance-wave-4-2026-11-04.md` (7 combined PRs, lanes `maint-wave-4a` and `maint-wave-4b`), test audit waves W2 to W8 in lane `test-fixes`, owner pack (9) and 5 PM actions in the lead. Machine limit: five builders across all lanes.

**Client islands review (Dave, 2026-11-01):** at the end of this sprint, a review of every client island against the allowlist, including the PF-7 island: what each costs in JS, and whether it still earns its place.

**Demo re-plan approved 2026-11-02 (Dave):** `drafts/demo-replan-2026-11-02.md` replaces the production-ready draft. Board #19 `Plan` field: Sprint 2 (U-033, U-037, U-102, U-105, U-051, plus maintenance waves 2 to 4, the test audit, comment cleanup, architecture drift and dead code, the client islands review, then planning Sprint 3), Sprint 3 (U-004a, U-022, U-073, U-112, U-076a to c, U-074a and b, U-107), Test bed (10 units), Parked (44), Cut (24, still open issues: Dave closes them as not planned if he wants them off the board). Email sign-in links for every role; U-004b is cut, so U-022 and U-073 depend on U-004a and U-112 invites by email link. **Forecast not refit and do not run `board-dates.ts --run`:** the scripts can drop a unit only by marking it done, which would put parked and cut units back on the calendar and overwrite the Sprint values set by hand. A small tooling change (a drop list read from the board's `Plan` field) comes first; it is a Sprint 2 item for the lead. **U-102 rest (waits on Dave's yes):** gitleaks fixture allowlist for the weekly scan (16 test fixtures), dismiss secret-scanning alert #1, the fake-secret dry run, recheck the `integration` ruleset, tick the runbook, close #130. **SC-25 conflict:** the owner sheet closed it as won't, but #709 was retitled to finish no-script streaming; settle it with Dave.

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items (done or superseded): `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: test-fixes

**Before you start:** PR 903 merged and #827, #829 are closed (checked 2026-11-04 by the lead). **Run:** `/ramble-pm lane: test-fixes`. **Model and effort:** Sonnet, medium. **Prompt:** Lane `test-fixes`, round 2, from `audits/test-audit-2026-11-03.md` and the lane entry in `STATUS.md`. All scheduled waves are merged (W1 to W11). Remaining, in this order: (1) the load flakes: `tests/db/holds-races*.db.test.ts` '30 devices after 10 spaces' and '60 reserves of 1 to 3 spaces' (5 s timeouts in nearly every full run under load; find what makes them slow, then seed or batch, do not raise the timeout; also check `holdFixtures.ts` and holds-races for the same double `Date.now()` read TA-26 fixed in the other holds files), then `jobs-recheck` and `jobs.db` 'stops at 200 jobs' if they recur; (2) TA-27 (#834): one shared test clock, adopt `src/lib/testClock.ts` in `confirmOrder`, `jobs`, `orders`, `refunds`, `payments`, `formGuard`, `actions/holds` tests; (3) small follow-ups logged by builders: `expectConstraint` and `makeDriverError` not yet used in every db test, other `uuid(n)` copies (`CheckoutPage.stories.tsx`, `CheckoutPage.test.tsx`, `editorial.test.ts`, `pages/checkoutForm.test.ts`, `ports/payments/fake.test.ts`), `reference()`/`valueOf`/`notNull`/`invalidText` copies that could import from `orderFixtures`/`ledgerFixtures`, `tagsUpdated` repeated in three editorial files, a literal-`1001` allocation test (the over-limit tests follow `maxAllocation`, so raising it is caught by nothing), a unit test on `seatUpdates` with an equal count, `sessions` `AllocationSchema` max not pinned, an empty `import {}` in `browse-guests`, an empty `beforeEach` in `BookingPanel.browser.tsx`; (4) TA-28 (#835) money and hold coverage gaps only (`maint-tail` did the race tests, PR 862); TA-24 stays parked; (5) size guard gaps: `scripts/*.test.ts`, `.storybook`, `tests/contracts/payments-port.ts` (994 lines, not a `*.test.*` file) are outside the roots of `scripts/test-size.ts`. Before splitting any file, diff it against `origin/integration`. Each PR: overlap check, `senior` builder (`isolation: "worktree"`, run `pnpm format:check`), independent reviewer with four verdicts and a mutation proof for every cut, locked `test:db`, `post-check.ts` on the final head, `U-001:` title, review requested, auto-merge. Builders across all lanes are capped at five. Never touch CLAUDE.md or `.claude/standards/`. Don't commit in the ramble main checkout.

### lead

**Update 2026-11-04 morning (read first):** **Run:** `/ramble-pm` on the main checkout. **Model and effort:** Sonnet, medium. **Before you start:** nothing. **Prompt:** Goal (Dave, 2026-11-04): finish test fixes and drain maintenance. (1) Wave 4 is merged (all 7 PRs; 848 and 856 reach `main` at Dave's next promotion, which closes #319 and #326/#735). Set wave 4's tickets Done on board #19 and update the audit rows the 4b lane left (its note says board and audit rows not updated). Check #793 (N1102-59) against `main`: PR 855 did not close it; fix in a small PR or move to the digest. (2) Follow lane `test-fixes` (session local_79bab8ad): 859 (W3+W4) re-verifying at `5d27ffa`; then W5a to W5j, W6, W7, W8 per its Next chat block. (3) The 30 open audit tickets: sort by the filing bar, plan wave 5 from what is left, or digest it. (4) Owner sheet for Dave: Neon preview branching (#427, #363; it fails `expire preview branch` on every PR, not required), R2 #697, BotID #791. The standards owner pack merged as PR 860 (2026-11-04), closing #737, #738, #433, #434, #320. (5) PM action H-23 (#367) keyboard and 320 px check. (6) Lead end steps not done this session: roadmap `status.json`, standup and republish (https://claude.ai/artifact/8vvxU5shDbM9uQkYSTLEiw); compact public PM memory (about 22 KB). (7) Clean up: scratch worktree `sync-wt` and local branch `sync/2026-11-04b`; worktree removal and `git branch -D unit/*` no longer prompt (Dave's user settings, 2026-11-04). Don't commit in the ramble checkout.

Older updates: `lanes/lead.md`.
