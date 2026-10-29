Posted on head 9f735e2; the PM ran every gate on it, including all 737 db tests against local Postgres. No UI change, so no a11y check.

PASS

Head 9f735e270845d74f9da6d0fc61c083e8fdc82a12. Code and db-test walk-through only; no browser run (BE-19). The db tests could not run here: `pnpm exec vitest run --project db ...` fails in afterAll with `client` undefined (3 files, 269 skipped), so Postgres is unreachable from the sandbox. I relied on the PM's 737-pass run.

## Paths checked
- Browse card with a cover: src/server/db/browse.ts listBrowseExperiences joins guestCoverOf laterally and maps `image: coverImage(joined)`. src/lib/experienceCards.ts toExperienceCard uses `experience.image ?? null`. Test: tests/db/browse.db.test.ts "carries the lowest-position photo, and a null image for an experience with none".
- Browse card without a cover: leftJoinLateral keeps the row and coverImage(null) gives null, so the card draws with no image. Same db test.
- On this week: src/server/home.ts getThisWeek calls listHomeExperiences(ids, {covers: true}); src/server/db/home.ts loads `photos: coverWith` (limit 1, order by position). Tests: tests/db/home.db.test.ts "carries the lowest-position photo as the cover when covers are asked for", "still lists an experience with no photo, with a null image"; src/server/home.test.ts "covers: true".
- Picks: getHomeContent passes {covers: false}; no image is set and the page's separate cover read still applies. homeCardIds and withHomeCovers now cover Picks only (src/lib/home.ts). Test: tests/db/home.db.test.ts "leaves the cover out when covers are not asked for".
- Gift guide: still uses listGuestCoverPhotos (src/server/db/photos.ts), rewritten as an innerJoinLateral on the same cover rule, with guestVisible and a limit. Behaviour unchanged: a hidden or draft experience yields no cover.
- Pick and gift guide item order: src/server/db/editorial.ts readCollections aggregates `json_agg(... order by collection_items.position)` per collection, with `coalesce(..., '[]')` for none. The collection order is still title then id, and the result goes through CollectionSchema.
- Hidden or draft item in a Pick: the items subquery inner-joins experiences and applies guestVisible when forGuest, so those rows are not aggregated. A collection whose items are all hidden gets `[]`, not a dropped collection, same as before. Listing and visibility cases are in tests/db/editorial.db.test.ts, which I could not run.
- Browse error state: BrowseContent.tsx has one try/catch around the options, dates and results reads. Any failure goes through rethrowOrLog and renders errorView(query) with the retry target. The test "logs only the digest and kind of a failed content read and renders the error state" is kept.
- Next-page cursors: splitPage(rows, browsePageSize) runs on the raw rows before the cover is mapped, so nextCursor is unchanged. The cursor row read (visibleCursor) is untouched.

## Blocking
None.

## Non-blocking
- Behaviour change: a failed cover read used to degrade to cards without images (the removed test "logs only the digest and kind of a failed cover read and renders the cards without images"). The cover now rides the results query, so a cover failure shows the full error state. It is consistent with the one-query intent. Confirm this is wanted.
- The lateral join and json_agg SQL ran only in the PM's local Postgres run, not here.
