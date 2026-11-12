PASS

## Spec Compliance: U-074a Host setup (lite cut), round 2, PASS

Head checked: 21b3aa7b2558d1860b72d582754fd3f75dfed408 (worktree agent-a6d8ea090fca6ede8, `git diff origin/main...HEAD`, 2 commits, 43 files, +18916 / -44).
Sources: docs/plan/units.yaml U-074a scope (line 1866, critical tier), ramble-pm drafts/mvp-replan-2026-11-10.md section 2 (U-074a row: IN-LITE, no payout, one acceptance against current legal version, owner sign-in-link invite, +/ops/hosts index and detail), round 1 report.

### Acceptance criteria (re-verified against round 1)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Host record: create, edit, list, detail | PASS | `src/server/db/hostSetup.ts` (createHost, updateHost, readHostsForOps, readHostForOps); `src/server/actions/hosts.ts`; `src/server/db/schema/catalog.ts:100-123` |
| 2 | Owner account created or found by address, with host_owner grant | PASS | `src/server/db/hostSetup.ts:createHost` (authUsers insert, roleGrants host_owner, one transaction with audit) |
| 3 | Owner sign-in-link invite emailed | PASS | `src/server/hostInvite.ts:inviteHostOwner`; `src/server/auth/signInLink.ts:createSignInLinkToken` (new, additive); template `src/server/ports/email/templates/HostInvite.tsx`, registered in `src/lib/email/templates.ts` and `src/server/ports/email/render.tsx` |
| 4 | Agreement acceptance against current legal version only | PASS | `src/server/db/legal.ts` (recordHostAcceptanceIn, subjectKind host; TODO(U-074a) removed); `src/lib/hostSetup.ts:decideHostAcceptance` (stale, already_accepted); `acceptHostAgreementAction` in `src/server/actions/hosts.ts` |
| 5 | Content-rights acceptance | PASS (folded into one agreement) | `hostAgreementDoc` in `src/lib/hostSetup.ts`; copy in `src/components/HostSetup/HostForm.tsx` |
| 6 | Payout account (simulated) | PASS (omitted per lite cut) | No payout field, table, or copy in the diff. Lite cut drops it; units.yaml:1866 still names it (record amendment needed, not a code gap) |
| 7 | /ops/hosts index and detail | PASS | `src/app/(ops)/ops/hosts/page.tsx`, `src/app/(ops)/ops/hosts/[id]/page.tsx`; plus `new/page.tsx` (see deviations) |
| 8 | Ops nav link | PASS | `src/lib/opsNav.ts` (Hosts entry); `src/lib/opsNav.test.ts` |
| 9 | Owner account and invite are ops-only | PASS | requireOpsUserId / requireRole(Role.Ops) in `src/server/db/hostSetup.ts`, `src/server/hostInvite.ts`, `src/server/db/audit.ts:requireOpsUserId`; rows in `tests/db/authz-matrix.db.test.ts` |
| 10 | Routes and states join the U-100 axe matrix | N/A (deferred to U-100 by the scope's "whichever lands second" clause) | `e2e/routes.ts` untouched; U-100 not in this diff. Same open point as round 1 |
| 11 | Review tier critical | N/A | Meta: `review: critical` in units.yaml; human-read is Dave's action |

No AC changed status from round 1.

### Round 2 items

**1. Migration 0031 `hosts_slug_unique` (unique index on hosts.slug). In scope: yes, as a supporting constraint on the host record.** The host record is created through a form and its slug is the public address of the host. A unique slug is what makes that record addressable and keeps create from silently making two hosts share one address. It is not named in the units.yaml scope or the lite-cut row, so record it as a deliberate addition in the PR. The migration file, schema index (`catalog.ts:103`), journal entry and snapshot agree. Nothing else in the schema changed for slugs.

**2. `src/server/auth/signInLink.ts` (new, plus `signInLink.test.ts`). In scope: yes, additive only.** Confirmed with `git diff --name-status origin/main...HEAD -- src/server/auth/`: the only entries are two `A` (added) rows. No existing file in `src/server/auth/` is modified, deleted or renamed. The helper mints a 32-letter token and stores the magic-link verification row, which is what the invite needs (criterion 3). It is consumed by the owner invite path. It does not change the U-004a or U-120 sign-in behaviour. The file lives in another lane's folder, so the PM should note the ownership overlap in the PR body; no change to the other lane's code is needed.

**3. `tests/db/catalog.db.test.ts` (another unit's file). Judgment: necessary and minimal, but flag it.** The diff changes the slug-history suite's comment so host slugs are unique, and wraps the two repeating-slug cases in `it.skipIf(kind === 'host')`. This is forced by item 1: those two cases insert two live entities with one slug, which the new unique index now refuses for hosts. Nothing else in that file changed. Consequence: the repeat-slug history tests no longer cover hosts, which is correct because hosts can no longer repeat a slug. The owning lane for slug history (catalog/slug-history work) should be told in the PR. Not a scope breach by AC, but it is a cross-lane edit.

### Out-of-scope file changes (full list, 43 files)

Host-lane files (new `src/**/Host*`, `hostSetup`, `hostAudit`, `hostInvite`, `hosts.ts`, `ops/hosts/**`, `tests/db/host-setup.db.test.ts`, migrations 0030/0031 and their snapshots) are in scope.

Files outside the host lane, each judged:

| File | Change | Judgment |
|---|---|---|
| `src/components/DataTable/DataTable.tsx` | removes `TODO(U-073): first caller` comment | Comment-only. Harmless, outside manifest. Acceptable or split into cleanup |
| `src/components/StatusBadge/StatusBadge.tsx` | removes `TODO(U-073)` comment | Same |
| `src/lib/tableQuery.ts` | removes `TODO(U-073)` prefix from a doc comment | Same |
| `src/lib/opsAudit.ts` | adds `hosts` area id | Needed for host audit rows. Acceptable |
| `src/lib/opsNav.ts`, `opsNav.test.ts` | adds Hosts nav entry and test row | Required by criterion 8. Acceptable |
| `src/lib/email/templates.ts`, `src/server/ports/email/render.tsx` | registers `host-invite` template (additive) | Required by criterion 3. Acceptable |
| `src/server/db/audit.ts` | adds `requireOpsUserId`; import widened to ForbiddenError | Additive helper, used by host code. Existing exports unchanged. Acceptable |
| `src/server/db/legal.ts` | adds host acceptance functions, removes TODO(U-074a) and unused-only imports | Host acceptance, criterion 4. Existing content-document functions unchanged. Acceptable |
| `src/server/db/schema/catalog.ts` | hosts: unique index and length/shape CHECKs | Host record constraints. Items 1 above. Acceptable |
| `src/server/auth/signInLink.ts`, `.test.ts` | new files | Additive only. See item 2 |
| `tests/db/authz-matrix.db.test.ts` | adds host rows; `requireRole`/`requireStaff` guard set now includes `requireOpsUserId` | Test rows for new guarded functions. The guard set edit is a one-line widening. Acceptable |
| `tests/db/catalog.db.test.ts` | host skipIf on two repeat-slug cases | See item 3. Necessary, flag cross-lane |

No file under sessions, experiences, holds, orders, checkout, guest, or host-dashboard paths (`src/app/(host)/**`, `db/sessions.ts`, `db/holds.ts`, `db/orders*`) is changed. No file in `src/app/(site)` or `src/app/(guest)` is touched.

### Deviations from the lite cut (drafts/mvp-replan-2026-11-10.md section 2)

1. Payout account dropped: matches the lite cut. units.yaml:1866, 02-work-breakdown.md and issue #90 still list it. PM should amend the record.
2. `/ops/hosts/new` create form: not named in the lite cut (which says index and detail). Needed to create a host. Record as a deliberate addition in the PR.
3. Agreement acceptance optional at create, recorded later from detail: lite cut says "one acceptance against the current legal version" without requiring it at create. Confirm this is intended.
4. Axe matrix rows deferred to U-100: consistent with the scope sentence. If Dave reads U-100 text ("host and ops routes join the matrix as each surface lands") as U-074a's job, criterion 10 becomes FAIL. Decide before the human-read.

### Open questions for the PM
- Confirm deviation 4 (axe rows) before the human-read.
- Confirm item 1 (unique slug) and item 3 (catalog test cross-lane edit) are acceptable, and tell the slug-history lane owner.
- Amend units.yaml, the work-breakdown row and issue #90 to drop payout.

---
<sub>spec-compliance | haiku | read-only (report written to drafts; no PR comment, no issue edit)</sub>
