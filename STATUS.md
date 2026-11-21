# Status

**Updated:** 2026-11-19 08:40 by the lead. Folded the `agents-cloud` lane: `audit/nightly-2026-11-18` merged into `main` here, N1118-1 closed by PR 1048, owner steps added to `## Blocked on Dave`; the owner wants a Copilot code review trial on the nightly fix PRs (DECISIONS). Earlier today: PR 1048 (B6 exemption for the auth-row purges) merged 2026-11-18 22:43 EST (`cfc4662`); its worktree and branches are removed. Zero open issues and PRs. Roadmap refreshed 2026-11-19 (status.json, standup, index.html); not run: schedule refit and board dates (blocked, item 4), N1111-11 filed by the owner as ramble #1049 (not on the Maintenance sprint: board #19 has no Sprint field now, so the board step fails until it is rebuilt; `nightly-fix` label does not exist yet), claude.ai artifact republish (no artifact tool in this chat). The full-run audit now covers the whole run: `drafts/full-run-audit-pre-freeze-2026-11-18.md` joins the post-freeze half, and both are captured in the owner's vault. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `audit-auth` | #1005 (U-004a, critical): rate-limit keys on the two auth form posts; PR 1042 (#1004) waits on `human-read`; history in `lanes/audit-auth.md` | swarm subagent round 5, 2026-11-18 | handed off: PR 1047 (B-1, U-004a) and PR 1044 (#1005) at review, both waiting on human-read; see lanes/audit-auth.md | 2026-11-18 |
| `owner-pack` | one protected-files PR for the owner's bypass merge: #999 (`scripts/merge-desk/scope-check.ts`) and the standards lines in `.claude/standards/architecture.md`; history in `lanes/owner-pack.md` | swarm subagent, 2026-11-18 | handed off: PR 1043 open, waits on the owner's bypass merge | 2026-11-18 01:25 |
| `audit-w3` | read-only audit of wave 3 code (PRs 1019 to 1042) into `audits/wave3-2026-11-18.md`, combined into fix batches, low-value findings dropped; no code | swarm subagent, 2026-11-18 | handed off: 4 batches (B-1 to B-4), highest severity medium; not filed | 2026-11-18 01:30 |
| `w3-fix-b2` | audit batch B-2 (W3-2, U-078, standard): stale settings form undoes a concurrent change; owns `opsSettings.ts`, `db/settings.ts`, the settings action and `/ops/settings` form; history in `lanes/w3-fix-b2.md` | swarm subagent, 2026-11-18 | handed off: PR 1046 merged 2026-11-18 06:41 | 2026-11-18 02:45 |
| `w3-fix-b3` | audit batch B-3 (U-076c, standard): legal audit row inside the transaction, stale TODO and cache comments; owns `db/legal.ts`, `db/legalAdmin.ts`, comments in `home.ts`, `landing.ts`, `experiencePage.ts`; history in `lanes/w3-fix-b3.md` | swarm subagent, 2026-11-18 | handed off: PR 1045 merged (W3-3 fixed) | 2026-11-18 06:20 |
| `agents-cloud` | agent jobs off the Mac: cloud nightly audit (live), nightly fix agent (ADR 0011) and bug finder (ADR 0012), drafted, not pushed; history in `lanes/agents-cloud.md` | agents-cloud chat (bug finder build), 2026-11-21 10:15 | active: builder adding ADR 0012 and `bug-finder.yml` on `pm/nightly-fix-agent` | 2026-11-21 10:15 |
| `lead` | Shared status, `## Next`, roadmap, memory; B6 follow-up; whole-run audit | PM lead, 2026-11-19 (status chat) | handed off: agents-cloud folded, 11/18 cloud audit merged; N1111-11 not filed; roadmap refreshed (artifact not republished) | 2026-11-19 09:00 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: audit-auth
**Closed out by the lead, 2026-11-18 05:55.** PRs 1042 (#1004), 1044 (#1005) and 1047 (audit W3-1) merged on the owner's approvals; worktrees and branches removed. Nothing left in this lane. History: `lanes/audit-auth.md`.

### Lane: owner-pack
PR 1043 merged by the owner's bypass on 2026-11-18 (`04291ac`); #999 closed; worktree and branch removed. Nothing left in this lane.

### Lane: audit-w3
Done 2026-11-18: `audits/wave3-2026-11-18.md`, 17 raised, 4 kept, 13 dropped, none filed. For the lead: 4 batches, one per unit, no file overlap: B-1 U-004a (IPv6 /64 key, critical), B-2 U-078 (stale settings form), B-3 U-076c (legal audit in the transaction), B-4 U-044 (review erasure, with U-085). Highest severity medium. History: `lanes/audit-w3.md`.

### Lane: w3-fix-b2
Done 2026-11-18: PR 1046 (U-078, audit W3-2) merged 06:41, three rounds, all checks green, no owner approval (standard tier). For the lead: `checkExpectedVersion` in `src/lib/sessions.ts` is now generic (string versions, null never matches); duplication audit item: unify the integer and timestamp version forms. History in `lanes/w3-fix-b2.md`.

### Lane: w3-fix-b3
PR 1045 merged 2026-11-18 (`fdb1d5a`, head `ea3ea34`, U-076c standard), round 1, all four agent checks passed. W3-3 fixed: legal draft, edit and publish write their audit row in the same transaction; stale TODOs and taxonomy comments corrected. For the lead: none to carry.

### Lane: guest-signin
- **2026-11-19, owner test pending.** U-130 merged 2026-11-17 ([PR 1020](https://github.com/defaultdave/ramble/pull/1020), `80cd4a1`), with sign-in rate-limit follow-ups 1041 and 1044. Not yet tested by the owner.
- **For the lead:** add to `## Blocked on Dave`: "Test guest sign-in on the deployed site: enter a new email, get the on-screen link, land signed in; then a known staff or host address gets the normal 'link sent' reply and the link shows only in `/ops/mailbox`. Check `EMAIL_MODE` is `sink` there first." Also drop "guest sign-in waits for U-130" from `### Next chat: walkthrough`, since it has landed.

### Next chat: agents-cloud
- **Before you start:** nothing. You read the finder's first issues later; secrets wait until both ADRs are accepted.
- **Run:** `/ramble-pm lane: agents-cloud` in a new desktop chat, started from the ramble main checkout.
- **Model and effort:** Sonnet, medium for the PM. The builder runs Sonnet.
- **Prompt:** You are the agents-cloud lane. Claim it and publish first. Read `drafts/adr-0012-bug-finder.md` in ramble-pm (the bug finder: owner chose GitHub Actions and opts each finding in to the fixer by hand) and `lanes/agents-cloud.md`. Launch one builder (`/senior`-style, worktree cut from local branch `pm/nightly-fix-agent` at `41c1f94`, not from main) with a scope manifest. IN SCOPE: `docs/adr/0012-bug-finder.md` (from the draft), its row in `docs/adr/README.md`, `.github/workflows/bug-finder.yml` (workflow_dispatch only, no schedule), `scripts/bug-finder/` (`area.ts` with a test, `investigate-prompt.md`, `verify-prompt.md`, `file.ts` with a test for the duplicate check and issue body), and the `Unit:` line support in `scripts/nightly-fix/pick.ts` plus `pick.test.ts`. OUT OF SCOPE: product code, `nightly-fix.yml` beyond what the picker change needs, merge-desk scripts, settings, secrets. REFERENCE CODE: `nightly-fix.yml` and `scripts/nightly-fix/` for the job split and runner rules. Done: `bun test scripts/bug-finder scripts/nightly-fix` passes, `actionlint` (if installed) is clean on both workflows, files touched match the manifest, one local commit on `pm/nightly-fix-agent`. Then print for the owner the push, PR and bypass-merge commands, the secret and label list, and the three hand dispatches. Don't push and don't open the PR; .github changes are the owner's push.


### Lane: agents-cloud
- **2026-11-21, nightly jobs checked:** cloud routine on, no report since the 11/18 test run by design: 11/19 saw only PR 1048 (`pm/` branch, one line of `architecture.md`, no product code, dropped like PR 1043 in the test run); 11/20 and 11/21 had no merges. Run log not read here (no routine tool); routine prompt unchanged. Local `ramble-nightly-audit` and `ramble-nightly-agent-review` are disabled since the owner's 2026-11-13 stop, so one audit a night, not two. Fix agent (ADR 0011) parked. Table and paths: `lanes/agents-cloud.md`.
- **For the lead:** rewrite Blocked item 5 (drop the run-log check and the "turn off local audit" step; local audit is already off and comes back only if the owner wants the visual and performance lenses); owner kept the local tasks off (DECISIONS 2026-11-21, which also corrects the 11-19 entry); public memory: a missing `audit/nightly-<date>` branch can be a normal skip. Detail: `lanes/agents-cloud.md` "For the lead (2026-11-21)".

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts
Eight open PRD facts (Q-11 to Q-21) with their working assumptions: `open-client-facts.md`. None blocks the demo.

## Blocked on Dave
Refreshed 2026-11-18 12:06 by the lead. Nothing here blocks a ticket; all tickets are closed.

1. **Test guest sign-in on the deployed site** (U-130, from the guest-signin lane): check `EMAIL_MODE` is `sink` there first; enter a new email, get the on-screen link, land signed in; then a known staff or host address gets the normal 'link sent' reply and the link shows only in `/ops/mailbox`.
2. **Read the full-run audit, both halves,** and pick which recommendations to adopt: `drafts/full-run-audit-pre-freeze-2026-11-18.md` (concept to freeze, with the seven whole-run lessons) and `drafts/full-run-audit-2026-11-18.md` (freeze to now). Summary in the vault: `Projects/Personal/Ramble Process Audit/Ramble Full-Run Audit 2026-11-18.md`. Cost correction: about $5,360 for the run, not $5,060.
3. **Walkthrough** (your time, five passes): `### Next chat: walkthrough`. Its findings become the page-change units.
4. **Tooling the lead could not fix alone:** `board-dates.ts` needs the board's Sprint field deleted and rebuilt (a board settings change); `forecast.ts` needs solo estimates for U-120 to U-130 before the schedule can be refit.
5. **Agent jobs in the cloud** (`lanes/agents-cloud.md`):
   - Check the routine's run log for 2026-11-19 (https://claude.ai/code/routines/trig_019AVDCqk2jbtu79azLejPE2): no `audit/nightly-2026-11-19` branch was pushed although `main` had merges in the window.
   - Turn off the local `ramble-nightly-audit` task once the cloud routine has one clean scheduled night. Doing so drops the visual and performance lenses, which the cloud run does not have.
   - Nightly fix agent (ADR 0011, branch `pm/nightly-fix-agent`, `41c1f94`, local only), if you take it up: push and open the PR (bypass merge); secrets `ANTHROPIC_API_KEY` (dedicated, spend-capped), `RAMBLE_APP_ID`, `RAMBLE_APP_INSTALLATION_ID`, `RAMBLE_APP_PRIVATE_KEY`; variable `CLAUDE_CODE_VERSION`; label `nightly-fix`. For the Copilot review trial: turn on Copilot code review for the repo (a settings or ruleset change, yours).
   - Fix two paths in `~/.claude/scheduled-tasks/ramble-nightly-agent-review/SKILL.md`: `agent-memory` to `agent-memory-local`, `scripts/plan/site.ts` to `scripts/pm/site.ts`.
6. **Production migrations 0024 to 0034** before the next production deploy. **U-129:** create its issue and board item. **Sentry** and **Method Layer 0:** as before (`lanes/lead.md`).

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Ticket goal (owner, 2026-11-18): met.** Zero open issues, zero open PRs. PR 1048 merged 2026-11-18. Order from here: (1) the owner tests guest sign-in on the deployed site; (2) the walkthrough, then page-change units from its findings with dictionary phases 1 to 4 riding along; (3) the owner's choices from the full-run audit; (4) the board Sprint field and the U-120 to U-130 estimates, so `board-dates.ts`, `audit-tickets.ts --run` and the schedule refit work again.

Not built, by decision: audit W3-4 (review text erasure) travels with U-085; the 45 cut and parked units are closed and stay in `docs/plan/units.yaml`.

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items: `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: lead
- **Before you start:** nothing.
- **Run:** `/ramble-pm` in a new desktop chat, started from the ramble main checkout.
- **Model and effort:** Sonnet, medium. Builders Sonnet, narrow checks Haiku.
- **Prompt:** You are the lead. Read `## Blocked on Dave` and `## Next` in `STATUS.md`. PR 1048 is merged and cleaned up. Merge any new `audit/nightly-*` branch after reading it; N1111-11 is ready to file with `bun tools/audit-tickets.ts --run` (blocked while the board Sprint field is broken, check first). If the owner has picked recommendations from the two full-run audit drafts, log them in `DECISIONS.md` and apply the ones in ramble-pm files; otherwise start the walkthrough lane. Also run the roadmap refresh this chat skipped (status.json, standup, `bun tools/plan/roadmap.ts`, artifact republish). Done looks like: STATUS and the roadmap current and published. Don't commit in ramble outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in (U-130) has landed and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
