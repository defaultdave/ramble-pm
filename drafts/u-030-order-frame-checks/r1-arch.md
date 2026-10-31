PASS
## architecture-audit: U-030 "Order, manage and gift pages use the guest frame" (head 4e778f0)

Rules: `.claude/standards/architecture.md` (project, read at head 4e778f0560dc488771e1c2ff941cf66126e53541)
Files audited: `src/app/(checkout)/(site)/layout.tsx`, `src/app/(checkout)/(site)/layout.test.tsx`
Diff: 2 files, +42 / -3, base `5cb9e87`.

### Blocking
None. B1 to B17 checked: no fetch, DB or SDK call in the layout, no decisions, no `process.env`, imports run app to components to lib, no `'use client'` added, and the change reuses the existing `GuestShell`.

### Non-blocking
- `src/app/(checkout)/(site)/layout.test.tsx:9-38`: the brief asks that the layout test fail if the old shell returns. It does not. Run in a scratch copy with the layout swapped back to `SiteShell`, both tests pass (2 of 2), since `SiteShell` has the same skip link, banner, main and contentinfo, and no site notice. Fix: assert the guest header's main nav and the footer nav links, which `SiteShell` lacks.
- Audit item (predates this diff): `src/components/SiteShell.tsx` duplicates the skip link, header, main and footer of `GuestShell`. It still serves `(checkout)/not-found.tsx`, `(checkout)/error.tsx`, `(host)/layout.tsx`, and `(ops)/layout.tsx`.

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
