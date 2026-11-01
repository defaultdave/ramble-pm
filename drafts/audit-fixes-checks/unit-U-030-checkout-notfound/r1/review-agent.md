PASS

## review-agent: U-030 "Checkout not-found and error states render in the guest frame" (head 41ff370)

### Blocking
None.

### Non-blocking
- Diff touches only (checkout)/not-found.tsx, error.tsx, their two new test files, and a one-line follow-on in tests/checkout-no-sentry.test.ts (SiteShell no longer in the checkout closure; GuestShell asserted). layout.tsx and SiteMenu untouched.
- Reuse: GuestShell, ErrorNotice, NotFoundNotice only; no new exports.
- ADR 0007 holds (no banner); the Sentry closure test passes (18 tests, 3 files).

### Unconfirmed
- Figma-vs-built check not part of this review.
