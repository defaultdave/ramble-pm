PASS

## review-agent: U-014a round 5 (head 70e4f6c)

### Blocking
None.

### Merge resolutions (confirmed against the head)
- Migrations: `0011_holds.sql` has the same md5 as the old `0010_holds.sql` and `0009_holds.sql` (3bee9e5a...); journal idx 11 after integration's 0009 and 0010; `0011_snapshot.json` prevId is integration's 0010 id; db:generate "No schema changes".
- `Transaction` at `src/server/db/client.ts:70`; `locks.ts`, `settings.ts`, `time.ts`, `holds.ts` import it; the lock-order comment and the three lockers as in round 3.
- `schema/index.ts` exports `./holds`, `./people`, `./jobs`; `rateLimits.ts` keeps `pulse`, `pulse_failed` and adds `sha256HexDigits`; the key pattern string unchanged.
- `privacy.ts`: `holds.device_key`, `holds.ip_hash` identifiers; the rest non-personal; pii-inventory passes.
- Nothing U-019 or U-045b brought touches the locks, the transaction type, the rate-limit surface or the holds tests' migrations. Round 3 stands.

### The holds-races failure
- SQLSTATE 23514 on `holds_updated_not_before_created`, not 40P01; every failing row has `updated_at` 1 ms before `created_at`.
- Cause: `tests/db/holdFixtures.ts:132-144` stamps `created_at` and `updated_at` from the test process's `new Date()`; the release stamps `updated_at` from the database clock (floored to the ms); Docker Postgres lags Node by about 0.5 to 1 ms. Production `reserveSpaces` stamps both from the same database clock (`src/server/db/holds.ts:177-178`).
- No 40P01 and no wrong count in any run. 53300 "too many clients" under load (about 235) is the environment.
- Evidence: head under heavy load, 18 runs: 4 passed, 5 failed with 23514, the rest 53300 only. Round 3 (`6502a1d`) under 3 concurrent loops: 15 of 18 failed with the same 23514: not introduced by a merge.

### Non-blocking
- Flaky test: fix `tests/db/holdFixtures.ts:132-133` (database clock, or a default a few ms in the past).
- `tests/db/holds-races.db.test.ts:459-462` reports only "Failed query"; include `cause.code` and `cause.message`.
- Carried from round 3: BotID standards gap, `readOpenHeldSeats` and B6, inline sha256, the 20-candidate cap, U-014b on `ip_hash`.

### Unconfirmed
- e2e, build, knip, unit not rerun; BotID soft navigation still needs a preview.
