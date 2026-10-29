PASS

## qa-agent: U-047a round 3 (head 59fa24b)

Blocking: none.
Full db suite on the scratch copy, each file migrating 0000 to 0017 (18 migrations): 26 files, 1382 pass with `--maxWorkers=2`, no 53300.
Scenarios: the 8 scenarios plus `checkout-races.db.test.ts` (18 tests) pass on real Postgres with the fake gateway, rerun alone after the full suite.
Foreign key: an order insert pointing at a missing hold is refused by `orders_hold_id_holds_id_fk`; snapshot lists the four orders FKs, each ON DELETE restrict; the other three refusal tests pass.
Merge integrity: U-047a files identical to eb30c2b apart from 0017 files, journal and three fixtures; 0017 byte-identical to old 0014; 0017 `prevId` 45aafded (0016); journal only adds 0017; U-054 and U-016 files differ only in the three fixtures; fixtures weaken no assertion; ledger and booking-email tests pass in the full run.
Evidence: `evidence/pr/unit-U-047a-qa-agent/qa-agent-startpayment.db.test.ts`, rerun on 59fa24b.
