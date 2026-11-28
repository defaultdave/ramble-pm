# Status

**Updated:** 2026-11-28 02:10 by the lead. PR 1062 (gitleaks ignore list) and PR 1059 (Dependabot actions bump) merged on the owner's bypass. Dependabot PRs 1060 and 1061 are replaced by PRs 1063 and 1064 (same bump plus a test-only lint fix; the App cannot push to `dependabot/` branches); review requested and auto-merge queued on both. Production still on the 11/04 build (Blocked 6). Swept the handed-off lane sections into `lanes/`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `audit-auth` | #1005 (U-004a, critical): rate-limit keys on the two auth form posts; PR 1042 (#1004) waits on `human-read`; history in `lanes/audit-auth.md` | swarm subagent round 5, 2026-11-18 | handed off: PR 1047 (B-1, U-004a) and PR 1044 (#1005) at review, both waiting on human-read; see lanes/audit-auth.md | 2026-11-18 |
| `owner-pack` | one protected-files PR for the owner's bypass merge: #999 (`scripts/merge-desk/scope-check.ts`) and the standards lines in `.claude/standards/architecture.md`; history in `lanes/owner-pack.md` | swarm subagent, 2026-11-18 | handed off: PR 1043 open, waits on the owner's bypass merge | 2026-11-18 01:25 |
| `audit-w3` | read-only audit of wave 3 code (PRs 1019 to 1042) into `audits/wave3-2026-11-18.md`, combined into fix batches, low-value findings dropped; no code | swarm subagent, 2026-11-18 | handed off: 4 batches (B-1 to B-4), highest severity medium; not filed | 2026-11-18 01:30 |
| `w3-fix-b2` | audit batch B-2 (W3-2, U-078, standard): stale settings form undoes a concurrent change; owns `opsSettings.ts`, `db/settings.ts`, the settings action and `/ops/settings` form; history in `lanes/w3-fix-b2.md` | swarm subagent, 2026-11-18 | handed off: PR 1046 merged 2026-11-18 06:41 | 2026-11-18 02:45 |
| `w3-fix-b3` | audit batch B-3 (U-076c, standard): legal audit row inside the transaction, stale TODO and cache comments; owns `db/legal.ts`, `db/legalAdmin.ts`, comments in `home.ts`, `landing.ts`, `experiencePage.ts`; history in `lanes/w3-fix-b3.md` | swarm subagent, 2026-11-18 | handed off: PR 1045 merged (W3-3 fixed) | 2026-11-18 06:20 |
| `agents-cloud` | agent jobs off the Mac: cloud nightly audit (live), nightly fix agent (ADR 0011) and bug finder (ADR 0012), both on `main`, ADRs still Proposed; history in `lanes/agents-cloud.md` | agents-cloud chat (bug finder build), 2026-11-22 | active: bug finder canary tests; PR 1056 open | 2026-11-22 |
| `lead` | Shared status, `## Next`, roadmap, memory; B6 follow-up; whole-run audit | PM lead, 2026-11-28 (took over from the 2026-11-22 production migration chat) | active: Dependabot PRs 1059 to 1061, gitleaks failure, roadmap refresh; production migrations wait on the owner's secret reset | 2026-11-28 01:20 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: guest-signin
- **2026-11-19, owner test pending.** U-130 merged 2026-11-17 ([PR 1020](https://github.com/defaultdave/ramble/pull/1020), `80cd4a1`), with sign-in rate-limit follow-ups 1041 and 1044. Not yet tested by the owner.
- **For the lead:** add to `## Blocked on Dave`: "Test guest sign-in on the deployed site: enter a new email, get the on-screen link, land signed in; then a known staff or host address gets the normal 'link sent' reply and the link shows only in `/ops/mailbox`. Check `EMAIL_MODE` is `sink` there first." Also drop "guest sign-in waits for U-130" from `### Next chat: walkthrough`, since it has landed.

### Next chat: agents-cloud
- **Before you start:** the owner decides whether to file the two-tab route to the dead checkout (`submit`, `CheckoutPage.tsx:136`) and whether to build prompt B.
- **Run:** `/ramble-pm lane: agents-cloud` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Prompt:** You are the agents-cloud lane. Claim it and publish first. Read `audits/finder.md` with its corrections and the newest entries in `lanes/agents-cloud.md`. Small proven steps, one change per run (owner, 2026-11-21): (1) done 2026-11-22: run 45051374931 on `main` filed the Back-after-payment bug as issue 1057; (2) done 2026-11-22: PR 1058, the fixer's first, merged; decide the two-tab route before planting, since it could mask too (the fixer runs nightly at 09:00 UTC and takes only `nightly-fix` tickets; the owner adds that label); (3) plant fresh money and layout bugs, publish nothing about them until scored, and check commit subjects; (4) only then change the prompt (shorten it; settle "most serious" against "stop at the first proven finding") and rerun; (5) then the fixer on one confirmed ticket. No schedule until a canary round passes. The Anthropic spend limit is the owner's $10. Don't commit in ramble outside a `pm/` branch.

### Lane: agents-cloud
- **2026-11-22, first fixer PR:** [PR 1058](https://github.com/defaultdave/ramble/pull/1058) fixes issue 1057, one line plus its test; merged by the owner 2026-11-22. qa found a second route to the same dead end (two tabs), no ticket yet.
- **2026-11-22, finder files a real bug:** PR 1056 merged; run 45051374931 on `main` filed issue 1057 (Back after payment leaves a dead checkout), $0.43. Next: 1057 fixed, then fresh canaries. For the lead: `nightly-fix.yml` is scheduled daily at 09:00 UTC and has run once, with nothing to pick.
- **2026-11-21, bug finder built:** ADR 0012, `bug-finder.yml` (hand dispatch only), `scripts/bug-finder/` and the picker's `Unit:` line, one local commit `3b17e96` on `pm/nightly-fix-agent` over ADR 0011's `41c1f94`; 76 tests pass; files match the manifest. Never run on Actions. Pushed at the owner's word, [PR 1051](https://github.com/defaultdave/ramble/pull/1051) merged by the owner's bypass 2026-11-21; worktree and branch removed; labels `finder`, `nightly-fix` made (`needs-owner` existed). Detail: `lanes/agents-cloud.md`.
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
   - Nightly fix agent (ADR 0011, branch `pm/nightly-fix-agent`, `41c1f94`, local only), if you take it up: push and open the PR (bypass merge); secrets `ANTHROPIC_API_KEY` (dedicated, spend-capped), `RAMBLE_APP_ID`, `RAMBLE_APP_INSTALLATION_ID`, `RAMBLE_APP_PRIVATE_KEY`; variable `CLAUDE_CODE_VERSION`; label `nightly-fix`. For the Copilot review trial: turn on Copilot code review for the repo (a settings or ruleset change, yours).
   - Fix two paths in `~/.claude/scheduled-tasks/ramble-nightly-agent-review/SKILL.md`: `agent-memory` to `agent-memory-local`, `scripts/plan/site.ts` to `scripts/pm/site.ts`.
6. **Production migrations 0024 to 0034:** run 45052497572 failed on a bad password for `neondb_owner` (28P01). Owner: reset the `production-database` secret `DATABASE_URL_UNPOOLED`, set `BETTER_AUTH_SECRET` (logged as unset 2026-11-21) and, if missing, `SIGN_IN_LINK_SECRET` in Vercel production, rerun the workflow, then make a NEW production build (the parked `ramble-isfy5k3vc` was built before those variables) and promote it. Production stays on the 11/04 build until then (delta-log 2026-11-22). **U-129:** create its issue and board item. **Sentry** and **Method Layer 0:** as before (`lanes/lead.md`).

7. **Approve PRs 1063 and 1064** (Dependabot's jest-dom 8 and minor-and-patch bumps, each with a test-only lint fix; they replace 1060 and 1061, which Dependabot closes once these land). Auto-merge is queued, so your approval merges them once checks pass. PRs 1062 and 1059 merged 2026-11-28.

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
- **Before you start:** reset the production database secret and rerun the migration workflow (Blocked 6); approve PRs 1063 and 1064 if they are still open.
- **Run:** `/ramble-pm` in a new desktop chat, started from the ramble main checkout.
- **Model and effort:** Sonnet, medium. Builders Sonnet, narrow checks Haiku.
- **Prompt:** You are the lead. Read `## Blocked on Dave` and `## Next` in `STATUS.md`. Check PRs 1063 and 1064 merged and Dependabot closed 1060 and 1061; then remove worktrees `dep-1060` and `dep-1061` and branches `pm/dep-jest-dom-8`, `pm/dep-minor-2026-11-23` and the two local `dependabot/` branches. Check Monday's scheduled `gitleaks` run passed (first since PR 1062). If the owner has run the production migration, make and promote the new build with him, then start the guest sign-in test and the walkthrough lane. Republish `index.html` to the claude.ai roadmap artifact (this chat had no artifact tool). Don't commit in ramble; publish ramble-pm with `site.ts publish`.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in (U-130) has landed and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) has landed (merged 2026-11-17). Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
