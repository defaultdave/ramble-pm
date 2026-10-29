PASS

## qa-agent: U-014a round 6 (head 26a0737)

### Blocking
None.

### Verified (scratch copy of 26a0737)
- `tests/db/holds-races.db.test.ts` with `--project db --maxWorkers=2`, 20 runs in sequence: 20 of 20, 12 of 12 tests each; no 23514, 40P01 or 53300.
- Full db suite with `--maxWorkers=2`: 20 of 20 files, 1212 of 1212 tests; no 23514, 40P01 or 53300.
- `pnpm test` 4672 of 4672; typecheck, lint, knip exit 0; db:check "Everything's fine"; db:generate "No schema changes"; migrations end `0011_orders_and_payments`, `0012_blank_text_checks`, `0013_holds`.

### Fixture fix by mutation
- Reverting `insertHold` to the host clock alone did not reproduce the race here: Postgres was about 25 ms ahead of the host this time (round 5 measured the opposite), so a host-clock row is always older than the later database write.
- Host clock plus 100 ms for `createdAt` and `updatedAt`: 3 of 3 runs failed 7 of 12 tests with 23514 on `holds_updated_not_before_created` (the round 5 signature); `describeFailure` printed the code and constraint.
- With the shipped fixture (database `now()`), 20 of 20: the fix holds regardless of clock skew.

### Non-blocking
- A host-clock fixture would be flaky again whenever the host runs ahead of the database; the shipped database-clock fixture is not affected.
