PASS

## spec-compliance: U-030 "venue.ts, time.ts, duration.ts" (head f106576)

Checked against the "PR B" section of `drafts/lib-layout-refactor.md` in ramble-pm. Diff `origin/main...HEAD` (27 files). Read-only.

### Blocking
None.

### Non-blocking
- src/lib/venue.ts:3: `venueTimeZone` keeps its const and value, but the doc comment is reworded ("on a guest page" instead of "on the home page" or "on a browse page"). The Moves row asks for the same doc comment; same substance, wording deviation only.
- Scope manifest: all 27 changed files are in IN SCOPE; nothing in OUT OF SCOPE is touched.

### Unconfirmed
- H-63 evidence (before and after at 320 px): not in the diff, and no `evidence/pr/unit-U-030-time/` folder yet.
- "Merge main before push and rerun every gate": not verifiable from the diff.
- Held branches: no overlap with `unit/U-005-pulse-workflow` or `unit/U-014a`.

### Per-criterion
Moves table: `venueTimeZone` (venue.ts:4) PASS; `venueDate` built once (venue.ts:9) PASS; `venueToday` (venue.ts:12-13, bodies identical) PASS; `venueCity` with its caller (experiencePage.ts:202), hero copy untouched PASS; `msPerMinute`/`msPerDay` (time.ts:1-2) PASS; `minuteAsOf` (time.ts:8-11), no shims, old names gone from src, tests, docs, e2e PASS; `calendarDateFormat` returns the formatter, per-zone cache kept (browse.ts:71) PASS; `isoDateOf` (time.ts:24-25), coverage.ts calls it, `dayMs` now `msPerDay` PASS; `durationLabel` with the no-break space (duration.ts:5-11) and all callers PASS; duration.test.ts 8-case superset PASS; venue.test.ts all ten cases PASS; time.test.ts (minuteAsOf, calendarDateFormat, constants, isoDateOf), describe names trimmed, "accepts the key minuteAsOf writes" PASS.

Call sites: HomeContent.tsx, BrowseContent.tsx, home.ts, browse.ts, experiencePage.ts (no import from ./browse remains), seed/coverage.ts, seed.db.test.ts, home.test.ts and browse.test.ts, the five lib assertions (home.test.ts:137,175; browse.test.ts:187; experiencePage.test.ts:290,317), server doc comments, both runbooks, every hand-written "N hr" fixture and story, behaviours headers in the three new test files: all PASS.

Risks and checks: escape not literal (zero C2 A0 bytes in the diff) PASS; clock rule PASS; `minuteAsOf` ISO form and round trip PASS; relative imports inside src/lib PASS; held-branch files untouched PASS; PM rulings PASS.

Evidence line: none yet.
