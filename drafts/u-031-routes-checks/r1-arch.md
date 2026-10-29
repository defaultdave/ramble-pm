PASS

## architecture-audit: U-031 "routes.ts: one home for every guest address" (head 2c83761)

Rules: `.claude/standards/architecture.md` (project), `eslint.config.boundaries.mjs`, `wave3-review-rules.md`. Files audited: the 19-file diff against origin/main. Gates run by this check: `pnpm lint` (0), `pnpm knip` (0), `pnpm typecheck` (clean), `vitest run src/lib` (65 files, 2357 tests pass).

### Blocking
None.

### Rule by rule
- B1 pass. No fetch, database or SDK call in the diff.
- B2 pass. No new decision in a component or the data layer; `experienceCardPath` (the status check that picks the guide path) is a tested `src/lib` function.
- B3 n/a. No `src/server` files, no `process.env` read.
- B4 pass. `routes.ts` imports only `./catalog`; `filters.ts` imports `./routes` and `routes.ts` does not import `filters.ts`, so no cycle. `catalog.ts` imports only zod. Lint is clean, so the zones hold.
- B5 n/a. B6 n/a.
- B7 pass. Every new `routes.ts` export has a non-test caller; knip is clean.
- B8 pass. No `'use client'` file imports `routes.ts`.
- B9 n/a. B10 n/a.
- B11 pass. No vendor SDK import.
- B12 pass. No `Date`, money or float in the diff.
- B13 pass. No `catch` added or changed in `lib` or `server`.
- B14 n/a. B15 n/a. B16 n/a.
- B17 pass (see the ruling below).
- Advisory: A1 pass; A2 to A6 n/a.

### PM ruling: importing `isSlug` and `EntityIdSchema` from `./catalog`
Breaks no rule as written. Copying the slug and id rule into `routes.ts` is the duplication B17 blocks; B4 and the `import/no-restricted-paths` zones allow `src/lib` to import `src/lib` and zod; the `lib-packages` zone is not hit. The plan's Risks wording ("dependency-free at runtime", naming `filters.ts`) rests on two reasons: the cycle, which does not apply, and the bundle, which applies only in part (`routes.ts` now pulls in `catalog.ts` and zod, not `sessions.ts` or `@internationalized/date`, and every importer is a Server Component or a plain lib file). It would matter if a `'use client'` file imported `routes.ts` later; nothing in this PR does. Record it as a ruling.

### Non-blocking
- `src/lib/browse.ts` still defines and exports `durationLabel`, imported by `experiencePage.ts`, with a second copy in `home.ts`. Pre-existing; PR B's (audit item H-2).
- The builder's Reuse section should name `experiencePath` (home.ts), `experienceAddress` (browse.ts) and `browsePath` (two copies) as the code merged into `routes.ts`.
- `privateSessionPath` carries an `@alias` JSDoc tag beside its descriptive comment. Cosmetic; matches the plan ruling.

### Unconfirmed
- `pnpm storybook:test`, `pnpm build` and e2e not run by this check. Source and unit tests suggest the storybook risk (HomeHero importing filters.ts) and the e2e retry-URL contract (`e2e/experience.spec.ts:51-53`) both hold.
