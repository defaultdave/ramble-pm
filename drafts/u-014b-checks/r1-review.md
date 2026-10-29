PASS

## review-agent: U-014b "Hold rules and upkeep" (head 5494e6f)

Blocking: none.
- Scope: 25 files inside U-014b; runbook and privacy text match behaviour.
- Unbounded work capped everywhere (supersede `limit(7)` + `requireAtMost(6)`; open holds `limit(6 + superseded)`, extra rows cannot change the answer; lapse scan `limit(101)` throws past 100; cleanup 100 x 20 within 60 s; spaces-left `limit(maxAllocation + 1)` with `requireBoundedHolds`).
- Database vs Zod: `holds_paying_until_not_before_expiry` makes the lapse pre-filter complete for paying holds; the zeros hash passes the pattern CHECK; indexes in migration and snapshot.
- Fails closed: block, seat limit, supersede; a refusal returns before insert and supersede.
- No new logging. B2 decisions in `src/lib/holds.ts`; SQL is a pre-filter only, lib decides again.
- Block window edge: a retry exactly at `until` sees two deadlines and goes through; a deadline equal to `at` counts as a lapse (matches `isOpenHold`).
- Lock order device, address, session, hold; no cycle; header updated.
- No duplication found; `runBatches` shared; ticket mentions only TODO(U-040), TODO(U-106), TODO(U-086).
- `updateTag` in `reserveSpaces`, `releaseHold`, `updateSessionAllocation` throws outside a Server Action: after commit the hold exists but the guest sees an error. Documented, follows `editorial.ts`, no non-action caller today; U-041 and U-047 must call them only from Server Actions.
Unconfirmed: e2e and build not run; runbook says the cached count lives "a few seconds" but the profile (`stale: 5, revalidate: 8, expire: 60`) can serve a stale count for about 60 s (display only; the reserve recomputes under lock).
Ran (scratch): typecheck, lint clean; unit 4365 (158 files; builder reports 4740 in 200 files including components); db `hold-rules`, `holds-races`, `holds`, `pulse`, `sessions` 281 pass. Mutation: address lock removed fails exactly 1 test ("takes the address lock before the session row").
