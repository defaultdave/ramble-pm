PASS

## review-agent: U-040 "Upcoming dates" (head 2dd8c1d)

Blocking: none.
Non-blocking: `zonedShortDayLabel` collides with U-047b's identical function (keep one copy and U-047b's other additions; merge the `zonedLabels.test.ts` cases); scope within the manifest (three TODO(U-040) markers removed, only TODO(U-005) added, runbook updated); reuse of `cardPriceLabel`, `spacesLabel`, `spacesStatus`, `upcomingWindow`, `minuteAsOf`, `calendarDateFormat`, `zonedTimeLabel`, `guestVisible`, `readOrRefuse`, `rethrowOrLog`, `parseSingle` exported; `getUpcomingSessions` keys the cache on the raw id and lowercases only for the read and tag (a differently cased id makes a separate, bounded entry).
Defect classes clean: bounded (6 rows in 90 days, at most 6 `getSpacesLeft`); output parsed with `UpcomingSessionSchema.array().parse`; fails closed (a failed read shows the dates-only error, a row dropped only when spaces is null, a malformed `?date=` is null); no raw values in logs (`safeParse`, fixed `rethrowOrLog` message).
Builder's calls consistent with `cache-conventions.md`; the skeleton taller than a short schedule is documented; shell prerendered with unawaited `searchParams`; sold out hides price and chevron (design choice).
Unconfirmed: static review; layout shift, real spaces and contrast for QA and a11y.
