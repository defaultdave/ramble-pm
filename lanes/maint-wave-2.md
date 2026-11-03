# Lane maint-wave-2

2026-11-02 evening: Maintenance wave 2 (P08 to P14, P25, N1030-10 in P10) from `audits/maintenance-triage-2026-11-01.md`.

- Builders: `senior` agents in agent worktrees cut from the ramble checkout; five at a time. Branch names `unit/U-xxx-maint-Pnn` under the owning unit: P08 U-030, P09 U-031, P10 U-021a, P11 U-008b, P12 U-047b, P14 U-019 (standard, to `main`); P13 U-020 and P25 U-047a (critical, to `integration`). P25 was first built as U-008b and renamed: `startPayment` is U-047a's, a critical unit.
- Reviewers: one `general-purpose` sonnet per PR, own scratch worktree, four checks, then `agent-git.ts review` and `automerge`.
- PRs: 723 P08, 724 P09, 725 P12, 726 P10, 727 P14 (all merged), 728 P11 (merged after a `db` rerun), 729 P13 and 730 P25 (into `integration`).
- Departures from the triage:
  - P08: H-78 only `.copy` and `.art` composed; `.band`, `.skeletonInner`, `.pills`, `.cards` are not copies. #572 stays open (Refs).
  - P09: added `isDateInWindow` (sessionWindow.ts) for the N1030-4 clamp. BE-9 copy "No experiences on this page" and the N1031-17 "Anywhere" label wait for Dave; #471 stays open.
  - P10: N1029-17 skipped `storageSettingIssues`; #426 stays open. N1030-10 (#436) done: local target refuses non-fake storage.
  - P11: `src/server/secureEqual.ts` moved to `hash.ts`, nine importers repointed.
  - P13: SC-9 pool timeouts dropped (a per-connection SET made `test:db` flaky, 5 of 8 clean runs against 3 of 3; Neon pooler behaviour with startup options unverified). Only `maxDuration = 300` kept. #693 stays open.
- Flakes seen: `tests/db/audit.db.test.ts` "dead-letters a day at the first attempt" failed again in CI on PR 728 (claimed 0, expected 1); passed on rerun. A concurrent-booking db test failed once locally in P09 review.
