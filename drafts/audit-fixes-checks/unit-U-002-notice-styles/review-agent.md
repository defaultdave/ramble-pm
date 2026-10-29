PASS

## review-agent: U-002 "Notice styles (BE-13)" (head b2fd1d4)

Ran in the builder worktree: `pnpm test` 162 files, 3608 tests passed; `pnpm typecheck` clean.

### Blocking
None.

### Non-blocking
- src/components/PageHeading.module.css:1-24 (audit item): `.page` and `.title` repeat `ExperienceError.module.css` `.page` and `.title` rule for rule (same flex column, `--size-content-max`, `--space-4` gap, `--space-8 --space-6` padding, display font, `--font-size-display-m`, semibold). Only `font-size` and `line-height` on `.page`, the `> p` rule, and the action rules are new. Accepted for now per PM ruling; H-61 should fold both into one shared page-shell module.
- Scope: every file is inside IN SCOPE (PageHeading.tsx, NotFoundNotice.tsx, ErrorNotice.tsx, PageHeading.module.css, Notices.stories.tsx, Notices.test.tsx, tests/error-boundaries.test.tsx). No src/app, --gutter, src/lib, or docs/plan changes. ExperienceError and HomeError are untouched.
- Tokens: all 13 `var(--...)` names exist in src/styles/tokens.css; no raw colors or lengths. The one literal is the 768px media query, the same breakpoint ExperienceError uses. Mobile first (base is stacked and stretched, `min-width: 768px` narrows it).
- 320 px: `box-sizing: border-box`, 24px side padding, flex column, no fixed widths; the heading and text wrap and the stretched action fits. No sideways scroll found by reading. Not run in a browser.
- Other PageHeading callers (grep: RoutePlaceholder, `/ops/mailbox`, `/ops/mailbox/[id]`; tests/lint-boundaries.test.ts only uses the import string):
  - RoutePlaceholder: heading plus `<p>` lines; now gets gutter, display heading, secondary text. Looks right.
  - `/ops/mailbox`: children are a `<p>`, MailboxUnlockForm, or MailboxList, now gap-spaced inside the gutter. The `> a` / `> button` rule only hits direct children; none of these render a bare direct a or button as far as read. Dev-only page; I did not render it.
  - `/ops/mailbox/[id]`: the "Back to the mailbox" link sits in a `<p>`, so it is not stretched and keeps the browser-blue default (same low contrast as BE-13 on dark). Pre-existing, out of scope; audit item for the mailbox pages. A long unbroken message body in MailboxMessageView could still overflow at 320 px (flex child with no `min-inline-size: 0`); dev-only, audit item.
- Duplication sweep: no new helper, hook, constant, or schema. Reuses Button, ButtonLink, and the existing tokens. `Alert` exists (used by ExperienceError) and could carry the notice text, but the Figma S3 notice copy is a plain paragraph; not blocking.
- Tests: Notices.test.tsx asserts heading, link href, retry click, and the primary/secondary variant classes. `/primary/` matching a CSS-module class works under vitest. The error-boundaries selector change is the one the PM allowed. The CSS itself (gutter, contrast) has no unit test; that is a visual check for qa-agent.
- Comments: the two in the CSS and stories explain a non-obvious why; no ticket numbers. Reuse section of the builder was not in the brief; nothing contradicts it.

### Unconfirmed
- Rendered contrast of the primary ButtonLink on the dark canvas and the Figma S3 53:249 match: not checked here (needs the Storybook render; qa-agent).
