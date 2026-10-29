# U-025 nav targets: measured link heights

Measured by the PM on 2026-10-29 with Playwright (Chromium) against `next dev` for main (before) and `unit/U-025-nav-targets` (after), page `/does-not-exist` (the 404 renders the real guest header and footer without a database), light scheme. Height is each link's `getBoundingClientRect().height`; "overflow" is `document.documentElement.scrollWidth > viewport width`.

| Width | Before: logo | Before: nav links | Before: footer links | After: logo | After: nav links | After: footer links | Overflow before / after |
|---|---|---|---|---|---|---|---|
| 320 | 32 | (menu) | 24 | 44 | (menu) | 44 | no / no |
| 390 | 32 | (menu) | 24 | 44 | (menu) | 44 | no / no |
| 640 | 32 | (menu) | 24 | 44 | (menu) | 44 | no / no |
| 768 | 32 | 36 | 24 (a wrapped link 44) | 44 | 44 | 44 | no / no |
| 800 | 32 | 36 | 24 (a wrapped link 44) | 44 | 44 | 44 | no / no |
| 850 | 32 | 36 | 24 | 44 | 44 | 44 | no / no |
| 1024 | 32 | 36 | 24 | 44 | 44 | 44 | no / no |
| 1280 | 32 | 36 | 24 | 44 | 44 | 44 | no / no |

The header search pill measures 54 px at every desktop width, before and after (not a link changed here). Header height is unchanged: 60 px at 390, 78 px at 1280, before and after.

Pictures: `header-targets-390/1280-light-before/after.png` outline every header link (red, injected by the capture script, not in the code) so the 32 to 44 and 36 to 44 change is visible; `header-page-*` are the unoutlined headers (identical before and after, as intended); `footer-page-390/800/1280` before and after.
