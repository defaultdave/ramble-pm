PASS

## qa-agent: U-048 round 2 (head 6de1064)

Blocking: none.
Stranded success fixed, driven on the real route and drain: signed success while the seam is unavailable gives 200; drain claimed 1 succeeded 1; attempt `succeeded`, order `pending_payment`, hold `paying`, event `processed_at` null, `attempts` 1, `last_error` "Order confirmation is not available yet"; jobs one `...:0` succeeded and one pending `process-provider-event:<id>:1` with future `run_after`; a second drain claims 0; redelivery 200 with the same two job rows; forcing the retry due 30 times stops `attempts` at 25 with no job left and one `payment-confirm-unavailable` alert keyed `event:<id>:gave-up`. A working seam through a custom registry confirms the order and sets `processed_at`, no alert. Two-handlers test fails without the re-read. 33 tests in the provider-events db file.
Round 1 behaviour held: failed x5 (tries 1-4 `failed_try`, order `payment_failed`, hold `active`; try 5 attempt `canceled`, order `void`); `requires_action` extends `paying_until` by the grace; bad signature 400; 2 MB and false content-length 413.
Mutations, all killed: events lock removed; post-lock re-read removed; dedupe as upsert; repeat enqueues; retry enqueue removed (5 tests); confirm-unavailable throws (3 tests).
Drain and registry safe (`prepare` only when defined; `noop`, `guest-confirmation`, `host-booking-notice` unchanged; payload not logged). Full db 1440 (29 files) with `--maxWorkers=2`; unit on touched areas 700 (20 files); tsc clean. `lockOrderRow` and `lockOrderById` both at lock 4, same order, no cycle. `git merge-tree --write-tree 8c93abd 3287b4e` gives `c2179a7a7506c0c521705ba62d76dd8f8ad61df8` = 6de1064's tree.
Non-blocking: after 25 tries a success stays unconfirmed with one alert as the only signal (U-049 or an operator); tests setting `run_after = now()` could flake on DB-versus-host clock skew (passed in all runs).
