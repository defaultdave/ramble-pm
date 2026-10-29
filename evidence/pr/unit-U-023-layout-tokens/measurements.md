# U-023 layout tokens: page edges against the header logo

Measured by the PM on 2026-10-29 with Playwright (Chromium) against `next dev`, before (main plus PR 236, no CSS change) and after (`unit/U-023-layout-tokens` at `63d0b3f`, main merged). Each page renders its error state (the dev server reads through the Neon HTTP driver, which cannot reach the local Postgres; audit item BE-19), which uses the same page gutter as the loaded page. Values are `getBoundingClientRect().left` in px of the header logo link, the page h1 and the first footer link.

| Page | Width | Before: logo / h1 | After: logo / h1 |
|---|---|---|---|
| Home | 390 | 16 / 24 | 24 / 24 |
| Home | 768 | 24 / 24 | 24 / 24 |
| Home | 1280 | 40 / 40 | 40 / 40 |
| Browse | 390 | 16 / 16 | 24 / 24 |
| Browse | 768 | 24 / 16 | 24 / 24 |
| Browse | 1280 | 40 / 40 | 40 / 40 |
| Experience | 390 | 16 / 24 | 24 / 24 |
| Experience | 1280 | 40 / 64 | 40 / 40 |
| Experience | 1440 | 120 / 144 | 120 / 120 |
| 404 | 390 | 16 / 24 | 24 / 24 |
| 404 | 1280 | 40 / 64 | 40 / 40 |
| 404 | 1440 | 120 / 144 | 120 / 120 |

After, the h1 equals the logo on all four pages at 320, 390, 768, 1280 and 1440; the footer's first link equals the logo on phones; nothing scrolls sideways at any width. The phone gutter moves from 16 to 24 px for the header, footer and browse (owner decision N1029-7).
