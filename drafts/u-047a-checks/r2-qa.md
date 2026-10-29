PASS

## qa-agent: U-047a round 2 (head eb30c2b)

Blocking: none. e2e and build not run; no evidence folder from the builder (no UI).
Gates (scratch copy): unit 4863 (202 files); db with `--maxWorkers=2` 1288 (23 files), no 53300; typecheck, lint, format:check, knip, db:check clean.
Scenarios: the 8 round 1 scenarios unchanged through `startPayment` (entry point `@/server/actions/checkout` unchanged), all pass on real Postgres with the fake gateway (fresh hold; parallel twins 3 rounds one order, one attempt, same secret; other device like a missing hold; expired; sixth call `too_many_tries`; provider failure then retry, no second `createPayment`); plus the builder's `checkout-races.db.test.ts`, 17 in total pass. Behaviour unchanged by the move.
Mutations (restored): `providerStep` always `create`: 1 of 8 fails (retry scenario; the fake's idempotency key makes a repeat create harmless in the twin scenarios). `FOR UPDATE` removed from session, hold, order lockers: 3 of 8 fail on two runs, 2 of 8 on the third; the multi-round race tests are the guard. Non-gating probe: the `latestAttempt` in-flight branch disabled, 8 of 8 still pass (covered by the builder's db and unit tests; unchanged by the delta).
Evidence: `evidence/pr/unit-U-047a-qa-agent/qa-agent-startpayment.db.test.ts`.
