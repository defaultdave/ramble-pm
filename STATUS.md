# Status

**Updated:** 2026-11-16 night by the lead. Folded the dependabot-review chat's decisions (DECISIONS 2026-11-16): Blocked items cleared except production migrations 0024 to 0032, Sentry, and two new asks (PR 990, U-129's issue). Merged today: ramble 979, 981, 982, 983, 984, 986, 987, 988; 985 closed. Board #19 reconciled: U-102, U-068, U-128 Done, plus ten merged units that had been left In Progress or Todo (U-004a, U-022, U-055, U-073, U-074a, U-074b, U-074c, U-075, U-125, U-120 as NEW-1; delta-log 2026-11-16); U-130 is #989, Todo. Schedule not refit (delta-log). Filed 28 audit tickets (#991 to #1018). Finished lanes swept to `lanes/`. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `guest-signin` | U-130: show the guest sign-in link on screen while email is off (DECISIONS 2026-11-16); owns (guest)/sign-in/, src/server/auth/ (sign-in link path only), src/lib/signIn.ts | swarm subagent, 2026-11-17 | handed off: PR 1020 open, checks posted, auto-merge queued, waiting on Dave's `human-read` | 2026-11-17 00:55 |
| `w3-reviews` | U-060, U-044, U-061 (reviews, lite cut); owns schema/reviews, jobs/reviewInvite*, (checkout)/(site)/review/, fixtures/reviews.ts, db/browse.ts and db/home.ts (rating only), lib/experienceCards.ts, components/ExperienceCard/, ExperiencePage/ reviews block, (ops)/ops/reviews/ | swarm subagent, 2026-11-17 | active: starting U-060 | 2026-11-17 00:40 |
| `w3-cms` | U-076a, U-076b, U-076c, U-078 (no gift switches): (ops)/ops/editorial/, ops/settings/, lib/richText/, components/RichTextEditor/, actions/editorial.ts, actions/settings.ts, db/settings.ts, db/taxonomy.ts | swarm subagent, 2026-11-17 | active: starting U-076a | 2026-11-17 00:30 |
| `audit-fixes` | the open `audit` issues: triage against `main`, fix in batches of disjoint files; any file no other lane owns | swarm subagent round 2, 2026-11-17 | active: re-filing S-C under its owning unit (PR 1021 cannot merge: scope-manifest) | 2026-11-17 00:44 |
| `w3-ops-host` | U-083b, U-070 (cancel only), U-126; owns (ops)/ops/requests/, (host)/host/sessions/[id]/cancel, (ops)/ops/page.tsx (dashboard) | swarm subagent, 2026-11-17 | active: starting U-083b | 2026-11-17 00:18 |
| `lead` | Shared status, `## Next`, roadmap, memory; coordinates the 2026-11-17 swarm | PM lead swarm, 2026-11-17 (Fable) | active: coordinating the five-lane swarm, one Sonnet subagent per lane | 2026-11-17 00:20 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: guest-signin
- **2026-11-16, U-130 scoped, not started.** Problem: guests sign in only by emailed magic link, and email is off (`EMAIL_MODE=sink`), so no guest can create an account or sign in. Dave chose option 2: after a guest submits their address, the page shows the sign-in link (the same `/sign-in/confirm` page the email points to) instead of saying "check your email". Rules: it works only while `EMAIL_MODE` is `sink`; it refuses any address that holds a role grant (host, host_staff, ops roles), and those still go through the ops mailbox; the refusal looks the same as a normal "link sent" reply so it does not reveal which addresses hold roles. Known accepted hole: anyone who types an existing guest's address signs in as that guest. Tier: critical (auth path). The PRD-37 wording change goes in `delta-log.md`, since the PRD is frozen.
- **2026-11-16 night, lead:** issue #989 and its board item exist (Todo). `units.yaml` entry merged as PR 990 (`d2f8f8f`, 2026-11-17). Lane row set to handed off: scoped, ready to build.
- **2026-11-17 00:55, swarm subagent: U-130 built, PR 1020 open, all four agent checks posted, auto-merge queued, waiting on Dave's `human-read`.** Branch `unit/U-130-guest-signin-on-screen`, head `c4168ef897c368a618737c588bf25f42f12c2f64` (builder commit `a6350e1`, round-1 fix `c4168ef`, fixer branch `wip/U-130-r1`). PR https://github.com/defaultdave/ramble/pull/1020. Round 1: review APPROVE (README fix, nit), QA PASS (real browser, 37 PNGs in `evidence/pr/unit-U-130-guest-signin-on-screen/`), spec 7/7, architecture-audit FAIL (B13 silent catch, B2 parse in the action, B6 `holdsAnyRoleGrant` without a Caller), a11y PASS. Round 2 on `c4168ef`: review APPROVE (2 nits), architecture PASS, spec 7/7; QA carried from round 1 (the fix touched no UI; said so in the check). Checks posted on `c4168ef`: review-agent, qa-agent, spec-compliance, architecture-audit, all success. Dave's review requested, auto-merge on (`autoMergeRequest` read back). CI at last look: everything green except `db`, `e2e`, `test` still pending (runners busy) and `human-read` failing as expected until Dave approves. Board #19: U-130 In Progress (set 00:25).
- **For the lead:** (1) Dave's ask: approve PR 1020 (`human-read`); read the README "Worth knowing" bullet first. Two accepted risks: anyone typing an existing guest's address signs in as that guest; in sink mode a role-holder address answers "check your email" while a guest sees Continue, so role-holding addresses can be told apart (the ops/owner/staff/admin seed addresses are public in the repo anyway). (2) Lane PM decision, overrulable: `holdsAnyRoleGrant` (subject-based read before sign-in, no Caller) ruled the same class as the B6-exempt `readRoleGrants`; add it to the B6 exempt list in `.claude/standards/architecture.md` (Dave's file). Also advisory: B9 text could name the auth-link-outside-outbox exemption (`signInInvite.ts`). (3) When PR 1020 merges: set U-130 Done on board #19 (App cannot close #989), remove the worktrees `agent-a5e6ae6027d01956f` and `agent-a4c1bb5f1144f20a1` and local branches `unit/U-130-guest-signin-on-screen`, `wip/U-130-r1`. (4) Memory candidates: a sibling-address oracle is inherent to the on-screen link; `$TMPDIR` is shared across lanes, use unique file names for check summaries; zsh does not split `set -- $p`, use a function. (5) Evidence PNGs in `evidence/pr/unit-U-130-guest-signin-on-screen/` are published with this commit. (6) Suggestions not built: copy literals still outside `src/lib/copy/` in `src/lib/signIn.ts` and `SignInForm.tsx` (dictionary phases 1 to 4); Continue link is low emphasis and its focus ring touches the body text; no-JS sign-in is already blank site-wide (Suspense streaming); a unit test for `sendSignInLinkEmail`; README stamp "Read from main at 2db68ea" not refreshed; a role-holder oracle could be closed by showing the link only after a second factor, not worth it for a demo.

### Lane: w3-reviews
- **2026-11-17 00:40, claimed.** Order U-060, U-044, U-061, all standard tier. Round numbers and PRs are logged here as they happen.
- **For the lead:** none yet.

### Lane: w3-cms
- **2026-11-17 00:30, claimed.** Order U-076a, U-076b, U-076c, U-078, standard tier, one builder at a time. Round numbers: none yet.
- **For the lead:** none yet.

### Lane: audit-fixes
- **2026-11-17 round 2, running.** Triage and batches: `drafts/audit-fixes-triage-2026-11-17.md`. History of round 1 (S-C built as PR 1021, which cannot merge under a `pm/*` branch): `lanes/audit-fixes.md`. Batches are filed per owning unit and tier (`unit/<unit>-audit-<batch>`, title `<unit>: ...`).
- **For the lead:** none yet.

### Lane: w3-ops-host
- **2026-11-17 00:18, lane claimed.** Order: U-083b, U-070 (cancel only, critical), U-126. Nothing built yet.
- **For the lead:** none yet.

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
Refreshed 2026-11-17 by the lead. Older lists and what was cleared on 2026-11-16: `lanes/lead.md`. Nothing here blocks the current goal.

1. **Production migrations 0024 to 0032:** run the `db-migrate-production` workflow before the next production deploy.
2. **U-129:** create its issue and board item (PR 978 merged 2026-11-14), so it can be set Done.
3. **Sentry** (held until the demo is shared): the server and browser projects, the ops address, the three alert rules in `docs/runbooks/alerting.md`, then `SENTRY_DSN` and `SENTRY_BROWSER_DSN` (the browser one at build time too) in Vercel.
4. **Method Layer 0** (open decision 3): not needed until P6.
5. ~~Close PR 1021~~ done 2026-11-17 (Dave closed it and deleted `pm/audit-sc-form-focus-a11y`); batch S-C is re-filed on `unit/U-068-audit-sc`.
6. **Audit tickets that need a ruling** (2026-11-17, `audit-fixes` lane; questions and recommendations in `drafts/audit-fixes-triage-2026-11-17.md`): #998 (make `human-read` a required check in the `main` ruleset), #999 (`scope-check.ts` protected list, a bypass merge), #890 (NoScriptFilters client island or a server route), #1005 (Server Actions or a DECISIONS row extending B15), #1001 and #1004 (shape of the lockout fix; held until U-130 lands), #791 and #993 to #995 (scope and sizing). The lead brings these in one batch with the lanes' other asks.

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
- **Before you start:** nothing. Triage is done: `drafts/audit-fixes-triage-2026-11-17.md` (tables and batches).
- **Run:** `/ramble-pm lane: audit-fixes` (swarm subagent or desktop chat).
- **Model and effort:** Sonnet, medium; builders Sonnet.
- **Prompt:** Lane `audit-fixes`, resuming. Read the `### Lane: audit-fixes` section in `STATUS.md` and the triage file. Check PR 1021 (S-C) state; if its qa-agent check is still `action_required`, rerun QA with a DB dev server outside the sandbox (contact form invalid focus ring, host agreement, weekday and cancel-notice flows) and repost. Then build the remaining batches one builder at a time, each on a branch `pm/audit-<batch>` cut from `origin/main` (push only allows `unit/U-*`, `pm/*`, `revert/*`): S-A (1006, 1007, 1008, 1000), S-B (1017, 1015, 1013, 1014 last), S-D (891, 893, 997, 991, 992), S-F (1002, 1009, 1016), S-G (834, then 835 by test file), then C-A money (1018, 319, critical). Scope manifest per builder from the triage file; compare files; merge `main`; gitleaks and no-DB build; push, PR with `Closes #n`, review, then four checks (review-agent, qa-agent, spec-compliance, architecture-audit); queue auto-merge. Record each ticket's outcome in its pass file under `audits/` (images-2026-11-14, nightly-2026-11-11/12/13, booking-checkout, test-audit) when its PR merges. Don't commit in ramble outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
