PASS

## architecture-audit: U-040 "Upcoming dates" (head 2dd8c1d)

Read `98096b2..2dd8c1d` (28 files). Blocking: none. B1, B4-B6, B11 only `src/server/db/upcomingSessions.ts` touches Drizzle, guest-visible, no caller; B2 every rule in `src/lib/upcomingSessions.ts` with tests, the data layer only WHERE, ORDER BY, LIMIT and `Promise.all(...map)`; B3 `server-only`; B7 every export has a caller, first-caller TODOs removed; B8 no `'use client'`; B12 `new Date()` with `TODO(U-005)` in the route as elsewhere; B13 the only catch uses `rethrowOrLog`; B14 cached list takes id and minute, tags `experience(id)`, spaces read per session, malformed id `[]` under `uncached` with `safeParse`; B15 no handler; B17 reuse of `cardPriceLabel`, `spacesLabel`, `spacesStatus`, `calendarDateFormat`, `IsoDateSchema`, `upcomingWindow`, `minuteAsOf`, `readOrRefuse`, `rethrowOrLog`, `parseSingle` exported.
Non-blocking: duplicate `zonedShortDayLabel` with `unit/U-047b` (identical; keep one when the second lands); A1 and A5 fine (skeleton height match for QA).
Unconfirmed: once-per-row spaces read at runtime (QA).
