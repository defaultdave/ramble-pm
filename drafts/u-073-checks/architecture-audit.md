PASS

## architecture-audit: U-073 "Ops shell and audit wiring" (head d8ea7a6)

### Blocking
None.

### Non-blocking
- Round 1 findings fixed. Unlock decision: `mailboxUnlockAllowed` (src/lib/email/message.ts) owns "secret path open and secret matched"; mailbox.ts:73-77 passes raw flags and the `secureEqual` result. VERCEL_ENV and EMAIL_MODE: mailbox.ts:42-43 pass the raw values; `secretPathOpen` in src/lib derives production and live mode. No `=== 'production'` or `=== 'live'` remains in the data layer. Mutation check (scratch worktree, removed) confirms the lib tests own these rules.
- Every B2 site in the whole diff (data layer, route handlers, actions), none is a domain decision: mailbox.ts:44 `secret !== null` (presence flag passed to lib); :56-60 cookie presence and `secureEqual` (builds the `cookieMatches` flag; the lib decides); :75 `secret !== null && secureEqual(...)` (same, the `secretMatches` flag); :77 `secret === null` (type narrowing after the lib said allowed); :88 and :102 `status !== 'open'` (branch on a lib result); :103 `z.uuid().safeParse` (parse, pre-existing, audit item); :105 `!message` (null check). db/audit.ts `requireRole` (B6 auth check). opsCaller.ts catch returns anonymous (fails closed, logs via `rethrowOrLog`). Route handlers: none in the diff; pages branch only on `holdsOpsRole` (lib) and lib results. actions/mailbox.ts `failures.allowed` ternary and `NODE_ENV === 'production'` cookie flag are pre-existing action-layer code, not data layer (audit item).
- B3 to B5, B7, B8, B9, B14, B15: clean.

### Unconfirmed
- None.
