PASS

## spec-compliance: U-030 checkout not-found and error states (head 41ff370)

All five BC-50 criteria PASS: both states wrap GuestShell (skip link, header, single main, footer); /orders/<bad ref> and /gift with no token resolve to (checkout)/not-found.tsx via notFound(); retry still calls the supplied function; tests per state (5 new, 18 pass with the no-sentry test); nothing out of scope.

### Blocking
- None.

### Non-blocking
- Tests render the components directly; criterion 2 rests on reading the notFound() chain. A route-level or e2e check would close it (QA item).
