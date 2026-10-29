PASS

## architecture-audit: U-007 "page catch blocks log the error kind through rethrowOrLog" (head caa7545)

Rules: `.claude/standards/architecture.md` (project), `eslint.config.boundaries.mjs`, `wave3-review-rules.md`. All 15 changed files are in the PR E manifest; nothing under src/lib or src/components touched. Static audit (diff read, tree grepped); vitest and eslint not run.

### Blocking
None.

### Rule by rule
- B1 pass. No fetch, database or SDK call outside src/server added.
- B2 pass. No filter, sort, reduce, money arithmetic, parse or display string added; round-1 B2 list: none in the diff. Page catch blocks only choose an error view. The kind extraction at `rethrowOrLog.ts:16` is a logging detail, not a B2 decision.
- B3 pass. `rethrowOrLog.ts:1` has `import 'server-only'`; `browse.ts` keeps it; no new `process.env` read.
- B4 pass. src/app imports src/server; `rethrowOrLog` imports `src/lib/errorDigest`. Consistent with the zones.
- B5 n/a. B6 n/a.
- B7 pass. `rethrowOrLog` has five production callers.
- B8 pass. B9, B10, B12 n/a.
- B11 pass. `unstable_rethrow` is framework code.
- B13 pass. `rethrowOrLog` has no catch; the page catches log and return a named error view (none swallows); `browse.ts` lost its catch for the shared wrapper, which rethrows a kind-only error.
- B14 n/a (cache tags and `cacheLife` unchanged). B15 n/a. B16 n/a.
- B17 pass for the diff (see Non-blocking): browse's private wrapper and `BrowseReadError` deleted for `@/server/cache/readOrRefuse`; browse's inline digest copy replaced by `errorDigest`; four duplicated rethrow-and-log blocks collapse into one helper.

### Questions
1. Placement: `src/server/monitoring/` is right (needs `logger` and `next/navigation`; lib-packages forbids `next/*` in src/lib).
2. B3: `import 'server-only'` at line 1.
3. Zones: src/app may import it.
4. `'unknown'` for a non-Error: a logging detail mirroring `readOrRefuse.ts:28`, not a domain decision.
5. No page catch calls `unstable_rethrow` or `logger.error` inline any more (five sites through the helper). One read-or-refuse wrapper remains (`src/server/cache/readOrRefuse.ts`, six callers). `src/server/cache/remote.ts:18` keeps its inline `unstable_rethrow`: out of scope (not a page catch; it logs then falls back to Postgres, so `rethrowOrLog` is the wrong fit).

### Non-blocking
- `rethrowOrLog.ts:16` and `readOrRefuse.ts:27-28` both compute `error instanceof Error ? error.name : 'unknown'`, a two-copy duplication this PR creates. A shared `errorKind` beside `errorDigest` in `src/lib/errorDigest.ts` would remove it, but src/lib is out of scope for PR E; log it for the later lib PR with the stale sentence at `errorDigest.ts:3-4`.
- `src/server/cache/remote.ts:17-23` logs `error.message` to `console.error`; its own comment says the error can carry connection details. Pre-existing, data-in-logs class; audit item.
- `page.tsx` now logs twice per failed read (metadata and route); documented in `experience.md` and intended (H-51, BE-6).

### Unconfirmed
- The four page tests and `rethrowOrLog.test.ts` not run by this check.
