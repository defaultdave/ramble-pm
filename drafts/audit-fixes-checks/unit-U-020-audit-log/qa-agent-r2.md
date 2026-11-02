PASS

## qa-agent: U-020 "Audit log" (head d8cded6)

Round 2. Round 1 passed at 6f675e5. Everything ran against a production build (`next build`, `next start`) of a scratch worktree at d8cded6, on port 3217, with a seeded local Postgres database `qa_u020_r2_1101` (migrated, then `db:seed` with 29 probes and no gaps) and the Neon HTTP shim on port 4611. The pulse was called as `POST /api/pulse` with `Authorization: Bearer <PULSE_SECRET>`, the way round 1 called it. Six audit rows were inserted with `recorded_at` three and two days back so that export days were due. A call with no secret got 401.

### Blocking
None.

### Non-blocking
- `STORAGE_PROVIDER=vercel-blob` does need two tokens at startup, contrary to the brief: the app refuses to start without `BLOB_PUBLIC_READ_WRITE_TOKEN` and `BLOB_PRIVATE_READ_WRITE_TOKEN`, and rejects any value not shaped `vercel_blob_rw_<storeId>_...`. I supplied well-formed placeholders (`vercel_blob_rw_qadummystore_notarealsecret` and one for the private store), not real tokens. No SDK call or network call was needed or made: the pulse reached the new check first and returned. The result below is for that placeholder setup, not a real Blob store.
- The warning is logged once per pulse, not once overall. Two pulses gave two identical warning lines. This matches "one warning" per pulse; a pulse every few minutes would repeat it. Not a defect, noted so the owner is not surprised in the logs.

### Unconfirmed
- The privacy wording was not checked on a rendered page, because no page renders `src/lib/privacy.ts` at this head. See "Privacy step" below. The module text itself reads as the brief asks, but that is a read of the data, not a view of a page.
- Vercel Blob against a real store (placeholder tokens only; the fake store is the only one available by design).

### What I tested

1. Fake provider, pulse as round 1 called it. First pulse: HTTP 200, `{"claimed":3,"succeeded":3,"retried":0,"dead":0,...}`. Three `audit-export` jobs queued, one per day (`audit-export:2026-10-30`, `2026-10-31`, `2026-11-01`), all `succeeded`, `attempts` 1, `last_error` null. Server log: three `audit day exported` lines (3 rows, 3 rows, 0 rows). Second pulse: 200, `claimed:0`, the job count stayed at 3, nothing re-queued.
2. `STORAGE_PROVIDER=vercel-blob` (placeholder tokens, see Non-blocking). Two pulses, both HTTP 200 with `claimed:0` and every other count 0. After both, the `jobs` table was empty, so there was no export row in any state, none dead and none done. The server log held the warning `audit export is off: no locked store is configured for this provider` with field `provider: "vercel-blob"`, once per pulse (two lines for two pulses), and no error lines. Audit rows were still in the database (6) and untouched.
3. Scheduler forced to fail, in the scratch copy only (a 3-line `throw` at the top of `scheduleAuditExports` in `src/server/jobs/auditSchedule.ts`, rebuilt, then reverted with `git checkout`; nothing committed, worktree removed). Seeded first: two expired rate-limit rows and one pending `audit-export` job. Pulse 1: HTTP 200, `claimed:1, succeeded:1, purged:2`. So the drain ran (the pending job succeeded) and the rate-limit purge ran (both expired rows gone, 0 left), after the scheduler threw. Second pulse: 200. Log: `audit exports could not be queued` with only `errorName: "QaInjectedSchedulerFailure"`, no message text, no stack, no params. The first attempt at this step failed on my seed insert (the rate-limit key has a shape CHECK); I fixed the key and reran, and the results above are from the rerun. The first attempt's pulse also returned 200.
4. Privacy step: not reachable as described. `/privacy`, `/privacy-policy` and `/data` are 404 ("We can't find that page"). `/legal/privacy`, `/legal/sample` and `/legal/data-inventory` return 200 but show only the placeholder "Legal / Covers PRD-53. / Address value: privacy". `/ops` is also a placeholder. None of the pages contained "Cloudflare R2", "audit export", "not switched on", or "locked bucket". The site footer's Privacy link points at this placeholder. The nearest user-visible page is `/legal/privacy`; I screenshotted that at both widths so the owner can see what a visitor gets today. For the module itself (not rendered): `src/lib/privacy.ts` at d8cded6 no longer contains "locked bucket"; the Cloudflare R2 purpose now says the nightly audit-log export "is meant to live here too, but it is not switched on yet", and the deletion path says "no audit export is stored here today; the audit log itself stays in the database".

### Cleanup
Servers stopped by PID after every command (ports 3217 and 4611 confirmed free). Database `qa_u020_r2_1101` dropped (confirmed absent). Scratch worktree removed and pruned. Nothing pushed, posted, or committed. Chromium ran from a script with `--single-process --no-zygote` and the sandbox on; it exits cleanly after the screenshots (it cannot close a single page, so the script reuses one page). Nothing left running.

### Evidence
Both screenshots show the placeholder page at `/legal/privacy`, not the new wording, because no page renders the privacy module yet.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-020-audit-log/r2-legal-privacy-390.png`: `/legal/privacy` at 390 px wide, placeholder "Legal / Covers PRD-53 / Address value: privacy" with the site footer.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-020-audit-log/r2-legal-privacy-1280.png`: the same page at 1280 px wide.

Timestamps: 20:01 to 20:08 EST on 2026-11-01.
