PASS

## review-agent: U-073 "Ops shell and audit wiring" (head d8ea7a6)

### Blocking
None.

### Non-blocking
- Delta 9f191f0..d8ea7a6 read: access rules moved into `secretPathOpen`, `mailboxAccess`, `mailboxUnlockAllowed` (src/lib/email/message.ts); unlock now takes `readOpsCaller()` (src/server/actions/mailbox.ts:21), which resolves the round 1 note that unlock used `getCaller()` directly.
- Mutation re-run in a scratch worktree (removed), each mutant killed by the unit tests: production allowed (3 failures); live mode allowed (3); no secret allowed (3); ops override removed (14); ops via mislabelled (7); unlock ignores the match (5); unlock ignores the open path (5); cookie not checked (5); ops flag forced false (11); unlock audit removed (4); list audit removed (8); message audit removed (7); unlock audit after the cookie, unawaited (1).
- Survivor: replacing `secureEqual` with `===` in `unlockMailbox` passes all tests. Timing is not unit-testable; `secureEqual` is used on both secret paths (mailbox.ts:60, :75). Not a finding.
- Carried from round 1: the production refusal keys on `VERCEL_ENV` only, so a self-hosted production build keeps the secret path open; Ramble deploys on Vercel. `holdsOpsRole` repeats `roles.includes(Role.Ops)` in src/server/db/staff.ts and sessions.ts (audit item). `disabled` vs `locked` reveals deployment state to non-ops callers (pre-existing audit item).
- Defect sweep, whole diff: unbounded work none (secret capped at 256, unlock rate-limited, one audit row per read); DB vs Zod fits the existing CHECKs (tests/db/audit.db.test.ts); fail open none; logs carry no request data. Duplication: nothing new beyond the audit item above.
- `pnpm vitest` on the 7 touched unit and component files: 183 passed.

### Unconfirmed
- tests/db/* not run here (no Postgres).
