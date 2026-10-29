## Promote integration 2026-10-28

Opened from `promote/2026-10-28`, a branch cut from `integration` at `f44cfc8`, so merging it deletes only that branch (DECISIONS 2026-10-25). It merges into `main` with no conflicts and needs no sync first: `integration` adds four `src/lib` files and nothing else that `main` lacks. Promoted the same day it was asked for, because U-111 gates the experience page (DECISIONS 2026-10-26).

### Critical-tier unit in this batch

**U-111 Pricing and cancellation windows** (PR #202, issue #18)
- `src/lib/pricing.ts`: `lines(items, priceOptions, ratePpm)` prices adults and children from their own options, rounds tax half up once on the ticket subtotal, and makes the total exactly subtotal plus tax. `taxRatePpm` gives the configured rate for `taxable` and 0 for `not_taxable` and `unknown`.
- `src/lib/cancellation.ts`: `cancellationWindow(tier, startsAt, now, timeZone)` gives the free-cancel deadline as an instant and in host-local form, whether cancelling now is free, and the refund fraction in ppm.
- Pure functions: no I/O, no clock reads, no floats in money math. Bounds are refused with `RangeError`, never clamped.
- Review: one round. Tests cover half-up boundaries, a 2,000-run property check against a BigInt reference, both daylight-saving changes in New York, and the deadline boundary at plus 1 ms.
- Decisions for the owner to read are in PR #202: elapsed hours rather than wall-clock hours for the deadline, the deadline instant itself is free, a refund fraction rather than an amount.
- No tables, no migration, no UI.

### Checks
- Nightly smoke passed on `integration` at `f44cfc8` (run 40648022911, 2026-10-28 07:09 UTC), and `integration` has not moved since.

### After merging
- U-039 (experience page, now with cover photos on the home and browse cards) can start: it needed U-111 in `main`.
- No production migration is needed: this batch adds none.
- A sync PR brings `main` back into `integration`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
