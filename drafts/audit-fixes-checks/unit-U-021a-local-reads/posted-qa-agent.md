Posted on head 1c33ee0; the PM ran every gate on it. No UI change, so no a11y check.

PASS

## QA: the PM's local run (2026-10-29)
- Setup: the builder's production build (`next start` on 3101), reading through `pnpm db:http` on 127.0.0.1:4444, against the Docker `ramble` database, migrated and seeded with `SEED_TARGET=local`.
- `curl` results:
  - `/`: 200, no error state; it shows "Hand-rolled pasta in Carroll Gardens".
  - `/new-york/browse`: 200, no error state; the cards and their photos render.
  - `/new-york/browse?category=cooking`: 200, no error state; the cards render.
- Database tests: `tests/db/readOverride.db.test.ts` passes inside the full db suite (741 tests) on `1c33ee0`. It covers a read through the override and the 403 for a browser origin.
- Env validation: `src/server/env.test.ts`, 16 cases, passes in the unit suite (3804 tests).
- Not exercised: Firefox or Chrome against the shim (a browser POST carries `Origin`, so the shim refuses it by design), and `next dev`. The sandbox blocks FSEvents, so `pnpm dev` was not run.
