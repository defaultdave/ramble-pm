PASS

## spec-compliance: U-015 round 3 (head 43ff36d)

### Blocking
- None.

### Non-blocking
- Carried from round 2: `bumpTokenVersion` computes the HMAC on every bump, so bumping an order with no manage hash needs `CAPABILITY_TOKEN_SECRET` (fails closed).
- The "largest separator body" case uses 8,187 elements where 8,188 is the largest accepted (not round 3 scope).

### Unconfirmed
- None.

### Round 3 items at head (scratch copy of 43ff36d)
- The delta touches exactly `src/server/tokens.ts`, `src/server/db/schema/catalog.ts` (orphaned comment removed) and `tests/db/tokens.db.test.ts`; no migration or other file.
- `rehashTokens`: `rehashLimits` runs before the `storesHash` return (kind `order` with invalid limits throws RangeError); the cap is checked only on a non-empty page, after the empty-read return and before the rewrite, so exactly `maxBatches` full pages succeed and the next non-empty page throws with its rows untouched; the unreachable trailing throw is gone.
- Boundary probe (even hashed count, `batchSize: 1`): `maxBatches` equal to the count returns the count; one more hashed row with the same cap throws "batch limit" and leaves that row's hash unchanged; `maxBatches + 1` returns count + 1. With `--maxWorkers=2` alongside `tests/db/tokens.db.test.ts`: 2 files, 43 tests pass.
- The scope line holds.
