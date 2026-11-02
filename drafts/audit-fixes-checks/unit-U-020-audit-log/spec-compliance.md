FAIL

## Spec compliance: U-020 "Audit log" (head 6f675e5)

Diff reviewed: `git diff 053bd1a...6f675e5` in /Users/davidfleming/Workspace/ramble. Read-only; no tests run, no checkout changed.

### Criteria

| # | Criterion (source) | Status | Evidence |
|---|---|---|---|
| 1 | Insert-only audit table (units.yaml U-020 scope; WB row 102) | PASS | `src/server/db/migrations/0020_audit_log.sql` creates `audit_log`; `src/server/db/schema/operations.ts` `auditLog` table |
| 2 | Restricted role (units.yaml scope; WB row; ADR 0002 line 90) | PASS, with caveat | `src/server/db/migrations/0021_audit_log_guards.sql`: `CREATE ROLE audit_writer NOLOGIN`, `GRANT INSERT, SELECT ON audit_log TO audit_writer`, `REVOKE ALL`. Caveat: no login role is granted `audit_writer` yet; the migration says the app connects as it "once connections are split", so the restriction is not in force for the running app. |
| 3 | Trigger blocking changes (units.yaml scope; ADR 0002 line 90; design doc 01 line 164) | PASS | `0021_audit_log_guards.sql`: `audit_log_insert_only BEFORE UPDATE OR DELETE` and `audit_log_keep_table BEFORE TRUNCATE`, both raising `restrict_violation`. Also covered by `tests/db/audit.db.test.ts` (the insert-only guard block, ~line 290). |
| 4 | Nightly export to locked storage (units.yaml scope; WB row; ADR 0002 line 90) | FAIL | See Blocking. |
| 5 | units.yaml U-020 entry: prd [74, 51], depends_on [U-003, U-005] | PASS | `docs/plan/units.yaml:546-553` |
| 6 | WB row for U-020 matches units.yaml | PASS | `docs/plan/02-work-breakdown.md:102` (same scope text, PRD numbers, dependencies) |
| 7 | PRD-74: refunds, cancellations, and payout changes logged with who and when (`docs/product/PRD.md:245`) | PASS for U-020's part | The table records `actor_kind`, `actor_id`, `recorded_at`, `action`, `subject_kind`, `subject_id` (`operations.ts`, `0020_audit_log.sql`). No caller writes rows yet: `src/server/db/audit.ts:14-25` `writeAudit` is marked `TODO(U-055): first caller`. The per-action writes belong to U-055, U-056, U-077, U-078, U-108. |
| 8 | PRD-51: staff see each booking's history, who did what and when (`docs/product/PRD.md:204`) | PASS for U-020's part | Same table and fields as row 7. No subject-keyed history read exists in U-020 (`src/server/db/audit.ts` reads by time window for the export). The booking history view is U-077 per WB row 214. |
| 9 | ADR 0002 line 53: audit row written in the same transaction as the change | PASS (mechanism) | `src/server/db/audit.ts:14-25` takes a `Transaction`, not `db`. No caller yet (see row 7). |
| 10 | Design doc 01 line 150: transactions write their audit rows in the same transaction | PASS (mechanism) | Same as row 9. |
| 11 | Design doc 01 line 194: ops actions each write an audit row, with step-up for refunds, cancellations, payout and role changes | PASS for the table only | Step-up and the per-action writes are not U-020 scope (U-073, U-077, U-078, U-112). Not counted against this unit. |
| 12 | ADR 0002 line 90: hash chain optional | N/A | Optional in the ADR; not built, not required. |

### Nightly export to locked storage: does it meet the criterion?

No. It does not meet it as written, and the fake-backed build does not stand in for it.

