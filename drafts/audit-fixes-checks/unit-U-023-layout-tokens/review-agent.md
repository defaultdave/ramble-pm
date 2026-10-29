PASS

## review-agent: U-023 "Layout tokens: field height and page gutter" (head 63d0b3f)

### Blocking
None.

Checked:
- Scope: 15 files, all CSS, JSON and the one stories CSS (FilterBar.stories.module.css, 18rem to 17rem = 320 minus 2 x 24). No TSX, no line-height, no colours, no header/footer target sizes.
- tokens.css: reran `node scripts/tokens/build.ts` (pnpm tokens:build) in a detached scratch worktree at HEAD; output identical to the committed file (git status clean apart from my node_modules link). The committed diff is exactly two lines, `--size-field-height: 52px` and `--size-gutter: 24px`, matching figma-variables.json (52, 24) and the VariableIDs 199:3 and 199:4 in figma-library.json.
- Field literals: `grep 52px src` outside tokens.css returns nothing. Replaced: Input min-height (was 52px) and HomeStates controlBar/submitBar (was touch-target 44 + space-2 8 = 52, same value).
- Gutter swaps: every swapped value was a page-edge inline padding or a rail negative margin that already matched the band padding: browse page, Header (left 16 to 24 on phones, 24 from 768), Footer, HomeHero, HomeModules section plus .pills margin/padding/scroll-padding (the Picks rail), HomeStates page, band, .pills, ExperiencePage, ExperienceError, PageHeading. No unrelated 24 px spacing was swapped. The space-6 values left alone (BookingPanel 10, Dialog, SimilarLink, Button, gaps) are component padding, not page gutter.
- Gallery: phones get `margin-inline: calc(-1 * var(--size-gutter))` on .gallery so it bleeds edge to edge past the page padding; at 768 and up the margin is reset to 0 and the old gallery rule (max width, centring, 24 px padding) is dropped because the grid column now caps and centres it. Net width 768 and up is the same as before.
- Grid shapes: PageHeading and ExperienceError use `grid-template-columns: minmax(0, 1200px)` plus `justify-content: center`; `align-self` became `justify-self` (stretch on phones, start from 768), so actions stay full width on phones and content width from 768. ExperiencePage `order: -1` still works in grid. The inner header/body paddings went from 24 to 0 horizontally because the gutter moved to .page: no double gutter.
- Browse: page has no box-sizing reset (none in src/styles), so content-box with a 1200 cap plus the 24 gutter gives a 1200 content column that lines up with the header and experience from 1248.
- Header right padding on phones stays space-2 (8) next to the menu button; left is the gutter. Intentional and consistent with the brief.
- Defect classes (unbounded work, DB vs Zod, failing open, data in logs): not applicable, CSS only. Duplication: none; the two tokens replace literals and no new helper was added.

### Non-blocking
- Still on the old 16 px gutter at the page edge: GuestShell.module.css:10 and SiteBanner.module.css:3 (`padding: var(--space-2) var(--space-4)`), BookingBar.module.css:11 (`var(--space-3) var(--space-4)`), and the Dialog sheet paddings (Dialog.module.css:55, 108, 114). The banner and the booking bar sit at the page edge, so on a phone their text starts at 16 px while the header logo starts at 24 px. Audit item: move SiteBanner/GuestShell and BookingBar to `--size-gutter` in a follow-up. Dialog is its own surface and can stay.
- FilterBar.module.css:85 (`padding-inline: var(--space-4)` at a wider breakpoint) is not a page gutter as far as I can tell; left alone. Worth a glance when the banner and bar move.

### Unconfirmed
- I did not run the dev servers or the stories; I relied on the PM measurements (h1 equals logo left edge at 320, 390, 768, 1280, 1440) and the reported gate results on 63d0b3f. The CSS reading above agrees with them.

**Evidence** (relied on, not added):
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-layout-tokens/measurements.md: h1 left edge equals the header logo's left edge on home, browse, experience and 404 at five widths, no sideways scroll.
