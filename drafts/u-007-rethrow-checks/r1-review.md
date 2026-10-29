PASS

## review-agent: U-007 "page catch blocks log the error kind through rethrowOrLog" (head caa7545)

Scope: exactly the 15 files in the PR E manifest (2 new, 13 edited); nothing under src/lib or src/components; heartbeat and Sentry untouched. Ran vitest on `src/server/browse.test.ts`, `src/server/monitoring` and `src/app`: 12 files, 101 tests pass. `tsc --noEmit` gave only sandbox certificate noise (inconclusive).

### Blocking
None.

### Focus checks
1. Data in logs: the logged object is exactly `{ digest: errorDigest(error), kind: error instanceof Error ? error.name : 'unknown' }` (`src/server/monitoring/rethrowOrLog.ts:15-18`). The field is `kind`, never `name`; no message, query or params reach the logger. The helper's test covers TypeError, RangeError, an error whose message holds a query and `secret-slug`, and a thrown string, null, undefined and `{ name: 'Sneaky' }` (all `'unknown'`). `digest` comes through `errorDigest` (undefined for a non-string digest), replacing browse's inline `String(error.digest)` (BE-10).
2. `unstable_rethrow` is the first statement (`rethrowOrLog.ts:14`). Home, browse, banner, the experience route and `generateMetadata` all go through the helper; no `unstable_rethrow` or `logger.` call left in non-test src/app. The helper's test calls real `notFound()` and confirms it is rethrown and nothing logged; the page tests' control-flow rethrow cases still pass.
3. Browse reads: `BrowseReadError` and the private wrapper deleted; reads call `readOrRefuse('Browse' | 'Browse dates' | 'Filter options', ...)` (`src/server/browse.ts:22,41,54`); thrown error is `CachedReadError` with `${read} read failed: ${kind}`; browse.test.ts asserts the name, each message, and that `secret-slug` and `Phobos` are absent. No `BrowseReadError` left in src, docs, e2e or tests.
4. `generateMetadata` logs once with 'The experience head could not be read' (`page.tsx:29`); the old "logs nothing" test is inverted to `toHaveBeenCalledExactlyOnceWith(..., { digest: undefined, kind: 'Error' })` plus a no-leak check.
5. The helper imports only `logger`, `errorDigest`, `unstable_rethrow` and `server-only`, and calls only `logger.error`; the page tests' `{ logger: { error } }` mocks still intercept it.
6. Runbooks: experience.md says a failed read logs twice per request (head and page) and names `digest` and `kind`; browse.md names `CachedReadError`, the three reads and `rethrowOrLog`; home.md updated in three places.

### Non-blocking
- `kind` also means the alert kind in `src/server/monitoring/alerts.ts:29,39` (accepted by the spec); the PR body must say page logs now carry `kind` for the error name, for saved Axiom searches.
- Audit item: `src/lib/errorDigest.ts:3-4` still describes the old behaviour; out of scope, for a later lib PR.
- Reuse: no new duplication; three copies of rethrow-and-log and browse's private wrapper removed.

### Unconfirmed
- Lint, knip, e2e not run by this check; tsc inconclusive.
