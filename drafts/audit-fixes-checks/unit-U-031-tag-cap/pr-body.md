Audit H-48: one cached read could carry up to 242 tags, and Vercel documents 128 per response. Every cached read now stays inside 128, and a test fails if a cap grows past it.

## What changed
- `picksCandidates` 12 to 5, so `cardLookupLimit` (the card-ID bound) falls 240 to 100. A Pick shows 3 cards, so it keeps 2 backups for an unavailable entry.
- New `coverLookupLimit` (80 = 20 modules x the larger of 3 Picks cards and 4 "On this week" cards); `maxCoverLookups` falls 240 to 80. Covers are read only for the cards built.
- `src/lib/pages/cacheTagBudget.ts` holds the 128 budget and the most tags each read can carry (home 102, this week 9, covers 80, browse 13, experience page 2, settings 1; the whole home page 112). It is read only by tests, by design.
- Tests count the real `cacheTag` calls at maximal input for home, this week, covers, browse and the experience page, and pin the shortfall case (a Pick whose first 5 entries are unusable shows fewer cards or is dropped).
- `docs/runbooks/home.md` states the new bounds.

## Platform limits (from the source and docs)
Next 16.4.2 caps one `cacheTag()` call at 128 tags and puts no cap on the total across calls. Vercel allows 128 per response.

## Behaviour change
A Pick whose first 5 entries cannot all be cards now shows fewer cards (or none) even if a later entry could. Entries come from the guest-visible read, so this needs entries to become unavailable between read and render.

## Checks
review, spec, architecture and qa PASS on round 2 (round 1 failed review and architecture on a stale runbook figure and the test-only exports). Gates: format, lint, typecheck, knip, build, 6631 unit tests, 1620 db tests (round 1), gitleaks over the range. qa mutation checks killed every mutation except one harmless one.

## Follow-ups logged, not built
- The test-only budget exports could become a runtime `tagAll(ids)` helper that also absorbs the repeated tag loop.
- One runbook sentence is spliced; a test that `thisWeekCandidates` equals `2 * thisWeekShown`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
