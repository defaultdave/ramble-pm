Unit U-048, issue #56. Critical tier, into `integration`. Built under the pattern note (`drafts/u-048-pattern-note.md` in `ramble-pm`; Q1 to Q4 answered as recommended, DECISIONS 2026-10-29). Three rounds: round 2 passed all four checks; a focused round 3 re-checked the merge of `integration` (U-014b, PR 274).

SCOPE MANIFEST
IN SCOPE: raw-body signature check; `provider_events` with dedupe; per-order serial processing; the event table from design doc 4.2.3; matching by metadata; alerts through `alerts.raise` (U-007).
OUT OF SCOPE: `confirmOrder` (U-049), the duplicate-payment refund (U-109), refund, transfer and dispute processing (U-056, U-079a, U-081), the Stripe adapter (U-046), ledger postings, UI, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 (money rules 1 to 8, Payment in flight, webhook intake, "What each event does"); ADR 0003.

## What was built
- **Intake** (`src/app/api/webhooks/payments/route.ts` over `src/server/paymentWebhook.ts`): the raw body under `maxWebhookBodyLength` (413), `verifyWebhook` on it (a refused signature answers an empty 400 and logs only the kind, counted on `payment_webhook_failed`), then one transaction that inserts the event with `ON CONFLICT DO NOTHING` and enqueues one `process-provider-event` job only when the row was new. Verified traffic is rate limited on `payment_webhook`. Status codes come from one lib function, `intakeResponse`.
- **Processing** (`src/server/jobs/providerEvents.ts`, `src/server/db/providerEvents.ts`): an optional `prepare` hook on job definitions (`registry.ts`, `drain.ts`) looks an event's metadata up at the provider before the job's transaction; then the `order-events:<id>` advisory lock (new lock 0 in `locks.ts`), session, hold, and order (`lockOrderById`), a re-read of the event under the lock, and the decision from `providerEventAction` in `src/lib/providerEvents.ts`, a pure function with a table test per row of the design doc's event table.
- **Rows handled**: a success on the live attempt marks it `succeeded` and calls the `ConfirmOrder` seam (`src/server/db/confirmOrder.ts`, `TODO(U-049)`); failures count tries, move the order to `payment_failed` and reopen the hold if it has time, and the fifth cancels the attempt and voids the order; `requires_action` extends `paying_until` once; `canceled` cancels the attempt; refund, transfer and dispute events are stored and left for their units.
- **Retries and alerts** (`eventRetry`, `alertFor`): an unmatched event retries with backoff and alerts on the fifth try; a success while `confirmOrder` is unavailable keeps the `succeeded` mark, completes the job and schedules its own retry, giving up with one `payment-confirm-unavailable` alert at 25; a duplicate payment raises `payment-duplicate` once and is left for U-109.

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): the job completes rather than throws while the seam is unavailable (a throw would roll back the `succeeded` mark), and re-enqueues itself so nothing is stranded; refund, transfer and dispute events need a drain in their own units.
- Job kind `process-provider-event` (the `jobs_kind_shape` CHECK wants hyphens). Two rate-limit surfaces added (B15). U-047a's `lockOrderRow` (by booking key) and this unit's `lockOrderById` share lock position 4; U-047a's `readHoldSettings` supplies the payment grace.
- Every later money path must take the events lock first (audit BC-17).

## Gates (on this head)
format:check, lint, typecheck, knip; test 5,811; test:db 1,506 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 163; gitleaks over the branch range (no leaks). QA drove the real route and drain on real Postgres: success, five failures, `requires_action`, repeats, out-of-order delivery, bad signatures and oversized bodies; a success with the seam unavailable retries and gives up at exactly 25 with one alert, and a working seam then confirms the order; removing the events lock, the post-lock re-read, the dedupe or the retry each fails tests.

## Not done
- `confirmOrder` is a stub until U-049 (in progress, cut from this branch).
- Runbook pages for the three new alerts belong to U-099.

## Evidence
No visible change: a Route Handler, a job, server code and lib decisions. QA's route runs are in the `qa-agent` check summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
