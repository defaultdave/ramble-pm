Posted on head 3f5a636. This verdict is on 93d0ee3. 3f5a636 adds one commit after it, a runbook sentence and a comment, which this review asked for. The PM ran every gate on 93d0ee3, and format, lint and the profile test on 3f5a636. No UI change, so no a11y check.

PASS

QA for unit/U-031-browse-keys at 93d0ee3. Method: behaviour walk-through from code and tests, as asked (no browser run; BE-19 is not on main). The four named test files ran: 4 files, 95 tests, all green. The PM's 741 db and 161 e2e runs were not repeated.

## Cases checked

Browse page: BrowseContent reads the filter options first, then `knownFilters` drops slugs the catalog has no row for. If a list had slugs and none is known (`matchesNothing`), dates and results are not read and the page gets `emptyBrowsePage`. The view is built from the original filters, so the address and chips stay as given.

| Case | What a guest sees | Covered by |
|---|---|---|
| `?category=<junk>` | "Nothing matches those filters", text "Try another day, or take a filter off", and a "Clear all filters" link to the browse path. No date or result read. | BrowseContent.test "shows the empty state and reads neither dates nor results when no slug is known"; filters.test "matches nothing when a list has only unknown slugs"; BrowseResults.test "says nothing matches and offers to clear when a filter is on" |
| `?category=<junk>&category=cooking` | Cooking results as normal. Reads use `['cooking']` only, so junk is never a cache key. | BrowseContent.test "reads with the known slugs only"; filters.test "drops an unknown slug beside a known one, in order" |
| `?neighborhood=<junk>&date=<valid>` | Dated empty state, "Nothing on <day>", with an "Any day" link (and Clear all filters, since another filter is on). No reads. | filters.test (date is kept; `matchesNothing` is true for an all-unknown list). The combined page render is not asserted end to end. See Non-blocking 1. |
| junk slugs plus `after=<valid id>` | The same empty state, not the "page has moved" state. `matchesNothing` returns `ok: true` with no items, so the cursor is never consulted. This matches the old behaviour, where a found cursor plus no rows was empty. | Reasoned from code (browseView and emptyBrowsePage). No test pins this. See Non-blocking 1. |
| valid `after` (page 2) | Next 12 items past the cursor. The cursor row is read once as its own query. The page query compares against the row's name and id as values and does not re-read the cursor. | db tests "reads the cursor row once, and the page query only compares against it" and the existing keyset paging tests (passed by the PM; not rerun by me) |
| `after=<random uuid>` | "That page of results has moved" with a link back to the first results. The data layer sends one query only and skips the page query. The result is not cached (`cacheLife('uncached')`). | db test "sends one query for a cursor nobody can see"; browse.test "uncached profile is named"; browse.test.ts and BrowseResults tests for `cursor_not_found` / outdated |
| `after=not-a-uuid` | `parseFilters` drops the malformed value, so it is the first page of results with no cursor. The change does not touch this path. | Existing filters.test parsing cases (not rerun individually) |
| `/experiences/<slug>-<random uuid>` | 404 page. The lookup returns null under the `uncached` profile, so nothing is cached. One database read per request. | experiencePage.test "keeps nothing for an ID that is no guid or names no visible experience"; page.test "is a not-found when the experience is not visible to guests" |
| `/experiences/garbage` | 404 without any read. `parseExperienceAddress` returns null (no 36-character id), and `notFound()` is called before the server function. The `getExperiencePage` guard for non-guids also returns `uncached`. | routes.test (`parseExperienceAddress` rejection cases); experiencePage.test (`not-a-uuid` case); page.test |
| a real experience | Unchanged: the page renders, cached under the `catalog` profile with its tags. | experiencePage.test (a visible one names no other profile); page.test "renders the page of a visible experience" |
| "Clear all filters" link and address kept | The link goes to the plain browse path. The address is never rewritten; the view uses the original `filters`. | BrowseResults.test and FilterBar.test for the link. The "kept as given" claim rests on code reading only. See Non-blocking 2. |

## Blocking

None.

## Non-blocking

1. No test renders the page for `?neighborhood=<junk>&date=<valid>` or for junk slugs plus a valid `after`. BrowseContent.test only exercises `category=junk` and the mixed list. Both cases follow from code that is covered in pieces (knownFilters keeps the date; emptyBrowsePage is `ok: true`). One more BrowseContent case for each would pin them.
2. No test asserts that the address and filter chips stay as given for an unknown slug. The BrowseContent.test header comment says so, but no assertion checks it (for example, FilterBar receiving the original `filters`).
3. Reading dates and results only after `getFilterOptions()` resolves makes that part of the work sequential rather than parallel. The options read is cached, so the cost is small. Informational only.
4. The `after=not-a-uuid` row relies on existing parsing tests. It is not new coverage for this unit.
