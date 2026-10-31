PASS
## architecture-audit: U-030 "Order, manage and gift pages use the guest frame" (head ecf88eb)

Diff since round 1: one file, the test. `layout.tsx` and `GuestShell` are byte-identical to round 1. B1 to B17 rechecked, no blocking item. The round 1 test-adequacy note is resolved: 3 passed as shipped, 2 failed with `SiteShell` swapped in.

Non-blocking audit item: `src/components/SiteShell.tsx` duplicates `GuestShell`'s frame and still serves `(checkout)/not-found.tsx`, `(checkout)/error.tsx`, `(host)/layout.tsx` and `(ops)/layout.tsx`.

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
