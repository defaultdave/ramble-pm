# Status

**Updated:** 2026-11-17 midday by the lead (swarm chat). Merged today, read from GitHub: 1019 (U-083b), 1020 (U-130), 1022 (U-076a), 1024 (U-060), 1026 (U-070), 1032 (U-076b), 1033 (U-044), 1036 (U-126), and audit batches 1023, 1025, 1027, 1028, 1029. Open, each waiting only on the owner's `human-read`: 1030 (U-072), 1031 (U-057), 1034 (U-049), 1035 (U-077). Audit #1017 is held until 1030 merges (same file). Left to build: U-076c, U-078, U-061. Lead end steps not yet run today. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `audit-auth` | #1005 (U-004a, critical): rate-limit keys on the two auth form posts; PR 1042 (#1004) waits on `human-read`; history in `lanes/audit-auth.md` | swarm subagent round 2, 2026-11-18 | active: launching | 2026-11-18 01:05 |
| `owner-pack` | one protected-files PR for the owner's bypass merge: #999 (`scripts/merge-desk/scope-check.ts`) and the standards lines in `.claude/standards/architecture.md`; history in `lanes/owner-pack.md` | swarm subagent, 2026-11-18 | active: launching | 2026-11-18 01:05 |
| `audit-w3` | read-only audit of wave 3 code (PRs 1019 to 1042) into `audits/wave3-2026-11-18.md`, combined into fix batches, low-value findings dropped; no code | swarm subagent, 2026-11-18 | active: launching | 2026-11-18 01:05 |
| `housekeeping` | remove worktrees and local branches of merged PRs in the ramble checkout; no code | swarm subagent, 2026-11-18 | active: launching | 2026-11-18 01:05 |
| `lead` | Shared status, `## Next`, roadmap, memory; coordinates the ticket close-out swarm | PM lead swarm, 2026-11-18 (Fable; took over on the owner's word) | active: claimed 00:50; reading GitHub and the close-out sheet before launching lanes | 2026-11-18 00:50 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: audit-auth
Round 2 launching (2026-11-18): #1005. PR 1041 merged 2026-11-18 00:44; PR 1042 green except `human-read`.

### Lane: owner-pack
Launching (2026-11-18).

### Lane: audit-w3
Launching (2026-11-18).

### Lane: housekeeping
Launching (2026-11-18).

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts
Eight open PRD facts (Q-11 to Q-21) with their working assumptions: `open-client-facts.md`. None blocks the demo.

## Blocked on Dave
Refreshed 2026-11-17 by the lead. Older lists and what was cleared on 2026-11-16: `lanes/lead.md`. Nothing here blocks the current goal.

1. **Production migrations 0024 to 0032:** run the `db-migrate-production` workflow before the next production deploy.
2. **U-129:** create its issue and board item (PR 978 merged 2026-11-14), so it can be set Done.
3. **Sentry** (held until the demo is shared): the server and browser projects, the ops address, the three alert rules in `docs/runbooks/alerting.md`, then `SENTRY_DSN` and `SENTRY_BROWSER_DSN` (the browser one at build time too) in Vercel.
4. **Method Layer 0** (open decision 3): not needed until P6.
6. **Audit tickets that need a ruling** (2026-11-17, `audit-fixes` lane; questions and recommendations in `drafts/audit-fixes-triage-2026-11-17.md`): #998 (make `human-read` a required check in the `main` ruleset), #999 (`scope-check.ts` protected list, a bypass merge), #890 (NoScriptFilters client island or a server route), #1005 (Server Actions or a DECISIONS row extending B15), #1001 and #1004 (shape of the lockout fix; held until U-130 lands), #791 and #993 to #995 (scope and sizing). The lead brings these in one batch with the lanes' other asks.
7. **Read and approve four critical-tier audit PRs** (2026-11-17; every other required check passes, auto-merge queued): https://github.com/defaultdave/ramble/pull/1030 (U-072 host loaders; unblocks #1017), https://github.com/defaultdave/ramble/pull/1031 (U-057 reminder re-time) and https://github.com/defaultdave/ramble/pull/1035 (U-077 refund retry flag), money code, read together; https://github.com/defaultdave/ramble/pull/1034 (U-049, tests only). Read notes: `lanes/audit-fixes.md`, `lanes/audit-fixes-b.md`.
8. **B6 exempt list** (2026-11-17, `guest-signin` lane ruling, overrulable): add `holdsAnyRoleGrant` beside `readRoleGrants` in `.claude/standards/architecture.md` (protected file, Dave edits).

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Swarm, 2026-11-17 (Dave chose option 1, DECISIONS 2026-11-17).** Five lanes at once, one builder each (the machine limit). Each lane opens with `/ramble-pm lane: <name>` from its block under `## Next chat`. Shared rules: migrations collide on number, so the second unit to land merges `main` and regenerates; `(ops)/layout.tsx` nav links are shared by `w3-cms`, `w3-reviews` and `w3-ops-host`, so the second to land merges `main` first; e2e through the lock; one Postgres.

| Lane | Units in order | Owns | Critical |
|---|---|---|---|

Then, as each lane ends: the walkthrough with Dave (block `walkthrough`), and page-change units from its findings, with dictionary phases 1 to 4 riding along. The lead also closes U-051 and U-105 on board #19 once a CI e2e run on `main` shows the booking-path spec ran (PRs 911 and 915 merged).

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items, the 2026-11-13 slim MVP goal (parked list) and the text dictionary note: `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: swarm (lead, runs the lanes as subagents)
- **Before you start:** the owner runs every command and both file edits in `drafts/owner-commands-2026-11-17.md` (he said he will have done so; verify on GitHub and `main` first, using that file's last section). In flight at hand-off: lane `audit-auth` (#1001, #1004) and a bookkeeping agent (ticket sync, U-051 and U-105), whose reports did not reach you: read `lanes/audit-auth.md`, `lanes/lead.md` and GitHub. U-076c (PR 1040) and #1017 (PR 1039) are merged; wave 3 is complete.
- **Run:** `/ramble-pm lane: lead` in a new desktop chat, started from the ramble main checkout, then paste the prompt.
- **Model and effort:** Fable main chat; lane subagents and builders Sonnet; narrow checks Haiku.
- **Prompt:** You are the lead and the swarm's coordinator. The owner's standing goal (2026-11-17): address or close out every remaining Ramble ticket. Start from `drafts/ticket-closeout-2026-11-17.md` (one disposition per open issue, a build plan in lanes, an owner answer sheet, the owner's close commands); if it is missing, redo that triage first. Read `lanes/lead.md` (entries 2026-11-17) and every open PR on GitHub (`gh pr list`, sandbox bypassed) before believing any lane row; the previous lead chat's subagents do not report to you. State at hand-off: wave 3 has U-130, U-083b, U-070, U-126, U-076a, U-076b, U-060, U-044 merged, U-061 (PR 1037) and U-078 (PR 1038) in review, U-076c building; all nine audit batches merged, audit #1017 building on `unit/U-072-audit-sb2`. Run the build plan as lanes, one unit per launch, background `general-purpose` Sonnet subagents, shell in the ramble checkout. Lessons: builders must be launched with the Agent tool's `isolation: "worktree"` (a hand-made worktree has its writes refused by a hook; never work around it); check a fixer's worktree twice, minutes apart, before calling it dead; audit fixes go on `unit/<owning unit>-audit-<batch>` with a `U-xxx:` title; a PR left open while others merge can go DIRTY and then needs the owner's approval again on the new head; QA must be a real pass, never `action_required`; cite logged rulings and ask for rule wording in every architecture-audit prompt; `STATUS.md` has a 25 KB publish limit. Owner asks to batch: the answer sheet in the close-out draft, critical-tier reads as PRs go green, the B6, B8 and Photo allowlist lines, production migrations 0024 onward before the next production deploy. The lead end steps were NOT run on 2026-11-17 (roadmap status.json and standup, schedule, `bun tools/plan/roadmap.ts`, board dates, `bun tools/audit-tickets.ts --run`, the artifact, public memory lessons): run them. Then close U-051 and U-105 if a CI e2e run shows the booking-path spec ran, open the walkthrough, and brief the full-run audit the owner asked for (DECISIONS 2026-11-17) as its own Opus chat. Don't commit in ramble outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
