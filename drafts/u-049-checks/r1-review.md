PASS

## review-agent: U-049 "confirmOrder" (head 81b8171)

Blocking: none.
Non-blocking: an order already `cancelled` or `refunded_after_lapse` makes `confirmDecision` throw RangeError on a late success, so the event retries quietly until U-048's give-up cap alerts (fails closed; U-109 or U-056 decide); call 9 invalidation inside the transaction costs at most a refetch; call 1 `released -> converted` consistent (rule 3 holds, `converted` terminal, the released-hold db test clears `released_reason` and `superseded_by`); calls 2-8, 10-11 consistent (`isSeatsSoldRefusal` matches only `sessions_seats_sold_within_allocation`; shared `postProviderFee`; `NotBuiltError` names U-062a, U-064a, U-065a; U-086's scope includes `booking_confirmed`). No missed reuse; `bookingEmailKey` removes a duplicated format. Scope 22 files; U-048 edits forced; `processProviderEvent` untouched; no migration. No logging added; alert payload ids, amounts, currency only.
Ran (scratch): `confirm-order` and `provider-events` db 55 of 55 with `--maxWorkers=2`; unit `src/lib` 4278 pass; typecheck clean. Mutations: seat-count update removed fails 8 db tests; already-confirmed stop removed fails 9.
