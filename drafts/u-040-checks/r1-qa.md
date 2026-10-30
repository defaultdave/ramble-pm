PASS

## qa-agent: U-040 "Upcoming dates" (head 2dd8c1d)

Scratch copy, fresh seeded Postgres, `next build` + `next start`, Playwright at 320, 390, 768, 1280 light and dark, a logging proxy counting queries. Blocking: none.
Streaming: with reads slowed, six dates showed the skeleton at 424 px then rows at 424 px, content below unmoved, CLS 0; CLS 0 at all eight width and scheme pairs; no overflow; rows 65 px (Figma 64 plus the rule).
Spaces against the database: seeded 12, 2, sold out, 3, 12, 12 matched; a 3-seat hold inserted directly showed 12 at once and 9 on the first request after about 10 s (the 8 s revalidate); a hold through the UI not possible until U-041.
Read count: cold request 13 statements (1 list, 6 spaces reads with their clock reads), repeat 0, the next refresh 12; EXPLAIN `Limit 6` over an index scan on `sessions_experience_starts_at_idx` with the 90-day window; builder db test 11 of 11, new unit and component tests 45 of 45.
Sold out stays listed as a `div` without chevron or price; time zones "Sat, Oct 31 · 2:00 PM EDT", "Sun, Nov 1 · 5:30 PM EST"; `?date=` marks exactly the right rows on the session's own calendar (no UTC-day mix-up), bad values return 200 with nothing marked; empty and error states as specified (error section only, 46 px GET retry, logs only digest and kind, not cached); contrast light 6.66:1 and 6.53:1, dark 13.2:1 and 10.1:1; Figma `_Flow/SessionRow` states match; builder's differences hold; `zonedShortDayLabel` identical to U-047b's.
Non-blocking: the 6-row skeleton shifts content up for fewer dates (2 dates: 260 px, CLS 0.040 at 390), and the empty and error states shrink the section; retry drops `?date=`; the selected background is about 1.1:1 against the page and equals the hover colour; a paused experience shows not-found (no dates); rows link to the existing booking link.
Evidence: `evidence/pr/unit-U-040-qa-agent/`.
