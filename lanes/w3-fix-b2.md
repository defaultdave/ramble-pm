# Lane history: w3-fix-b2

Newest first.

- **2026-11-18, round 1, PR 1046** (`unit/U-078-audit-w3b2`, head `34f862f`, U-078 standard, audit W3-2, no `Closes`). Finding verified against `updateSettings` on origin/main (compares only with the locked row). Builder (sonnet) added a hidden `version` (updated_at as microsecond text), a lib match check inside the locked read, `StaleSettingsError`, a `stale` notice; no schema change. QA (live app, two contexts, throwaway db) PASS; spec-compliance PASS; review FAIL (route README rows not updated); architecture-audit FAIL (B13 catch returning null, B2 outcome mapping inside the action). Round 2 fixes on `wip/U-078-audit-w3b2-r1`. Four other tests/db files were edited only to pass the new required argument (accepted as the minimum). Duplication audit item: sessions use an integer `expectedVersion` column; settings uses a timestamp text version because the manifest forbids a schema change; unify later.
