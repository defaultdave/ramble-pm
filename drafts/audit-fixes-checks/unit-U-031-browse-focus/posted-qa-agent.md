Posted on head 823bbac (round 5: rounds 2 to 5 plus main merged; the PM reran every gate there: 3726 unit, 195 storybook incl. the focus story, 161 e2e, build, gitleaks). This verdict was given on round 1 at 222c8f2 (static; no browser in the sandbox). Its module-flag note led to round 2.

PASS

## qa-agent: U-031 "Browse focus and announcements" (head 222c8f2)

Static walk-through only. Nothing was run in a browser: no listener answered on localhost:5432, so there was no seeded database to browse against, and the sandbox does not allow a dev server or Chromium. No before or after PNGs were captured. The PM's e2e (160, title specs only) and storybook (183) runs are the only executed evidence, and neither exercises focus on a live page.

### Blocking
None found by reading the code.

### Scenario trace
- Date pick (keyboard): the server action redirects, `filters.date` changes, and the `WhenDetails` effect closes the `<details>` and focuses the `<summary>`. The component stays mounted because the old `key` is gone. Its effect runs before `ResultsHeading`'s (FilterBar renders first), so `activeElement` is the chip and the heading does not take focus. Focus ends on the chip. Announced: the live region text changes once.
- Clear date (the link inside the calendar): the date changes, so the same path runs. Focus ends on the chip, which is where the removed link's user was working.
- Empty state, "See Mon, Nov 9" link: the link leaves the DOM, `activeElement` is body, `ResultsHeading` runs `focus()` on the new h2 (covered by the unit test "moves focus to the new heading..."). The date also changed, so the `WhenDetails` effect fires first and puts focus on the chip. Focus therefore ends on the chip, not the h2. The h2 fallback only applies when the date chip is absent. This is consistent with the stated intent but is not what the brief's "results h2 takes focus" says. Confirm in a browser which one is wanted.
- Filter chip change: chips are links that persist, so focus stays. The heading effect only moves focus if body has it.
- First load and skeleton swap: module flag `arrived` is false, so there is no focus steal. The Suspense has no key, so a soft navigation does not bring the skeleton back.
- Back button: the date changes through history, so `WhenDetails` closes the calendar and focuses the chip. This is a focus move on popstate. It is harmless but unrequested.
- Page title: `browseTitle` is covered by lib tests and two e2e specs, which the PM ran.

### Non-blocking
- src/components/BrowseResults/ResultsHeading.tsx (module-level `arrived`): it is never reset, so a client-side revisit of browse (detail page then back, or any Link away and back) mounts a heading with `arrived` true. If body holds focus at that point, the h2 takes focus and scrolls itself into view, over Next's own focus and scroll restoration. I could not run it, so this is unconfirmed. The unit test only covers the first paint after `vi.resetModules()`. Fix idea: track arrival per mounted browse page (a ref in a parent client component) instead of per module.
- Double announcement: when the h2 takes focus after the next-day link, a screen reader reads the focused heading and the `role="status"` paragraph with the same text. Short of a screen reader run I cannot say how loud this is. Consider making the live region the only announcer, or skipping the h2 focus when the live region announces.
- `ResultsHeading` effect depends on `[children]`. If the text is unchanged after a control vanishes (for example Clear all filters when the count stays the same), focus falls to body. This is rare.
- The live region sits in `BrowseContent`, so it unmounts when the page goes to the error state, and a recovered page inserts it already filled. Many screen readers do not announce a region inserted with its text.
- Browse-focus scenarios only have jsdom unit tests. There is no Playwright spec for "pick a day, focus is on the chip" because the e2e server has no database.

### Unconfirmed
- Everything above that depends on real browser focus, Next's route-change focus handling, and screen reader output.

### Evidence
None captured by this check. No files in /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-031-browse-focus/.

Read for the trace (worktree /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a83f2500f119f8ebc):
- src/components/FilterBar/WhenDetails.tsx: date change closes the disclosure and focuses the chip.
- src/components/BrowseResults/ResultsHeading.tsx: the focus-lost fallback and the module flag.
- src/components/BrowseResults/BrowseResults.tsx: where the heading is used for each state.
- src/app/(guest)/new-york/browse/BrowseContent.tsx and page.tsx: the live region, the Suspense without a key, and the title.
- src/lib/browse.ts: `browseHeading` and `browseTitle`.
- src/server/actions/browse.ts: the redirect that carries the date pick.
- src/components/BrowseResults/BrowseResults.test.tsx, src/components/FilterBar/FilterBar.test.tsx, BrowseContent.test.tsx, e2e/browse.spec.ts: test names and coverage.

