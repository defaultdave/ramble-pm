PASS

## qa-agent: U-033 "Browse shows its results and filters with scripting off" round 2 (head 4b3a6d1)

Known limit, recorded by the PM in DECISIONS.md (2026-11-01, lead lane) and not counted here: with JS off, the first load of a result set with more than 5 results shows only the first 5 cards, and can leave off the last Category chips (React Flight defers elements past 3200 bytes). Ticket #487 stays open. I reproduced it and judged everything else against the three round 2 criteria.

Tested against a production build of 4b3a6d1 and one of base 053bd1a, each on its own port, over a freshly migrated and seeded local database (11 experiences). Chromium launched from a script with `--single-process --no-zygote` and its sandbox on. Servers, worktrees and database are removed.

### Blocking
None.

### Non-blocking
- Known limit, seen again: first load JS off showed 5 of 11 at 1280 and at 320, 5 of 10 for `?guests=3` at 390, 5 of 8 for `?date=2026-11-07` at 1280, and 5 of 7 at 768 where the Category chips also stopped at "Wellness" (Wine and cocktails missing). The page still shows the stated count, the cards it has, the filters and the footer, with no overlap and no sideways scroll. A later load is not guaranteed to be complete either: one load of `/new-york/browse` at 1280, after earlier loads of it in the same run, still showed 5 of 11, while others showed 11 of 11.
- "Skip to results" lands on the results region, which starts with the filter controls, not on a card. After Enter the address is `#browse-results`, the region is at the top of the screen, and focus stays on the page, so the next Tab goes to the date field (or the first active-filter chip), not the first card. At 1280 the first card's top edge is at 768 of an 800 px window. At 390 the first card is 1046 px below the top of an 800 px window, so the screen shows the filters and the "11 experiences" line and the cards need one more scroll. If the PM wants the link to land on the first card, this is a FAIL item.
- In plain Tab order the footer links still come before the filters (8 stops). "Skip to results" now sits before them: Skip to main content, header links, Skip to results, then the 8 footer links, then the date field, Show this day and the chips. It is the 5th stop at 390 and the 7th at 1280.
- The guest chip narrows less than the others: 11 becomes 10 for any guest count, and with a day set, 3 guests stayed at 8. It keeps the other filters. JS on does the same.

### Unconfirmed
- Whether a later load is complete depends on server state that I did not isolate; see the known-limit note above.

### Checked and passing
- JS off is never worse than the skeleton: first loads at 320, 390, 768 and 1280 px, light and dark (8 combinations on never-requested or plain addresses) show visible results above the footer, no skeleton, no sideways scroll (page width equals the viewport in all 8), no cards overlapping and none outside the window.
- JS off, no-script filters at 1280 and 390, first pass and repeat: day form 2026-11-07 gives 8, plus 3 guests keeps the day (8), plus Williamsburg gives 3 (all three in Williamsburg, day and guests kept), plus Ceramics and crafts gives 1 (Wheel throwing for beginners). Each step kept the earlier filters in the address and showed the chip dark. The guest chips on the plain page gave 10.
- JS off, empty result at 320, 390 (light and dark), 768 and 1280: "Nothing on Tue, Nov 10", next day Sat, Nov 14, "See Sat, Nov 14" and "Any day". A day outside the window shows no cards and no sideways scroll.
- JS off, error state (database address unreachable) at 320, 390 (light and dark), 768 and 1280: "We couldn't load experiences", Try again, no skeleton, no sideways scroll. Try again reloads the same address and shows the error again, which is right while the database is down.
- "Skip to results" exists on every state I tried (full page, empty, error), is reached by Tab at 390 and 1280, and lands on `#browse-results`: the results region on a full page (top of the region at 0 px), "Nothing on Tue, Nov 10" in the empty state, and the "We couldn't load experiences" alert in the error state.
- JS on stays identical to base: 0 differing pixels in all 6 screenshot pairs (320 light, 390 light and dark, 768 light, 1280 light and dark). The Filters sheet chain matches base step for step at 1280 light and 390 dark: Williamsburg 3, plus Ceramics 1, plus 3 guests 1, plus Kids 2, each filter kept in the address.

