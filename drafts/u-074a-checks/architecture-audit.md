## Architecture Audit — PASS

Rules: `.claude/standards/architecture.md` (project)
Head: `98fe33d59fc5019dd8ef962fd9f130c48e1aee57` (branch `unit/U-074a`, diff `origin/main...HEAD`)
Exemptions in force: B15 for `/api/auth/*`; B6 for identity reads; B8 for the sign-in island; B9 audit-before-send in `src/server/hostInvite.ts` (documented waiver, also covers the sign-in verification-row write).

Files audited (in scope): `src/app/(ops)/ops/hosts/page.tsx`, `src/app/(ops)/ops/hosts/new/page.tsx`, `src/app/(ops)/ops/hosts/[id]/page.tsx`, `src/components/HostSetup/*.tsx`, `src/components/HostSetup/HostSetup.module.css`, `src/components/DataTable/DataTable.tsx`, `src/components/StatusBadge/StatusBadge.tsx`, `src/lib/hostSetup.ts`, `src/lib/hostAudit.ts`, `src/lib/opsNav.ts`, `src/lib/opsAudit.ts`, `src/lib/tableQuery.ts`, `src/lib/email/hostInvite.ts`, `src/lib/email/templates.ts`, `src/server/actions/hosts.ts`, `src/server/auth/forms.ts`, `src/server/auth/signInLink.ts`, `src/server/db/audit.ts`, `src/server/db/hostSetup.ts`, `src/server/db/legal.ts`, `src/server/db/schema/catalog.ts`, `src/server/hostInvite.ts`, `src/server/ports/email/render.tsx`, `src/server/ports/email/templates/HostInvite.tsx`. Read for B7/B11 only: test files and `tests/db/*`. Migrations and snapshot JSON are out of scope.

Last-round blockers: both confirmed fixed.
- `src/lib/hostSetup.ts:81` `optionalEmail` uses `maxEmailAddressLength` from `src/lib/email/address.ts`.
- `agreementTickLabel`, `agreementRecordPrompt`, `defaultHostTimeZone` live in `src/lib/hostSetup.ts:258-275`; `HostForm.tsx` and `HostDetailView.tsx` import them; unit tests at `src/lib/hostSetup.test.ts:541-547`.

### Blocking Issues
None.

Checked against each blocking rule:
- B1: no `fetch`, Drizzle, or SDK call in `app/**`, `components/**`, or `lib/**`. Data access is in `src/server/db/hostSetup.ts`, `src/server/db/legal.ts`, and `src/server/hostInvite.ts`.
- B2: no `.filter`, `.sort`, `.reduce`, parse, or money arithmetic in components or pages. Decisions are in `src/lib/hostSetup.ts`.
- B3: every new `src/server/**` module has `import 'server-only'`, except `src/server/actions/hosts.ts`, which uses `'use server'` as the rule allows. No new `process.env` reads outside the environment module. The only `process.env` hits are in `tests/db/host-setup.db.test.ts`.
- B4: imports point one way. `src/lib` imports only `src/lib` and pure libraries. `src/components` imports components, lib, and types only. `src/app` imports server modules for actions and reads, which is permitted.
- B5: `parseHostCreateForm`, `parseHostEditForm`, and `parseHostIdField` (Zod, `src/lib/hostSetup.ts`) run before any data-layer call in `src/server/actions/hosts.ts`. Returned types are Ramble types (`HostListRow`, `HostDetail`, `CreateHostResult`).
- B6: `requireOpsUserId` or `requireRole(Ops)` runs first in `createHost`, `updateHost`, `readHostsForOps`, `readHostForOps`, `readNewHostForm`, `recordHostAcceptance`, `recordHostAcceptanceIn`, `readHostAcceptances`, `readHostInviteTarget`, and `inviteHostOwner`. The owner address comes from the grant, not the request.
- B7: no test-only export in a component or data-layer file. See advisory A6 for lib exports.
- B8: no `'use client'` added.
- B9: `createHost` (host, owner, grant, audit, acceptance) and `updateHost` (update plus audit) each run in one `db.transaction`. `recordHostAcceptance` writes its acceptance and audit in one transaction. The `inviteHostOwner` sequence is covered by the waiver.
- B10: no money or hold code in the diff.
- B11: vendor SDK imports stay in `src/server/db/`. `src/server/ports/email/templates/HostInvite.tsx` uses the existing email parts. No new adapter.
- B12: no `Date.now()` or argument-less `new Date()` in `server/**` or `lib/**`. `src/server/auth/signInLink.ts` uses `systemClock`. The new `hosts` CHECK constraints are on text lengths only.
- B13: `src/server/db/hostSetup.ts` `createHost` and `updateHost` catch blocks rethrow anything they do not map. `src/server/hostInvite.ts` catch is not an empty or null return (see A2).
- B14: no `'use cache'` in the diff.
- B15: no new Route Handler. No `src/app/api/**` file changed.
- B16: no inline `style` prop. `HostSetup.module.css` uses `var(--…)` tokens for every colour and spacing value (no hex, rgb, or spacing literals). See A7.
- B17: no duplicated decision function found that would block. See A4 and A5.

