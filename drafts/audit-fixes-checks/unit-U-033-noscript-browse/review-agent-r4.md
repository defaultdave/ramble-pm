PASS

## review-agent: U-033 "Browse shows its results and filters with scripting off" (head 88916da, round 4; round 2 passed at 4b3a6d1)

Delta read: `git diff 2df27a8 88916da`, 6 files: `LandingRoute.tsx` (marker wrapper in both branches of `LandingResults`), `LandingRoute.test.tsx` (one `it.each`), `e2e/landing.spec.ts` (one JS-off test), `BrowseContent.tsx` (drops `styles.streamed`, keeps `id` and the marker), `browse/page.module.css` (removes `.streamed`), `src/styles/base.css` (the marker rule, global). I ran everything in scratch worktrees of 88916da and 2df27a8 (both removed), production builds on ports 3731 and 3732 (not 3100) over a freshly migrated and seeded local database (14 experiences, 14 page copies, own database, dropped), and a placeholder-database build on 3733 for the error states. Servers started from fresh processes; every server, the shim, the worktrees and the database are stopped and removed. Nothing was changed in any checkout, pushed, posted or committed.

### Blocking
None.

### Judgment on the three asks

1. JS on, browse and landing render as before: yes.
   - Seeded database, Chromium with JS on, 4 pages (`/new-york/browse`, `?guests=3`, `/things-to-do/cooking`, `/neighborhoods/williamsburg`) at 320, 390, 768 and 1280 wide, 88916da against 2df27a8: 16 pairs. The bounding box of every element in `body` is identical in all 16 once zero-size `display: contents` boxes are set aside (class names differ only because `.streamed` is gone). Full-page screenshots at 390 and 1280 (8 pairs) are byte-identical.
   - Browse: the wrapper computes `display: contents` before and after, and the element count is unchanged. Landing: one extra element, the new wrapper, computed `display: contents`, box 0 by 0 by 0, so `LandingPage`'s flex column still lays out `BrowseResults` as its direct item. The one rule that changed scope (`.streamed` to `[data-reveal-without-script]`) has the same specificity (0,1,0) and no other rule targets the element.
   - Only browse and the two landing results carry the marker (`git grep` on the head), so making the rule global changes nothing else.

2. JS off, results sit in the page column and nothing is blank: yes.
   - Browse at 390, 768 and 1280, and `?guests=3`: marker box, y positions, page height and card counts are identical to 2df27a8 (for example 390 wide: marker `0,274,390,4955.2` both sides). The results grid starts at the same x as the `h1` and has its width: 24 and 342 at 390, 24 and 720 at 768, 40 and 1200 at 1280. Footer sits below the results, no sideways overflow at any of the 4 widths, the skeleton computes `display: none`.
   - Landing (category and neighborhood), same widths: before this head the page ended at the body copy and the footer, with the results hidden in the unmoved streaming `div` (screenshot `off-390-_new_york_things_to_do_cooking-before.png`). After it, "3 experiences" and the cards show between the copy and the footer, grid at the `h1`'s x and width (24/272 at 320, 24/342 at 390, 24/720 at 768, 40/1200 at 1280), no overflow, skeleton hidden, nothing blank. Screenshots `off-1280-_new_york_neighborhoods_williamsburg-after.png`, `off-390-_new_york_things_to_do_cooking-after.png`, `off-1280-_new_york_browse-after.png`.
   - Error states, JS off, 390 wide, placeholder database: browse shows "We couldn't load experiences" at x 24, width 342, marker `block`, skeleton `none`, no overflow. Landing shows its heading and "We couldn't load this page" at x 24, width 342, no overflow (this is the page-level `PageError`, which is what the new e2e test asserts).
   - Known first-load cut (PF-7 DECISIONS entry) and landing body copy above the results: not counted. Every load I measured showed all results (10 on browse, 2 and 3 on landing), so I did not hit the cut.

