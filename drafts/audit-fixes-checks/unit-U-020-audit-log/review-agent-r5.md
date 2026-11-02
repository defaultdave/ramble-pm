PASS

## review-agent: U-020 "Audit log" (head bd29697, round 5; round 3 passed at 4b39c96)

Reviewed `git diff 4b39c96 8c7f543` (3 files), the merge `98a3cab` (main at `39e18b4`), and `git diff 98a3cab bd29697` (1 file). Tests ran in a scratch worktree detached at bd29697 (removed afterwards; no checkout changed, nothing pushed, posted, or committed).

Results at bd29697:
- unit project, `src/lib/audit`, `src/server/jobs`, `src/lib/privacy`, `src/server/ports/storage`, `src/lib/storage`, `src/server/pulse`, `src/lib/jobs`: 11 files, 529 tests pass.
- db project, `tests/db/audit.db.test.ts`: 54 pass.
- eslint on `src/lib/audit.ts`, `src/lib/audit.test.ts`, `src/server/jobs/auditSchedule.ts`, `src/lib/privacy.ts`: clean. `tsc` reports nothing outside `src/app` (the known generated-route `PageProps` noise).

### Blocking
None.

### What was judged

1. `4b39c96..8c7f543` (src/lib/audit.ts:195-204, src/server/jobs/auditSchedule.ts:28, src/lib/audit.test.ts). `auditExportsOn(capabilities)` is replaced by `auditExportSkipped(capabilities, dayCount)`, which returns `dayCount > 0 && !canStoreVisibility('audit', capabilities)`. The old call site was `days.length > 0 && !auditExportsOn(storage)`, so the new expression is the same boolean for every input. The scheduler still warns and returns 0 only when days are due and the store cannot hold an audit object; the queue path, dedupe keys, and transaction are untouched. `git grep auditExportsOn bd29697` finds nothing, so no stale caller or import remains. The two-row test is replaced by a five-row `it.each` over (storesAudit, dayCount): (false,3), (false,1), (false,0), (true,3), (true,0), which covers both sides of the `dayCount > 0` guard and both capability values. The existing `auditSchedule.test.ts` and `audit.db.test.ts` cases (warning only with ready days, none while the log is empty) still pass unchanged, so the call-site behavior is pinned.

2. The merge `98a3cab`. Files changed on the main side since the merge base (`053bd1a`): 43 files, all in browse, landing, catalog, editorial, sessions, cache tags and profiles, components, e2e, and runbooks. Of U-020's 31 files, none appear in the main-side set (empty intersection), so the merge could not conflict in them and the merge commit shows no conflict markers. Semantically, U-020 imports nothing from the main-side files: its dependencies are `src/lib/audit.ts`, `jobs.ts`, `storage.ts`, `privacy.ts`, the storage port, the job registry, and `pulse.ts`, none touched by main. The migration folder and journal are untouched by main (still 0020 and 0021 as U-020 added them), so there is no migration number collision. The audit unit, job, privacy, storage, and db tests above pass on the merged tree.

3. `bd29697` (src/lib/privacy.ts:854). The retention note for `audit_log` now reads "The table allows no delete, so rows stay in the database. The nightly export is not switched on yet; once it is, the period is the lock on its objects, which only the storage lock can end". This resolves the non-blocking item I carried in round 3 (the line stated the lock as a present fact) and now agrees with lines 233, 732, and 736. `retentionSchedule` is read only by `src/lib/privacy.test.ts` (period validity, dataset coverage); nothing renders it and no test or e2e asserts on the note text, so the change has no runtime or UI effect. No em dash, no ticket comment.

4. Sweep of the four defect classes and duplication over the delta. The delta adds no input, loop, retry, query, stored value, error path, or log call (class 1 to 4: nothing new). `auditExportSkipped` wraps `canStoreVisibility`, the same rule the port enforces; no second copy of the rule exists. Nothing new duplicates existing code.

### Non-blocking
- tests/db/audit.db.test.ts:29 and :594: the hoisted module-level `store` and the local `const store` in a later test share a name (round 3 item, still open). A rename to `lockedStore` would remove the trap.
- Carried over from rounds 2 and 3, not re-raised: no alert (only a warn log) when rows sit unexported on a store that cannot hold them, and none when `queueAuditExports` fails.

### Unconfirmed
- Same as round 3: a later unit's third-party error carrying a truthy `permanent` would be dead-lettered by the duck-typed check in `failureOutcome`. No such error exists in `src` today.

### Do the earlier verdicts carry to bd29697?

| Verdict | Judged head | Carries to bd29697 | Why |
|---|---|---|---|
| spec-compliance-r3.md | 4b39c96 | Yes | Its four criteria are: log exists and is insert-only, export job writes a day to the audit store, export refuses on a provider with no locked store, the fake declares no locked store. The only code change since is a rename-and-reshape of the skip predicate with an identical boolean (item 1), the merge touches none of U-020's files (item 2), and the privacy line is copy that no criterion reads (item 3). `fake.ts`, `config.ts`, the registry, and `auditExport.ts` are byte-identical to 4b39c96. |
| qa-agent-r3.md | 4b39c96 | Yes | QA ran the pulse against a production build on `fake` and `vercel-blob` and read the HTTP status, `jobs` rows, and server log. Runtime behavior is the same at bd29697: the same branch fires for the same (store, days) inputs, and the privacy text is not rendered by any page (`retentionSchedule` is test-only), so no screen or response QA saw can differ. The merge brought only browse and landing routes, which the pulse path does not reach. No new evidence is owed; there is no UI. |
| architecture-audit-r4.md | 8c7f543 | Yes | Its delta (`auditExportSkipped` holds the B2 rule, `auditExportsOn` gone) is the last U-020 code change; I confirmed that file is unchanged between 8c7f543 and bd29697 apart from the merge, which does not touch it. Since 8c7f543 the only U-020 change is one string in `privacy.ts`, which adds no layer import, no decision, and no export. The main-side files are another unit's and were audited in their own PR. |

Evidence: none relied on beyond the commands above; no UI.
