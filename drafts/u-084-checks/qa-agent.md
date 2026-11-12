PASS (gaps named: no browser, no signed-in rendering, DB tests (tests/db/experience-pause.db.test.ts) read but not run, no real cache invalidation, guest-page effect not exercised)

# QA U-084 at 7d0dd15 (code and test trace, no browser)

Ran `bunx vitest run --project unit --project components`: 448 files, 10006 tests passed.

## Flows traced
- Non-ops visitor: actions call opsCallerOrLeave and redirect to the list; DB layer requireOpsUserId. Action test covers admin and anonymous for all four actions, nothing changes. Pages keep OpsAccessDenied.
- Ops pauses a live experience: form on /ops/experiences/[id] (Pause button when live), action -> setExperiencePaused -> redirect ?notice=paused, page shows success notice; status changes in the same transaction. Action test + DB test (one audit row, listing tags).
- Unpause: same path, notice=unpaused; DB test covers.
- Pause on draft/in_review/guide_only/already paused: pauseRefusal gives not_live/not_paused, info notice; form is not rendered for non-live/paused statuses. Unit test (experiencePause.test.ts) and DB test (it.each) cover.
- Unknown or malformed id: action sends to list; DB returns not_found for non-UUID and missing id. Covered by action and DB tests.
- Suspend host from /ops/hosts/[id]: counts of live and suspension-paused shown; all live paused, drafts and hand-paused untouched, one audit row each plus one host row. DB test covers. Host with nothing live: "nothing to do" copy in component plus nothing_to_suspend notice; component and DB tests cover.
- Unsuspend: only experiences whose latest pause audit row has via_host_suspension=true come back; hand-paused, no-audit-row and later-unpaused ones stay. DB tests cover all three.
- Double/concurrent submit: row lock (experience) and host-then-experience lock order; second submit gets a not_live / nothing_to_* refusal notice. DB test covers two concurrent pauses (one audit row). No lock cycle seen between single pause and host suspend.
- Audit rows: experience.paused/unpaused with from/to/via_host_suspension; host.suspended/unsuspended with experiences_changed.
- Cache: updateTagsForChanges runs after db.transaction returns, so a rollback invalidates nothing; DB test asserts tags.
- Accessibility: sections are labelled by their h2, forms are a single submit button with visible text, so keyboard use is native; no inputs beyond hidden ids. Component tests exist.

## Gaps
- Not rendered in a browser; focus order, notice visibility and layout unverified.
- DB tests were not run here (no Postgres); I read them and they match the behaviours above.
- Real cache invalidation and the effect on guest pages (listing disappears/reappears) not exercised; DB test only checks the tag list and a status predicate.
- Notices share ?notice= with host notices; codes are disjoint by name in the diff but I did not exercise a collision.
- readHostSuspension does not itself validate the id (page parses it first).

No blocking defects found.
