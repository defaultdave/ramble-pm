PASS (with the browser check not run)

PR 284, head d5754cc8db5789cb08f6438c4a6528576248b3da, base main 15c6130. Tested in a scratch detached worktree (`pnpm install --frozen-lockfile`), removed afterward.

## Ran
1. Unit: `pnpm vitest run src/lib/idLookup.test.ts src/lib/pages/home.test.ts src/lib/photoViews.test.ts src/lib/photos.test.ts src/lib/experienceCards.test.ts src/server/coverPhotos.test.ts` -> 6 files, 196 tests, all passed.
2. DB: localhost:5432 was reachable. `pnpm vitest run --project db tests/db/home.db.test.ts tests/db/photos.db.test.ts tests/db/browse.db.test.ts` -> 3 files, 150 tests, all passed. (The src/server/db/* globs in the request do not exist; these are the db tests that cover home, cover photos and browse reads.)

## Not run
3. Dev server render of / and /new-york/browse: `PORT=3457 pnpm dev` crashed on start with "Turbopack: unable to start FSEvent stream" (the sandbox blocks the file watcher). The worktree also has no .env, only .env.example, and I did not look for or guess credentials. No pages were loaded and no screenshots were taken, so cover-photo rendering is unverified in a browser.

## Blocking
None.

## Non-blocking
- Browser check above is not run; the change is lib-only with no UI change intended, and the db tests for home/photos/browse reads pass.
