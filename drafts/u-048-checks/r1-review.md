PASS

## review-agent: U-048 "Webhook intake" (head 05cf1a7)

Blocking: none. Ran (scratch): providerEvents, payments route, payments port, rateLimits unit tests 292 pass; `tests/db/provider-events.db.test.ts` 29 pass with `--maxWorkers=2`. Scope: 18 files inside the manifest.
Defect classes clean: bounded (body capped twice, attempts read with a limit, retries stop at 25, verified traffic rate limited); database vs Zod (`providerEventRow` null for what CHECKs refuse, answered 400; no FK on `ramble_order_id`, unknown order handled as unmatched); fails closed (bad signature 400, only `invalid_signature`/`invalid_input` treated as bad signature, provider mismatch throws, illegal transition throws); no data in logs; no blocking duplication.
Builder's calls: Q1 completing instead of throwing accepted, but nothing picks the event up again (intake dedupe makes redelivery a no-op; U-049's and U-109's scopes do not mention a drain). Q2, Q3 as the note. Lock order holds (events lock, session, hold, order), tested.
Non-blocking: stranded successes until U-049 (fix: drain in U-049 using `provider_events_unprocessed_idx`, or re-enqueue a delayed job on `confirm_unavailable` as `recordUnmatched` does); `payment-duplicate` events need a drain in U-109; `readPaymentGraceMinutes` private select duplicates the reader U-047a's settings TODO plans; events lock missing from the `locks.ts` header; `port.retrieve` inside the job transaction (matters with Stripe); unreachable `wait` case in `processProviderEvent`.
Unconfirmed: alert dedupe on key if a job runs twice after a lapsed claim; lock mutation not rerun.
