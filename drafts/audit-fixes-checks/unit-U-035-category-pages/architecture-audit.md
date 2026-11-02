PASS

## architecture-audit: U-035 "Category and neighborhood pages" (head 37bd503)

Rules: `.claude/standards/architecture.md` (project, in /Users/davidfleming/Workspace/ramble). Base origin/main 053bd1a. Diff read with `git diff origin/main...37bd503`; checkout not changed.
Scope: in scope (src/app, src/components, src/lib, src/server). Short-circuit not taken.
Files audited: `src/app/(guest)/new-york/_landing/LandingRoute.tsx`, `src/app/(guest)/new-york/neighborhoods/[neighborhood]/page.tsx`, `src/app/(guest)/new-york/things-to-do/[category]/page.tsx`, `src/components/BrowseSkeleton/BrowseSkeleton.tsx`, `src/components/BrowseSkeleton/index.ts`, `src/components/LandingPage/LandingPage.tsx`, `src/components/LandingPage/LandingPage.module.css`, `src/components/LandingPage/index.ts`, `src/lib/pages/landing.ts` (new page module), `src/lib/pages/cacheTagBudget.ts`, `src/server/landing.ts`, `src/server/db/editorial.ts`. Test, story, and e2e files read only for B7 and B11.

### Blocking
- None.

### Non-blocking
- `src/server/db/catalog.ts:80` and `:93`: `getCategoryBySlug` and `getNeighborhoodBySlug` still carry `// TODO(U-035): first caller`. This unit does not call them (`landingTarget` reads `getFilterOptions` instead) and the diff does not touch catalog.ts. Neither has any importer in `src/` or `e2e/`. The B7 trigger (importer is a test only) is not met, so this is not blocking. Fix: call them, delete them and the TODO, or re-point the TODO. Dave to rule whether a zero-caller export falls under ARCH-6.
- `src/app/(guest)/new-york/_landing/LandingRoute.tsx:51`: `minuteAsOf(new Date())` in an async shell. B12 covers `server/**` and `lib/**` only. Same pattern at base in `BookingContent.tsx:36` and `UpcomingSessionsContent.tsx:33`. `TODO(U-005)` is present. Fix when the Clock port lands.
- `LandingRoute.tsx` `landingMetadata` catch: the head falls back to `landingFallbackTitle` on a read error. Outside B13 (app shell), the error is logged by `rethrowOrLog`, and no data path is affected. Note only.
- `LandingRoute.tsx` `landingMetadata`: `description === null ? { title } : { title, description }` (decision D12 below). Not a B2 decision; optional move into `landingHead`.
- `src/components/LandingPage/LandingPage.module.css`: `max-inline-size: 48rem` in `.intro` and `.body`. A width is not one of B16's listed categories (colour, spacing, radius, font-size). Precedent at base: `src/app/(guest)/new-york/browse/page.module.css:14`. Use a size token if one exists.
- `src/lib/pages/landing.ts` `landingFilters` repeats the expression `{ ...noFilters, categories: [slug] }` from `src/lib/pages/home.ts:275`. No existing function to reuse, so B17 is not triggered. If a third caller appears, extract to `src/lib/filters.ts`.
- `src/lib/pages/landing.ts` `landingErrorView` has the same `{ state: 'error' }` shape as `errorView` in `src/lib/pages/browse.ts:310`, but a different retry target. Not a duplicate; reuse is not possible. Note only.

### Unconfirmed
- None. Every finding above was confirmed by reading the cited line or by a grep of the added lines (no `fetch(`, `process.env`, `Date.now`, argument-less `new Date()` in server or lib, `toFixed`, `style=`, cookies, headers, or `getCaller` in the added lines outside the one shell `new Date()`).

### B2 decisions (every decision in the data layer, route handlers, and shells)

Route handlers: none in this diff. Server Actions: none in this diff.

Data layer, `src/server/landing.ts`:
- D1 `getLandingData`: `if (!isSlug(slug)) return null`. Predicate lives in `src/lib/catalog.ts:69`. Guard only. OK.
- D2 `readLandingData`: `if (!target) { cacheLife('uncached'); return null }`. Hit or miss and caching profile. The target match is in lib (`landingTarget`). Same pattern as `src/server/browse.ts:32` and `src/server/experiencePage.ts:31`. OK.
- D3 `readLandingData`: `copy` passes through from `getPublishedPageCopy` (draft or missing returns null, `src/server/db/editorial.ts:266-274`, pre-existing). OK.

Lib, `src/lib/pages/landing.ts` (decisions correctly placed; covered by `landing.test.ts`):
- D4 `landingTarget`: find by slug in the kind's list. OK.
- D5 `landingFilters`, `landingQuery`, `landingBrowseHref`: kind switch to filter, query, and href. OK.
- D6 `landingPath`, `landingTag`: kind switch to address and cache tag. OK.
- D7 `landingHeading`: editor's heading, else name template by kind. OK.
- D8 `landingHead`: `copy?.metaDescription ?? null`. OK.
- D9 `landingView`, `landingErrorView`: result shape and error retry target. OK.

