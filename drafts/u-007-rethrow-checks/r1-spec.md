PASS

## spec-compliance: U-007 "page catch blocks log the error kind through rethrowOrLog" (head caa7545)

### Blocking
None.

### Non-blocking
- `src/server/monitoring/rethrowOrLog.ts:17`: `kind` is `error instanceof Error ? error.name : 'unknown'`, not the literal `error.name` in the Moves row. The guard is needed (the literal would throw on null or undefined) and matches `src/server/cache/readOrRefuse.ts:28`; the ruling (kind always logged, no branch on digest) holds.
- `src/server/browse.test.ts:85`: message stays `Browse read failed: Error`, correct since that case's read name is `Browse`, though the spec row lists `:85` among lines that change.

### Unconfirmed
- Held branch `unit/U-014a`: no ref in this worktree, so its "no overlap" claim could not be checked. No overlap with `origin/unit/U-005`.
- No evidence required (no visible change).

### Per-criterion
Scope (1-3) PASS: exactly the 15 IN SCOPE files; nothing in src/lib, src/components or heartbeat; no H-50, H-53 or Sentry capture.
Moves (4-11) PASS: `rethrowOrLog` at `rethrowOrLog.ts:13-19` (rethrow at :14, then `logger.error` with `{ digest, kind }`); imports `logger` from `@/server/monitoring/logger`, calls only `logger.error`; browse's private wrapper deleted, three reads use the shared `readOrRefuse` as `'Browse'`, `'Browse dates'`, `'Filter options'` (`browse.ts:22,41,54`); `BrowseReadError` gone (no reference in src, docs, tests); BrowseContent's inline digest copy removed; five page sites use the helper (`HomeContent.tsx:31`, `BrowseContent.tsx:44`, `GuestBanner.tsx:19`, `page.tsx:51` route and `:29` `generateMetadata`); no `unstable_rethrow` left in src/app pages.
Call sites (12-25) PASS: browse.ts imports and deletions; browse.test.ts header, `CachedReadError`, per-read messages; HomeContent, BrowseContent, GuestBanner, page.tsx catches and their "only the digest" comments; the four page tests' headers, titles and `kind` expectations, GuestBanner's new no-digest case, page.test.tsx's inverted metadata test; runbooks `browse.md:45`, `home.md:46,52,56`, `experience.md:42`.
PM rulings (26-29) PASS. Risks (30-34) PASS: field is `kind`; no `logger.warn` or `captureException`; twice-per-request logging documented; `CachedReadError` in the browse runbook; no overlap with U-005. 35 process items N/A. 36 evidence N/A.
