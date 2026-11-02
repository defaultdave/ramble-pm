PASS

## qa-agent: U-035 "Category and neighborhood pages" (head 5ee5376), round 2

Round 1 (head 37bd503) passed. The delta is wording only, so this round tested only the empty, no-match, error and with-results wording. Production build (`next build`, `next start`) on port 4476 in a scratch worktree at 5ee5376, against a local Postgres database `qa_u035_r2_cat` seeded with `SEED_TARGET=local pnpm db:seed --scale=240`, read through `pnpm db:http` on port 4456 (`NEON_HTTP_ENDPOINT=http://127.0.0.1:4456/sql`). Browser: Playwright Chromium launched from a script with `--single-process --no-zygote`, sandbox on, one browser per width and scheme (390 and 1280 px, light and dark). Servers stopped by PID, database dropped, worktree removed.

States I added to the seed by SQL: categories `glassblowing` (published copy, no experiences) and `tea-ceremonies` (no copy, no experiences); neighborhoods `gowanus` (published copy, no experiences) and `dumbo` (no copy, no experiences). The copy I inserted uses one sentence for both intro and body, so on the two with-copy empty pages that sentence shows twice (above the empty state and below it). That is my fixture, not the app.

Limits, stated rather than guessed:
- `STORAGE_PROVIDER=fake`, so cards show the empty image placeholder. Photos are not covered.
- I did not run unit, component or e2e suites.

### Blocking
None.

### Non-blocking
- The error state is reached on the real routes, but its heading and tab title are generic: "Things to do in New York" and "Things to do in New York | Ramble" for both a category (`wellness`) and a neighborhood (`tribeca`), with HTTP 200. The page does not name the category or neighborhood. Round 1 did not see this state on a real route, so this is new information, not a regression. Wording shown to the user: "We couldn't load this page" / "Something went wrong on our side. Try again in a moment." / "Try again". Audit item for the PM if the heading should carry the page name.
- "Browse all experiences" and "Clear all filters" render about 20 px right of the text above them (button padding on a link-style button). Visible in every empty-state screenshot, not a break.
- Everything non-blocking from round 1 that is not about wording (unknown slug returns 200, no canonical or og tags, Show more navigates to browse, small title link boxes) was not retested and is not changed by this delta.

### Passed
- Empty category, with copy (`glassblowing`) and without (`tea-ceremonies`), at 390 and 1280 px, light and dark: h1 and the "Pick a day or narrow it down" button stay, then the heading "Nothing here yet", the line "New experiences are on their way.", and a "Browse all experiences" link. The old "Nothing matches those filters" and "Clear all filters" wording does not appear on these pages. No cards, no Show more.
- Empty neighborhood, with copy (`gowanus`) and without (`dumbo`), same four combinations: identical wording and link.
- "Browse all experiences" works: on all four empty pages, at 390 px light, a click goes to `/new-york/browse` and the browse page opens with its heading and "Showing 12 experiences". The link's href is `/new-york/browse` on every empty page in every width and scheme.
- `/new-york/browse?category=glassblowing` (a filter that matches nothing) still reads as before: "Nothing matches those filters", "Try another day, or take a filter off.", "Clear all filters". Four combinations checked. "Clear all filters" works: it goes to `/new-york/browse` and the page shows "Showing 12 experiences".
- Landing error state, reached on the real routes: I started the production server with the HTTP database shim not running, so every read failed, then opened `/new-york/things-to-do/wellness` and `/new-york/neighborhoods/tribeca`. Both show the error wording above with a "Try again" button, at all four width and scheme combinations. Clicking "Try again" with the database still down reloads the same page and shows the error again, with no crash.
- Pages with results are unchanged: `/new-york/things-to-do/cooking` (h1 "Cooking classes in Brooklyn", intro, "Pick a day or narrow it down", "Showing 12 experiences", cards) and `/new-york/neighborhoods/williamsburg` (h1 "Things to do in Williamsburg", 12 cards). The 390 px light cooking screenshot matches round 1's `route-category-with-copy-390-light-after.png` (same text, same layout in the part both show).
- No sideways scroll on any page tested (documentElement and body scrollWidth equal the viewport at 390 and 1280, both schemes). Dark mode reads correctly on every page, including the error state.

### Unconfirmed
- After the client-side navigation from an empty page to browse, the DOM briefly listed two h1 elements (the browse heading and the previous page's heading). The screenshot shows one visible heading, so the old page is probably kept hidden by the router, but I did not check that it is hidden.
- Photos on cards (none seeded).

### Evidence
All in `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-035-category-pages/`, all "after" (head 5ee5376). `{W-S}` means the four files 390-light, 390-dark, 1280-light, 1280-dark, written `r2-route-<name>-{390,1280}-{light,dark}-after.png`.
- r2-route-category-empty-with-copy-{W-S}-after.png: `glassblowing`, empty category with copy, new "Nothing here yet" wording.
- r2-route-category-empty-no-copy-{W-S}-after.png: `tea-ceremonies`, empty category with no copy, fallback heading, same wording.
- r2-route-neighborhood-empty-with-copy-{W-S}-after.png: `gowanus`, empty neighborhood with copy.
- r2-route-neighborhood-empty-no-copy-{W-S}-after.png: `dumbo`, empty neighborhood with no copy.
- r2-route-category-empty-with-copy-browse-link-result-390-light-after.png: browse page after clicking "Browse all experiences" on `glassblowing`.
- r2-route-category-empty-no-copy-browse-link-result-390-light-after.png: same, from `tea-ceremonies`.
- r2-route-neighborhood-empty-with-copy-browse-link-result-390-light-after.png: same, from `gowanus`.
- r2-route-neighborhood-empty-no-copy-browse-link-result-390-light-after.png: same, from `dumbo`.
- r2-route-browse-no-match-{W-S}-after.png: browse with `?category=glassblowing`, "Nothing matches those filters" and "Clear all filters", unchanged.
- r2-route-browse-clear-filters-result-390-light-after.png: browse after clicking "Clear all filters".
- r2-route-category-read-error-{W-S}-after.png: category landing error state (`wellness`, database read failing).
- r2-route-neighborhood-read-error-{W-S}-after.png: neighborhood landing error state (`tribeca`, database read failing).
- r2-route-category-with-results-{W-S}-after.png: `cooking`, page with results, unchanged.
- r2-route-neighborhood-with-results-{W-S}-after.png: `williamsburg`, page with results, unchanged.
Round 1 files in the same folder (no `r2-` prefix) remain the reference for the other states.
