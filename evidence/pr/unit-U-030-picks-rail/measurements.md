# U-030 Picks rail: card width and next-card peek on phones

Measured by the PM on 2026-10-29 with Playwright (Chromium) on Storybook `Home/HomeModules` PicksMobile, built from main (`63d0b3f`, before) and `unit/U-030-picks-rail` (`103918d`, after). The Storybook frame adds 16 px of padding on each side, so the column inside the frame is the viewport minus 32 px minus two 24 px gutters; "peek" is the visible width of the second card, with the frame's 16 px taken off.

| Viewport | Column | Before: card / peek | After: card / peek |
|---|---|---|---|
| 320 | 240 | 204 / 44 | 240 / 8 |
| 390 | 310 | 264 / 55 | 310 / 8 |

After, one card fills the column and 8 px of the next shows, as Figma 01 Home draws it (a 342 px card on a 390 px page, 8 px peek). No sideways scroll on the page before or after. "On this week" is a vertical stack, not a rail, and is unchanged.

## Loading skeleton (round 2, `e4ea57c`)

Same method on `Home/HomeStates` LoadingMobile and LoadingDesktop, before (main `63d0b3f`) and after (`e4ea57c`). The stories draw both color schemes side by side in a `1fr` grid, whose min-content floor let the skeleton's pill row widen the frame past the viewport (1160 px at 320, before and after alike). The real page has no such grid, so the measurement sets that track to `minmax(0, 1fr)` first. Widths and left edges are in the light frame; the loaded rail is HomeModules PicksMobile from the same build.

| Viewport | Before: skeleton card / cards shown | After: skeleton card / left edges | Loaded Picks after: card / left edges | Peek after (skeleton and loaded) |
|---|---|---|---|---|
| 320 | 204 / 1 (cards 2 and 3 hidden) | 240 / 40, 296, 552 | 240 / 40, 296, 552 | 8 |
| 390 | 264 / 1 (cards 2 and 3 hidden) | 310 / 40, 366, 692 | 310 / 40, 366, 692 | 8 |
| 1280 (desktop) | 384 × 3 at 40, 448, 856 | 384 × 3 at 40, 448, 856 | n/a | n/a |

After, the skeleton's first card has the loaded card's width and position at both phone widths and 8 px of the second card shows, so nothing moves sideways when Picks arrives. The card heights differ by 8 to 12 px (309 vs 321 at 320, 355 vs 347 at 390): the skeleton's text bars stand in for copy whose length the data decides. Desktop is unchanged. No sideways page scroll in any case.

Shots: `skeleton-320-light-{before,after}.png`, `skeleton-390-light-{before,after}.png`, `skeleton-desktop-1280-light-{before,after}.png`.
