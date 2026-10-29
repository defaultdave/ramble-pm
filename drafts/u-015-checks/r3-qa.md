PASS

## qa-agent: U-015 round 3 (head 43ff36d)

Scratch copy of 43ff36d (`git archive`, `pnpm install --frozen-lockfile`) in a fresh directory; nothing written to the repo or any worktree.

### Blocking
None.

### Gates
format:check, lint, typecheck, knip pass; unit 4514 in 193 files; build pass with DATABASE_URL unset; full db suite once with `--maxWorkers=2`: 1119 in 18 files, no "too many clients"; db:check "Everything's fine"; db:generate "No schema changes".

### Round 3 scope
The delta touches only `src/server/tokens.ts`, the orphaned comment in `src/server/db/schema/catalog.ts`, and `tests/db/tokens.db.test.ts`: `rehashLimits` validated before the `storesHash` return; the cap counts only pages that returned rows, the terminating empty read free; the unreachable trailing throw gone; no migration changes.

### Mutation check
Restored the old counting (`pages < maxBatches` loop with the trailing throw, no in-loop cap check) in the scratch copy: "succeeds when the full pages are exactly the batch limit, and throws on one page more" failed; the other 20 tokens tests passed. Discarded.

### Non-blocking
- Terminal-status changes not guarded in the database (ruled for U-047a and U-049).
