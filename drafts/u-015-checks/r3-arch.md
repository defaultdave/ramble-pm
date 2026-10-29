PASS

## architecture-audit: U-015 round 3 (head 43ff36d)

### Round 3 delta (1d6f86c to 43ff36d)
- `rehashTokens`: the cap is loop control in the data layer, not a listed B2 trigger; round 3 only moves the check to count non-empty pages. Advisory: the cap rule (`pages > maxBatches`) could join `rehashLimits` and `storesHash` in `src/lib/` with a unit test.
- `rehashLimits` now runs before the `storesHash` early return (validation only).
- The unreachable trailing throw removed; `if (!last) return rewritten;` is a return.
- `src/server/db/schema/catalog.ts`: a comment removed only.
- `tests/db/tokens.db.test.ts`: new tests use the existing harness and raw `sql` (B11 allows test support); no new exports.

### Blocking
None.

### Rules at head
B2 (loop control non-blocking; round 2's lib moves in place), B7 (no new export; TODOs intact), B13 (the only catch rethrows with cause); B1, B3 to B6, B8 to B12, B14 to B16 unchanged. The round 2 PASS holds at 43ff36d.
