PASS

## qa-agent: U-030 "one PageError for the home and experience error states, and one retry width" (head 4e13d94, round 2)

### Blocking
None.

### Non-blocking
- The browse 1280 px captures are a 640 px light half beside a 640 px dark half; the retry change reads clearly in both.

### Checks run
- Home 320 px: display-l to display-m, top padding about 48 to 32 px, retry full width in both, copy identical, dark matches.
- Home 768 px: display-l to display-m, block padding 64 to 32 px, retry from a full-width bar to label width (about 105 px).
- Home 1280 px: as 768 px; retry from a 1200 px bar to label width.
- Experience 320 px: identical. Experience 1280 px: title and padding unchanged; retry from a 320 px cap to label width.
- Browse 320 px: identical. Browse 1280 px: retry from a 240 px bar to label width; nothing else changes.
- ErrorNotice (also PageHeading) 1280 px: byte-identical before and after.
- Home and experience at 1280 px now match in title size, 32 px block padding and retry width.
- `vitest run` on PageError, HomeStates, ExperiencePage, BrowseResults, Notices.test.tsx, `src/app/(guest)`, `src/app/(ops)`: 83 passed (scratch worktree, removed).

Evidence (`evidence/pr/unit-U-030-page-error/`):
- `home-error-320-light-*`: title smaller, retry full width, copy unchanged.
- `home-error-768-light-*`: title smaller, padding 64 to 32 px, retry to label width.
- `home-error-1280-light-*`: as 768 px.
- `experience-error-320-light-*`: identical.
- `experience-error-1280-light-*`: retry from 320 px to label width.
- `browse-error-320-light-*`: identical. `browse-error-1280-light-*`: retry from 240 px to label width.
- `group-error-notice-1280-light-*`: byte-identical (ErrorNotice unchanged).
