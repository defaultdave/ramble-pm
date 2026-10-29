PASS

## qa-agent: U-019 "Guests, consents, and privacy" (head 42831b8)

### Blocking
None.

### Non-blocking
- None. Data unit, no UI: the evidence is gate output and mutation runs in a scratch copy of 42831b8 (an archive extract; nothing written to the repo or any worktree).

### Gates (42831b8, DATABASE_URL unset except test:db)
format:check pass; lint (`--max-warnings 0`) pass; typecheck pass; test 3999 of 3999 in 176 files; knip pass; build pass; test:db once, 880 of 880 in 15 files (the webhook test did not fail); db:check "Everything's fine"; db:generate "No schema changes", no new file.

### Inventory test mutations (`tests/pii-inventory.test.ts`)
- Unmutated: passes.
- An unclassified column `extraNote: text()` added to `rate_limits`: fails on the `unclassified` list.
- The classified entry `count` for `rate_limits` removed: fails.
- Both reverted: passes.
