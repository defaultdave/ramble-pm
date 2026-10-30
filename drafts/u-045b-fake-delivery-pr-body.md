Unit U-045b (carrier, DECISIONS and delta-log 2026-10-30). Standard tier, into `main`. Closes audit items BC-37 and BC-38: after Pay on the fake gateway the order reaches confirmed in the running app, with no hand-called webhook or pulse, and a payment survives losing the server process that started it. `confirmOrder`, `processProviderEvent` and the money rules are unchanged. Review round 1: all four checks failed on small items, including two QA finds (a forged webhook answered 500 after a Pay; decline then success landed on a stale page). Round 2 fixed them and all four passed.

SCOPE MANIFEST
IN SCOPE: the `fake_gateway_state` table and migration, in the PII inventory; `src/server/ports/payments/fakeState.ts`; `src/server/db/fakeGateway.ts`; `gateway.ts` on the durable state with caps; `confirm` giving back its event; `src/server/fakePaymentDelivery.ts`; `confirmFakePayment` calling it; tests; `docs/runbooks/jobs.md`; PM additions: the checkout Sentry guard stopping at `'use server'` modules, shared limits in `src/lib`, exported port schemas and `signatureHeader`.
OUT OF SCOPE: `confirmOrder`, `processProviderEvent`, the behaviour of `paymentWebhookResponse`, any new env var, Stripe, refund and transfer execution, the pulse workflow, `.github/`, `.claude/`, `docs/plan/`, `docs/adr/`, `scripts/merge-desk/`, any UI change.

## What was built
- **State in Postgres:** one `fake_gateway_state` row holds the fake's whole state as JSONB. Writes lock it in their own transaction and run the existing adapter on it; reads take no lock; a refused call rolls back. Caps of 2,000 objects and 10,000 events, and 8 MiB in the database. A damaged row stops every call and is left alone.
- **Delivery:** after the confirm commits, the event is signed and passed in-process to `paymentWebhookResponse`, so it takes the real path (signature, budget, stored event, job). Every outcome is delivered: success, decline, 3-D Secure. A refused delivery throws and the guest is told to wait.
- **Drain:** the Pay reply waits for the job drain up to 5 seconds, then `after()` carries it on and reports a failure. No pulse is needed. The drain's clock runs 5 seconds ahead so a slightly fast database clock cannot leave the new job not due.
- **Secret:** still random per process, with no new setting. The webhook route keeps refusing anything from outside.

## Gates
format:check, lint, typecheck, knip; test 6,448; test:db 1,595 with `--maxWorkers=2`; build without `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 161; gitleaks clean. These ran at `1d95c81`, before a clean merge of `main` (home page files). QA on a seeded production build at `caeeb60`: decline then success, a restart between Continue and Pay, forged webhooks before and after a Pay (400, nothing written), double tap, 3-D Secure, a wallet, a failed and a hung drain (the reply came within 5 seconds and the job stayed due), no Sentry script on checkout.

## Not done
- Production needs migration `0019`, then a redeploy. Both are Dave's.
- The pulse workflow is still unlanded, so a job that retries or is delayed waits for the next payment's drain.
- Logged as limits: one row and one lock (BC-44), a delivery that fails after the confirm (BC-45), the same stale-page race under Stripe (BC-46), a failed drain's unredacted log line (BC-47), seeded hosts with no notification address (BC-48).

## Evidence
![Before: the order stuck on Checking your payment after Pay, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/pay-stuck-checking-390-light-before.png)
![After: You're booked with no pulse, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/pay-booked-390-light-after.png)
![After: You're booked, 1280 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/pay-booked-1280-light-after.png)
![After: Pay on the old page after a server restart](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-restart-forged-first-booked-1280-light-after.png)
![After: decline then success lands on You're booked](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-decline-then-booked-1280-light-after.png)
![After: a hung drain releases the reply at 5 seconds](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-drain-hang-checking-390-light-after.png)

Verdicts: `drafts/u-045b-fake-delivery-checks/` in `ramble-pm`. Design: `drafts/fake-delivery-pattern-note.md` there.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
