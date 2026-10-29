Posted on head c4d2f79 (4866b2d with main merged; the PM reran every gate on the merge commit). Code unchanged since this verdict.

PASS

## review-agent: U-025 "Nav targets reach 44px" (head 4866b2d)

### Blocking
None.

### Non-blocking
- Scope: diff is two CSS files, Header.module.css (.home, .navLink) and Footer.module.css (.list, .link). No TSX, gutter, colour or focus-ring token change. In scope.
- Tokens only: every value is a var() (--size-touch-target 44, --space-8 32, --space-3 12, --space-1 4); the arithmetic checks out. .home 32 + 2x6 = 44, margin -6 each side. .navLink 20 + 2x12 = 44, margin -4 each side (net 36, as before). .link 20 + 2x12 = 44.
- Header height: header-page-1280 before and after are both 78 px tall with identical positions. This holds structurally too: the search pill (min-height 44) is already the tallest item in the row, and the mobile menu button is 44, so the 44 px logo and nav boxes sit inside the row's existing height. Negative margins keep .start/.navList layout unchanged. No height change.
- Focus ring: the ring is a box-shadow on the link. No overflow:hidden on any ancestor of the header or footer (Header.module.css overflow:hidden is only on .searchLabel and .visuallyHidden; Footer has none). Ring is not clipped. The ring now hugs the 44 px box, so it is taller than the glyph; that is the intended larger target.
- Footer overlap: rows are 44 px with no gap and the li boxes stack, so adjacent targets touch and do not overlap. The footer grows taller (row pitch 28 to 44 px, and the first link sits 12 px lower under the group title). The owner chose row padding for the footer, so this is expected; flag for the visual check, not a defect.
- nowrap risk: the current longest label ("Host with Ramble", about 115 px at body-s) fits the 144 px minimum column. A future label wider than the column would overflow it, not wrap: at the two-column grid (about 344 to 767 px) it would run under the neighbouring column and could add sideways scroll; in the flex layout at 768 and up it would widen the groups row. Not reachable today, no test or fix needed now. Fix when it arises: allow wrapping with overflow-wrap, or shorten the label.
- Duplication: none; no new helper, constant or component.
- Comments: both new comments state a non-obvious why. The .link comment is long and half of it (nowrap) is a second reason; fine.

### Unconfirmed
- I did not run the dev servers or re-measure; I relied on the PM's 8-width measurements and read the before/after header images (1280).

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-025-nav-targets/header-page-1280-light-before.png and header-page-1280-light-after.png: header identical in height (78 px) and link positions.
- Same folder, header-page-390 and footer-page-390/800/1280 before/after pairs: not opened by me beyond the header 1280 pair; the PM measurements cover them.
