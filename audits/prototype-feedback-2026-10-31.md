# Prototype feedback, 2026-10-31

The owner's click-through notes. IDs are `PF-<n>`. Figma: D01 Home `63:6`, hero search `63:43`, Header `40:32`.

| ID | Item | Found | Lane | Status |
|---|---|---|---|---|
| PF-1 | The "ramble" logo and the h1 jump when the fonts load. `src/app/fonts.ts` uses `display: swap`, and the fallback next/font generates defaults to Arial metrics, which fit a serif badly. Earlier lab runs measured CLS 0 with the font fast, so they missed this. | Code read; not yet reproduced under a slow font | `home-feedback` | open |
| PF-2 | The hero search has no Guests field (Figma: Neighborhood, When, Guests, button). Browse has no `guests` filter, so this needs a real filter, not only a field. | `HomeHero.tsx`, `src/lib/filters.ts` | `home-feedback` | open |
| PF-3 | Searches differ from Figma. Hero: no bordered card, stacks where Figma is one row, select reads "Anywhere in New York" against "Anywhere". Header pill: "Anywhere · Any day" against "Anywhere · This weekend · 2 guests". | `HomeHero`, `siteNav.ts:50` | `home-feedback` | open |
| PF-4 | Browse filters stack three rows of chips (When, Neighborhood, Category). Figma D02 `64:222` is one row: Filters pill with a count, date chip, selected category, Neighborhood, Price, Good for, Setting, then the count line. Phones open the 02b sheet `45:413`. This is unit U-033, not yet built; `FilterDrawer` exists with no caller. | `FilterBar.tsx`, audit note in `browse-experience-2026-10-28.md` | `home-feedback` | open: starts after PF-2 merges, both change `FilterBar` and `filters.ts` |
| PF-5 | Home skeleton to loaded page: below the heading, everything moves up 36 px at 390 and 4 px at 1440 when the data arrives, and the Guests field makes this worse. Layout-shift entries read 0 because the nodes are replaced, which is why every audit measured CLS 0. Probably most of what the owner saw as a jump: under the font swap the h1 box never moved and the logo moved about 2 px. Figures in `evidence/pr/unit-U-030-font-swap/`. | Delayed-read measurement, 2026-10-31 | `home-feedback` | open: builder on `unit/U-030-skeleton-match` from the guests branch |

## PM decisions (the owner can overrule)
- **"This weekend" stays out of both searches.** H-9 set the hero's When to today, and browse takes one date, not a range. The header sits in the static shell, so it cannot know today: the pill reads "Anywhere · Any day · 2 guests" and links to browse with `guests=2`, so the label stays true. A weekend range would be its own unit.
- **The hero button keeps "Find something to do"** (H-29), against Figma's "Find something".
- **U-033 is pulled forward in two PRs.** First the one-row bar and the drawer, on the filters that exist today. Then Price, Good for and Setting, each with a real filter, once their data is checked. A chip that filters nothing does not ship, so the first PR leaves those three chips out.
