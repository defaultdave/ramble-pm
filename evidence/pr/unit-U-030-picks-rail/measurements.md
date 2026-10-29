# U-030 Picks rail: card width and next-card peek on phones

Measured by the PM on 2026-10-29 with Playwright (Chromium) on Storybook `Home/HomeModules` PicksMobile, built from main (`63d0b3f`, before) and `unit/U-030-picks-rail` (`103918d`, after). The Storybook frame adds 16 px of padding on each side, so the column inside the frame is the viewport minus 32 px minus two 24 px gutters; "peek" is the visible width of the second card, with the frame's 16 px taken off.

| Viewport | Column | Before: card / peek | After: card / peek |
|---|---|---|---|
| 320 | 240 | 204 / 44 | 240 / 8 |
| 390 | 310 | 264 / 55 | 310 / 8 |

After, one card fills the column and 8 px of the next shows, as Figma 01 Home draws it (a 342 px card on a 390 px page, 8 px peek). No sideways scroll on the page before or after. "On this week" is a vertical stack, not a rail, and is unchanged.
