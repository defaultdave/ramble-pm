Posted on head 823bbac (round 5: rounds 2 to 5 plus main merged; the PM reran every gate there: 3726 unit, 195 storybook incl. the focus story, 161 e2e, build, gitleaks). This verdict was given on round 1 at 222c8f2; later rounds removed the results-heading component, moved the title lookup into src/lib and src/server, and adopted rethrowOrLog; review and architecture re-checked each round.

PASS

## spec-compliance: U-031 "browse keeps focus and announces results" (head 222c8f2)

### Blocking
- None.

### Non-blocking
- AC 9, evidence: none. The builder's sandbox refused ports, so no before-and-after files exist for this branch. Checked `ramble-pm/evidence/pr/` for u-031 and browse names: nothing. Focus behavior (AC 4) is confirmed by code reading and unit tests only; no e2e covers it, and e2e/browse.spec.ts:70-83 covers the title alone.
- AC 6, H-82: met as literally written, but the change is a no-op. `src/components/BrowseSkeleton/BrowseSkeleton.tsx:7-17` already has no h1 and the file is unchanged from main. No test asserts the absence (BrowseSkeleton.test.tsx has no heading check). The parenthetical "matches home's pattern" does not match the code: `src/components/HomeStates/HomeSkeleton.tsx:15` puts a hidden h1 outside its role=status region (line 16) on purpose, so the page keeps a heading while loading. Browse now has no heading while loading. PM to confirm which pattern was intended.
- `src/components/BrowseResults/ResultsHeading.tsx:7` and `:25-26`: the first-paint guard is a module-level `arrived` flag, so it lasts the module's lifetime, not the page's. A later client-side mount of the results with focus on body moves focus to the heading. The test "leaves focus alone on the first paint" passes only because `vi.resetModules()` runs in beforeEach (BrowseResults.test.tsx:302). Confirm this is wanted or scope the flag per mount.
- Bookkeeping: `ramble-pm/drafts/audit-fixes-checks/` already has `unit-U-031-open-days`. Two units are labelled U-031; the PM should disambiguate in the audit log.

### Unconfirmed
- None.

### Acceptance criteria (spec check detail)

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Date details not remounted; focus returns to the date chip after a pick | PASS | No key on the disclosure: `src/components/FilterBar/WhenDetails.tsx:37`. Close and focus on date change: `WhenDetails.tsx:29-35` (focus at :34). Test: `src/components/FilterBar/FilterBar.test.tsx` "closes the calendar and focuses the date chip when the chosen day changes". |
| 2 | Polite live region, `role="status"`, from first render, carries count or empty heading | PASS | `src/app/(guest)/new-york/browse/BrowseContent.tsx:66` (always rendered in the loaded branch, text from `browseHeading(view)`). The error branch (`BrowseContent.tsx:58`) has no heading by design (`browseHeading` returns null for error). |
| 3 | Count and empty wording from a tested src/lib function, existing helpers reused | PASS | `src/lib/browse.ts:274` `browseHeading`, `:300` `browseTitle`; reuses `resultsSummary` (`:264`, called at `:421`) and `dateChipLabel` (`:259`, used at `:318`). Tests: `src/lib/browse.test.ts:802` and `:851`. No wording left inline in the components beyond body text. |
| 4 | After "See <next day>", focus lands on the heading or the live region announces the new count | PASS (by code reading, not run) | Focus: the see-link unmounts, the new heading mounts, and `ResultsHeading.tsx:22-25` moves focus to it when activeElement is body or null. Announcement: the live region at `BrowseContent.tsx:66` updates its text to the new count. Both paths exist, so either satisfies the AC. Test: `BrowseResults.test.tsx` "moves focus to the new heading when the focused link went with the old results". |
| 5 | Page title reflects filters via a tested src/lib function, set only in generateMetadata | PASS | `src/app/(guest)/new-york/browse/page.tsx:36` (`title: browseTitle(...)` inside `generateMetadata`, lines 31-38). The title is set nowhere else in the diff. `browseTitle` at `src/lib/browse.ts:300`, tested at `src/lib/browse.test.ts:851`. The site template `%s | Ramble` is in `src/app/(guest)/layout.tsx:12`, matching the e2e expectation. |
| 6 | H-82: BrowseSkeleton live region holds no h1 | PASS (as written) | `src/components/BrowseSkeleton/BrowseSkeleton.tsx:7-17`: no h1. Unchanged in this diff. See Non-blocking for the parenthetical. |
| 7 | e2e covers at least the title; unit tests cover focus restore, heading focus rule, live region text, wording | PASS | e2e: `e2e/browse.spec.ts:70-83`. Focus restore: FilterBar.test.tsx (above). Heading focus rule: `BrowseResults.test.tsx:279` (`describe('BrowseResults focus')`). Live region text: `src/app/(guest)/new-york/browse/BrowseContent.test.tsx:142` and the day case after it. Wording: `browse.test.ts:802` and `:851`. Builder reports e2e 160 pass and storybook 183 pass; not re-run here. |
| 8 | Only manifest files change; out-of-scope items untouched | PASS | The 13 changed files are FilterBar (+WhenDetails.tsx), BrowseResults (+ResultsHeading.tsx), browse page files (BrowseContent.tsx, page.tsx, page.module.css), src/lib/browse.ts and test, e2e/browse.spec.ts. BrowseSkeleton and DatePicker are not touched. The new `getFilterOptions` import in page.tsx reads an existing server function; it is not a new file. |
| 9 | Evidence exists | NOT MET, logged | See Non-blocking. Recorded for the PM per the brief. |

Note on the verdict: AC 1 through 8 pass on the code as written. AC 9 is logged as Non-blocking. Verdict is PASS, since FAIL needs a blocking finding.
