PASS

## architecture-audit: checkout audit fixes, BC-58, BC-29, BC-35, BC-39 (head 89e6ece, base 053bd1a) (agent verdict, recorded by the PM because the agent is read-only)

ARCH_VERDICT=APPROVE. ARCH_BLOCKING_COUNT=0.

Blocking: none. B1, B2, B3, B4, B7, B8, B11, B16, B17 pass; B5, B6, B9, B10, B12, B13, B14, B15 N/A. `checkout/error.tsx` is `'use client'` as an allowlisted framework error boundary. `focusBookingNotice` replaces two copies of the notice-focus effect. No new decision sits in a component.

Advisory: 2 px focus outline and offset are literals across the repo, with no token. `@media (min-width: 360px)` is a new one-off breakpoint. `focusBookingNotice('[role="dialog"]')` takes the first dialog on the page. `hasServerActionDirective` in `tests/support/importGraph.ts` need not be exported. The Sentry guard now skips `import type`; worth a line in the PR. `tests/bot-check-scope.test.ts:11` and `tests/cache/conventions.test.ts:214` carry their own file walkers.