Shells, `LandingRoute.tsx` and the two page files:
- D10 `if (!data) notFound()`. Routing, not a domain result. OK.
- D11 `copy?.intro ? <RichText/> : null` and `copy?.body ? ... : null`. Conditional rendering, not a B2 decision by the rule's own text. OK.
- D12 `landingMetadata`: `description === null ? { title } : { title, description }`. Shape of the Metadata object, no domain result. Judgment call: not B2. See Non-blocking.
- D13 `LandingResults` catch returns the error view. Error state choice, logged through `rethrowOrLog`. OK.

Components: `BrowseSkeleton` `filters ? ... : null` and `LandingPage` `body ? ... : null` are conditional rendering. OK.

### Rule results (B1 to B17)
- B1 PASS. No network, database, or SDK call in app, components, or lib. `LandingRoute` reads only through `getBrowseResults` and `getLandingData`.
- B2 PASS. See the list above. No decision found in components or in the page files.
- B3 PASS. `src/server/landing.ts` line 1 has `import 'server-only'`. No `process.env` in the diff.
- B4 PASS. `lib/pages/landing.ts` imports only lib (`../cacheTags`, `../editorial` type, `../filters`, `../routes`, `./browse`). `server/landing.ts` imports lib and server. `components/LandingPage` imports `@/components/Button` only. `app` may import any layer.
- B5 PASS with note. `getLandingData` checks the slug with `isSlug`, the same predicate as `SlugSchema` (`src/lib/catalog.ts:78`), before any read. `getPublishedPageCopy` parses with `SlugSchema.safeParse`. The function returns the Ramble `PageCopy` type, not a raw row. Note: `isSlug` is a boolean predicate, not a Zod parse; the literal reading would be `SlugSchema.safeParse`. The slug reaches only the catalog equality in `landingTarget` before any database call, so no violation.
- B6 PASS (exempt). `getLandingData` reads published copy (`onlyPublished` true) and catalog names only. It takes no Caller.
- B7 PASS. The `TODO(U-035)` on `getPublishedPageCopy` is correctly removed; it now has its first caller. New exports have importers in app or components: `LandingPage` (LandingRoute.tsx), `getLandingData` (LandingRoute.tsx), `landingMetadata` (both page files). `landingFilters` is an export of lib, outside B7's component and data-layer scope; its only importers are `landing.ts` and the test. The catalog TODOs are in Non-blocking.
- B8 PASS. No `'use client'` in the diff. The new files are server or synchronous.
- B9 PASS. No writes in the diff.
- B10 N/A. Read path only.
- B11 PASS. No vendor SDK import in `src/`. Tests import vitest and Testing Library only. The story imports Storybook, which is not on B11's vendor list.
- B12 PASS for server and lib. No float or `toFixed` in money code, no `Date.now`, no argument-less `new Date()` in `server/**` or `lib/**`. Shell `new Date()` is Non-blocking.
- B13 PASS. No empty catch in `lib/**` or `server/**`. `readOrRefuse` (`src/server/cache/readOrRefuse.ts`) rethrows Next's signals and refuses with the failure kind only.
- B14 PASS. `readLandingData` reads no cookies, headers, Caller, or token. It calls `getFilterOptions` (cached, `tags.taxonomy`) and `getPublishedPageCopy`. Tags: `landingTag` plus the taxonomy tag inherited from `getFilterOptions` is 2, matching `cacheEntryTagCounts.landing: 2` in the diff. Publish invalidation: `src/lib/cacheTags.ts:74-76` maps a copy change to `tags.category` or `tags.neighborhood`, the same tags `landingTag` builds.
- B15 PASS. No Route Handler added.
- B16 PASS with advisory. No inline `style` prop. Colours, spacing, font sizes, and line heights use `var(--...)` tokens. The `48rem` width is Non-blocking. Prop names of `LandingPage` cannot be checked against Figma from the diff; not asserted.
- B17 PASS. Checked `landingTarget`, `landingFilters`, `landingPath`, `landingTag`, `landingHead`, `landingView`, `landingErrorView`, `readLandingData`, `LandingPage`, and the `filters` prop on `BrowseSkeleton`. Helpers in `landing.ts` are landing-specific or wrap shared code (`categoryPath`, `neighborhoodPath`, `browseView`, `hrefForFilters`, `noFilters`, `tags.category`, `tags.neighborhood`). The `filters` prop extends the existing skeleton instead of forking it. Duplicate expression noted under Non-blocking.

---
<sub>architecture-audit | haiku | read-only</sub>
