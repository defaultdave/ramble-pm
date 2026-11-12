PASS (re-posted on the merge head)

Unchanged from a3b8709 except a merge of main (U-072, U-074c) with three conflicts resolved (src/lib/hostGuestLists.ts, src/lib/hostSessions.ts, tests/db/authz-matrix.db.test.ts): a delta review of the merge commit confirmed U-072 minors selection is kept exactly as on main (src/server/db/hostGuestLists.ts byte-identical to main; the owner/staff scope union untouched), both sides authz rows kept, nothing dropped. Local gates on eed268c: format, lint, typecheck, knip, 10,415 unit tests, build.
