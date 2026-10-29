PASS

## qa-agent: U-030 "Picks rail: card fills the column, 8 px peek" (head b54a97d)

I did not run a browser. I relied on the PM's Playwright run (measured at 103918d). The merge commit b54a97d changes no CSS relative to 103918d (git diff 103918d b54a97d -- '*.css' is empty), so the measured styles are the head's styles. I checked the numbers against the pictures by pixel position and against the CSS by arithmetic.

### Blocking
None.

### What each picture shows
- Figma 01 Home (390 wide): the Picks card runs from the 24 px gutter to the right gutter (about 342 px, the full column). A sliver of the next card shows at the right frame edge, about 8 px, after a 16 px gap. The "On this week" list below is a vertical stack.
- picks-390 before: card spans x 40 to 304 (264 px); the next card starts at 320 and shows about 54 px ("Whe", "timer", "From"). The card is narrower than the column and the peek is large, not like Figma.
- picks-390 after: card spans x 40 to 350 (310 px), the full column. The next card starts at 366 and shows 8 px up to the frame padding edge at 374. This is the Figma shape: one card fills the column, a thin sliver of the next. Title wraps to two lines and nothing is clipped (image, title, place, duration, price all inside the card).
- picks-320 before: card x 40 to 244 (204 px); next card starts at 260, about 44 px visible, text cut ("Wh", "firs"). Card is clearly short of the column (240).
- picks-320 after: card x 40 to 280 (240 px), the full column; next card starts at 296 with an 8 px sliver at the frame edge. Title fits on two lines, price and "See all 12 picks" intact. Nothing clipped.
- The white strip right of x 374 in the 390 pictures is the Storybook frame's own 16 px padding, not the product. Inside it the rail runs to the frame's content edge, so the rail does bleed past the column into the gutter (the 8 px sliver sits in the gutter), as Figma does at the screen edge.
- Compared with Figma: card width equals column in both (342 of 390 in Figma, 310 of 390-32 in Storybook), peek about 8 px in both, same card order (image, title, place and duration, price). Matches.

### Skeleton
HomeStates.module.css `.cards` changed from `width: 85%` to `width: 100%`. The loaded rail card is now the column width, so the loading card, a single card in a one-column grid inside the same gutter band, is now the same width as the loaded first card. `max-width` is the same on both (6 x --space-16), so the two stay equal on wider phones and tablets. Before, the skeleton card (85%) was narrower than the loaded one, so it jumped on load; that is fixed. The skeleton shows no 8 px sliver of a second card, so it is not pixel-identical to the loaded rail, only the first card's width matches. Non-blocking.

### Non-blocking
- The skeleton has no peeking second card; a loaded rail shows an 8 px sliver. Cosmetic, the first card does not move.
- The CSS arithmetic (100% + gutter - 16 - 8 = 100% at a 24 px gutter) equals the column exactly; it relies on --size-gutter staying 24 px and the rail gap staying --space-4. If the gutter token changes, the calc follows it, but the PM only measured 320 and 390, not tablet widths.

### Unconfirmed
- No width measured by me; no browser run. Dark mode and widths above 390 were not checked.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/audit-home-2026-10-28/figma-01-home-44-10.png: Figma Picks card at column width, 8 px next-card sliver.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/measurements.md: PM widths, 320: 204/44 before, 240/8 after; 390: 264/55 before, 310/8 after.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-320-light-before.png: card 204 px, 44 px peek, text cut.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-320-light-after.png: card 240 px fills column, 8 px sliver, nothing clipped.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-390-light-before.png: card 264 px, about 54 px peek.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/picks-390-light-after.png: card 310 px fills column, 8 px sliver, nothing clipped.
- src/components/HomeModules/HomeModules.module.css and src/components/HomeStates/HomeStates.module.css in /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a4689a0828b66a758 (diff 103918d~1..103918d): rail card flex-basis calc, skeleton 85% to 100%.
