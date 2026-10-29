FAIL

## architecture-audit: U-030 "one PageError for the home and experience error states, and one retry width" (head 2ded8f7)

### Blocking
- `src/components/PageError/PageError.tsx:24-26` and `PageError.module.css` `.page`, `.title` (B17): duplicates the existing `PageHeading` shell (`src/components/PageHeading.tsx`, `PageHeading.module.css`), which already renders an h1 at display-m, the gutter padding, the content-max grid column and a children slot, and which `ErrorNotice` already uses for its error state. Fix: render `<PageHeading title={title}>` with the Alert and the retry form as children, and extend PageHeading's lone-action rule (`.page > button`, which reaches only a direct child) so the retry takes its label width from 768 px; add the cases to PageHeading's tests and stories rather than a second header module.

### Non-blocking
- audit item: `src/components/HomeStates/HomeStates.module.css` `.page`, `.pageInner`, `.title` repeat the same shell (pre-existing). (PM: H-99.)
- audit item: error copy now sits in the app shells (`HomeContent.tsx:36-41`, `experiences/[slugAndId]/page.tsx:54-58`); it sat in components before, so pre-existing, but further from `src/lib`. (PM: H-100.)
- audit item: browse's error block (`BrowseResults.tsx:105-115`) is a third copy of the alert-and-retry pattern; scoped out by the brief. (PM: H-101.)

### Unconfirmed
- Whether PageHeading's grid gives the same 768 px retry width; needs a Storybook check after the fix.

### Clean
- Folder convention, exports, no references to the deleted components; import directions hold; no decisions (B2); tokens only (B16); `PageErrorProps` used (B7); no `'use client'` (B8); ErrorNotice is a different pattern but shares PageHeading.
