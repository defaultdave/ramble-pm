PASS (e2e, storybook, db tests and the browser were not run by the QA agent)

## qa-agent: U-073 "Ops shell and audit wiring" (head d8ea7a6)

### Blocking
None.

### Non-blocking
- Ran in a scratch worktree at d8ea7a6 (removed after): vitest on src/lib/email/message.test.ts, src/server/ports/email/mailbox.test.ts, src/server/actions/mailbox.test.ts, src/lib/opsAudit.test.ts, src/lib/opsNav.test.ts, src/server/opsCaller.test.ts, src/components/OpsShell: 7 files, 183 tests, all pass.
- Gaps: e2e, Storybook, db tests (tests/db/audit, authz-matrix, email-mailbox) and the browser were not run by this agent.
- Evidence: no before/after files in evidence/pr for U-073 and none added by this agent (no browser). The PM should capture the /ops landing, the denied view, and the mailbox page.

### Unconfirmed
- tests/db/*, the OpsShell story, and the nav in a browser.
