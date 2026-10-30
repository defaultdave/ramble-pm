PASS

## qa-agent: U-049 "confirmOrder" (head 81b8171)

Blocking: none.
Non-blocking: invalidation inside the caller's transaction (one extra refresh on rollback); the design doc says the CHECK-refusal refund path runs "in a new transaction", the build uses a savepoint and calls the seam in the caller's transaction (matches the note; U-109 to confirm); `released -> converted` consistent with design doc line 365.
Unconfirmed: e2e, build, knip, lint not run; one-alert-per-order shown across a mismatch, a re-post and two drains, not many retries.
Ran (scratch, removed): `confirm-order` and `provider-events` db 55 pass; unit `confirmOrder`, `holds`, `ledger` 378 pass; own `qa049.db.test.ts` through the real webhook route and `drainJobs` with the refund seam unmocked, 3 pass:
- Happy path (sold 3, hold 2): seats 5, hold `converted`, order `confirmed` with `confirmed_at`; `manage_token_hash` = `hashToken(capabilityToken('manage', id, 1))`; ledger `charge_host_share` 11050, `charge_commission` 1950, `processing_fee` 407, all simulated with the provider payment id; cash 13000 - 407, host payable 11050 (worked example to the cent); one scheduled transfer, null amount, `release_after` session end + 24 h exactly; jobs `guest-confirmation:<id>`, `host-booking-notice:<id>`; dev mailbox has the guest email (pat@example.com) and the host email.
- Replay twice more: every row identical, no alert.
- Lapsed hold with room (allocation 6, sold 4): confirmed, seats 6. Without room (sold 5): seam `unavailable`, order `pending_payment`, seats 5, no ledger, transfer or jobs, event unprocessed `attempts` 1 retrying, no alert.
- Amount mismatch (12900 against 13000): exactly one `payment-amount-mismatch` keyed `order:<id>`, reason `amount_mismatch`, order `pending_payment`, no ledger, event retrying.
Mutations (restored, 58/58 green after): session lock removed from `lockOrderRows` fails 3; already-confirmed stop removed fails 3; seat-count update a no-op fails 8 builder tests and 2 of QA's.
