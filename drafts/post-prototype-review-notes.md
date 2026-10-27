# Notes for the post-Prototype deep review (collected during wave 3)

- PM brief error: U-037's brief said there was no Figma frame for guide entries; the library has "03b Guide-only page" (46:897). The builder found it.
- PM spec briefs were inconsistent (U-012's allowed data-layer functions, U-010's did not), producing a scope FAIL and a ruling reversed within the hour.
- Severity drift in the haiku architecture auditor: U-018's next-version and supersede rules were non-blocking in round 1 and blocking in round 2, unchanged code.
- Builders cannot run `gitleaks git --log-opts` in their sandbox; each fell back to `detect` or `stdin`. The PM reran the range scan before every push.
- U-037 edited U-011's `catalog.ts` (added a bounded query, removed a TODO); unreviewed, parked.
- Round 2 instructions from the PM ("refuse with a typed result") led builders to put the refusal in the data layer, creating new B2 findings. Briefs should say where a new rule lives.
- Push-time gitleaks on `main` flags fixtures that PR-time scans passed (delta-log 2026-10-26).
- B2 findings surface one round at a time: U-012's version comparison and host-zone check existed from round 1, passed two audits, and only appeared when the PM asked round 3 for an exhaustive sweep. Ask for the exhaustive B2 list in round 1 from now on (review-rules change).
- Reviewer and QA ran mutation tests in the same unit worktree at the same time (U-012 round 3), so each could see the other's mutants. Mutation work should run in a scratch copy (`git worktree add` at the head), never the builder's worktree.
- U-018 merged with two docstrings left above the wrong functions (`src/lib/editorial.ts` near `isSameCollectionKind`, `src/lib/legal.ts` near `isDraft`) and three test gaps (the UPDATE race guard in `editLegalDraft`, the publish lookup's cap, case-differing duplicate ids). Small follow-up PR.
- U-031 added a new `'use client'` island (`FilterBar`) that the architecture allowlist does not name; the builder flagged it for an owner delta-log line. Show more replaces the grid rather than appending (differs from Figma) to avoid a second island.
- U-031's builder took 28 minutes and 172 tool calls; the largest build of the wave.
