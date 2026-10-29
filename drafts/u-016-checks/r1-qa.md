PASS

## qa-agent: U-016 "Ledger and its views" (head 1d6ed20)

Scratch copy of 1d6ed20; nothing written to the repo or any worktree.

Gates: unit 4929 (201 files); db with `--maxWorkers=2` 1272 (22 files); build, typecheck, lint, knip, db:check ok; db:generate "No schema changes".

Real-database probes (own test, scratch only):
- Append-only as table owner: UPDATE, DELETE, TRUNCATE, TRUNCATE CASCADE each refused 23001 "The ledger is append-only"; row kept.
- Repeated cash event: `posted` 3 rows, then `already_posted`, 3 rows total.
- Half-conflicting event: throws "Half-posted ledger event: 2 of 3 rows were new"; count unchanged, also when the caller catches inside its own transaction.
- CHECK refusals: `accounts_differ`, `amount_in_range` (zero, negative, over cap), `currency_usd`, `names_a_subject`, `provider_id_on_cash` (both ways), `provider_id_text`.
- Allowed: a gift alone; a `ramble_payout` with no subject.
- Design doc worked example (two guests at $65, fee $4.07) through `bookingPaid`, `cardFee`, `transferPaid`: after payment and fee platform_cash +12593, host_payable +11050, ramble_commission +1950, processing_fees +407, money held 11050; after the 11050 transfer platform_cash +1543, host_payable 0, money held 0; finance export gross 13000, commission 1950, fee 407, paid 11050, owed 0, simulated true; host statement read ok for the host owner.

Mutations: both triggers dropped from 0015: 3 tests fail. Partial unique index dropped from 0014: 10 tests fail (mostly ON CONFLICT with no arbiter). Restored, 58 of 58.

Judgement on the pairing gap: acceptable to QA (builders and the 150-seed property test cover it); not probed in the database.
Nit: `0015_ledger_guards.sql` header says "apart from 0013"; now 0014.
