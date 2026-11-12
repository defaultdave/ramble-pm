# U-074c review (review agent)

Head 24a36ca4c1fc0e4dacef6a8228147439d1ea0e60, branch unit/U-074c. REVIEW_VERDICT=APPROVE_WITH_NITS (PASS, nothing blocking).

Size: 2408 insertions, 13 deletions (23 files), about half tests and stories. One logical change. A split would leave unused exports (the lib and data layers have no caller until the action and page land), so it ships as one PR under Dave's standing rule. Not a finding.

Scope: all changes within scope. No host files, no U-084, no generator changes beyond exporting generateSessionsIn and an `executor` param on createSessionTemplate (the removed TODO(U-074c) is the intended first caller). No walkthrough, booking-system label or one-off sessions. src/server/db/sessions.ts is on the unit's allowed list.

Checks run: tsc --noEmit clean; vitest on the 5 non-DB test files, 140 passed. DB tests (tests/db/availability.db.test.ts) not run here (no database).

## Findings

None Critical or Required.

- Optional, src/server/db/availability.ts:211 and src/server/db/sessions.ts (generateSessionsIn, template read, about line 182). The builder's race is real and slightly worse than "small": the generator reads the template with a plain SELECT. A generator run that read the old cap before our commit then inserts sessions; the insert's FK check waits on our FOR UPDATE on the template, and proceeds after commit with the OLD cap. Those sessions then differ from the template for good (they look hand-set). No daily job exists on this branch's base (origin/main 521c2e1 has only the seed caller), so nothing can hit it today. Fix belongs with the job (U-122/NEW-3): read the template `.for('share')` inside the generating transaction, or insert-select the allocation. Record it on the NEW-3 side; not a blocker here.
- Nit, src/server/db/locks.ts header. The template row lock taken before the session locks is not in the documented order. It is safe today: no other path locks or reads a template under a lock (only availability.ts, sessions.ts and seed touch sessionTemplates), and the sessions are locked in id order via lockSessionRow, then holds read after the locks. Add one line to the lock-order comment ("template row, before the sessions, ops availability only") so a later path does not take them the other way round.
- Nit, src/server/db/availability.ts:~147. `startTime: input.startTime` is the raw input on purpose (the parsed one has ":00" appended and would be transformed twice). Correct, but it looks like a bug; a short why-comment is worth it.
- FYI, src/server/db/availability.ts:~232. An unchanged cap returns early without touching sessions, so sessions that drifted from the template (e.g. the race above) cannot be re-aligned by re-saving the same number. Acceptable for lite.
- FYI. DB tests cover held and sold counting, hand-set sessions, cancelled/started untouched, whole-refusal writes nothing (audit and tags included), duplicates rolling the whole add back, bad host zone, zero seats at the parser. No test drives a real concurrent booking against updateSlotSeats; correctness rests on the lock design, which reads right.

## Points you asked about

- Oversell: planTemplateSeatChange (src/lib/sessions.ts) refuses if any following session has seatsSold + heldSeats above the new cap, via the existing checkAllocationChange (equal is allowed, tested). Sessions are locked first, holds read at database time taken after the locks, so a hold or booking cannot slip in (reserve and confirm take the session lock). Hand-set sessions above the new cap do not block (tested), and keep their cap. DB CHECK seats_sold <= allocation stays the backstop.
- Version: each moved session gets version + 1 in the same statement; the host editor's expectedVersion check sees a conflict. Template change itself is not versioned, fine (ops only, row-locked).
- Lock order: template FOR UPDATE, then sessions by id ascending, then holds read (not locked). Compatible with lock 2 before 3; no path locks a session then a template, so no cycle.
- Time zones: nothing new; startTime stays on the host wall clock and the existing generator and rollingRange (existing DST tests) do the conversion. A bad host zone is refused first with nothing written.
- Duplicates: unique (experience, weekday, start) with onConflictDoNothing, duplicate weekdays rejected by the schema refine, whole add rolls back on one duplicate (tested).
- Zero seats: allowed by schema and DB range (0..max); creates sessions at capacity 0 (stops a slot selling). Parser test covers it.
- Authz: requireRole/requireOpsUserId is the first statement in all three functions, before any read or write; page also gates on holdsOpsRole. Authz rows added and spread into the matrix. updateSlotSeats trusts the templateId alone (experienceId is only the redirect target); fine for ops-wide scope.
- Tags: updateTagsForChanges called after the transaction commits, only when something changed (add with 0 sessions, no-op, and refusals invalidate nothing; tested).
- Duplication/coverage: hostSessions' private wholeNumber now delegates to formWholeNumber. Behavior equal (empty and non-digit both give undefined, same wholeNumberPattern); hostSessions tests unchanged and green; opsForm test added. No lost coverage seen.
- Docs: no README/CLAUDE/docs page lists ops routes, so no docs-currency update is due.

## Acceptance criteria
No acceptance-criteria checklist was in the prompt; the spec row (ops-only template/allocation form and seat cap, no walkthrough/label/one-off) is met: PASS.

## Required changes
None.
