# U-009 skeletons: forced colors and dark-mode fill

Measured by the PM on 2026-10-29 with Playwright (Chromium) at 390 px on Storybook `Home/HomeStates` LoadingMobile and `Composites/BrowseSkeleton` Loading, built from main (`b01cdf8`, before) and `unit/U-009-skeleton-forced-colors` (`ab09c4c`, after). Animation is paused for the shots. The HomeStates story's `1fr` scheme grid is set to `minmax(0, 1fr)` first (a harness-only overflow, see `unit-U-030-picks-rail/measurements.md`). "Forced" is Playwright's `forcedColors: 'active'`, Chromium's emulated palette (white canvas); a real Windows contrast theme supplies its own `GrayText`.

| Story | Mode | Bar fill before | Bar fill after | Canvas | Bar outline after |
|---|---|---|---|---|---|
| Home and browse | light | rgb(243, 234, 219) | rgb(243, 234, 219) (unchanged) | rgb(251, 246, 238) | none |
| Home and browse | dark | rgb(18, 14, 11), 1.04:1 to canvas | rgb(61, 51, 43), 1.50:1 to canvas | rgb(24, 19, 15) | none |
| Home and browse | forced colors | forced to canvas: bars vanish | forced to canvas | Canvas | 1 px `GrayText`, inset |

Ratios against the card surface (builder, from `tokens.css`): dark 1.14 before, 1.37 after; light 1.19 both. Skeletons are `aria-hidden` and decorative, so no WCAG ratio applies; the aim is that they do not look like a blank or broken page.

Shots: `{home,browse}-{light,dark,forced}-390-{before,after}.png`.
