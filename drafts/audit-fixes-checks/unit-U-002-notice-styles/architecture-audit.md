PASS

## architecture-audit: U-002 "notice styles (BE-13)" (head b2fd1d4)

Rules: `.claude/standards/architecture.md` (project), B1 to B17 plus A1 to A6. Base origin/main.
Files audited: src/components/{ErrorNotice,NotFoundNotice,PageHeading}.tsx, PageHeading.module.css, Notices.stories.tsx, Notices.test.tsx, tests/error-boundaries.test.tsx.

### Blocking
None.

Rule by rule: B1, B3, B5, B6, B9 to B15 not touched (no fetch, server, env, money, time, catch, cache, or route code in the diff). B2: no filter, sort, parse, or display string added; the components stay markup from props. B4: components import only `@/components/*`. B7: no new non-type exports. B8: no `'use client'` added or needed. `ErrorNotice` is reached only through the `error.tsx` client boundaries (which carry `'use client'` themselves), and `NotFoundNotice` imports only `ButtonLink` (no hooks, no handlers), so it stays server-safe. B16: no inline `style`; every colour, spacing, font-family, font-size, line-height, weight, and max-size in PageHeading.module.css is a `var(--...)` token and each one exists in src/styles/tokens.css. The only literal is the `768px` media-query breakpoint, which is the repo's existing convention (FilterBar, Footer, Alert, Header, BrowseResults, ExperienceError all use it; a custom property cannot sit in a media query) and is not a colour, spacing, radius, or font-size literal. B17 (own code): the diff reuses `Button` and `ButtonLink` instead of the raw `button` and `Link`, and adds no helper; see the audit item below for the CSS.

### Non-blocking
- audit item (B17, CSS copy): src/components/PageHeading.module.css:1-21 (`.page`, `.title`) repeats `.page` and `.title` of src/components/ExperiencePage/ExperienceError.module.css:1-19 almost line for line (same box, flex column, gap, gutter, font stack, display-m title; this one adds body-m size and line-height). The `.title` block and the `.page` gutter/cap also match HomeStates.module.css (`.page`, `.pageInner`, `.title`, at display-l size), and the 768px stretch rule (:29-39) is the same idea as `.retry` in both. It is a copy, not an extension of existing code. B17 as written would reach it, since it covers a new component that nearly does the job of an existing one that could have been extended. The PM has accepted a separate module until H-61 consolidates the error components, and the copy is of CSS rules that already existed in two places. Treat it as an audit item for `audits/` (three modules now carry one error-page layout), not a block. Fix at H-61: one shared page-layout module, with ExperienceError and HomeStates composing it.
- audit item (pre-existing, not this diff): `.claude/standards/architecture.md` lists `Button` as a `'use client'` island (Dave, 2026-10-28, PR 222), but src/components/Button/Button.tsx on origin/main has no `'use client'` directive. It works today because every importer sits under a client boundary or is server-rendered without handlers. Not caused by this unit; log it so the PM can reconcile the file and the standard.
- PageHeading.module.css:26-37 styles children by element (`.page > a`, `.page > button`, `.page > p`). A future child of another element type, or a wrapper, silently loses the stretch and the paragraph colour. It matches how ExperienceError uses `.retry > button`, so it follows the repo's pattern; an explicit child class would be sturdier.

### Unconfirmed
- None. I did not run the test suite or Storybook; this audit is static.

Advisory: A1 to A6 not triggered (components synchronous, no client-island props, no hooks added).

---
<sub>architecture-audit | read-only</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
