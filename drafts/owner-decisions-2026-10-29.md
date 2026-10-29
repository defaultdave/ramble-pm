# Owner decisions from the deep review (2026-10-29)

Every open owner decision from the home pass (`audits/home-2026-10-28.md`), the browse and experience pass, and the nightly audit of 2026-10-29, in one place, each with the PM's recommendation. Facts were checked against `main` at `5a595f1`.
To answer: say "approve all", or name the items to change and what they become. Anything not named takes the recommendation.
Each answer is logged as one entry in `DECISIONS.md` and written into the item's Status column in its audit file.

Lanes named under **Effect:** `audit-fixes` (fix PRs to `main` with before-and-after evidence), `lib-refactor` (the H-18 PRs A to G and the items they absorb), PM (measurements, records, no code), and the owner's own files (`.claude/standards/architecture.md`, the Figma variables).

## Group 1: layout and DRY

Done already: H-18 and H-42, the `src/lib` layout, adopted 2026-10-29 (seven PRs, A to G). The refactor still needs these four inputs from the owner.

**H-41 (a).** Home and browse count sessions with different window edges; which convention do both pages use?
Options: home's (start > from, start <= to), or browse's (start >= from, start < to).
**Recommend:** browse's, start >= from and start < to, for both pages.
**Why:** it is the half-open interval every other date range in the repo uses, browse's runbook already documents it, and home moves only the session that starts exactly on the minute cut.
**Effect:** one PR in `lib-refactor` (PR D, `sessionWindow.ts`): one `upcomingWindow` and one named predicate `isUpcomingSession`, with `db/home.ts:71-72` and `db/browse.ts` calling it; the db tests pin both edges.

**H-41 (b).** Should a browse date whose sessions are all sold out still match (and still be offered in the calendar)?
Options: keep browse's current behaviour (sold-out days match and are offered), or drop them as home's "On this week" already does.
**Recommend:** drop them. A day with no open session is not offered and does not match.
**Why:** BE-7 is already marked fix (Dave, DECISIONS 2026-10-29) for the same reason: a guest who picks a day and sees only sold-out cards has been offered nothing, and the booking bar already calls that state "No open dates".
**Effect:** the same PR D: a second named predicate, `isOpenSession` (open space, in the window), used by home's week list and by browse's day query through a `src/lib`-owned predicate, so the B2 rule holds; a sold-out case in `tests/db/browse.db.test.ts`. N1029-16's `spacesLeft` folds into it.

**H-26.** Categories link to two places (the home rail to browse with a category filter, which is `noindex`; the experience breadcrumb to `/new-york/things-to-do/<slug>`, the indexable PRD-65 page, today a placeholder). Which is the one category address?
Options: browse with a filter, or the things-to-do page.
**Recommend:** the things-to-do page, `/new-york/things-to-do/<slug>`, as the single `categoryPath` in `routes.ts`.
**Why:** it is the indexable address design doc 3.2 gives a category, and the breadcrumb already uses it; a browse filter is a view of results, not a page.
**Effect:** `lib-refactor` PR A defines `categoryPath` once and the breadcrumb keeps using it. The home rail switches to it inside U-035, when the page stops being `RoutePlaceholder`; until then the rail keeps the browse filter so the demo click-through does not land on a placeholder. Two addresses remain until U-035, on purpose.

**H-61.** `HomeError` and `ExperienceError` become one `PageError`; they have drifted on the title size (home `display-l`, experience `display-m`). Which size does the shared component take?
Options: `display-l` (40 px, 64 px on desktop) or `display-m` (32 px, 48 px on desktop).
**Recommend:** `display-m`.
**Why:** the browse and experience page titles are `display-m`, Figma's S3 error frame is drawn on the browse page, and home's loaded h1 is visually hidden, so `display-l` matches nothing a guest sees.
**Effect:** one component PR in `lib-refactor` (after PR C): `PageError` with the `display-m` title, the retry button sized to its content from 768 px (H-65 below), used by home, the experience page and browse (which replaces its third retry pattern, `ErrorNotice`).

