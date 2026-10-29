PASS

## qa-agent: U-016 round 3 (head 9c13d24)

Merge check: parents fbcd5c8 and 3aab384; `git diff 3aab384 9c13d24` and the PR diff list only U-016's 17 files (every U-054 file as on integration); U-016 sources byte-identical to fbcd5c8; `0015_ledger.sql` equals the old 0014; `0016_ledger_guards.sql` header only; `privacy.ts` union; `ledger.test.ts` only the new test; journal 0013 to 0016 with increasing `when`; snapshots chain; 0015 and 0016 canonically equal apart from ids; 0015 carries `notification_email` and the ledger tables.
New test: 25 triples match design doc 4.2.3; mutating `charge_commission` in the map to platform_cash/host_payable fails it.
Gates on a fresh database from zero (all 17 migrations, `__drizzle_migrations` 17): full db suite with `--maxWorkers=2` 1306 (23 files), no 53300; `tests/db/ledger*` 66 of 66; `src/lib/ledger*` 302 of 302; db:check, tsc clean.
Probes: raw-SQL sweep as owner, 1656 rows: exactly the 25 allowed accepted, 1631 refused 23514 by `ledger_entries_entry_type_accounts`, no other error. Append-only: UPDATE, DELETE, TRUNCATE, TRUNCATE CASCADE refused 23001; 25 rows remain.
