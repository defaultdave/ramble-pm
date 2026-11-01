PASS

## spec-compliance: U-031 "tag cap" (head 7bbac60), round 2

All six criteria PASS: no cached read can carry more than 128 tags; maxCardIds 240 to 100 and maxCoverLookups 240 to 80; a budget test fails when a cap grows; the bound derives from the page limits; nothing out of scope (docs/runbooks only beyond src); docs no longer state the old bounds.

### Blocking
- None.

### Non-blocking
- Runbook sentence splice at docs/runbooks/home.md:52.
- The settings count has no real-code check; thisWeekCandidates is defined in pages/home.ts, away from the other bounds.
- picksCandidates 12 to 5 changes how many backups a Pick has; covered by the new shortfall tests.
