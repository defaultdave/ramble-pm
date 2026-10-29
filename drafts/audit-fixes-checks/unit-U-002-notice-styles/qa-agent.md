PASS

## qa-agent: U-002 "Notice styles" (head 3a4c0f3)

**Runtime limits.** This sandbox refused what a browser check needs, so I saw no live runtime result of my own:
- `next dev` and `storybook dev` failed with `listen EPERM` (local port binding is off).
- Headless Chromium cannot start: `bootstrap_check_in ... MachPortRendezvousServer: Permission denied`, so a file:// load of a static Storybook build was not possible either (the build itself succeeded; the stories `pages-notices--*` are present).
- Nothing was left running (no server ever started, no PIDs to kill). The scratch worktree is removed when I finish.
- Consequently I did NOT capture 320 px shots, a RoutePlaceholder page shot, a focused-control shot, or the global-error 390 light/dark shots. No new files were added to the evidence folder. Sandbox setting that would allow ports: `sandbox.network.allowLocalBinding: true`; Chromium needs the sandbox lifted.

What follows is a static reading plus what I did run (vitest on the two notice test files in the scratch worktree: 2 files, 9 tests, all pass) and a look at the builder's PNGs.

### Blocking
None.

### Non-blocking
- Gutter, static reading: `PageHeading.module.css` `.page` uses `padding: var(--space-8) var(--space-6)` (32 px top and bottom, 24 px sides), `margin-inline: auto`, `max-inline-size: var(--size-content-max)` (1200 px), `box-sizing: border-box`. No fixed widths, so no sideways scroll is expected at 320 px; the builder's 390 shots show the 24 px side gutter (error-390-dark-after.png). Not verified at 320 in a browser.
- 44 px targets, static reading: `Button.module.css` `.button` sets `min-height: var(--size-touch-target)` (44 px) and `min-width` 44 px; both the home ButtonLink and the retry Button use it. Not measured in a browser. On phone widths the rule `.page > a, .page > button { align-self: stretch }` makes the action full width; from 768 px it is `flex-start` (builder shot notfound-1280-light-after.png shows a content-width button).
- Keyboard focus: no `:focus-visible` rule exists for `Button` or `ButtonLink` (only GuestShell, SiteMenu and Footer define the token ring `--color-focus-ring`), and the Button CSS does not remove the outline, so the browser default ring should show. I could not confirm that visually. Suggest a tokenized focus ring for Button as an audit item.
- Alignment at 1280 (builder shot notfound-1280-light-after.png): the 404 heading and button start at x=64 px while the header logo and footer text start at x=40 px, because the 1200 px centered column plus the 24 px padding insets the page block 24 px more than the shell. Looks deliberate (page gutter token) but the owner may want it aligned; design call, not a defect against this unit.
- Retry handler: `tests/error-boundaries.test.tsx` and `Notices.test.tsx` pass (retry called once; the group boundaries and GlobalError pass their `retry` prop to ErrorNotice). I did not click it in a browser.

### Unconfirmed
- global-error page 390 light and dark: not rendered. Static reading: `src/app/global-error.tsx` now imports `@/styles/base.css` and `@/styles/tokens.css`, so the PageHeading module's tokens resolve and the secondary retry button gets its border color there. Needs a real render to confirm; `global-error-390-light-after.png` and `-dark-after.png` are NOT provided.
- global-error props: it takes a `retry` prop like every group error.tsx; whether Next 16.4 supplies a prop with that name to a global error boundary was not checked here (existing convention in the repo, outside this diff).
- RoutePlaceholder: renders through PageHeading (for example `src/app/(guest)/contact/page.tsx`, `/contact`), so it picks up the same gutter; not seen in a browser.
- Dark mode: tokens switch through `prefers-color-scheme`; the builder's dark PNGs at 390 look correct (light text on dark background, bordered Try again button).

### Evidence
Builder files I relied on, all in /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-002-notice-styles/:
- error-390-dark-after.png: error notice at 390 dark, 24 px gutter, bordered secondary retry button, readable text.
- notfound-1280-light-after.png: 404 at 1280 light inside the guest shell, heading, copy and primary home button, content-width button.
- The other 14 builder PNGs (error and notfound, 390 and 1280, light and dark, before and after) were not individually reviewed beyond these two.
My own files: none (sandbox refused browser and ports, see above).

QA_VERDICT=PASS (static reading only; no live browser checks possible; see Runtime limits)
