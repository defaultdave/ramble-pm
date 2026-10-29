PASS

## architecture-audit: U-047a round 3 (head 59fa24b)

Static git checks.
- Round 2 holds: the PR diff `50d84cc...59fa24b` touches the same `src/` files as at eb30c2b, with no product-code change against eb30c2b; the merge added only U-054's and U-016's files (not in the PR diff).
- No new blocking: B3 to B13 unchanged (no product code moved); B7 no new test-only exports; fixtures are test support under `tests/`.
- `0017_order_parent_foreign_keys.sql` byte-identical to the old 0014; journal ends 0014_host_notification_email, 0015_ledger, 0016_ledger_guards, 0017_order_parent_foreign_keys.
- Fixtures: `ledgerParents.ts` and `bookingEmails.db.test.ts` use `insertHold` and the parents' session and terms ids instead of random UUIDs, other columns unchanged; `orderParents.ts` document renamed `waiver-parents-<tag>`; no assertion weakened (U-054 and U-016 test bodies not read).
Advisory carried: nested ternary in `providerPayment`; B13 `rememberPayment` catch kept by PM ruling, flagged for Dave.
