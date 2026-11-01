PASS

## qa-agent: U-031 "home cache tags" (head 98be156)

### Blocking
None.

### Non-blocking
- getThisWeek waits up to about 60 s for a session added to an unlisted experience; documented in the code.
- categoryCopy and neighborhoodCopy tag category:<slug> and neighborhood:<slug>, which no read here carries; outside this unit.

### Unconfirmed
- test:db not run by qa (sandbox); builder reported 1620 green.

### Test run and mutations
- pnpm test: 256 files, 6586 tests pass.
- 9 cacheTag calls and 19 tag-per-write-kind mappings removed one at a time; every mutation made a test fail, none survived.
- Write-to-read invalidation traced for listing, collection, taxonomy and session writes; home no longer carries catalog.

### Evidence
None needed; no UI changed.
