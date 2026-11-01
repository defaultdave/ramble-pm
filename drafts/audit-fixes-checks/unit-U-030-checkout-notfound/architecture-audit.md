PASS

## architecture-audit: U-030 (head b1f3b19), round 2

### Blocking
- None. Client closures of the two 'use client' error files reach no siteNav, GuestShell or zod module; B4, B8 (framework error boundaries) clean.

### Non-blocking
- (site)/error.tsx is a fourth copy of the shared two-line error shim (audit item).
- SiteShell remains a second guest frame while client error boundaries cannot reach GuestShell (audit item).

ARCH_VERDICT=APPROVE
