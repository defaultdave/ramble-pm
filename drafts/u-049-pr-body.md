Unit U-049, issue #57. Critical tier, into `integration`. Built under the pattern note (`drafts/u-049-pattern-note.md` in `ramble-pm`; Q1 to Q4 answered as recommended, DECISIONS 2026-10-29). One round; all four checks passed.

SCOPE MANIFEST
IN SCOPE: the `confirmOrder` entry point (already-confirmed stop, amount and currency check) and the booking branch: room check at processing time, cancelled-session and CHECK fallbacks handing off to the refund path, ledger postings, the scheduled transfer row, the provider-fee posting through a shared helper, U-054's guest and host email jobs, and the manage token hash, all in the confirm transaction; gift-purchase, zero-due and exchange branches as typed stubs.
OUT OF SCOPE: the refund path's writes (U-109), refund execution (U-056), transfer release (U-079a), the confirmation page (U-050), gift and exchange branches (U-062a, U-064a, U-065a), analytics, UI, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 (money rules 1 to 8, the hold and order state tables, `confirmOrder` steps 1 to 5, Transfers, the ledger postings table and worked example, the capability-token amendment).

## What was built
- **Decisions** (`src/lib/confirmOrder.ts`): `confirmDecision` answers `already_confirmed`, `confirm`, `refund_path` (amount or currency mismatch, cancelled session, sold out after a lapse) or `not_built`, from plain values, with a table test per row; `isSeatsSoldRefusal`, `isSimulatedPayment`. Hold transitions (`holdTransitions`, `requireHoldTransition`) in `src/lib/holds.ts`, `transferReleaseAfter` in `src/lib/transfers.ts`, `providerFeeEntries` in `src/lib/ledger.ts`, `bookingEmailKey` in `src/lib/bookingEmails.ts`.
- **`confirmOrder`** (`src/server/db/confirmOrder.ts`) replaces U-048's seam under the caller's locks (events, session, hold, order): `seats_sold += seats`; hold `converted` (including a lapsed hold the upkeep already released, when there is room); order `confirmed` with `confirmed_at` and the manage token hash from `capabilityToken`; `bookingPaid` through `postEntries` and the card fee through `postProviderFee`, both keyed on the provider payment so a replay posts once; one `scheduled` transfer releasing 24 hours after the session ends; the guest and host email jobs; the session's cache tag. A refusal by the seats-sold CHECK rolls back a savepoint and takes the refund path.
- **Seams**: the refund path (`src/server/db/refundPath.ts`, `TODO(U-109)`) answers `unavailable`, so U-048 keeps the payment's success and retries; gift purchase, zero-due and exchange throw `NotBuiltError` naming their units. An amount or currency mismatch raises `payment-amount-mismatch` once per order.

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): the refund path stays U-109's behind a seam; no `booking_confirmed` event until U-086; a missing provider fee posts nothing and does not fail the confirm.
- `released -> converted` is allowed: a payment that succeeds after the hold was released still lands through `confirmOrder` (design doc); `converted` stays terminal.
- The cache invalidation runs inside the caller's transaction; a later rollback costs one extra refresh.
- A late success for an order already cancelled or refunded throws and retries until U-048's give-up alert (audit BC-26).

## Gates (on this head)
format:check, lint, typecheck, knip; test 5,874; test:db 1,528 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 163; gitleaks over the branch range (no leaks). Tests include a signed success through the webhook route and job drain that confirms the order, posts the fee and puts the guest email in the dev mailbox; an event left retrying under the old seam confirming on its next retry; two successes for one order confirming once; a confirm racing `reserveSpaces` for the last seat never overselling (six rounds); the design doc's worked example to the cent. Removing the session lock, the seat-count update or the already-confirmed stop each fails tests.

## Not done
- The refund path, the confirmation page (U-050) and the gift and exchange branches are their own units.

## Evidence
No visible change: lib decisions and server code. QA's run is in the `qa-agent` check summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
