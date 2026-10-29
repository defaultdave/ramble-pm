# Booking and checkout audit

**Status:** the pass has not run; it runs when the money core and the checkout pages land on `main`. Until then this file tracks the items raised along the way (review rounds, the PM) in the e2e-money lane, as the README says.

## Items

| ID | Item | Lens | From | Status |
|---|---|---|---|---|
| BC-1 | The `(checkout)` route group renders `SiteShell` with an unstyled header and footer. | Visual | stub glue review (PR 246) | open |
| BC-2 | `consents` rows are not append-only (no guard trigger like the ledger's), though consent history is evidence. | Architecture | U-015 review | open |
| BC-3 | `.visuallyHidden` is defined in more than one module; one shared utility class. | Code and DRY | U-045b review | open |
| BC-4 | U-045b's fake payment form loses focus to nothing when its view changes (no focus move to the new view's heading). | Accessibility | U-045b review | open |
| BC-5 | The confirm step needs its own rate limit; lands with U-047b. | Architecture | U-047a note | open |
| BC-6 | The email and jobs db tests fail under load on the shared Postgres (timing-sensitive); raise `max_connections` on the shared local Postgres or give each suite its own database. | Tooling | U-054, U-016 reviews | open |
| BC-7 | `hosts.notification_email` has no seeded values, so the demo's host booking notices dead-letter; the seed needs one address per demo host. | Code | U-054 builder | open |
| BC-8 | `maxMoneyLines` in the emails restates `MAX_LINES` in the order summary. | Code and DRY | U-054 architecture | fix: U-054 round 2 |
| BC-9 | The `payment_tries` limiter counts every `startPayment` call, including idempotent refreshes and random hold ids before the device check (one limiter row each); five page loads lock the guest out of the secret, even for an already confirmed order. As specified (note, U-008b). U-047b keeps refresh and polling off `startPayment`; reconsider exempting reuse. | Architecture | U-047a review | open (U-047b told) |
| BC-10 | The fake payment provider keeps payments in process memory; a restart or a second instance makes `retrieve` return null and `startPayment` throw `not_found` (fail closed). Revisit with U-046. | Architecture | U-047a review | later: U-046 |
| BC-11 | `retrieve` can hand back a payment the provider already canceled before its webhook updates the attempt, giving the guest a dead secret until U-048 processes it. | Architecture | U-047a review | open (check in U-048 review) |
| BC-12 | Non-cash ledger events are not idempotent in the database (a replayed `refundRequested`, `refundFailed`, `giftRedeemed` double-posts); each caller unit needs a retry-posts-once test under its locked state check. | Architecture | U-016 review | open (U-049, U-056, gifting units) |
| BC-13 | Host statement and finance export rows are per `occurred_at` window, so a booking straddling a boundary shows partial rows in each; U-080 and U-071 should state it. | Architecture | U-016 review | open |
| BC-14 | `requireMinor` (ledger) nearly repeats `requireInt` in `pricing.ts:44` and other private integer guards; `jobs.ts:45` and `sessions.ts:30` keep their own readable-date windows beside the new `isReadableInstant`. | Code and DRY | U-016 architecture | open |
| BC-15 | B6 has no written exemption for system money paths; `postEntries` takes no `Caller` by PM ruling. Record the exemption in the standard (Dave's file). | Architecture | U-016 architecture | open (owner) |
