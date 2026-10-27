## Promote integration 2026-10-26

Opened from `promote/2026-10-26`, a branch cut from `integration`, so merging it deletes only that branch (DECISIONS 2026-10-25). `integration` first received `main` in a sync PR with the conflicts resolved, so this promotion merges cleanly.

### Critical-tier units in this batch

**U-045a Payments port and fake adapter** (PR #195, issue #51, Fable builder trial)
- `PaymentsPort` (create, cancel, retrieve by ID or Ramble metadata, refund, transfer, reverse, verify webhook, balance), the normalized `ProviderEvent` for the design doc's twelve event types, a deterministic fake adapter, and a contract suite in `tests/contracts/payments-port.ts` that a Stripe adapter can run.
- Review: two rounds. Fixed: a refund lookup that ignored the object kind (a double-refund risk), no reversal lookup, unbounded fake state, and four money guards no test protected. Added a 50-cent minimum, first-response replay, a `processing` status, an `ignored` webhook result, and a failed-try cap of 5.
- QA PASS: a 3,000-step random walk kept the balance equal to charges less fees, refunds, and transfers plus reversals; 26 builder mutants and 25 reviewer mutants, all but six minor ones killed.
- No tables.

**U-006 Email port and dev mailbox** (PR #199, issue #10)
- `lib/email` with fake, Resend, and Postmark adapters; `EMAIL_MODE` (sink by default; `live` refused outside a production build that is not a Vercel preview); React Email layout; message log with suppression; delivery webhook; the in-app dev mailbox behind a shared secret until U-004a's roles.
- Review: five rounds. Fixed: decisions moved into `src/lib`; a retry after an adapter change refused; rate limits count only failed verifications and failed unlocks, per client address, so nobody can lock out the owner or starve real bounces; zero-row status writes throw; gitleaks test values and a CodeQL alert cleared; the database client made lazy so CI builds with no database.
- QA PASS on a production build: sink and previews cannot send; tampered cookies refused; the sandboxed preview runs no script; suppression after a permanent bounce; the database refuses every bad row.
- **Shared code changed:** `src/server/db/client.ts` (U-003's) is now lazy: the pool is created on first use (PM authorization, DECISIONS and delta-log 2026-10-26). A focused review passed it.
- Migration `0004_email_message_log`.

### Also in the diff
- The sync merge from `main` (PR #200: U-007, U-008a, U-027, U-008b, already on `main`), with conflicts resolved in `.env.example`, `playwright.config.ts`, `src/server/env.ts`, its test, and the lockfile.

### Not yet available
- No overnight race or access suites exist yet; nothing to report for them.

### After merging
- Production database: run the `db-migrate-production` workflow before promoting any deployment that reads it. `main` now carries migrations `0003_rate_limits` and `0004_email_message_log` on top of the catalog's. No production page reads the database yet.
- U-045b (fake payment UI) can start: it needed U-045a in `main`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
