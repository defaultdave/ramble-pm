PASS

## review-agent: U-031 "Tag cap" (head 7bbac60), round 2

### Blocking
None. Round 1 blocker fixed: docs/runbooks/home.md:52 now says 80, coverLookupLimit, 5 Picks candidates.

### Non-blocking
- docs/runbooks/home.md:52: two sentences were spliced ("fails if a cap grows past it and returns one row per experience"); split them.
- cacheTagBudget.ts has no production importer; ruled non-blocking by the PM (DECISIONS 2026-11-01).
- Arithmetic matches every real cacheTag call: home 102, this week 9, settings 1 (page total 112), covers 80, browse 13, experience page 2. No stale 240, 242 or 12-candidates mentions in docs.
- 14 files, 398 tests pass.
