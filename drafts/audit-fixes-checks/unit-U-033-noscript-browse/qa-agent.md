FAIL

## qa-agent: U-033 "Browse shows its results and filters with scripting off" (head d9376c1)

Tested against a production build of d9376c1 and one of base 053bd1a, each on its own port, over a freshly migrated and seeded local database (11 experiences). Chromium was launched from a script with `--single-process --no-zygote` and its sandbox on. JavaScript was off for the main run and on for the comparison. Servers, worktrees and database are removed.

### Blocking
- Browse, JS off, first view of any address with more than 5 results: the page says "11 experiences" but shows only 5 cards. The other 6 are in the page but hidden, and never appear. Seen on every first load of a fresh server, at 1280 and at 390: `/new-york/browse` showed 5 of 11, `?date=2026-11-07` showed 5 of 8, `?guests=3` showed 5 of 10, `?guests=1` and `?guests=6` showed 5 of 10. A second load of the same address showed all of them (11 of 11, 8 of 8, 10 of 10). Results of 3 or fewer were never cut. Every new filter combination is a first load, so a guest chaining chips with scripting off will hit this often, and sees a count that does not match the page with no sign that anything is missing. Expected: every result shown on the first view, as on the second. The builder's after image shows all 11 because it was taken on a repeat load. Fix: make whatever reveals the streamed result segments work with scripting off for all of them, not only the first, and add a check that loads a never-requested address with scripting off and counts the cards against the stated number.
- Same cause, filter bar: on the first load of `?category=kids&date=2026-11-10` and `?neighborhood=tribeca&category=kids` with JS off, the Category chips stop after "Outdoors". "Walking tours", "Wellness" and "Wine and cocktails" are missing (19 of 22 filter links visible on the first load, 22 of 22 on the repeat). A guest cannot pick those categories from the page until they reload.

### Non-blocking
- Keyboard, JS off, 1280 and 390: the footer links come before the filters and results in Tab order. At 1280 the order is Skip to main content, header links (ramble, Things to do, Ramble Picks, Gift guide, Search), then 8 footer links (Gift guide, Ramble Picks, Things to do, Help center, Contact us, Accessibility, Terms, Privacy), then the date field (4 stops), Show this day, guests 1 to 6, neighborhoods, categories, then the cards. At 390 it is Skip, ramble, Gifts, Menu, then the same 8 footer links, then the filters. The footer is at the bottom of the screen, so focus jumps from the header to the bottom and back to the top.
- "Skip to main content" lands at the top of the main region (address becomes `#main`, the page scrolls to it, focus stays on the page body). The next Tab goes to the footer's "Gift guide", not the date field or the first chip. So the skip link does not save a keyboard user from the footer stops. I did not check whether base has the same order with JS off (base shows only the skeleton there), so I cannot say whether this is new.
- The guest chip narrows less than the others: unfiltered 11 becomes 10 for any guest count (1 and 6 both give 10), and with a day set, adding 3 guests stayed at 8. It keeps the other filters in the address. JS on gives the same, so this is not new. The runbook's address grammar does not list a guests parameter.
- The error state hides the filter bar by design ("Your filters are saved"), and Try again, a plain form button, reloads the same address with scripting off. With the database still down it shows the same error, which is correct.

### Unconfirmed
- Cause of the cut. In the browser the hidden results sit inside streamed `hidden` segments, only the first of which is shown. I did not read the source. "First view of an address" fits all 9 observed cases, but I did not isolate a cache cause from a timing cause. A deployed build may stream differently, since browse is a partial-prerender route here.

### Checked and passing
- JS off, 320, 390, 768 and 1280 px, light and dark (8 combinations, repeat load): results sit above the footer, all 11 shown, no skeleton visible, no sideways scroll (page width equals the viewport in all 8). Dark mode changes the background to the dark colour and text stays legible.
- Base 053bd1a with JS off at 390 shows the skeleton in place of results, which confirms PF-7 before the fix.
- No-script day form, then guest chip, neighborhood chip and category chip, at 1280 and 390, first pass and repeat: `?date=2026-11-07` 11 to 8, plus 3 guests (kept the day), plus Williamsburg 3 (all three in Williamsburg, kept day and guests), plus Ceramics and crafts 1 (Wheel throwing for beginners, kept all). The address kept every earlier filter at each step and the selected chips show dark with a row of active chips on top. Counts at 5 of 8 on the first load are the blocking finding above, not a filter fault.
- Empty result at 320, 390 (light and dark), 768 and 1280: Tue Nov 10 with Kids shows "Nothing on Tue, Nov 10", "The next day with experiences is Sat, Nov 14", a "See Sat, Nov 14" button and "Any day". Tribeca with Kids shows "Nothing matches those filters" and "Clear all filters". A day outside the window (2027-06-01) shows no cards and no sideways scroll; I did not read its message. No sideways scroll.
- Error state (database address unreachable) at 320, 390 (light and dark), 768 and 1280: heading, "We couldn't load experiences" alert, Try again button, footer; no skeleton, no sideways scroll.
- JS on, 320, 390, 768, 1280, light and dark where noted: browse is pixel for pixel the same as base (0 differing pixels in all 6 compared screenshots). Filters still work and match base step for step: Filters sheet, Williamsburg 3, plus Ceramics 1, plus 3 guests 1, plus Kids 2, with the address keeping each filter, at 1280 light and 390 dark.