QA_VERDICT=PASS

---

a11y-audit (round 1, carried here):

PASS

## a11y-audit: U-031 "browse focus and live region (BE-14)" (head 222c8f2)

### Blocking
- None.

### Non-blocking
- `src/components/BrowseResults/ResultsHeading.tsx:5-17`: the "never on first paint" guard is module state (`let arrived`), so it stays true for the rest of the browser session after the first browse render. Client navigation into browse from another page then moves focus to the results heading when the results arrive, if focus is on body. The unit test passes only because `vi.resetModules()` runs before each test. Dev mode is also affected: React StrictMode runs mount effects twice, so the second run sees `arrived === true` and focus lands on the heading on first paint in `next dev` (not yet run; confirm in dev). Fix: drop the module flag and move the focus only when the heading text actually changed from the last rendered text (a ref holding the previous text, compared in the effect). Mount and the StrictMode re-run then both see no change.
- Route announcer and live region both speak on a filter change. Next 16.4.2 `node_modules/next/dist/client/components/app-router-announcer.js` renders the announcer with `role="alert"` and `aria-live="assertive"` and speaks `document.title` when it differs from the previous title. The title now changes with every filter, so each change speaks the title assertively, then the polite count. This is not a 4.1.3 failure (the count still announces), but it is double speech and the assertive alert can cut off the polite text. Owner decision: keep the title (the e2e spec asks for it) and accept the double speech, or change it. Confirm once with a screen reader.
- Empty-day next-day link: the status says "Nothing on Sat, Nov 7" (polite) and focus lands on the h2 with the same words, so the same phrase is read twice. Advisory.
- `src/components/FilterBar/WhenDetails.tsx:25-31`: focus returns to the date chip and the calendar closes on any change of the chosen day, including browser Back or Forward. A user who did not pick a day gets a focus jump and a closed calendar. Limit the move to picks and Clear date if this matters to you; otherwise leave it.

### Unconfirmed
- Live region node persistence across filter changes: the `<p role="status">` in `BrowseContent.tsx:66` should stay mounted through a filter change (no `loading.tsx` under browse, and React keeps existing content under a transition), so the count is announced as a change, not as an insertion. Not run. Confirm in a browser by marking the node and checking it is still connected after a filter change.
- Skeleton-to-results swap on first load: screen readers may or may not speak an inserted `role="status"` that carries "Showing N experiences". Per spec, initial content should not be announced. Cannot verify statically.

### Checked, no finding
- Live region in the DOM before its text changes: yes, always rendered at the top of `BrowseContent` (polite, atomic, visually hidden with clip-path and 1px size, no layout effect). The error path returns `BrowseResults` without it, and its `Alert` is `role="alert"`. 4.1.3 pass.
- Double announcement with the skeleton: `BrowseSkeleton.tsx:7` is the Suspense fallback and the new status is inside the same boundary's content, so the two are never mounted together. Pass.
- Heading focus (`ResultsHeading`): `tabIndex={-1}`, not a trap, no `outline: none` on it, and base styles set no focus rule, so the user-agent focus ring shows on keyboard focus. 2.4.3 and 2.4.7 pass.
- Date picker (non-modal `details`): after a pick or Clear date, the calendar closes and focus returns to the summary chip that opened it. Right control, no trap. 2.4.3 pass.
- Heading order: page `h1` (`page.tsx:30`) is outside the Suspense boundary; results and notice headings are `h2` under it; the error state has no heading (Alert). No skipped level. 1.3.1 pass.
- First load: the announcer ignores the first title (`previousTitle` starts undefined); `ResultsHeading` does not move focus on the first render (aside from the StrictMode and module-flag issue above). Pass with the caveat.
- H-82: `BrowseSkeleton`'s `role="status"` contains only a visually hidden "Loading experiences" span and the Skeleton cells. Neither the skeleton nor `Skeleton` renders any heading. The page `h1` sits in `page.tsx` outside the Suspense boundary, so the skeleton does not contain it. Pass.
- Title wording (`browseTitle`): the default matches the h1 ("Browse experiences"); filtered titles such as "Browse Cooking experiences in DUMBO on Sat, Nov 7" describe the page. No 2.4.2, 2.4.6, or 1.3.1 issue. Names come from the filter option lists, not raw slugs.

Scope: read-only static audit of the diff against `origin/main` and the surrounding code. Tests were not run.
