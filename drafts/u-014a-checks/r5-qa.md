PASS

## qa-agent: U-014a round 5 (head 70e4f6c)

### Blocking
None.

### The holds race failure is not a deadlock
- SQLSTATE `23514` (check violation), captured by adding `cause.code`, `cause.message`, `cause.detail` to the test's report in a scratch copy: `update "holds" set status=released, released_reason=guest_left, updated_at=$3 where id=$4` violates `holds_updated_not_before_created`; the row had `created_at` 20:19:44.825 and `updated_at` 20:19:44.824.
- Cause: a clock mix in the test fixture. `insertHold` in `tests/db/holdFixtures.ts` stamps `created_at` from the host's `new Date()`; `releaseHold` stamps `updated_at` from `readDatabaseTime` (the Postgres clock, correct for the product). The Docker Postgres clock is offset from the host by about 20 ms (18 to 21 ms measured). Production writes both from the database clock.
- No `40P01` in any run; no wrong sold-plus-held count.
- Frequency: 2 of 6 full `pnpm test:db` runs, each at the same test (the builder saw 2 of 5).
- Not introduced by a merge: `holds.ts` differs from `6502a1d` only in the `Transaction` import, `time.ts` by 2 lines, the fixture identical; the same race exists at round 3.
- Fix (non-blocking): `insertHold` takes `created_at` from the database clock, or the test passes a `createdAt` earlier than the database time.

### Environment flake: `53300` too many connections
4 looped copies of the file plus a full `pnpm test:db` produced 433 `53300` errors across unrelated tests: shared-Postgres capacity. A single file or a single full run alone is normally clean apart from the `23514` race.

### Gates (scratch copy of 70e4f6c)
test 4355 of 4355; db:check clean; db:generate "No schema changes" (0011_holds latest); knip, typecheck, lint clean; build exit 0; pii-inventory 1 of 1; test:db on the unpatched head 971 of 973 (the one race test from this cause plus load flakes). e2e not run (db-layer change only).

### Non-blocking
- The `holds-races` test prints only "Failed query"; it should include `cause.code` and `cause.message`.
