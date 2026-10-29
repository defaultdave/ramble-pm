PASS

## architecture-audit: U-030 "venue.ts, time.ts, duration.ts" (head f106576)

Rules: `.claude/standards/architecture.md` (project, with the image-port row), `eslint.config.boundaries.mjs`, `wave3-review-rules.md`. Files audited: the 27 files in `git diff origin/main...HEAD`. Checks run: `eslint` on `src/lib`, `src/app` and `tests/db/seed.db.test.ts` (no errors); `vitest run src/lib`. Not run: `pnpm test:db`, `knip`, typecheck.

### Rules B1 to B17
- B1 pass. No `fetch`, database or SDK use in the new lib files.
- B2 pass. The moved helpers are decisions already in `src/lib`, each with a unit test; none added to a component, the data layer or the app layer.
- B3 pass. `server/**` edits are doc comments only; no `process.env` read added.
- B4 pass. `venue.ts` imports `./time`; `duration.ts` and `time.ts` import nothing; app files import `@/lib/time` and `@/lib/venue`. `coverage.ts` keeps its existing `@/lib/` style (see Non-blocking).
- B5 n/a. `AsOfSchema` stays in `home.ts`, as scoped.
- B6 n/a.
- B7 pass. `venueTimeZone`, `venueCity`, `msPerMinute`, `msPerDay`, `isoDateOf` and `calendarDateFormat` each have a non-test importer or an internal user.
- B8 n/a. B9 n/a. B10 n/a.
- B11 pass. `time.ts` uses only `Intl`; no React, Next or vendor imports in the new files.
- B12 pass. `new Date(cut)` only with an argument; no `Date.now()`; clock rule clean on `src/lib`. The `new Date()` in `BrowseContent` and `HomeContent` is in `src/app`, outside the rule, and keeps its `TODO(U-005)`.
- B13 n/a. B14 n/a (only the `asOf` key producer renamed, identical output). B15 n/a. B16 n/a.
- B17 pass (duplication sweep below).

### Blocking
None.

### Non-blocking
- Duplication sweep: `venueToday`, the day constant, the minute cut, the en-CA formatter and `durationLabel` each have exactly one definition. No `homeAsOf`, `browseAsOf`, `dayInZone` or `MS_PER_*` left in `src`, `tests` or runbooks. Remaining pre-existing copies outside the plan's named exceptions (audit items): `tests/db/seed.db.test.ts:236,239,243` three `toISOString().slice(0, 10)` that `isoDateOf` covers (a missed tidy in an in-scope file); `src/lib/browse.test.ts:69` a `86_400_000` literal; `tests/db/browse.db.test.ts:229` and `:595` ISO slices.
- The plan's named exceptions still hold their literals (`seed/plan.ts:9,11`, `sessions.ts:156,206,299`, `seed/coverage.test.ts:173`, `home.test.ts:74`, `server/home.test.ts:98`). Not duplicates: `cancellation.ts` `MS_PER_HOUR`, and the `60_000` values in `formGuard`, `holdTimer`, `redact`, `db/seed/read.ts`.
- `'New York'` literal search did not run (glob error); incomplete.
- `src/lib/seed/coverage.ts:1-4` use `@/lib/...` rather than `./`; already so on main, and PR G touches that line either way.
- Near-collision: `unit/U-014a` adds `src/server/db/time.ts`, same basename as `src/lib/time.ts`; keep the note in the PR body.
- Held-branch files untouched.
- NBSP written as the escape in `duration.ts`, the fixtures, stories and the five lib assertions; no literal U+00A0 in added lines.

### Unconfirmed
- H-63 before and after capture in the PR body (code-only check).
- `knip` and the full typecheck not run by this check.
