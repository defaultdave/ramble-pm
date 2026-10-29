PASS

## review-agent: U-030 "one PageError for the home and experience error states, and one retry width" (head 2ded8f7)

### Blocking
None.

### Non-blocking
- `src/components/PageError/PageError.module.css:34-35`: `padding-block: var(--space-16)` from 768 px. The home error already had it (HomeStates `.page`); the experience error had `--space-8` at every width, so its block padding grows from 32 px to 64 px at 768 px and up. Beyond the brief's listed rulings but consistent with the H-31 pattern it names and with one PageError; list it in the PR body and evidence. (PM ruling: accepted.)
- `src/components/ExperiencePage/ExperiencePage.stories.tsx:9`: the meta comment's first line still ends in a comma now that its second line is gone. (PM: logged as H-98.)

### Checks
- Copy word for word at both call sites (h1, alert title, alert body, "Try again").
- Retry forms: home `retryHref="/"`, experience `experiencePath(address)`; tests assert action, method and `type=submit` for both.
- Nothing imports the deleted components or CSS (src, tests, e2e, docs, .storybook).
- Removed tests and stories are covered in PageError's files (copy, heading, form, button under the alert, the `retryKeepsItsBorder` play function; Home and Experience stories at Mobile and Desktop).
- `.retry` rules removed from `HomeStates.module.css` are unused elsewhere; `.title` kept and used.
- Browse `.error .form { inline-size: auto }` sits in the 768 px query, outranks `.form { inline-size: 15rem }`, and affects only the error retry; phones unchanged; `BrowseResults.tsx` untouched.
- Content width from 768 px (`align-self: flex-start`, no `flex: 1`, no cap) and `display-m` title match the rulings.
- Duplication: none. Scope: 18 files, all in the manifest.
- `vitest run` on PageError, HomeStates, ExperiencePage: 23 passed.

### Unconfirmed
- Browser rendering, storybook:test, e2e and the full gates were not run here.
