PASS

## architecture-audit: U-030 "menu dismiss" (head b07f2e3), round 2

### Blocking
- None. Round 1 B17 resolved (shared hook); A6 clean with two callers.

### Non-blocking
- B8: SiteMenu 'use client' and the shared hook are not on the allowlist; PM-approved in DECISIONS 2026-11-01, Dave adds them.
- Audit item: capture-phase pointerdown listeners in FilterDrawerHost.tsx and focusMemory.ts do different jobs; a later unit could fold the wiring.

ARCH_VERDICT=APPROVE
