PASS

## review-agent: U-048 round 2 (head 6de1064)

Blocking: none.
Round 1 findings fixed: stranded success keeps `succeeded`, completes, re-enqueues `process-provider-event:<id>:<tries>`, counts the try, one `payment-confirm-unavailable` alert keyed `event:<id>:gave-up` at 25 and no further job; duplicates alerted once and unprocessed; grace via `readHoldSettings(tx).paymentGraceMinutes`; events lock is lock 0; `wait` case gone; `port.retrieve` in `prepare` before the transaction.
Drain and registry: absent `prepare` no behaviour change (U-005 and U-054 kinds as before; jobs db tests pass); a throw in `prepare` goes through `recordFailure`; `prepare` runs before the claim re-check, so a lapsed claim may make one read-only lookup before `lost` (harmless).
Merges: `git merge-tree --write-tree 8c93abd 3287b4e` gives `c2179a7a…` = `6de1064^{tree}`; PR diff 20 files; `lockOrderById` and `lockOrderRow` at position 4, no cycle.
Ran (scratch): unit (providerEvents, webhook route, jobs, lib/jobs) 277 pass; db `provider-events` plus jobs 86 pass with `--maxWorkers=2`; post-lock re-read mutation fails the two-handlers test; retry tests assert succeeded mark, pending retry with future `run_after`, `attempts: 1`, no alert, then a working seam confirms the order; give-up at the cap with one job.
Non-blocking: no drain-level test of `prepare` (a small test with a fake `prepare` would pin the hook).
