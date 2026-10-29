PASS

## qa-agent: U-016 round 2 (head fbcd5c8)

Scratch copy (removed after); nothing written to the repo or any worktree.
Gates: unit plus components 4980 (201 files); db with `--maxWorkers=2` 1278 (22 files), no 53300; typecheck, knip, prettier, db:check, eslint clean; db:generate no changes. `next build` not run.
Pairs: all 23 types, 25 tuples match the design doc postings table and worked example; script check: the lib map's 25 tuples equal the CHECK's and the 0014 snapshot's as sorted sets. Journal chain 0013 (identical to integration) to 0014 to 0015; 0015 header fixed. Delta 12 files in scope.
Probes (real Postgres, scratch): raw-SQL sweep as table owner, 23 types x 72 ordered account pairs (1656 rows): the 25 allowed accepted, the other 1631 each refused by `ledger_entries_entry_type_accounts` (23514), including `charge_commission` debiting `ramble_payouts`; wrong-type refund leg refused. Append-only as owner: UPDATE, DELETE, TRUNCATE, TRUNCATE CASCADE refused 23001. Repeated cash event `posted` then `already_posted`. Worked example as deltas: after payment and fee platform_cash +12593, host_payable +11050, ramble_commission +1950, processing_fees +407, money held +11050; after the transfer platform_cash +1543, host_payable +0, money held +0; export gross 13000, commission 1950, fee 407, paid 11050, owed 0, simulated true; host owner reads the statement.
Mutations: CHECK dropped: 2 db tests fail. Lib map swapped (`charge_commission` to platform_cash/host_payable): property tests fail on seeds 1-20 onward, 5 postEntries and the views tests fail; the table-driven test alone iterates the map and would not notice. Restored: 301 of 301 unit, 66 of 66 db on `ledger*`.
