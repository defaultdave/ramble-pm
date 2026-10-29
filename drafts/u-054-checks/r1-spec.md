PASS

## spec-compliance: U-054 "Booking emails" (head 769c79b)

### Blocking
- None.

### Non-blocking
- "Neither the message log nor the order row stores the raw token": holds in live mode; in sink mode the dev mailbox's `messages.html` and `text_body` carry the link, which design doc line 484 names as the one place the sent email carries the token. PM to rule and record that reading.
- `src/lib/email/bookingBody.ts` (copy and formatting rules) has no direct unit test; its strings are asserted only through render tests in `src/server/ports/email/bookingRender.test.ts`. A test-placement gap.

### AC mapping (all PASS)
Guest confirmation with `.ics` and manage link; host notice; cancellation (guest and host audience); refund; S10 notice; help link in every email (via `EmailLayout`); job types registered with an order-id-only strict payload; per-order idempotency keys; the manage link from `capabilityToken('manage', ...)` sent only if its hash matches in constant time; fixture orders A and B with the access test; `hosts.notification_email` classified with a matching CHECK; the port's attachment change leaves `dev-check` unchanged; cancelled orders skipped, other non-confirmed statuses refused; no enqueue from money paths (TODOs for U-049, U-055, U-056). Scope: 41 files under `src/`, `tests/db/` and the migration.
