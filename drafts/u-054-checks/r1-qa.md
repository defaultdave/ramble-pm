PASS

## qa-agent: U-054 "Booking emails" (head 769c79b)

Scratch copy of the archive; nothing written to the repo or any worktree.

### Blocking
None.

### Non-blocking
- The cancellation email reads "Hi Pat Rivera, This session was cancelled because of the weather.": `src/lib/email/bookingBody.ts:98` joins `Hi ${recipientName}, ${reasonLine}` and the reason starts with a capital.
- The `.ics` SUMMARY and DESCRIPTION showed the shared fixtures' names; the real title reaching SUMMARY not confirmed.
- The `.ics` uses UTC times with no VTIMEZONE; valid.

### Gates (scratch copy)
`pnpm test` 4663; typecheck, lint, knip, format:check, db:check clean; db suite with `--maxWorkers=2` 1147 in 19 files, no 53300. e2e and build taken from the builder.

### Fixture-order checks (own db test, since deleted)
- Manage link: A's email link carries a 43-character token whose hash equals A's stored hash and not B's; B's token matches B only; the link opens A and not B.
- `.ics`: valid VCALENDAR with CRLF (VERSION, PRODID, METHOD:PUBLISH, one VEVENT with UID, DTSTAMP, DTSTART, DTEND, SUMMARY, STATUS); DTSTART 20261107T210000Z to DTEND 20261107T230000Z (4:00 to 6:00 PM EST), matching the body.
- Retry: with the provider returning 500 once, the retry sent with the same token and a third run sent nothing; one `sent` row.
- Dead letter: a host notice for a host with no address retried to `dead` at 8 of 8 ("email refused: the host has no notification address"); no message logged.
- Raw token: only in `messages.html` and `messages.text_body` (the dev mailbox sink by design); not in orders, jobs or any other column.
- Mutation: the manage-hash comparison replaced with `false`: "refuses to send a link for an order with a hash for another version" failed. Restored.

### Copy rules
All five templates plain and short, each with "Questions? Reply to this email, or visit our help page." and a help link; no em dashes; the guest confirmation has the manage link, a Google Calendar link and a "do not forward" warning; the host notice has no manage link.

### Evidence
`guest-confirmation-720-light.png`, `host-notice-720-light.png`, `cancellation-720-light.png` (shows the capitalisation), `refund-720-light.png`, `s10-paid-after-lapse-720-light.png`.
