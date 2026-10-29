PASS

## qa-agent: U-030 "one PageError for the home and experience error states, and one retry width" (head 2ded8f7)

### Blocking
None.

### Non-blocking
- The experience error's title sits about 32 px lower at 1280 px (64 px block padding from 768 px, the home pattern); not listed in the brief.
- Home title display-l to display-m (the owner's H-61 ruling).
- At 1280 px home and experience now match in title size, padding and retry width; browse's retry shrinks from a 240 px bar to its label.

### Checks run
- Home pair: title about 72 px to 48 px; retry from a 1152 px bar to about 105 px; copy identical.
- Experience pair: title unchanged; retry from a 320 px cap to label width; top padding grows.
- Browse pair: retry from 240 px to label width, light and dark; nothing else changes.
- Phones: all three retries full width at 320 px; experience and browse pairs identical; nothing overflows in either theme.
- `vitest run` on PageError, HomeStates, ExperiencePage, BrowseResults and `src/app/(guest)`: 80 passed; a temporary test asserted the home error's h1, form action "/" and method "get" (deleted afterwards).

Evidence: the twelve before and after files in `evidence/pr/unit-U-030-page-error/` (home, experience, browse at 320 and 1280 px).
