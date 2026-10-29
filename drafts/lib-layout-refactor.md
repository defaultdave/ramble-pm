# `src/lib` layout refactor: PRs A to G

The four page modules (`src/lib/home.ts`, `browse.ts`, `experiencePage.ts`, `siteNav.ts`) move into `src/lib/pages/` and keep only page composition; the general helpers hiding in them (addresses, the venue day and minute cut, duration labels, the card pipeline, the session window, display text, the banner text, rich-text paragraphs) move into flat shared modules named for what they do (`routes.ts`, `venue.ts`, `time.ts`, `duration.ts`, `experienceCards.ts`, `sessionWindow.ts`, `displayText.ts`, `richText/paragraphs.ts`, plus additions to `pricing.ts`, `settings.ts`, `filters.ts` and `spaces.ts`), and a lint zone stops shared modules from importing page modules again. Why: general helpers live in page modules and page modules import each other, so a price bug had to be fixed in two card builders and every new unit that imports them widens the split (H-18, H-42). Dave adopted the layout as proposed on 2026-10-29 (DECISIONS.md, "`src/lib` layout adopted"), PRs A to G in order. Every file and line in this plan was checked against `main` at `5a595f1` by one manifest and two adversarial verdicts per PR; where a verdict corrected the manifest, the correction is what appears here. Builder estimate for A to G together: **16 to 35 hours**, the sum of the per-PR ranges below. The follow-up PRs after G are not in that figure.

Companion documents: the adopted proposal is the "H-18 proposal" section of `audits/home-2026-10-28.md`; builder rules are `drafts/wave3-builder-rules.md`; review rules are `drafts/wave3-review-rules.md`.

## Order and rules

