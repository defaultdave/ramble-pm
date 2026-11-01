PASS

## spec-compliance: U-031 "home cache tags" (head 98be156)

### Blocking
- None.

### Non-blocking
- src/server/home.ts:81-82: comment says a booking change publishes session:<id> "which no read carries"; spacesLeft.ts:18 tags it. Narrow to "getThisWeek carries no session tag".
- experiencePage.test.ts failure test now expects "Experience read failed: CachedReadError" (nested throw wrapped by the outer readOrRefuse). Diagnostic loss only; no params leak.
- Unit ID: units.yaml titles U-031 "Browse with URL filters"; this is the carrier unit for audit fixes (as in earlier PRs).
- Audit item (pre-existing): getThisWeek tags only catalog and its experiences; names covered because taxonomy also sends catalog.

All criteria PASS: H-47 (home off listing writes, catalog off getHomeContent, per-experience tags), H-53 (getFilterOptions moved, callers updated), H-49 comment, a tag test per write kind, nothing from H-48.
