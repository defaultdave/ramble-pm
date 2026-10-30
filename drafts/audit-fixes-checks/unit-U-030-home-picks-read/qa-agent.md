# QA round 2: U-030 home Picks read (b80cd3f)

Verdict: PASS (with one non-blocking test gap)

## What ran (detached scratch worktree, frozen install)
1. Unit: home.test.ts, server/home.test.ts, (guest)/HomeContent.test.tsx, lib/editorial.test.ts: 4 files, 177 tests passed.
2. DB (localhost:5432 reachable): editorial.db, seed.db, home.db: 3 files, 247 passed. git grep found editorial.db and seed.db as the only db tests naming the shared readers; also ran editorial-races.db: 18 passed. Combined 265 passed.
3. Mutations (each reverted, tree clean after):
   - Entry cap +1 for home variant: unit 177 pass; db 1 failed ("finds a named pick past the list limit... no intro"). Caught.
   - Forgot forGuest filter dropped (undefined): db 3 failed (guest-visible entries/count, empty pick, paused entry). Caught.
   - `intro:false` changed to `intro:true`: unit 177 pass, db 265 pass. NOT CAUGHT.
4. Dev-server render: not run. Worktree has only .env.example (no env), and a start attempt on port 3946 returned no response (sandbox nice() failure; `timeout` absent). No browser check done.

## Blocking
None.

## Non-blocking
- Mutation survived: nothing fails if the home read selects the intro. Output is mapped field by field into HomePick, so the extra column is dropped and the "no intro" test title cannot observe it. The guarantee that the intro is not read is untested; a test would need to inspect the query/columns (or the raw rows from readCollectionRows).
- Worktree removed with `git worktree remove --force`.
