PASS (gaps named: e2e, Storybook, db tests and the browser were not run by the QA agent; no test file covers src/server/actions/hosts.ts)

## qa-agent: U-074a "Host setup" lite cut (head 1ce3526)

### Blocking
None.

### Non-blocking
- Ran in a scratch worktree at 1ce3526 (removed after): vitest on src/lib/hostSetup.test.ts, src/lib/hostAudit.test.ts, src/lib/email (including hostInvite.test.ts), src/server/ports/email/hostInviteRender.test.ts, src/lib/opsNav.test.ts, src/components/HostSetup: 13 files, 346 tests, all pass.
- Scope against the lite cut in drafts/mvp-replan-2026-11-10.md (no payout account; one acceptance against the current legal version; owner sign-in-link invite; /ops/hosts index and detail): the diff has host create and edit, owner role grant and invite (with resend), one acceptance, /ops/hosts, /ops/hosts/new, /ops/hosts/[id], and host audit rows (src/lib/hostAudit.ts, db/audit.ts). No payout code seen in the file list. Scope matches by file list and unit tests only, not by use.
- Gaps: e2e, Storybook (HostSetup.stories.tsx exists, not opened), db tests (tests/db/host-setup.db.test.ts, 769 lines, and the authz-matrix change) and the browser were not run by this agent. The server actions in src/server/actions/hosts.ts have no unit test file; their ops-role gate (redirect to /ops/hosts for a caller without the role) and the DB-layer requireOpsUserId check are covered only if the db tests run.
- Typecheck in the scratch worktree reported only `Cannot find name 'PageProps'` in the ops pages, including the existing U-073 mailbox pages. That is the Next generated route types missing in a fresh worktree, not a finding against this unit. Typecheck was not otherwise confirmed clean.
- Migration 0030_host_record_limits.sql (new CHECK limits on the host record) was not applied; no Postgres here.
- Evidence: no before/after files in evidence/pr for U-074a and none added by this agent (no browser). The PM should capture /ops/hosts, the new-host form with an invalid submit, the host detail with the invite and acceptance notices, and the denied view.

### Unconfirmed
- tests/db/host-setup.db.test.ts and tests/db/authz-matrix.db.test.ts results, migration 0030 on a real database.
- The owner invite email delivery and sign-in (the replan notes the invite is only testable end to end once U-067 lands).
- The three /ops/hosts pages and the HostSetup story in a browser, and the U-100 axe matrix rows the unit scope says it adds.
