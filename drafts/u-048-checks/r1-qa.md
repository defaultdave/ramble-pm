PASS

## qa-agent: U-048 "Webhook intake" (head 05cf1a7)

Blocking: none.
Non-blocking:
- Q1 driven for real: a success marks the attempt `succeeded`, order stays `pending_payment`, event `processed_at` null, job `succeeded`; a second drain claims 0 jobs; a redelivery answers 200 as a repeat and changes nothing. Every success is stranded until something re-enqueues it; the hold stays `paying` meanwhile.
- The post-lock `processed_at` re-read has no test: replacing it with the pre-lock read leaves all 29 db tests passing. Add a two-handlers-on-one-event test.
- 29 db tests, not 30 (cosmetic).
- Fifth failure on an order already `payment_failed` (no retry between) cancels the attempt but leaves the order `payment_failed`; the real flow is fine because U-047a moves `payment_failed` back to `pending_payment` on a retry (confirmed in U-047a's `src/lib/checkout.ts`).
- Lock order consistent; a NOWAIT test shows session and hold held while waiting for the order row.
Unconfirmed: build, db:check, db:generate, knip, e2e, the try-25 give-up alert, a real Next server not run. Ran: tsc clean, eslint on touched paths clean, unit 4415 (159 files).
Drove the real route (real Postgres, fake signing, real registry and `drainJobs`, real limiter): success 200, repeat 200 with one row and one job; failed x5 with retries between (tries 1-4 `failed_try`, order `payment_failed`, hold `active`, `paying_until` null; try 5 attempt `canceled` 5 tries, order `void`, hold `active`); `requires_action` extends `paying_until` once, repeat no change; out of order (success then earlier failure) attempt stays `succeeded`; bad, missing, tampered signature 400 nothing stored; 2 MB body and false content-length 413; exactly the 7 genuine events stored; ignored type 200 nothing stored; invalid envelope 400; unmatched 200 at intake, after 6 retries `attempts` 6, one `payment-event-unmatched` alert.
Mutations: advisory lock removed fails 1 test; dedupe as upsert fails 1; repeat enqueues fails 3; post-lock re-read removed survives.
