PASS (gaps named: no browser, no signed-in rendering, no DB run of tests/db, no real cache invalidation, no DST edge exercised for new slots, daily-job race not exercised, no focus/screen-reader check)

# U-074c QA (code and test trace, head 24a36ca)

Method: read the diff, traced each flow page -> action -> lib -> data layer, checked a test covers it. Ran `bunx vitest run --project unit --project components`: second run 463/463 files pass. The first run had 2 failing files (one in a GuestLayout/VercelMeasurement test, unrelated to this unit); it passed on rerun, so I read it as flaky and did not chase it.

Flows traced
- Non-ops visitor: page returns OpsAccessDenied (page.tsx); actions use opsCallerOrLeave and redirect to the list (action test "sends a caller without the ops role... writes nothing"); data functions requireRole Ops (authz matrix rows in authzAvailabilityRows.ts). OK.
- Empty experience: view says "no weekly slots yet" and still offers the add form (component test). With slots: day, time, length, source, "N sessions open, through DATE" / "No upcoming sessions yet", Monday-first order (lib tests). OK.
- Unknown or non-id experience: readAvailability returns null, page calls notFound. Covered in db test (unknown -> null); page itself is untested without a browser.
- Add slots: several weekdays -> one template each, sessions generated at once in the same transaction, audit row per slot (db test); daily job finds nothing to add (db test "leaves nothing for the daily job to add"). Duplicate day+time: whole add refused, nothing written (db test + action test notice). Bad time, length, seats, source, no day: parse refuses with the field names (lib it.each, action test redirect with fields). Seats 0 accepted by design (lib test). Bad host zone: refused before writing (db test + notice). Experience gone: redirect to list.
- Edit seat cap: following sessions move, hand-set keep theirs, cancelled/started/past untouched, version bumped (db tests + planTemplateSeatChange unit tests). Cap below sold+held refuses the whole change with a generic notice (db test, boundary equal-allowed test, action test). Unchanged: no write, no audit row (db test). Slot not found: slot_gone notice (db + action tests). Bad number: generic invalid notice (lib + action tests). Later daily-job sessions take the new cap (db test).
- Notices: all 8 codes have text and tone; action tests check each result's redirect.
- Link from experience page: "Weekly slots and seats" link added; no test asserts it (trivial).
- Audit rows: codes and numbers only (lib tests); written in the same transaction (db tests).
- Tags: updateTagsForChanges runs after commit, only when sessions were opened or moved; asserted in db test for add; the seat-change path calls it with spaces tags (not clearly asserted).
- Accessibility (by reading): every input has a label, weekdays in a fieldset/legend, error text with role=alert on weekdays, per-slot seat inputs labelled with day and time. Not exercised with a keyboard.

Findings (none blocking)
1. addWeeklySlots passes the raw `input.startTime` rather than the parsed `data.startTime` to createSessionTemplate. It is parsed again there, so no bug today; mention to the reviewer.
2. Double submit: the second add hits the duplicate rule and shows the "already has a slot... Nothing was added" notice, a little misleading after a first success but harmless. Seat double submit shows "unchanged". Not tested at the page level.
3. Seat-form errors are a generic page notice, not tied to the slot's input (per the code comment, deliberate).

Gaps I could not exercise
- Real browser rendering, the signed-in ops page, CSS/layout, keyboard focus order and screen-reader behaviour.
- tests/db/availability.db.test.ts and the authz matrix: no Postgres here, so I read them but did not run them. Their pass/fail is unconfirmed.
- Real cache invalidation (tags tested against a mock only).
- DST edge for newly generated sessions (covered for occurrenceOn in sessionsEdits tests, not for the add flow end to end).
- Concurrency: the daily job racing an add, and the lock ordering with a concurrent booking or host edit.
