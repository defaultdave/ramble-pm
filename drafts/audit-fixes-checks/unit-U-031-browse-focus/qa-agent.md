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
