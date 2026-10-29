PASS

## architecture-audit: U-005 "Jobs outbox, drain route, and the pulse" (head 50b1116)

Full diff against 4714de3 and the pulse workflow at 42d3247, every rule B1 to B16 and A1 to A6. Round 2's four blockers resolved: `claimDueJobs` only applies lib's `partitionClaims`; the stop rule is lib's `claimFoundWork` with `drainMayContinue`; `tallyOutcome` and `tallyClaimBatch` in lib, `lost` in its own bucket, abandoned rows counted as claimed and dead, so `claimed = succeeded + retried + dead + lost + unrecorded`; `runJob` not exported.

### Blocking
- None. No B2 decision left in `src/server/db/jobs.ts`, `src/server/jobs/drain.ts`, or `src/server/pulse.ts` (gates `decidePulse`, clock `chooseClock`, body `parsePulseBody`, purge `purgeMayContinue`, heartbeat `heartbeatDue`). B3: `server-only` on every new server file, `process.env` only in `env.ts`. B7: `enqueue` carries `TODO(U-054): first caller`; `runJob`, `defineJob`, `JobContext`, `IdempotentJobHandler` not exported. B9: one transaction per claim, run, and failure step; `insertJob` takes a `Transaction`. B12: only `systemClock` reads the wall clock. B13: no empty catch. B15: `/api/pulse` listed, secret-checked, rate limited.

### Non-blocking
- Pure mappings: `pulse.ts` result-to-status mapping and the `tokenMatches` fact; `drain.ts:93-95` outcome mapping; `markJobFailed` column choice; `heartbeat.ts:22`; `dueAt` repeats `claimDecision`'s due rule as a candidate filter, pinned by a db test.
- Audit items: `error instanceof Error ? error.name : …` repeated in `drain.ts` (twice), `heartbeat.ts`, and about ten other files (a shared `errorName` helper); `declaredLengthExceeds` lives in the email module; stale `TODO(U-005)` markers elsewhere.

### Unconfirmed
- `run_after` and `created_at` default to `clock_timestamp()`, so a job a handler enqueues during an `asOf` run gets real time (latent until U-054).
