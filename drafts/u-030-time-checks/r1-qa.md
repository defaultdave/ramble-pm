PASS

## qa-agent: U-030 "venue.ts, time.ts, duration.ts" (head f106576)

Head f106576 against origin/main 2bc8c4e, in the check's own scratch worktrees (removed afterwards); the builder's worktree was not touched.

### Blocking
None.

### Behaviour proof
A throwaway vitest dump run at both commits and diffed (42 lines each):
- 22 fixed `now` instants: US spring-forward (2026-03-08) and fall-back (2026-11-01) nights straddling the change, New Year's Eve 23:59, 23:59:59.999 and 00:01 New York time, UTC instants that are the previous day in New York (2026-10-29T02:00Z, 03:59Z, 2027-01-01T04:59Z), a leap day. For each: `venueToday` (both old copies on main, the shared one on head), `minuteAsOf` (old `homeAsOf` and `browseAsOf`), `thisWeekWindow` and `browseWindow`.
- The browse days list over 11 sessions in New York, Kiritimati (UTC+14), Etc/GMT+12, London and Kolkata, duplicates, the empty list, and the unknown-zone `RangeError`.
- `durationLabel` for 0, 1, 30, 59, 60, 61, 90, 120, 135, 150, 600, 1440 through both old copies.

Result: every `venueToday`, `minuteAsOf`, window and `browseDays` line is byte-identical. The only differences are the 12 `durationLabel` lines, each only a plain space becoming U+00A0 between number and unit (`2 hr 15 min` becomes `2<NBSP>hr 15<NBSP>min`); the space between hours and minutes stays plain.

Seed coverage: `evaluateCoverage` output identical for curated fixtures at 2026-10-28T15:00Z with and without the scale fixture, and at 2026-03-08T06:59:30Z, 2026-11-01T05:30:00Z, 2026-12-31T23:59:00-05:00 (5 probes pass).

### Gates in the head scratch worktree
`pnpm test` 165 files, 3623 tests pass; typecheck, lint, knip, format:check clean; no `homeAsOf`/`browseAsOf` left; no literal U+00A0 in the diff (40 escapes); no added "hr"/"min" test, fixture or story line without the escape.

### Mutation checks (each alone, reverted)
All caught: escapes replaced with plain spaces (14 failures); time zone to America/Chicago (6); `venueCity` to Boston (4); `msPerMinute` 30_000 (4); `msPerDay` 86_000_000 (4); `isoDateOf` slice to 9 (19); `calendarDateFormat` locale en-US (29); half-hour rule to 31 (2).

### Non-blocking
- At 320 px the "per person" text on the "From $65" line is clipped in both captures; not caused by this PR, outside H-63. Audit item.
- `msPerMinute` is exported and used by `time.test.ts`, as the spec allows.

### Unconfirmed
- Postgres and browser gates not run by this check (`tests/db/seed.db.test.ts`, e2e, `storybook:test`); CI runs them.

### Evidence
Folder `evidence/pr/unit-U-030-time/` in ramble-pm:
- `this-week-320-light-before.png`: "On this week" cards at 320 px on main; "Park Slope · 3 hr" wraps with "3" at a line end and "hr" alone on the next line (dark variant below in the same file).
- `this-week-320-light-after.png`: same cards on head; "3 hr" moves to the next line together; nothing else changes.
