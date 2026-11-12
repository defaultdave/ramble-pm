PASS

## Spec Compliance: U-074a Host setup (lite cut), PASS

Head checked: 1ce35268d7cca555296eadadd91a9213f8b8952b (worktree agent-a6d8ea090fca6ede8, `git diff origin/main...HEAD`, 38 files).
Sources: docs/plan/units.yaml (U-074a scope, critical tier), docs/plan/02-work-breakdown.md (PRD 39, 52, 53), ramble-pm drafts/mvp-replan-2026-11-10.md section 2 (lite cut). Issue #90 body mirrors the units.yaml scope; no separate checkbox list exists, so the scope sentence is the AC source.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Host record: create, edit, list, detail | PASS | `src/server/db/hostSetup.ts:createHost` (insert into `hosts`), `updateHost`, `readHostsForOps`, `readHostForOps`; `src/server/actions/hosts.ts:createHostAction`, `updateHostAction`; `src/server/db/schema/catalog.ts:108-117` (hosts CHECKs); `src/server/db/migrations/0030_host_record_limits.sql` |
| 2 | Owner account created or found by address, with host_owner grant | PASS | `src/server/db/hostSetup.ts:createHost` (insert `authUsers`, insert `roleGrants` role `host_owner`, one transaction with audit) |
| 3 | Owner sign-in-link invite emailed | PASS | `src/server/hostInvite.ts:inviteHostOwner` and `mintSignInToken`; sent on create (`src/server/actions/hosts.ts:createHostAction`) and on resend (`resendHostInviteAction`); template `src/server/ports/email/templates/HostInvite.tsx`, `src/lib/email/hostInvite.ts`, registered in `src/lib/email/templates.ts` and `src/server/ports/email/render.tsx` |
| 4 | Agreement acceptance recorded against the current legal version only | PASS | `src/server/db/legal.ts:recordHostAcceptanceIn` (reads `currentHostAgreementIn`, writes `legalAcceptances` with `subjectKind: 'host'`); `src/lib/hostSetup.ts:decideHostAcceptance` returns `stale` for a superseded version and `already_accepted` for a repeat; `recordHostAcceptance` exported; action `acceptHostAgreementAction` in `src/server/actions/hosts.ts` |
| 5 | Content-rights acceptance | PASS (folded in) | Single document `hostAgreementDoc = 'host-agreement'` in `src/lib/hostSetup.ts`; form copy says the agreement "includes the content-rights terms" (`src/components/HostSetup/HostForm.tsx:~110`). Matches the lite cut's "one acceptance" |
| 6 | Payout account | PASS (omitted per lite cut) | No payout field, table, or copy in the diff (grep of `src/` host files and `tests/db/host-setup.db.test.ts` for payout/bank/Stripe returns nothing). units.yaml line 1866 still names it; see deviations |
| 7 | /ops/hosts index and detail routes | PASS | `src/app/(ops)/ops/hosts/page.tsx` (index, `HostsTable`), `src/app/(ops)/ops/hosts/[id]/page.tsx` (detail, `HostDetailView`); both gate on `holdsOpsRole` and render `OpsAccessDenied` otherwise |
| 8 | Ops nav link | PASS | `src/lib/opsNav.ts:24-28` (Hosts link); `src/lib/opsNav.test.ts:32` updated |
| 9 | Owner account and invite are ops-only | PASS | `requireOpsUserId` / `requireRole(Role.Ops)` on every function in `src/server/db/hostSetup.ts`, `src/server/hostInvite.ts`, and `src/server/db/legal.ts` host functions; matrix rows in `tests/db/authz-matrix.db.test.ts:434-497` |
| 10 | Routes and states join the U-100 axe matrix | N/A (deferred to U-100) | The scope says "whichever of this unit and U-100 lands second adds them". U-100 is Wave 4 and not in this diff, so U-074a lands first and U-100 adds the rows. `e2e/routes.ts` is untouched. Open question below |
| 11 | Review tier critical | N/A | Meta: tier is recorded in docs/plan/units.yaml (`review: critical`); human-read is a Dave action |

Tests present (existence only, not audited): `src/lib/hostSetup.test.ts`, `src/lib/hostAudit.test.ts`, `src/lib/email/hostInvite.test.ts`, `src/server/ports/email/hostInviteRender.test.ts`, `src/components/HostSetup/HostSetup.test.tsx`, `tests/db/host-setup.db.test.ts`, `tests/db/authz-matrix.db.test.ts`.

### Out-of-scope file changes

Nothing under sessions, experiences, holds, orders, checkout, guest, or host-dashboard paths changed. Files outside the host area, all small:

- `src/components/DataTable/DataTable.tsx`, `src/components/StatusBadge/StatusBadge.tsx`, `src/lib/tableQuery.ts`: comment-only edits removing `TODO(U-073): first caller` markers. Harmless, but these are outside the manifest. Remove them in a separate cleanup or accept as the first-caller marker being resolved here.
- `src/lib/opsAudit.ts`: adds the `hosts` area id (`00000000-0000-4000-8000-0000000000a3`). Needed for host audit rows; host-scoped.
- `src/server/db/audit.ts`: adds `requireOpsUserId` helper. Shared helper, used only by host code and the invite. Supporting change.
- `tests/db/authz-matrix.db.test.ts`: adds host function rows and `requireOpsUserId` to the guard list. Test scaffolding for new guarded functions.

None of these alters behaviour outside host setup.

### Deviations from the lite cut (src: drafts/mvp-replan-2026-11-10.md section 2)

1. **Payout account dropped:** matches the lite cut. But docs/plan/units.yaml:1866, docs/plan/02-work-breakdown.md:207, and the issue #90 body still list it. The PM should amend the record so the next check does not flag it.
2. **`/ops/hosts/new` create form added:** the lite cut names only "index and detail". Creating a host needs a form, so this is a reasonable reading of "host record", but it is an extra route and should be recorded in the PR as a deliberate addition.
3. **Resend invite action and host edit form:** both sit on the detail page. Within the host record and invite scope; no deviation in substance.
4. **Agreement acceptance is optional at create:** the box can be left empty and acceptance recorded later from the detail page. The lite cut says "one acceptance against the current legal version" and does not say the create step must take it. Confirm this is intended.
5. **Axe matrix rows deferred:** consistent with the scope sentence, but U-100 description says "host and ops routes join the matrix as each surface lands". If Dave reads that as U-074a's job, this becomes a FAIL (criterion 10).

### Open questions for the PM
- Confirm deviation 5 (who adds the axe rows) before the human-read.
- Amend units.yaml, the work-breakdown row, and issue #90 to drop payout, or record in delta-log that the lite cut removed it.

---
<sub>spec-compliance | haiku | read-only (report written to drafts; no PR comment, no issue edit)</sub>
