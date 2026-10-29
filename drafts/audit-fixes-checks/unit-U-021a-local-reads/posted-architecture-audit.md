Posted on head 1c33ee0; the PM ran every gate on it. No UI change, so no a11y check.

PASS

# Architecture audit: unit/U-021a-local-reads

Worktree: `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-ab429973bcb1fe264`, HEAD `1c33ee0`.
Diff: `git diff origin/main...HEAD`.

## Questions

**1. Does the env rule belong in `src/server/env.ts`?** Yes. `README.md` states that environment variables are read and validated in one place, `src/server/env.ts`. The rule is a `NEON_HTTP_ENDPOINT` field (`env.ts:59`) plus a `superRefine` (`env.ts:89-106`) that follows the existing `emailSettingIssues` and `storageSettingIssues` pattern. The deployment check uses `VERCEL_ENV`, which the file already reads. Nothing outside `env.ts` decides whether the override is allowed; `client.ts` only applies a value that env has already approved.

**2. Is the global `neonConfig` mutation acceptable at this layer?** Yes, with the caveats below.
- The driver offers no per-call option. `node_modules/@neondatabase/serverless/index.d.ts:832` types `fetchEndpoint` as `NeonConfigGlobalOnly`, so assigning `neonConfig.fetchEndpoint` is the only route.
- The assignment is in `createReadDb` (`src/server/db/client.ts:33-40`), runs only when `NEON_HTTP_ENDPOINT` is set, and runs lazily on first `dbRead` use. The pooled writer is not affected.
- `neon(` has one consumer in `src`, so no other code path is redirected.
- Caveats: the setting is process-wide, so any future `neon()` call in the same process inherits it. The comment at `client.ts:34-35` says the driver reads process-wide config, which covers this. If a second HTTP consumer appears, it should be documented in the same place.

**3. Does `scripts/` importing `tests/db/harness.ts` cross a boundary?** No lint boundary is crossed. `eslint.config.mjs:66` excludes `scripts/**`, and the layer zones in `eslint.config.boundaries.mjs` cover `src/` only. Conceptually, a dev command now depends on test code. The harness imports only Node built-ins, `drizzle-orm`, `pg` and `@neondatabase/serverless`, with no `vitest`, so it runs under `bun`. AC 3 asks for this reuse, so the dependency is accepted.
- Follow-up (non-blocking): move `startNeonHttpShim` into a neutral, non-test module (for example `scripts/lib/`) that both `tests/db/harness.ts` and `scripts/dev/neon-http.ts` import. That removes the dev tool's dependency on a test file.

## Other notes (non-blocking)
- The local-host list exists twice, `src/server/env.ts:38` and `scripts/dev/neon-http.ts:6`, and they differ (`postgres` appears only in the script). See the spec report.
- `src/server/db/client.ts` is inside the vendor wrapper folder `src/server/db`, so importing `@neondatabase/serverless` there is allowed (`eslint.config.boundaries.mjs`).

## Blocking
None.

---
<sub>architecture-audit | haiku | read-only</sub>
