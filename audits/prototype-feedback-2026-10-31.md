# Prototype feedback, 2026-10-31

The owner's click-through notes. IDs are `PF-<n>`. Figma: D01 Home `63:6`, hero search `63:43`, Header `40:32`.

| ID | Item | Found | Lane | Status |
|---|---|---|---|---|
| PF-1 | The "ramble" logo and the h1 jump when the fonts load. `src/app/fonts.ts` uses `display: swap`, and the fallback next/font generates defaults to Arial metrics, which fit a serif badly. Earlier lab runs measured CLS 0 with the font fast, so they missed this. | Code read; not yet reproduced under a slow font | `home-feedback` | done, PR 292 and 294 |
| PF-2 | The hero search has no Guests field (Figma: Neighborhood, When, Guests, button). Browse has no `guests` filter, so this needs a real filter, not only a field. | `HomeHero.tsx`, `src/lib/filters.ts` | `home-feedback` | done, PR 291 |
| PF-3 | Searches differ from Figma. Hero: no bordered card, stacks where Figma is one row, select reads "Anywhere in New York" against "Anywhere". Header pill: "Anywhere · Any day" against "Anywhere · This weekend · 2 guests". | `HomeHero`, `siteNav.ts:50` | `home-feedback` | done, PR 291 |
| PF-4 | Browse filters stack three rows of chips (When, Neighborhood, Category). Figma D02 `64:222` is one row: Filters pill with a count, date chip, selected category, Neighborhood, Price, Good for, Setting, then the count line. Phones open the 02b sheet `45:413`. This is unit U-033, not yet built; `FilterDrawer` exists with no caller. | `FilterBar.tsx`, audit note in `browse-experience-2026-10-28.md` | `home-feedback` | done, PR 295 |
| PF-5 | Home skeleton to loaded page: below the heading, everything moves up 36 px at 390 and 4 px at 1440 when the data arrives, and the Guests field makes this worse. Layout-shift entries read 0 because the nodes are replaced, which is why every audit measured CLS 0. Probably most of what the owner saw as a jump: under the font swap the h1 box never moved and the logo moved about 2 px. Figures in `evidence/pr/unit-U-030-font-swap/`. | Delayed-read measurement, 2026-10-31 | `home-feedback` | done, PR 293 and 294 |
| PF-6 | The hero copy renders at 16 px where Figma has 18: `RichText` beats `.body` in `HomeHero.module.css`. Being confirmed by skeleton QA. | Skeleton build | `home-feedback` | done, PR 294 |
| PF-7 | With JavaScript off, browse never leaves its skeleton: Suspense swaps the streamed content in by inline script, so results and filters stay hidden. True on `main`. Earlier no-script promises and tests render components alone and miss it. Home is probably the same; not checked. | U-033 QA, raw streamed HTML; not seen in a real JS-off browser | later | open |
| PF-8 | Browse LCP: the first card photo is lazy. `ExperienceCardItem` never passes `preload` to `Photo`. In the owner's trace the seven photos were first requested at 2917 ms, after layout, at Low priority, where the document was parsed by 1500 ms. The photo was not reported as LCP only because the owner's tap at 3761 ms stopped LCP candidates; reported LCP (2385 ms, lede text) understates it. | Trace `browse-load-and-filter-click`, code read | `browse-perf` | PR 297 |
| PF-9 | Filter button slow to work. Two causes: (a) the drawer chunk loads on first hover or press, in three round trips (7576, 8119, 8703 ms, finished 9368 ms on Slow 4G), so the first press took about 1.8 s; (b) tapping before hydration (about 6.1 s here) does nothing: taps at 3.7 s and 5.0 s were lost. (b) is inflated by a 2.5 s LastPass content script on the main thread plus smaller extensions, at 15.7x CPU. | Trace | `browse-perf` | (a) PR 297; (b) open, needs a clean timing |
| PF-10 | Double tap closes the filter drawer: with the chunk loaded the first tap opens it, and the second tap (200 ms later, 14219 ms) lands on the overlay, which `isDismissable` treats as outside press. Shared `Dialog`, so the booking sheet can do the same. | Trace, `Dialog.tsx` | `browse-perf` | PR 297 |

## Browse baseline, clean profile (2026-10-31)
Production `5f5843c`-era build on `ramble-sand.vercel.app`, phone emulation 390 x 844 at 3x, Slow 4G, 4x CPU, no extensions, cache bypassed. Text LCP 1.8 s; an IMG candidate at 2.1 s, which is the blur placeholder, because the photo's own fetch started at 2.1 s and finished at 3.0 s. So Chrome's reported LCP passes while the real photo arrives near 3 s, and the after-run must compare photo arrival, not only reported LCP. First-card image: `loading=lazy`, `fetchpriority=auto`, top 327 px at 340 x 227, in the first viewport. A CLS of 1.00 on BODY appeared only on reloads right after an emulation change and not on a plain navigation: an emulation artifact, not a defect.

## PM decisions (the owner can overrule)
- **"This weekend" stays out of both searches.** H-9 set the hero's When to today, and browse takes one date, not a range. The header sits in the static shell, so it cannot know today: the pill reads "Anywhere · Any day · 2 guests" and links to browse with `guests=2`, so the label stays true. A weekend range would be its own unit.
- **The hero button keeps "Find something to do"** (H-29), against Figma's "Find something".
- **U-033 is pulled forward in two PRs.** First the one-row bar and the drawer, on the filters that exist today. Then Price, Good for and Setting, each with a real filter, once their data is checked. A chip that filters nothing does not ship, so the first PR leaves those three chips out.
- **Browse's no-script filter layer is dropped** from U-033: it could never be reached (PF-7).
- **`FilterDrawerHost` counts as the allowlisted filter drawer island** (B8), lazy-loaded.
- **Phone filter row scrolls inside its box**, as Figma's phone does, against the a11y audit's WCAG 1.4.10 reading. The owner asked for one row. From 768 it wraps.
- **Heading rows in the skeleton were fixed with the hero copy** in PR 294, because 401 to 430 px are common phones and it was the owner's jump.
- **A failed filter drawer load stays on the page** with a visible retry line, and the drawer opens only once its code arrived.

## Left open
- Android: `local('Noto Serif')` matching on a real Android phone is unconfirmed; Windows untested. Safari and Firefox focus return unverified. Skeleton breakpoints are tuned to the seeded copy; edited copy wraps elsewhere, and no committed test compares line counts.
- Card titles and prices styled in the display font on non-heading elements can still shift on Linux at 1x.
- Visually hidden CSS is copied in 13 modules.
- U-033 second PR, Should tier, back in its planned slot after the Prototype. Data checked on `main`: Setting can use `experiences.outdoor`; no Good for column exists, so it needs schema and seed work; the plan's list (price, age, indoor or outdoor, group size, access) differs from Figma's chips and needs reconciling first.
- Party size into the booking panel; skeletons on other pages unchecked.
