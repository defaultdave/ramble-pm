Posted on head 63d0b3f (round 2 plus main merged; the PM reran every gate there: 3741 unit, 195 storybook, 161 e2e, build, gitleaks).

PASS

## qa-agent: U-023 "layout tokens" (head 63d0b3f)

How I checked: I did not run a browser. I relied on the PM's Playwright run and viewed all 18 files in the evidence folder (9 before and after pairs). I confirmed the worktree head is 63d0b3f2e9b6f1ee2d7ddb02e66a6cd791657cc2.

### Blocking
None.

### What the pictures show
- Pairs are the same page in the same state. Each pair has the same page, width (390 or 1280, experience also 1440), light theme and error state (home "We couldn't load the home page", browse "We couldn't load experiences", experience "We couldn't load this experience", 404 "We can't find that page"). Only spacing differs. The 404 shows its real not-found content. The others are error notices, as the PM said (BE-19).
- Home 390: before, the logo and footer sit at 16 px and the h1 and notice at 24 px, so the logo is 8 px left of the title. After, logo, h1, notice, button and footer all sit at 24 px on one line.
- Browse 390: before, everything is at 16 px. After, header, title, intro, notice, button and footer are all at 24 px. The intro text rewraps to three lines and nothing is clipped.
- Experience 390 and 404 390: same as home. Logo 16 and title 24 before, both 24 after.
- Home 1280 and browse 1280: logo, h1 and footer are at 40 px in both before and after. Nothing changed, as the table says. The footer is shorter on the left side only in the sense below.
- Experience 1280: before, the title, notice and button start at 64 px, 24 px inside the logo at 40 px. After, they start at 40 px, level with the logo and the footer logo. The notice now ends at 1240, level with the search pill.
- Experience 1440: before, content starts at 144 px against the logo at 120 px. After, it starts at 120 px, level with the logo.
- 404 1280: before, the title and button start at 64 px against the logo at 40 px. After, both are at 40 px.
- Nothing is clipped, no horizontal scrollbar is visible in any picture, and the right edges (search pill, notice, footer link columns) are unchanged and inside the viewport.

### Non-blocking
- The footer link rows are taller after the change on every page and width (for example at 390 the links are 44 px apart instead of 28, and the footer starts 88 px higher on the page at 390 and 52 px higher at 1280 because the empty main area stays the same height but the footer grows). This is not in the stated change (gutter, field height token, experience and notice alignment). It looks like larger tap targets. The PM should confirm it is intended; it is not a defect in what I saw.
- The measurements table lists 320 and 768 widths with no picture. I took the numbers from the table and could not verify them.
- The footer first-link left edge is stated in the table but not tabulated; the pictures show it level with the logo at 390 (24 px) and 1280 (40 px).

### Unconfirmed
- The experience gallery bleeding to the screen edge at 390: not checked. The page renders its error state in the PM's run, which has no gallery, and I did not run a browser. Needs a run against a seeded database.
- The 52 px field height token on real fields (search, filters, forms): no picture shows a field. Not checked.
- Phone widths of 320 and sideways scrolling: relied on the PM's measurements only.

### Evidence
All under /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-layout-tokens/
- measurements.md: logo and h1 left edges before and after for 12 page and width combinations
- home-390-light-before.png: logo and footer at 16, title at 24
- home-390-light-after.png: all at 24
- home-1280-light-before.png: all at 40 (baseline)
- home-1280-light-after.png: all at 40, footer links taller
- browse-390-light-before.png: all at 16
- browse-390-light-after.png: all at 24, intro rewrapped
- browse-1280-light-before.png: all at 40 (baseline)
- browse-1280-light-after.png: all at 40, footer links taller
- experience-390-light-before.png: logo 16, title 24
- experience-390-light-after.png: all at 24
- experience-1280-light-before.png: title and notice at 64, logo at 40
- experience-1280-light-after.png: title and notice at 40, level with logo
- experience-1440-light-before.png: title at 144, logo at 120
- experience-1440-light-after.png: title at 120, level with logo
- 404-390-light-before.png: logo 16, title 24
- 404-390-light-after.png: all at 24
- 404-1280-light-before.png: title and button at 64, logo at 40
- 404-1280-light-after.png: title and button at 40, level with logo

QA_VERDICT=PASS

---

a11y-audit (carried here; a11y is not a separate required check):

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
