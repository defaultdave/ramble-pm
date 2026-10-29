FAIL

## spec-compliance: U-030 "one PageError for the home and experience error states, and one retry width" (head 2ded8f7)

### Blocking
- `src/components/PageError/PageError.module.css:31-34`: `.page { padding-block: var(--space-16); }` from 768 px is not in the brief's rulings, which name one visible change (the home title). It reaches both callers: the experience error's block padding goes from 32 px to 64 px at 768 px and up. Fix: remove it, or get a PM ruling that names it. (PM note: the home error already had 64 px from 768 px via `HomeStates.module.css`; round 2 composes `PageHeading`, whose 32 px applies to both.)

### Non-blocking
- `PageError.stories.tsx:23-36` has two stories per caller's copy (Mobile, Desktop), matching the pattern it replaces and the evidence widths. (PM: that is the intended reading.)
- The browse error story is `BrowseResults` `ErrorWithRetry`, unchanged here.

### Unconfirmed
- Content width from 768 px read from CSS only; storybook and e2e not run.

### Per-criterion
- New files (component, CSS column, phone full width and content width from 768 px with no `flex: 1` or cap, tests, stories, index): PASS.
- Edited call sites (home `title="Ramble"`, `retryHref="/"`; experience `title="Experience"`, `experiencePath(address)`), index files, HomeStates `.retry` removal with `.title` kept, moved tests and stories, browse `.error .form { inline-size: auto }` only: PASS.
- Deleted `HomeError.tsx`, `ExperienceError.tsx`, `ExperienceError.module.css`, no references left: PASS.
- OUT OF SCOPE untouched (ErrorNotice, group `error.tsx`, brand h1, copy, `BrowseResults.tsx` markup, other states, `.claude/**`, `docs/plan/**`): PASS.
- PM rulings (content width, display-m, browse width only): PASS.
- Builder's extra block padding: not covered by the brief: FAIL (Blocking).
