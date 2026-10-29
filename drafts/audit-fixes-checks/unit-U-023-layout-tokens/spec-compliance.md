FAIL

## spec-compliance: U-023 "layout tokens" (head 63d0b3f)

Checked the diff `origin/main...HEAD` in worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a2e4839e7099da720` against the six acceptance criteria (owner decisions H-70 and N1029-7, audit row N1029-6). Read-only; nothing posted to GitHub.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Field-height 52 and gutter 24 in the Figma variables, library JSON, and regenerated `tokens.css` | PASS | `tokens/figma-variables.json:454` (value 52) and the `size/gutter` entry after it; `docs/design/figma-library.json:171-172` (`VariableID:199:3`, `VariableID:199:4`); `src/styles/tokens.css:63-64`. Regenerated `tokens.css` with `scripts/tokens/build.ts` in a scratch copy and it is byte-identical to the worktree file. |
| 2 | 52 px field literals use `var(--size-field-height)`; no other 52 px field literal | PASS | `src/components/Input/Input.module.css:30`; `src/components/HomeStates/HomeStates.module.css:196`. A grep of `src` CSS finds no other 52 px or 3.25rem literal outside `tokens.css:63`. |
| 3 | Every page gutter uses `var(--size-gutter)` at every width; browse lines up with the header from 768 | PASS, see Unconfirmed for the header's right edge | Header `Header.module.css:2`, `:196`; Footer `Footer.module.css:4`, `:98`; Browse `page.module.css:7`; HomeHero `HomeHero.module.css:4`; HomeModules `HomeModules.module.css:4`, Picks rail `:98-99`, `:102`; HomeStates `HomeStates.module.css:4`, `:67`, Picks rail `:208-209`; ExperiencePage `ExperiencePage.module.css:7`; ExperienceError `ExperienceError.module.css:7`; PageHeading `PageHeading.module.css:7`. Measured browse 24/24 at 768 (`measurements.md`). |
| 4 | Experience column lines up with the header from 1248; 404 and error notices the same | PASS | Gutter on the outer `.page` `ExperiencePage.module.css:7`; cap and centring on the single grid column `:4-5`; inner padding zeroed at `:23`, `:93`, `:266`; gallery's 768 inline padding block removed (`ExperienceGallery.module.css`, hunk at 117). Error notice `ExperienceError.module.css:4-7`. 404 renders `src/app/(guest)/not-found.tsx` → `src/components/NotFoundNotice.tsx` → `PageHeading`, which carries the same grid and gutter. Arithmetic at 1248 (header and experience both start at 24), 1280 (40) and 1440 (120) agrees with the measurement table. |
| 5 | Tokens only, mobile first, min-width only, no TSX change | PASS, see Non-blocking | No `max-width` and no new `@media` in the diff; `git diff --stat` lists no `.tsx` file. The only literal change is `FilterBar.stories.module.css:8-9` (see Non-blocking). |
| 6 | Before and after pictures and a measurement table for h1 vs logo on home, browse, experience, 404 at 390 and 1280 (experience at 1440), and no overflow | FAIL | Pictures present for every required pair in `evidence/pr/unit-U-023-layout-tokens/` (home, browse, experience 390/1280/1440, 404 390/1280). The table in `measurements.md` covers the h1 and logo alignment, and every required row reads equal after the change. The overflow clause has no data: the table has no scroll-width column, and the paragraph's "nothing scrolls sideways at any width" is an assertion with no measured value behind it. |

### Blocking
- **AC 6 (no overflow):** `evidence/pr/unit-U-023-layout-tokens/measurements.md` has no overflow measurement. Fix: add a column per page and width (390, 1280, 1440) with `document.documentElement.scrollWidth` against `window.innerWidth` (or `clientWidth`) before and after, and rerun the Playwright measurement so the table backs the sentence. No code change is needed for this item.

### Non-blocking
- `src/components/FilterBar/FilterBar.stories.module.css:8-9`: the stories-only phone width changed from `18rem` to `17rem`. That is a literal, not a token, and falls outside the page-gutter list. It is the right number (320 minus 2 × 24 = 272 px = 17rem), so keep it, and consider writing it as `calc(20rem - 2 * var(--size-gutter))` so the next gutter change does not need a second edit. The comment at `:8` is already updated.

### Unconfirmed
- `src/components/Header/Header.module.css:2`: below 768 the header's right padding stays `var(--space-2)` (8 px) and only the left uses `var(--size-gutter)`. AC 3 reads "every page gutter ... 24 px at every width", and the owner decision is 24 px. If the 8 px right inset is meant to bring the header's action button closer to the edge, AC 3 holds as written and the owner should confirm it. If the 24 px applies to both edges, the header needs `var(--size-gutter)` on the right too. Owner or PM to decide; I did not treat this as a FAIL.
