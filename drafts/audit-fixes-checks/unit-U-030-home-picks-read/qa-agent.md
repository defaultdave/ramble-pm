# QA verdict: U-030 home Picks read (head 0c89b4c8be668a271965c268455392b965a19817)

**PASS** (checks 1 and 2 only; browser render not run)

Ran in a detached scratch worktree of the head SHA, `pnpm install --frozen-lockfile`. Worktree removed afterwards.

## Ran
1. `pnpm vitest run src/lib/pages/home.test.ts src/server/home.test.ts 'src/app/(guest)/HomeContent.test.tsx'`: 3 files, 89 tests passed.
2. Postgres on localhost:5432 was reachable. `pnpm vitest run --project db tests/db/editorial.db.test.ts tests/db/seed.db.test.ts tests/db/home.db.test.ts`: 3 files, 247 tests passed.
   Mutation check: changed `.limit(homeLimits.picksCandidates)` (12) to `.limit(13)` in listHomePicks in src/server/db/editorial.ts. 1 test failed: "the home Picks read when many Picks are published > finds a named pick past the list limit, with the first entries and the full count, and no intro" (246 passed). Reverted with git checkout; worktree clean.

## Not run
3. Dev-server render of `/` and the "See all N" comparison with main: not run. `pnpm dev` started but Turbopack panicked with "unable to start FSEvent stream" (sandbox), same as the earlier QA run. No screenshots.

## Blocking
None.

## Non-blocking
- The 12 limit lives in `picksCandidates` (src/lib/idLookup.ts), so the mutation was applied at the `.limit()` call site; changing the constant would also move other code.
- "See all N" count parity with main is covered only by the DB test (full count past the limit), not by a rendered page.
