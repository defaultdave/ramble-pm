PASS

## architecture-audit: U-030 "page modules move to src/lib/pages and a lint zone keeps shared modules off them" (head 4ebf014)

### Blocking
- None.

### Non-blocking
- `.claude/standards/architecture.md:80` (B17) still cites `src/lib/home.ts`, `browse.ts`, `experiencePage.ts`; should read `src/lib/pages/`. Owner edit, out of scope.
- `.claude/standards/architecture.md` does not describe the new pages zone (no `src/lib/pages` node in the import diagram or "Imports point one way"). Owner may add one line next to ARCH-7. Not a violation.
- audit item: `splitPage` (`src/lib/pages/browse.ts:74`) is a generic cursor-pagination helper in a page module, used by `src/server/db/browse.ts:228`. Moved, not added, so not blocking under B17; candidate for a shared module.
- audit item: `browseDays`, `nextBrowseDay`, `resultsSummary` are calendar and label helpers in `src/lib/pages/browse.ts`. Pre-existing; same B17 question if another page needs them.

### Unconfirmed
- None.

### Checks run
- Zone: `eslint --print-config src/lib/catalog.ts` shows the existing `ramble/boundaries/layers` zones unchanged plus the new zone (targets `./src/lib/!(*.test).{ts,tsx}` and `./src/lib/!(pages|seed)/**/!(*.test).{ts,tsx}`), inside the existing `zones` array.
- `vitest run tests/lint-pages-zone.test.ts tests/lint-boundaries.test.ts`: 75 passed.
- No shared (non-pages, non-seed, non-test) `src/lib` module imports a page module on head; hits are three tests (exempt) and `seed/coverage.ts` (exempt).
- No stale `@/lib/home|browse|experiencePage|siteNav` import in src or tests; runbooks updated.
- Moved files differ only in import paths; 8 renames in `git diff -M --summary`.
- H-96 consistent with the standard: the seed imports page constants rather than copying them; the exemption narrows the new zone and leaves the `src/lib` guard intact.
- H-85: one address type (`ExperienceAddress`, `src/lib/routes.ts:35`). H-86: the four deleted assertions are rows of `literal addresses`. No `managePath` lines added.
- New duplication: none.
