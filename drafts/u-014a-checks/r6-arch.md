PASS

## architecture-audit: U-014a round 6 (head 26a0737)

### Blocking
None.

### Non-blocking
- Round 5 holds. The round 6 delta adds no source logic: `tests/db/holdFixtures.ts` and `tests/db/holds-races.db.test.ts` (014c352) are tests only (B11 allows the harness imports); `describeFailure` is test-local.
- Merge 26a0737 kept integration's content on both sides: `src/lib/pricing.ts` differs from integration only by two removed `TODO(U-014a)` lines, now stale because `reserveSpaces` calls `taxRatePpm` and `lines`; `src/lib/privacy.ts` is the union of the holds entries and U-015's orders entries; `schema/index.ts` exports `./holds`; the journal ends 0011, 0012, 0013 (`0013_holds`).
- `0013_holds.sql` uses `timestamp with time zone` throughout (B12); its CHECKs hold the 64-hex digest shape and the quantity and price bounds `src/lib/holds.ts` enforces.
- `src/lib/holds.ts` imports only zod and lib modules (B4); `src/server/db/holds.ts` is `server-only` and takes its lock order from `locks.ts`; the lock-order comment intact.
- No `Date.now()`, argument-less `new Date()`, `fetch(`, `process.env`, empty catch, `toFixed` or inline style in the added lines.

### Unconfirmed
- None.
