# Lane w3-reviews history

## U-060 round 1 (PR 1024, head 7488736)
Verdicts: review REQUEST_CHANGES, qa FAIL, spec-compliance REQUEST_CHANGES, architecture-audit FAIL, a11y PASS (4 advisories).
Findings (as reported by the previous session):
- Prettier on `review/[reference]/[token]/page.tsx` and `ReviewForm.test.tsx`.
- Seed ran on production-demo (decision: seed only where personas seed).
- B2/B17 duplication: review-invite key prefix, window math in db layer, summary branch in the page, time constants, reference generator.
- PRD-29 "not refunded" not checked.
- e2e malformed-token test `e2e/review.spec.ts:11` fails with no database.
- No-JS submit returns 500 (Origin null from no-referrer policy).
- Form clears input after a failed submit.
- a11y advisories (4).
CI note for the lead: `hosts.spec.ts:14` flaked once, passed on retry (outside lane).

## U-060 rounds 2 to 4
- r2 fixer c710e1c (all findings; the previous builder's duplicate local round 2 kept as branch wip/U-060-r2-old-builder). Review APPROVE, a11y APPROVE, spec RC (gift AC, deferred to U-064a), arch RC (8 B17/B2 items).
- r3 fixer d2372a3 (8 items plus advisories): all approve. QA PASS on 9c15e85 (36 PNGs qa-r2-*).
- CI e2e failed: seed read terms via dbRead (Neon HTTP). r4 fix 7e8f7b4 (reader param). Head 05656f0 after merging main. Checks reposted on it.

## For the lead (2026-11-17)
- hosts.spec.ts:14 flaked once in CI (outside this lane). The main checkout was found on branch `wip/U-076a-r7` (should stay on main).
- `ramble_qa_u060` Docker DB is not empty (987 seeded rows, 0 connections); left in place, drop it when convenient.
- Memory lesson: a seed reading through `dbRead` (Neon HTTP) passes `pnpm test:db` with a shim but fails CI e2e seeding on plain Postgres; run `pnpm db:seed` on a scratch DB after any seed change.
- Memory lesson: after merging `main`, run `CI=true pnpm install --frozen-lockfile` before the gates (new dependencies broke typecheck). zsh does not word-split `set -- $p`.
- Process: a previous builder had silently committed its own round 2 locally; compare `git log` of the unit branch against origin before assuming a worktree is idle.

## Old Next chat block
### Next chat: w3-reviews
- **Before you start:** nothing.
- **Run:** `/ramble-pm lane: w3-reviews` in a new desktop chat.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Lane `w3-reviews`: U-060 (review invites, reviews table, submission form; seed at least five verified reviews on four experiences, past orders for the guest persona, and a dev "send invite now" in `/ops/dev`), then U-044 (display at five or more reviews, at most ten listed, no sort or replies; rating on cards), then U-061 (ops hide and unhide with audit, no report flow). All standard tier. Read the `w3` lane rules under `## Next` in `STATUS.md`, DECISIONS 2026-11-17, and the units' rows in `drafts/mvp-replan-2026-11-10.md` section 2 (lite cuts) and section 4 wave 3 (file scopes). For each unit in order: set it In Progress on board #19, launch the builder in a worktree from the ramble checkout (`/senior <unit>`, scope manifest from units.yaml plus the lite cut), check its files against the manifest, push and open the PR through `agent-git.ts`, request Dave's review, run review, qa, spec-compliance, a11y-audit and architecture-audit, post the checks, queue auto-merge, and set Done with actuals when it merges. Start the next unit while a PR waits on checks if its files are disjoint; one builder at a time. Don't commit in ramble outside the merge-desk scripts. Done: three units merged.



## Moved from STATUS.md by the lead, 2026-11-17 (U-060 merged as PR 1024; these sat under the w3-ops-host heading)
- **2026-11-17 01:20, U-060:** built (builder 39 min), PR 1024 opened at 74887364, auto-merge not yet queued. Round 1 (review, qa, spec-compliance, a11y, arch audit): REQUEST_CHANGES/FAIL on prettier, seed on production-demo, B2/B17 duplications, PRD-29 non-refunded eligibility, malformed-token e2e, no-JS submit 500 (Origin null from no-referrer). Round 2 sent to the builder; no wip branch needed (builder's own worktree). U-044 and U-061 wait on U-060 landing.
- **2026-11-17 02:10, U-060 round 2 built** (builder HEAD d24e83c5, all 12 fixes, gates green in its worktree). A local merge of origin/main (eb5ed67, clean) is committed in the builder worktree `agent-afd4ab52887aaf4e6`, NOT pushed; typecheck, lint, format, db:generate clean after the merge, `pnpm test` and `pnpm test:db` post-merge not confirmed. Next: confirm those, push via `agent-git.ts push unit/U-060-review-invites`, rerun the four agent checks plus a11y on the new head, post checks, `review 1024`, `automerge 1024`.

## Close (2026-11-17)
- U-060 PR 1024 (4 rounds, Done 0.6 d), U-044 PR 1033 (3 rounds, 0.5 d), U-061 PR 1037 (2 rounds, 0.5 d). All merged, worktrees and branches removed.
- Suggestions not built: keep the status filter and cursor after a hide/show redirect (U-061); free-text hide reason needs a column; unhide aria-label phrasing; ReviewsBlock jump link / stars rounding advisories; orderReceipt.ts literals 120/200 use nameClip; `key={paragraph}` in HostContent, GuideEntry, ExperiencePage; same no-referrer Origin problem on manage/[token] and orders/[reference] pages (no-JS post); seed reset is not one transaction; gift-recipient AC of U-060 deferred to U-064a.
- Flaky: tests/db/cancel-session-email.db.test.ts 'has its job due...' fails in full local test:db runs sometimes (passes alone); hosts.spec.ts flakes once per run in e2e.


## Moved from STATUS.md on 2026-11-18 (lane complete)

### Lane: w3-reviews
- **LEAD NOTE, 2026-11-17 01:45:** the round 1 session finished the fix. Local `unit/U-060-review-invites` is at `3796775` (round 2 fixes `d24e83c` plus `main` merged), not pushed; it reports typecheck, lint, format, `db:generate` and `test:db` green and `pnpm test` not seen. `wip/U-060-r2` has no commits. Use the unit branch: run `pnpm test` and the remaining gates, push, rerun the checks. Drop the duplicate fixer's result unless it adds something.
- **LEAD NOTE, 2026-11-17 01:35 (correction to your round 2 brief):** the round 1 builder is still alive: its worktree `agent-afd4ab52887aaf4e6` (branch `unit/U-060-review-invites`) has uncommitted round 2 edits in progress. Your `wip/U-060-r2` fixer duplicates it. Check `git log` and `git status` there before any fast-forward of the unit branch; never discard its commits unseen. Take one complete result through review and say which in your report.
- **2026-11-17 00:40, claimed.** Order U-060, U-044, U-061, all standard tier. Round numbers and PRs are logged here as they happen.
- **Round 2 relaunch.** U-060 = PR 1024, branch `unit/U-060-review-invites`, reviewed head 7488736. Round 1: review RC, qa FAIL, spec RC, arch FAIL, a11y PASS. Findings and history: `lanes/w3-reviews.md`. Fixer branch `wip/U-060-r2`.
- **2026-11-17 02:30, U-060 PR 1024 head 05656f0: four checks green, review requested, auto-merge queued; waits on CI and Dave's approval.** U-044 and U-061 wait for the merge. History and lessons: `lanes/w3-reviews.md`.
- **2026-11-17: U-060 (PR 1024), U-044 (PR 1033), U-061 (PR 1037) merged, Done on board #19. Lane complete.**
- **For the lead:** see `lanes/w3-reviews.md` "For the lead" (main checkout on `wip/U-076a-r7`, hosts.spec flake, `ramble_qa_u060` not empty, two memory lessons).

### Next chat: w3-reviews
- Lane complete (U-060, U-044, U-061 merged). Nothing to run; the lead removes the row.
