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

