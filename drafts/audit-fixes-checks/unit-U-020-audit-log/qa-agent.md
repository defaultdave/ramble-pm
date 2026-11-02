PASS

## qa-agent: U-020 "Audit log" (head 6f675e5)

No UI, so no screenshots. Everything below ran against a real Postgres (the local docker-compose server, PostgreSQL 17.11) in two databases of my own, `qa_u020_a_1101` and `qa_u020_b_1101`, both dropped afterwards. My own `initdb` was refused by the sandbox (SysV shared memory), so I used the running compose server through a uniquely named database. No `53300` errors; the shared server held about 8 connections of 100. The scratch worktree `/private/tmp/claude-501/qa-u020` was removed. The `audit_writer` role already existed on the cluster before I started, so I left it; I created and dropped only a helper role `qa_owner`.

### Blocking
None.

### Non-blocking
- The insert-only trigger is bypassed by a superuser who sets `session_replication_role = replica` (I changed a row that way in a rolled-back transaction as the compose superuser `ramble`). A non-superuser owner is refused: `permission denied to set parameter "session_replication_role"`. An owner can also `ALTER TABLE ... DISABLE TRIGGER`, or drop the trigger. Both are inherent to a trigger guard and match the migration comment ("the real guard"). Worth a line in the runbook that the app must connect as a non-superuser role. I did not verify which role Neon's app connection uses (see Unconfirmed).
- `audit_writer` is NOLOGIN and nothing connects as it yet. It is only granted INSERT and SELECT (verified below), so it is inert until connections are split.

### Unconfirmed
- Neon's real owner role was not tested; only the compose superuser and a non-superuser owner I created.
- Vercel Blob adapter against a real store (only the fake store was available by design).

### Evidence (no screenshots: no visible change)
Run output, from a throwaway vitest file `tests/db/qaU020.db.test.ts` in the scratch worktree (removed with it) and from psql scripts against database `qa_u020_a_1101`.

1. Migrations 0020 and 0021 applied to an empty database with psql: type, table, two indexes, function, two triggers, role step, REVOKE and GRANT all succeeded. `\d audit_log` shows the six CHECKs and both triggers (`audit_log_insert_only` BEFORE UPDATE OR DELETE per row, `audit_log_keep_table` BEFORE TRUNCATE per statement). Migrations 0000 to 0021 also applied cleanly through the repo's migrator in the second database.
2. Insert: a user row with details `{"reason_code":"duplicate_charge","amount_cents":1250}` and a system row with default details both accepted (ids 1 and 2).
3. As the table owner, a non-superuser (`qa_owner`) and the superuser: `UPDATE`, `DELETE`, `TRUNCATE`, and `TRUNCATE ... RESTART IDENTITY CASCADE` all refused with `The audit log is insert-only`; the rows were still there afterwards. As `audit_writer`: INSERT and SELECT worked; UPDATE, DELETE, TRUNCATE gave `permission denied for table audit_log`.
4. Database refusals (`audit_log_details_shape` unless noted), each by the database itself with no application code in the path:
   - free text `{"note":"customer said call me later"}`
   - email `{"contact":"jane@example.com"}` and `{"contact":"a@b.co"}`
   - nested object, array value, 1.5, a 101-character string, 17 keys, key `"Bad Key"`, top-level array, string, and JSON null
   - a value with a trailing newline, an embedded newline, and a non-ASCII value (`é`)
   - integer 9007199254740992
   - `audit_log_action_shape`: uppercase and spaces, a single word, and a 65-character action
   - `audit_log_actor_matches_kind`: system with an actor id, user without one
   - `audit_log_subject_kind_shape`: `Order`
   - not-null: a null subject id
5. Boundaries that must pass did pass: 16 keys, a 100-character value, integers of plus and minus 9007199254740991, and a 64-character action.
6. `writeAudit` through the real client: user, guest, and system rows written in one transaction, returned ids 1, 2, 3 and 3 rows stored. A transaction that wrote and then threw left the count at 3. An email in details, free text, a nested object, and a user entry with no actor id each threw and left the count at 3.
7. Empty log: a pulse returned 200 with `claimed: 0`, no `audit-export` job row existed afterwards, and no object was in the fake store.
8. Export: 2,500 rows on a day three days back and 3 rows on a day two days back (rows recorded with past `recorded_at`), then a pulse. Response: `claimed 2, succeeded 2, dead 0, retried 0`. The fake store held `audit/2026-10-30/part-0001.ndjson`, `part-0002.ndjson`, `manifest.ndjson`, and `audit/2026-10-31/part-0001.ndjson`, `manifest.ndjson`. Manifests: `{"day":"2026-10-30","parts":2,"rows":2500,"firstId":5,"lastId":2504}` and `{"day":"2026-10-31","parts":1,"rows":3,"firstId":2505,"lastId":2507}`. The two parts of the big day held 2,500 lines with 2,500 distinct ids. The gap in ids (1 to 3, then 5) comes from my rolled-back write consuming id 4, which is expected.
9. No duplicates: a second pulse returned `claimed 0`, the job count stayed at 2, and every stored object was byte-identical to the first run. A row recorded on the current UTC day was not exported by a third pulse (still `claimed 0`, no manifest for today). Calling the export for the big day again by hand returned the same 2,500-row tally and changed no stored bytes; calling it for today's date threw `not over yet`.
10. The unit's own suites also pass here: `tests/db/audit.db.test.ts` 52 of 52, and `src/lib/audit.test.ts`, `src/server/jobs/*`, `src/server/pulse.test.ts` 150 of 150.

Timestamps: 19:42 to 19:50 EST on 2026-11-01, well inside the 30 minute box.
