# Status

**Updated:** 2026-11-17 midday by the lead (swarm chat). Merged today, read from GitHub: 1019 (U-083b), 1020 (U-130), 1022 (U-076a), 1024 (U-060), 1026 (U-070), 1032 (U-076b), 1033 (U-044), 1036 (U-126), and audit batches 1023, 1025, 1027, 1028, 1029. Open, each waiting only on the owner's `human-read`: 1030 (U-072), 1031 (U-057), 1034 (U-049), 1035 (U-077). Audit #1017 is held until 1030 merges (same file). Left to build: U-076c, U-078, U-061. Lead end steps not yet run today. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `guest-signin` | U-130: show the guest sign-in link on screen while email is off (DECISIONS 2026-11-16); owns (guest)/sign-in/, src/server/auth/ (sign-in link path only), src/lib/signIn.ts | swarm subagent, 2026-11-17 | closed: U-130 merged (PR 1020), board Done, worktrees removed | 2026-11-17 03:00 |
| `w3-reviews` | U-060, U-044, U-061 (reviews, lite cut); owns schema/reviews, jobs/reviewInvite*, (checkout)/(site)/review/, fixtures/reviews.ts, db/browse.ts and db/home.ts (rating only), lib/experienceCards.ts, components/ExperienceCard/, ExperiencePage/ reviews block, (ops)/ops/reviews/ | swarm subagent round 2, 2026-11-17 | active: U-060 PR 1024 waiting on CI and Dave's approval | 2026-11-17 02:30 |
| `w3-cms` | U-076a, U-076b, U-076c, U-078 (no gift switches): (ops)/ops/editorial/, ops/settings/, lib/richText/, components/RichTextEditor/, actions/editorial.ts, actions/settings.ts, db/settings.ts, db/taxonomy.ts | swarm subagent round 5, 2026-11-17 | active: U-076c, rebuilding in a harness worktree (isolation), round 4 patch kept as reference | 2026-11-17 15:00 |
| `audit-fixes` | the open `audit` issues: triage against `main`, fix in batches of disjoint files; any file no other lane owns | swarm subagent round 8, 2026-11-17 | active: building #1017 (U-072, containsPattern to lib/text); PRs 1030 and 1033 merged | 2026-11-17 13:30 |
| `w3-ops-host` | U-083b, U-070 (cancel only), U-126; owns (ops)/ops/requests/, (host)/host/sessions/[id]/cancel, (ops)/ops/page.tsx (dashboard) | swarm subagent round 2, 2026-11-17 | handed off: lane complete, U-083b, U-070 and U-126 all merged and Done on board #19 | 2026-11-17 08:40 |
| `audit-fixes-b` | second audit session, one batch per launch, files disjoint from `audit-fixes`: S-F2 (#1009, #1016, U-057); history in `lanes/audit-fixes-b.md`, no section here | swarm subagent, 2026-11-17 | handed off: S-F2 PR 1031 (U-057) and C-A PR 1035 (U-077, #1018, refs #319), all agent checks posted, CI green, waits Dave's human-read | 2026-11-17 12:45 |
| `w3-cms-b` | U-078 (no gift switches, plus read-only tier list); beside `w3-cms` | swarm subagent, 2026-11-17 | handed off: U-078 merged (PR 1038), board Done | 2026-11-17 14:30 |
| `lead` | Shared status, `## Next`, roadmap, memory; coordinates the 2026-11-17 swarm | PM lead swarm, 2026-11-17 (Fable) | active: same chat resumed after compaction; running the lanes as subagents, one unit per launch | 2026-11-17 07:07 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: guest-signin
- **2026-11-17, closed:** U-130 merged (PR 1020), board Done, worktrees removed. Full entry in `lanes/guest-signin.md`.

### Lane: w3-reviews
- **LEAD NOTE, 2026-11-17 01:45:** the round 1 session finished the fix. Local `unit/U-060-review-invites` is at `3796775` (round 2 fixes `d24e83c` plus `main` merged), not pushed; it reports typecheck, lint, format, `db:generate` and `test:db` green and `pnpm test` not seen. `wip/U-060-r2` has no commits. Use the unit branch: run `pnpm test` and the remaining gates, push, rerun the checks. Drop the duplicate fixer's result unless it adds something.
- **LEAD NOTE, 2026-11-17 01:35 (correction to your round 2 brief):** the round 1 builder is still alive: its worktree `agent-afd4ab52887aaf4e6` (branch `unit/U-060-review-invites`) has uncommitted round 2 edits in progress. Your `wip/U-060-r2` fixer duplicates it. Check `git log` and `git status` there before any fast-forward of the unit branch; never discard its commits unseen. Take one complete result through review and say which in your report.
- **2026-11-17 00:40, claimed.** Order U-060, U-044, U-061, all standard tier. Round numbers and PRs are logged here as they happen.
- **Round 2 relaunch.** U-060 = PR 1024, branch `unit/U-060-review-invites`, reviewed head 7488736. Round 1: review RC, qa FAIL, spec RC, arch FAIL, a11y PASS. Findings and history: `lanes/w3-reviews.md`. Fixer branch `wip/U-060-r2`.
- **2026-11-17 02:30, U-060 PR 1024 head 05656f0: four checks green, review requested, auto-merge queued; waits on CI and Dave's approval.** U-044 and U-061 wait for the merge. History and lessons: `lanes/w3-reviews.md`.
- **U-060 (PR 1024) and U-044 (PR 1033) merged and Done. U-061: PR 1037 head aedc5cf, agent checks running.**
- **For the lead:** see `lanes/w3-reviews.md` "For the lead" (main checkout on `wip/U-076a-r7`, hosts.spec flake, `ramble_qa_u060` not empty, two memory lessons).

### Lane: w3-cms
- **2026-11-17 14:20, round 4 blocked:** U-076c builder (Sonnet) was refused Write in `.claude/worktrees/u076c` by a hook that confines writes to the session's own worktree. Board #19 U-076c In Progress; branch `unit/U-076c-pages-docs-taxonomy` at origin/main 49dfb6e plus uncommitted partial edits (catalog.ts position/retiredAt, opsForm rowActionLabel, editorialAdmin settledStatus). Relaunch with the session cwd in that worktree, or discard with `git checkout -- .`.
- **LEAD NOTE, 2026-11-17 01:35 (correction to your round 2 brief):** the round 3 fixer did finish after the lead checked. `wip/U-076a-r3` is at `96a49ee` (settleEntry in `src/lib/editorialAdmin.ts`; the previous session reports lint, typecheck, unit and db tests green), not pushed. Your `wip/U-076a-r4` fixer duplicates it. Take one result through review, whichever is complete, and say which in your report; the `knip` fix (`entryIntents`) is still needed either way.
- **2026-11-17 00:30, claimed.** Order U-076a, U-076b, U-076c, U-078, standard tier, one builder at a time. Round numbers: none yet.
- **2026-11-17 02:40, U-076a Done:** [PR 1022](https://github.com/defaultdave/ramble/pull/1022) merged (e4d2b4e) after rounds 1 to 7; all four agent checks posted success at 87d3307 (architecture PASS in round 6; B13 list catch and B8 island ruled by PM, DECISIONS 2026-11-17). Board #19 Done. History in `lanes/w3-cms.md`. Next U-076b.
- **2026-11-17 13:30, U-076b Done:** [PR 1032](https://github.com/defaultdave/ramble/pull/1032) merged (875857d) after 3 rounds; four agent checks posted success at 62af106 (architecture PASS round 3, rulings B8/B13 cited). Board #19 Done (0.3 d, about 1M tokens). Worktree and branch removed. Details: `lanes/w3-cms.md`.
- **For the lead:** owner ask: add `RichTextEditor` to the B8 client-islands allowlist (DECISIONS 2026-11-17). Other notes (Haiku audit rounds, FilterBar Storybook not reproduced, db flake): `lanes/w3-cms.md`.

### Lane: audit-fixes
- **2026-11-17 round 7.** PR 1030 conflicted with main in `src/app/(host)/README.md` only (U-070 cancel rows vs the loadForHostArea bullet); kept the PR bullet plus 'cancel'. Head 4a5713b; lint, typecheck, format, knip, unit, db pass; db:generate clean; review, spec, architecture posted fresh, qa carried from 2c38d15 (no runtime file changed). Waits on `human-read` for the new head.
- **2026-11-17 round 5 (08:00).** PR 1030 (head 2c38d15): real QA done (seeded throwaway DB, owner, staff, other-owner, signed-out, guest; staff refused only on /host/staff; PNGs in `evidence/pr/unit-U-072-audit-sb/`), qa-agent posted success; only `human-read` is red. **PR 1034** (S-G, U-049 critical, #834 #835, test-only) head 2c31ba3: review, spec, architecture, qa posted success, auto-merge queued, owner review requested; `human-read` waits. #835: five tests added, four gaps already covered. Held: #1017 (PR 1026). Left: C-A. Worktrees `u072-sb`, `u049-sg` to remove after merge. Advisory: ROLLBACK in the finally of the new sessions-generate db test; builder saw unexplained db flakes under shared load.
- **2026-11-17 round 4 (03:45).** PR 1029 (S-A2) MERGED, #1000 row closed. **PR 1030** (S-B, U-072, critical; #1015 #1013 #1014) head 2c38d15: review, spec, architecture pass; qa-agent `action_required` (db 2962 pass, e2e pass, no seeded-DB browser check of host pages); auto-merge queued, owner review requested; `human-read` waits. #1017 HELD: needs `server/db/opsSessions.ts`, which PR 1026 (U-070) edits; do it after 1026 merges. Worktree `.claude/worktrees/u072-sb` to remove after merge. Left: S-F2, S-G, C-A. Older: lanes/audit-fixes.md.
- **2026-11-17 round 3 (02:35).** MERGED: 1025 (S-A1), 1023 (S-C, critical), 1027 (S-D), 1028 (S-F1 #1002, U-127: stable not-found via Suspense; status is 200 not 404, SC-4). **PR 1029** (S-A2 #1000, U-014a, critical): four checks green on 348b7b9, `scope-manifest` pass, auto-merge queued, `human-read` waits for the owner. Pass-file rows updated for all merged PRs. Left: S-B (U-072, critical), S-F2 (U-057, critical), S-G (U-049, critical), C-A (U-077, critical). History: `lanes/audit-fixes.md`.
- **For the lead:** (a) owner read needed on PR 1029 (small: removes a duplicate predicate); (b) #326, #735, #830 closed in pass files: run `tools/audit-tickets.ts --run`; (c) owner asks in `drafts/audit-fixes-triage-2026-11-17.md`, "Owner-held tickets"; (d) #997 `onError` half needs `Photo` on the client-islands allowlist (protected); (e) e2e `hosts.spec.ts:14` flaked in three runs (expected 404, got 200 once, passes on retry): worth a ticket; (f) an unknown well-formed host or pick slug returns 200 with not-found UI (SC-4), the same likely applies to other uncached-miss routes.

### Lane: w3-ops-host
- **2026-11-17 08:40, lane complete (round 2).** U-083b (PR 1019), U-070 (PR 1026, merge 997d578) and U-126 (PR 1036, merge 49dfb6e) merged; board #19 Done with actuals (U-070 0.6 d, 1.2M tokens; U-126 0.6 d, about 1.5M tokens, estimated). U-070's `knip` was red on an unused export (fixed on a9d15d8); U-126 took 5 arch-audit rounds (B6 unguarded read, B17 predicates and wording and links, B2 separator). Details: `lanes/w3-ops-host.md`.
- **For the lead:** (1) a stale `next-server` (pid 58164, from `Workspace/defaultdave/.../seo-perf-lighthouse`, 5 days old) held port 3100 and blocked e2e for a while; not ours, not killed. (2) QA left a stray `ramble_qa_u060` database in docker Postgres and a scratch pg dir under /var/folders/.../T/pg16. (3) Review rate limit shares the `manage:` bucket; keyed by token only (pre-existing pattern), audit item candidate.

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
| `guest-signin` | U-130 | (guest)/sign-in/, src/server/auth/ (sign-in link path only), src/lib/signIn.ts | U-130 |
| `w3-cms` | U-076a, U-076b, U-076c, U-078 (no gift switches) | (ops)/ops/editorial/, ops/settings/, lib/richText/, components/RichTextEditor/, actions/editorial.ts, actions/settings.ts, db/settings.ts, db/taxonomy.ts (new) | none |
| `w3-reviews` | U-060, U-044, U-061 | schema/reviews, jobs/reviewInvite*, (checkout)/(site)/review/, fixtures/reviews.ts, db/browse.ts and db/home.ts (rating only), lib/experienceCards.ts, components/ExperienceCard/, ExperiencePage/ reviews block, (ops)/ops/reviews/ | none |
| `w3-ops-host` | U-083b, U-070 (cancel only), U-126 | (ops)/ops/requests/, (host)/host/sessions/[id]/cancel, (ops)/ops/page.tsx (dashboard) | U-070 |
| `audit-fixes` | the 40 open audit tickets: triage against `main` first, then fix in batches of disjoint files | any file no other lane owns; a ticket in another lane's files goes to that lane or waits | per file touched |

Then, as each lane ends: the walkthrough with Dave (block `walkthrough`), and page-change units from its findings, with dictionary phases 1 to 4 riding along. The lead also closes U-051 and U-105 on board #19 once a CI e2e run on `main` shows the booking-path spec ran (PRs 911 and 915 merged).

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items, the 2026-11-13 slim MVP goal (parked list) and the text dictionary note: `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: swarm (lead, runs the lanes as subagents)
- **Before you start:** approve PR 1037 (U-061) if it is still open. Open this chat only when the `lead` row says `handed off`. Pick Fable.
- **Run:** `/ramble-pm lane: lead` in a new desktop chat, started from the ramble main checkout, then paste the prompt.
- **Model and effort:** Fable main chat; lane subagents and builders Sonnet; narrow checks Haiku.
- **Prompt:** You are the lead and the swarm's coordinator. The owner's standing goal (2026-11-17): address or close out every remaining Ramble ticket. Start from `drafts/ticket-closeout-2026-11-17.md` (one disposition per open issue, a build plan in lanes, an owner answer sheet, the owner's close commands); if it is missing, redo that triage first. Read `lanes/lead.md` (entries 2026-11-17) and every open PR on GitHub (`gh pr list`, sandbox bypassed) before believing any lane row; the previous lead chat's subagents do not report to you. State at hand-off: wave 3 has U-130, U-083b, U-070, U-126, U-076a, U-076b, U-060, U-044 merged, U-061 (PR 1037) and U-078 (PR 1038) in review, U-076c building; all nine audit batches merged, audit #1017 building on `unit/U-072-audit-sb2`. Run the build plan as lanes, one unit per launch, background `general-purpose` Sonnet subagents, shell in the ramble checkout. Lessons: builders must be launched with the Agent tool's `isolation: "worktree"` (a hand-made worktree has its writes refused by a hook; never work around it); check a fixer's worktree twice, minutes apart, before calling it dead; audit fixes go on `unit/<owning unit>-audit-<batch>` with a `U-xxx:` title; a PR left open while others merge can go DIRTY and then needs the owner's approval again on the new head; QA must be a real pass, never `action_required`; cite logged rulings and ask for rule wording in every architecture-audit prompt; `STATUS.md` has a 25 KB publish limit. Owner asks to batch: the answer sheet in the close-out draft, critical-tier reads as PRs go green, the B6, B8 and Photo allowlist lines, production migrations 0024 onward before the next production deploy. The lead end steps were NOT run on 2026-11-17 (roadmap status.json and standup, schedule, `bun tools/plan/roadmap.ts`, board dates, `bun tools/audit-tickets.ts --run`, the artifact, public memory lessons): run them. Then close U-051 and U-105 if a CI e2e run shows the booking-path spec ran, open the walkthrough, and brief the full-run audit the owner asked for (DECISIONS 2026-11-17) as its own Opus chat. Don't commit in ramble outside the merge-desk scripts.

### Next chat: w3-cms
- **Before you start:** nothing.
- **Run:** `/ramble-pm lane: w3-cms` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Resume 2026-11-17 13:30:** U-076a and U-076b merged and Done, clean. Next U-076c (reuse `EditorialAdmin` siblings, `opsForm` helpers `splitOp`/`opValue`/`swapAt`/`rawFormFieldLimit`, `picksOf` in lib/editorial), then U-078. Old note: U-076c (extend `EntryForm`; the three `list*ForEditing` reads carry TODO(U-076b|c)), then U-078. Merge main before pushing `src/lib/opsNav.ts` changes. Mechanics and rulings: `lanes/w3-cms.md`.
- **Prompt:** Lane `w3-cms`: U-076a (editorial editing and publish, Tiptap on U-117's document format, publish revalidates through `tagsForChange`), then U-076b (home and collections admin; the gift guide sponsor slot stays out while gifting is parked), U-076c (pages and documents admin, plus the category and neighborhood add, rename, reorder, retire), U-078 (settings and ops switches without the gift switches, plus the read-only cancellation tier list). All standard tier. Read the `w3` lane rules under `## Next` in `STATUS.md`, DECISIONS 2026-11-17, and the units' rows in `drafts/mvp-replan-2026-11-10.md` section 2 (lite cuts) and section 4 wave 3 (file scopes). For each unit in order: set it In Progress on board #19, launch the builder in a worktree from the ramble checkout (`/senior <unit>`, scope manifest from units.yaml plus the lite cut), check its files against the manifest, push and open the PR through `agent-git.ts`, request Dave's review, run review, qa, spec-compliance, a11y-audit and architecture-audit, post the checks, queue auto-merge, and set Done with actuals when it merges. Start the next unit while a PR waits on checks if its files are disjoint; one builder at a time. Don't commit in ramble outside the merge-desk scripts. Done: four units merged.

### Next chat: w3-reviews
- **Run:** `/ramble-pm lane: w3-reviews` in a new desktop chat (Sonnet, medium).
- **Prompt:** Lane `w3-reviews`. Read `lanes/w3-reviews.md`. U-060 is PR 1024 (checks posted on head 05656f0, auto-merge queued): if merged, set U-060 Done on board #19 with actuals, remove its worktrees and branches (`unit/U-060-review-invites`, `wip/U-060-*`), then build U-044 (display at five or more reviews, at most ten, rating on cards), then U-061 (ops hide and unhide with audit), one builder at a time, same pipeline as U-060 (scope from `drafts/mvp-replan-2026-11-10.md` section 2). If not merged, find what blocks it. Don't commit in ramble outside the merge-desk scripts.

### Next chat: w3-ops-host
- **Status:** lane complete; nothing to run. The lead removes the row.

### Next chat: audit-fixes
- **Before you start:** owner reads PRs 1030 and 1034 (`human-read`); qa-agent is posted on both. Round 6: only C-A (1018, 319, U-077) and #1017 after PR 1026 remain. **Run:** `/ramble-pm lane: audit-fixes`. Sonnet, medium; builders Sonnet.
- **Prompt:** Lane `audit-fixes`, round 4. Read the `### Lane: audit-fixes` section and the triage file (Round 2 rework table, Owner-held tickets). Merged: 1023, 1025, 1027, 1028, 1029. PR 1030 (S-B) waits on `human-read`; when it merges set rows N1112-5,6,7 done, remove worktree u072-sb, and do #1017 once PR 1026 merges (branch `unit/U-072-audit-sb2`, title `U-072: ... (#1017)`). Then one builder at a time, branch `unit/<unit>-audit-<batch>` from `origin/main`, title `<unit>: ... (#n)`: S-F2 (1009 1016, U-057), S-G (834 then 835, U-049), C-A (1018 319, U-077); all critical, so recheck the tier in `docs/plan/units.yaml` and write the owner's read ask for each. Per batch: builder (rules in drafts/wave3-builder-rules.md), merge main and rerun gates, push and `agent-git.ts pr` from the worktree, review, qa, spec-compliance, architecture-audit posted with post-check.ts, automerge, review request, read the PR back. A builder's worktree may start with a pre-existing local branch of the same name: check `git branch --show-current`.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
