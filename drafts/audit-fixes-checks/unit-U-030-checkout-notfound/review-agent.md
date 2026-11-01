PASS

## review-agent: U-030 checkout not-found and error states (head b1f3b19), round 2

NOTE: the PR description is from round 1 and is out of date (agents cannot edit it). Round 2 keeps the checkout page's own `(checkout)/error.tsx` on `SiteShell`, adds `(checkout)/(site)/error.tsx`, and keeps `GuestShell` in `not-found.tsx`; the remainder is BC-58.

### Blocking
None.

### Checks
- No 'use client' module in the checkout group imports GuestShell or siteNav (the round 1 cause: GuestShell in the client error.tsx pulled zod into client JS and tripped the nonce CSP via zod's Function("") probe on 14 paths).
- (site)/error.tsx sits inside the (site) layout, so the guest frame persists around ErrorNotice; an error in the layout itself falls back to (checkout)/error.tsx.
- 5 files, 25 tests pass; ADR 0007 closure test passes.

### Non-blocking
- The checkout page's own error state stays on the plain SiteShell (BC-58).
