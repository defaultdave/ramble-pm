U-073 Ops shell and audit wiring (lite cut, critical tier; issue 88).

- Ops nav shell and landing behind the ops role; the nav lists only routes that exist.
- Audit rows for ops access, mailbox list, mailbox read and mailbox unlock, written before data or cookie is returned.
- Mailbox opens for the ops role, or off production only, for the existing shared-secret unlock. Production, live mode and no secret refuse the secret path. All env comparisons live in `src/lib/email/message.ts`.
- Not built (lite cut): passkeys, step-up. Axe matrix rows: U-100's matrix does not exist yet.
- Files outside the listed lane, each needed: `src/lib/email/message.ts`, `src/server/opsCaller.ts`, `tests/db/email-mailbox.db.test.ts`, `tests/db/audit.db.test.ts`, `tests/db/authz-matrix.db.test.ts`.
- Review: two rounds (architecture audit B2 findings fixed in round 2). Verdict files in ramble-pm `drafts/u-073-checks/`. The QA agent had no browser or Postgres; gaps are named in its check.
- Waits for `human-read`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
