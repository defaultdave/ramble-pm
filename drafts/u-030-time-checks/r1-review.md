PASS

## review-agent: U-030 "venue.ts, time.ts, duration.ts" (head f106576)

### Blocking
None.

### Non-blocking
- Audit item (pre-existing, held by the manifest): `src/lib/seed/plan.ts:4` `defaultTimeZone = 'America/New_York'` and `:9,11` (`dayMs`, `isoDate` slice) duplicate `venueTimeZone`, `msPerDay` and `isoDateOf`; `src/lib/sessions.ts:156,206,299,301` repeat the day and minute literals and the ISO slice. Out of scope until U-014a; the plan lists them as follow-up, with `browse.test.ts:107`, `home.test.ts:80` and `seed/coverage.test.ts:173` as Suggestions.
- Audit item: `src/lib/cancellation.ts:7` defines `MS_PER_HOUR`, a third time constant outside `time.ts`; could move to `time.ts` later.
- Near-collision to watch: U-014a adds `src/server/db/time.ts`, same basename as `src/lib/time.ts`.

### Unconfirmed
- The H-63 before and after capture at 320 px for the PR body (not in the diff; `evidence/pr/` not checked).

### What was checked
- Scope: all 27 files in IN SCOPE; `thisWeekWindow`, `browseWindow` and `AsOfSchema` stay in the page modules and import `msPerDay`.
- No-break space written as the escape in `duration.ts`, every expectation, the five lib assertions and the Card, BrowseResults, ExperiencePage and HomeModules stories and fixtures. No literal U+00A0 in the diff; no digit, plain space, "hr" or "min" label left in src, tests or e2e except the doc comment in `duration.ts`.
- `venue.ts`: `venueDate = calendarDateFormat(venueTimeZone)` built once; `venueToday` body unchanged; `venueCity` used by `experiencePage.ts:202`.
- `time.ts`: `minuteAsOf` has the old body and matches `z.iso.datetime()`; `calendarDateFormat` has `dayInZone`'s options and `browseDays` keeps its per-zone Map; `isoDateOf` used in coverage.ts; `msPerDay` replaces `dayMs` (four uses) and in seed.db.test.ts.
- Renames: no `homeAsOf`, `browseAsOf`, `dayInZone` or `MS_PER_*` in src, tests, docs or e2e; no shims; `experiencePage` no longer imports from `./browse`.
- Clock rule clean. Test tables: venue.test.ts all ten cases; duration.test.ts the 8-case superset plus a check that the line breaks only between hours and minutes; time.test.ts covers `minuteAsOf`, `calendarDateFormat`, the constants and `isoDateOf`; the `minuteAsOf` round trip survives in home.test.ts.
- Relative imports inside src/lib.
- Gates run: `vitest run src/lib` 68 files, 2363 tests pass; `tsc --noEmit` clean; `eslint src tests` clean; `knip` clean. Not run: tests/db, Storybook, e2e.
- Defect classes: no unbounded work, no database or Zod gap, no fail-open path, no logging added.
