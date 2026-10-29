Posted on head 957737c (99ac78f with main merged; the PM reran every gate on the merge commit). Code unchanged since this verdict.

PASS

## review-agent: U-030 "hero select clipping, N1029-2" (head 99ac78f)

### Blocking
None.

### Non-blocking
- 736 is derived correctly. Checked against the CSS: select = 172 text + 16 left padding (`--space-4`, Input.module.css `.input`) + 40 right padding (`--space-10`, `.selectControl`) + 2 border = 230. Two selects 460 + button 218 = 678, two `--space-3` gaps 24 = 702, `.search` padding `--space-4` x2 = 32 + 1px border x2 = 2, total 736. `.copy` has no padding and is the container, so the query measures the same content box. The 172 and 218 are text widths I could not recompute without a browser; they match the PM's measurement (1280 "exactly fits").
- Skeleton threshold matches: HomeStates.module.css:335 and HomeHero.module.css:138 both 736, and both containers are the `.copy` column (container-type at HomeStates.module.css:157 and HomeHero.module.css:22). Same column geometry, so no row/stack flip between skeleton and page. The only `@container` rules in `src` are these two; no other 640 is keyed to the hero or skeleton (the remaining queries are viewport `@media` at 768, 1024, 1200).
- Where the row now applies: below 768 the copy column is vw-48 (max 719), so it stacks at every phone/small-tablet width. From 768 the copy column is 384 at 768 and 640 at 1152 (art takes 416 plus 48 gap). The column reaches 736 only at viewport 1248 and above, because the inner caps at 1200 (art 416, gap 48, copy 736). So the row shows at 1248+, and 736-768 and 1152-1247 stay stacked on both the skeleton and the page. No shift.
- Zero spare at every width of 1248+ (copy is pinned at 736 there, not just at 1280). A fallback font wider than the body font, or browser text-only zoom, would clip "Anywhere in New York" again to the ellipsis. Viewport zoom is safe: it lowers the CSS viewport and stacks the row. No token or rule makes the fallback likely, so non-blocking. If wanted later, a small margin (for example 752) costs nothing, since the column is fixed at 736 and the row would then never show; that would need a layout decision (art width or gap), so not for this unit.
- Skeleton `.submitBar` is `calc(--space-16*3 + --space-8)` = 224px vs the real button's 218px (HomeStates.module.css:343). Pre-existing, 6px of width, split across the two flex fields, no height change. Audit item: derive the skeleton button width from the same number, or let it match.
- Unconfirmed-adjacent: the "When" date field at 230px was not measured by me; the PM's pictures show it, and the date input only needs about 130px of content.

### Unconfirmed
- Button content width 218 and the 172px label width (browser measurement; I did not run Storybook).

Tests: `pnpm test` in the worktree: 162 files, 3617 tests, all passed.
Scope: two CSS threshold values and one comment, within IN SCOPE; no TSX, no tokens, no stories. Comment explains a non-obvious why and names no ticket.
