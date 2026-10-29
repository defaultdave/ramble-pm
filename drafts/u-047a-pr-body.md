Unit U-047a, issue #54. Critical tier, into `integration`. Built under the pattern note (`drafts/u-047a-pattern-note.md` in `ramble-pm`; Q1 to Q5 answered as recommended, DECISIONS 2026-10-29). Three rounds: round 2 passed all four checks; a focused round 3 re-checked the merge of `integration` (U-054, U-016) and the renumbered migration.

SCOPE MANIFEST
IN SCOPE: the `startPayment` Server Action and its contract and outcomes; lock order (session, hold, order); hold-derived key and live-attempt reuse; payment only against an open hold; at most 5 tries per hold through the `payment_tries` limiter; order, attempt, consent and acceptance rows; the two-transaction provider write; the order snapshots and attribution; the order token only to the hold's device; the orders foreign-key migration.
OUT OF SCOPE: the checkout page (U-047b), webhook intake (U-048), confirmOrder (U-049), gifts, Stripe, the ledger, hold upkeep, emails, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 (money rules 1 to 8, the `startPayment` contract and steps 1 to 6, Payment in flight, the capability-token amendment) and 5.2 (S6, S7, S9).

## What was built
- **`startPayment`** (`src/server/actions/checkout.ts`): parses with Zod, gets the device, calls `startCheckoutPayment` (`src/server/checkout.ts`), which spends the `payment_tries` limit, runs transaction 1, calls the provider, then runs transaction 2.
- **Transaction 1** (`src/server/db/checkout.ts` `startPaymentTx`): device checked on an unlocked read before any lock (a hold from another device answers exactly as a missing one), then session, hold and order locks (`src/server/db/locks.ts`); the amount from the hold items; one order with its items, guest, consent, acceptances and the attempt (`pay:{order}:{n}` key); a reused order keeps its money; the hold goes to `paying` with `payingUntil`.
- **Provider and transaction 2**: retrieve, find-or-create by metadata, or create, decided in `src/lib/checkout.ts` (`providerStep`, `lookupVerdict`, `storesPayment`); the provider payment id stored once under `lockAttemptRow`. A provider failure between the transactions leaves the order and attempt for the next call to reuse with the same idempotency key.
- **Decisions in `src/lib/checkout.ts`** with unit tests: `startPaymentDecision`, `attendeeIssues`, `legalIssues`, `orderSnapshot`, `newOrderReference` (3 tries on a clash), `newsletterConsent` (grant only), `storeProviderPayment`; `payingUntil` and `payingHold` in `src/lib/holds.ts`; `paymentGraceMinutes` in hold settings; `defaultCommissionRateBps` in `pricing.ts`.
- **Migration `0017_order_parent_foreign_keys`**: orders point at their hold, session, waiver and terms documents with `ON DELETE restrict`; tests that inserts with missing parents are refused. Fixtures in U-054's and U-016's tests now give orders real parents.

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): a failed transaction 2 is logged by attempt id and error name and the secret still returned (design doc step 6; the standard allows one catch, flagged for Dave); "finished" in Q1 means a hold that became an order, so a released or lapsed hold with no order answers `canRehold` from spaces left; the `payment_tries` limit counts every call, so U-047b calls `startPayment` only on the Pay step (audit BC-9).
- A stored provider payment id the provider no longer knows throws rather than creating a second payment. The fake provider keeps payments in memory (audit BC-10).

## Gates (on this head)
format:check, lint, typecheck, knip; test 5,331; test:db 1,382 with `--maxWorkers=2` (race tests: 5 rounds of twin first calls plus 20 lock-order rounds); build with no `DATABASE_URL`; db:check; e2e 160; gitleaks over the branch range (no leaks). QA through the real action on real Postgres with the fake gateway: parallel twin calls give one order, one attempt, one secret; another device's hold answers like a missing one with nothing written; the sixth call answers `too_many_tries`; a provider failure then retry creates no second payment; removing `FOR UPDATE` and forcing a new attempt each fail tests.

## Not done
- The checkout page (U-047b) and confirmation (U-049) are separate units.
- Audit items BC-9 to BC-11 in `ramble-pm` `audits/booking-checkout.md`.

## Evidence
No visible change: a Server Action, server code and a migration. QA's scenario file is in `ramble-pm` `evidence/pr/unit-U-047a-qa-agent/`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
