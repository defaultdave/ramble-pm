FAIL

## spec-compliance: U-035 "Category and neighborhood pages" (head 37bd503)

Base: origin/main at 053bd1a. Criteria: the U-035 entry in docs/plan/units.yaml, PRD-02, PRD-63, PRD-65 (docs/product/PRD.md), and the U-035 row in docs/plan/02-work-breakdown.md.

### Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | units.yaml scope: "Prerendered city pages with editorial copy" | FAIL | `src/app/(guest)/new-york/things-to-do/[category]/page.tsx` and `.../neighborhoods/[neighborhood]/page.tsx` `generateStaticParams` return only the placeholder `not_a_slug`. `getLandingData` returns null for it (`src/server/landing.ts`), so `LandingRoute` calls `notFound()`. No real category or neighborhood page is prerendered; they render on first request and are cached. |
| 2 | units.yaml scope: "same query as browse" | PASS | `src/lib/pages/landing.ts` `landingQuery` builds a `BrowseQuery`; `src/app/(guest)/new-york/_landing/LandingRoute.tsx` `LandingResults` calls `getBrowseResults` and `browseView`-based `landingView`, the same functions as browse. |
| 3 | units.yaml scope: "editorial copy" | PASS | `src/server/landing.ts` `readLandingData` calls `getPublishedPageCopy` (`src/server/db/editorial.ts`); `LandingRoute.tsx` renders `copy.intro` and `copy.body`, and `landingHeading` uses `copy.heading`. |
| 4 | units.yaml scope: "adds its routes and states as rows in the U-100 axe matrix (whichever of this unit and U-100 lands second adds them)" | PASS (conditional, not triggered) | U-100 is not on origin/main and no axe matrix exists in the repo. The clause makes U-100 the adder if this unit lands first. The diff adds `landingPaths` to `e2e/routes.ts` (not an axe matrix) covering the not-a-slug and error states. |
| 5 | units.yaml depends_on: U-031, U-018 | PASS | Browse modules `src/lib/pages/browse.ts` and `src/server/browse.ts` (U-031); `src/lib/editorial` and `getPublishedPageCopy` (U-018) are used by the landing code. |
| 6 | PRD-02: browse and filter by category, neighborhood, and date | PASS | `landingFilters` in `src/lib/pages/landing.ts` filters the browse query to one category or neighborhood; `landingBrowseHref` links to browse with those filters kept, where the date filter lives (U-031). The landing page itself has no date filter, which the code states. |
| 7 | PRD-63: adding a second city changes no existing page address | PASS | `src/lib/routes.ts` `categoryPath` and `neighborhoodPath` put the city first (`/new-york/things-to-do/<slug>`, `/new-york/neighborhoods/<slug>`); a second city adds a sibling route folder and no existing address changes. |
| 8 | PRD-65: category and neighborhood pages are indexable, with editorial copy for searches like "things to do in Brooklyn" | PASS | `landingMetadata` and `landingHead` set title and description only, no robots (`src/app/(guest)/new-york/_landing/LandingRoute.tsx`, `src/lib/pages/landing.ts`); `e2e/landing.spec.ts` asserts no `meta[name="robots"]`. Fallback heading `Things to do in ${name}` in `landingHeading`. PRD-65 also names Ramble Picks pages; those are U-036 scope, not this unit. |
| 9 | 02-work-breakdown.md U-035 row: scope, PRD (65, 02, 63), Must, needs (U-031, U-018) | PASS | Row at docs/plan/02-work-breakdown.md:128 matches units.yaml lines 874 to 893 on scope text, PRD list, priority, and dependencies. |
| 10 | Meta: review verdict, QA verdict, status flip | N/A | Not code-verifiable. units.yaml status is still `todo` on the branch; not blocking. |

### Blocking Issues
- **AC #1 (units.yaml scope "Prerendered city pages with editorial copy"; ADR 0001 says "Category, neighborhood, and Picks pages are prerendered"):** only the placeholder `not_a_slug` is prerendered, and that prerender is a 404. Real category and neighborhood pages are not prerendered at build. The code comment ("a build has no database to ask") explains the constraint, but the unit scope and ADR 0001 are not met. Fix one of two ways: (a) prerender real slugs at build from a catalog list available without a database (for example a fixture or a build-time catalog export), or (b) Dave or the PM records a decision that build-time prerender is out of reach for this demo and amends U-035 scope and ADR 0001 to say on-demand cached rendering. Until one of these lands, this criterion stays FAIL.

### Non-blocking
- PRD-65's Ramble Picks pages are not in this unit; confirm U-036 carries them.
- Criterion 4 becomes a live requirement only if U-035 lands after U-100; record the axe rows at that point.

### Unconfirmed
- None.
