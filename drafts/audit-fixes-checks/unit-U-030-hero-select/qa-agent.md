PASS

## qa-agent: U-030 "hero search select keeps its label whole" (head 99ac78f)

I did not run a browser. The sandbox does not allow a local server or Chromium here, so the measurements are the PM's (Storybook static builds of main and of this branch, story home-homemodules--hero-desktop, widths 390 to 1280). What I did myself: looked at all nine pictures and read the two CSS changes in the branch's own commit.

### What each picture shows
- 720 before: stacked? No. Row layout (select, date, button side by side); the label is CUT, "Anywhere in ...".
- 720 after: stacked layout (Neighborhood, When, button each full width); label WHOLE, "Anywhere in New York".
- 1200 before: row layout; label CUT, "Anywhere in N...".
- 1200 after: stacked; label WHOLE.
- 1247 before: row layout; label CUT, "Anywhere in New ...".
- 1247 after: stacked; label WHOLE.
- 390 after: stacked, label whole. Phone layout is the same stacked form as the 720 after picture (image, badge, headline, one field per line, full width button); no row layout, nothing cut. I have no 390 before picture, so "unchanged" rests on the CSS: the change only moves a min-width container query, which a 390px phone never reaches under either value.
- 1180 dark after: stacked, label whole. The picture shows the LIGHT theme (cream page, white card), not dark. The file name says dark. Non-blocking, see below.
- 1280 after: row layout (copy column 736px), label WHOLE, "Anywhere in New York" with the chevron right after it, tight fit (PM measured exactly 172 px of 172 needed).

### CSS check
- src/components/HomeModules/HomeHero.module.css: `@container (min-width: 640px)` became `@container (min-width: 736px)` on the `.search` row rule. The comment explains the 736 sum (2 x 230 + 218 + 2 x 12 + 34 = 736).
- src/components/HomeStates/HomeStates.module.css: the matching `@container (min-width: 640px)` on `.search` became `736px`.
- Both are 736px, so the skeleton and the loaded hero switch to the row at the same container width. The branch commit changes only these two files. (A three-dot diff against local main also lists .claude/standards/architecture.md; that is main moving ahead with PR 233 and is not this branch's change.)

### Blocking
None.

### Non-blocking
- hero-search-1180-dark-after.png is not dark. Replace it with a real dark-theme capture before it goes into the PR body, or rename it.
- No 390 before picture, so the "phone unchanged" claim is argued from the CSS rather than shown.
- At 1280 the fit is exact (172 for 172). A font that renders a pixel wider would clip again; the PM's measurement is the only guard.
- Picture 1280 and 1247 differ in layout (row vs stacked) because the container, not the viewport, decides; this is as intended.

### Unconfirmed
- The PM's measureText numbers (room 124/132/156 before, 218 to 611 after, 172 exactly at 1280). I did not repeat them; the pictures agree with them at 720, 1200, 1247 and 1280.

### Evidence
All in /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/:
- hero-search-720-light-before.png: row layout, label cut to "Anywhere in ..."
- hero-search-720-light-after.png: stacked layout, label whole
- hero-search-1200-light-before.png: row layout, label cut to "Anywhere in N..."
- hero-search-1200-light-after.png: stacked layout, label whole
- hero-search-1247-light-before.png: row layout, label cut to "Anywhere in New ..."
- hero-search-1247-light-after.png: stacked layout, label whole
- hero-search-390-light-after.png: phone stacked layout, label whole
- hero-search-1180-dark-after.png: stacked layout, label whole (light theme, not dark)
- hero-search-1280-light-after.png: row layout, label whole
Also read: /Users/davidfleming/Workspace/ramble-pm/drafts/wave3-review-rules.md; in the worktree, src/components/HomeModules/HomeHero.module.css and src/components/HomeStates/HomeStates.module.css (via git diff of commit 99ac78f).
