# Status

**Updated:** 2026-11-18 05:55 by the lead (swarm chat, Fable). One issue is open: #999, which closes when the owner bypass-merges PR 1043, the only open unit PR. Merged today: 1041, 1042 (#1004), 1044 (#1005), 1045 (audit W3-3), 1046 (audit W3-2), 1047 (audit W3-1). The lead ran the ticket close-out at about 00:55 (60 issues closed); the owner's approvals closed #1004 and #1005. No lane is running; worktrees and branches of the merged PRs are removed. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `audit-auth` | #1005 (U-004a, critical): rate-limit keys on the two auth form posts; PR 1042 (#1004) waits on `human-read`; history in `lanes/audit-auth.md` | swarm subagent round 5, 2026-11-18 | handed off: PR 1047 (B-1, U-004a) and PR 1044 (#1005) at review, both waiting on human-read; see lanes/audit-auth.md | 2026-11-18 |
| `owner-pack` | one protected-files PR for the owner's bypass merge: #999 (`scripts/merge-desk/scope-check.ts`) and the standards lines in `.claude/standards/architecture.md`; history in `lanes/owner-pack.md` | swarm subagent, 2026-11-18 | handed off: PR 1043 open, waits on the owner's bypass merge | 2026-11-18 01:25 |
| `audit-w3` | read-only audit of wave 3 code (PRs 1019 to 1042) into `audits/wave3-2026-11-18.md`, combined into fix batches, low-value findings dropped; no code | swarm subagent, 2026-11-18 | handed off: 4 batches (B-1 to B-4), highest severity medium; not filed | 2026-11-18 01:30 |
| `w3-fix-b2` | audit batch B-2 (W3-2, U-078, standard): stale settings form undoes a concurrent change; owns `opsSettings.ts`, `db/settings.ts`, the settings action and `/ops/settings` form; history in `lanes/w3-fix-b2.md` | swarm subagent, 2026-11-18 | handed off: PR 1046 merged 2026-11-18 06:41 | 2026-11-18 02:45 |
| `w3-fix-b3` | audit batch B-3 (U-076c, standard): legal audit row inside the transaction, stale TODO and cache comments; owns `db/legal.ts`, `db/legalAdmin.ts`, comments in `home.ts`, `landing.ts`, `experiencePage.ts`; history in `lanes/w3-fix-b3.md` | swarm subagent, 2026-11-18 | handed off: PR 1045 merged (W3-3 fixed) | 2026-11-18 06:20 |
| `lead` | Shared status, `## Next`, roadmap, memory; ticket close-out | PM lead swarm, 2026-11-18 (Fable) | active: waiting only on the owner's bypass merge of PR 1043 (closes #999) | 2026-11-18 05:55 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: audit-auth
**Closed out by the lead, 2026-11-18 05:55.** PRs 1042 (#1004), 1044 (#1005) and 1047 (audit W3-1) merged on the owner's approvals; worktrees and branches removed. Nothing left in this lane. History: `lanes/audit-auth.md`.

### Lane: owner-pack
PR 1043 (branch `pm/owner-pack-2026-11-18`, head 15b981a) opened as the App, owner review requested. Carries #999 (PROTECTED widened) and three standards lines. Fails `scope-manifest` by design; owner merges with bypass. For the lead: the auth-row purges are not named in B6 because PR 1042 is unmerged; add them to the B6 text after it merges.

### Lane: audit-w3
Done 2026-11-18: `audits/wave3-2026-11-18.md`, 17 raised, 4 kept, 13 dropped, none filed. For the lead: 4 batches, one per unit, no file overlap: B-1 U-004a (IPv6 /64 key, critical), B-2 U-078 (stale settings form), B-3 U-076c (legal audit in the transaction), B-4 U-044 (review erasure, with U-085). Highest severity medium. History: `lanes/audit-w3.md`.

### Lane: w3-fix-b2
Done 2026-11-18: PR 1046 (U-078, audit W3-2) merged 06:41, three rounds, all checks green, no owner approval (standard tier). For the lead: `checkExpectedVersion` in `src/lib/sessions.ts` is now generic (string versions, null never matches); duplication audit item: unify the integer and timestamp version forms. History in `lanes/w3-fix-b2.md`.

### Lane: w3-fix-b3
PR 1045 merged 2026-11-18 (`fdb1d5a`, head `ea3ea34`, U-076c standard), round 1, all four agent checks passed. W3-3 fixed: legal draft, edit and publish write their audit row in the same transaction; stale TODOs and taxonomy comments corrected. For the lead: none to carry.

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts
Eight open PRD facts (Q-11 to Q-21) with their working assumptions: `open-client-facts.md`. None blocks the demo.

## Blocked on Dave
Refreshed 2026-11-18 05:55 by the lead. Item 1 closes the last open issue.

1. **Bypass-merge PR 1043** (closes #999, the last open issue; adds the #1005, B6 and `RichTextEditor` standards lines; fails `scope-manifest` by design, so an approval alone cannot merge it): `gh pr merge 1043 --repo defaultdave/ramble --squash --admin`. After it merges the lead prepares one more protected-files PR naming the auth-row purges (on `main` since PR 1042) in the B6 exempt list, for the same kind of merge.
2. **Read the full-run audit** and pick which recommendations to adopt: `drafts/full-run-audit-2026-11-18.md` (one-page summary first).
3. **Walkthrough** (your time, five passes): `### Next chat: walkthrough`. Its findings become the page-change units.
4. **Tooling the lead could not fix alone:** `board-dates.ts` needs the board's Sprint field deleted and rebuilt (a board settings change); `forecast.ts` needs solo estimates for U-120 to U-130 before the schedule can be refit.
5. **Production migrations 0024 to 0034** before the next production deploy. **U-129:** create its issue and board item. **Sentry** and **Method Layer 0:** as before (`lanes/lead.md`).

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Ticket goal (owner, 2026-11-18): close out all Ramble tickets by completion or closing.** One issue is left, #999. Order from here: (1) the owner's bypass merge of PR 1043; (2) then one more protected-files PR naming the auth-row purges in B6 (kept until 1043 merges, since both edit `.claude/standards/architecture.md`); (3) run `bun tools/audit-tickets.ts` as a dry run and only then with `--run`, if it files nothing; (4) the walkthrough, then page-change units from its findings with dictionary phases 1 to 4 riding along; (5) the owner's choices from the full-run audit.

Not built, by decision: audit W3-4 (review text erasure) travels with U-085; the 45 cut and parked units are closed and stay in `docs/plan/units.yaml`.

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items: `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: lead
- **Before you start:** bypass-merge PR 1043 (Blocked list, item 1).
- **Run:** `/ramble-pm` in a new desktop chat, started from the ramble main checkout.
- **Model and effort:** Sonnet, medium. Builders Sonnet, narrow checks Haiku.
- **Prompt:** You are the lead. Goal: confirm the ticket close-out is complete. Read `## Blocked on Dave` and `## Next` in `STATUS.md`, then GitHub (`gh pr view 1043` and `gh issue list --repo defaultdave/ramble`, sandbox bypassed). PRs 1042, 1044 and 1047 are merged and cleaned up. If 1043 is merged: remove its worktree (`agent-ac7d257ba58237ca1`) and branch `pm/owner-pack-2026-11-18`, mark audit row N1105-2 fixed, then prepare the one-line B6 standards PR for the auth-row purges the way PR 1043 was prepared (launch the builder from this chat with the Agent tool, `isolation: "worktree"`, shell in the ramble checkout) and hand the owner its bypass-merge command. Then dry-run `bun tools/audit-tickets.ts` and run it only if it would file nothing. Done looks like: zero open issues in `defaultdave/ramble`, STATUS and the roadmap refreshed and published. Don't commit in ramble outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-17 (read first):** The swarm runs from one Fable main chat (block `swarm` above), one Sonnet subagent per lane. The lead folds their "For the lead" notes, closes U-051 and U-105, refreshes the roadmap, and when the build lanes end opens the walkthrough lane, then the page-change units.

Older updates: `lanes/lead.md`.