**Zero price.** The PM ruled how a zero price reads (H-45, which the refactor absorbs). The owner can overrule.
Options: "Free" everywhere; or "$0" on cards and "Free" on the page, as today.
**Recommend:** a zero price reads "Free" on cards, in the booking panel and on the experience page, with no "From" in front of it, even when other options cost. One function, `perPersonAmount` beside `cardPriceLabel` in `pricing.ts`.
**Why:** "$0 per person" reads like a mistake, "From Free" reads like a joke, and one wording in one place is the point of the refactor. PM ruling (2026-10-29): a card whose lowest space-taking option is free reads plain "Free", with no "From", even when other options cost; the per-person line on the experience page reads "Free" for a zero price. The owner can overrule.
**Effect:** `lib-refactor` PR C (`experienceCards.ts` and `pricing.ts`), covering `BookingPanel.tsx:137` too; tests for free, mixed and paid cases.

## Group 2: caching and H-1

The pass measured the three H-1 variants (home audit, "Performance measurements"). The lab cannot tell them apart below about 300 ms per database round trip, because the h1 is the LCP element and React reveals it about 300 ms after first paint behind four render-blocking stylesheets. The cold base page waits about 4 round trips plus 0.2 s for the h1; variant b stays flat at about 0.16 s; variant a helps only when the cache is warm and adds a layout-shift path.

**H-22.** The H-1 choice depends on one number nobody has: the Neon HTTP round trip from a Vercel function in region. Approve the measurement?
Options: measure on a preview deployment (no code change), or decide H-1 without it.
**Recommend:** measure. The PM measures p50 and p95 on a preview deployment, warm and after Neon autosuspend, before H-1 is decided.
**Why:** the audit's own reading: the variants separate only when a round trip costs about 300 ms, and 150 ms p95 is the line where four cold round trips start to show. Evidence: cold h1 at 40 ms per query is 359 ms, at 300 ms per query 1531 ms (stream table, state C).
**Effect:** a measurement by the PM, written into the audit file under H-22; no code. The owner approves only the measurement.

**H-1.** Does home keep waiting on all three reads (base), stream "On this week" in its own boundary (a), or move editorial content into the static shell (b)?
Options: base, a, b.
**Recommend:** decided by H-22's number with the audit's rule: under about 150 ms p95, keep base and record the decision; above it, variant b, with H-39's four conditions as its acceptance criteria. Variant a is out.
**Why:** a brings no cold gain (same h1 as base, one round trip slower for the week), adds a layout shift when the week is empty or its read fails, and only hides the warm wait; b is the only variant that moves the cold h1 (0.16 s at every latency measured), at the cost of a build that reads the database (H-39).
**Effect:** nothing until H-22 reports. Under 150 ms: a DECISIONS line and the audit row closed. Over 150 ms: one PR in `audit-fixes` from `variant-b.patch`, scoped by H-39.

**H-34.** The h1 is the LCP element; four render-blocking stylesheets (12.9 KB on the wire) and the Suspense reveal gate its paint, so data-side changes barely move lab LCP. Not an owner decision; listed so the owner sees the order.
Options: none to choose.
**Recommend:** a performance PR after the H-22 measurement: inline or trim the blocking CSS, render the static hero h1 outside the Suspense boundary, then re-measure.
**Why:** the audit's reading says this lever is in front of every data lever, and the nightly run confirms nothing changed (still four blocking stylesheets, h1 still LCP).
**Effect:** one PR in `audit-fixes`, after H-22; Lighthouse before-and-after under applied throttling (the PRD-68 method, DECISIONS 2026-10-29).

**H-35.** In production Next's in-memory `'use cache'` handler drops an entry at `revalidate` and does not serve it stale, and the comment in `cacheProfiles.ts` says the opposite (`:4-5` on `main`: "serves the entry while it refreshes it in the background"). Fix the comment, and switch the home reads to `'use cache: remote'`?
Options: fix the comment and verify the platform handler first; or move to `'use cache: remote'` now.
**Recommend:** fix the comment now, a one-line PR with no decision. Then verify on a preview whether the deployed Vercel cache handler serves stale entries and shares `updateTag` across instances. Decide `'use cache: remote'` only if it does not.
**Why:** the remote cache is reserved by `cache-conventions.md` for short-lived shared reads behind `readRemoteOrFallback`, and moving hour-long editorial reads there is a direction change that one preview check can make unnecessary.
**Effect:** one PR in `audit-fixes` (the comment); one preview check by the PM, recorded under H-35; a further decision only if the check fails.

**H-36.** The week read's cache key changes every minute, so the first guest of each minute waits on the database (148 ms warm h1 at 40 ms per query). Widen the cut to about five minutes?
Options: keep the one-minute cut, or widen it (a product call: "starts after now" would then include sessions that began up to five minutes ago).
**Recommend:** keep the one-minute cut.
**Why:** the wait it causes is H-1's problem and is fixed there; a wider key would show a guest a session that has already started, and the audit confirms the minute key adds no misses over a fixed key.
**Effect:** nothing; the row closes as "kept".

