PASS

## review-agent: U-033 "Browse shows its results and filters with scripting off" (head 4b3a6d1, round 2; round 1 at d9376c1)

Delta read: `git diff d9376c1 4b3a6d1`, 7 files, all serving the round 1 blocking item and the mitigation round 1 suggested. Run in a scratch worktree (removed): the browse unit files, three mutations, eslint and tsc on the changed paths (both clean), `e2e/browse.spec.ts` against a production build on its own port (21 of 21 pass, including the new JS-off test), and a Chromium script with JavaScript off at 390 and 1280 wide and on at 390.

### Blocking
None.

The round 1 blocking item is fixed. `BrowseContent.test.tsx` now has an `it.each` over the read branch and the failed branch. Each row asserts the container holds a `[data-reveal-without-script]` element with `id` equal to `browseResultsId` that contains the filters (read) or the alert (failed). Mutations, each run against `BrowseContent.test.tsx` and the `page.test.tsx` file beside it:
- Attribute deleted from the success wrapper (the round 1 mutation): 1 failed, 10 passed. The failing test is "marks the read branch ...".
- `id` deleted from the success wrapper: 1 failed, the same test.
- Attribute deleted from the failed wrapper: 1 failed, "marks the failed branch ...".

The row for the other branch stays green in each case, so the table catches each wrapper on its own. The unmutated run is 91 tests passing across the 5 browse and FilterBar files.

### Judgment on the added link
- Does it land on `#browse-results` with scripting off: yes. Real build, JS off, 390 and 1280 wide: Enter on the link gives `/new-york/browse#browse-results`. The target is the segment's first child, `display: block` (the base.css `scripting: none` rule applies to its parent), and it sits in the viewport above the footer (page y 274 against footer y 476 at 390 wide; 316 against 506 at 1280). The next Tab after the jump goes to "Try again", the first control inside the results, so the jump moves the keyboard start point and not only the scroll position. The e2e test pins the URL and the text inside `#browse-results`.
- Focus order: sensible, and better than round 1. Tab order with JS off is skip to main content, the header links, Skip to results, then the footer. Before this diff it was the footer's 11 links first. A user who skips never meets the footer on the way to the filters. The link is also off screen until focused, then shows at the top left with the same focus ring as the first skip link (it composes `.skip`; screenshot checked), and it is absent with JS on (0 matches, no hydration or console warnings beyond the fake Sentry DSN).
- What stays: a user who does not use the link still tabs through the footer before the results, and the results sit outside `main` (Next appends the streamed section at the end of `body`). Round 1 recorded both as the architecture's limit, not blocking, and the link is the mitigation round 1 named. Not re-opened.

### Spec and architecture: does the delta change the d9376c1 verdicts
No, both stand.
- Spec: the link is the `<noscript>` skip link round 1 proposed to cover the DOM-order gap under PF-7 (#487). It adds no filter, route, or state, and the scope of U-033 (filters on the browse page with scripting off) is unchanged.
- Architecture: `browseResultsId` is a string constant in `src/lib/pages/browse.ts`, the module `BrowseContent` already imports from, so `page.tsx` and `BrowseContent.tsx` both take it from the lib layer; no B2 decision, no new read, no data-layer or route-handler code. B16: the one new CSS rule holds no literal, it composes the existing `.skip`. B17: reuse, not duplication; the id is defined once and the test, the wrapper and the link all use it.

### Non-blocking
- Layout, JS off only: the `<noscript>` is `display: block` with height 0 and is a flex item of `.page`, so it adds one extra 24 px `gap` between the intro and the results (noscript at y 226, height 0, intro ends at 202). Visible in the JS-off screenshot as a larger space under the lede. Cosmetic. If wanted, `.skipToResults` could sit inside `.intro` (the link is absolutely positioned, so it needs no layout slot there).
- Coupling: `page.module.css` composes `.skip` from `../../../../components/GuestShell/GuestShell.module.css` by relative path, so the browse page's skip link follows any restyle of GuestShell's link. That is the intent (one look for both), and the build resolved it (the rendered class is `skipToResults skip`). Low risk; audit item if a shared skip-link module is ever made.
- Audit item, existing before this diff: `CheckoutFrame.module.css` repeats `.skip` and `.skip:focus-visible` from GuestShell line for line (`src/components/CheckoutPage/CheckoutFrame.module.css:2` and `:21`). A shared skip-link module would serve the three.
- `page.test.tsx` strips the `<noscript>` body with a greedy regex and sets `document.body.innerHTML`; it fails if the link leaves the `<noscript>` or loses its `href`, which is the behaviour it names. Fine at one test.
- Round 1 non-blocking items that this delta does not touch (duplication of the hidden-field loop and the chip groups, selected chips shown twice, `body > footer { order: 1 }` scope, the PM note on `prototype-feedback-2026-10-31.md:27`) carry over unchanged.

### Unconfirmed
- The success branch in a JS-off browser against a real database: still not run (placeholder database); the unit table covers its wrapper and the e2e covers the error branch.
- Safari and Firefox with scripting off: not run; Chromium only.
- A screen reader reading the jump: not run. The focus start point was checked through Tab behaviour only.

### Side effects to disclose
- One of my commands ran with the wrong working directory (a `cd` into the scratch folder failed because the sandbox and the unsandboxed shell use different temp paths) and `npx playwright test` ran once in `/Users/davidfleming/Workspace/ramble` itself. It tried a build there that stopped at "Failed to type check". That touched only git-ignored output: `.next/` (modified 20:06) and an empty `test-results/` (also 20:06). No tracked file, branch, or config changed; `git status` there is unchanged (HEAD 053bd1a, same entries as before). If anyone relies on that `.next/`, rebuild it.
- Earlier e2e attempts reused other people's servers on ports 3100 and 3177, so their results were discarded; the numbers above are from a server started from the scratch worktree on port 3291, which is stopped. The scratch worktree is removed; probe scripts and two screenshots remain in the session scratchpad only.