### Evidence
All in `evidence/pr/unit-U-033-noscript-browse/`, mine from round 2. Round 1 files stay in the folder.
- qa-r2-browse-1280-json-light-after.png: JS on, 1280 px, light, 4b3a6d1.
- qa-r2-browse-1280-json-light-base.png: JS on, 1280 px, light, base 053bd1a.
- qa-r2-browse-390-json-dark-after.png: JS on, 390 px, dark, 4b3a6d1.
- qa-r2-browse-390-json-dark-base.png: JS on, 390 px, dark, base 053bd1a.
- qa-r2-empty-1280-jsoff-light.png: JS off, 1280 px, light: empty result (Kids on a Tuesday).
- qa-r2-empty-320-jsoff-light.png: JS off, 320 px, light: empty result (Kids on a Tuesday).
- qa-r2-empty-390-jsoff-dark.png: JS off, 390 px, dark: empty result (Kids on a Tuesday).
- qa-r2-empty-390-jsoff-light.png: JS off, 390 px, light: empty result (Kids on a Tuesday).
- qa-r2-empty-768-jsoff-light.png: JS off, 768 px, light: empty result (Kids on a Tuesday).
- qa-r2-empty-outside-window-390-jsoff-light.png: JS off, 390 px, day outside the window.
- qa-r2-error-1280-jsoff-light.png: JS off, 1280 px, light: error state with Try again.
- qa-r2-error-320-jsoff-light.png: JS off, 320 px, light: error state with Try again.
- qa-r2-error-390-jsoff-dark.png: JS off, 390 px, dark: error state with Try again.
- qa-r2-error-390-jsoff-light.png: JS off, 390 px, light: error state with Try again.
- qa-r2-error-768-jsoff-light.png: JS off, 768 px, light: error state with Try again.
- qa-r2-filters-chain-1280-json-light.png: JS on, 1280 px, light: chips chain ending at 3 guests and Kids.
- qa-r2-filters-chain-390-json-dark.png: JS on, 390 px, dark: chips chain ending at 3 guests and Kids.
- qa-r2-flow-1280-jsoff-1-start.png: JS off, 1280 px, no-script chain step 1 (start).
- qa-r2-flow-1280-jsoff-2-day.png: JS off, 1280 px, no-script chain step 2 (day).
- qa-r2-flow-1280-jsoff-3-guests.png: JS off, 1280 px, no-script chain step 3 (guests).
- qa-r2-flow-1280-jsoff-4-neighborhood.png: JS off, 1280 px, no-script chain step 4 (neighborhood).
- qa-r2-flow-1280-jsoff-5-category.png: JS off, 1280 px, no-script chain step 5 (category).
- qa-r2-flow-390-jsoff-1-start.png: JS off, 390 px, no-script chain step 1 (start).
- qa-r2-flow-390-jsoff-2-day.png: JS off, 390 px, no-script chain step 2 (day).
- qa-r2-flow-390-jsoff-3-guests.png: JS off, 390 px, no-script chain step 3 (guests).
- qa-r2-flow-390-jsoff-4-neighborhood.png: JS off, 390 px, no-script chain step 4 (neighborhood).
- qa-r2-flow-390-jsoff-5-category.png: JS off, 390 px, no-script chain step 5 (category).
- qa-r2-load-first-1280-jsoff-light.png: JS off, 1280 px, first load of /new-york/browse.
- qa-r2-load-first-390-guests3-jsoff-light.png: JS off, 390 px, first load of ?guests=3.
- qa-r2-load-repeat-390-jsoff-light.png: JS off, 390 px, later load of /new-york/browse.
- qa-r2-matrix-1280-jsoff-dark.png: JS off, 1280 px, dark: results above the footer, no sideways scroll.
- qa-r2-matrix-1280-jsoff-light.png: JS off, 1280 px, light: results above the footer, no sideways scroll.
- qa-r2-matrix-320-jsoff-dark.png: JS off, 320 px, dark: results above the footer, no sideways scroll.
- qa-r2-matrix-320-jsoff-light.png: JS off, 320 px, light: results above the footer, no sideways scroll.
- qa-r2-matrix-390-jsoff-dark.png: JS off, 390 px, dark: results above the footer, no sideways scroll.
- qa-r2-matrix-390-jsoff-light.png: JS off, 390 px, light: results above the footer, no sideways scroll.
- qa-r2-matrix-768-jsoff-dark.png: JS off, 768 px, dark: results above the footer, no sideways scroll.
- qa-r2-matrix-768-jsoff-light.png: JS off, 768 px, light: results above the footer, no sideways scroll.
- qa-r2-skip-results-focused-first-1280-jsoff.png: JS off, 1280 px, "Skip to results" focused by Tab (first load).
- qa-r2-skip-results-landed-empty-1280-jsoff.png: JS off, 1280 px, after Enter on "Skip to results" in the empty state.
- qa-r2-skip-results-landed-empty-390-jsoff.png: JS off, 390 px, after Enter on "Skip to results" in the empty state.
- qa-r2-skip-results-landed-error-1280-jsoff.png: JS off, 1280 px, after Enter on "Skip to results" in the error state.
- qa-r2-skip-results-landed-error-390-jsoff.png: JS off, 390 px, after Enter on "Skip to results" in the error state.
- qa-r2-skip-results-landed-first-1280-jsoff.png: JS off, 1280 px, after Enter on "Skip to results" (first load).
- qa-r2-skip-results-landed-repeat-390-jsoff.png: JS off, 390 px, after Enter on "Skip to results" (repeat load).