**H-37.** A cold home request makes 10 queries in 4 sequential round trips, and the cover read is the fourth stage. Fold the reads?
Options: leave the reads as they are, or return covers with the experiences and read collections with their items in one query, on home and browse.
**Recommend:** yes, a small data PR: covers come back with the experiences in `listHomeExperiences`, collections are read with their items in one query (`readCollections` in `db/editorial.ts` makes two today), and browse gets the same.
**Why:** it cuts the cold path by one or two round trips at every latency, with no product change and no cache-shape change.
**Effect:** one PR in `audit-fixes`, sequenced after `lib-refactor` PR C so the card schema moves once; db tests for the joined reads.

**H-38.** "On this week" reads the first 500 scheduled sessions with a sequential scan and drops sold-out ones in code, so the module can come up short while later sessions are open. Add the index, and move the sold-out rule into SQL?
Options: index only; index plus the rule in SQL (the H-7 trade-off, the rule then lives in SQL and in `src/lib`).
**Recommend:** add the partial index now, no decision needed (`sessions (starts_at) where status = 'scheduled'`; the only index on `main` is `sessions_experience_starts_at_idx` on `(experience_id, starts_at)`, which does not serve this scan). Move the sold-out rule into SQL through a predicate that `src/lib` owns, the same pattern PR D uses for H-41, so the B2 rule holds and the rule is still written once.
**Why:** the index is free; the SQL rule is what makes the 500-row cap correct, and the shared predicate keeps it from becoming a third copy (H-7, H-69).
**Effect:** a migration in `audit-fixes` (it takes the next free number after U-005's and U-014a's `0009`); the predicate in `lib-refactor` PR D.

**H-39.** The conditions if variant b is chosen: the build reads the database (CI has none today, `docs/runbooks/home.md:38`); a failed read at build or regeneration must not bake the error state into the shell; the scratch patch deleted stories and tests; the hero date fallback loses its default day (H-9).
Options: only relevant if H-1 picks b.
**Recommend:** only if variant b is chosen. Its four conditions become that PR's acceptance criteria: (1) a decided way for builds to reach a database; (2) a test that a failed regeneration keeps the last good shell; (3) the stories and tests restored; (4) the hero date fallback with its default day.
**Why:** each condition is a way variant b can ship a worse page than base; writing them as acceptance criteria is what stops that.
**Effect:** nothing unless H-1 picks b; then they are the spec of that `audit-fixes` PR.

**H-47.** Every listing change evicts the hour-long home entry through the `home` and `catalog` tags (`cacheTags.ts:49-57` on `main`), although the per-experience tags already cover what the page shows. Narrow it?
Options: leave the tags; or the listing change stops sending `home`, and `catalog` comes off `getHomeContent` (or a narrower tag).
**Recommend:** yes. The listing change stops sending `home`, and `catalog` comes off `getHomeContent` (`src/server/home.ts:34`), or home takes a narrower tag.
**Why:** `getHomeContent` already tags itself with `experience:<id>` for every card it shows, so a listing change still reaches it where it matters; the category and neighborhood lists it reads are covered when H-53 has home call the cached `getFilterOptions`, which carries `catalog` itself.
**Effect:** one PR in `audit-fixes` with a tag test; pairs with H-53.

## Group 3: design departures and visual

Default rule used here: match Figma or the design doc, unless the audit shows Figma is itself inconsistent, in which case record a departure with the chosen values. Visual evidence: `evidence/audit-home-2026-10-28/` (80 files) and `evidence/nightly-2026-10-29/`.

**H-28.** The self-hosted Fraunces file has only a weight axis, no optical size, so display headings set wider than in Figma and the desktop h1 wraps "to do / this weekend" where Figma keeps "this" on line one. Ship the optical-size axis or record a departure?
Options: self-host a wght+opsz subset (121 KB against 37 KB), or record a departure.
**Recommend:** record a departure (PM confirmed: the optical-size subset would add about 84 KB in front of the LCP heading).
**Why:** the opsz axis adds about 84 KB in front of the h1, which is the LCP element (H-34), on a page whose fonts already cost 86 KB on the wire; the visible difference is one line break on the desktop h1 and slightly wider headings. Revisit when real photos take over LCP (H-17).
**Effect:** a line in `audits/design-departures.md` with the values (Fraunces wght only, 37 KB); no code.

