FAIL

## qa-agent: U-002 "Style the shared 404 and error notices" (head b2fd1d4)

The sandbox refused every way of rendering the page, so this check could not do the browser run it was asked for. The verdict is FAIL on that ground alone: no defect was found, but the required checks were not made. Re-run in an environment that allows a local port and Chromium.

### Blocking
- Cannot test: browser verification not performed. Next dev server: `listen EPERM 0.0.0.0` (local port binding is off). `pnpm storybook:test`: `listen EPERM ::1`. Chromium launched against the built Storybook over file://: `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)`, so the browser cannot start at all. Not verified in a browser: the 404 at /does-not-exist, the Pages/Notices stories at 320, 768 and 1280, the RoutePlaceholder page, sideways scroll at 320, rendered 44 px control height, visible focus ring, and the retry click. The fix for the owner is `sandbox.network.allowLocalBinding: true` (via /sandbox) plus a sandbox that lets Chromium start, or run the 320 and 768 shots by hand.

### Non-blocking
- Static findings, no defect:
  - Contrast computed from tokens.css (WCAG ratios). Light: heading 15.95, secondary text 7.24, primary button text on tomato-600 5.69, secondary button text 17.16, secondary border on surface 4.09 (needs 3), focus ring 5.92. Dark: heading 17.14, secondary text 9.69, primary button text 7.43, secondary button text 15.62, border 5.09, focus ring 9.15. All pass.
  - Button and ButtonLink set min-height `--size-touch-target` (44px) and a `:focus-visible` box-shadow ring, so both controls reach 44 px and show a ring. The stylesheet does not shrink them. Not seen rendered.
  - PageHeading.module.css has padding-inline 24px and no fixed width, so no sideways scroll is expected at 320; not measured.
  - `pnpm exec vitest run src/components/Notices.test.tsx tests/error-boundaries.test.tsx`: 2 files, 8 tests pass, including that Try again calls the retry handler (finds the `Button` and calls its onClick).
  - `pnpm storybook:build` succeeds with the new Pages/Notices stories.
- Gutter does not line up with the site chrome. In the builder's screenshots the header and footer content sits at 16 px (390) and 40 px (1280); the notice heading sits at 24 px (390) and 64 px (1280), because it is 24 px inside a 1200 px centred column. The header and footer are not the same width as the page body here, so the heading looks indented relative to them. Worth a design look; not a stated requirement.
- global-error.tsx renders ErrorNotice inside a bare html/body; whether tokens.css and base.css load there (so the new CSS module variables resolve) could not be checked without a browser. Worth confirming in the re-run: `/` with a forced root error, or the dev overlay.
- The git worktree `$TMPDIR/qa-notices` directory is deleted, but `git worktree prune` was refused (`.git/worktrees/qa-notices`: Operation not permitted), so a stale "prunable" entry remains in the ramble repo. Run `git worktree prune` there.

### Unconfirmed
- Everything under the browser list above.

**Evidence**
The builder's files in /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-002-notice-styles/, looked at but not added to; none of 320, 768 or RoutePlaceholder were captured, because no browser could start.
- error-390-dark-after.png: error notice at 390, dark; heading and full-width secondary button inside the 24 px gutter, readable.
- notfound-390-light-after.png: 404 at 390, light; heading, text and full-width primary button inside the gutter, header and footer chrome around it.
- notfound-1280-light-after.png: 404 at 1280, light; heading and primary button left-aligned at 64 px, 24 px further in than the header and footer content at 40 px.
- The other 13 files (error and notfound at 390 and 1280, light and dark, before and after) were not opened.
Missing: all 320 and 768 shots, the focus ring, and the RoutePlaceholder page.