- **One at a time, in order A, B, C, D, E, F, G.** Every PR touches `src/lib/home.ts`, `browse.ts`, `experiencePage.ts` and their tests, so they do not run in parallel. One builder, one PR at a time, each cut from `main` after the previous one merged.
- **Merge `main` before every push.** The builder merges `main` into its branch (merge, never rebase) before each push and reruns every gate on the merge commit.
- **PR D's H-41 inputs are answered** (Dave, 2026-10-29: browse's edges on both pages; sold-out days not offered). D still waits on B and on the `audit-fixes` BE-7 PR. Earlier rule, kept for the record: if an answer had been late, E and F would have run before D; D then follows F and G follows D.
- **PR G is last and its manifest is recut after F lands.** A to F change G's call-site list (A retargets `HomeHero.tsx`, `HomeEmpty.tsx`, `GuestShell.tsx` to `routes.ts`; C deletes `HomeCardItem.tsx`; F retargets `GuestBanner.tsx` to `settings.ts`). The PM regenerates G's call-site list from `main` before the builder starts.
- **Held branches.** `unit/U-014a` (going into `integration` today) touches `src/lib/pricing.ts` (PR C) and `src/lib/settings.ts` (PR F). C and F make only additive changes to those two files (new exports appended), and the builder merges `main` first; if U-014a has been promoted to `main` by then, no further action. `unit/U-005` touches no file in A to G; it edits `tests/lint-boundaries.test.ts`, which G does not touch (G's zone test has its own filename).
- **Unit ID on every PR.** The required `scope-manifest` check (`scripts/merge-desk/scope-check.ts`) fails any PR whose title does not start with a unit ID from `docs/plan/units.yaml` or whose branch is not `unit/<id>[-suffix]`; `docs/plan/units.yaml` has no unit for this refactor and a `PM bookkeeping:` PR cannot add one. The PM ruled the carrier units on 2026-10-29 (DECISIONS), by the unit that introduced most of the code each PR moves: A `unit/U-031-routes`, B `unit/U-030-time`, C `unit/U-031-cards`, D `unit/U-030-session-window`, E `unit/U-007-rethrow-or-log`, F `unit/U-030-display-text`, G `unit/U-030-lib-pages`. PR titles and commits read `<UNIT>: <title>`; the lane PM records the branch in its STATUS section when the builder starts.
- **Gates, exactly as CI:** `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip`, `env -u DATABASE_URL pnpm build`, `gitleaks`; `pnpm test:db` for any PR that touches `tests/db/**` or a schema used there (C, D, F); `pnpm storybook:test` for any PR that touches `src/components/**` (A, B, C, F, G). `knip` fails on any compatibility re-export left behind without an importer, so every move deletes the old name cleanly.
- **Lint zones that bind the new modules:** `src/lib/**` may import only `src/lib` and pure libraries (no react, next, server-only), and may not call `new Date()` without an argument or `Date.now()` (`eslint.config.boundaries.mjs`). Every new module takes `now` or `asOf` as an argument.
- **Evidence.** Where a change is visible (H-63 in B, H-45 in C) the PR carries before-and-after PNGs under `evidence/pr/<branch>/` per the Evidence rule in `drafts/wave3-builder-rules.md`.
- **Audit bookkeeping.** When a PR opens, the lane PM marks each absorbed audit row `fix:`; when it merges, `closed:`. H-2 closes when A, B, C and E have landed and Components-1 (H-58) has landed.

| PR | Title | Waits on | Hours | Audit items absorbed |
|---|---|---|---|---|
| A | `routes.ts`: one home for every guest address | nothing; goes first | 2 to 4 | H-43, H-44, the address side of H-26, H-2 (addresses), DRY evidence (route imports `experiencePath` from `@/lib/home`) |
| B | `venue.ts`, `time.ts`, `duration.ts` | A merged | 2 to 4 | H-63, H-2 (venue day, minute cut, `durationLabel`), N1029-15 (the `time.ts` and `seed/coverage.ts` part), DRY evidence (`experiencePage.ts` imports `durationLabel` from `./browse`) |
| C | `experienceCards.ts` and `ExperienceCardItem` | A and B merged | 4 to 8 | H-25, H-45, H-2 (card builders, price wording), N1029-14 (the three restated row schemas) |
| D | `sessionWindow.ts` | B merged; the `audit-fixes` BE-7 PR merged (H-41 answered 2026-10-29) | 2 to 6 | H-41, N1029-16 (BE-7's predicate is consolidated here; the fix itself lands in `audit-fixes`) |
| E | server and app cleanup | the previous PR merged (no code dependency) | 2 to 4 | H-51, H-52, BE-6, BE-10, H-2 (read-or-refuse wrapper) |
| F | display text, `bannerText`, paragraphs | the previous PR merged | 2 to 4 | H-57 |
| G | rename into `src/lib/pages/` plus the lint zone | F merged; manifest recut | 2 to 5 | H-42 |
| | **Total** | | **16 to 35** | |

## Owner inputs still needed

Only these are Dave's. Everything else in this plan is settled by the PM.

1. **H-41, edge convention (blocks D).** `upcomingWindow` carries one edge rule. Home today excludes a session starting exactly at the minute cut and includes one exactly at the window's end (`start > from`, `start <= to`); browse is the reverse (`start >= from`, `start < to`). Whichever is chosen, one page's edge flips and that page's tests change. PM recommends home's rule (a session starting this very minute is not bookable), written into `isUpcomingSession`.
2. **H-41, sold-out days on browse (blocks D).** Does a browse date whose only sessions are sold out still match the date filter and appear on the calendar? The browse audit already marks BE-7 (browse offers sold-out days) as `fix: priority 3` with the fix "one shared open-session predicate for browse and home", which points at "no". PM recommends "no": browse uses `isOpenSession` in `db/browse.ts` SQL and the seed mirror, with a sold-out case in `tests/db/browse.db.test.ts`.
3. **H-26, one category target (after A).** The home rail links to browse with a category filter (noindex); the experience breadcrumb links to `categoryPath` (`/new-york/things-to-do/[slug]`, the indexable PRD-65 page, still a placeholder). PR A keeps both. PM recommends the breadcrumb target once U-035 builds that page, and the browse filter until then.
4. **H-61, title size for `PageError` (Components-4).** `HomeError` and `ExperienceError` have drifted on title size; one component needs one size. PM recommends the experience page's size, since that page has the most copy above the fold.

## PR A: `routes.ts`

Every guest address in one module (design doc 3.2), the browse URL grammar in one place, and the experience page stops inventing a status to build a path.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/lib/routes.ts
    src/lib/routes.test.ts
  edited
    src/lib/home.ts
    src/lib/home.test.ts
    src/lib/browse.ts
    src/lib/browse.test.ts
    src/lib/experiencePage.ts
    src/lib/experiencePage.test.ts
    src/lib/siteNav.ts
    src/lib/filters.ts
    src/lib/filters.test.ts
    src/components/HomeModules/HomeHero.tsx
    src/components/HomeStates/HomeEmpty.tsx
    src/components/GuestShell/GuestShell.tsx
    src/components/FilterBar/FilterBar.tsx
    src/components/BrowseResults/BrowseResults.tsx
    src/app/(guest)/experiences/[slugAndId]/page.tsx
    docs/runbooks/browse.md
    docs/runbooks/experience.md
OUT OF SCOPE:
  venue, time and duration helpers (PR B); the card pipeline and price wording (PR C);
  windows and AsOfSchema (PR D); page catch blocks and src/server/browse.ts (PR E);
  presentText, textLines, bannerText, docOfText (PR F); the rename into src/lib/pages/ (PR G);
  the H-26 choice of one category target (owner); e2e/routes.ts and its literal address table;
  src/lib/catalog.ts, sessions.ts, pricing.ts, settings.ts, editorial.ts (unit/U-014a; import only);
  every file on unit/U-005.
REFERENCE CODE:
  src/lib/filters.ts (hrefForFilters, noFilters: the grammar owner routes.ts must not import);
  src/lib/pricing.ts cardPriceLabel (how a shared helper was lifted out of home.ts and browse.ts in PR 220);
  e2e/experience.spec.ts:51-53 (the retry URL contract experiencePath must keep).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `browsePath` (two copies) | `src/lib/home.ts:108`, `src/lib/filters.ts:6` | `routes.ts` `browsePath`; `filters.ts` imports it | Identical constants. Delete both; every importer switches to `@/lib/routes`. |
| `browseHref` (home copy) and `BrowseTarget` | `src/lib/home.ts:110-130` | deleted; `home.ts:413` calls `hrefForFilters({ ...noFilters, categories: [slug] })` | Encoding differs (`encodeURIComponent` vs `URLSearchParams`) but slugs carry no reserved characters, so the rendered href is unchanged; `home.test.ts:558-576` is the regression check and stays. `filters.test.ts:245-252` already covers escaping. |
| hero parameter names | `src/components/HomeModules/HomeHero.tsx:58` (`name="neighborhood"`), `:74` (`name="date"`) | `filters.ts` exports `browseParamNames` (rename the private `paramNames` at `filters.ts:13-18`); `HomeHero` reads them | `HomeModules.test.tsx:58-64` asserts the literal names and `:118-124` parses the sent form with `parseFilters`; both stay as the contract check. `HomeHero` has no `'use client'`, so importing `filters.ts` adds nothing to the client bundle. |
| `experiencePath` and `experienceAddress` (one function twice) | `src/lib/home.ts:133-138`, `src/lib/browse.ts:210-215` | `routes.ts` `experiencePath({ slug, id })`, `guidePath({ slug, id })`, `experienceCardPath(experience)` choosing by status | Callers in A are the two card builders (`home.ts:189`, `browse.ts:247`) and `page.tsx:63`, which drops the invented `status: 'live'` and calls `experiencePath(address)`. `experienceCards.ts` does not exist until C. |
| `parseExperienceAddress` | `src/lib/experiencePage.ts:23-40` (type and doc at 23-29, function at 30-40; `maxAddressLength` at :21 goes with it) | `routes.ts`, beside `experiencePath` | PM ruling: inbound and outbound address code live together. `docs/runbooks/experience.md:7` names its old home and changes. |
| `picksPath(slug)`, `giftGuidePath`, `picksAnchor`, siteNav's `'/#picks'` | `src/lib/home.ts:140-147`, `src/lib/siteNav.ts:6` | `routes.ts` `picksPath(slug)` (`/picks/[slug]`), `giftGuidePath`, `picksAnchor` (the fragment id), `homePicksHref` (`/#picks`) | `GuestShell.test.tsx:121` asserts the header links are exactly `['/new-york/browse', '/#picks', '/gifts']`, so `homePicksHref` keeps the literal value. |
| `categoryPath`, `neighborhoodPath`, `giftCheckoutPath`, `privateSessionPath`, footer literals `/help`, `/contact`, `/accessibility`, `/legal/terms`, `/legal/privacy` | `src/lib/experiencePage.ts:42-51`, `src/lib/siteNav.ts:28-37` | `routes.ts` `categoryPath`, `neighborhoodPath`, `giftCheckoutPath`, `contactPath`, `helpPath`, `accessibilityPath`, `legalPath(doc: 'terms' \| 'privacy')`; `privateSessionPath` stays as a named alias of `contactPath` | The footer keys links by address (`siteNav.ts:15`, `GuestShell.test.tsx:128`), so `legalPath('terms')` and `legalPath('privacy')` must stay distinct values. |

Already done, for the record: `cardPriceLabel` moved to `pricing.ts` in PR 220 (`5121048`); nothing else in A's scope has landed.

### Call sites to change

- `src/lib/home.ts:6-9` (import from `./routes`, and `hrefForFilters`, `noFilters` from `./filters`); `:106-147` (delete the Addresses section); `:189` (`toHomeCard` href: `experienceCardPath`); `:413` (category rail: `hrefForFilters`); `:435` (seeAll: `picksPath`); `:448` (gift guide action: `giftGuidePath`); `:492` (anchor: `picksAnchor`).
- `src/lib/home.test.ts:6,12` (drop `browseHref`, `experiencePath` imports); `:164-200` (delete the `browseHref` and `experiencePath` blocks; the `experiencePath` cases move to `routes.test.ts`). `:558-576` stays.
- `src/lib/browse.ts:5` (`browsePath` import moves from `./filters` to `./routes`); `:209-215` (delete `experienceAddress`); `:247` (`toBrowseCard` href: `experienceCardPath`); `:325-326` (`targetFor`: `browsePath` from routes).
- `src/lib/browse.test.ts:16,235-247` (drop the `experienceAddress` import and block; cases move to `routes.test.ts`).
- `src/lib/experiencePage.ts:21-51` (delete `maxAddressLength`, `parseExperienceAddress` and the four path exports; import from `./routes`); `:384,386,416,417` (breadcrumb, `giftHref`, `privateSessionHref`).
- `src/lib/experiencePage.test.ts:7,11,19,23` (drop path imports); `:106-113` (the `paths` describe moves to `routes.test.ts`); the `parseExperienceAddress` cases move with the function. `:425` keeps its literal `/contact` as an assertion.
- `src/lib/siteNav.ts:1` (import from `./routes` instead of `./home`); `:6` (delete the local `picksPath`); `:10-12,20-22,28-37` (every href from `routes.ts`). `siteNav.ts` then imports only from `routes.ts`.
- `src/lib/filters.ts:6` (delete `browsePath`; import from `./routes`); `:13-18` (export `paramNames` as `browseParamNames`); `:121` (`browseHref` uses the imported `browsePath`).
- `src/lib/filters.test.ts`: no forced edit (its expectations are the literal `/new-york/browse` and it imports no `browsePath`); add one `browseParamNames` case.
- `src/components/HomeModules/HomeHero.tsx:6` (`browsePath` from `@/lib/routes`, `browseParamNames` from `@/lib/filters`); `:46,58,74`.
- `src/components/HomeStates/HomeEmpty.tsx:2,15`; `src/components/GuestShell/GuestShell.tsx:4,25,27` (stops importing from `home.ts`); `src/components/FilterBar/FilterBar.tsx:8,115` (`browsePath` from routes; `hrefForFilters` stays from filters); `src/components/BrowseResults/BrowseResults.tsx:7,124`.
- `src/app/(guest)/experiences/[slugAndId]/page.tsx:11,63` (`experiencePath(address)` from `@/lib/routes`, no status).
- `docs/runbooks/browse.md:7` (routes.ts owns `browsePath`; `filters.ts` stays the grammar owner; the sentence "nothing else builds a browse address" becomes true). `docs/runbooks/experience.md:7` (`parseExperienceAddress` now in `routes.ts`).
- `routes.test.ts` fixtures: import `id` from `./experiencePage.fixtures` or write a two-line local helper; pick one.
- Literal `/contact` in fixtures and assertions stays as contract checks, not routed through `routes.ts`: `src/components/ExperiencePage/ExperiencePage.fixtures.ts:49,87,115`, `src/components/ExperiencePage/ExperiencePage.test.tsx:128`, `src/components/Footer/Footer.stories.tsx:23,30`. Component fixtures, stories and tests carry hrefs as literal props and import none of the moved helpers; no `vi.mock` of `@/lib/home`, `filters`, `siteNav` or `experiencePage` exists.

### Risks and checks

- `routes.ts` stays dependency-free at runtime (type imports only, declaration-level `import type`). It must not import `filters.ts` (zod, catalog, sessions would ride into every component that links anywhere, and `filters.ts` imports `browsePath`, so it would be a cycle). The `lib-packages` lint zone also forbids react, next and server-only in `src/lib`.
- `knip` fails on any compatibility re-export (for example `experienceAddress`) left behind; delete cleanly. Exports used only by `routes.test.ts` pass, since test files are entries.
- `experiencePath(address)` keeps producing `/experiences/<slug>-<id>` exactly: `e2e/experience.spec.ts:51-53` asserts the retry URL.
- The footer's two legal addresses stay distinct values or React keys collide.
- Storybook job: `HomeModules.stories.tsx` renders `HomeHero`, which now imports `filters.ts` (zod, `./catalog`, `./sessions`, `@internationalized/date`); all browser-safe, but run `pnpm storybook:test`.
- Second literal copies of addresses stay out of scope and are listed in Suggestions: `e2e/routes.ts`, `e2e/browse.spec.ts:10`, `e2e/home.spec.ts:43,56,65,70,80`, `src/lib/securityHeaders.ts:13`, `src/server/ports/email/render.tsx:40`.
- Held branches: none of A's files is on `unit/U-005` or `unit/U-014a`. U-014a edits `catalog.ts`, `sessions.ts` and `pricing.ts`, which A's files import but do not edit. Stale `unit/U-030*`, `U-031*`, `U-039`, `U-010` branches carry no unmerged content on these files.
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- `picksPath(slug)` is `/picks/[slug]`; the home anchor link is `homePicksHref` (`/#picks`), with `picksAnchor` the fragment id.
- Both category targets stay for now: the home rail to browse with a filter (`hrefForFilters`), the breadcrumb to `categoryPath`. The H-26 choice is Dave's and comes later; the builder does not pick one.
- Names: `contactPath`, `helpPath`, `accessibilityPath`, `legalPath(doc: 'terms' | 'privacy')`; `privateSessionPath` stays as a named alias of `contactPath`.
- `parseExperienceAddress` moves beside `experiencePath` into `routes.ts`.

## PR B: `venue.ts`, `time.ts`, `duration.ts`

Leaf helpers with one allowed behaviour change: the no-break space in `durationLabel` (H-63).

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/lib/venue.ts
    src/lib/venue.test.ts
    src/lib/time.ts
    src/lib/time.test.ts
    src/lib/duration.ts
    src/lib/duration.test.ts
  edited
    src/lib/home.ts
    src/lib/home.test.ts
    src/lib/browse.ts
    src/lib/browse.test.ts
    src/lib/experiencePage.ts
    src/lib/experiencePage.test.ts
    src/lib/seed/coverage.ts
    src/app/(guest)/HomeContent.tsx
    src/app/(guest)/new-york/browse/BrowseContent.tsx
    src/server/home.ts
    src/server/browse.ts
    tests/db/seed.db.test.ts
    src/components/Card/Card.stories.tsx
    src/components/Card/Card.test.tsx
    src/components/BrowseResults/BrowseResults.stories.tsx
    src/components/BrowseResults/BrowseResults.test.tsx
    src/components/ExperiencePage/ExperiencePage.fixtures.ts
    src/components/ExperiencePage/ExperiencePage.test.tsx
    src/components/HomeModules/HomeModules.fixtures.tsx
    docs/runbooks/home.md
    docs/runbooks/browse.md
OUT OF SCOPE:
  routes (PR A, landed); the card pipeline (PR C); thisWeekWindow, browseWindow, AsOfSchema (PR D,
  they stay in the page modules and import msPerDay); catch blocks (PR E); display text (PR F);
  the rename (PR G); the hero copy "Anywhere in New York" (HomeHero.tsx:61) and the siteNav tagline;
  the day literals in src/lib/seed/plan.ts and src/lib/sessions.ts (follow-up after U-014a);
  src/lib/sessions.ts, pricing.ts, catalog.ts, settings.ts, editorial.ts, rateLimits.ts (held branches;
  do not tidy their 60_000 / 86_400_000 literals).
REFERENCE CODE:
  src/lib/home.ts:55-62 (homeAsOf: how a lib helper takes `now` and builds `new Date(cut)` with an argument,
  the shape the clock lint rule allows); src/lib/browse.ts:96-110 browseDays (the per-zone formatter cache
  calendarDateFormat must keep working); src/lib/richText/href.ts and href.test.ts (module plus colocated test).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `venueTimeZone` | `src/lib/home.ts:40-41`, `src/lib/browse.ts:21-22` | `venue.ts`, exported | Same private const `'America/New_York'` with the same doc comment. |
| `venueDate` (the en-CA `YYYY-MM-DD` formatter) | `src/lib/home.ts:43-48`, `src/lib/browse.ts:27-32` | `venue.ts` as `const venueDate = calendarDateFormat(venueTimeZone)`, built once at module load | Same `Intl.DateTimeFormat` options as `dayInZone`, so no third copy. |
| `venueToday(now)` | `src/lib/home.ts:50-53`, `src/lib/browse.ts:34-37` | `venue.ts` | Identical bodies. `docs/runbooks/home.md:26` names it without a module path, no edit needed. |
| `venueCity` | nowhere on main | `venue.ts`, with its one caller `src/lib/experiencePage.ts:235` (`${first}, ${venueCity}` in the Maps query) | PM ruling. Without a caller the export fails `knip`. |
| `MS_PER_MINUTE`, `MS_PER_DAY` | `src/lib/home.ts:37-38`, `src/lib/browse.ts:24-25` | `time.ts` `msPerMinute`, `msPerDay` | `thisWeekWindow` (`home.ts:71`) and `browseWindow` (`browse.ts:58`) stay in the page modules until D and import `msPerDay`. `msPerMinute` stays exported only if `time.test.ts` uses it, else private. |
| `homeAsOf(now)`, `browseAsOf(now)` | `src/lib/home.ts:55-62`, `src/lib/browse.ts:39-46` | `time.ts` `minuteAsOf(now)` | Identical bodies. Rename at every call site, comment and runbook line; no re-export shims. |
| `dayInZone(zone)` | `src/lib/browse.ts:82-89` (private; one caller at `:105` inside `browseDays`) | `time.ts` `calendarDateFormat(zone): Intl.DateTimeFormat`, built once per zone | Returns the formatter so `browseDays`' per-zone cache (`browse.ts:98`) is unchanged. |
| `isoDateOf` | the `slice(0, 10)` at `src/lib/seed/coverage.ts:134-137` | `time.ts` `isoDateOf`; `coverage.ts` calls it, and its `dayMs` at `:85` becomes `msPerDay` | The `time.ts` and `seed/coverage.ts` part of N1029-15; `seed/plan.ts` and `sessions.ts` wait for U-014a. `tests/db/seed.db.test.ts:240` (`const dayMs`) may use `msPerDay` since the file is in scope. |
| `durationLabel(minutes)` | `src/lib/home.ts:151-159`, `src/lib/browse.ts:199-207` | `duration.ts`, with a no-break space between number and unit (H-63) | Identical bodies. Callers `home.ts:181`, `browse.ts:239`, `experiencePage.ts:1,370` (the import from `./browse` is the only thing `experiencePage` takes from browse; after B it imports nothing from browse). |
| `durationLabel` test blocks | `src/lib/home.test.ts:203-214` (6 cases), `src/lib/browse.test.ts:220-233` (8 cases, adds 90 and 1440) | `duration.test.ts`, one table (browse's is the superset), every expectation written with `' '` | Not "delete one block": the two differ. |
| `venueToday` test blocks | `src/lib/home.test.ts:89-107` (5 cases, clocks-go-back night), `src/lib/browse.test.ts:71-89` (5 cases, end of year) | `venue.test.ts`, all ten | Each table has edge cases the other lacks. |
| `homeAsOf`/`browseAsOf` tests | `src/lib/home.test.ts:110-114`, `src/lib/browse.test.ts:92-102` | `time.test.ts` (`minuteAsOf`, `calendarDateFormat` direct test, the constants, `isoDateOf`) | The `thisWeekWindow` tests (`home.test.ts:116-135`) and `browseWindow` tests (`browse.test.ts:104+`) stay; drop "homeAsOf and" / "browseAsOf and" from their describe names. `home.test.ts:131` ("accepts the key homeAsOf writes") survives as "accepts the key minuteAsOf writes". |

### Call sites to change

- `src/app/(guest)/HomeContent.tsx:7-13` (drop `homeAsOf`, `venueToday` from `@/lib/home`; add `minuteAsOf` from `@/lib/time`, `venueToday` from `@/lib/venue`); `:30`; `:53`.
- `src/app/(guest)/new-york/browse/BrowseContent.tsx:5-12` (drop `browseAsOf`, `venueToday` from `@/lib/browse`); `:33`; `:71`.
- `src/lib/home.ts:34` (comment names `homeAsOf`); `:37-62` (delete constants, venue block, `homeAsOf`; import `msPerDay` from `./time`); `:71`; `:151-159` (delete `durationLabel`; import from `./duration`); `:181`.
- `src/lib/browse.ts:21-46` (delete venue block, constants, `browseAsOf`; import `msPerDay`, `calendarDateFormat` from `./time`); `:58`; `:82-89` (delete `dayInZone`); `:105`; `:199-207` (delete `durationLabel`); `:239`.
- `src/lib/experiencePage.ts:1` (`durationLabel` from `./duration`); `:235` (`venueCity`); `:370`.
- `src/lib/seed/coverage.ts:1` (`minuteAsOf` from `@/lib/time`; keep the `browseWindow` import); `:85` (`dayMs` becomes `msPerDay`); `:128`; `:134-137` (`isoDateOf`).
- `tests/db/seed.db.test.ts:5,238,299` (`browseAsOf` becomes `minuteAsOf`); `:240` optional.
- `src/lib/home.test.ts:5-28` (imports); `:31,32,35` (behaviour header comments: the venue-day and duration lines move to the new test files; `:32` "the ISO instant homeAsOf writes" becomes `minuteAsOf`); `:89-107`, `:109-135`, `:203-214` (blocks move as above); `:221` and `:259` (`'Greenpoint · 2 hr'` gains the no-break space).
- `src/lib/browse.test.ts:2-28` (imports); `:32-33,39` (behaviour header lines move); `:71-89`, `:91-102`, `:220-233` (blocks move); `:254` (`'DUMBO · 2 hr'`).
- `src/lib/experiencePage.test.ts:344` (keyFacts duration text `'2 hr'`) and `:371` (`summary` `'Tribeca · 2 hr · Ages 14 and up'`, built by `experiencePage.ts:389-394` from the keyFacts texts). Five assertions in all, not four; missing the fifth ships a red suite.
- `src/server/home.ts:60` and `src/server/browse.ts:35` (doc comments: `minuteAsOf`).
- `docs/runbooks/home.md:36` and `docs/runbooks/browse.md:35` (`homeAsOf`/`browseAsOf` become `minuteAsOf`).
- Hand-written `'N hr'` strings switch to the no-break space so the H-63 story shows the fix (PM ruling): `src/components/Card/Card.stories.tsx:30,38`, `Card.test.tsx:16,103`, `BrowseResults.stories.tsx:13-58`, `BrowseResults.test.tsx:41`, `ExperiencePage.fixtures.ts:12,16,60,67`, `ExperiencePage.test.tsx:58`, `HomeModules.fixtures.tsx:57,63,66,70-73`.
- The three new test files open with a behaviours-under-test header block, as every `src/lib` test does.

### Risks and checks

- Write the no-break space as the escape `' '` in `duration.ts` and every expectation, never as a literal character (`no-irregular-whitespace` flags it outside strings, and a literal one in a string is unreviewable). The reviewer greps the diff for ` ` in exactly `duration.ts`, the five lib assertions and the listed fixtures.
- Clock lint rule: `time.ts` and `venue.ts` take `now` as an argument and construct `new Date(cut)` only with an argument; `eslint.config.boundaries.mjs:132` rejects bare `new Date()` and `Date.now()` in `src/lib/**`.
- `minuteAsOf` must keep producing the exact ISO string `z.iso.datetime()` accepts, since `AsOfSchema` stays in `home.ts` until D; keep the `home.test.ts:131` round trip.
- Import the new modules with relative `./time`, `./venue`, `./duration` inside `src/lib` so PR G's rename touches only those lines.
- Near-collision: `unit/U-014a` adds `src/server/db/time.ts`, the same basename as the new `src/lib/time.ts`. Different paths, no git conflict, but an auto-import could pick the wrong one once U-014a lands.
- Do not tidy `src/lib/sessions.ts:156,206,299` or any other held-branch literal; other `MS` literals that stay (`src/lib/seed/plan.ts:9`, `src/lib/browse.test.ts:107`, `src/lib/home.test.ts:80`, `src/lib/seed/coverage.test.ts:173`) go in Suggestions.
- H-63 evidence: the audit's `loaded` evidence was made with Playwright Chromium from a seeded production build at 320 px, not Storybook. Re-run that capture before and after on a horizontal card at 320 px for the PR body; the fixture change covers the Storybook baseline.
- Held branches: none of B's files is on `unit/U-005` or `unit/U-014a` (verified by merge-base diff).
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- `venueCity` ships with its one caller in `experiencePage.ts`; the hero copy "Anywhere in New York" is untouched.
- Rename `homeAsOf`/`browseAsOf` to `minuteAsOf` at every call site; no re-export shims.
- The stories, fixtures and component tests that hard-code "2 hr" switch to the no-break space in B.
- `calendarDateFormat(zone)` returns an `Intl.DateTimeFormat` built once per zone, as `dayInZone` does.

## PR C: `experienceCards.ts` and `ExperienceCardItem`

One card schema, one card type, one builder, one card component for home and browse (H-25), and price wording in one place (H-45). Waits for A (`experienceCardPath`) and B (`durationLabel`). Line numbers below are at `5a595f1`; A and B shift them, so the builder re-greps before editing.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/lib/experienceCards.ts
    src/lib/experienceCards.test.ts
    src/components/ExperienceCard/ExperienceCardItem.tsx
    src/components/ExperienceCard/index.ts
    src/components/ExperienceCard/ExperienceCardItem.test.tsx and a story (builder rules: a story per state on UI changes)
  edited
    src/lib/home.ts
    src/lib/home.test.ts
    src/lib/browse.ts
    src/lib/browse.test.ts
    src/lib/pricing.ts            (additive: perPersonAmount and fromPriceLabel appended)
    src/lib/pricing.test.ts
    src/lib/booking.ts            (fromPriceLabel leaves)
    src/lib/booking.test.ts
    src/lib/experiencePage.ts
    src/lib/experiencePage.test.ts
    src/lib/photos.ts
    src/lib/photoViews.ts
    src/lib/photoViews.test.ts
    src/server/db/home.ts
    src/server/db/browse.ts
    src/server/home.ts
    src/components/HomeModules/HomeCardItem.tsx   (deleted)
    src/components/HomeModules/PicksSection.tsx
    src/components/HomeModules/ThisWeekSection.tsx
    src/components/HomeModules/HomeModules.fixtures.tsx
    src/components/BrowseResults/BrowseResults.tsx
    src/components/BrowseResults/BrowseResults.stories.tsx
    src/components/BrowseResults/BrowseResults.test.tsx
    src/components/BookingPanel/BookingPanel.tsx
    src/components/BookingPanel/BookingPanel.test.tsx
    src/components/BookingBar/BookingBar.tsx
    tests/db/home.db.test.ts      (:166-173 asserts option.kind; changes when kind is dropped)
    docs/runbooks/home.md
    docs/runbooks/browse.md
  conditional
    src/server/db/photos.ts, tests/db/photos.db.test.ts (only if photoLimits.maxCoverLookups is renamed rather than aliased)
OUT OF SCOPE:
  the open-session predicate and the asOf check difference (PR D, H-41); catch blocks (PR E);
  display text (PR F); the rename (PR G); withHomeCovers and withBrowseCovers (stay in the page modules);
  src/lib/catalog.ts and src/lib/editorial.ts (unit/U-014a; import only, do not export MinorUnitsSchema
  or a PriceOptionSchema pick, that is a follow-up); every other file on unit/U-014a and unit/U-005;
  the skeleton CSS blocks (H-78, Components-6).
REFERENCE CODE:
  src/lib/pricing.ts:164-184 (CardPriceOption and cardPriceLabel, landed in PR 220: the option shape and the
  place perPersonAmount sits beside); src/components/HomeModules/HomeCardItem.tsx and
  src/components/BrowseResults/BrowseResults.tsx:36-60 (the two renderers being merged, h3 vs h2);
  src/lib/photoViews.ts (PhotoView, the type-only import that avoids the cycle).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `HomeExperienceSchema`, `HomeExperience`, `HomePriceOptionSchema` | `src/lib/home.ts:77-94` | `experienceCards.ts` `CardExperienceSchema`, `CardExperience` | Home's price option carries `kind` and `usesSpace`; the merged schema drops `kind` (PM ruling). |
| `BrowseExperienceSchema`, `BrowseExperience`, `BrowsePriceOption` | `src/lib/browse.ts:113-130` | `CardExperienceSchema` | Browse's option has no `kind` and `db/browse.ts:121-146` never reads it. |
| `PriceRow`, `withPriceOptions` | `src/lib/browse.ts:132-150` | `experienceCards.ts` | Callers `db/browse.ts:25,154`; test block `browse.test.ts:188-217` moves. |
| the three restated price-option row schemas (N1029-14) | `src/lib/home.ts:77-81`, `src/lib/browse.ts:113-116`, `src/server/db/browse.ts:121-127` (`PriceRowsSchema`) | one card option schema in `experienceCards.ts`, typed as pricing's `CardPriceOption` (`pricing.ts:165`, `Pick<PriceOption, 'priceMinor' \| 'usesSpace'>`) | Do not import `catalog.ts`'s private `MinorUnitsSchema`; that export waits for U-014a. |
| `HomeCard`, `toHomeCard`, `cardsInOrder` | `src/lib/home.ts:161-218` | `experienceCards.ts` `ExperienceCard`, `toExperienceCard`, `cardsInOrder` | Already calls `cardPriceLabel` (`home.ts:197`). |
| `BrowseCard`, `toBrowseCard` | `src/lib/browse.ts:217-256` | `ExperienceCard`, `toExperienceCard` | Identical to home's except the address function; after A both call `experienceCardPath`. |
| `HomeCardItem` | `src/components/HomeModules/HomeCardItem.tsx:1-33` | `src/components/ExperienceCard/ExperienceCardItem.tsx` (props `card`, `layout`, `headingLevel`) | Home renders h3 (`HomeModules.test.tsx:163-170`). |
| `ResultCard` | `src/components/BrowseResults/BrowseResults.tsx:36-60` | `ExperienceCardItem` | Browse renders h2, always vertical (`BrowseResults.test.tsx:99-112`). |
| `perPersonAmount` (zero reads "Free") | `src/lib/experiencePage.ts:188` (the only Free rule), `src/components/BookingPanel/BookingPanel.tsx:137` (`formatPrice`, no Free rule) | `pricing.ts` `perPersonAmount` beside `cardPriceLabel`; `cardPriceLabel`, `priceLines` and `BookingPanel` use it | H-45. Visible behaviour change: evidence PNGs required. |
| `fromPriceLabel` | `src/lib/booking.ts:4-6` | `pricing.ts`, beside `cardPriceLabel` and `perPersonAmount` | PM ruling; `pricing.ts` stops importing `booking.ts`. Callers `pricing.ts:2,182`, `BookingBar.tsx:5,95`, `booking.test.ts:14`. |
| `maxCardIds` literal | `src/lib/home.ts:26` (`homeLimits.maxCardIds = 240`, derivation comment at `:25`: `editorialLimits.homeModules` (20) x `picksCandidates` (12)) | `experienceCards.ts` `cardLookupLimit` | `experienceCards.ts` must not import `home.ts` for `picksCandidates` (G's zone forbids it): move the factor beside the limit or keep the derivation in a comment. Keep `homeLimits.maxCardIds` as an alias so `home.ts:32,379`, `db/home.ts:41`, `tests/db/home.db.test.ts:228` stay unchanged. |
| `maxCoverLookups` literal | `src/lib/photos.ts:23` (`photoLimits.maxCoverLookups = 240`) | `cardLookupLimit` | Keep `photoLimits.maxCoverLookups` as an alias so `photoViews.ts:31`, `db/photos.ts:245,264`, `tests/db/photos.db.test.ts:796,804`, `docs/runbooks/home.md:46` stay unchanged. |

Already done: `cardPriceLabel` (`pricing.ts:164-184`, tests `pricing.test.ts:329-392`) landed in PR 220. `durationLabel` and `experiencePath` arrive from B and A.

### Call sites to change

- `src/lib/home.ts:2-9` (imports); `:25,:372` (doc comments naming the constant); `:29-32` (`HomeExperienceIdsSchema` uses `maxCardIds`); `:77-94` (schemas removed); `:161-218` (card code removed); `:322,338,348,352,383,421,479` (`HomeModuleView`, `ModuleContext`, `viewOf`, `buildViews`, `HomeInput` now use `ExperienceCard`, `CardExperience`).
- `src/lib/home.test.ts:3` (`toBrowseCard` import), `:5-28`, `:24`, `:55-70` (fixture type), `:138-153`, `:216-279` (`toHomeCard` block moves to `experienceCards.test.ts`), `:283-328` (cross-builder agree block: delete once there is one builder), `:312-316`, `:330-365` (`cardsInOrder` block moves), `:510`.
- `src/lib/browse.ts:2,11-12`, `:113-150` (removed), `:169` and `:181` (`BrowsePage.items`, `BrowseRead.items` retype to `CardExperience[]`; `tests/db/browse.db.test.ts:9` imports `type BrowsePage`, so the alias keeps its shape), `:217-256` (removed), `:309,362`.
- `src/lib/browse.test.ts:12,16,21,22,25`, `:56-70`, `:188-217`, `:249-322` (`:282` asserts `'From $0'` and changes to `'Free'`).
- `src/lib/pricing.ts:2` (drop the `fromPriceLabel` import; define it here), `:164-184` (add `perPersonAmount`); `src/lib/pricing.test.ts:3,329-392` (`:357-363` has the second `'From $0'`, which becomes `'Free'`); `src/lib/booking.ts:4-6` (delete); `src/lib/booking.test.ts:14`.
- `src/lib/experiencePage.ts:188` (`perPersonAmount`); `src/lib/experiencePage.test.ts:218-247` (already asserts "Free").
- `src/lib/photos.ts:22-23`; `src/lib/photoViews.ts:31`; `src/lib/photoViews.test.ts:60,69`.
- `src/server/db/home.ts:3-11` (imports), `:23`, `:37` (stop selecting `kind`), `:41`, `:43`; `src/server/db/browse.ts:17-31` (imports), `:121-130` (`PriceRowsSchema` uses the shared option schema; `ExperienceRow = Omit<CardExperience, ...>` at `:130`), `:136`, `:154-155`; `src/server/home.ts:6-12` (`HomeExperience` type), `:23`, `:56`.
- `tests/db/home.db.test.ts:166-173` (maps `option.kind` into `'adult:8500:false'`; drops `kind`). `tests/db/browse.db.test.ts:291-294,375-378` already `toEqual` `{ priceMinor, usesSpace }` and stay green.
- `src/components/HomeModules/HomeCardItem.tsx` (delete); `PicksSection.tsx:5,7,16,43` (layout vertical, headingLevel 3); `ThisWeekSection.tsx:2,3,8,23` (layout horizontal); `HomeModules.fixtures.tsx:5,40,51,53,69` (`satisfies HomeCard` becomes `ExperienceCard`; Storybook compiles it).
- `src/components/BrowseResults/BrowseResults.tsx:4-6,36-60,71`; `BrowseResults.stories.tsx:4,7`; `BrowseResults.test.tsx:5,35,65`.
- `src/components/BookingPanel/BookingPanel.tsx:7,137`; `BookingPanel.test.tsx:38-39`; `src/components/BookingBar/BookingBar.tsx:5,95-96`.
- `docs/runbooks/home.md:20,46`; `docs/runbooks/browse.md:39`. `home.md:44` (`homeCardIds`, `withHomeCovers`) stays.
- Barrels `src/components/HomeModules/index.ts` and `BrowseResults/index.ts` do not export `HomeCardItem` or `ResultCard`; the new `src/components/ExperienceCard/index.ts` exports `ExperienceCardItem`.

### Risks and checks

- Held branch `unit/U-014a` edits `src/lib/pricing.ts` (deletes the `TODO(U-014a)` lines at `:71` and `:99`). C appends after `:184`, a different hunk; merge `main` first and, if U-014a is already promoted, nothing further. C only imports `catalog.ts` and `editorial.ts`.
- Import cycle: `photos.ts` imports `experienceCards.ts` (`cardLookupLimit`), which needs `PhotoView` from `photoViews.ts`, which imports `photos.ts`. Safe only with a declaration-level `import type { PhotoView }` (with `verbatimModuleSyntax` on, an inline `{ type PhotoView }` specifier keeps an empty runtime import) and never importing `withCovers`. No `import/no-cycle` rule exists to catch a slip.
- `experienceCards.ts` must not import `home.ts` or `browse.ts`; PR G's zone makes that a lint failure.
- H-45 is a visible change: a zero price on a card and in `BookingPanel` moves from "$0" to "Free"; before-and-after PNGs of a free card and the panel at a phone and a desktop width go in the PR.
- Heading levels differ by surface; `ExperienceCardItem` takes `headingLevel` and `layout` explicitly, and both existing tests stay.
- `knip` flags module-level alias exports with no importer (`export type HomeCard = ExperienceCard`, `export { toHomeCard }`); object properties (`homeLimits.maxCardIds`) are not flagged. No alias exports.
- `pnpm test:db` runs `tests/db/home.db.test.ts`; the builder runs it locally or the PM runs it outside the sandbox (DECISIONS 2026-10-28 ruling 4). e2e asserts no card price text or heading levels below h1, so the e2e job is unaffected.
- `pnpm storybook:test` collects the new story under `src/components/**/*.stories.tsx` and runs axe on it.
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- Waits for A and B; no interim imports from `home.ts` or `browse.ts`.
- `CardExperienceSchema` drops `kind` from price options (`cardPriceLabel` never reads it; `db/home.ts` stops selecting it).
- `fromPriceLabel` moves from `booking.ts` into `pricing.ts` beside `cardPriceLabel` and `perPersonAmount`; `BookingBar.tsx` and `booking.test.ts` join the scope.
- Zero-price wording: a price of 0 reads "Free" everywhere; a card whose cheapest space-taking price is 0 reads "Free", never "From Free" and never "From $0". `BookingPanel` reads "Free per person" for a free experience. This is a PM ruling Dave can overrule.

## PR D: `sessionWindow.ts`

One window function and two named predicates for "is this session in the window" and "is it open". Waits for B (`msPerDay` from `time.ts`) and Dave's two H-41 answers.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/lib/sessionWindow.ts
    src/lib/sessionWindow.test.ts
  edited
    src/lib/home.ts
    src/lib/home.test.ts
    src/lib/browse.ts
    src/lib/browse.test.ts
    src/lib/spaces.ts                (spacesLeft, N1029-16)
    src/lib/spaces.test.ts
    src/lib/seed/coverage.ts
    src/lib/seed/coverage.test.ts    (:393-409 pins the seed mirror's edges)
    src/server/home.ts
    src/server/home.test.ts
    src/server/db/home.ts
    src/server/db/browse.ts
    tests/db/home.db.test.ts
    tests/db/browse.db.test.ts       (:837-844 RangeError becomes ZodError; BE-7 sold-out case)
    tests/db/seed.db.test.ts
    docs/runbooks/browse.md          (:41 the window sentence, :55 "the browse window")
    docs/runbooks/home.md            (the read table at :31-41, one sentence naming the shared rule)
OUT OF SCOPE:
  the card pipeline (PR C); catch blocks (PR E); display text (PR F); the rename (PR G);
  H-38 (the sold-out test in db/home.ts SQL for the capped read; tests/db/home.db.test.ts:318-330);
  the +1 day and the maxStoredDayRows derivation comment (browse.ts:62-66 stay in browse);
  src/lib/sessions.ts, pricing.ts, catalog.ts, settings.ts, editorial.ts, src/server/db/holds.ts and
  the holds schema (unit/U-014a); every file on unit/U-005.
REFERENCE CODE:
  src/lib/time.ts (msPerDay, minuteAsOf from PR B); src/lib/home.ts:233-239 (today's inline open-session rule);
  src/server/db/home.ts:70-75 and src/server/db/browse.ts:97-103 (the two SQL edges being unified);
  src/lib/spaces.ts (spacesStatus, spacesLabel: where spacesLeft joins them).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `AsOfSchema` | `src/lib/home.ts:34-35` (private `z.iso.datetime()`; doc names `homeAsOf`, which B renamed) | `sessionWindow.ts`, exported only if `sessionWindow.test.ts` or browse imports it (knip) | Browse has no schema: `browseWindow` validates with `new Date(asOf)` and throws `RangeError` (`browse.test.ts:112-114`). Unifying on zod turns that into `ZodError` and makes browse refuse offset or date-only keys as home does. |
| `thisWeekWindow`, `ThisWeekWindow` | `src/lib/home.ts:64-73` (type at 64, function 66-73; uses `homeLimits.thisWeekDays` at `:24`) | `sessionWindow.ts` `upcomingWindow(asOf, days)` and one window type; home calls `upcomingWindow(asOf, homeLimits.thisWeekDays)` | Importers `src/server/home.ts:10,70`, `src/server/db/home.ts:10,57`, `src/server/home.test.ts:2,122`, `src/lib/home.ts:229`, `home.test.ts:20,87,109-134`, `tests/db/home.db.test.ts:4,106`. |
| `browseWindow`, `BrowseWindow` | `src/lib/browse.ts:48-60` (`to` is `browseDateHorizonDays + 1` days; horizon at `:19`) | `upcomingWindow(asOf, browseDateHorizonDays + 1)`; the `+1` stays at the browse call site | Importers `db/browse.ts:21,30,97,105,187,237`, `browse.test.ts:10,91-114`, `seed/coverage.ts:1,127-128`, `tests/db/seed.db.test.ts:7,239`. Horizon length pinned by `browse.test.ts:104-110`. |
| `isUpcomingSession(session, window)` and `isOpenSession(session, window)` | no helper exists. Home's rule is inline at `src/lib/home.ts:233-239` (live, `start > from`, `start <= to`, `spacesStatus(...) !== 'sold-out'`) plus SQL at `db/home.ts:70-75`; browse's rule is SQL only at `db/browse.ts:97-103` (`scheduledInWindow`, used by `hasSessionOn` 105-119 and `listBrowseDayRows` 237-242); mirrors at `src/lib/seed/coverage.ts:157-163` (`browseResults`, edges at 161-162) and `:91-97` (`upcoming()`, home's strict edge with no end bound, combined with `spacesStatus` at `:397,:420`) | `sessionWindow.ts`: `isUpcomingSession` (in the window) and `isOpenSession` (upcoming and has space) | Two named predicates, no flag (PM ruling). Home calls `isOpenSession`; browse's SQL and seed mirror adopt the same edges, and `isOpenSession` where H-41 answer 2 is "no". Edge tests pinning today: `home.test.ts:390-408`, `tests/db/home.db.test.ts:272-285`, `tests/db/browse.db.test.ts:583-600,688-710`. |
| `spacesLeft` | `src/lib/home.ts:238` (`allocation - seatsSold` inline), `src/lib/seed/coverage.ts:90` | `src/lib/spaces.ts` `spacesLeft({ allocation, seatsSold })`, used by `isOpenSession` and the seed | N1029-16; the one widening outside D's file set. |
| `MS_PER_DAY` | gone after B | `upcomingWindow` imports `msPerDay` from `./time` | D after B, so no third copy. |

### Call sites to change

- `src/server/home.ts:10,70`; `src/server/db/home.ts:10,57`, and `:73-74` (gt/lte edges) under the H-41 answer.
- `src/server/db/browse.ts:21,30,97,105,187,237`, and `:100-101` (gte/lt edges) and the sold-out test under the H-41 answers.
- `src/lib/home.ts:35`, `:64-73`, `:229` (parameter type), `:233-239` (predicate becomes `isOpenSession`).
- `src/lib/browse.ts:48-60`; `:62-66` stays.
- `src/lib/spaces.ts` (add `spacesLeft`); `src/lib/spaces.test.ts`.
- `src/lib/seed/coverage.ts:1`, `:90` (`spacesLeft`), `:91-97` (`upcoming()` uses `isUpcomingSession`), `:127-128` (`seedBrowseWindow`), `:157-163` (`browseResults` mirror; edges at 161-162). `src/lib/seed/coverage.test.ts:393-409` if the browse edge changes.
- `src/server/home.test.ts:2,122`.
- `src/lib/home.test.ts:20`, `:32,41` (behaviour comments), `:87`, `:109-134` (window block moves to `sessionWindow.test.ts`), `:390-408` (edge cases move or re-point).
- `src/lib/browse.test.ts:10`, `:91-114` (window block moves; `:113` `RangeError` becomes `ZodError`; `:107` `86_400_000` uses `msPerDay` when the block moves).
- `tests/db/home.db.test.ts:4,106`, `:272-285` (edge test, changes under H-41).
- `tests/db/browse.db.test.ts:837-844` ("refuses a time it cannot read": `RangeError` becomes `ZodError` for `listBrowseExperiences` and `listBrowseDayRows` with asOf `'soon'`), unconditional once browse adopts `AsOfSchema`; plus the BE-7 sold-out case.
- `tests/db/seed.db.test.ts:7,239`.
- `docs/runbooks/browse.md:41,55`; `docs/runbooks/home.md:31-41` (one sentence naming `src/lib/sessionWindow.ts`). Neither runbook mentions sold-out today; the audit's claim that browse's runbook documents it is unsupported.
- The new module gets a Decisions entry in the builder's report (architecture standard B17: a new cross-cutting `src/lib` module is named with the existing code checked first).

### Risks and checks

- A behaviour change hides in a refactor: whichever edge Dave picks, one page's edge flips. The PR says so in its body and updates that page's tests rather than loosening them.
- Unifying asOf validation on `z.iso.datetime` makes browse refuse keys it accepts today; production keys come from `minuteAsOf` and pass, but every seed or script passing a hand-written asOf is checked.
- Holds: ADR 0002 defines spaces left as `allocation - seats_sold - active unexpired holds`; `home.ts:238` ignores holds, and `unit/U-014a` introduces them. `spacesLeft` takes the formula as it stands today and the PR body says so; folding holds in is U-014b's business. Confirm the formula with the critical-path lane before merging.
- BE-7 (browse offers sold-out days) is a guest-facing bug, so the `audit-fixes` lane fixes it first with a `src/lib`-owned predicate used by `db/browse.ts` SQL and a sold-out case in `browse.db.test.ts` (PM ruling 2026-10-29). PR D waits for that PR to merge and consolidates the predicate into `sessionWindow.ts` as `isOpenSession`; it does not re-fix the bug.
- Keep H-38 (the sold-out test inside the capped `db/home.ts` read, `tests/db/home.db.test.ts:318-330`) out of D unless Dave decides it with H-41.
- Clock lint rule: `upcomingWindow` takes `asOf` and never reads the clock.
- Held branches: none of D's files is on `unit/U-005` or `unit/U-014a` (verified by merge-base diff of the local branches `unit/U-005` at `50b1116` and `unit/U-014a` at `6502a1d`).
- Merge `main` before push and rerun every gate, including `pnpm test:db`.

### PM rulings for this PR

- Two named predicates in `sessionWindow.ts`, `isUpcomingSession` (in the window) and `isOpenSession` (upcoming and has space), rather than a flag.
- D waits for B (`time.ts`).
- The two H-41 questions (edge convention; whether browse shows sold-out days) are Dave's. The browse audit already marks BE-7 as a fix, which points at "no" for the second.

## PR E: server and app cleanup

Page catch blocks log the error kind beside the digest through one helper, and browse drops its private read wrapper for the shared one. No `src/lib` files.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/server/monitoring/rethrowOrLog.ts
    src/server/monitoring/rethrowOrLog.test.ts
  edited
    src/app/(guest)/HomeContent.tsx
    src/app/(guest)/HomeContent.test.tsx
    src/app/(guest)/new-york/browse/BrowseContent.tsx
    src/app/(guest)/new-york/browse/BrowseContent.test.tsx
    src/app/(guest)/GuestBanner.tsx
    src/app/(guest)/GuestBanner.test.tsx
    src/app/(guest)/experiences/[slugAndId]/page.tsx
    src/app/(guest)/experiences/[slugAndId]/page.test.tsx
    src/server/browse.ts
    src/server/browse.test.ts
    docs/runbooks/browse.md
    docs/runbooks/home.md
    docs/runbooks/experience.md
OUT OF SCOPE:
  anything under src/lib (including the stale sentence at src/lib/errorDigest.ts:3-4, logged as a suggestion
  for a later lib PR) and src/components; H-50 cover-read behaviour; H-53 category read; Sentry
  captureException from a page catch (a separate item); src/server/monitoring/heartbeat.ts and
  heartbeat.test.ts and every other file on unit/U-005 and unit/U-014a.
REFERENCE CODE:
  src/server/cache/readOrRefuse.ts:9-31 and its test (CachedReadError, the shared wrapper and its message shape);
  src/server/home.ts:35,69 and src/server/coverPhotos.ts:21 (read naming: 'Home', 'This week', 'Cover photos');
  src/lib/errorDigest.ts:6-9 and errorDigest.test.ts (the digest helper the pages share);
  src/lib/redact.ts:90-139 (which log field names get redacted).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| browse's private `readOrRefuse` | `src/server/browse.ts:22-30` (header comment 11-14, `unstable_rethrow` import at `:3`) | deleted; the three reads call `readOrRefuse(read, run)` from `src/server/cache/readOrRefuse.ts:17-31` | Call sites `browse.ts:43,60,73`, named `'Browse'`, `'Browse dates'`, `'Filter options'` (PM ruling: three names, home's convention). |
| `BrowseReadError` | `src/server/browse.ts:15-20` | gone; the shared wrapper throws `CachedReadError` with message `${read} read failed: ${kind}` | Named at `browse.test.ts:84,143` and `docs/runbooks/browse.md:45`; message text asserted at `browse.test.ts:85,124,144,171,180` changes with the three names. |
| inline `errorDigest` copy | `src/app/(guest)/new-york/browse/BrowseContent.tsx:50-53` (`String(error.digest)` for a non-string digest) | `errorDigest` from `src/lib/errorDigest.ts` (returns `undefined` for a non-string digest) | BE-10. `errorDigest.test.ts` already covers the non-string case; `BrowseContent.test.tsx:101-112` asserts `{ digest: undefined }` today. |
| the page catch blocks | `src/app/(guest)/HomeContent.tsx:36-45`, `BrowseContent.tsx:44-56`, `GuestBanner.tsx:20-26`, `experiences/[slugAndId]/page.tsx:53-66` (route) and `:30-35` (`generateMetadata`, logs nothing today) | each calls `rethrowOrLog(message, error)` and returns its own error view | H-51 and BE-6. Five `unstable_rethrow` page sites, four `logger.error` calls today; `generateMetadata` gains the fifth. |
| `rethrowOrLog(message, error)` | does not exist (inline `unstable_rethrow` sites: `src/server/cache/readOrRefuse.ts:25`, `src/server/cache/remote.ts:18`, `src/server/browse.ts:27`, the five page sites) | `src/server/monitoring/rethrowOrLog.ts`: calls `unstable_rethrow(error)`, then `logger.error(message, { digest: errorDigest(error), kind: error.name })` | Needs `logger` and `next/navigation`, so it lives under `src/server`, which `src/app` may import. Imports `logger` from `'@/server/monitoring/logger'` and calls only `logger.error`, so the four page tests' mocks (`{ logger: { error } }` only) keep intercepting it. |

### Call sites to change

- `src/server/browse.ts:3` (drop `unstable_rethrow`; import `readOrRefuse`); `:11-30` (delete the class and wrapper); `:43,60,73` (three named reads).
- `src/server/browse.test.ts:8` (behaviour header); `:84,143` (name becomes `CachedReadError`); `:85,124,144,171,180` (message text per read name).
- `src/app/(guest)/HomeContent.tsx:39-43`; `BrowseContent.tsx:47-54` (drop the inline digest); `GuestBanner.tsx:22-24`; `page.tsx:56-60` (route) and `:30-35` (`generateMetadata` logs through the helper).
- `src/app/(guest)/HomeContent.test.tsx:8,12` (headers), `:80-95`, `:97-108` (`kind` is always logged, so the with-digest case gains `kind` too), `:209-222`; the `it` titles at `:80` and `:209` ("only the digest") change.
- `BrowseContent.test.tsx:9`, `:101-112` (title at `:101`).
- `GuestBanner.test.tsx:8`, `:27-45` (title at `:27`; `:38-41` asserts the exact object `{ digest: '7654321' }` and gains `kind`; add a no-digest case).
- `page.test.tsx:20`, `:131-155` (title at `:135`), `:157-167` (`{ digest: '1234567' }` gains `kind`), `:205-212` ("logs nothing of it", `expect(server.logError).not.toHaveBeenCalled()` at `:211`, is inverted, not extended; the route tests call `ExperienceRoute` alone so `toHaveBeenCalledExactlyOnceWith` stays valid).
- Code comments saying "only the digest": `HomeContent.tsx:39`, `BrowseContent.tsx:47`, `page.tsx:56`.
- `docs/runbooks/browse.md:45` ("The three cached reads throw a `BrowseReadError`" is rewritten to match `home.md:56`'s `CachedReadError` wording, plus the digest-and-kind sentence); `docs/runbooks/home.md:46` ("only the digest is logged"), `:52` ("logs the digest", GuestBanner), `:56` ("The page logs the digest of that error"); `docs/runbooks/experience.md:42` ("Only the digest is logged").

### Risks and checks

- The field is `kind`, never `name`: `src/lib/redact.ts:102` lists `name` in `sensitiveKeyExact`, so production output would show `[redacted]`. The page tests mock the logger and cannot catch this; the reviewer checks the field name. `kind` already means the alert kind in `src/server/monitoring/alerts.ts:29,39`; the PM accepts the shared field name, and the PR body says page logs now carry `kind` for the error name so anyone with a saved Axiom search knows.
- A failed experience read now logs twice per request (metadata and route). The runbook says so.
- Renaming the thrown error to `CachedReadError` changes what Next logs for a failed browse read; no saved search on `BrowseReadError` exists in the repo.
- H-50 (open owner decision) may edit the `HomeContent` catch; E lands first.
- The helper must not call `logger.warn` or import `captureException` (`src/server/monitoring/sentry.ts:61`): the four page tests mock only `logger.error` and would throw or load the real Sentry wrapper.
- Held branches: none of E's 13 files is on `unit/U-005` or `unit/U-014a`. U-005 adds `src/server/monitoring/heartbeat.ts` and `heartbeat.test.ts` in the same directory; no barrel exists there, so a sibling file cannot conflict. `HomeContent.tsx:23` and `BrowseContent.tsx:31` carry `TODO(U-005)` a few lines above the catch blocks.
- Every U-030, U-031 and U-039 PR is squash-merged; no open branch edits E's files.
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- The log field is `kind: error.name`, always (no branch on whether a digest exists).
- `generateMetadata` logs through the same helper (closes BE-6).
- Build `rethrowOrLog(message, error)` at `src/server/monitoring/rethrowOrLog.ts`.
- Browse's three cached reads get three read names matching home's convention.

## PR F: display text, `bannerText`, paragraphs

Two display helpers leave the experience page module, `bannerText` moves to settings beside the field it reads, and the seed's `paragraphs` becomes the one rich-text paragraph builder (H-57). No behaviour change; every moved function keeps its body.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/lib/displayText.ts
    src/lib/displayText.test.ts
    src/lib/richText/paragraphs.ts
    src/lib/richText/paragraphs.test.ts
  edited
    src/lib/experiencePage.ts
    src/lib/experiencePage.test.ts
    src/lib/home.ts
    src/lib/home.test.ts
    src/lib/settings.ts              (additive: bannerText appended after SettingsChangeSchema; the Zod const at :16 renamed)
    src/lib/settings.test.ts
    src/lib/seed/richText.ts
    src/lib/seed/fixtures/editorial.ts
    src/lib/seed/validate.test.ts
    src/app/(guest)/GuestBanner.tsx
    src/components/HomeModules/HomeModules.fixtures.tsx
OUT OF SCOPE:
  src/lib/text.ts (Zod storage validation stays as it is); blocks and textOf in src/lib/seed/richText.ts;
  src/components/RichText/RichText.tsx:67 (its own content.length check; suggestion only);
  the single-paragraph helpers in test files (src/lib/editorial.test.ts:43-48, src/lib/storable.test.ts:20-25,
  src/lib/legal.test.ts:55-58, tests/db/editorial.db.test.ts:106-111, tests/db/editorial-races.db.test.ts:81-86,
  src/components/RichText/RichText.test.tsx:12,27; list them in Suggestions);
  PRs A to E's helpers and PR G's rename; every file on unit/U-005 and unit/U-014a other than
  src/lib/settings.ts and settings.test.ts, which this PR must touch.
REFERENCE CODE:
  src/lib/richText/href.ts and href.test.ts (a richText/ module plus colocated test); src/lib/richText/format.ts
  (RichTextDoc, the only import paragraphs.ts may take); src/lib/pricing.ts cardPriceLabel (a helper lifted
  out of a page module in PR 220).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `presentText` | `src/lib/experiencePage.ts:59-63` (private) | `displayText.ts`, exported | Callers `experiencePage.ts:230,378,407,413`; `settings.ts` becomes a caller through `bannerText`. |
| `textLines` | `src/lib/experiencePage.ts:65-71` (exported) | `displayText.ts` | Callers `experiencePage.ts:77,402,436`; tests `experiencePage.test.ts:24,301-313`. |
| `bannerText` | `src/lib/home.ts:548-554` | `settings.ts`, after `SettingsChangeSchema` (ends `:57`), as `presentText(settings.bannerText)` | Only caller `src/app/(guest)/GuestBanner.tsx:5,19`. `settings.ts:16` already has a module-level Zod const named `bannerText` (used by shorthand at `:23`); rename it (for example `bannerField`) before adding the function. `GuestSettings.bannerText` is `string \| null`, which `presentText` accepts. |
| `docOfText` | `src/lib/home.ts:279-285` | `richText/paragraphs.ts` `paragraphs(...texts)` | Callers `home.ts:397`, `home.test.ts:10,534,540,553,702`, `HomeModules.fixtures.tsx:3,81,124`. One-arg `paragraphs(text)` yields a byte-identical doc, so every call is a rename. |
| `hasText` | `src/lib/home.ts:287-289` (private) | `richText/paragraphs.ts` `hasContent(doc)`, keeping `(doc: RichTextDoc \| null): doc is RichTextDoc` | Callers `home.ts:397,447` stay one line. |
| seed `paragraphs` | `src/lib/seed/richText.ts:3-12` | `richText/paragraphs.ts` | Callers `seed/fixtures/editorial.ts:1` (8 calls at `:17,48,74,94,108,141,178,204`), `seed/validate.test.ts:4,275,337,341`. `blocks` and `textOf` stay in seed (used by `fixtures/legal.ts`, `fixtures/editorial.ts:205`, `validate.ts:11`). `paragraphs.test.ts` is its first test. |

### Call sites to change

- `src/lib/experiencePage.ts:1-13` (import from `./displayText`); `:59-71` (delete); `:77,230,378,402,407,413,436`.
- `src/lib/experiencePage.test.ts:24` (drop `textLines` import); `:301-313`: the first case moves to `displayText.test.ts`; the second ("has none for no text", `:310-313`) asserts both `textLines(null)` and `includedItems('')`, so split it: `textLines(null)` moves, `includedItems('')` stays.
- `src/lib/home.ts:7-8` (import `paragraphs`, `hasContent` from `./richText/paragraphs`; keep the `GuestSettings` import, used at `:354` and `:441`); `:279-289` (delete); `:397`; `:447`; `:548-554` (delete).
- `src/lib/home.test.ts:8` (drop `bannerText`); `:10` (`paragraphs` from `./richText/paragraphs`); `:534,540,553,702`; `:854-863` (the `bannerText` describe moves to `settings.test.ts`).
- `src/lib/settings.ts:2` (import `presentText`); `:16` (rename the Zod const); `:23` (shorthand uses the renamed const); end of file (exported `bannerText` function).
- `src/lib/settings.test.ts:2-7` (import `bannerText`); `:59-75` (the four moved cases go in their own `it.each`, since the existing `it.each` at `:69` names its column `bannerText` and would shadow the function; or rename the column).
- `src/lib/seed/richText.ts:1-12` (remove `paragraphs`; keep `blocks`, `textOf`); `src/lib/seed/fixtures/editorial.ts:1` (`paragraphs` from `@/lib/richText/paragraphs`, `blocks` stays from `../richText`); `src/lib/seed/validate.test.ts:4`.
- `src/app/(guest)/GuestBanner.tsx:5` (`bannerText` from `@/lib/settings`).
- `src/components/HomeModules/HomeModules.fixtures.tsx:3,81,124`.
- `docs/runbooks/home.md:52` names `bannerText` as the settings field with no module path; no edit.

### Risks and checks

- Held branch `unit/U-014a` edits `src/lib/settings.ts` (adds `HoldSettingsSchema` at `:48-55`) and `settings.test.ts` (inserts `HoldSettingsSchema,` into the import block at `:2-7` and appends a describe after `:113`). F's edits are the rename at `:16/:23`, an append after `:57`, an import in the same `:2-7` block two lines away, and cases inside `:59-75`. Additive, so a three-way merge should succeed; merge `main` first and, if U-014a has been promoted, nothing further. U-014a goes to `integration`, so the conflict, if any, surfaces at promotion; the lane PM tells the critical-path lane that F appended to `settings.ts`.
- Downstream importers of `settings.ts` now pull in `displayText.ts`: `src/server/db/schema/policies.ts:17` (the drizzle schema, used by drizzle-kit and the migration-drift check), `src/server/db/settings.ts:10`, `src/server/siteSettings.ts:4`, `tests/editorial-migration.test.ts:6`, `src/lib/storable.test.ts:9`. `displayText.ts` has no imports, so the schema stays dependency-free.
- `richText/paragraphs.ts` imports only the `RichTextDoc` type from `./format` (no zod, no React): the `lib-packages` and `layers` lint zones are the gates. `tests/rich-text-bundle.test.ts` does not reach `paragraphs.ts`.
- `knip`: `presentText` is imported by `experiencePage.ts` and `settings.ts`, `hasContent` by `home.ts`, `textLines` keeps a non-test importer.
- `SettingsSchema` and `SettingsChangeSchema` output must be unchanged after the const rename: `settings.test.ts` and `src/lib/storable.test.ts:103` cover it in the unit gate; `tests/db/editorial.db.test.ts` runs only in `pnpm test:db`.
- Storybook: `HomeModules.stories.tsx` imports the fixtures; `pnpm storybook:test` gates the import change.
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- A new `src/lib/displayText.ts`; `text.ts` stays Zod storage validation.
- `hasContent(doc)` keeps the null-accepting type-guard signature.
- `seed/richText.ts` `blocks(...)` and `textOf` stay in seed.

## PR G: rename into `src/lib/pages/` plus the lint zone

Mechanical: `git mv` the four page modules, their tests and the one fixture into `src/lib/pages/`, rewrite import paths, add the zone and its test. No logic changes. Last, with the manifest recut after F lands; the list below is cut at `5a595f1` and names the call sites that A, C and F remove.

### Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new (git mv, so blame survives)
    src/lib/pages/home.ts                 from src/lib/home.ts
    src/lib/pages/home.test.ts            from src/lib/home.test.ts
    src/lib/pages/browse.ts               from src/lib/browse.ts
    src/lib/pages/browse.test.ts          from src/lib/browse.test.ts
    src/lib/pages/experience.ts           from src/lib/experiencePage.ts
    src/lib/pages/experience.test.ts      from src/lib/experiencePage.test.ts
    src/lib/pages/experience.fixtures.ts  from src/lib/experiencePage.fixtures.ts
    src/lib/pages/siteNav.ts              from src/lib/siteNav.ts
    tests/lint-pages-zone.test.ts
  edited
    eslint.config.boundaries.mjs
    src/lib/photoViews.test.ts
    src/lib/seed/coverage.ts
    src/app/(guest)/HomeContent.tsx
    src/app/(guest)/new-york/browse/BrowseContent.tsx
    src/app/(guest)/experiences/[slugAndId]/page.tsx
    src/app/(guest)/experiences/[slugAndId]/page.test.tsx
    src/server/home.ts
    src/server/home.test.ts
    src/server/browse.ts
    src/server/experiencePage.ts
    src/server/experiencePage.test.ts
    src/server/coverPhotos.test.ts
    src/server/db/home.ts
    src/server/db/browse.ts
    src/components/FilterBar/FilterBar.tsx
    src/components/GuestShell/GuestShell.tsx
    src/components/GuestShell/SiteMenu.tsx
    src/components/BrowseResults/BrowseResults.tsx
    src/components/BrowseResults/BrowseResults.stories.tsx
    src/components/BrowseResults/BrowseResults.test.tsx
    src/components/ExperiencePage/ExperiencePage.tsx
    src/components/ExperiencePage/ExperiencePage.fixtures.ts
    src/components/ExperienceGallery/ExperienceGallery.tsx
    src/components/ExperienceGallery/ExperienceGallery.stories.tsx
    src/components/ExperienceGallery/ExperienceGallery.test.tsx
    src/components/HomeModules/HomeModules.tsx
    src/components/HomeModules/HomeModules.fixtures.tsx
    src/components/HomeModules/HomeModules.test.tsx
    src/components/HomeModules/HomeModules.stories.tsx
    src/components/HomeModules/PicksSection.tsx
    src/components/HomeModules/CategoryRail.tsx
    src/components/HomeModules/ThisWeekSection.tsx
    src/components/HomeModules/ReassuranceSection.tsx
    tests/db/home.db.test.ts
    tests/db/seed.db.test.ts
    tests/db/browse.db.test.ts
    docs/runbooks/home.md
    docs/runbooks/browse.md
    docs/runbooks/experience.md
  listed at 5a595f1 but gone or retargeted before G
    src/app/(guest)/GuestBanner.tsx (F retargets it to @/lib/settings)
    src/components/HomeModules/HomeHero.tsx, HomeStates/HomeEmpty.tsx (A retargets them to @/lib/routes;
      GuestShell.tsx keeps its @/lib/siteNav import)
    src/components/HomeModules/HomeCardItem.tsx (C deletes it)
OUT OF SCOPE:
  any logic change in the moved files; moving id/idWithLetters out of experience.fixtures.ts (follow-up);
  tests/lint-boundaries.test.ts (unit/U-005 edits :203-206; G ships its own test file);
  .claude/standards/architecture.md:80 (cites the old paths; .claude/ is PROTECTED in scope-check.ts and only
  Dave edits it; list in Suggestions); the literal reading "nothing outside pages/ imports from it";
  every file on unit/U-005 and unit/U-014a.
REFERENCE CODE:
  eslint.config.boundaries.mjs 'ramble/boundaries/layers' (:68-109, the existing import/no-restricted-paths
  zones the new zone joins) and the vendor-SDK configs (:39-56, the files/ignores pattern);
  tests/lint-boundaries.test.ts:24-105 (one synthetic-file fixture case per rule, the shape the new test copies);
  node_modules/eslint-plugin-import/docs/rules/no-restricted-paths.md (2.32.0: `target` may be a glob or array
  of globs; `except` is relative to `from`).
```

### Moves

| Helper | From (main at `5a595f1`) | To | Note |
|---|---|---|---|
| `home.ts` page module | `src/lib/home.ts` (554 lines at `5a595f1`; shorter after A to F) | `src/lib/pages/home.ts` | Sibling imports (`./catalog`, `./editorial`, `./photoViews`, `./pricing`, `./richText/format`, `./settings`, `./spaces`, and A to F's `./routes`, `./time`, `./duration`, `./experienceCards`, `./sessionWindow`, `./richText/paragraphs`) become `../`. |
| `home.test.ts` | `src/lib/home.test.ts` (imports `./browse:3`, `./editorial:4`, `./home:28`) | `pages/home.test.ts` | `./browse` and `./home` stay relative inside `pages/`; `./editorial` becomes `../editorial`. |
| `browse.ts` page module | `src/lib/browse.ts` (400 lines; exports include `nextBrowseDay` at `:298`, `maxStoredDayRows`, `maxHandEnteredDayRows`, `BrowseDayRowsSchema`, `BrowseRead`, `BrowseCursorRow`, `FormTarget`, which the proposal's list omitted) | `pages/browse.ts` | Sibling imports `./catalog`, `./filters`, `./photoViews`, `./pricing`, `./sessions` become `../`. |
| `browse.test.ts` | `src/lib/browse.test.ts` (imports `./browse:28`, `./filters:29`) | `pages/browse.test.ts` | `./filters` becomes `../filters`. |
| `experiencePage.ts` page module | `src/lib/experiencePage.ts` (462 lines; real exports are `weatherTerms` `:106` and `cancellationTerms` `:144`, not the proposal's `terms` and `badges`; `placeOf` `:201` is imported by `src/server/experiencePage.ts:5`) | `pages/experience.ts` | Sibling imports `./catalog`, `./cancellation`, `./money`, `./photos`, `./photoViews` become `../`; `./browse` is gone after B. |
| `experiencePage.test.ts` | `src/lib/experiencePage.test.ts` (imports `./catalog:2`, `./experiencePage:27`, `./experiencePage.fixtures:33`, `./photos:34`) | `pages/experience.test.ts` | Two specifiers become `./experience` and `./experience.fixtures`; `./catalog` and `./photos` become `../`. |
| `experiencePage.fixtures.ts` (`id`, `idWithLetters`, `experience`, `place`) | `src/lib/experiencePage.fixtures.ts` (64 lines; exports at 3, 7, 10, 61) | `pages/experience.fixtures.ts` | `idWithLetters` is imported from outside `pages/` by `src/lib/photoViews.test.ts:2` (exempt as a test file), `src/server/coverPhotos.test.ts:2`, `src/server/experiencePage.test.ts:2`, `page.test.tsx:10` (server and app may import pages). |
| `siteNav.ts` | `src/lib/siteNav.ts` (47 lines; no `siteNav.test.ts` exists) | `pages/siteNav.ts` | After A it imports only from `./routes`, which becomes `../routes`. |
| the pages lint zone | `eslint.config.boundaries.mjs` | a new zone inside the existing `ramble/boundaries/layers` `zones` array: `target` the globs for `src/lib/**` excluding `src/lib/pages/**`, `src/lib/seed/**` and `src/lib/**/*.test.ts`, `from` `./src/lib/pages` | Not a separate config object: in flat config a later object that supplies `import/no-restricted-paths` options replaces the `layers` zones wholesale, so `src/lib` would silently lose its must-not-import-server/components/app guard (verified with `eslint --print-config`); U-005's `tests/lint-boundaries.test.ts` cases would then fail on landing. The `withTypeImportsAllowed` wrapper applies as before. |
| the zone test | none | `tests/lint-pages-zone.test.ts`: a synthetic `src/lib/bad.ts` importing from `src/lib/pages/home` fails; `src/lib/seed/x.ts`, `src/lib/x.test.ts`, `src/server/x.ts`, `src/components/X.tsx`, `src/app/x.tsx` pass | Own filename (PM ruling), copying the fixture shape of `tests/lint-boundaries.test.ts:24-105`. |

### Call sites to change

- `src/app/(guest)/HomeContent.tsx:13`; `BrowseContent.tsx:12`; `experiences/[slugAndId]/page.tsx:10` (`@/lib/pages/experience`); `page.test.tsx:10` (`@/lib/pages/experience.fixtures`).
- `src/server/home.ts:12`; `src/server/home.test.ts:2`; `src/server/browse.ts:4`; `src/server/experiencePage.ts:5`; `src/server/experiencePage.test.ts:2`; `src/server/coverPhotos.test.ts:2`; `src/server/db/home.ts:11`; `src/server/db/browse.ts:17-31` (13 specifiers; the path at `:31`).
- `src/components/FilterBar/FilterBar.tsx:5`; `GuestShell/GuestShell.tsx:5` (`@/lib/siteNav`); `GuestShell/SiteMenu.tsx:3`; `BrowseResults/BrowseResults.tsx:6`, `.stories.tsx:4`, `.test.tsx:5`; `ExperiencePage/ExperiencePage.tsx:16`, `ExperiencePage.fixtures.ts:2`; `ExperienceGallery/ExperienceGallery.tsx:3`, `.stories.tsx:5`, `.test.tsx:6`; `HomeModules/HomeModules.tsx:2`, `HomeModules.fixtures.tsx:7`, `HomeModules.test.tsx:6`, `HomeModules.stories.tsx:5`, `PicksSection.tsx:5`, `CategoryRail.tsx:3`, `ThisWeekSection.tsx:2`, `ReassuranceSection.tsx:2`.
- `src/lib/photoViews.test.ts:2` (`./pages/experience.fixtures`); `src/lib/seed/coverage.ts:1` (`@/lib/pages/browse` for what it still takes from browse after B and D, for example `browseDateHorizonDays`; seed is exempt from the zone).
- Inside `pages/`: `experiencePage.test.ts:27,33` (`./experience`, `./experience.fixtures`); `home.test.ts:3` (`./browse`, unchanged text).
- `tests/db/home.db.test.ts:4`; `tests/db/seed.db.test.ts:9`; `tests/db/browse.db.test.ts:3-10`.
- `docs/runbooks/home.md:7,44`; `docs/runbooks/browse.md:33,37,55`; `docs/runbooks/experience.md:7`.
- No alias change: `tsconfig.json`, `vitest.config.mts` and `.storybook/vitest.config.mts:8` resolve `@` to `src`; `.storybook/main.ts:4` globs only `src/components/**/*.stories.tsx`, so no story moves. No `vi.mock` names these modules; e2e, scripts and `knip.json` reference none of them; no ignore pattern matches `pages`.

### Risks and checks

- The zone design defect above is the main check: after the edit, `eslint --print-config src/lib/catalog.ts` must still show all four `layers` zones plus the new one, and `tests/lint-boundaries.test.ts` must still pass.
- Rename detection: moving eight files while rewriting their sibling imports keeps similarity high, but the reviewer confirms the PR diff and `git log --follow` show renames, not delete-plus-add.
- Import ordering: `@/lib/pages/home` sorts after `@/lib/photoViews` and `@/lib/filters`; `import/order` and prettier may reorder lines in `src/server/db/browse.ts` and `HomeModules.fixtures.tsx`. Mechanical, but it widens the diff.
- Gates for G include `pnpm format:check` and `env -u DATABASE_URL pnpm build`, not only lint, typecheck, test, test:db, knip and storybook:test.
- `unit/U-014a` edits `pricing.ts`, `settings.ts`, `editorial.ts`, `catalog.ts`, `sessions.ts`, all imported by the moved modules; no file overlap. If a later U-014a round adds an import from a page module, the zone catches it; the critical-path lane is told.
- Held branches: none of G's files is on `unit/U-005` or `unit/U-014a`. `tests/lint-boundaries.test.ts` exists on `main` (since `938ed22`); U-005 inserts 20 lines at `:203-206`; G does not touch it.
- Merge `main` before push and rerun every gate.

### PM rulings for this PR

- Zone semantics: no `src/lib` module outside `src/lib/pages/` imports from `src/lib/pages/`; `src/app`, `src/server`, `src/components` and the seed may.
- Test files under `src/lib/**/*.test.ts` are exempt in G; moving `id`/`idWithLetters` out of the fixture is a follow-up.
- The zone test ships under its own filename, `tests/lint-pages-zone.test.ts`, not in U-005's `tests/lint-boundaries.test.ts`.
- G is last and its manifest is recut after F lands.

## Follow-up PRs after G

Separate PRs, not part of A to G. Component PRs touch only `src/components` (plus `src/lib/badge.ts` for Components-3) and can go in any order. Paths below are at `5a595f1`; after G, `@/lib/home` imports read `@/lib/pages/home`.

| PR | Items | What changes | Files |
|---|---|---|---|
| Components-1 | H-58 | `CategoryRail` renders `<ChipLink selected={false}>` and `.pill` is deleted | `src/components/HomeModules/CategoryRail.tsx:23`, `src/components/HomeModules/HomeModules.module.css:123-142`, `src/components/Chip/ChipLink.tsx` (reference) |
| Components-2 | H-59 | the gift guide action uses `ButtonLink`; its browse-only prefetch comment is reworded | `src/components/HomeModules/GiftGuideSection.tsx:37-40`, `src/components/Button/ButtonLink.tsx:68` |
| Components-3 | H-60 | `Badge` gains a `highlight` tone; `Eyebrow` and Card's pick become Badges; the two hand-drawn pills go | `src/lib/badge.ts:1`, `src/components/Badge/Badge.tsx`, `src/components/HomeModules/Eyebrow.tsx`, `src/components/HomeModules/HomeModules.module.css:39-63`, `src/components/Card/Card.module.css:172-192` |
| Components-4 | H-61 (after Dave picks the title size) | one `PageError` replaces `HomeError` and `ExperienceError`; browse's retry pattern joins it | `src/components/HomeStates/HomeError.tsx`, `src/components/ExperiencePage/ExperienceError.tsx`, the retry in `src/components/BrowseResults/BrowseResults.tsx` and `src/app/(guest)/new-york/browse/BrowseContent.tsx` |
| Components-5 | H-62, H-76 | one `VisuallyHidden` component or one global class replaces the seven copies | CSS modules of `SiteMenu`, `Card`, `BrowseSkeleton`, `Button`, `HomeStates`, `Header`, and `src/components/HoldTimer/HoldTimer.module.css:43` (`clip-path: inset(50%)`; `BrowseSkeleton.module.css:23` also differs) |
| Components-6 | H-77, H-78 | one `@keyframes pulse`; `Skeleton` gains a bar kind; skeleton layout rules compose the hero and module CSS instead of copying it | `src/components/Skeleton/Skeleton.module.css:121`, `src/components/Skeleton/Skeleton.tsx`, `src/components/HomeStates/HomeStates.module.css:245`, `src/components/HomeModules/HomeHero.module.css`, `src/components/HomeModules/HomeModules.module.css` |
| Components-7 | H-79 | one brand constant for the literal `Ramble` h1, in a flat shared module (not `siteNav.ts`, which is inside the pages zone after G) | `src/components/HomeStates/HomeTitle.tsx:5`, `HomeEmpty.tsx:10`, `HomeError.tsx:13`, `HomeSkeleton.tsx:15`, `src/components/SiteShell.tsx:11,16` |
| Seed-parity | H-69, N1029-17 (`homeOrder`) | one exported predicate in `src/lib/editorial.ts` for "enabled, and a collection only once published", used by the seed and compared with the SQL in a db test; `homeOrder` reads `homeModuleKinds` | `src/lib/editorial.ts:13-20`, `src/lib/seed/coverage.ts:169-186`, `src/server/db/editorial.ts:149-152` (reference), `tests/db/` |
| Server-hygiene | N1029-8, N1029-12, N1029-13, N1029-17 (byte limits and refusal copy), `byNameThenId` | photo reads use `guestVisible`; storage rules move into `src/lib/storage.ts`; one port error base class, one `required()`, one `settle`; one 10 MiB limit and one refusal copy; `byNameThenId` exported and imported by browse and home | `src/server/db/photos.ts:234,260`, `src/server/db/catalog.ts:36`, `src/server/db/browse.ts:213`, `src/server/db/home.ts:40`, `src/server/ports/storage/index.ts`, `config.ts`, `fake.ts`, `vercel-blob.ts`, `src/server/ports/image/index.ts`, `src/server/ports/payments/index.ts`, `payments/fake.ts`, `src/server/ports/email/config.ts` (not `email/fake.ts`, which U-005 holds), `src/lib/storage.ts:31,58-60`, `src/lib/photos.ts:10,46-51` |
| Time-zone | N1029-9 | `cancellation.ts` imports `TimeZoneSchema` and `isKnownTimeZone` from `sessions.ts` instead of its own check | `src/lib/cancellation.ts:11-14,42-52`; imports only from `src/lib/sessions.ts` (held by U-014a), so verify the export names against `6502a1d` before merging |
| After U-014a (1) | N1029-14 (catalog exports) | export `MinorUnitsSchema` or a `PriceOptionSchema.pick` shape so the card option schema from C derives from catalog | `src/lib/catalog.ts:76,109`, `src/lib/experienceCards.ts` |
| After U-014a (2) | N1029-15 (`plan.ts`, `sessions.ts`), N1029-17 (`SettingIssue`, `slugify`) | `seed/plan.ts` and `sessions.ts` use `msPerDay` and `isoDateOf`; `SettingIssue` hoisted to one module; `slugify` beside `isSlug` | `src/lib/seed/plan.ts:9,11`, `src/lib/sessions.ts:156,299,301`, `src/lib/storage.ts:58-60`, `src/lib/settings.ts`, `src/lib/seed/scale.ts:242`, `src/lib/catalog.ts:51` |

Not a refactor item: the browse audit's H-7 note (the space-taking rule in `shownInBrowse` SQL and `cardPriceLabel`) is a documented race guard and stays as merged in `5121048`.

## Lane prompt

**Before you start:** H-41 is answered (Dave, 2026-10-29, DECISIONS): browse's edges on both pages, sold-out days not offered; PR D is unblocked once B and the audit-fixes BE-7 PR are in. Earlier gate text: if they had been late, run E and F before D. `gh` still fails TLS inside the local sandbox; push and PR calls go through `agent-git.ts`. The required `scope-manifest` check needs a unit ID in every PR title and a `unit/<id>[-suffix]` branch; the carrier units and branch names are ruled in "Order and rules".

**Run:** `/ramble-pm lane: lib-refactor` in a desktop chat on the main checkout (`/Users/davidfleming/Workspace/ramble`), not a worktree. **Model and effort:** Sonnet, medium; builders Sonnet (senior).

**Prompt:**

```
Read STATUS.md in the ramble-pm repo (bun scripts/plan/site.ts dir prints its path): the Lanes table and the lib-refactor lane section. Read drafts/lib-layout-refactor.md (the plan: order and rules, each PR's scope manifest, moves, call sites, risks and PM rulings), drafts/wave3-builder-rules.md and wave3-review-rules.md, and the audit rows the plan absorbs in audits/home-2026-10-28.md, browse-experience-2026-10-28.md and nightly-2026-10-29.md. Run the seven PRs one at a time in the plan's order, A to G: one senior builder per PR in an isolated worktree cut from main and launched from the ramble checkout, briefed with that PR's scope manifest, moves table, call-site list and PM rulings verbatim, plus the carrier unit ID and branch name you pick. The builder merges main into its branch before every push and reruns every gate. Four-check fan-out per PR (review, qa, spec-compliance, architecture-audit; a11y on UI changes), push with agent-git.ts, PR from the worktree, post the checks, auto-merge. Before-and-after evidence under evidence/pr/<branch>/ for anything visible (H-63 in B, H-45 in C) embedded in the PR body. PR D waits on Dave's H-41 answers; if they are late, run E and F first. Recut PR G's call-site list from main after F merges before briefing its builder. Mark each absorbed audit row fix: when its PR opens and closed: when it merges, in the audit files; PR D also waits for the audit-fixes BE-7 PR to merge and consolidates its predicate rather than re-fixing it. Brief each builder with its carrier unit and branch from the order rules. Write only in this lane's STATUS sections, copy every SHA from git rev-parse, do not commit plan files.
```
