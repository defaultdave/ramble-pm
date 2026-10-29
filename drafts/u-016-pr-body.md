Unit U-016, issue #22. Critical tier, into `integration`. Built under the pattern note (`drafts/u-016-pattern-note.md` in `ramble-pm`; Q1 to Q4 answered as recommended, DECISIONS 2026-10-29). Three rounds: round 2 passed all four checks; a focused round 3 re-checked the merge of `integration` (U-054, PR 268) and the renumbered migrations.

SCOPE MANIFEST
IN SCOPE: `ledger_entries` with debit and credit accounts; insert-only role and append-only trigger; unique cash posting index; posting helpers per entry type; read functions for host statement, finance export, money held, reconciliation; balance tests.
OUT OF SCOPE: calling the helpers from any money path, orders, refunds, transfers or gift tables, disputes, the reconciliation job, export file or page, money-held page, GMV, UI, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 "Ledger" (accounts, postings table, worked example) and money rules 1 to 8.

## What was built
- **`ledger_entries`** (`src/server/db/schema/ledger.ts`, migration `0015_ledger`): minor units, USD only, amount in range, accounts differ, at least one of order, gift or host (a `ramble_payout` excepted), a provider id exactly on `platform_cash` rows, and `ledger_entries_entry_type_accounts`: each entry type may move money only between the accounts the design doc's postings table gives it (25 pairs, generated from the same map as the Zod rule, so they cannot drift).
- **Append-only** (`0016_ledger_guards`): a trigger refuses UPDATE, DELETE and TRUNCATE, including for the table owner; a NOLOGIN `ledger_writer` role with INSERT and SELECT only.
- **Cash idempotency**: a partial unique index on provider id and entry type for cash rows; a repeat event answers `already_posted`, a half-conflicting event throws and writes nothing (savepoint).
- **Posting builders** in `src/lib/ledger.ts`, one per event in the postings table, and `postEntries` in `src/server/db/ledger.ts` (`TODO(U-049): first caller, confirmOrder`).
- **Reads**: host statement (host owner only, uniform refusal), finance export, money held, reconciliation; half-open windows; over 20,000 groups throws rather than return partial totals (`assertWithinReadCap` in lib).

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): `ramble_payout` needs no order, gift or host; `memo` never holds personal data (the table is append-only); an event is all cash rows or all non-cash rows, at most 3 rows; `postEntries` takes no `Caller` (a system money path; audit item BC-15 asks for the standard to say so).
- Non-cash events are idempotent only through the caller's locked state check; each caller unit needs a retry-posts-once test (audit BC-12).

## Gates (on this head)
format:check, lint, typecheck, knip; test 5,140; test:db 1,306 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; gitleaks over the branch range (no leaks). QA: as table owner, a raw-SQL sweep of 23 types by 72 account pairs accepted exactly the 25 allowed and refused 1,631 by the pairing CHECK; UPDATE, DELETE, TRUNCATE refused; the design doc's worked example (two guests at $65, fee $4.07) posts to the cent (platform_cash 125.93, host_payable 110.50, then 0 after the transfer); mutations of the CHECK, the map, the triggers and the unique index each fail tests.

## Not done
- No caller posts yet; U-049 is first.
- Audit items BC-12 to BC-15 in `ramble-pm` `audits/booking-checkout.md`.

## Evidence
No visible change: a table, server code and read functions. QA's probes are in the `qa-agent` check summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
