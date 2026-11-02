PASS

## review-agent: U-020 "Audit log" (head d8cded6, round 2; round 1 at 6f675e5)

Reviewed `git diff 6f675e5 d8cded6` (23 files, all inside the unit's scope: audit lib, export job and scheduler, storage port, job drain outcome, pulse, privacy wording, and their tests). Ran in a scratch worktree at d8cded6 (removed afterwards): the unit tests for audit, jobs, storage, sessions, the jobs directory, the storage ports and the pulse (574 pass), `tests/db/audit.db.test.ts` (53 pass), `tsc` (only the existing generated-route `PageProps` errors under `src/app`, none in touched files), knip and eslint on the touched files (clean). One throwaway DB probe, described under item 4, was deleted with the worktree.

### Round 1 blocking items

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | `dayOf` duplicated `isoDateOf` | Fixed | `dayOf` deleted; src/lib/audit.ts:1-4 imports `isoDateOf` from `./time`, used at 177, 178 and 187. `ExportDaySchema` (src/lib/audit.ts:134) now reuses `IsoDateSchema` instead of a second calendar check, so a second duplicate went away too. |
| 2 | `__proto__` key repaired by Zod | Fixed | src/lib/audit.ts:77 `!Object.hasOwn(value, '__proto__')` sits in the `custom` step that runs before the `record` pipe, so the key is refused before Zod can skip it. Cases added to the lib refusal table (src/lib/audit.test.ts, two inputs built with `JSON.parse`) and to the lib-versus-database parity table (tests/db/audit.db.test.ts:210). Both pass. |
| 3 | Dead export day | Fixed (per PM ruling) | src/server/jobs/registry.ts:90-91 `maxAttempts: jobLimits.maxAttemptsCeiling` with a comment that is true; registry value pinned by src/server/jobs/enqueue.test.ts. The scheduler comment (src/server/jobs/auditSchedule.ts:11-17) now says what happens: stays dead, raises `job-dead`, nothing re-drives it, dedupe key stays used. No TODO. The ceiling is 20 and passes `jobs_max_attempts_range` (1 to 20). By `backoffSeconds` the 20 attempts take about 70 hours, so a store outage of up to roughly three days is survived. |

### Blocking

None.

### What is new, judged

1. `failureOutcome` and `StorageError.permanent` (src/lib/jobs.ts:173-195, src/server/ports/storage/index.ts:30-39). Verdict: correct, and no other job kind changes outcome.
   - The only way to change an outcome is a thrown value that is an `Error` carrying `permanent === true`. A search of `src` and `tests` finds `permanent` set in exactly one place: `StorageError`, true only for code `unsupported` (`isPermanentStorageCode`). The other mentions are the Resend bounce comment, email tests and the new tests.
   - `unsupported` is thrown only from `parsePutInput` when `visibility` is `audit` and `storesAudit` is false (src/server/ports/storage/index.ts:135-141). Of the registered kinds (`noop`, `process-provider-event`, booking emails, `audit-export`), only `audit-export` writes an `audit/` key. Every other kind falls through to the old `attempts >= maxAttempts` rule unchanged.
   - Table in src/lib/jobs.test.ts: permanent error is `dead` on attempt 1; `permanent: false` is `pending`; a plain object `{permanent: true}` that is not an `Error` is `pending`.
   - Probe, run against the local Postgres with the real `drainJobs` and the real `jobRegistry`, `STORAGE_PROVIDER=vercel-blob`, one `audit-export` row for 2026-10-01 with `max_attempts` 20 and the alert module mocked: the report was `claimed 1, dead 1, retried 0`; the row was `status dead, attempts 1, max_attempts 20`; `alerts.raise` was called exactly once with `('job-dead', 'error', deadJobAlertKey('audit-export', id), { kind, jobId })`. So a permanent failure dead-letters on that attempt and raises the alert. `prepare` runs inside the `try` in `runJob`, so its throw reaches `recordFailure`. No CHECK ties `dead` to `attempts = max_attempts`; `jobs_attempts_range` only requires `attempts <= max_attempts`.
   - Gap, not blocking: no committed test drives a permanent error through `drainJobs`. The unit tests cover each half (the outcome table, and the store refusing with `permanent: true`) and my probe covers the join. A one-row case in tests/db/audit.db.test.ts next to line 566 would pin it.

2. `scheduleAuditExports` skip and warning (src/server/jobs/auditSchedule.ts:22-28). The skip is right: no day is spent on a job that cannot succeed, so days inside the lookback are still queued once a store that can hold them is configured. Noise: `logger.warn` writes one JSON line to stderr and to Axiom if configured. It does not reach alerts or Sentry. On `vercel-blob` it is 48 lines a day, forever. The volume is acceptable, but the signal is wrong in two ways.
   - Non-blocking: the check runs before `readFirstAuditTime`, so it warns even on an empty log where nothing is withheld, and 48 warnings a day then say "export is off" when there is nothing to export. Move the guard after the empty-log check (or after `exportDaysDue` returns days) so the warning means "rows are going unexported". That cuts noise to the cases that matter.
   - Non-blocking: once rows exist on a store that cannot hold them, the only trace is a log line; before this change it was a `job-dead` alert. Consider `alerts.raise` with a fixed dedupe key at that point instead of, or beside, the per-pulse warning. Not blocking because U-055 writes no rows yet and the real adapter is out of scope.

3. `queueAuditExports` (src/server/pulse.ts:90-103). Logging is clean: the context is `{ errorName }` only; the test throws a `TypeError` whose message carries a connection string and asserts the log holds just `{ errorName: 'TypeError' }`. A non-`Error` throw logs `NonError`. The drain, purge, hold cleanup and heartbeat still run (test asserts all four). Non-blocking: the error is logged with no alert and the heartbeat still reports healthy, so a scheduler fault that lasts past the 7-day lookback loses exports with only an error-level log line to show it. Round 1 suggested an alert here; `alerts.raise` with a fixed key would do. Same reasoning as above for not blocking.

4. `canStoreVisibility`, `canDeleteKey`, `isAlreadyWritten`, `isPermanentStorageCode` (src/lib/storage.ts:30-64). Each is a small `src/lib` decision with its own table in src/lib/storage.test.ts, which is where B2 wants it. `canDeleteKey` is slightly stricter than before: a key that names no store (`visibilityOfKey` null) is now also refused, in the safe direction, and `DeleteInputSchema` already rejected such keys, so no caller changes. `parsePutInput` now takes the adapter's capabilities in both adapters (the only two call sites), so the refusal is the port's rule and the Vercel Blob adapter makes no SDK call (asserted). The contract suite reads `port.storesAudit` and expects `{ code: 'unsupported', permanent: true }`. No duplicate of these helpers exists elsewhere in `src/lib`.

5. `IsoDateSchema` (src/lib/sessions.ts:54) is not in the diff. `ExportDaySchema = IsoDateSchema.refine(...)` builds a new schema and does not mutate the shared one. Probe: `IsoDateSchema` still accepts 1999-12-31, 9999-01-01, 9999-12-31 and 1000-01-01; `ExportDaySchema` refuses all four; both refuse a trailing newline. The range check compares strings, which is safe because the pattern has already forced a four-digit year. A 10,000-character input is refused (tested), and the pattern is anchored and linear, so dropping the old `.max(10)` creates no unbounded work. Callers of `IsoDateSchema` in filters, browse, sessions and the browse action are unchanged.

6. src/lib/privacy.ts:729-740. The R2 row now says the dump is hourly (PRD-75) and that the audit export is not switched on, and that no audit export is stored there today. True today. Nit: the `audit_log.actor_id` deletion path (line 233) still says "its nightly export is write-once" as a present fact. The sentence is a design rationale and holds for the keys the port writes, so it is not wrong enough to block; "once switched on" would make it match line 736.

### Non-blocking, carried over and not re-raised
Out of scope per the brief: the R2 adapter, `audit_writer` connection split, statement timeouts, `putOnce` content comparison, the lookback alert. Round 1's other non-blocking items (the design doc 4.2.1 `StoragePort` delta-log entry, the `asOf` pulse test, the `exportContentType` duplicate audit item) were not touched by this diff and stand as logged.

### Unconfirmed
- Whether any third-party error thrown inside a future job handler carries a truthy `permanent` property. None of the four registered kinds' dependencies does today (searched `src`), but the check is duck-typed, so a later unit that adds a client library should be read against it.

Evidence: none relied on beyond the commands above; no UI.
