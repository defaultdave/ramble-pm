PASS

## spec-compliance: U-030 (head b1f3b19), round 2, against the narrowed criteria

The PM narrowed the unit (DECISIONS 2026-11-01): the checkout page's own error state is split out as BC-58 because GuestShell in a client file broke the CSP e2e. The spec agent judged the ruling reasonable and found no hidden blocker.

1. Checkout group not-found renders the guest frame: PASS.
2. Error states under (site) render the guest frame, Try again works: PASS.
3. No client JS or CSP regression: PASS (static; e2e green per qa).
4. A test per state: PASS.
5. Nothing out of scope: PASS.

### Blocking
- None.

### Non-blocking
- Tests render components directly (BC-55 open). BC-54 (retry vs reset) looks like a false alarm: Next 16 passes retry. BC-58 holds the remaining work.
