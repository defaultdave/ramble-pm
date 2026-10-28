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

## Added 2026-10-28 (rolling build)
- Sessions: store `local_date` for every session in U-012's write path (NOT NULL), then drop the `coalesce` U-031 keeps in browse's `WHERE` and the matching lib rule (DECISIONS 2026-10-28).
- Duplication between U-030 and U-031: both hold `durationLabel`, `priceLabel`, the experience address, the New York day, a read-or-refuse helper, and a link styled as a chip (U-031 `ChipLink`, U-030 its own). Fold into one after both merge.
- U-030 reads sessions for "On this week" through its own `db/home.ts` because U-012 shipped no guest read of sessions; open holds are not counted yet (U-014a).
- U-030 hides the site banner when its read fails rather than failing the page (flagged by its builder as the one fail-open; reviewers passed it). Confirm that is the call.
- The architecture audit keeps finding B2 decisions late (U-010 passed four checks at 57de4cc, then three B2 items and one B13 were found on a focused re-check). The round 1 audit is not yet exhaustive.
- Review rounds per unit this session: U-030 2, U-021a 3, U-031 5 or more, U-010 3 or more counting wave 3.

## Pending PM memory lines (2026-10-28; this session ran in a worktree and may not edit the main checkout's `.claude/agent-memory/ramble-pm/MEMORY.md`; the next PM session started from the main checkout should move these into it)
- A session may not edit files in another session's worktree. Fixers therefore run in their own isolated worktree on a `wip/<unit>-r<n>` branch cut from the reviewed head; the PM fast-forwards `unit/<unit>` to the final head and pushes. Merges of `main` that need no hand resolution can be built with `git merge-tree` and `git commit-tree`, with gates run in a scratch checkout.
- Never type a full commit SHA from memory or by extending a short one; copy it from `git rev-parse` output. Twice a wrong SHA reached a workflow's arguments and the run had to be stopped.
- After a unit passes review, merging `main` can still break it without a textual conflict (U-031 deleted a read that a newly merged seed test called). Run every gate and a focused four-check re-check on the merge commit before posting checks.
- A fixer's scope manifest must name every item the PM directs it to change; reviewers fail anything outside the IN SCOPE line, including the PM's own additions.
- Start PM sessions from the main checkout, not a worktree: from a worktree the PM cannot write its own memory files.
