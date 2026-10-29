PASS

## spec-compliance round 2: U-030 "Picks rail" (head e4ea57c, branch wip/U-030-picks-rail-r2)

Scope: H-67. Diff `origin/main...HEAD` is two files, both `.module.css`: `src/components/HomeModules/HomeModules.module.css` and `src/components/HomeStates/HomeStates.module.css`. No TSX changed. Round 2 (`e4ea57c`) touches only `HomeStates.module.css`.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Phones: Picks card full column width, 8 px peek of next card | PASS | `HomeModules.module.css:115-117` `.rail > li { flex: 0 0 calc(100% + var(--size-gutter) - var(--space-4) - var(--space-2)) }`. Unchanged by round 2. Measured 240/8 at 320 and 310/8 at 390 (`measurements.md`). |
| 2 | "On this week" checked the same way | PASS (no-op) | `ThisWeekSection.tsx:20` uses `styles.stack`, a column; the rule is not applied to it. Unchanged by round 2. |
| 3 | Tokens only; mobile first; desktop unchanged | PASS | New rules use only `var(--size-gutter)`, `var(--space-2)`, `var(--space-4)`, `var(--space-16)`, `var(--space-1)`, `var(--space-6)`, `0` and percentages; no px literals. Round 2 768 block (`HomeStates.module.css:~309-321`) restores `display: grid`, `repeat(3, minmax(0,1fr))`, `gap: var(--space-6)`, `margin-inline: 0`, `padding: 0`, `overflow: visible`, and `.cards > * { max-width: none }`, so the grid is back to its pre-round-2 shape at 768 and up. Desktop skeleton measured identical before/after (384 x 3 at 40, 448, 856). The `.pills > li` change in HomeModules (`flex: 0 0 85%` removed from the shared selector) is inert for pills: `HomeModules.module.css:123-126` sets `flex: none` on `.pills > li` later in the same file. |
| 4 | Home skeleton's rail matches the loaded rail (width, position, peek) | PASS | `HomeStates.module.css:221-237`: `.cards` is a flex row with `margin-inline: calc(-1 * var(--size-gutter))` and `padding: var(--space-1) var(--size-gutter)`, so its padding box equals the band's outer edge, as the loaded rail's bleed does. `.cards > *` uses the same flex basis as `.rail > li`, and card 2 is no longer hidden (the round-1 `display: none` rule is gone). Arithmetic: basis W + G - 16 - 8 = W with G = 24, so card 1 is W wide at left edge G (inside the frame: 40 at 320 and 390), card 2 starts at G + W + 16, and peek = G - 16 = 8. The PM's numbers match: 320 skeleton 240 / lefts 40, 296, 552, identical to the loaded rail; 390 skeleton 310 / lefts 40, 366, 692, identical to the loaded rail. Heights differ by 8 to 12 px because the skeleton text bars are placeholders; AC 4 names width, position and peek only, so this does not block. |
| 5 | Only HomeModules.module.css and HomeStates CSS change; no TSX | PASS | `git diff --name-only origin/main...HEAD` lists only the two `.module.css` files. `e4ea57c --stat` shows one file, `HomeStates.module.css`. |
| 6 | Evidence: 320 and 390 before and after, measured width and peek; now also skeleton before/after | PASS | `evidence/pr/unit-U-030-picks-rail/measurements.md` has the round-2 "Loading skeleton" section with before/after numbers at 320, 390 and desktop 1280. Shots present: `skeleton-{320,390}-light-{before,after}.png` and `skeleton-desktop-1280-light-{before,after}.png`. |

### Overflow check (requested)
- `.cards` sets `overflow: hidden` (`HomeStates.module.css:~226`). Its children (`flex: 0 0 <W>`, `max-width` 384 px at most) therefore cannot push the page sideways; anything past the padding box is clipped, and the padding box ends at the band's outer edge, which is the viewport edge minus nothing (band padding equals the gutter).
- The band (`.band`, `HomeStates.module.css:65-68`) has no overflow setting of its own, but nothing in it is wider than the band's outer box after the clip.
- The phone basis is about W <= 310 px at 390, so no child is wider than the column and the container; the flex row does not wrap, but the overflow clip stops it from widening the page. PM measured no page scroll at 320 or 390.
- Not verified in a browser by me (read-only). I rely on the PM's no-sideways-scroll note plus the clip.

### Blocking
- None.

### Non-blocking
- H-67 premise: the owner text still says the week rail shares the CSS. It does not (`ThisWeekSection.tsx:20`). Correct H-67 and the commit title of `103918d` ("Picks and week rails fill the column...") in the PR body.
- Measurement harness: the skeleton numbers were taken with the Storybook `1fr` grid track changed to `minmax(0, 1fr)` to remove the 1160 px frame overflow. That is a harness change, not a code change, and the measurements.md says so. Say so in the PR body too.
- Desktop 768+ skeleton and loaded rails were measured at 1280 only. Optional: a 768 shot.

### Unconfirmed
- The measured numbers are the PM's Playwright run on Storybook. I did not re-run them.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/measurements.md (round-2 "Loading skeleton" table).
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/skeleton-320-light-after.png and skeleton-390-light-after.png.
