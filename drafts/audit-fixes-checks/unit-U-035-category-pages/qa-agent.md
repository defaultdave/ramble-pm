PASS

## qa-agent: U-035 "Category and neighborhood pages" (head 37bd503)

Tested a production build (`next build` then `next start`, port 4475) in a scratch worktree, against a local Postgres database `qa_u035_cat` seeded with `SEED_TARGET=local pnpm db:seed` (curated set) plus `--scale=240`, read through `pnpm db:http` on port 4455. Browser: Playwright Chromium, light and dark, at 320, 390, 768 and 1280 px. All servers stopped by PID, database dropped, worktree removed.

Limits of the environment, stated rather than guessed:
- Chromium refuses to launch normally under the sandbox (Mach port permission denied). It ran only with `--single-process --no-zygote`. Screenshots and DOM measurements were taken that way; I did not run the shared e2e suite, so the e2e lock was not needed.
- `STORAGE_PROVIDER=fake`, so the seed writes no photos (runbook). Every card shows its empty image placeholder. Photo rendering is not covered.
- The "We couldn't load experiences" error state was not reproduced on the real route (cached pages kept serving). It is seen only in the builder's Storybook capture.
- Seed changes I made by SQL to reach the states: category `wellness` copy set to draft, `park-slope` copy deleted, two categories added (`glassblowing`: no experiences, no copy; `tea-ceremonies`: no experiences, copy cloned from `kids`, so its meta description reads as kids copy).

### Blocking
None.

### Non-blocking
- Unknown slug returns HTTP 200, not 404. `/new-york/things-to-do/nope` and `/new-york/neighborhoods/nope` render the "We can't find that page" screen with `<meta name="robots" content="noindex">`, so users and crawlers are handled, but the status line is 200 (streamed not-found). `/picks/nope` behaves the same on this build, so it is an app-wide pattern, not new in U-035. A path outside the app (`/new-york/nonexistent-route`) returns a real 404. The not-found page's `<title>` is the generic "Things to do in New York | Ramble". Audit item for the PM if a real 404 status is wanted.
- Empty category (no experiences) shows "Nothing matches those filters / Try another day, or take a filter off / Clear all filters" with no filter applied. The wording is wrong for a category that is simply empty, and "Clear all filters" goes to `/new-york/browse`. The page does keep its h1, the browse link and the footer, and has no sideways scroll.
- Pages with no published copy (draft copy on `wellness`, no row on `park-slope`) fall back to a generic title heading ("Wellness experiences in New York", "Things to do in Park Slope") and the site-wide meta description "A marketplace for things worth doing." on every such page. No copy block appears under the list. Acceptable fallback; duplicate descriptions are a small SEO weakness.
- No `<link rel="canonical">` and no `og:` tags on the new pages. The home, browse and picks pages have none either, so this predates the unit (audit item).
- Show more on a landing page does not append in place. It navigates to `/new-york/browse?category=cooking&after=<cursor>` (heading "Browse experiences", filter chip "Cooking" set) and later clicks continue on browse. Works, and the button is 342x46, but the user leaves the category page and loses its heading and copy. Flagging for the PM to confirm this is intended. Keyboard focus lands on `body` after the first Show more navigation.
- Experience card title links measure 20 to 21 px high and 197 to 331 px wide. The whole card is the hit area (element at the card centre resolves to the title link on every card I could measure in view). Treated as a pass for the 44 px target rule. The footer "Terms" link is 41x44 px at every width (shared footer, not this unit).

### Passed
- Category page with seeded data and published copy (cooking, 36 live experiences): h1 "Cooking classes in Brooklyn", intro paragraph, "Pick a day or narrow it down", "Showing 12 experiences", 12 cards, Show more, then the two-paragraph editorial body under the list. Title "Cooking classes in Brooklyn | Ramble" and the meta description come from the published copy.
- Neighborhood page with copy (williamsburg, 53 live): h1 "Things to do in Williamsburg", copy title and description, 12 cards, same layout.
- Neighborhood with no copy row (park-slope) and category with unpublished copy (wellness) both render the list with the fallback heading above.
- Category with no experiences, with copy and without (tea-ceremonies, glassblowing): h1 plus empty state, no cards, no Show more.
- Browse link: "Pick a day or narrow it down" goes to `/new-york/browse?category=cooking` and `/new-york/browse?neighborhood=williamsburg`, and browse opens filtered (Showing 12 experiences).
- Heading order on every page: one h1, then h2 card titles, then footer h2s. No skipped levels. Not-found page: h1 then footer h2s.
- Sideways scroll: none on any of the 9 routes at any of the 4 widths in either scheme (documentElement and body scrollWidth never exceeded the viewport; 72 combinations).
- Targets under 44 px: only the card title links and footer Terms, as noted. The "Pick a day" button and Show more button are at least 44 px high.
- Dark mode: text, cards, buttons and the not-found page read correctly at all four widths.

### Unconfirmed
- Show more on a category with 12 or fewer live experiences (should hide the button): every seeded category had more than 12 live, so I did not see that state.
- Photo rendering on cards (no photos seeded).

### Evidence
Builder files (Storybook only, not a real route), in `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-035-category-pages/`:
- landing-with-copy-375-light-after.png: landing component with copy, 375 px.
- landing-with-copy-1280-light-after.png: same at 1280 px.
- landing-loading-375-light-after.png: loading skeleton.
- landing-error-375-light-after.png: error state with Try again (not reproduced on the real route).

My real-route files, same folder (named route-*, all "after"):
- route-category-with-copy-{320,390,768,1280}-{light,dark}-after.png: cooking category page, 8 files, top of page.
- route-category-with-copy-390-light-fullpage-after.png: whole cooking page at 390 px.
- route-category-with-copy-390-light-bottom-after.png: Show more button and editorial copy under the list.
- route-category-copy-unpublished-{390-light,1280-dark}-after.png: wellness with draft copy, fallback heading.
- route-category-empty-no-copy-{390-light,1280-dark}-after.png: glassblowing, empty state.
- route-category-empty-with-copy-{390-light,1280-dark}-after.png: tea-ceremonies, empty state with copy title.
- route-neighborhood-with-copy-{320-light,390-dark,768-light,1280-dark}-after.png: williamsburg.
- route-neighborhood-no-copy-{320-light,768-dark,1280-light}-after.png: park-slope with no copy row.
- route-category-unknown-slug-{320-light,390-dark,768-light,1280-dark}-after.png: unknown category slug (not-found screen).
- route-neighborhood-unknown-slug-1280-light-after.png: unknown neighborhood slug.
- route-category-show-more-before-390-light-after.png: Show more button in view.
- route-category-show-more-after-click-390-light-after.png: where Show more lands (browse, cursor URL).
- route-category-browse-link-result-390-light-after.png and route-neighborhood-browse-link-result-390-light-after.png: browse page after the browse link.
Raw measurements (headings, metadata, overflow, small targets per page, width and scheme): `/private/tmp/claude-501/qa-u035-shots/audit.json`.
