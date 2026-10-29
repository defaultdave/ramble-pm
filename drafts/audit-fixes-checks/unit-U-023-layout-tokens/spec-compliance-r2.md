PASS

## spec-compliance: U-023 "layout tokens" (head 63d0b3f)

Round 2 re-check. Code unchanged since round 1 (worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a2e4839e7099da720` still at 63d0b3f2e9b6f1ee2d7ddb02e66a6cd791657cc2). Only the evidence changed. Read-only; nothing posted to GitHub.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Field-height 52 and gutter 24 in tokens, library JSON, and `tokens.css` | PASS (round 1 stands) | `src/styles/tokens.css:63-64` |
| 2 | 52 px field literals use `var(--size-field-height)` | PASS (round 1 stands) | `src/components/Input/Input.module.css:30`, `src/components/HomeStates/HomeStates.module.css:196` |
| 3 | Every page gutter uses `var(--size-gutter)`; browse lines up with header from 768 | PASS (round 1 stands) | `src/components/Header/Header.module.css:2`, `src/app/(guest)/browse/page.module.css:7`; measured 768 browse 24/24 in `measurements.md` |
| 4 | Experience column lines up with header from 1248; 404 and error notices the same | PASS (round 1 stands) | `ExperiencePage.module.css:7`, `ExperienceError.module.css:4-7`, `PageHeading.module.css:7` |
| 5 | Tokens only, mobile first, min-width only, no TSX change | PASS (round 1 stands) | No `max-width` or new `@media` in the diff; no `.tsx` in `git diff --stat` |
| 6 | Before/after pictures and measurement table for h1 vs logo on home, browse, experience, 404 at 390 and 1280 (experience at 1440), and no overflow | PASS | `evidence/pr/unit-U-023-layout-tokens/measurements.md` now has a "Sideways scroll before / after" column on all 12 rows. Required pages and widths are covered: home 390/1280, browse 390/1280, experience 390/1280/1440, 404 390/1280/1440. Every row reads "no / no". The definition (`document.documentElement.scrollWidth > window.innerWidth`) is stated in the file. Pictures for each required pair are present in the same folder. |

### Blocking
- None.

### Non-blocking
- `src/components/FilterBar/FilterBar.stories.module.css:8-9` (round 1 note stands): the stories-only literal `18rem` became `17rem`. Consider `calc(20rem - 2 * var(--size-gutter))` so the next gutter change is one edit.

### Unconfirmed
- `src/components/Header/Header.module.css:2`: the header's right padding below 768 stays `var(--space-2)` (8 px). The PM states this is intentional: the menu button's own 44 px target supplies the visual inset, and decision N1029-7 covers the page content edge, which the h1 and footer measure. The h1 and footer measurements support that reading. Not a FAIL. Owner may still want to confirm the 8 px right inset against N1029-7's wording.
