FAIL

## Architecture Audit: U-074a (Host setup): REQUEST_CHANGES

Diff: `git diff origin/main...HEAD` at head 1ce35268d7cca555296eadadd91a9213f8b8952b (worktree agent-a6d8ea090fca6ede8).
Rules: `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a6d8ea090fca6ede8/.claude/standards/architecture.md` (project; replaces the default). Exemptions in force: B15 for /api/auth/*, B6 for identity reads, B8 for the sign-in island.
Files audited: all 38 changed files; in-scope: `src/lib/hostSetup.ts`, `src/lib/hostAudit.ts`, `src/lib/email/hostInvite.ts`, `src/lib/email/templates.ts`, `src/lib/opsNav.ts`, `src/lib/tableQuery.ts`, `src/server/hostInvite.ts`, `src/server/actions/hosts.ts`, `src/server/db/hostSetup.ts`, `src/server/db/legal.ts`, `src/server/db/audit.ts`, `src/server/db/schema/catalog.ts`, `src/server/ports/email/templates/HostInvite.tsx`, `src/server/ports/email/render.tsx`, `src/components/HostSetup/*` (tsx, module.css), `src/components/DataTable/DataTable.tsx`, `src/components/StatusBadge/StatusBadge.tsx`, `src/app/(ops)/ops/hosts/**`. Tests read for B7 and B11 only.

Known failure class (B2) checked first: the pure decisions (state, outcomes, labels, notices, field parsing, owner rows) live in `src/lib/hostSetup.ts` and are unit-tested. Two decisions escaped that: see B2-a and B2-b below.

### Blocking Issues

- **B2-a** `src/components/HostSetup/HostDetailView.tsx:34-37`: the component body derives the acceptance state (`hostAcceptanceState` fed by `acceptances.map(...)`), a second copy of the logic `buildHostListRows` already runs in `src/lib/hostSetup.ts:271`. Fix: add an `acceptance` field to `HostDetail` in `buildHostDetail` (lib) and read it in the component.

- **B2-b** `src/server/db/hostSetup.ts:97-99`: `if (outcome === 'stale' || outcome === 'no_current_document') throw new AgreementRefusal(outcome);` decides which agreement outcomes refuse the whole setup inside a data-layer function, with no unit test. Fix: a lib function (for example `agreementRefusal(outcome): 'stale' | 'no_current_document' | null`) next to `decideHostAcceptance`, tested in `src/lib/hostSetup.test.ts`.

- **B2 / B17** `src/server/hostInvite.ts:66`: `new URL(env.APP_URL).origin` is a parse of an environment value inside a data-layer function, and it duplicates the non-exported `const appOrigin = () => new URL(env.APP_URL).origin;` at `src/server/auth/forms.ts:22`. Fix: export that one helper (or move it to `src/server/env` or the auth wrapper) and import it here.

- **B11 (judged a boundary violation)** `src/server/hostInvite.ts:30-43`, `mintSignInToken`. The literal B11 text is not triggered: the file imports no vendor SDK and reaches Better Auth only through the wrapper's `getAuth` (`src/server/auth/auth.ts`). The hand-minted token is still a leak through the wrapper door. The file reaches into Better Auth's undocumented `$context.internalAdapter`, writes a verification row under the plugin's private key scheme (`magic-link:` plus the custom hash from `hashSignInToken`), and reproduces the plugin's token alphabet and length (lines 18-20). That is the plugin's storage format, copied outside `src/server/auth/`, so a Better Auth upgrade or a change to the plugin's verify step breaks sign-in for invited owners with no compile-time signal. The `node:crypto` random source is fine by itself; the problem is the storage format, not the RNG. Fix: move the mint into the wrapper (for example `src/server/auth/signInLink.ts` exporting `createSignInLinkToken(email): Promise<string>`, tested beside `signInToken.test.ts`), and keep `src/server/hostInvite.ts` to orchestration. Note: `src/server/auth/auth.ts:77-80` already hands the plugin `storeToken: custom-hasher` with `hashSignInToken`, so the wrapper is the natural owner.

- **B9** `src/server/hostInvite.ts:61-68`: one logical change writes two rows and sends an email with no single transaction. The audit row is written in its own transaction by `recordAudit` (line 61), the verification row goes through Better Auth's adapter on its own connection (line 62, inside `mintSignInToken`), and the email is sent inline by `sendEmail` (lines 63-68) rather than through `enqueue`, which `src/server/actions/contact.ts` uses. An audit row can therefore say `host.owner_invited` when the send then fails, and the caller maps that to `invite_failed`. The rule can be met only if the verification write joins the audit transaction, which needs Better Auth's adapter to accept a transaction (or a direct Drizzle write to `authVerifications`, which re-creates the leak above). Dave should decide: fix by moving the mint into the wrapper with transaction support, or record an explicit waiver for the audit-before-send ordering that the comment at lines 46-48 already describes. The inline send itself has precedent: `src/server/auth/auth.ts:80-96` sends single-use sign-in links inline too.

### Advisory

- `src/server/actions/hosts.ts:46-51`: `createHostAction` sequences two data-layer calls (`createHost`, then `inviteHostOwner`) and picks the notice. The layer table says an action calls one data-layer function. Consider one server function that does create-then-invite, so the action only parses and redirects. The commit-before-invite order itself is correct (it is what gives `created_invite_failed`).
- `src/server/db/hostSetup.ts:166-168` (`readHostsForOps`): a cursor naming a host that was deleted since the last page makes the subquery return no row, so the page is silently empty instead of restarting. Not an error swallow, but worth a test.
- `src/server/db/hostSetup.ts:75-78`: `createHost` writes Better Auth's `auth_users` row directly with `emailVerified: true` (policy in the data layer, reason in the comment). Acceptable under B6 and the design doc, but the owner-account creation helper would fit better beside the wrapper or in a people module.
- `src/lib/email/hostInvite.ts:8` repeats the 120 name limit that `src/lib/hostSetup.ts:14` already owns (`hostLimits.name`). `src/components/HostSetup/HostForm.tsx:77` hard-codes `maxLength={64}` where `maxTimeZoneLength` exists at `src/lib/sessions.ts:35`. B17 duplication; import the constants.
- `src/components/HostSetup/HostSetup.module.css:12` and `:19` use `max-width: 32rem` as a literal, and the focus ring uses literal `2px` and `4px` values. None is a colour, radius, or font-size literal, so B16 does not fire, but a measure token would keep it honest.
- `src/server/hostInvite.ts:82-85` (catch in `inviteHostOwner`): a catch-all that logs by `errorKind` and returns `'failed'`. It is not an empty catch and B13 does not fire. It does fold rate-limit and audit failures into the same notice; acceptable, and noted for the reviewer.

### Checks that passed

- B1: no `fetch`, Drizzle, or SDK call in `components/**`, `app/**`, or a client file; all database and email I/O is in `src/server/` or the ops pages' data-layer calls.
- B3: `import 'server-only'` on `src/server/hostInvite.ts`, `src/server/db/hostSetup.ts`, and `src/server/ports/email/templates/HostInvite.tsx`; `src/server/actions/hosts.ts` is `'use server'`. `process.env` is read only through `@/server/env`.
- B4: no reverse import. `src/lib/**` imports only `src/lib`; `src/server` imports `src/lib` and `src/server` only; components import no `src/server` module (the one permitted path is `src/server/actions`); `src/server/db/schema/catalog.ts` importing `@/lib/hostSetup` is the allowed direction.
- B5: parsing sits in `src/lib/hostSetup.ts` (`FieldsSchema` strict object, `parseHostCreateForm`, `parseHostEditForm`, `parseHostIdField`) before any data-layer call; exported reads return mapped types (`buildHostDetail`, `buildHostListRows`), not raw rows.
- B6: every exported read and write in `src/server/db/hostSetup.ts` and `src/server/db/legal.ts` (`recordHostAcceptance`, `readHostAcceptances`, `createHost`, `updateHost`, `readHostsForOps`, `readHostForOps`, `readNewHostForm`, `readHostInviteTarget`) calls `requireOpsUserId` or `requireRole` before it touches a row. `requireOpsUserId` is in `src/server/db/audit.ts`.
- B7: no test-only export in the new component or data-layer files; every export is used by a page or by a sibling.
- B8: no `'use client'` in any added file. No new client island; the allowlist is untouched.
- B9 (writes): `createHost` (host, owner account, role grant, audit, acceptance and its audit) runs in one `db.transaction` and rolls back on refusal; `updateHost` writes the row and its audit in one transaction; `recordHostAcceptanceIn` takes the caller's transaction. Only the invite path is flagged above.
- B12: `systemClock.now()` is used for the link expiry; no `Date.now()` or argument-less `new Date()`; no money in this unit.
- B13: no empty catch and no `undefined`/`null`/`[]`/`{}` return from a catch in `src/lib` or `src/server`. `createHost` rethrows everything except its own `AgreementRefusal`, and that class is caught only inside the same transaction.
- B15: no Route Handler added (the diff adds page files only).
- B16: no inline `style` prop in the new components; the CSS module uses `var(--…)` tokens for colour, spacing, radius, and font size.
- Email port placement: `src/lib/email/hostInvite.ts` is pure data and copy; the template is under `src/server/ports/email/templates/`, matching Placement decision 1.

### Verdict

Five blocking items: three B2/B17 decisions or parses, the B11 wrapper bypass, and the B9 transaction on the invite path. Each fix is small: three are lib or wrapper moves with tests, and B9 needs Dave's call on the ordering.

ARCH_VERDICT=REQUEST_CHANGES
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=5

---
<sub>architecture-audit | haiku | read-only</sub>
