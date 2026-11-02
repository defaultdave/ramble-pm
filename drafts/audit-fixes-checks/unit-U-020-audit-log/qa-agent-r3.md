PASS

## qa-agent: U-020 "Audit log" (head 4b39c96)

Round 3. Round 2 passed at d8cded6. The delta makes the app's default `fake` provider refuse the audit export, so this round repeats round 2's pulse setup on `fake` and re-checks `vercel-blob`. Everything ran against a production build (`next build`, `next start`) of a scratch worktree detached at 4b39c96, on port 3317, with a seeded local Postgres database `qa_u020_r3_1101` (migrated, then `db:seed`: 29 probes checked, no gaps) and the Neon HTTP shim on port 4711 (`NEON_HTTP_ENDPOINT=http://127.0.0.1:4711/sql`). The pulse was called as `POST /api/pulse` with `Authorization: Bearer <PULSE_SECRET>`, the way rounds 1 and 2 called it. A call with no secret got 401. `STORAGE_PROVIDER` was left unset for the default run, so the provider was the app's default `fake`.

This unit is backend only (a scheduled job and a log line, no page or screen), so no screenshots are owed and none were taken. The evidence is the HTTP status, the response body, the `jobs` table, and the server log, quoted below.

### Blocking
None.

### Non-blocking
- The warning is logged once per pulse, not once overall, on both providers. Two pulses gave two identical warning lines each time. A pulse every few minutes on a deployment with audit rows would repeat it. Same as round 2; not a defect, noted so the owner is not surprised in the logs.
- `vercel-blob` still needs two startup tokens, as in round 2. I supplied well-formed placeholders (`vercel_blob_rw_qadummystore_notarealsecret` and one for the private store), not real tokens. No SDK call or network call was made.

### Unconfirmed
- Vercel Blob against a real store (placeholder tokens only). The pulse returns at the new check before any store call, so the placeholder setup does exercise the path, but it is not a live store.
- My "dead or done" count query failed on the `jobs.status` enum, which has no value named `done` (error: `invalid input value for enum job_status: "done"`). It does not matter for the result, because I also counted every row in `jobs` and the table held 0 rows, so no job existed in any state. I did not look up the real enum names.

### What I tested

1. Default `fake` provider, no audit rows (0 rows in `audit_log`, 0 in `jobs`). Two pulses: both HTTP 200, body `{"claimed":0,"succeeded":0,"retried":0,"dead":0,"lost":0,"unrecorded":0,"left":0,"purged":0,"holdsReleased":0,"holdsScrubbed":0}`. `jobs` stayed empty. The server log held 0 occurrences of `audit export is off` and no warn or error lines of any kind.
2. Default `fake` provider, audit rows present and days due. I inserted six `audit_log` rows with `recorded_at` three and two days back (earliest 2026-10-30), so export days were due. Two pulses: both HTTP 200 with `claimed:0` and every other count 0 (`dead:0`, `succeeded:0`, `retried:0`). The `jobs` table had 0 rows afterward, so nothing was queued and no job was dead or done. The server log held the warning twice, once per pulse: `{"level":"warn","message":"audit export is off: no locked store is configured for this provider","fields":{"provider":"fake"}}`. The six audit rows were still in the database, untouched. In round 2 the same setup on `fake` queued three `audit-export` jobs and exported them; that no longer happens, which is the intended change.
3. `STORAGE_PROVIDER=vercel-blob` (placeholder tokens), same six rows. Two pulses: both HTTP 200, `claimed:0`, every other count 0. `jobs` had 0 rows afterward (none queued, none dead, none done). The log held the same warning twice with `"provider":"vercel-blob"`, and no error or exception lines. This matches round 2's result for `vercel-blob`.

### Cleanup
The app and the shim were each started and stopped by PID inside one command (a trap kills both on exit); ports 3317 and 4711 confirmed free afterward. Database `qa_u020_r3_1101` dropped (confirmed absent from `pg_database`). Scratch worktree removed and pruned. My run script deleted. Nothing pushed, posted, or committed. No file in the repo was changed (the worktree was clean at 4b39c96). Nothing left running.

### Evidence
No screenshots or files: backend only. The evidence is the console output quoted in "What I tested".

Timestamps: 20:10 to 20:20 EST on 2026-11-01.
