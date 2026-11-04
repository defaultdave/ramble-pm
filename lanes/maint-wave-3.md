# Lane maint-wave-3

2026-11-03 night: Maintenance wave 3 (P15 to P20, plus P26 `ticket-comments`, N1031-15) from `audits/maintenance-triage-2026-11-01.md`.

- Overlap check on `origin/main` `5c7c36a`: only P15 (H-60 touched Card.module.css) and P20 (H-87, Card.module.css) shared a file; P15 skipped H-60, so none did. Builders: `senior` agents in agent worktrees cut with the shell in the ramble checkout; branches `unit/U-xxx-maint-Pnn`: P15 and P16 U-030, P17 U-007, P18 U-010, P19 U-021b, P20 U-012 (standard, to `main`); P26 U-049 (critical, to `integration`). Five builders at a time (P15 to P19), then P26, then P20.
- PRs: 838 P15, 837 P16, 825 P17, 831 P18 (merged), 820 P19, 840 P20, 839 P26. One `general-purpose` reviewer each, own scratch worktree, four checks, then `agent-git.ts review` and `automerge`.
- Rows skipped or partial: P15 H-60 (no Badge highlight tone on `main`), H-104 comment only, H-105 pinned at 100; P16 SC-3 (suggest won't-fix); P18 N1029-13 partial (`PaymentsError`); P19 BE-11 (needs a disclosure redesign). P20 H-87 was only reproducible with a four-digit price on the horizontal card.
- Departures from the triage: P20 added the two callers of `UpcomingSessionsError` to scope; P26's `providerEvents.ts:483` and `orders.ts:858` mentions no longer exist on `main` (the ticket numbers sat at `providerEvents.ts:346` and `schema/orders.ts:126`).
- Evidence: P20 before and after PNGs in `evidence/pr/unit-U-012-maint-P20/`, embedded in PR 840.

2026-11-03 night, CI check and fix rounds:
- First CI pass: `storybook` failed on 820 (BE-17 tabindex removal, axe `scrollable-region-focusable`) and on 837 (HomeEmpty Empty Mobile, axe `landmark-no-duplicate-banner`), `e2e` on 837 (`landing.spec.ts:20` expected the old fallback title), `db` flake on 825, 838, 840, `scope-manifest` on 839 (`integration` behind `main`). `expire preview branch` failed on all (Neon preview branch missing).
- Fix rounds, wip branches fast-forwarded into the unit branches, re-reviewed, checks re-posted on the new heads: 820 head `e35a972` (BE-17 reverted), 837 head `fd607dd` (story rule disabled, spec updated). Both then merged.
- Lesson: the first reviewers could not run Storybook or Playwright in their sandbox and said so, but the PM queued auto-merge on those checks anyway. UI PRs now need `pnpm storybook:test` and the e2e specs run before checks are posted.

2026-11-04 early: finish.
- `db` flake: diagnosed as a sub-millisecond race between `jobs.run_after` (database `clock_timestamp()`) and a millisecond JavaScript `Date` in `drainJobs(systemClock)`; fixed in PR 846 by draining with the repo's `dueClock`. It also failed on `main` itself four times. Not reproduced locally (40 runs), cause verified from the code and 1000 `clock_timestamp()` samples.
- Sync 845 (`sync/2026-11-04`): prepared by a builder agent in its own worktree (two conflicts, `src/server/ports/storage/index.ts` and `src/server/pulse.ts`, resolved keeping both sides), verified by a second agent (parents, merged-PR provenance, blob-hash comparison of all other changed files, migration check, gates including the db suite), four checks posted, Dave admin-merged it. 839's `scope-manifest` then passed on rerun.
- 838: `main` merged into the branch after 846 (clean), gates rerun, a reviewer re-posted the four checks.
- Gap noted: storybook was not run by any sync or flake-fix reviewer; Chromium needs the sandbox bypassed.
