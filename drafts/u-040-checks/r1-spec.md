PASS

## spec-compliance: U-040 "Upcoming dates" (head 2dd8c1d)

Static diff check. 12 items PASS: Suspense with `UpcomingSessionsSkeleton` drawing `maxRows` (6) rows of the loaded `.row` class; date and time in the session's zone (`zonedShortDayLabel`, `zonedTimeLabel`) and `cardPriceLabel`; `getSpacesLeft` once per row, first-caller TODOs removed (`spacesLeft.ts`, `cacheProfiles.ts`); list `'use cache'` with `cacheLife('browse')`, `cacheTag(tags.experience(id))`, keyed by `minuteAsOf`, spaces through the `spacesLeft` profile; sold out kept with `href: null`, rendered as a `div`; bounded (`.limit(maxRows)`, 90 days, `scheduled`, `guestVisible`, plus `.slice`); `spacesLabel` low availability; rows link to `view.bookHref`; `?date=` via `parseSingle` and `IsoDateSchema`, `aria-current="date"` on the session's calendar date; empty and error states (`rethrowOrLog`); scope respected; tests present.
`zonedShortDayLabel` here and on `unit/U-047b` are the same function (`plain(formatter('shortDay', timeZone).format(instant))`, options `{ weekday: 'short', month: 'short', day: 'numeric' }`); `src/lib/zonedLabels.ts` will conflict; the second to land keeps one (keep U-047b's `LabelKind`, which has `clock` and `deadlineNoZone`).
Blocking: none.
