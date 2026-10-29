FAIL

## spec-compliance: U-030 "Picks rail" (head b54a97d)

Scope: H-67 (owner, 2026-10-29). Diff `origin/main...HEAD` is two files: `src/components/HomeModules/HomeModules.module.css` and `src/components/HomeStates/HomeStates.module.css`. No TSX changed. Branch commit 103918d is an ancestor of b54a97d; the merge adds no CSS.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Phones: Picks card is full column width with an 8 px peek of the next card | PASS | `HomeModules.module.css:115-117` `.rail > li { flex: 0 0 calc(100% + var(--size-gutter) - var(--space-4) - var(--space-2)) }`. Math: the rail bleeds G on each side, so the 100% base is the column W and the padding box is W + 2G. Card = W + G - 16 - 8 = W when G = 24. Card 2 starts at W + 16; the visible edge is W + G = W + 24; peek = 8. Rendered 320 and 390 numbers agree (see AC 6). |
| 2 | "On this week" rail checked the same way (builder says it is a vertical stack) | PASS (note) | `ThisWeekSection.tsx:20` uses `styles.stack`, not `styles.rail`. `HomeModules.module.css:179-186` is a flex column with `gap`, so each horizontal card fills the column at phone widths and no card sits beside another. The 8 px peek cannot apply, and the rule does not touch `.stack` (unchanged in the diff). Satisfies the check as a no-op. Premise in H-67 ("the week rail shares the CSS") is wrong; see Non-blocking. |
| 3 | Tokens only; mobile first; desktop (768 up) unchanged | PASS | Only `var(--size-gutter)`, `var(--space-4)`, `var(--space-2)` and percentages in the new rule (`HomeModules.module.css:116`); no px literals added. Rule sits in the base (phone) block; the 768 block at `HomeModules.module.css:288-320` sets `.rail { display: grid; grid-template-columns: repeat(3, ...) }` and `.rail > li { max-width: none }`, so flex-basis is ignored at 768+. `HomeStates.module.css:225` `width: 100%` is overridden at 768 by `HomeStates.module.css:299-302` `width: auto; max-width: none` on `.cards` (in the 768 block, around line 296-300 of the file). Desktop unchanged. |
| 4 | Home skeleton's rail matches the loaded rail | FAIL | Card width matches: `HomeStates.module.css:225` gives `.cards` width 100% of the skeleton column (`HomeStates.module.css:70-76` `.skeletonInner`, band gutter at line 65-68), the same W as the loaded card. But the skeleton has no peek: `HomeStates.module.css:230-232` `.cards > :not(:first-child) { display: none }` hides cards 2 and 3 below 768, so the skeleton shows one full-width card and no sliver of the next. The loaded rail shows an 8 px sliver (AC 1). Not a rail either: it is a one-column grid. No skeleton before/after shot exists (AC 6). |
| 5 | Only HomeModules.module.css and HomeStates CSS change; no TSX | PASS | `git diff --name-only origin/main...HEAD` lists only the two `.module.css` files. |
| 6 | Evidence: 320 and 390 before and after, measured card width and peek | PASS (note) | `evidence/pr/unit-U-030-picks-rail/measurements.md` (table: 320 card 204/44 before, 240/8 after; 390 card 264/55 before, 310/8 after). Shots: `picks-320-light-before.png`, `picks-320-light-after.png`, `picks-390-light-before.png`, `picks-390-light-after.png`. Notes: the numbers are Storybook `PicksMobile` in a 16 px frame, not the full page; no shot or measurement for the home skeleton or the week stack. |

### Blocking
- `src/components/HomeStates/HomeStates.module.css:230-232` (AC 4): the phone skeleton hides every Picks card after the first, so the skeleton has no 8 px peek and no rail behaviour. The loaded rail (`HomeModules.module.css:115-117`) shows the peek. Fix: on phones, let the second skeleton card show (for example make `.cards` a flex row with the same `calc(100% + ...)` basis and `overflow` on the band, or drop the `display: none` below 768 and clip with the band edge), then re-measure at 320 and 390 against the loaded rail. If Dave accepts the skeleton without the peek, record it as a departure in `audits/design-departures.md` and mark AC 4 N/A; that is an owner call, not a builder call.

### Non-blocking
- H-67 premise and commit title: the owner text says the week rail shares the CSS, and commit 103918d says "Picks and week rails fill the column with an 8 px peek". The week module is a stack (`ThisWeekSection.tsx:20`). Audit item: correct H-67 and the commit wording in the PR body.
- Evidence gaps: the shots are the Storybook frame, not the full page at 320 and 390; the skeleton has no before/after; the week stack has no shot. Audit item for the PM.
- Desktop: the 768 grid makes `.rail > li` flex-basis inert, so desktop is unchanged by construction; no 768 shot was supplied to prove it. Optional.

### Unconfirmed
- The measured peek values (8 px at 320 and 390) are the PM's Playwright run on `unit/U-030-picks-rail` (103918d). I did not re-run Storybook (read-only). The arithmetic above and the before and after PNGs agree with those numbers.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/measurements.md: the card and peek table at 320 and 390, before and after.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-320-light-after.png: 240 px card, peek visible at the right edge of the frame.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-390-light-before.png: 264 px card, second card at 55 px visible (before the fix).
