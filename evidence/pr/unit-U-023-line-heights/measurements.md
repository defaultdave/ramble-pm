# U-023 line heights: hero fields at 100 and 200 percent text

Measured by the PM on 2026-10-29 with Playwright (Chromium) on Storybook `Home/HomeModules` HeroMobile (390 px) and HeroDesktop (1280 px), built from main (`63d0b3f`, before) and `unit/U-023-line-heights` (`f6edbb5`, after). "200 percent text" doubles every `--font-size-*` token on the page (what a text-only zoom does to these pixel font sizes); heights are `getBoundingClientRect().height` in px.

| View | Text | Before: select / date field | After: select / date field | Select line height before / after |
|---|---|---|---|---|
| Hero 390 | 100% | 52 / 52 | 52 / 52 | 24px / 24px |
| Hero 390 | 200% | 52 / 62 | 74 / 76 | 24px / 48px |
| Hero 1280 | 100% | 52 / 52 | 52 / 52 | 24px / 24px |
| Hero 1280 | 200% | 52 / 62 | 74 / 76 | 24px / 48px |

Before, at 200 percent the select kept a 24 px line box under 32 px text and stayed 52 px while the date field grew: the select's text is cut. After, both fields grow with the text, and at 100 percent nothing moves.

## Private-session link (round 2, `488d885`)

The a11y check found that round 1's link margin still read the px font-size token, so a browser's text-only zoom, which scales an element's computed font-size and leaves the tokens alone, would get a 40 px line box with a margin worked out for 20 px. Round 2 computes the margin from the element's own line box: `calc((1lh - var(--size-touch-target)) / 2)`.

Measured by the PM on Storybook `Composites/BookingPanel` SoldOut at 390 px (Chromium). "Tokens ×2" doubles every `--font-size-*` token, as the earlier tables do; "text-only ×2" doubles the link's own computed font-size and leaves the tokens alone, which is what Firefox's "Zoom text only" does. Chromium has no text-only zoom, so the second row stands in for it; it was not checked in Firefox.

| Build | Zoom | Font size | Line height | Margin | Link box | Gap above |
|---|---|---|---|---|---|---|
| main `63d0b3f` | 100% | 14 | 20 | -12 | 44 | 4 |
| main `63d0b3f` | text-only ×2 | 28 | 20 (px token, does not grow) | -12 | 44 | 4 |
| round 1 `66039cb` | 100% | 14 | 20 | -12 | 44 | 4 |
| round 1 `66039cb` | tokens ×2 | 28 | 40 | -2 | 80 (two lines) | 14 |
| round 1 `66039cb` | text-only ×2 | 28 | 40 | -12 (wrong) | 80 | 4 |
| round 2 `488d885` | 100% | 14 | 20 | -12 | 44 | 4 |
| round 2 `488d885` | tokens ×2 | 28 | 40 | -2 | 80 | 14 |
| round 2 `488d885` | text-only ×2 | 28 | 40 | -2 | 80 | 14 |

At 100% nothing changes. Under text-only zoom round 2 gives the margin the larger line box asks for, the same as the token method. On main the text grew inside a 20 px line, so its two lines overlapped. Shots: `privatelink-100-{before,after}.png`, `privatelink-200-textonly-{before,after}.png` (before = main).
