FAIL

## spec-compliance: U-002 "notice styles" (head b2fd1d4)

### Blocking
- src/components/Notices.test.tsx:1-42: AC 6 asks for tests for the three components (PageHeading, NotFoundNotice, ErrorNotice). The file covers NotFoundNotice (line 9) and ErrorNotice (line 27) only. PageHeading has no test of its own; it is reached only through the h1 assertions in those two tests, and nothing asserts its className or gutter. Fix: add a `describe('PageHeading')` in the same file that renders `<PageHeading title="...">` with one child and asserts the level-1 heading, the child, and the `styles.page` class (or the header element). This is the single open item; the other seven ACs pass.

### Non-blocking
- None.

### Unconfirmed
- None.

### Acceptance criteria
| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | PageHeading, NotFoundNotice, ErrorNotice styled by a CSS module; gutter matches ExperienceError; tokens for type | PASS | `src/components/PageHeading.module.css:1-10` (padding `var(--space-8) var(--space-6)`, identical to `src/components/ExperiencePage/ExperienceError.module.css:8`); `src/components/PageHeading.tsx:8-9` applies the module. NotFoundNotice and ErrorNotice have no module of their own; they are styled through PageHeading's `.page` and `.title` and the Button/ButtonLink modules. Read as satisfied. |
| 2 | 404 home link is ButtonLink, error retry is Button, no raw browser-blue link | PASS | `src/components/NotFoundNotice.tsx:8-10` (ButtonLink, variant primary); `src/components/ErrorNotice.tsx:10-12` (Button, variant secondary). No raw `<a>` remains in the three components. |
| 3 | Tokens only in new CSS | PASS | `src/components/PageHeading.module.css` uses only `var(--…)` for colour, spacing, size, family, line-height, weight. The sole literal is the `768px` media value at line 34, the same breakpoint as `ExperienceError.module.css:29`. All referenced tokens exist in `src/styles/tokens.css`. |
| 4 | Mobile first, min-width only | PASS | `src/components/PageHeading.module.css:34` (`@media (min-width: 768px)`); no max-width queries. |
| 5 | Copy unchanged from main | PASS | Diff of `NotFoundNotice.tsx` and `ErrorNotice.tsx` keeps "We can't find that page", "The link may be old or mistyped.", "Go to the Ramble home page", "Something went wrong on our side", "This page did not load. Try again in a moment.", "Try again". Only element wrappers changed. |
| 6 | Story per state (404, error with retry); tests for the three components | PARTIAL, counted FAIL | Stories PASS: `src/components/Notices.stories.tsx:30` (NotFoundMobile), `:34` (NotFoundDesktop), `:39` (ErrorMobile, with `fn()` retry), `:43` (ErrorDesktop). Tests FAIL for PageHeading: see Blocking. |
| 7 | Files changed limited to the allowed set | PASS | `git diff --stat origin/main...HEAD` lists exactly: ErrorNotice.tsx, NotFoundNotice.tsx, PageHeading.tsx, PageHeading.module.css (new), Notices.stories.tsx (new), Notices.test.tsx (new), tests/error-boundaries.test.tsx. No route file, no src/lib, no ExperienceError or HomeError, no gutter token. |
| 8 | Before-and-after evidence, 404 and error, phone and desktop, light and dark | PASS | Folder `evidence/pr/unit-U-002-notice-styles/` holds 16 files (notfound and error × 390 and 1280 × light and dark × before and after). Checked visually; see Evidence. |

Meta items: none in the AC list.

Evidence:
- evidence/pr/unit-U-002-notice-styles/notfound-390-dark-before.png: 404 on phone, dark, on main. Heading flush to the left edge, home link in browser blue on the dark canvas.
- evidence/pr/unit-U-002-notice-styles/notfound-390-dark-after.png: 404 on phone, dark, on the branch. Heading inside the gutter; home link is a primary ButtonLink that fills the phone width.
- evidence/pr/unit-U-002-notice-styles/error-1280-light-after.png: error state on desktop, light, on the branch. Heading inside the gutter; "Try again" is a secondary Button at its own width.

---
<sub>spec-compliance | haiku | read-only | head b2fd1d4</sub>
