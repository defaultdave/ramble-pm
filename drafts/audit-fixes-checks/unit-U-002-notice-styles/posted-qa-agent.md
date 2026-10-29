Posted on head 3a4c0f3 (round 2 at 5aa3be8 with main merged; the PM reran every gate on the merge commit, including 187 Storybook tests). Round 2 added a PageHeading test and the token imports in global-error.tsx; spec re-check PASS.

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

---

a11y-audit (round 1, b2fd1d4), carried in this summary because a11y is not a separate required check:

PASS

## a11y-audit: U-002 "notice styles" (head b2fd1d4)

Scope: NotFoundNotice.tsx, ErrorNotice.tsx, PageHeading.tsx and PageHeading.module.css, with Button/ButtonLink (Button.module.css) as rendered inside them. Contrast computed from the palette values in src/styles/tokens.css (light is the default, dark under prefers-color-scheme: dark). Canvas light #fbf6ee, canvas dark #18130f.

### Blocking
None.

### Non-blocking
- `src/app/global-error.tsx:1-13` (static reading, not rendered): global-error replaces the root layout and imports neither `base.css` nor `tokens.css`; only the route-group layouts import them. On that page every `var(--color-*)`, `var(--space-*)` and `var(--size-*)` in PageHeading and Button is undefined. The secondary "Try again" button's `border: 1px solid var(--color-border-strong)` becomes invalid, so the border drops out and the button renders as borderless text (main's plain `<button>` had a UA border). Text contrast is still fine (inherited black on the white default page). Fix: import `@/styles/base.css` and `@/styles/tokens.css` in global-error.tsx, or give the border a literal fallback (`var(--color-border-strong, #8a7b6e)`). Audit item: the global-error page does not load design tokens (existing on main for the other tokens; this diff makes it visible on the button).
- Forced colors (Button.module.css has no forced-colors rule): the primary button has `border: 0`, so in Windows high contrast it loses its edge (ButtonFace on the page, no border). Its label still identifies it, so this is advisory. The focus ring is a `box-shadow`, which forced colors drops; the focus indicator then depends on `outline: 2px solid transparent`, which forced colors usually paints in CanvasText, but this was not rendered. Same primitive as other pages, so not introduced by this diff.
- Error state announcement: ErrorNotice has no role and no live region, same as main (`origin/main` ErrorNotice.tsx is identical apart from the button). WCAG 4.1.3 is not triggered by a full error page whose heading is the page content, so this is not a regression and not blocking. Advisory only.
- Reflow at 320 CSS px (1.4.10): not rendered. Static reading passes: `.page` has 24px inline padding (272px content width at 320), no fixed widths, the lone action stretches to the content width on phones, and the label wraps. No horizontal-scroll source found. Evidence covers 390 and 1280 only.
- Focus evidence: no before/after captures show a focused control. The focus style is `:focus-visible` with a 2px canvas gap and a 4px sky ring (light sky-700, dark sky-300), not captured.

### Unconfirmed
- Forced-colors rendering of both buttons (see Non-blocking). Needs a forced-colors capture before the boundary can be called fine or lost.
- Global-error rendering with tokens missing (see Non-blocking). Static reading only.
- 320 px reflow. Static reading only.

### Checks passed (static, from token values)
Light: heading ink-850 on canvas 15.95:1; body ink-600 on canvas 7.24:1; primary white on tomato-600 5.69:1 (hover white on tomato-700 6.92:1); secondary text ink-850 on white surface 17.16:1; secondary border ink-500 against canvas 3.80:1 (1.4.11 pass, 3:1 needed); primary control bg tomato-600 against canvas 5.29:1; focus ring sky-700 against canvas 5.92:1.
Dark: heading ink-50 on canvas 17.14:1; body ink-300 on canvas 9.69:1; primary ink-850 on tomato-500 7.43:1 (hover 8.44:1, pressed 9.75:1); secondary text ink-50 on surface ink-800 15.62:1; secondary border ink-400 against canvas 5.59:1; primary control bg tomato-500 against canvas 7.99:1; focus ring sky-300 against canvas 9.15:1.
Target size (2.5.8): `.button` sets min-height and min-width to `--size-touch-target` (44px). Pass.
Focus not obscured (2.4.11): no sticky or fixed header in GuestShell or Header CSS. Pass.
Focus visible (2.4.7): `.button:focus-visible` gives a visible ring on both variants. Pass by static reading.
Heading (1.3.1 / 2.4.6): one h1 per notice (PageHeading), first heading on the page, no skipped level. Pass.
Home link (2.4.4 / 4.1.2): ButtonLink renders a real `<a href="/">` with the label as its name. Pass.
Retry (4.1.2): `<Button type="button">` with label "Try again". Pass.

**Evidence**
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-002-notice-styles/notfound-390-light-after.png`: 404 at 390 light, primary "Go to the Ramble home page" button full-width, dark text on light canvas, no overflow.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-002-notice-styles/error-390-dark-after.png`: error at 390 dark, secondary "Try again" with a visible border on the dark surface, heading and body legible.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-002-notice-styles/notfound-1280-dark-before.png`: main before the change, the home link is underlined browser blue on the dark canvas (the BE-13 defect).
