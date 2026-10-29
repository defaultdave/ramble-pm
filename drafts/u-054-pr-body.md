Unit U-054, issue #64. Critical tier, into `integration`. Two review rounds; all five checks (review, qa, spec-compliance, architecture-audit, a11y-audit) passed round 2 on this head, after a merge of `integration` (U-014a) and a regenerated migration.

SCOPE MANIFEST
IN SCOPE: guest confirmation (with `.ics` and manage link), host booking notice, cancellation (guest and host audience), refund, and S10 notice templates, every copy and formatting rule a tested `src/lib` function; help link in every email; the `guest_confirmation` and `host_booking_notice` job types (payload: order id, Zod-validated) and idempotent handlers rendered into the U-006 dev mailbox; the manage link built from `capabilityToken('manage', ...)` at the order's version; access tests on fixture orders; any new column classified in `src/lib/privacy.ts`.
OUT OF SCOPE: enqueuing from any money path (U-049), cancellation and refund flows (U-055, U-056), host pages, orders schema changes, UI beyond the templates, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 (capability tokens, dev mailbox carve-out), PRD-25, 44, 54, 76; U-006 email port; U-005 jobs.

## What was built
- **Templates** (`src/lib/email/bookingBody.ts`, `bookingTemplates.ts`, `src/lib/email/templates.ts` as typed tables): five emails, plain and short, each ending "Questions? Reply to this email, or visit our help page." with a help link; no em dashes.
- **Calendar** (`src/lib/ics.ts`): a VCALENDAR with CRLF, UID the order id, DTSTAMP from `confirmed_at`, every stamp in whole seconds (`^\d{8}T\d{6}Z$`) so a retry sends the same bytes; plus a Google Calendar link in both parts.
- **Attachments on the email port** (`src/lib/email/message.ts`, bounded schema): both providers send base64; existing callers unchanged.
- **Jobs** (`src/server/jobs/bookingEmails.ts`): message keys `guest-confirmation:<orderId>` and `host-booking-notice:<orderId>`; a cancelled order is skipped and other non-confirmed statuses refused; the handler sends only if `hashToken(token)` equals the order's stored manage hash (constant time).
- **`hosts.notification_email`** (migration `0014_host_notification_email`): nullable, CHECK matching the Zod address rule, classified. A host with no address makes the notice retry and then dead-letter.
- One line limit, `MAX_LINES` in `src/lib/pricing.ts`, now shared by the order summary and the emails.

## Decisions to know about
- In the dev mailbox (fake adapter) the sent body, and so the manage link, is kept in `messages.html` and `text_body` by U-006's design (design doc line 484); in live mode no body is kept and the raw token is stored nowhere. Tests assert both (PM ruling, DECISIONS 2026-10-29).
- No VTIMEZONE: times are UTC, which is valid.

## Gates (on this head)
format:check, lint, typecheck, knip; test 4,831; test:db 1,240 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 160; gitleaks over the branch range (no leaks). QA on the head: manage link of order A carries A's token and not B's, `.ics` valid with a non-zero-millisecond stamp, retry sends once, dead letter at 8 of 8 for a host with no address, raw token only in the dev mailbox columns; a mutation of the manage-hash check fails the access test.

## Not done
- Nothing enqueues these jobs yet; U-049 does on confirmation.
- Audit item BC-7: demo hosts need seeded `notification_email` values for the host notice to send.

## Evidence
`evidence/pr/unit-U-054-booking-emails/` in `ramble-pm`: `guest-confirmation-720-light.png`, `host-notice-720-light.png`, `cancellation-720-light.png`, `refund-720-light.png`, `s10-paid-after-lapse-720-light.png` (dev mailbox at 720 px).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
