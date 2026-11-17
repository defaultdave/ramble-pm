# Status

**Updated:** 2026-11-16 night by the lead. Folded the dependabot-review chat's decisions (DECISIONS 2026-11-16): Blocked items cleared except production migrations 0024 to 0032, Sentry, and two new asks (PR 990, U-129's issue). Merged today: ramble 979, 981, 982, 983, 984, 986, 987, 988; 985 closed. Board #19 reconciled: U-102, U-068, U-128 Done, plus ten merged units that had been left In Progress or Todo (U-004a, U-022, U-055, U-073, U-074a, U-074b, U-074c, U-075, U-125, U-120 as NEW-1; delta-log 2026-11-16); U-130 is #989, Todo. Schedule not refit (delta-log). Filed 28 audit tickets (#991 to #1018). Finished lanes swept to `lanes/`. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `guest-signin` | U-130: show the guest sign-in link on screen while email is off (DECISIONS 2026-11-16); owns (guest)/sign-in/, src/server/auth/ (sign-in link path only), src/lib/signIn.ts | swarm subagent, 2026-11-17 | handed off: PR 1020 open, checks posted, auto-merge queued, waiting on Dave's `human-read` | 2026-11-17 00:55 |
| `w3-reviews` | U-060, U-044, U-061 (reviews, lite cut); owns schema/reviews, jobs/reviewInvite*, (checkout)/(site)/review/, fixtures/reviews.ts, db/browse.ts and db/home.ts (rating only), lib/experienceCards.ts, components/ExperienceCard/, ExperiencePage/ reviews block, (ops)/ops/reviews/ | swarm subagent round 2, 2026-11-17 | active: U-060 PR 1024 round 2 fixer | 2026-11-17 01:27 |
| `w3-cms` | U-076a, U-076b, U-076c, U-078 (no gift switches): (ops)/ops/editorial/, ops/settings/, lib/richText/, components/RichTextEditor/, actions/editorial.ts, actions/settings.ts, db/settings.ts, db/taxonomy.ts | swarm subagent round 2, 2026-11-17 | active: U-076a PR 1022 round 4 fixer (architecture B2) | 2026-11-17 01:30 |
| `audit-fixes` | the open `audit` issues: triage against `main`, fix in batches of disjoint files; any file no other lane owns | swarm subagent round 3, 2026-11-17 | active: round 3; PR 1023 waits human-read, 1027 CI running; next S-F1 | 2026-11-17 01:32 |
| `w3-ops-host` | U-083b, U-070 (cancel only), U-126; owns (ops)/ops/requests/, (host)/host/sessions/[id]/cancel, (ops)/ops/page.tsx (dashboard) | swarm subagent, 2026-11-17 | active: starting U-083b | 2026-11-17 00:18 |
| `lead` | Shared status, `## Next`, roadmap, memory; coordinates the 2026-11-17 swarm | PM lead swarm, 2026-11-17 (Fable) | active: coordinating the five-lane swarm, one Sonnet subagent per lane | 2026-11-17 00:20 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: guest-signin
- **2026-11-17, handed off.** U-130 is PR 1020 (https://github.com/defaultdave/ramble/pull/1020, head `c4168ef`), critical tier: review-agent, qa-agent, spec-compliance and architecture-audit pass, auto-merge queued, `human-read` waits on the owner's approval. After merge: set U-130 Done on board #19, remove worktrees `agent-a5e6ae6027d01956f` and `agent-a4c1bb5f1144f20a1` and branches `unit/U-130-guest-signin-on-screen` and `wip/U-130-r1`, close the lane. Full entry (scope, rounds, the B6 ruling, notes for the lead): `lanes/guest-signin.md`, moved there by the lead on 2026-11-17 for the size limit.

### Lane: w3-reviews
- **2026-11-17 00:40, claimed.** Order U-060, U-044, U-061, all standard tier. Round numbers and PRs are logged here as they happen.
- **Round 2 relaunch.** U-060 = PR 1024, branch `unit/U-060-review-invites`, reviewed head 7488736. Round 1: review RC, qa FAIL, spec RC, arch FAIL, a11y PASS. Findings and history: `lanes/w3-reviews.md`. Fixer branch `wip/U-060-r2`.
- **For the lead:** none yet.

### Lane: w3-cms
- **2026-11-17 00:30, claimed.** Order U-076a, U-076b, U-076c, U-078, standard tier, one builder at a time. Round numbers: none yet.
- **2026-11-17 01:40, U-076a:** [PR 1022](https://github.com/defaultdave/ramble/pull/1022) on `unit/U-076a-editorial-editing`. Round 1 at `d5e9eef`: review REQUEST_CHANGES, a11y FAIL (1), architecture FAIL, spec PASS, qa action_required (Postgres down). Round 2 (`wip/U-076a-r2`) merged with main to `7d1d4d3`, pushed: review APPROVE, a11y PASS, spec PASS, qa PASS (36 screenshots in `evidence/pr/unit-U-076a-editorial-editing/`), architecture FAIL (1 blocking B2: settle rule in the data layer). Round 3 `wip/U-076a-r3` fixing it. Checks not yet posted; auto-merge not queued. Verdicts in `drafts/u-076a-checks/`. Editorial entries are help articles; U-076c extends this form.
- **For the lead:** none yet.

### Lane: audit-fixes
- **2026-11-17 round 2.** Batches are filed per owning unit and tier (`drafts/audit-fixes-triage-2026-11-17.md`, "Round 2 rework"); round 1 history in `lanes/audit-fixes.md`. **PR 1023** (S-C, `unit/U-068-audit-sc`, critical, replaces 1021): all agent checks green incl. new browser qa, `scope-manifest` pass, `human-read` waits for the owner. **PR 1025** (S-A1 #1006 #1007 #1008, U-038, standard): MERGED. **PR 1027** (S-D #891 #893 #991, part of #997; `unit/U-039-audit-sd`, standard): README fix pushed, four checks on head b28d9ac, auto-merge queued, CI running. Left: S-A2 (1000, U-014a critical), S-B (U-072), S-F1 (1002), S-F2 (1009, 1016), S-G, C-A.
- **For the lead:** (a) the owner closes PR 1021 (superseded by 1023); (b) #326, #735, #830 set closed in the pass files (evidence in them): run `tools/audit-tickets.ts --run`; (c) owner asks with options and recommendations are in the triage file, "Owner-held tickets"; (d) #997 needs `Photo` on the client-islands allowlist (protected file) for its onError half; #992 needs the card column measured; (e) six of the nine batches are critical tier (files owned by critical units), so each waits for the owner's `human-read`.

### Lane: w3-ops-host
- **2026-11-17 00:18, lane claimed.** Order: U-083b, U-070 (cancel only, critical), U-126. Nothing built yet.
- **2026-11-17 01:20, U-060:** built (builder 39 min), PR 1024 opened at 74887364, auto-merge not yet queued. Round 1 (review, qa, spec-compliance, a11y, arch audit): REQUEST_CHANGES/FAIL on prettier, seed on production-demo, B2/B17 duplications, PRD-29 non-refunded eligibility, malformed-token e2e, no-JS submit 500 (Origin null from no-referrer). Round 2 sent to the builder; no wip branch needed (builder's own worktree). U-044 and U-061 wait on U-060 landing.
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
5. ~~Close PR 1021~~ done 2026-11-17 (Dave closed it and deleted `pm/audit-sc-form-focus-a11y`); batch S-C is re-filed on `unit/U-068-audit-sc`.
6. **Audit tickets that need a ruling** (2026-11-17, `audit-fixes` lane; questions and recommendations in `drafts/audit-fixes-triage-2026-11-17.md`): #998 (make `human-read` a required check in the `main` ruleset), #999 (`scope-check.ts` protected list, a bypass merge), #890 (NoScriptFilters client island or a server route), #1005 (Server Actions or a DECISIONS row extending B15), #1001 and #1004 (shape of the lockout fix; held until U-130 lands), #791 and #993 to #995 (scope and sizing). The lead brings these in one batch with the lanes' other asks.
7. **Read and approve PR 1020 (U-130, critical tier)** (2026-11-17, `guest-signin` lane): https://github.com/defaultdave/ramble/pull/1020, head `c4168ef`. Four agent checks pass, auto-merge is queued, `human-read` waits on the approval. Read for two things: anyone who types an existing guest's address signs in as that guest (accepted, DECISIONS 2026-11-16); and a guest address gets a Continue link while a role-holding address gets "check your email", so the two replies differ and role-holding addresses can be told apart, which the 2026-11-16 decision said should not happen. Approving accepts that while email is off.
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

### Next chat: swarm (lead, runs the five lanes as subagents)
- **Before you start:** pick Fable in the model picker for the new chat.
- **Run:** `/ramble-pm lane: lead` in a new desktop chat, then paste the prompt.
- **Model and effort:** Fable for this main chat (Dave, 2026-11-17); every lane subagent on Sonnet; builders Sonnet; narrow checks Haiku.
- **Prompt:** You are the lead and the swarm's coordinator (DECISIONS 2026-11-17). Read `## Next` in `STATUS.md` (the five-lane table and shared rules) and the five lane blocks under `## Next chat` (`guest-signin`, `w3-cms`, `w3-reviews`, `w3-ops-host`, `audit-fixes`). With the shell in the ramble checkout, launch one background `general-purpose` subagent per lane on Sonnet, all five in one message. Each lane's brief is its block's prompt, plus: you are lane `<name>`, so claim its row in `## Lanes` and write only your own `### Lane:` section, `lanes/<name>.md`, your Next chat block, and dated lane-tagged appends; publish with `bun scripts/pm/site.ts publish`; spawn your builder with worktree isolation and your reviewers as your own subagents; you cannot ask Dave anything, so when you need him (a critical-tier approval, a protected-path bypass merge, a decision with no recommended answer) write it in your "For the lead" notes, hand off and end with a report under 15 lines. The machine allows five builders in total, so each lane runs one at a time. As each lane reports, check its PRs on GitHub, fold its notes into `## Next` and `## Blocked on Dave`, give Dave his asks in one batch, and relaunch the lane once it is unblocked. Keep this chat to summaries: never read subagent transcripts. Run `python3 -I tools/session-profile.py --now` in ramble-pm with each result and hand off at `HAND OFF`. When the build lanes end: close U-051 and U-105 if a CI e2e run shows the booking-path spec ran, then open the walkthrough. Lead end steps each session. Don't commit in ramble outside the merge-desk scripts.

### Next chat: guest-signin
- **Before you start:** Dave approves PR 1020 (`human-read`) at https://github.com/defaultdave/ramble/pull/1020. Nothing else.
- **Run:** `/ramble-pm lane: guest-signin` in a new desktop chat, only if PR 1020 needs work or its close-out is still open.
- **Model and effort:** Sonnet, low.
- **Prompt:** Read the `guest-signin` lane entry in `STATUS.md`. Check PR 1020 with `gh pr view 1020 --json state,mergeStateStatus,autoMergeRequest` and `gh pr checks 1020`. If `db`, `e2e` or `test` failed, read the failing job log and fix through a `wip/U-130-r2` fixer (cut from the PR head, scope manifest naming each fix), merge `origin/main` into it if behind, push with `agent-git.ts push unit/U-130-guest-signin-on-screen` after fast-forwarding, and repost the four checks on the new head. If it merged: set U-130 Done on board #19, remove worktrees `agent-a5e6ae6027d01956f` and `agent-a4c1bb5f1144f20a1` and branches `unit/U-130-guest-signin-on-screen`, `wip/U-130-r1`, close the lane in `STATUS.md` and move its outcome to `lanes/guest-signin.md`. Don't commit outside the merge-desk scripts.

### Next chat: w3-cms
- **Before you start:** nothing.
- **Run:** `/ramble-pm lane: w3-cms` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Resume 2026-11-17 01:50:** U-076a is PR 1022 (`unit/U-076a-editorial-editing`, head `7d1d4d3` pushed; round 3 fixer on `wip/U-076a-r3` from worktree agent-a2e00e8d4f292a4ee was running one B2 fix, `settleEntry` into `src/lib/editorialAdmin.ts`). Round 2 checks passed except architecture (that one finding). Next: fast-forward the unit branch to the r3 head, merge main, gates, push, rerun architecture and review focused, post four checks from `drafts/u-076a-checks/`, request review, queue auto-merge, then U-076b.
- **Prompt:** Lane `w3-cms`: U-076a (editorial editing and publish, Tiptap on U-117's document format, publish revalidates through `tagsForChange`), then U-076b (home and collections admin; the gift guide sponsor slot stays out while gifting is parked), U-076c (pages and documents admin, plus the category and neighborhood add, rename, reorder, retire), U-078 (settings and ops switches without the gift switches, plus the read-only cancellation tier list). All standard tier. Read the `w3` lane rules under `## Next` in `STATUS.md`, DECISIONS 2026-11-17, and the units' rows in `drafts/mvp-replan-2026-11-10.md` section 2 (lite cuts) and section 4 wave 3 (file scopes). For each unit in order: set it In Progress on board #19, launch the builder in a worktree from the ramble checkout (`/senior <unit>`, scope manifest from units.yaml plus the lite cut), check its files against the manifest, push and open the PR through `agent-git.ts`, request Dave's review, run review, qa, spec-compliance, a11y-audit and architecture-audit, post the checks, queue auto-merge, and set Done with actuals when it merges. Start the next unit while a PR waits on checks if its files are disjoint; one builder at a time. Don't commit in ramble outside the merge-desk scripts. Done: four units merged.

### Next chat: w3-reviews
- **Before you start:** nothing.
- **Run:** `/ramble-pm lane: w3-reviews` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Lane `w3-reviews`: U-060 (review invites, reviews table, submission form; seed at least five verified reviews on four experiences, past orders for the guest persona, and a dev "send invite now" in `/ops/dev`), then U-044 (display at five or more reviews, at most ten listed, no sort or replies; rating on cards), then U-061 (ops hide and unhide with audit, no report flow). All standard tier. Read the `w3` lane rules under `## Next` in `STATUS.md`, DECISIONS 2026-11-17, and the units' rows in `drafts/mvp-replan-2026-11-10.md` section 2 (lite cuts) and section 4 wave 3 (file scopes). For each unit in order: set it In Progress on board #19, launch the builder in a worktree from the ramble checkout (`/senior <unit>`, scope manifest from units.yaml plus the lite cut), check its files against the manifest, push and open the PR through `agent-git.ts`, request Dave's review, run review, qa, spec-compliance, a11y-audit and architecture-audit, post the checks, queue auto-merge, and set Done with actuals when it merges. Start the next unit while a PR waits on checks if its files are disjoint; one builder at a time. Don't commit in ramble outside the merge-desk scripts. Done: three units merged.

### Next chat: w3-ops-host
- **Before you start:** nothing.
- **Run:** `/ramble-pm lane: w3-ops-host` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Lane `w3-ops-host`: U-083b (ops private requests queue with status), then U-070 (host cancels a booked session, cancel only, no retime: guest impact shown first, then the existing `cancelSession`; critical tier, so `human-read` waits on Dave's approval), then U-126 (the `/ops` landing: counts and links for the approval queue, refund-failed, support, private requests, today's sessions, recent audit rows; no metrics or charts). Read the `w3` lane rules under `## Next` in `STATUS.md`, DECISIONS 2026-11-17, and the units' rows in `drafts/mvp-replan-2026-11-10.md` section 2 (lite cuts) and section 4 wave 3 (file scopes). For each unit in order: set it In Progress on board #19, launch the builder in a worktree from the ramble checkout (`/senior <unit>`, scope manifest from units.yaml plus the lite cut), check its files against the manifest, push and open the PR through `agent-git.ts`, request Dave's review, run review, qa, spec-compliance, a11y-audit and architecture-audit, post the checks, queue auto-merge, and set Done with actuals when it merges. Start the next unit while a PR waits on checks if its files are disjoint; one builder at a time. Don't commit in ramble outside the merge-desk scripts. Done: three units merged.

### Next chat: audit-fixes
- **Before you start:** nothing. **Run:** `/ramble-pm lane: audit-fixes`. Sonnet, medium; builders Sonnet.
- **Prompt:** Lane `audit-fixes`, resuming round 2. Read the `### Lane: audit-fixes` section and the triage file (Round 2 rework table). Check PRs 1023, 1025, 1027 with `gh pr view`/`gh pr checks` (sandbox bypassed): `scope-manifest` must pass; critical PRs wait on `human-read`. Then one builder at a time, branch `unit/<unit>-audit-<batch>` from `origin/main`, title `<unit>: ... (#n)`: S-A2 (1000, U-014a), S-B (1017 1015 1013 1014 last, U-072), S-F1 (1002, U-127), S-F2 (1009 1016, U-057), S-G (834 then 835, U-049), C-A (1018 319, U-077). Per batch: scope manifest, push via agent-git.ts, PR from the worktree, review, four checks (qa with a browser run outside the sandbox for visible changes), automerge, pass-file rows on merge. Don't commit in ramble outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
