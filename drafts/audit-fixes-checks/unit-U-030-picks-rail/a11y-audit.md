PASS

## a11y-audit: U-030 "Picks rail" (head b54a97d)

### Blocking
- None.

### Non-blocking
- `src/components/HomeModules/HomeModules.module.css` (`.rail`, `.rail > li`): with 8 px of the next card showing, the only visible cue that the Picks rail scrolls is that peek. There is no chevron, arrow button, dot indicator, or fade, and on iOS the scrollbar is an overlay that stays hidden. Discoverability is weak but not a WCAG failure (no direct criterion). Mitigation: `PicksSection.tsx` always renders the "See all" link (`seeAll` is a required prop, rendered after the rail), which gives keyboard and screen-reader users the same cards without scrolling. Advisory: confirm the `seeAll.href` target lists every pick.
- `src/components/Card/Card.module.css` `.card:has(.titleLink:focus-visible)` draws a focus ring 4 px outside the card (2 px canvas gap plus 4 px ring). The rail's vertical padding is `--space-1` = 4 px and `overflow-x: auto` clips at the padding edge, so the ring fits exactly with zero margin. Any reduction of that padding, or a larger ring, would clip the top and bottom of the focus indicator (2.4.7 / 1.4.11 risk). Advisory, not blocking.

### Unconfirmed
- 2.4.11 (focus not obscured) and keyboard reach, static reasoning only, not run in a browser: each card's title link is focusable (`Card.tsx` line 101, stretched via `::after`). Tabbing to an off-screen card makes the browser scroll the rail to it. `scroll-padding-inline: var(--size-gutter)` places the snapped card at the column edge (24 px in from the viewport on each side), so a focused card is not hidden at either edge. No sticky overlay sits over the rail, so nothing else covers focus.
- 1.4.10 reflow: the rail bleeds with `margin: 0 calc(-1 * var(--size-gutter))` inside a section with `padding: ... var(--size-gutter)`, so its border box ends exactly at the viewport edges and does not add page width. The rail is the only horizontal scroller, which the criterion permits. This matches the PM's measurement of no page overflow at 320 and 390. I did not run a browser; I relied on the PM's Playwright measurement plus this static reasoning.
- Peek width: the change from 85% to a calc basis gives an 8 px peek (`100% + gutter - space-4 - space-2`, which reduces to the column width); this agrees with the PM's measurement table. Not a11y-blocking.
- The `@media (min-width: 768px)` block switches `.rail` to a 3-column grid with `overflow: visible`, so the new flex-basis does not apply on tablet and up.

Evidence relied on (ramble-pm):
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/measurements.md`: 320 and 390 measurements (peek 8 px after, no page overflow before or after).
- Branch sources read in worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a4689a0828b66a758`: `src/components/HomeModules/HomeModules.module.css`, `src/components/HomeModules/PicksSection.tsx`, `src/components/Card/Card.tsx`, `src/components/Card/Card.module.css`, `src/styles/tokens.css`.

---
<sub>a11y-audit | haiku | read-only</sub>
