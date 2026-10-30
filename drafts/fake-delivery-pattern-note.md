# Fake payment delivery: pattern note (2026-10-30, e2e-money lane)

Closes audit items BC-37 and BC-38. Goes into the builder's scope manifest. The PM's calls below are taken under the autonomy rule (DECISIONS 2026-10-30, Dave can overrule).

**The gap.** After Pay the order stays `pending_payment`, for three separate reasons:
1. Nothing hands the fake's event to the webhook intake (BC-38).
2. Nothing drains the job even if it did. `/api/pulse` is only called by hand: `.github/workflows/pulse.yml` never landed (local branch `unit/U-005-pulse-workflow`), and the Actions secrets hold only `NEON_API_KEY`. BC-38 did not name this.
3. The fake keeps its objects in process memory (BC-37). An instance that is recycled or scaled out between `startPayment` and Pay no longer knows the payment, so the guest is refused. The secret part of BC-37 stops mattering once delivery is in-process: signing and checking happen in one process.

**Carrier and base.** `unit/U-045b-fake-delivery`, title `U-045b: ...`, standard tier (U-045b is standard in `units.yaml`; `confirmOrder` and the money rules do not change), PR into `main`, cut from `origin/main`. `main` and `integration` are level at `15c6130`, so `integration` no longer buys anything and going to `main` drops a promotion from the path to Monday. The STATUS prompt said `integration`; this replaces it.

## Calls

| # | Question | Call | Why, and what was rejected |
|---|---|---|---|
| 1 | Where the fake's state lives | One Postgres row, table `fake_gateway_state`, holding the whole `FakePaymentsState` as JSONB. Writes run read, lock, change, write in their own transaction; reads take no lock. | The 625-line adapter and its contract tests stay as they are: each call runs the same code on a state loaded from the row. Per-object rows mean a second adapter for a fake. Rejected: stateless tokens in the client secret (loses tries, `requires_action` rounds, and the repeat-Pay refusal). |
| 2 | How big it gets | Caps set by the gateway: `maxObjects` 2,000, `maxEvents` 10,000, about 2 MB at the limit. Past them the fake answers `provider_unavailable` as it does today. | Bounded work. The row is read on every call, so it cannot be left at the 10,000 / 100,000 defaults. All writes queue on one row lock: fine for a demo, wrong for a load test (see Limits). |
| 3 | How the event reaches the intake | In-process, right after the confirm commits: sign the event and pass a `Request` to the existing `paymentWebhookResponse`. Awaited, so a refused delivery surfaces. Every outcome is delivered: `payment.succeeded`, `payment.failed`, `payment.requires_action`. | It runs the real path: signature, budget, `recordProviderEvent`, job. Rejected: a self-`fetch` (needs a URL, and Deployment Protection blocks it on previews); writing `provider_events` directly (skips the path being proved). |
| 4 | What drains the job | `after()` runs `drainJobs(systemClock)` once delivery succeeds. A failed drain is logged, never thrown: the guest has paid and the job stays due. | Works with no pulse and no new setting. Claims use `SKIP LOCKED`, so a concurrent pulse is safe. A guest's request may run other due jobs; the drain's own caps hold (200 jobs or 60 seconds). |
| 5 | The webhook secret | Stays random per process, unchanged. No new env var. | Delivery signs and checks in one process, and client secrets are stored with the payment. The route keeps refusing anything from outside, so nobody can forge a confirmation, and Dave has no secret to add. This replaces "secret from env with a dev default" in the STATUS prompt. Cost: the webhook still cannot be driven over HTTP from outside; tests use the in-process path. |
| 6 | How the click-through is checked | Locally first: QA restarts `next start` between `startPayment` and Pay, which proves state survives losing the process. Then on production. | Preview has none of `CAPABILITY_TOKEN_SECRET`, `FORM_GUARD_SECRET`, `PULSE_SECRET`, `APP_URL`, so a preview needs four secrets from Dave and its database is not known to be seeded. Production has them, is seeded, and is what Monday shows. |

## Where things live

- **Pure:** `src/server/ports/payments/fakeState.ts`: `serializeFakeState` and `parseFakeState`. Maps become entries, `occurredAt` becomes a string and comes back a `Date`. Parsing goes through Zod and throws on a bad row (fail closed); it never repairs one.
- **Data:** table in `src/server/db/schema/payments.ts`: one row by construction (a key column with a CHECK), `state` jsonb NOT NULL, `updated_at`. Add it to the PII inventory (holds no personal data: Ramble ids, amounts, fake client secrets). `src/server/db/fakeGateway.ts`: `readFakeGatewayState()` and `withFakeGatewayState(work)` (own transaction, creates the row if missing, `FOR UPDATE`, parse, `work(state)`, write back). A thrown `PaymentsError` rolls back, so a refused call changes nothing. Never called inside another open transaction: it stands in for an outside provider (design doc rule: the provider sits between two short transactions, never inside one).
- **Gateway:** `src/server/ports/payments/gateway.ts` keeps `getFakePayments()` and `getPaymentsPort()`. Each write loads the state under the lock and runs the existing `createFakePaymentsAdapter({ state, ... })` method on it. `retrieve` and `getBalance` read with no lock. `verifyWebhook`, `signWebhook`, `signBody` touch no database, so a forged delivery costs no query. `confirm` also gives back the event it emitted. The process-global `state` goes; the process-global secret stays.
- **Delivery:** `src/server/fakePaymentDelivery.ts`: confirm, deliver, schedule the drain. `confirmFakePayment` (the action) calls it and stays a thin parse-and-call. `TODO(U-046)` marks it: Stripe delivers its own events.
- **Decisions:** anything that branches on a value lives in `src/lib` with a unit test (B2), including the rule for which response counts as delivered, if `intakeResponse` has no such helper to reuse.

## Tests

- Unit: state round trip (every map, `balanceMinor`, dates); a malformed row refused.
- Db, the fake: two gateways with different process secrets and no shared memory: create on one, retrieve and confirm on the other. Two confirms at once give one success and one `invalid_state`, one event. A refused call leaves the row byte for byte. The caps refuse with `provider_unavailable`. Locked re-check test that fails if `FOR UPDATE` is removed.
- Db, end to end, through `confirmFakePayment` with `after` run by the test: a paid order reaches `confirmed`, with the seats, ledger rows, transfer row and two email jobs U-049 writes. A second Pay is refused and adds no event. A decline delivers `payment.failed` and the guest can try again. 3-D Secure delivers `requires_action` then success. A refused delivery throws and logs only the kind. A failed drain does not fail the action.
- Existing tests that read `getFakePayments()` state move to the db project or to `createFakePaymentsAdapter` directly; no assertion weakens.

## Not in this unit

Stripe (U-046); refund and transfer execution (U-056, U-109, U-079a); the pulse workflow (`.github/`, Dave's); any Vercel setting; `.github/`, `docs/plan/`, `docs/adr/`, `.claude/`, `scripts/merge-desk/`; the production runbook items the lead holds; any change to `confirmOrder`, `processProviderEvent`, `paymentWebhookResponse`'s behaviour, or the fake's adapter rules beyond what returning the event needs.

## Limits to log in the audit file

- One row and one lock: a load test on the fake measures this row, not checkout. Any load test needs a different store first.
- If delivery fails after the confirm commits, the fake has the payment and Ramble does not: the guest sees "wait" and nothing retries. Acceptable for the demo; the row keeps the event for a manual replay.
- A demo that reaches 2,000 objects refuses payments until the row is cleared (one line in `docs/runbooks/jobs.md`).
