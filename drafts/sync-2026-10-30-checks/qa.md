PASS

## qa-agent: sync 2026-10-30 (head 49afa4e)

Gates on the merged tree, run by the resolver and rerun by the PM where the resolver saw load flakes:
- format:check, lint, typecheck, knip: pass.
- test: 248 files, 6,373 passed (a first run beside a concurrent build failed 7 and passed on a quiet rerun).
- `env -u DATABASE_URL pnpm build`: pass.
- test:db with `--maxWorkers=2`: 35 files, 1,567 passed (two `holds.db.test.ts` cases failed once under load; the file passes alone and on the full rerun).
- db:check pass; db:generate no new file.
- e2e through the lock with `CI=1`: PM rerun 161 passed, no flakes (the resolver's run had 5 flaky, all passing on retry).
- storybook:test: 41 files, 267 passed.
- gitleaks over `origin/integration..HEAD`: no leaks.

No browser pass: the sync changes no behaviour beyond swapping the experience page's error state to main's `PageError`, which passed its own checks into `main` (PR 273).
