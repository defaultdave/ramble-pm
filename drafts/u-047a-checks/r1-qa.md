PASS

## qa-agent: U-047a "startPayment action" (head 81240e4)

Blocking: none. Non-blocking: no builder evidence folder (no UI; QA added test output); e2e not run by QA.
Gates (scratch copy): head tree equals 9174800 tree (a3b562d5cfb2231057b950affcd0e797df998a94); typecheck, lint, format:check, knip clean; unit 4853 (201 files); db with `--maxWorkers=2` 1288 (23 files), no 53300; db:check clean; db:generate no changes; migration 0014 `0014_order_parent_foreign_keys.sql`. Build not run.
Scenarios through `startPayment`, real Postgres plus fake gateway, 8 of 8: fresh hold (one order, one attempt, hold `paying` with `payingUntil`, `pay_` secret); same call twice in parallel, 3 rounds (one order, one attempt, same orderId and secret); hold from another device answers exactly as a missing hold (`hold_expired, canRehold false, spacesLeft 0`), nothing written, provider not called, hold `active`; expired hold `hold_expired`, nothing written; sixth call `too_many_tries`, no rows; provider created the payment but threw, order and attempt stayed, retry `requires_payment` with no second `createPayment`, id stored.
Mutations: reuse forced to always create: 5 of 8 fail. `FOR UPDATE` removed from session, hold, order lockers: 2 of 8 fail (a single parallel round does not always catch it; the builder's multi-round race tests are the right guard). Restored.
Evidence: `evidence/pr/unit-U-047a-qa-agent/qa-agent-startpayment.db.test.ts`, `qa-agent-run.txt`.
