PASS

Head 9f735e2, `git diff origin/main...HEAD`. Static review; I did not re-run the gates.

## Blocking
None.

## Non-blocking
1. `withItems` in `src/lib/editorial.ts:335` is dead in production code. `readCollections` was its only caller; only `src/lib/editorial.test.ts` (lines 25, 415-441) still uses it. Delete it and its tests. Knip stays green only because the test file imports it.
2. `src/server/db/photos.ts:295` still restates `inArray(experiences.status, [...guestVisibleStatuses])` in another query, while `guestVisible` in `catalog.ts:32` is the shared form. Same predicate, so not a bug. This diff did not add it; fold it into `guestVisible` when next touched.
3. `listHomeExperiences` branches on `covers` three times (the `with` spread, the destructure, the `image` spread). A `covers: false` read yields rows with no `image` key, and `toExperienceCard` turns that into null. That is correct, but it is the one place a future caller could ship cards without covers by mistake. The runbook notes it.
4. `json_agg(... order by position)` orders by `position` alone, as the old query did. Equal positions would come back in arbitrary order. The old read had the same gap, so nothing regressed.

## Evidence
1. SQL.
   - Cover rule: `guestCoverOf` (`photos.ts:~84`) takes the lowest `position`, `limit 1`, correlated on the experience ID. `coverWith` (`photos.ts:~66`) uses the same `coverOrder` and `limit: 1`, so the rule is written once.
   - Visibility, `listGuestCoverPhotos` (`photos.ts:~314`): it applies `guestVisible`, which is the same status set the old `inArray(experiences.status, guestVisibleStatuses)` used. `photos` has no status of its own, so no filter was lost.
   - Visibility, browse (`browse.ts:~208`): the lateral join sits under `shownInBrowse()`, which includes `guestVisible`. The home read filters on `guestVisible` as before.
   - No duplicate rows: a `limit 1` lateral gives at most one cover per experience. In `readCollections` the aggregate lateral always returns exactly one row, and `coalesce(..., '[]')` covers a collection with no items.
   - Items (`editorial.ts:~75-100`): they keep `order by collection_items.position`. The `forGuest ? guestVisible` filter is applied inside the aggregate subquery's `where`, and the inner join to `experiences` is kept. The outer `order by title, id` and `limit` are unchanged.
   - Parsing: `CollectionSchema.array().parse` still validates the JSON. The new db tests (`tests/db/home.db.test.ts`, `tests/db/browse.db.test.ts`) pass for the PM on 737 tests.
2. Cache contents.
   - Both `coverWith` and `coverSelection` list their columns by name. Storage key and rights record never leave the query.
   - `GuestPhotoSchema.parse` runs before `photoView`, so the cached `image` carries only `src`, `width`, `height`, `alt` and `blurDataUrl`.
3. Tags and lifetimes.
   - `getBrowseResults` (`browse` profile) is tagged `catalog` plus `experience:<id>` per item. `getThisWeek` (`browse` profile) is tagged the same way.
   - Both lifetimes are shorter than the old `catalog`-profile cover entry, so a new cover appears no later than before. Browse was already tagged per item.
   - `getHomeContent` keeps `{ covers: false }`. The Picks covers stay in `getCoverPhotos`, on `catalog`, so the cover lifetime does not stretch from 15 to 60 minutes. That matches DECISIONS option C.
4. Repo rules.
   - B2: the cover rule and the card shape's `image` are in `src/server` and `src/lib` as before. `CardImageSchema` is in `src/lib/experienceCards.ts`.
   - B13: no new `catch` in `server/**`. `readGuestCovers` still logs and returns an empty `Map`, as it did before this diff. That is a Map of covers, not a `[]` or `{}` return, and it is the old, accepted decoration path, kept only for Picks.
   - B17: `coverImage`, `coverSelection`, `coverWith` and `guestCoverOf` are shared by all three reads. Nothing restates the cover rule.
   - Comments: no ticket numbers, and no `TODO` without `TODO(U-xxx)`. The new comments state a why.
5. Dead code.
   - `browseCardIds`, `withBrowseCovers` and the `this_week` branch in `homeCardIds` and `withHomeCovers` are removed, along with their tests. `readGuestCovers` and `getCoverPhotos` stay in use for Picks.
   - The runbook (`docs/runbooks/home.md`) is updated to match.
   - The one leftover is `withItems` (non-blocking item 1).
