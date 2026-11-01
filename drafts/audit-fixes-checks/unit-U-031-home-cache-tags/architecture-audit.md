PASS

## architecture-audit: U-031 "home-cache-tags" (head 98be156)

### Blocking
- None. B1 to B17 checked; B2 sweep found no blocking domain decision; B17: filterOptions.ts consolidates three inline copies of the categories-plus-neighborhoods read.

### Non-blocking (audit items)
- src/lib/cacheTags.ts:87 tagsForChange has no production caller; home.test.ts:418 could use tagsForChanges([change]).
- cacheTags.ts:41,65-66 taxonomy kind has no producer and no TODO(U-xxx) naming one.
- BrowseContent.tsx:40-45 matchesNothing branch in an async shell (pre-existing).
- Per-experience tag loop repeated at browse.ts:34-35, home.ts:57, home.ts:102-104; a shared tagExperiences helper would remove it.

ARCH_VERDICT=APPROVE
