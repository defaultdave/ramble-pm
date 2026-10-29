PASS

## a11y-audit: U-023 "layout tokens" (head 63d0b3f)

Static read of the diff `origin/main...HEAD` in the worktree, plus the PM's measurements (`evidence/pr/unit-U-023-layout-tokens/measurements.md`). No browser run in this audit.

### Blocking
- None.

### Non-blocking
- `src/components/FilterBar/FilterBar.stories.tsx:126` and `src/components/FilterBar/FilterBar.module.css` (`.calendar` comment, about line 70): both still say "288 px" for a 320 px phone. The gutter is now 24, so the content width is 272 px, and the story frame was correctly moved to 17rem (272 px). Correct the comments to 272 px.
- Reading order (WCAG 1.3.2, 2.4.3), pre-existing and not introduced here: `ExperiencePage.module.css` `.gallery` keeps `order: -1` on phones, so the photos paint above the header and title while the DOM puts them after. The grid conversion keeps the same order behavior as the old flex column. Not a change in this unit; log it as an audit item.
- Chip row (WCAG 1.4.10, pre-existing): `FilterBar.module.css` `.chips` is a one-dimension horizontal scroller below 768 px (`overflow-x: auto`). The page itself does not scroll, and no chip is clipped from reach, but a horizontal chip row at 320 is not pure reflow. Consider wrapping instead of scrolling in a later unit. Not changed by this diff.
- Footer links (`Footer.module.css:71`) are `white-space: nowrap`. The PM measured no sideways scroll at 320 on all four pages, and the footer is on each, so this is fine at default text size. Watch it at 200 percent text (see Unconfirmed).

### Unconfirmed
- Loaded browse page at 320 (not measured; the PM run rendered error states). Checked statically: `BrowseResults` grid is `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`, so cards fit 272 px. `Card.module.css` `.price` (line 87) is `nowrap` inside a card with `overflow: hidden`, so a long price line would be clipped (1.4.10 loss of information) if it exceeds the card's inner width at 272 px. Confirm with a 320 px render of the browse grid with real fixture prices.
- Loaded experience page at 320 (not measured). `ExperiencePage.module.css:115` `.price` is `nowrap`. The grid column is `minmax(0, 1200px)` and sets no automatic minimum, so an unbreakable item wider than 272 px would overflow the page and cause sideways scroll. Long text is covered by `overflow-wrap: anywhere`. Confirm at 320 with a long-price fixture.
- 1.4.4 and 1.4.12 at 320 with 200 percent text: not measured. Static read: the input and date field use `min-height` (the field height token is still 52 px), and the chip uses `min-height`, so they grow. The footer and header nowrap labels (header `.searchLabel` is ellipsized, which can hide text under 1.4.12 spacing) need a live check.
- Focus indicators: the new grid containers (`PageHeading`, `ExperiencePage` `.page`, `ExperienceError` `.page`) set no `overflow`, so they cannot clip rings. The gallery `.strip` ring is an inset box-shadow, so it stays inside the scroll box. The chip row keeps its focus-ring padding. No new clipping found. Confirm visually at 320 with keyboard focus on the chip row and the gallery strip.
