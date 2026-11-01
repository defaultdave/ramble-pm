PASS

## review-agent: U-031 "Home cache tags" (head 98be156)

### Blocking
None.

### Non-blocking
- src/server/filterOptions.ts:19 and src/lib/cacheProfiles.ts:22-24: the shared read uses the catalog profile (revalidate 900); the home entry uses editorial (3600). If Next takes the shortest lifetime, home refreshes every 900s. Fails safe. Audit item: say so in the comment or give getFilterOptions a profile no shorter than editorial.
- src/lib/cacheTags.ts:40: the taxonomy tag has no publisher yet. Audit item: name the unit that wires it.
- src/server/experiencePage.ts:21: long doc-comment line. Style only.

### Unconfirmed
- Nested tag propagation is asserted with a mocked cacheTag; no real Next cache runtime check.

Scope within IN SCOPE; 6 affected test files, 80 tests pass. Evidence: no UI change.
