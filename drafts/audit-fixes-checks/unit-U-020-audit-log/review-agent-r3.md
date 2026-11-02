PASS

## review-agent: U-020 "Audit log" (head 4b39c96, round 3; round 2 passed at d8cded6)

Reviewed `git diff d8cded6 4b39c96` (10 files: audit lib, scheduler, storage fake, privacy wording, and their tests, all inside the unit's scope). Ran in a scratch worktree at 4b39c96 (removed afterwards; no checkout changed). Full unit and components projects: 266 files, 6858 tests pass. Full db project: 38 files, 1674 tests pass. Matches the fixer's counts. `tests/db/audit.db.test.ts` alone: 54 pass. eslint on the touched files is clean, and `tsc` shows errors only under `src/app` (generated-route `PageProps`), none in touched files.

### Blocking
None.

### What was judged

1. `storesAudit` option on the fake (src/server/ports/storage/fake.ts:36-41, 62-64). Defaults to false, so the app's `getStorage` fake (src/server/ports/storage/config.ts, which passes no option) declares no locked store and an audit export cannot report success into process memory. Pinned by the new case in src/server/ports/storage/config.test.ts. The contract suite now runs against both fakes (src/server/ports/storage/fake.test.ts `describe.each`), so the refusal path and the success path are both covered. The other users of the fake that need the success path (auditExport.test.ts:79, audit.db.test.ts:539) opt in explicitly. Mutation: default flipped to true fails the config.test.ts case.

2. The `@/server/ports/storage/config` mock in tests/db/audit.db.test.ts:28-43. Can a test pass on the wrong store? No, checked by mutation, each in a scratch worktree:
   - Mock always returns the real `getStorage` (unlocked fake): 2 tests fail (the schedule-and-drain test and the pulse test), so the success paths cannot pass on an unlocked store.
   - `store.locked = false` in the drain test replaced by `true`: the new dead-letter test fails, so it cannot pass on a locked store.
   - Fake default flipped to true: the db dead-letter test and the config test both fail.
   - If the mock stopped applying, the real fake is unlocked and the success tests fail, so the failure direction is closed.
   - Only `auditExport.ts` and `auditSchedule.ts` import `getStorage` from that module; the mock exports only `getStorage`, which is all the module exports. The locked fake is one instance for the file, so the pulse writes and the test at line 593 reads the same objects. `try/finally` restores `store.locked`; tests in a file run in order, and `beforeEach` clears `jobs`, so the `SELECT FROM jobs` assertion of exactly one row is sound.
   - If `STORAGE_PROVIDER` were `vercel-blob` the original `getStorage` throws a plain error, which retries (pending, attempts 1), so the dead assertion would fail rather than pass wrongly. The only route to `dead` at attempt 1 with `max_attempts` 20 is the permanent `unsupported` refusal.

3. Moved guard in `scheduleAuditExports` (src/server/jobs/auditSchedule.ts:26-35). Nothing is skipped: with a locked store the path is identical to round 2 (same `days`, same transaction, same dedupe keys). With an unlocked store and days due it queues nothing and warns, as before. With an unlocked store and no days it falls into the transaction with an empty loop and returns 0, with no warning. The warning now means "there are ready days and the store cannot hold them", which is the condition under which rows go unexported. This resolves round 2's non-blocking noise item. Two mutations fail the new test ("does not warn ... while the log is empty"): the old unconditional guard, and the guard without `days.length > 0`. The guard now follows `readFirstAuditTime`, so a database error there reaches `queueAuditExports`, which logs by error name only (unchanged from round 2). `auditExportsOn` (src/lib/audit.ts:195-197) is a one-line wrapper over `canStoreVisibility('audit', ...)`, the same rule the port enforces in `parsePutInput`, tested with a two-row table; no second copy of the rule exists (`storesAudit` is read only in src/lib/storage.ts:50 and the adapters' declarations).

4. New drain test (tests/db/audit.db.test.ts:600-634). Closes the gap I named in round 2: it drives a permanent error through the real `drainJobs` and the real registry, and asserts `claimed 1, dead 1, retried 0`, row `dead` with `attempts 1, max_attempts 20`, and exactly one `job-dead` alert with `kind: 'audit-export'`. The alert module is mocked and `raiseAlert` cleared first, so the count is this test's own. Fails under the mutations in item 2.

5. Privacy line (src/lib/privacy.ts:233). Now "once switched on, its nightly export is write-once", consistent with line 736 ("not switched on yet"). This was my round 2 nit and it is addressed.

### Non-blocking
- src/lib/privacy.ts:854 still reads "the period is the lock on the nightly export objects" as a present fact. Same wording class as the line fixed at 233; "once switched on" would match. Not wrong enough to block.
- src/server/jobs/auditSchedule.ts:26-27: the warning fires whenever ready days exist, including a log whose first row is older than the 7-day lookback and which has no rows in the window. The message ("export is off") is still true; only "rows are going unexported" is imprecise in that corner. Acceptable.
- tests/db/audit.db.test.ts:29 hoists a module-level `store` and line 594 declares a different local `const store` (the fake adapter). Legal and correct as written (the new test at line 613 sees the hoisted one), but a rename to `lockedStore` would remove the trap.
- Carried over, not re-raised: no alert (only a warn log) when rows sit unexported on a store that cannot hold them, and no alert when `queueAuditExports` fails (round 2 items 2 and 3); the real R2 adapter and other out-of-scope items.

### Unconfirmed
- Same as round 2: a later unit's third-party error carrying a truthy `permanent` would be dead-lettered by the duck-typed check in `failureOutcome`. No such error exists in `src` today.

Evidence: none relied on beyond the commands above; no UI.
