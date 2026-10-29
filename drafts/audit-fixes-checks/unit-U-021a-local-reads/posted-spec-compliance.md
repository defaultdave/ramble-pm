Posted on head 1c33ee0; the PM ran every gate on it. No UI change, so no a11y check.

PASS

# Spec compliance: unit/U-021a-local-reads

Worktree: `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-ab429973bcb1fe264`, HEAD `1c33ee0` (builder `c4cbadc` plus a merge of main).
Spec: audit rows H-40 (`audits/home-2026-10-28.md`) and BE-19 (`audits/browse-experience-2026-10-28.md`).
Diff: `git diff origin/main...HEAD` (10 files, +268 / -15).

## Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Local build reads Docker Postgres through the Neon HTTP driver, via an env-validated override | PASS | `src/server/env.ts:59` (`NEON_HTTP_ENDPOINT: optional(z.url({ protocol: /^http$/ }))`); `src/server/db/client.ts:36-39` sets `neonConfig.fetchEndpoint` from env and still returns `drizzleHttp(neon(...))`, so the driver is unchanged |
| 2 | Refused in production and preview; refused for a non-local host | PASS | Production/preview: `src/server/env.ts:92-98` (`VERCEL_ENV` production or preview). Non-local host: `src/server/env.ts:38` (`loopbackHosts`) and `:99-105`. Tests: `src/server/env.test.ts:521-599` (prod and preview cases, non-local cases). `npx vitest run src/server/env.test.ts`: 91 passed |
| 3 | Documented dev command starts the shim, reusing the harness shim, not copied | PASS | `package.json:33` (`"db:http": "bun scripts/dev/neon-http.ts"`); `scripts/dev/neon-http.ts:4` imports `startNeonHttpShim` from `../../tests/db/harness`; the shim is defined once at `tests/db/harness.ts:148`, and `serveNeonHttp` (`tests/db/harness.ts:189`) now wraps it |
| 4 | Tests cover env validation and a read through the override | PASS | Env validation: `src/server/env.test.ts:521-599`. Read through override: `tests/db/readOverride.db.test.ts:27-39` (asserts rows from `current_schema()` and `neonConfig.fetchEndpoint === shim.endpoint`). Origin refusal: `tests/db/readOverride.db.test.ts:41-50`. The db test needs Postgres and was not executed in this check (PM reports the local render) |
| 5 | README, `.env.example` (template only, no real values) and a runbook describe the steps | PASS | `README.md:115-123` (setup steps, `pnpm db:http`); `.env.example:14-18` (commented placeholder `# NEON_HTTP_ENDPOINT=http://127.0.0.1:4444/sql`, no credentials); `docs/runbooks/seed.md:19-34` (section "Reading the seeded data in a local app") |
| 6 | Pooled writer, schema, UI, Vercel config and protected paths untouched | PASS | `git diff --name-only origin/main...HEAD` lists only the 10 files above. None match `.github/`, `.claude/`, `CLAUDE.md`, `scripts/merge-desk/`, `docs/adr/`, `docs/plan/`, `vercel.json`, `src/app/`, `src/components/`, `src/server/db/schema`, `drizzle/`. `createPooledDb` (`src/server/db/client.ts:17-26`) and `export const db` (`:66`) are unchanged. `tests/db/harness.ts` is modified, which AC 3 requires; it is not a protected path |
| 7 | A credential is never logged | PASS | `src/server/env.ts:91` (comment: messages never repeat the value); the new messages (`env.ts:92-104`) are fixed strings. `src/server/env.test.ts` asserts the value `secret-pass` is absent from the thrown error (the two credential cases in the block). `scripts/dev/neon-http.ts` logs only fixed strings and the hostname (`:6-30`), and prints the endpoint, which carries no credentials (`:36-37`). `DATABASE_URL` is never printed |

## Blocking

None.

## Non-blocking

- **Doc and code mismatch, `pnpm db:http` host list.** `docs/runbooks/seed.md:33` says the script refuses a `DATABASE_URL` "that is not on this machine". `scripts/dev/neon-http.ts:6` also accepts the host `postgres` (the docker-compose service name, which resolves to another container). Either drop `postgres` from the list or reword the runbook.
- **Two copies of the local-host list.** `src/server/env.ts:38` (`localhost`, `127.0.0.1`, `[::1]`, `::1`) and `scripts/dev/neon-http.ts:6` (`localhost`, `127.0.0.1`, `[::1]`, `postgres`) differ. Consider sharing one list or a comment that links them.
- **Production refusal keys on `VERCEL_ENV` only.** `src/server/env.ts:92`. A self-hosted `NODE_ENV=production` run with a loopback endpoint is not refused. The loopback check still keeps it local, so this matches the spec's "production and preview" only on Vercel. Note it in the runbook if that matters.
- **Shared harness behavior change.** `tests/db/harness.ts:152-160` now refuses requests with an `Origin` header or a non-local `Host` for every test that uses `serveNeonHttp`, not just the dev script. Node's Neon driver sends neither, so CI should be unaffected, but the db suite was not run here.
- **DB test not run here.** `tests/db/readOverride.db.test.ts` needs `DATABASE_URL_UNPOOLED`. Run `pnpm test:db` (or the CI db job) before merge.

---
<sub>spec-compliance | haiku | read-only</sub>
