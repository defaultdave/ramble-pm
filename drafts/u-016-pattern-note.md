# U-016 pattern note (draft 2026-10-29, e2e-money lane, for Dave's approval)

Goes into U-016's scope manifest once approved. U-016 is the ledger every money path posts to: `confirmOrder` (U-049) first, then refunds (U-056), transfers (U-079a), reconciliation (U-079b), the finance export (U-080), money held (U-110), disputes (U-081), gifts (U-062a, U-064a, U-066b), and the investor report (U-088) (`docs/plan/units.yaml`, U-016 `execution_reason`: "the two-account ledger and the posting helper every money path calls"). It is human-led in the plan; Dave moved it to an agent builder under this note (DECISIONS 2026-10-29), as U-014a was.

Sources: `docs/plan/units.yaml` U-016 (scope; depends on U-015) and the scopes of U-049, U-056, U-079a, U-079b, U-080, U-110; design doc 4.2.3 ("Rules every money and hold transaction follows" 1, 3, 5, 6, 8; "Orders" commission snapshot; "Refunds" split math; "Ledger": table, accounts, postings, views); ADR 0002 recommendation 6 (money) and "Login, roles" (the audit log's insert-only role and trigger, which this mirrors); ADR 0003 (fake gateway only in the demo; release rule; daily reconciliation); ADR 0010 (critical tier merges to `integration`); PRD-47, PRD-56, PRD-57, PRD-74; `.claude/standards/architecture.md` (B2, B6, B7, B17); `drafts/wave3-builder-rules.md`; code on `main` at `5a595f1`: `src/server/db/migrations/0007_editorial_policy_guards.sql` (trigger pattern), `src/lib/pricing.ts` (caps), `src/server/auth/caller.ts` (roles), `src/server/db/staff.ts` (`requireStaff`).

Where a line says "Q", it is a call the PM made without a firm source; the questions are at the end.

---

**Pattern note (draft, not yet approved)**

Where things live
- Table: `src/server/db/schema/ledger.ts`, exported from `schema/index.ts`; one generated migration (`pnpm db:generate --name ledger`) and one custom migration for the trigger and role (`pnpm db:generate --custom --name ledger_guards`). Branch `unit/U-016` cut from `origin/integration` after U-015 is there.
- Decisions: `src/lib/ledger.ts` with unit tests: the account and entry-type tuples (feeding both `pgEnum` and Zod), the `LedgerEntry` Zod schema, `isCashPosting(entry)`, one builder per posting event in the design doc table (below), `accountBalances(entries)`, `moneyHeld(balances)`, and the host-statement and finance-export row shapers. No database import.
- Data layer: `src/server/db/ledger.ts` with `import 'server-only'`: `postEntries(tx, entries)` and the read functions for the views. It takes no locks itself; callers lock first in the one lock order (design doc rule 1) and pass their transaction. Use the exported `Transaction` type already on `integration` (U-005 or U-014a, whichever landed; B17), never a third one.

The `ledger_entries` table (design doc 4.2.3, Ledger)
- Columns exactly as the design doc lists them: `id` bigint identity; `occurred_at` timestamptz; `entry_type` and `debit_account`, `credit_account` as pgEnums `ledger_entry_type` and `ledger_account`; `amount_minor` integer; `currency` char(3); `order_id`, `gift_id`, `host_id`, `payment_attempt_id`, `refund_id`, `transfer_id`, `dispute_id` uuid null; `provider_object_id` text null; `simulated` boolean; `created_by` uuid null; `memo` text null. Plus `recorded_at timestamptz not null default clock_timestamp()` (Q2).
- Foreign keys, restrict: `order_id` to orders, `payment_attempt_id` to payment attempts, `refund_id` to refunds, `transfer_id` to transfers (all from U-015), `host_id` to hosts. No foreign key on `gift_id` (gifts come later), `dispute_id` (U-081), or `created_by` (staff users come with U-004a), following U-015's uuid-without-FK convention, each with a `TODO(U-xxx)` naming the unit that adds it.
- CHECKs, each matching a Zod rule, each with a db test that the database refuses the bad row:
  - `debit_account <> credit_account`.
  - `amount_minor > 0` and `amount_minor <=` a cap derived from `src/lib/pricing.ts` (the largest order total its caps allow; the builder names the constant, no new magic number).
  - `currency = 'USD'`.
  - `num_nonnulls(order_id, gift_id, host_id) >= 1`.
  - `provider_object_id IS NOT NULL` exactly when the row touches `platform_cash` (Q1), and its length is bounded.
  - `memo` at most 500 characters; `simulated` NOT NULL with no default, so every caller decides (failing open is the quality bar's class 3).
- The partial unique index on `(entry_type, provider_object_id) WHERE provider_object_id IS NOT NULL` (design doc), so a repeated provider event cannot post cash twice.
- Append-only (PRD-74, ADR 0002): a custom migration adds a trigger that raises on `UPDATE` and `DELETE` (row level) and `TRUNCATE` (statement level), on the `0007` guard pattern, plus a `NOLOGIN` role `ledger_writer` granted `INSERT, SELECT` only, created idempotently (`DO` block, since roles are cluster-wide on Neon branches) (Q3). Db tests prove update, delete, and truncate fail even as the table owner.

Posting helpers
- One lib builder per event in the design doc's postings table, each returning the balanced rows for that event from plain amounts the caller already holds: `bookingPaid` (host share, commission, tax when taxable), `cardFee`, `transferPaid`, `transferReversed`, `refundRequested` (host share, commission returned, tax), `refundSucceeded`, `refundFailed` (one row per requested leg), `giftPurchased`, `giftRedeemed`, `giftRefundedOrExpired`, `giftReinstated`, `rambleSelfPayout`, `disputeOpened`, `disputeWon`, `disputeLost`. Builders take the order's snapshot amounts (`commission_minor`, `tax_minor`, the refund row's split); they never recompute commission or refund math, which belongs to orders and refunds (U-015 contracts, U-056) (B17). Exports ahead of their first caller carry `TODO(U-xxx): first caller` (B7).
- `postEntries(tx, entries)` validates every row with the Zod schema, inserts all rows of one event in one statement, and is idempotent for cash postings: `ON CONFLICT ... DO NOTHING` on the partial unique index; if every cash row conflicted it returns `{ status: 'already_posted' }`, if some did and some did not it throws (a half-posted event is a bug, never repaired). Non-cash rows (liability postings, design doc rule 5) carry no provider id; their idempotency comes from the caller's own row (a refund request is posted in the transaction that creates the refund row, which is unique).
- A cap on rows per call (the largest builder's output; quality bar class 1).

Views (scope: host statement, finance export, money held, reconciliation) (Q4)
- Read functions in `src/server/db/ledger.ts` that fetch sums and rows; every formula on top of them is a lib function with a test (B2): `moneyHeld = host_payable + gift_liability + refunds_pending` (PRD-57), the statement's paid-to-host as transfers less reversals (PRD-47), one finance-export row per booking with its card fee (PRD-56), and the `platform_cash` balance the daily check (U-079b) compares with the provider balance.
- Access (B6): the host statement requires `host_owner` scoped to that host, with the identical refusal for a missing host, another host, and a staff-only read; the export, money held, and the cash balance require staff (`requireStaff`). Synthetic and simulated rows are reported, not hidden, and the export marks `simulated` (the demo is all simulated).

Balance tests (scope: "balance tests")
- Each builder: the design doc's worked example (two guests at $65, not taxable, card fee $4.07) gives host_payable 110.50, ramble_commission 19.50, processing_fees 4.07, platform_cash 125.93; a taxable variant; a refund requested then failed returns every account to its prior balance; a gift purchased then redeemed leaves `gift_liability` at exactly zero.
- A seeded property test over random event sequences (bounded length): every account balance sums to zero across the ledger, no account goes negative where the design doc implies it cannot (`refunds_pending`, `gift_liability`), and `moneyHeld` equals its three accounts.
- Db tests: a repeated cash event posts once and reports `already_posted`; a half-conflicting call throws and writes nothing; the trigger refusals; every CHECK refusal.

Out of scope
- Calling the helpers from any money path (U-049 and later wire them); orders, refunds, transfers, or gift tables; disputes; the reconciliation job and its alert (U-079b); the finance export file or page (U-080); the money-held page (U-110); the GMV and take-rate view (PRD-59, with U-088); any UI.

---

**Questions for Dave (PM recommendation first)**

- **Q1. Which rows carry `provider_object_id`.** The design doc says the unique index covers rows "where the provider ID is present", and also that a failed refund posts one `refund_reversal` row per leg. If those legs carried the refund's provider id they would collide on the index. Recommendation: the provider id is present exactly on rows that touch `platform_cash` (the cash postings rule 5 describes), enforced by a CHECK; non-cash rows point at their record through `refund_id`, `transfer_id`, and so on. Alternative: widen the index to include the account pair.
- **Q2. A `recorded_at` column.** Not in the design doc's table. Recommendation: add it (`clock_timestamp()`), because `occurred_at` is provider time and can arrive out of order, and the builder rules order records by `clock_timestamp()`. Alternative: rely on `id` order alone.
- **Q3. The insert-only role.** The app connects as one role today, so a `ledger_writer` role guards nothing until connections are split. Recommendation: ship the trigger as the real guard (it binds the owner too) and create the `NOLOGIN` role with its grants now, so the audit log (U-020) and the reporting role follow one pattern; switching connections is later work. Alternative: trigger only, role deferred to U-020.
- **Q4. SQL views or read functions.** Recommendation: read functions with lib formulas, since B2 puts formulas in `src/lib` and Drizzle view migrations churn on every change. Alternative: Postgres views (`pgView`), closer to the design doc's word "views" and usable by a future reporting role directly.
