# Prototype feedback, 2026-10-31

The owner's click-through notes. IDs are `PF-<n>`. Figma: D01 Home `63:6`, hero search `63:43`, Header `40:32`.

| ID | Item | Found | Lane | Status |
|---|---|---|---|---|
| PF-1 | The "ramble" logo and the h1 jump when the fonts load. `src/app/fonts.ts` uses `display: swap`, and the fallback next/font generates defaults to Arial metrics, which fit a serif badly. Earlier lab runs measured CLS 0 with the font fast, so they missed this. | Code read; not yet reproduced under a slow font | `home-feedback` | open |
| PF-2 | The hero search has no Guests field (Figma: Neighborhood, When, Guests, button). Browse has no `guests` filter, so this needs a real filter, not only a field. | `HomeHero.tsx`, `src/lib/filters.ts` | `home-feedback` | open |
| PF-3 | Searches differ from Figma. Hero: no bordered card, stacks where Figma is one row, select reads "Anywhere in New York" against "Anywhere". Header pill: "Anywhere · Any day" against "Anywhere · This weekend · 2 guests". | `HomeHero`, `siteNav.ts:50` | `home-feedback` | open |

## PM decisions (the owner can overrule)
- **"This weekend" stays out of both searches.** H-9 set the hero's When to today, and browse takes one date, not a range. The header sits in the static shell, so it cannot know today: the pill reads "Anywhere · Any day · 2 guests" and links to browse with `guests=2`, so the label stays true. A weekend range would be its own unit.
- **The hero button keeps "Find something to do"** (H-29), against Figma's "Find something".
