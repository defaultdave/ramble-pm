PASS

## qa-agent: U-023 "Line heights scale with the text" (head 66039ca)

Method: I did not run a browser. I relied on the PM's Playwright run (measurements and 8 pictures) and on reading the CSS in the worktree. The PM's "after" build was `f6edbb5`; the checked head `66039ca` is a merge of main into that commit. It is a descendant of `f6edbb5`, and the diff against `origin/main` touches only the token build script, `tokens.css`, `tokens.test.ts`, `BookingPanel.module.css` and `HomeStates.module.css`. So the PM's after-run covers the same CSS.

### Blocking
None.

### What each picture shows
- hero-390-text100-light-before.png: Mobile hero card. Neighborhood select "Anywhere in New York", date field "11/02/2026", red "Find something to do" button. All text complete, fields evenly sized.
- hero-390-text100-light-after.png: Same layout and copy, nothing clipped. Measured 52 / 52 and 24 px line, same as before. Compared by eye, the lower fields sit about 1 px lower in the after picture. The PM's measured heights do not change, so I read that as image cropping and rounding, not a layout change (non-blocking, see below).
- hero-390-text200-light-before.png: Text doubled. The select is still a short box (52 px) holding large "Anywhere in..." text, tight against its edges and shorter than the taller date field below it. The button label wraps onto three lines and overlaps its own box ("Find / something to / do"). This is the cramped select the unit fixes.
- hero-390-text200-light-after.png: Both fields are taller and matched (74 / 76 px). "Anywhere in..." has room above and below, with the same ellipsis for width. The date field is complete. The button label wraps onto three lines inside a taller button and no longer collides. Nothing clipped.
- hero-1280-text100-light-before.png: Desktop single row: select, date field, button. All complete.
- hero-1280-text100-light-after.png: Identical layout and copy, with the same 1 px offset as at 390 (picture crop). Same measured 52 / 52.
- hero-1280-text200-light-before.png: The select is a short box ("Any...") next to a taller date field, so the two are mismatched. The "Neighborhood" and "When" labels overlap each other. The select's text sits cramped in the box.
- hero-1280-text200-light-after.png: The select and date field are taller (74 / 76) and visually matched, the text sits inside with room, the button is aligned and complete. No clipped text. The label overlap ("Neighborhood" over "When") remains in the after picture. It is in the before picture too, so it is not a regression, but it is a remaining large-text defect.

### Skeleton bars at 100 percent
I read `HomeStates.module.css` and `tokens.css`. Every bar height that used a `--font-line-height-*` px token now uses `calc(font-size token * ratio token)`: heading lines (display-l), body lines (body-l), rail heading (heading-m), picks heading (heading-l), summary (body-m), label (label). Checking each product against the old px value:
- Mobile: display-l 40 x 1.1 = 44; display-m 32 x 1.1875 = 38; heading-l 24 x 1.25 = 30; heading-m 20 x 1.3 = 26; heading-s 17 x 1.4118 = 24.0006; body-l 18 x 1.5556 = 28.0008; body-m 16 x 1.5 = 24; body-s and label 14 x 1.4286 = 20.0004; caption 12 x 1.3333 = 15.9996.
- Desktop overrides: display-l 64 x 1.0625 = 68; display-m 48 x 1.125 = 54; heading-l 32 x 1.1875 = 38; heading-m 24 x 1.25 = 30; heading-s 18 x 1.4444 = 25.9992.
The largest difference is 0.0008 px, inside the 0.001 px tolerance. Each bar multiplies by the font size of the same name and the same breakpoint, so at 100 percent a skeleton bar is the same height as before. At larger text it grows with the text, as intended.
`BookingPanel.module.css` (the `margin-block` for a link) got the same font-size x ratio change, which gives 20 px at 100 percent as before. I did not run a skeleton story, so the 100 percent skeleton check rests on the CSS and the arithmetic above.

### Non-blocking
- Hero 200 percent (both widths): the "Neighborhood" and "When" labels overlap at 1280, and the button label wraps to three lines at 390. Both appear before and after, outside this unit's stated change (line height). Suggest logging as an audit item for large-text layout.
- The 1 px vertical offset between before and after at 100 percent in the pictures looks like capture cropping. A same-viewport re-capture would settle it.

### Unconfirmed
- Skeleton story at 100 percent, not rendered by me (no browser run). Rests on the CSS and the PM's hero measurements.
- Pictures were captured at `f6edbb5`, not at the merge head `66039ca`.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/measurements.md: heights before and after at 100 and 200 percent (52/52 unchanged; select 52 to 74 and date 62 to 76 at 200 percent; select line box 24 to 48 px).
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text100-light-before.png: mobile hero at 100 percent before.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text100-light-after.png: same view after, unchanged.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text200-light-before.png: mobile at 200 percent before, cramped select, mismatched fields.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text200-light-after.png: mobile at 200 percent after, taller matched fields.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-1280-text100-light-before.png: desktop hero at 100 percent before.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-1280-text100-light-after.png: same view after, unchanged.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-1280-text200-light-before.png: desktop at 200 percent before, short select beside taller date field.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-1280-text200-light-after.png: desktop at 200 percent after, fields matched, no clipping; label overlap remains.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a58914303abd85454/src/styles/tokens.css: unitless ratios and font sizes.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a58914303abd85454/src/components/HomeStates/HomeStates.module.css: skeleton bar heights as font size times ratio.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a58914303abd85454/src/components/BookingPanel/BookingPanel.module.css: link margin as font size times ratio.
