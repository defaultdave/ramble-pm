FAIL

## review-agent: U-054 "Booking emails" (head 769c79b)

### Blocking
- `src/lib/ics.ts:25` (`basicUtc`): DTSTAMP is malformed for any real `confirmed_at`: `toISOString().replace(/[-:]/g,'').replace('.000','')` strips milliseconds only when they are exactly `.000`; `new Date('2026-11-07T19:00:00.123Z')` gives `20261107T190000.123Z`, not valid RFC 5545 date-time, so strict calendar clients may reject the event. The tests (`ics.test.ts:130`, fixtures) use whole-second instants only. Fix: truncate to whole seconds before formatting; tests with a non-zero-millisecond `stampedAt` and a DTSTAMP check against `^\d{8}T\d{6}Z$`. Truncation is deterministic, so retries keep the same bytes.

### Non-blocking
- Token handling reads correctly: rebuilt from `capabilityToken('manage', id, version)`, compared with `secureEqual(hashToken(token), storedHash)` before sending; a null hash or mismatch throws `BookingEmailError` with no address, name or token; strict `{orderId}` payload.
- Idempotency sound: per-order message keys; a retry or version bump after a send returns the settled message; cancelled orders skipped; the raw token reaches a stored body only through the fake adapter's `keepsBody` path.
- The email port change leaves existing callers working; attachments bounded (2 files, 20,000 characters, name regex, one content type).
- `hosts.notification_email` has a matching CHECK and is classified; item lines capped.
- No duplicate of `zonedLabels.ts` or `oneLineClipped` found.

### Unconfirmed
- Suites not run; no mutation test; templates, `EmailParts.tsx` and db access tests not read line by line; end-to-end attachment coverage not checked.