- The export code exists and is tested against the fake: `src/server/jobs/auditExport.ts`, `src/server/jobs/auditSchedule.ts`, `src/server/pulse.ts:98` (`scheduleAuditExports` runs in the pulse), `src/server/jobs/registry.ts` (job kind registered).
- The default provider is `fake` (`src/server/env.ts:69`, `STORAGE_PROVIDER` default `'fake'`). The fake keeps objects in an in-memory `Map` (`src/server/ports/storage/fake.ts`). That is not locked: nothing enforces retention, and the objects disappear when the process restarts. The fake does refuse overwrite and delete of `audit/` keys through the port, which is the write-once rule the port enforces, but the port's rule is not a lock on the store.
- The only real adapter, `src/server/ports/storage/vercel-blob.ts` (put, about line 56), refuses `audit/` objects with `provider_unavailable`. So with `STORAGE_PROVIDER=vercel-blob` the export job fails every run and dead-letters. No real locked store is wired.
- No object-lock, retention, or R2 adapter exists at head (grep of `src` for object lock, retention, R2, cloudflare finds only privacy-inventory text and unrelated holds retention).
- The fake path is the risk: with the default `fake` provider, `exportAuditDay` logs `audit day exported` and the job completes. A production deploy left on `fake` would report success while nothing is stored durably or locked. That is a false pass.
- `src/lib/privacy.ts` (the Cloudflare R2 vendor entry, deletion path) says "Audit exports sit in a locked bucket and are not deleted before their lock ends". That is not true at head. It describes a lock that does not exist.

The owner-created account is the reason the real store is missing. It is not a reason the criterion passes. Whether to accept this gap as a deferred criterion, rather than fail it, is a decision for Dave and the PM; this check reports the gap as it stands.

### Blocking Issues
- **Criterion 4, nightly export to locked storage (units.yaml U-020 scope; ADR 0002 line 90):** no locked store exists at head. The export writes through the storage port to the fake (in-memory, default provider, reports success) or is refused by the Vercel Blob adapter. Expected: an adapter for the audit store that enforces retention or object lock on `audit/` keys (for example an R2 bucket with lock configured), selected by configuration, with the export refusing to run on a provider without that lock rather than reporting success. Until then this criterion is not met. The fake-backed build can be credited for the write-once port contract, not for the locked store.
- **Doc claim in `src/lib/privacy.ts` (R2 vendor, deletion path):** states audit exports are in a locked bucket. Not true at head. Either correct the text or build the lock before merge. This is a claim, not a separate criterion.

### Non-blocking
- `audit_writer` holds the grants but no login role is a member, so the app runs as the table owner and the trigger is the only guard in force today. The migration comment says this changes when connections are split. Not a U-020 failure; note for the connection-split unit.
- `writeAudit` has no caller until U-055 (`src/server/db/audit.ts:14`, `TODO(U-055): first caller`). That is allowed by the B7 amendment. PRD-74 and PRD-51 are therefore met at the table level only.
- Nightly cadence: the export is queued from the pulse (`src/server/pulse.ts:98`). I did not verify what schedule triggers the pulse, so "nightly" is not confirmed from the diff.

### Unconfirmed
- Test results: not run. Test presence was checked by name only (`tests/db/audit.db.test.ts`, `src/lib/audit.test.ts`, `src/server/jobs/auditExport.test.ts`, `src/server/ports/storage/vercel-blob.test.ts`, `tests/contracts/storage-port.ts`).
- Whether the pulse runs on a nightly schedule in production: not verified from the diff.

### Evidence
- `docs/plan/units.yaml` lines 546-565
- `docs/plan/02-work-breakdown.md` line 102
- `docs/product/PRD.md` lines 204 (PRD-51) and 245 (PRD-74)
- `docs/plan/01-design-doc.md` lines 150, 164, 194
- `docs/adr/0002-data-and-holds.md` lines 53, 90
- `src/server/db/migrations/0020_audit_log.sql`
- `src/server/db/migrations/0021_audit_log_guards.sql`
- `src/server/db/schema/operations.ts` (auditLog table)
- `src/server/db/audit.ts`
- `src/server/jobs/auditExport.ts`, `src/server/jobs/auditSchedule.ts`, `src/server/jobs/registry.ts`
- `src/server/pulse.ts` line 98
- `src/server/env.ts` line 69
- `src/server/ports/storage/fake.ts`, `src/server/ports/storage/vercel-blob.ts`, `src/server/ports/storage/config.ts`
- `src/lib/storage.ts`, `src/lib/privacy.ts`

---
<sub>spec-compliance | haiku | read-only</sub>
