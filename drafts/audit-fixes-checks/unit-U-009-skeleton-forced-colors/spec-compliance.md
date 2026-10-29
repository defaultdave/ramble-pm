PASS

# Spec Compliance: unit/U-009-skeleton-forced-colors (head ab09c4c)

Spec: audit row H-81 (`audits/home-2026-10-28.md:111`) plus H-72 resolution (`audits/home-2026-10-28.md:102`). Diff: `git diff origin/main...HEAD`, 4 CSS files, 27 insertions, 3 deletions.

Changed files: `src/components/DatePicker/DatePicker.module.css`, `src/components/Dialog/Dialog.module.css`, `src/components/HomeStates/HomeStates.module.css`, `src/components/Skeleton/Skeleton.module.css`.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Forced colors keeps skeleton bars and art tile visible, in HomeStates and BrowseSkeleton (via Skeleton) | PASS | `HomeStates.module.css:257-263` (`.art`, `.bar`, `outline: 1px solid GrayText`, inset -1px). `Skeleton.module.css:139-148` (`.image, .tag, .title, .meta, .price, .line`). `.art` used at `HomeSkeleton.tsx:48`; `.bar` at `HomeSkeleton.tsx:24-38`. `BrowseSkeleton.tsx:1,10,14` renders `Skeleton`. Shot `home-forced-390-after.png` shows outlines on all bars and the art tile. |
| 2 | Dark mode bars stand out from canvas more than before | PASS | Bar fill `HomeStates.module.css:89` and `:169` and `Skeleton.module.css:14` now `--color-bg-disabled`. Dark value `tokens.css:59` is `palette-ink-700` (#3d332b) versus the old dark `--color-bg-sunken` = `palette-ink-950` (`tokens.css:55`). Measured 1.04:1 to canvas before, 1.50:1 after (`measurements.md`). Canvas ink-900 = rgb(24,19,15) checks against the palette. |
| 3 | Light mode unchanged | PASS | Light `--color-bg-disabled` = `palette-ink-100` (`tokens.css:101`), identical to light `--color-bg-sunken` (`tokens.css:97`). Measured rgb(243,234,219) before and after. |
| 4 | Tokens only; no edit to `tokens.css` or generator | PASS | `tokens.css` and `scripts/tokens/build.ts` are not in the changed-file list. Fills use `var(--color-bg-disabled)`. Non-blocking note: the forced-colors block uses the CSS system keyword `GrayText`, not a token (see Non-blocking). |
| 5 | No layout change (sizes, gaps) | PASS | The diff changes only `background` values and adds `outline` / `outline-offset` (outline does not affect box size). No `width`, `height`, `gap`, `padding`, or `margin` lines appear in the diff. |
| 6 | DatePicker and Dialog changes are comments only | PASS | `DatePicker.module.css:93` added line is a `/* ... */` comment (the `outline: none` line is unchanged). `Dialog.module.css:38` added line is a `/* ... */` comment. No declarations added in either file. |
| 7 | Out-of-scope untouched: TSX, `.github/`, `.claude/`, `CLAUDE.md`, `scripts/merge-desk/`, `docs/adr/`, `docs/plan/` | PASS | Changed-file list contains no `.tsx`, `.ts`, or protected paths. |
| 8 | Evidence: before and after shots in light, dark, forced, with measured fills | PASS | `evidence/pr/unit-U-009-skeleton-forced-colors/` has 12 PNGs: `{home,browse}-{light,dark,forced}-390-{before,after}.png`. `measurements.md` has measured fills per mode, canvas values, and the outline value. |

## Blocking

None.

## Non-blocking

- **AC 4 (tokens only):** `GrayText` in both forced-colors blocks is a CSS system color keyword, not a design token and not a hex value. This is the right form for forced colors, since tokens would not follow the user's contrast palette. Recorded so the reviewer can accept it explicitly.
- **AC 2 and semantics:** the skeleton fill now borrows `--color-bg-disabled`, a token for disabled controls. A future change to disabled styling would move skeletons too. A semantic skeleton token would fix this, but adding it touches `tokens.css`, which AC 4 forbids in this PR. Suggest a follow-up unit.
- **H-72 resolution:** the resolution cites `Card.module.css:25`. No Card comment is added, which matches AC 6 (DatePicker and Dialog only). Confirm that is the intent.
- **AC 8 evidence scope:** shots come from Playwright Chromium's emulated forced-colors palette (white canvas), not a real Windows contrast theme. The `GrayText` outline should be checked on a real theme when one is available.
- **Harness overflow in the forced shot:** `home-forced-390-after.png` shows a chip row running off the right edge. The measurements note says the story grid was patched for this harness. It is not part of this diff.