3. The new tests catch the marker leaving either branch: yes.
   - Unmutated: `_landing` and `browse` unit and component files, 28 of 28 pass.
   - Mutation, marker wrapper removed from the read branch: 1 fails, "marks the read branch ...". Removed from the failed branch: 1 fails, "marks the failed branch ...". Attribute renamed on the read branch: 1 fails, the same row. In each case the other row stays green, so the table pins each wrapper on its own and its assertion that the heading or alert is inside the marked element means an empty wrapper does not pass.
   - Browse tests still catch either wrapper going (each of the two attributes renamed in turn: 1 fails, 10 pass, the matching branch's row).
   - eslint on the changed folders and spec, `tsc --noEmit` and prettier on the changed files: clean.

### Do the earlier verdicts carry to 88916da
- Spec-compliance (d9376c1): carries. The delta adds no filter, route or state; the landing marker serves the same PF-7 aim (results shown with scripting off) on pages that only exist here because of the U-035 merge.
- Architecture-audit (d9376c1): carries; it does not need another pass. The landing change is a presentational wrapper in the page module and a CSS move, with no read, no B2 decision, no new export and no layer crossing. B16: the new rule holds no literal, it reuses `--size-content-max`, `--size-gutter`, `--space-12`, and moved unchanged from `page.module.css` to the global stylesheet the existing `scripting: none` block already lives in. B17: the rule is now defined once, where before it could only have been copied into the landing module. If architecture wants one line on "a global attribute selector in `base.css` used by two page modules", that is the only thing it could add.
- QA-agent-r2 (4b3a6d1): carries for browse. Browse JS on is unchanged (pixel-identical above) and JS-off browse geometry is identical to the prior head, so r2's matrix, chain, empty, error and skip-link results still describe it. It does not cover the landing pages, which did not exist on the branch then. The measurements above are the landing evidence; if the PM wants a QA-owned line for landing, it is a short rerun of those two pages JS off at 390 and 1280, not a full round.
- Review-agent r2 non-blocking items (extra noscript gap, composes by relative path, duplicated `.skip` in `CheckoutFrame`, hidden-field loop and chip duplication, `order: 1` scope) are untouched by this delta and carry as written.

### Non-blocking
- `e2e/landing.spec.ts:45`: the new JS-off test runs against the e2e placeholder database, where the entry read fails, so it asserts the page-level `PageError`, not `LandingResults`. It is a fair test of its own behaviour and the heading stays visible, but the landing marker has unit coverage only (the table above), and the CSS rule is covered end to end only through the browse JS-off e2e. Acceptable at this size; a seeded JS-off landing check is the cheapest way to close it if the project ever gets one.
- The string `data-reveal-without-script` is a bare attribute in 4 JSX sites and the CSS. Two files in two page modules is below the point where a shared component pays for itself; revisit if a third page streams results.
- Landing page layout JS off: the body copy comes before the results (ruled, not a finding). With the results now outside `main`, in the DOM order a screen reader meets the footer first on landing too; browse has "Skip to results" for this and landing has no equivalent. Same architecture limit as browse round 1, not opened here.

### Unconfirmed
- A real browser with JS off on the landing `LandingResults` failed branch (entry read succeeds, results read fails): not run, there is no way to split the two reads on one database. The unit row covers its wrapper.
- First load of a large landing category with JS off (the 3200 byte Flight cut): the seed's landing pages have 2 and 3 results, so the cut is not exercised. It falls under the ruled limit.
- Playwright's own runner (`e2e/landing.spec.ts`, `e2e/browse.spec.ts`) could not launch Chromium in this sandbox without `--single-process`, which the runner cannot use across tests, so I ran equivalent scripts with the same JS-off and error-state assertions instead of the spec files. Firefox and Safari with scripting off: not run.

### Evidence (scratch, not copied into the PM repo)
In `/private/tmp/claude-501/-Users-davidfleming-Workspace/8228229e-3a7e-458e-807d-7396f921bc0b/scratchpad/r4/shots/`:
- `off-390-_new_york_things_to_do_cooking-before.png` and `-after.png`: landing, JS off, 390 wide, results absent then shown.
- `off-1280-_new_york_neighborhoods_williamsburg-after.png`: landing, JS off, 1280 wide, results in the column above the footer.
- `off-1280-_new_york_browse-after.png`: browse, JS off, 1280 wide.
- `on-*-before.png` and `on-*-after.png`: JS on, byte-identical pairs.
- `err-_new_york_things_to_do_cooking.png`, `err-_new_york_browse.png`: error states, JS off, 390 wide.
- `probe.json` in the parent folder: per-element boxes for all 64 runs.
