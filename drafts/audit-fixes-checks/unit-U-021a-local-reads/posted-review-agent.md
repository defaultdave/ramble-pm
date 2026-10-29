Posted on head 1c33ee0; the PM ran every gate on it. No UI change, so no a11y check.

PASS

Reviewed `git diff origin/main...HEAD` at c4cbadc (read-only; I ran no gates, the PM is rerunning them).

## Blocking
None.

## Non-blocking
1. `scripts/dev/neon-http.ts:4` imports from `tests/db/harness.ts`. That module pulls in the drizzle migrator, `node:os` and the fresh-schema helpers just to get one function. It is a dev-only script and never reaches the app bundle (only `scripts/` imports it), so it is acceptable. The shim now has a security role, so a small shared module (for example `scripts/dev/neonHttpShim.ts`, imported by the harness) would stop a test-helper edit from loosening a dev server. Suggest as follow-up.
2. The local-host list is written three times: `src/server/env.ts:38` (`loopbackHosts`), `scripts/dev/neon-http.ts:6` and the regex at `tests/db/harness.ts:140`. They already differ (`::1` in env.ts is dead, since `URL.hostname` yields `[::1]`; the script also allows `postgres`). Reuse-before-writing (A5) nit; a drift would fail closed, not open.
3. The gate is `VERCEL_ENV` only (`env.ts:91`). Vercel `development` and an unset `VERCEL_ENV` on a self-hosted box are accepted. Neither is exploitable, because the host must still be loopback, so the worst case is reads that fail against a localhost with nothing behind it. Adding `NODE_ENV === 'production'` is optional hardening; it would break the documented `pnpm build && pnpm start` local flow, so I do not recommend it.
4. `http://localhost:4444/sql` passes env validation, but the shim binds IPv4 only, so Node may resolve `localhost` to `::1` and fail to connect. The docs steer people to the printed `127.0.0.1` address, so this is a usability edge only.
5. B13 and B17 are not in `~/.claude/standards/architecture.md` (its B-table stops at B8), so I could not check them by name. B2 (decisions in named functions) is not hit: the checks sit in the env schema, not a component or handler. B6 is not hit: the script's `catch` exits non-zero with a fixed message.
6. `scripts/dev/neon-http.ts` uses double quotes while `src/` uses single quotes. `scripts/**` is eslint-ignored (`eslint.config.mjs:66`), so check that prettier accepts it.

## Answers to the review questions
1. Deployed environments:
   - Production and preview: `superRefine` adds an issue (`env.ts:91-97`). `env` throws "Invalid environment variables" at module load, so boot fails loudly and not silently. The test at `env.test.ts` covers both values.
   - Vercel development: accepted, but the host must be loopback, so it cannot redirect reads to an outside host.
   - `VERCEL_ENV` unset: accepted, with the same loopback limit. Because of the host restriction, the worst case for a wrong deployment is a failing read, never a read from or write to a remote host.
   - Vercel production with the var set: the build or boot fails with a fixed message. Zod's refusal does not run `new URL` on an unparsable value (tested with `user:secret-pass@nowhere`).
2. Global `neonConfig`: `createReadDb` sets it once per module instance, and only when the var is set. `writer` and `pg` paths are unaffected, and the driver option is process-wide by design. The harness's `serveNeonHttp` already set it globally before this change. Vitest isolates modules per file; `readOverride.db.test.ts` restores the original value in `afterAll`. Within one file the test sets it by design.
3. Host check: `new URL().hostname` lowercases, so uppercase passes as local. `http://localhost@evil` gives host `evil`, refused. `0.0.0.0`, `[::]`, `localhost.` (trailing dot), `localhost.evil.example` and `10.x` are not in the list, so refused (fail closed). `https` is refused by the protocol filter. `[::1]` is handled. Complete.
4. Shim reachability: it binds 127.0.0.1 (`harness.ts:168`). Any browser POST sends `Origin`, including same-origin and `no-cors`, and is refused with 403 (`harness.ts:152-158`). DNS rebinding changes the `Host` to the attacker's name, which fails `localHostHeader`. A simple cross-origin form POST also carries `Origin`. Closed. Residual risk: local processes without a browser (curl) are trusted, which the docs state.
5. Credentials: the script prints only the hostname and the endpoint (`neon-http.ts:36-37`). Env messages are fixed strings, and two tests assert a password does not leak. The shim returns `error.message` to its local caller on a bad query (`harness.ts:~162`), which is a loopback-only reply and contains no connection string.
6. Comments explain a why and carry no ticket numbers (grep for `U-0` found none in the changed files).
7. `scripts/` importing `tests/` is acceptable as dev tooling, with the caveat in non-blocking 1.

## Evidence
- `src/server/env.ts:57-59` schema field (`http` protocol only); `:89-105` production/preview refusal and loopback check.
- `src/server/db/client.ts:34-39` sets `neonConfig.fetchEndpoint` only when the validated var is set.
- `tests/db/harness.ts:140` host regex; `:152-158` Origin and Host refusal; `:168` loopback bind; `:182-186` `serveNeonHttp` keeps the test behaviour.
- `scripts/dev/neon-http.ts:6-27` refuses a non-local `DATABASE_URL` and a bad port.
- `src/server/env.test.ts` (NEON_HTTP_ENDPOINT block) covers unset, empty, accepted, production/preview, development, non-local hosts and no-leak; `tests/db/readOverride.db.test.ts` covers the read through the override and the 403 for Origin. A Host-header refusal test is missing (non-blocking: add one `fetch` with a forged `Host` via `http.request`).
- Docs updated: README, `.env.example`, `docs/runbooks/seed.md`.
