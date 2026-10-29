# U-023 line heights: hero fields at 100 and 200 percent text

Measured by the PM on 2026-10-29 with Playwright (Chromium) on Storybook `Home/HomeModules` HeroMobile (390 px) and HeroDesktop (1280 px), built from main (`63d0b3f`, before) and `unit/U-023-line-heights` (`f6edbb5`, after). "200 percent text" doubles every `--font-size-*` token on the page (what a text-only zoom does to these pixel font sizes); heights are `getBoundingClientRect().height` in px.

| View | Text | Before: select / date field | After: select / date field | Select line height before / after |
|---|---|---|---|---|
| Hero 390 | 100% | 52 / 52 | 52 / 52 | 24px / 24px |
| Hero 390 | 200% | 52 / 62 | 74 / 76 | 24px / 48px |
| Hero 1280 | 100% | 52 / 52 | 52 / 52 | 24px / 24px |
| Hero 1280 | 200% | 52 / 62 | 74 / 76 | 24px / 48px |

Before, at 200 percent the select kept a 24 px line box under 32 px text and stayed 52 px while the date field grew: the select's text is cut. After, both fields grow with the text, and at 100 percent nothing moves.