### Evidence
Builder's file relied on (`evidence/pr/unit-U-033-noscript-browse/`):
- browse-1280-jsoff-after.png: all 11 results above the footer, JS off, taken on a repeat load.

Mine, same folder:
- qa-first-load-1280-jsoff-5-of-11-results-light.png: first load, JS off, "11 experiences" with 5 cards, then the footer.
- qa-first-load-empty-390-jsoff-light-category-chips-cut.png: first load, Kids and Tribeca, Category chips end at Outdoors.
- qa-browse-320-jsoff-light.png: JS off, 320, light, 11 results above footer.
- qa-browse-320-jsoff-dark.png: JS off, 320, dark.
- qa-browse-390-jsoff-light.png: JS off, 390, light.
- qa-browse-390-jsoff-dark.png: JS off, 390, dark.
- qa-browse-768-jsoff-light.png: JS off, 768, light.
- qa-browse-768-jsoff-dark.png: JS off, 768, dark.
- qa-browse-1280-jsoff-light.png: JS off, 1280, light.
- qa-browse-1280-jsoff-dark.png: JS off, 1280, dark.
- qa-flow-390-jsoff-1-start.png: JS off, 390, unfiltered start.
- qa-flow-390-jsoff-2-day.png: no-script day form, 2026-11-07, 8 results.
- qa-flow-390-jsoff-3-guests.png: plus 3 guests chip, day kept.
- qa-flow-390-jsoff-4-neighborhood.png: plus Williamsburg, 3 results.
- qa-flow-390-jsoff-5-category.png: plus Ceramics and crafts, 1 result, all four filters kept.
- qa-flow-1280-jsoff-1-start.png: 1280 first load, 5 of 11 cards.
- qa-flow-1280-jsoff-2-day.png: 1280 day form, first load, 5 of 8 cards.
- qa-flow-1280-jsoff-3-guests.png: 1280 plus 3 guests, 5 of 8 cards.
- qa-flow-1280-jsoff-4-neighborhood.png: 1280 plus Williamsburg, 3 results.
- qa-flow-1280-jsoff-5-category.png: 1280 plus Ceramics and crafts, 1 result.
- qa-empty-320-jsoff-light.png: empty result with next-day link, 320.
- qa-empty-390-jsoff-light.png: empty result, 390 light.
- qa-empty-390-jsoff-dark.png: empty result, 390 dark.
- qa-empty-768-jsoff-light.png: empty result, 768.
- qa-empty-1280-jsoff-light.png: empty result, 1280.
- qa-empty-outside-window-390-jsoff-light.png: day outside the window, 390.
- qa-error-320-jsoff-light.png: error state, 320.
- qa-error-390-jsoff-light.png: error state, 390 light.
- qa-error-390-jsoff-dark.png: error state, 390 dark.
- qa-error-768-jsoff-light.png: error state, 768.
- qa-error-1280-jsoff-light.png: error state, 1280.
- qa-skip-link-focused-1280-jsoff.png: first Tab, Skip to main content focused, 1280.
- qa-skip-link-focused-390-jsoff.png: same at 390.
- qa-skip-link-landed-1280-jsoff.png: after Enter and one more Tab, 1280.
- qa-skip-link-landed-390-jsoff.png: same at 390.
- qa-browse-1280-json-light-base.png: JS on, base, 1280 light.
- qa-browse-1280-json-light-after.png: JS on, d9376c1, 1280 light, identical to base.
- qa-browse-390-json-dark-base.png: JS on, base, 390 dark.
- qa-browse-390-json-dark-after.png: JS on, d9376c1, 390 dark, identical to base.
- qa-filters-chain-1280-json-light.png: JS on, chips chain ending at 3 guests, 1280.
- qa-filters-chain-390-json-dark.png: JS on, same chain, 390 dark.
