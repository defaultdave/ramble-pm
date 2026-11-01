PASS

## qa-agent: U-031 "Tag cap" (head 7bbac60), round 2

### Blocking
None.

### Non-blocking
- Mutation survivor, judged not a safety defect: thisWeekCandidates changed back to a literal 10 still passes (1 + 10 tags is inside 128). A test that it equals 2 * thisWeekShown would catch it.
- Runbook sentence splice at docs/runbooks/home.md:52.

### Checks
- pnpm test: 260 files, 6631 tests pass. Round 1 ran the db suite green (1620); round 2 changes no db code.
- Mutations killed: extra cacheTag per ID in getThisWeek (3 failed); extra cacheTag in getExperiencePage (3); picksCandidates 5 to 6 (3); dropping the all-unusable-Pick guard (2). Round 1 killed seven more.
- The runbook figures match the code constants.

### Evidence
Test output above; no UI change.