### Advisory
- A1 `src/server/actions/hosts.ts:37-68`: `createHostAction` and `updateHostAction` branch on the result status to pick a redirect (`created.status`, `result.status`). The notice mapping itself is in lib (`inviteNotice`, `agreementNotice`), but the status-to-branch routing is control flow in the action. Consider a lib helper such as `hostWriteNotice(result)` so the action only parses, calls, and redirects. `updateHostAction:69` passes `result.status` straight through as a notice code, which works only because `'updated'` and `'unchanged'` are members of `noticeCodes`. That coupling is implicit.
- A2 `src/server/hostInvite.ts:45-49`: the `catch` logs through `errorKind` and returns `'failed'`. That is a typed result, not one of B13's banned empty returns, so it does not block. It does absorb failures from `consumeRateLimit`, `recordAudit`, and `createSignInLinkToken`, and the logged name is only `errorKind`. Confirm that is the intended ARCH-9 behaviour for this path.
- A3 `src/server/hostInvite.ts:7`: `appOrigin` is imported from `src/server/auth/forms.ts`, a module for the auth form posts (`forms.ts:23` exports it). Consider moving `appOrigin` to a shared server module so the host invite does not depend on the auth form handler.
- A4 `src/lib/opsNav.ts:22` repeats `'/ops/hosts'`, which `src/lib/hostSetup.ts:30` already defines as `hostsPath`. The `/ops/mailbox` literal beside it is the existing pattern, so this is minor. Consider importing `hostsPath`.
- A5 `src/lib/hostSetup.ts:72` `textOf` (trim to undefined) and `src/lib/hostSetup.ts:79-83` `optionalEmail` (normalize then `EmailAddressSchema`) repeat patterns already in `src/lib/support.ts:45-46` and `src/lib/guests.ts:34`. Each is small. Consider a shared optional-email field if a third copy appears.
- A6 Lib exports used only by tests: `hostInviteLandingPath` (`src/lib/email/hostInvite.ts:28`) and `hostAcceptanceState` (`src/lib/hostSetup.ts:277`) have no importer outside their own module and tests. B7 scopes to component and data-layer files, so this is advisory only. Either drop the `export` or name a consumer.
- A7 `src/components/HostSetup/HostSetup.module.css:12,19,72,75,76` uses `max-width: 32rem` and `outline: 2px`, and box-shadow widths `2px` and `4px`. These are sizes, not colours, spacing, radius, or font-size, so B16 does not cover them. `src/components/SignIn/SignIn.module.css` and `src/components/GuestShell/SiteMenu.module.css:28` use the same literals, so this matches precedent. Noted, not a violation.
- A8 `src/server/auth/signInLink.ts:19` `createSignInLinkToken(email)` is exported with no `Caller` and writes a verification row. It is reached only from `inviteHostOwner`, which checks ops first, and the row write is covered by the B9 waiver. Keep it out of any Server Action export.
- A9 `src/server/hostInvite.ts:31` `consumeRateLimit` is a write before the audit row and outside any transaction. The B9 waiver text names the audit and the verification row, not this counter. Consider adding it to the waiver's comment.
- A10 `src/components/HostSetup/HostForm.tsx:53-58` chooses hint copy by the `creating` flag inside the component. The strings are static copy, so this is not a B2 decision. Consider moving them to lib if the copy changes again, as was done for the agreement sentences.

Removed TODO markers (checked, correct): `TODO(U-073): first caller` removed from `src/components/DataTable/DataTable.tsx`, `src/components/StatusBadge/StatusBadge.tsx`, and `src/lib/tableQuery.ts:parseCursor`, each now has a caller. `TODO(U-074a)` removed from `src/server/db/legal.ts`. `TODO(U-073)` on `parseSearchTerm` (`src/lib/tableQuery.ts:61`) remains and is not this unit's concern.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
