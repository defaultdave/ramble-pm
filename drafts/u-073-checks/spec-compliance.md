PASS

## spec-compliance: U-073 "Ops shell and audit wiring" (head d8ea7a6)

### Blocking
None.

### Non-blocking
- Delta since round 1 changes where the access rules live, not what they do; each round 1 PASS still holds. Ops nav behind the ops role (OpsAreaNav, ops/page.tsx OpsAccessDenied); no passkey or step-up; audit rows on ops access, unlock, list and message read (recordAudit before the cookie or the read); mailbox open to the ops role in every deployment; secret refused in production, live mode and with no secret (`secretPathOpen`, src/lib/email/message.ts), compared in constant time.
- Access tests per combination: src/lib/email/message.test.ts and src/server/ports/email/mailbox.test.ts; mutation re-run kills each rule.
- Delta files are within scope (message.ts, actions/mailbox.ts, ports/email/mailbox.ts and their tests); no out-of-scope files.

### Unconfirmed
- None.
