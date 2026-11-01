PASS

## architecture-audit: U-031 "tag cap" (head 7bbac60), round 2

### Blocking
- None.

### Non-blocking
- Audit item, B7 (ruled non-blocking, DECISIONS 2026-11-01): cacheTagBudget exports are imported only by tests, by design; the fix, if wanted, is a runtime tagAll(ids) helper that also absorbs the repeated tag loop (H-111).
- Counts for home, this week, experience page, browse and covers are each backed by a real cacheTag-count test; settings only indirectly (siteSettings.test.ts).

ARCH_VERDICT=APPROVE
