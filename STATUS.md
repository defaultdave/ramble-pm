# Status

**Updated:** 2026-11-18 01:20 by the lead (swarm chat, Fable). Wave 3 is complete: every unit merged, PR 1041 (#1001) merged 00:44. Open: PR 1042 (#1004), green except the owner's `human-read`. The lead ran the close-out at 01:35 (owner goal): 60 issues closed, 3 open (#999, #1004, #1005), each with a PR in flight. Lanes running: `audit-auth` (#1005), `owner-pack` (#999 and standards lines, one bypass PR), `audit-w3` (wave 3 audit, combined into fix batches), `housekeeping` (stale worktrees). Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `audit-auth` | #1005 (U-004a, critical): rate-limit keys on the two auth form posts; PR 1042 (#1004) waits on `human-read`; history in `lanes/audit-auth.md` | swarm subagent round 2, 2026-11-18 | active: launching | 2026-11-18 01:05 |
| `owner-pack` | one protected-files PR for the owner's bypass merge: #999 (`scripts/merge-desk/scope-check.ts`) and the standards lines in `.claude/standards/architecture.md`; history in `lanes/owner-pack.md` | swarm subagent, 2026-11-18 | handed off: PR 1043 open, waits on the owner's bypass merge | 2026-11-18 01:25 |
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
PR 1043 (branch `pm/owner-pack-2026-11-18`, head 15b981a) opened as the App, owner review requested. Carries #999 (PROTECTED widened) and three standards lines. Fails `scope-manifest` by design; owner merges with bypass. For the lead: the auth-row purges are not named in B6 because PR 1042 is unmerged; add them to the B6 text after it merges.

### Lane: audit-w3
Launching (2026-11-18).

### Lane: housekeeping
Launching (2026-11-18).

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts
Eight open PRD facts (Q-11 to Q-21) with their working assumptions: `open-client-facts.md`. None blocks the demo.

## Blocked on Dave
Refreshed 2026-11-18 01:20 by the lead. The list of 2026-11-17: `lanes/lead.md`. Nothing here stops the lanes.

1. **Done by the lead on 2026-11-18 01:35 (owner goal, DECISIONS):** the close-out script ran with `--drop-parked`, and #992 was closed after it. Three issues remain open, each with a PR in flight: #999, #1004, #1005. To restore a parked unit: `gh issue reopen <n> --repo defaultdave/ramble`.
2. **Read and approve PR 1042** (U-004a, critical; purge of expired sign-in rows): https://github.com/defaultdave/ramble/pull/1042. Read notes: `lanes/audit-auth.md`. The #1005 PR from lane `audit-auth` will need the same read.
3. **Bypass-merge the owner-pack PR** once lane `owner-pack` opens it (#999 protected list plus four standards lines); it replaces the hand edits in sections 6 and 7 of the 2026-11-17 file and the old B6 item.
4. **Walkthrough** (your time, five passes): `### Next chat: walkthrough`. Its findings become the page-change units, the next build work.
5. **Production migrations 0024 to 0034:** run the `db-migrate-production` workflow before the next production deploy.
6. **U-129:** create its issue and board item (PR 978 merged 2026-11-14), so it can be set Done.
7. **Sentry** (held until the demo is shared): `docs/runbooks/alerting.md`. **Method Layer 0:** not needed until P6.

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Close-out swarm, 2026-11-18 (owner: keep combining and closing tickets, drop what is not needed).** One Fable lead chat, one Sonnet subagent per lane.

| Lane | Work | Ends with |
|---|---|---|
| `audit-auth` | #1005 rate-limit keys on the two auth form posts (U-004a, critical) | a PR waiting on `human-read` |
| `owner-pack` | #999 and the standards lines in one protected-files PR | a PR for the owner's bypass merge |
| `audit-w3` | audit of wave 3 code, findings combined into at most six fix batches, low-value ones dropped | `audits/wave3-2026-11-18.md` |
| `housekeeping` | remove worktrees and branches of merged PRs | a clean `git worktree list` |

Then, in order: (1) the lead opens one fix lane per `audit-w3` batch with disjoint files, at most five builders; (2) the walkthrough with the owner, then page-change units from its findings, with dictionary phases 1 to 4 riding along; (3) the full-run audit of the whole project run, as its own Opus chat (DECISIONS 2026-11-17). After the close-out script runs, the open issues are the parked ones, #992, and whatever is in flight.

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items (the 2026-11-17 five-lane table, the 2026-11-13 slim MVP goal, the text dictionary note): `lanes/lead.md`.

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
