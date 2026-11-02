PASS

Independent spec-compliance agent verdict, returned as text and transcribed by the PM. Head 35488dfb11abaf1dccfe272b944631335800aea1. All 8 changed files are under `src/components/BrowseResults/`, so nothing out of scope is touched.

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | JS off, first load shows every card the server sent | PASS on the code path; runtime from builder evidence only | `BrowseResultsList.tsx:29-39`, `BrowseResults.tsx:17-21` |
| 2 | JS off, Show more reaches the next page and the way back shows | PASS on the code path; runtime from builder evidence only | `BrowseResultsList.tsx:42-50`, `TargetButton.tsx:21-39` |
| 3 | The same on landing pages | PASS on the code path; runtime from builder evidence only | `LandingRoute.tsx:5`, `:59`, `:65` |
| 4 | JS-on layout unchanged, first card keeps image priority | PASS statically; layout equivalence from builder evidence only | `BrowseResultsList.tsx:36`, `BrowseResultsList.module.css:1-32`, `TargetButton.module.css:1-15` |
| 5 | One new island, plain data, no fetching, no state | PASS | `BrowseResultsList.tsx:1`, `:9-13`; no `useState`, `useEffect` or `fetch` in the folder |

Not re-run by this agent: the JS-off renders, the JS-on comparison, and the gzip deltas. QA reproduces those separately.

Observations, not failures:
- `BrowseResults.test.tsx` checks the plain-data handoff through a JSON round trip, a reasonable proxy but not a render test.
- `audits/prototype-feedback-2026-10-31.md` line 27 says the U-033 PF-7 fix restores the no-script filter layer. That was PR 680, not this diff.
- This agent did not check that `ExperienceCardItem` is client-safe; the architecture audit covers it.

Carried to head bc3f06b83f49a99dcfe5ecc8c7ea10897e36446c by the PM: that head is 35488df with origin/main merged in (Next 16.4.3 and the allowlist line). No file under src/ differs. QA reran on it.
