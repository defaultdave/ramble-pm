PASS

## spec-compliance: U-030 "one PageError for the home and experience error states, and one retry width" (head 4e13d94, round 2)

### Blocking
- None. Round 1's item is resolved: `PageError.module.css` is deleted, and both pages take PageHeading's `padding: var(--space-8) var(--size-gutter)` at every width (experience 32 px; home 64 to 32 px from 768 px, the PM ruling).

### Non-blocking
- `ExperiencePage.stories.tsx:9`: the comment's trailing comma became a period. (PM: requested in round 2 as H-98.)
- Accepted builder choice: the rule is narrowed to `.page > form:has(> button:only-child)`, which keeps the ops unlock form unchanged.
- Accepted builder choice: no `Notices.test.tsx` case (the brief allows it; jsdom has no layout).
- PageHeading sets body-m `font-size` and `line-height` on the header, which the error page now inherits; the old shell did not. Covered by adopting the shell. (PM: the Alert and Button set their own type, and the captures show no change.)

### Per-criterion (combined round 1 and round 2 manifest)
- PageError props and markup via PageHeading, Alert, GET form, secondary "Try again": PASS (`PageError.tsx:18-33`).
- PageError composes PageHeading; its own shell CSS deleted: PASS.
- Content column and gutter now from `PageHeading.module.css:4-7`: PASS.
- PageError tests and stories unchanged and complete; index: PASS.
- Call sites (home "Ramble", "/"; experience "Experience", `experiencePath(address)`): PASS.
- HomeStates and ExperiencePage removals and moved tests and stories: PASS.
- Browse `.error .form { inline-size: auto }` from 768 px only: PASS.
- Rulings: content width from 768 px, full width below (`PageHeading.module.css:34-41, 46`): PASS. display-m title: PASS. Form-child extension: PASS. Padding ruling: PASS.
- Other PageHeading callers unchanged (ops unlock form does not match `:only-child`): PASS.
- OUT OF SCOPE untouched: PASS.