**H-33.** The logo link (32 px), the desktop nav links (36 px) and the footer links (24 px) miss the design doc's 44 px target while passing WCAG 2.5.8. Raise them?
Options: raise all three to 44 px; or raise the logo and nav, and record 24 px as intended for the footer (ADR 0005 names 24 px; the design-system plan and the tone checklist say 44 px for everything tapped).
**Recommend:** 44 px for all three: logo and nav by padding plus a negative margin, footer links by row padding (the tone checklist's C3, which the owner signed off, says 44 px for everything tapped; the footer costs a few pixels of row height).
**Why:** the footer's eight links sit in 24 px rows; a 44 px target either overlaps the next link or doubles the footer's height, and ADR 0005 already sets 24 px as the floor.
**Effect:** one PR in `audit-fixes` covering `Header.module.css` (`.home`, `.navLink`) and the footer's link rows; no departure to record.

**H-65.** The home error state's "Try again" button is 1152 px wide on desktop (`HomeStates.module.css:60`, `flex: 1`), while the experience and browse error states cap theirs. Size it to its content from 768 px, or add a desktop S3 frame that says otherwise?
Options: cap the button from 768 px, or draw a desktop S3 frame.
**Recommend:** size it to its content from 768 px, matching `ExperienceError` (`max-inline-size: 20rem` from 768 px).
**Why:** no Figma frame shows a full-width button on desktop, and the experience page already made this call.
**Effect:** falls out of H-61's `PageError` PR (`lib-refactor`); nothing separate.

**H-66.** Sections have about 16 px more space at each boundary than Figma (categories 154 px tall against 130 on phones, 186 against 154 on desktop; `.section` padding is `--space-8` on phones and `--space-12` from 768 px). Figma is itself inconsistent between frames. Pick values or record a departure?
Options: match one of Figma's values, or record a departure with the current values.
**Recommend:** record a departure with the current values (32 px on phones, 48 px from 768 px), and keep the rail padding, which gives the focus ring room.
**Why:** the audit says Figma disagrees with itself here, so there is no single value to match, and the current tokens are the next spacing steps up.
**Effect:** a line in `audits/design-departures.md`; no code.

**H-67.** On phones, Picks cards take 85% of the column (291 px, a 59 px peek of the next card), where Figma uses the full column (342 px, an 8 px peek). Match Figma or record the departure?
Options: match Figma, or record the departure.
**Recommend:** match Figma: full-column cards with the 8 px peek (`HomeModules.module.css:106-112`, `.rail > li { flex: 0 0 85% }`).
**Why:** Figma is consistent here, and the full-column card gives the photo and the title the width the frame was drawn for.
**Effect:** one PR in `audit-fixes` with 320 and 390 px before-and-after shots; the same rule is checked on the "On this week" rail, which shares the CSS.

**H-68.** Copy on the seeded home differs from Figma: the gift guide heading and body, the Picks summary, and "See all 6" against 12. Seed the copy, or let the gift guide fall back to its collection's title and summary as Picks does?
Options: give the seeded gift guide module a heading and body, or add the fallback to the collection's title and summary.
**Recommend:** the fallback. The gift guide module takes its collection's title and summary when it has none of its own, exactly as Picks does (`src/lib/home.ts:445-449` today falls back to fixed copy), and the seed puts Figma's body copy in the gift guide collection's summary. The count stays the real item count.
**Why:** one rule for both module kinds, no fixed copy in code, and "12" in Figma is fixture data, not design.
**Effect:** one PR in `audit-fixes`: the lib fallback with a test, the seed summary, a 390 px before-and-after against `figma-01-home-44-10.png`.

**H-70.** No field-height token: `Input.module.css:30` pins the field at 52 px as a literal because `tokens.css` has only `size/touch-target` (44) and `size/content-max`; `HomeStates.module.css:196` writes the same height as `calc(var(--size-touch-target) + var(--space-2))`. Add a Figma variable, and does B16's literal list gain sizes?
Options: add `size/field-height` (52 px) in Figma and regenerate; and separately, widen B16 to size literals or leave it.
**Recommend:** add the `size/field-height` variable (52 px) in Figma, regenerate `tokens.css`, and use `var(--size-field-height)` in both files; it pairs with the lg Button height. Do not widen B16 now.
**Why:** `tokens.css` is generated from the Figma variables, so the token needs the variable first (the PM's B16 rulings of 2026-10-28 follow the same rule); widening B16 before the border-width and ring tokens exist would make every focus ring in the repo a violation.
**Effect:** the owner adds the variable in Figma; one PR in `audit-fixes` regenerates the tokens and swaps the two literals. B16 is revisited once the border-width and ring-geometry variables exist, in one standards edit.

**H-73.** The checkout, host and ops layouts import only `tokens.css`, so their native controls get no `color-scheme` (H-21 fixed the guest layout through `base.css:5-10`). Where does `color-scheme` live?
Options: the three layouts import `base.css` as the guest layout does, or `color-scheme` moves into `tokens.css`.
**Recommend:** the three layouts import `base.css`.
**Why:** `tokens.css` is generated from Figma and holds only variables; `base.css` is the place for the shell's base rules, and those layouts will need its full-height column too when they get pages.
**Effect:** a three-line PR in `audit-fixes` (`src/app/(checkout)/layout.tsx`, `(host)/layout.tsx`, `(ops)/layout.tsx`), with a dark-mode shot of a native control on one of them.

**H-80.** The line-height tokens are fixed pixels (`tokens.css:79-88`, for example `--font-line-height-body-m: 24px`), so a select's line box does not grow under text-only scaling (the date input grows to 54 px, the select stays 52) and large text can clip elsewhere. Which unit?
Options: rem, or unitless ratios.
**Recommend:** unitless ratios, produced by the token generator from the existing Figma pairs (line-height px divided by font-size px, so `body-m` becomes 1.5). Mechanism (PM confirmed): `scripts/tokens/build.ts:129` writes every number as px today, so the generator changes and the Figma variables stay as they are.
**Why:** a unitless line-height scales with whatever font size the browser lands on, which is what text-only zoom needs, and computing it from Figma's pairs keeps Figma the single source without adding variables.
**Effect:** one PR in `audit-fixes`: the generator change, regenerated tokens, and a 200% text-only zoom shot of the hero row before and after. No Figma edit if the generator route is confirmed; otherwise the owner changes the ten line-height variables first.

**N1029-7.** The page gutter is set per module, so pages disagree with the header: on phones the header, browse and footer use 16 px while home, the home states and the experience page use 24 px; from 768 px browse sits 8 px left of the header. Which phone gutter?
Options: 16 px or 24 px on phones; 24 px from 768 px either way.
**Recommend:** 24 px on phones and 24 px from 768 px, as one `--gutter` token (a `size/gutter` Figma variable) used by the header, footer, browse, home, experience and error pages, plus the Picks rail's negative margin and BE-13's pages. PM confirmed 24 px: Figma 01 Home at 390 px draws a 342 px card, which is 24 px gutters, and one token ends the per-module drift (N1029-7).
**Why:** home's frame is the only measured evidence, and it says 24; one token ends the drift.
**Effect:** the owner adds the variable in Figma; one PR in `audit-fixes` regenerates the tokens and swaps the gutters, with 390 and 768 px shots of every page edge against the header.

## Group 4: the rest

No row in the browse and experience audit still asks for an owner call: BE-21 is decided (applied throttling), BE-13, BE-8, BE-7, BE-14 and BE-1 are marked fix, and BE-5 (a cover failure takes browse down) is settled by H-50 below.

**H-23.** Nobody had audited the loaded live home page for accessibility. The nightly run of 2026-10-29 then ran axe (WCAG 2.2 AA plus best practice) on the loaded home, browse and one experience page, light and dark, at 320 and 1280 px: zero violations, 320 px reflow passes, labels, focus order and text spacing pass. Not run: the skeleton, empty and error states live, and keyboard stops past the date field. Does this close H-23?
Options: close it on the nightly run; or keep it open until the states and the keyboard pass are run live.
**Recommend:** close H-23 on the nightly run, and log the two gaps as one new item that the PM runs on the demo deploy (the three states forced live, and a keyboard pass through the hero row).
**Why:** the live sweep the item asked for exists and is clean; the gaps are small and bounded, and a closed item with a named follow-up is clearer than an open one that is mostly done.
**Effect:** a PM run on https://ramble-sand.vercel.app with the results added to the evidence folder; no code unless it finds something.

**H-50.** A failed cover-photo read replaces the whole home page with `HomeError` (`HomeContent.tsx:34-45`), although cards already have a missing-image state. Browse has the same shape (BE-5).
Options: A, keep failing closed (matches `readOrRefuse`, B13 and browse today); B, render the cards with `image: null` and log the failure, on home and browse.
**Recommend:** B, on both pages.
**Why:** a cover photo is decoration the card is built to live without, so a photo outage should cost the photos and not the page; the catch logs its kind and renders, so it is not the empty catch B13 forbids, and the content reads still fail closed through `readOrRefuse`.
**Effect:** one PR in `audit-fixes` covering `HomeContent.tsx` and `BrowseContent.tsx:38-45` (BE-5's cover half): the cover read in its own try with a logged kind, a test that cards render without images when it fails, and BE-5's zone check stays its own item.

**N1029-18.** `.claude/standards/architecture.md` does not list the image port or `sharp`, which PR 205 added (`src/server/ports/image/` and its lint zone). The file is the owner's.
Options: none; two line edits.
**Recommend:** the owner makes these two edits on `main`:
- Line 19, the ports list: change `` (`payments`, `availability`, `email`, `storage`, `rate-limit`, `clock`) `` to `` (`payments`, `availability`, `email`, `storage`, `image`, `rate-limit`, `clock`) ``.
- Line 38, the vendor SDK list: change `` `@vercel/blob`, `@sentry/*`, `botid`, `web-vitals` `` to `` `@vercel/blob`, `sharp`, `@sentry/*`, `botid`, `web-vitals` ``.
**Why:** the architecture audit reads this file; without the lines, the next audit of any image code can flag the port as an unwrapped SDK.
**Effect:** the owner's own file (a `PM bookkeeping:` PR the PM drafts and the owner bypass-merges, as on 2026-10-29); no product code.

**H-11.** The first `db-migrate-production` run on 2026-10-28 migrated a database other than Vercel's production one (the `production-database` secret pointed elsewhere; fixed the same day). The stray database may be a leftover Neon branch or project.
Options: none; an owner check.
**Recommend:** the owner opens the Neon console, finds the branch or project that received the nine migrations, and deletes it if it is stale.
**Why:** Neon Free allows 10 branches and the Prototype's previews already press on that cap; the PM does not handle database URLs.
**Effect:** the owner's own account; the PM closes the row on the owner's word.

## Answer sheet

| ID | Decision | Recommended option | Approve? |
|---|---|---|---|
| H-41 (a) | Session window edges | browse's: start >= from, start < to, both pages | yes (2026-10-29) |
| H-41 (b) | Sold-out browse days | not offered, do not match | yes (2026-10-29) |
| H-26 | One category address | `/new-york/things-to-do/<slug>`, rail switches in U-035 | |
| H-61 | PageError title size | `display-m` | |
| Zero price | Zero-price wording | "Free", never "From Free" or "$0"; a free lowest option reads "Free" | |
| H-22 | Measure Neon round trip | yes, PM on a preview, p50 and p95 | |
| H-1 | Home read shape | by H-22: under 150 ms p95 base, above it variant b; never a | |
| H-34 | Blocking CSS and h1 | performance PR after H-22, no decision | |
| H-35 | Cache handler comment | fix the comment now; verify stale and `updateTag` on a preview; remote only if it fails | |
| H-36 | Week key width | keep one minute | |
| H-37 | Fold the cold reads | yes, small data PR, home and browse | |
| H-38 | Index and sold-out in SQL | index now; rule in SQL via a lib-owned predicate | |
| H-39 | Variant b conditions | acceptance criteria, only if b | |
| H-47 | Home cache tags | listing stops sending `home`; `catalog` off `getHomeContent` | |
| H-28 | Fraunces optical size | record a departure (wght only) | |
| H-33 | 44 px targets | logo, nav and footer links all to 44 px | |
| H-65 | Try again width | content width from 768 px, via H-61 | |
| H-66 | Section spacing | record a departure: 32 px phone, 48 px desktop | |
| H-67 | Picks card width | match Figma: full column, 8 px peek | |
| H-68 | Gift guide copy | fallback to the collection's title and summary; real count | |
| H-70 | Field-height token | add `size/field-height` 52 in Figma; B16 unchanged | |
| H-73 | `color-scheme` on other layouts | the three layouts import `base.css` | |
| H-80 | Line-height units | unitless, computed by the token generator | |
| N1029-7 | Page gutter | 24 px at every width, one `--gutter` token | |
| H-23 | Live a11y sweep | close on the nightly run; PM runs the two gaps | |
| H-50 | Cover read failure | B: cards without images, logged, home and browse | |
| N1029-18 | Standards file | owner adds `image` (line 19) and `sharp` (line 38) | |
| H-11 | Stray Neon database | owner checks the console and deletes it if stale | |
