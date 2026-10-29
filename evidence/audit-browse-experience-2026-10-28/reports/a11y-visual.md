# Accessibility and visual lens reports (`5121048`), unverified

Screenshots: `../a11y/` (51 files, axe output and scripts) and `../visual/` (285 PNGs, `<page>-<state>-<width>-<scheme>.png`; Figma references in `../visual/figma/`).

Setup note from both lenses (and the performance lens): browse and experience reads go through `dbRead`, the Neon HTTP driver (`src/server/db/client.ts`), which cannot talk to the plain local Postgres from `docker-compose.yml`. Local `pnpm dev` or `pnpm start` against docker Postgres shows the S3 error state on browse and home until a stand-in answers Neon HTTP (`tests/db/harness.ts` `serveNeonHttp` is the only one, and nothing documents it for running the app).

## Accessibility (WCAG 2.2 AA)

| # | Finding | Sev | Where | Evidence |
|---|---|---|---|---|
| X1 | The 404 and group-error pages are unstyled skeleton markup: heading flush to the edge, home link browser `#0000ee`, 1.96:1 on `#18130f` in dark (needs 4.5:1); skip link flagged outside landmarks. Every experience 404 (unknown id, draft, paused, garbage) shows it. | high | `src/components/NotFoundNotice.tsx:5-10`, `PageHeading.tsx`, `ErrorNotice.tsx`, via `src/app/(guest)/not-found.tsx`, `error.tsx` | Dark axe at 390 and 1280: `color-contrast serious header > a[href="/"] 1.96`; `exp-notfound-dark-390.png` |
| X2 | Result changes are not announced and focus is lost: picking a calendar day sends focus to `<body>` (the `<details key={filters.date ?? 'none'}>` remounts); the empty-state "See Sat, Oct 31" link sends focus to `<body>`; no live region for the result count; every filter state has the same title "Browse experiences", so the route announcer says nothing new. WCAG 4.1.3, 2.4.3. | medium | `FilterBar.tsx`, `BrowseResults.tsx`, browse `page.tsx` metadata | `a5.mjs`: `activeElement=BODY` after a date pick and after "See next day"; no `aria-live` or `role=status` in the browse DOM |
| X3 | Selected chip state vanishes in forced-colors mode (drawn only by inverse background; no `forced-colors` rule in the repo). `aria-current` still set, so screen readers are fine. WCAG 1.4.1. | medium | `src/components/Chip/Chip.module.css:36-46` | `browse-forced-colors-390.png`; computed colours identical to unselected chips |
| X4 | Breadcrumb links 15 px tall (tablet up), under the project's 44 px rule (PRD-69); pass WCAG 2.5.8 by spacing. | low | `ExperiencePage.tsx:49-60` (`.crumb`) | 1280 px: 89x15, 47x15 |
| X5 | Page titles do not name the page: guide-only entries "Guide entry \| Ramble"; every experience 404 "Experience \| Ramble". The guide route is a placeholder ("Covers PRD-13, PRD-64"), so 03b is not built. WCAG 2.4.2. | low | `fallbackTitle` in `src/lib/experiencePage.ts`; the guide route page | `a9.mjs`, `a7.mjs` |
| X6 | Gallery strip stays a tab stop (`tabIndex=0`, `role="group"`) from 768 px, where CSS sets `overflow: visible` and it no longer scrolls. Static only (no photos in fake store). | low | `ExperienceGallery.tsx:47-51`, `ExperienceGallery.module.css` | Code read |
| X7 | Info: no booking region on the experience page yet (`TODO(U-040)`, `TODO(U-041)`); S5 and option types only in Storybook. | info | `ExperiencePage.tsx` | |

Also noted, shared chrome, not listed: footer links 24 px tall; dark-mode footer focus ring about 2.7:1 (`#1f5fad` on `#211a16`, calculated, not measured).
Checked and fine: axe 0 violations on every browse state and experience page in both schemes (except X1); keyboard order, no traps, visible rings (6.9:1); date picker cells 44x44 with good labels; card and chip names; headings; targets; 320 px reflow; text spacing; reduced motion; skeleton is `role="status"`.

## Visual (against Figma)

| # | Finding | Sev | Where | Evidence |
|---|---|---|---|---|
| V1 | The experience page has no booking surface (no BookingPanel, BookingBar, or sheet); at 1440 the D03 booking column is empty, so no primary action. May be sequencing. | high | `ExperiencePage.tsx` | Figma 03, D03 vs `experience-normal-*` |
| V2 | Experience not-found page unstyled (same as X1). | medium | `NotFoundNotice.tsx` | `experience-notfound-390-*.png` |
| V3 | Browse lacks the Figma header and filter bar: built H1 "Browse experiences" plus three stacked chip groups (about 340 px before the first card at 390); Figma 02/D02 has breadcrumb, filter-aware H1, one pill row with "Filters (2)", a count line; no counterpart for 02b's Filters sheet. Chip rows scroll sideways (cut off "Park Slope"). | medium | browse | `browse-unfiltered-*` vs 02, D02 |
| V4 | Zero-results and dated-empty states thinner than S2: no illustration, suggestion pills with counts, or nearby results; zero results shows "Clear all filters" twice. | medium | browse zero results | `browse-zero-390-light.png` vs S2 53:117 |
| V5 | Experience hero and facts differ from 03/D03: no photo counter, no 1+2 mosaic with "See all", no "Ramble pick" badge (H-16); breadcrumb shows neighborhood where Figma shows borough. Seed and fake-photo differences ignored. | low | experience page | |
| V6 | Link text inset about 20 px from the content edge ("Clear all filters" at x=36 against a 16 px gutter; "Open in Maps"), likely 44 px hit padding without a matching negative margin. | low | browse zero, experience | screenshots at 390 |
| V7 | Running the production app against local Postgres needs an undocumented Neon HTTP stand-in (see setup note). | low | `docker-compose.yml`, README, runbooks | |

Checked and fine: no sideways page scroll at any width or scheme; images reserve space; browse states render cleanly at 320 and 1440 in both schemes; skeleton holds card ratios; experience text measure and type match 03/D03.
