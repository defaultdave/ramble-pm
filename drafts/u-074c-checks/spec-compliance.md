PASS

# Spec Compliance: U-074c (issue 92), branch unit/U-074c, head 24a36ca4c1fc0e4dacef6a8228147439d1ea0e60

Sources: drafts/mvp-replan-2026-11-10.md (U-074c row), docs/plan/units.yaml (U-074c scope), issue 92 scope manifest (mirror of units.yaml). Diff: origin/main...HEAD (23 files, +2408/-13, no schema or migration files).

Verdict: PASS. No criterion is missing from the lite cut. Items the replan drops are reported as CUT, not FAIL.

| # | Criterion (units.yaml / replan) | Status | Evidence |
|---|---|---|---|
| 1 | Session templates or an allocation, set up by ops | PASS | src/lib/availability.ts parseAddSlotsForm; src/server/db/availability.ts addWeeklySlots; src/server/actions/availability.ts addWeeklySlotsAction |
| 2 | Capping seats (replan: "seat cap") | PASS | seat cap = template `allocation` integer (src/lib/sessions.ts AllocationSchema, maxAllocation); editable via updateSlotSeats (src/server/db/availability.ts) |
| 3 | Source ramble or allocation (allocation = host's own system hands seats over) | PASS | src/lib/availability.ts templateSourceLabels; src/lib/sessions.ts SessionTemplateInputSchema source |
| 4 | Booking-system label | CUT | replan: "Drop ... booking-system label". Not in diff (no label field, no hits). |
| 5 | Timed 20-minute onboarding walkthrough | N/A | human acceptance (acceptance_by_people), not code-verifiable |
| 6 | Daily pulse job keeping allocations and templates generated to rolling 12 weeks via Clock port | CUT | replan: "Rolling generator moves to NEW-3". Nothing added under src/app/api/pulse or src/server/pulse. Add path generates immediately over the existing rollingRange (db/availability.ts addWeeklySlots). |
| 7 | Skip cancelled or edited sessions in the generator | CUT (partial in-scope) | Generator part belongs to NEW-3. The cap-change rule does skip non-scheduled, started and hand-edited sessions (src/lib/sessions.ts planTemplateSeatChange, filter on allocation === old cap). |
| 8 | Tested across a daylight-saving change | CUT | Belongs to the rolling generator (NEW-3). No DST test in the diff. |
| 9 | One-off dated sessions with allocation for event-style hosts, duplicate-start check, excluded from generator | CUT | replan: "Drop ... one-off event sessions". No Eventbrite or one-off code. The duplicate_slot check here is for weekly slots only (createSessionTemplate). |
| 10 | Routes and states as rows in the U-100 axe matrix | NOT REQUIRED | U-100 is not on origin/main, and no axe matrix file exists on main. The clause says whichever unit lands second adds the rows, so U-100 adds them. Diff adds authz rows only (tests/db/authzAvailabilityRows.ts), which are not axe rows. |
| 11 | No-weekly-entry acceptance for recurring hosts | N/A | acceptance wording, not code-verifiable |
| 12 | Form for template/allocation with fields beyond those built | NO MISSING FIELD | Form fields: weekdays (multi), startTime, durationMinutes, allocation, source. Nothing else in units.yaml or replan names a field. Booking-system label is cut (row 4). |

## Builder choices (judged)

- Seat cap = `allocation` integer, no new field. WITHIN LITE CUT. Matches the replan's "seat cap" and the existing schema.
- Add form creates weekly templates, one per ticked weekday, with shared start time, length, seats and source. WITHIN LITE CUT. Matches "template/allocation form" in the replan. Slots are weekly, which is what the units.yaml scope names.
- Only seat cap editable on an existing slot; time, length and source immutable; no retire or delete. WITHIN LITE CUT. units.yaml names none of these as required. The lite replan does not ask for them.
- Cap change moves upcoming scheduled sessions whose capacity equals the old cap, and refuses the whole change if sold plus held exceeds the new cap. JUDGEMENT, accept. units.yaml does not name propagating a cap to existing sessions. The replan's "seat cap" is not meaningful for generated sessions without this rule, and the "skip edited sessions" intent from row 7 is honoured. Refusal uses PRD-41 sold+held. Flag for Dave: this is the one builder behaviour that goes beyond the literal text, and it is the sensible reading.
- New slots generate sessions immediately over rollingRange (same as the pulse uses). WITHIN LITE CUT. It fills the first horizon at add time. NEW-3 will keep it rolling. Note: the replan lists NEW-3 as a dependency of U-074c, but this build does not block on it. That is acceptable because the immediate fill does not need the pulse.
- No schema change or migration. CONFIRMED (no schema, drizzle or sql files in the diff; schema.ts diff is 0 lines).
- No host-side behaviour change: src/lib/hostSessions.ts swaps its local wholeNumber for formWholeNumber from opsForm. CONFIRMED equivalent. Old: text() gives '' for non-string or blank, and the pattern fails, so undefined. New: formText gives undefined for non-string or blank, then formWholeNumber gives undefined. Same result.
- Axe matrix rows not required. CONFIRMED (see row 10).

## Blocking issues
None.

## Suggestions (not blocking)
- Dave should confirm the cap-propagation rule (judgement item above) is wanted, because units.yaml does not name it.
- Rows 6 to 9 (rolling generator, DST test, one-off event sessions) are cut to NEW-3 and the replan. Track them there so they are not lost.

Read-only check. No code changed.
