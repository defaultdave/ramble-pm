FAIL

## architecture-audit: U-020 "Audit log" (head 6f675e5)

Rules: `.claude/standards/architecture.md` (project). Diff: `053bd1a...6f675e5`, generated drizzle snapshots excluded. Read-only; no checkout changed.
Files audited: `src/lib/audit.ts`, `src/lib/audit.test.ts`, `src/lib/privacy.ts`, `src/lib/storage.ts`, `src/lib/storage.test.ts`, `src/server/db/audit.ts`, `src/server/db/schema/operations.ts`, `src/server/db/migrations/0020_audit_log.sql`, `src/server/db/migrations/0021_audit_log_guards.sql`, `src/server/db/migrations/meta/_journal.json`, `src/server/jobs/auditExport.ts`, `src/server/jobs/auditSchedule.ts`, `src/server/jobs/registry.ts`, `src/server/ports/storage/index.ts`, `src/server/ports/storage/config.ts`, `src/server/ports/storage/vercel-blob.ts`, `src/server/pulse.ts`, `tests/contracts/storage-port.ts`, `tests/db/audit.db.test.ts`.

### Blocking
- B17 (reuse): `src/lib/audit.ts:174` `dayOf` re-implements `isoDateOf` in `src/lib/time.ts:24` (`date.toISOString().slice(0, 10)`, same body). Fix: `import { isoDateOf } from './time'` and delete `dayOf`.
- B17 (reuse): `src/lib/audit.ts:131-147` `ExportDaySchema` repeats the calendar-date check of `IsoDateSchema` in `src/lib/sessions.ts:40-56` (`isRealIsoDate`: pattern plus round-trip through `Date.UTC`). Only the 2000 to 9998 range is new. Fix: `IsoDateSchema.refine((day) => day >= '2000-01-01' && day < '9999-01-01', ...)`, or extend `IsoDateSchema` with a range parameter, with the test kept in `src/lib/audit.test.ts`.
- B2 + B13: `src/server/jobs/auditExport.ts:33-37` `putOnce` branches on the `already_exists` error code and then returns undefined. The branch decides that a duplicate write counts as success (a domain result) in the server layer, and the catch returns undefined. Input that breaks it: a store that reports a duplicate on a write that did not land would be reported as exported. Fix: move the "duplicate write is success" predicate into `src/lib/` with a unit test, and have the server layer rethrow everything else; or check existence before the write and let any error propagate.
- B2: `src/server/ports/storage/index.ts:117` `parseDeleteInput` refuses a delete when the parsed key's visibility is `audit`. "Audit objects cannot be deleted" is a retention rule written into shared port code. Fix: add `canDeleteKey(key)` to `src/lib/storage.ts` beside `visibilityOfKey`, with a test, and call it from `parseDeleteInput`.
- B2 (B11 adjacent): `src/server/ports/storage/vercel-blob.ts:56-62` refuses `visibility === 'audit'` inside the adapter. The decision "an audit object needs a locked store" is a capability rule; it belongs with the port, not in one adapter. Fix: express the rule as a capability (for example a `lockedStores` list per adapter) checked in the shared `parsePutInput`, with the lib predicate tested, and keep the `storesAudit` contract flag as the adapter's declaration. The refusal itself is correct and fails closed; only its location is wrong.

### Non-blocking
- B6 (question for PM): `src/server/db/audit.ts` `readAuditPage` and `readFirstAuditTime` read every audit row (ops data, staff actor ids) with no `Caller` and no `requireRole`. The only callers are the job path (`auditExport.ts`, `auditSchedule.ts`) and the pulse, which have no caller. Precedent: `releaseLapsedHolds()` in `src/server/db/holds.ts:511` takes no caller either. B6 does not carve out system jobs, so this is noted rather than blocking. PM to confirm and, if wanted, add the system-job exemption to B6.
- Dead export: `src/server/db/schema/operations.ts:96` `auditActorKindEnum` is exported and has no importer. Drop the `export` keyword.
- Privacy copy: `src/lib/privacy.ts:730-735` says the nightly export sits in a "locked bucket" on Cloudflare R2, and the retention row for audit_log relies on it. No R2 adapter exists in this diff. The copy describes a store that is not built. Not an architecture rule; flagged for the privacy inventory owner.
- Deployment behaviour (not a layer rule): the storage provider default in the validated settings module (around line 69) is the in-memory fake adapter, so under the default an exported day's manifest records an export whose parts vanish on restart. Under `vercel-blob` every `audit-export` job refuses at `put` and dead-letters after its attempts. PM to confirm which provider production uses before U-020 ships.
- B5 note: `readAuditPage` and `readFirstAuditTime` use inputs without a Zod parse. Their inputs are internal typed values (a window from `exportWindow`, a cursor from `exportStep`, a constant limit), not boundary input. The job payload is parsed by the registry's `defineJob` before `exportAuditDay` runs. Not a violation.
- The `audit_log_details_shape` CHECK in `src/server/db/schema/operations.ts` restates the `details` rules as jsonpath. This is the deliberate mirror the lib comments describe. Noted only so the mirror is kept in sync if `auditLimits` changes.
- Test file `src/server/ports/storage/vercel-blob.test.ts` swallows the refusal with a catch that returns undefined, so the "sends nothing to the provider" test would also pass if `put` threw for an unrelated reason. Test files are read only for B7 and B11; flagged for the test owner, not blocking here.

### Unconfirmed

- None. The B2, B13 and B17 findings were confirmed by reading the cited lines at `6f675e5`.

### B2 decision ledger (data layer and route handlers in the diff)

| # | Where | Decision | Verdict |
|---|---|---|---|
| 1 | `src/server/db/audit.ts` `readAuditPage` WHERE: recorded_at at or after `from`, recorded_at before `to`, id after `afterId` | Window and cursor bounds | Not a decision (SQL WHERE, B2 text). Bounds come from `exportWindow` and `exportStep` in lib. |
| 2 | `src/server/db/audit.ts` `readAuditPage` ORDER BY id, LIMIT | Paging order and page size | Not a decision (SQL ORDER BY and LIMIT). Size is `auditLimits.exportPageRows` from lib. |
| 3 | `src/server/db/audit.ts` `readFirstAuditTime` ORDER BY recorded_at LIMIT 1, `?? null` | Earliest row; null for an empty log | Not a decision. The meaning of null (queue nothing) is decided in `exportDaysDue` in lib. |
| 4 | `src/server/db/audit.ts` `writeAudit` `if (!row) throw` | Insert returned no row | Not a domain decision; throws. |
| 5 | `src/server/db/audit.ts` `writeAudit` `parseAuditEntry(entry)` | Entry validity | Lib decision, called correctly. |
| 6 | `src/server/jobs/auditExport.ts` `if (!exportDayReady(...)) throw` | Day is over and grace has passed | Lib decision, called; the server only reacts. |
| 7 | `src/server/jobs/auditExport.ts` branches on `refuse`, `finish`, `last` | Stop, refuse, or continue | Branches on lib results; not decisions. |
| 8 | `src/server/jobs/auditExport.ts` `putOnce` already-exists branch | Duplicate write is success | BLOCKING (finding 3). |
| 9 | `src/server/jobs/auditExport.ts` error messages "not over yet", "more parts than the limit" | Thrown text | Not a display string: the drain logs only the error name, and the messages never reach a guest. Not a finding. |
| 10 | `src/server/jobs/auditSchedule.ts` `if (job) queued += 1` | Count of new jobs | A tally of enqueue's return value, not a domain rule. |
| 11 | `src/server/jobs/auditSchedule.ts` `exportDaysDue(...)` | Which days to queue | Lib decision, called. |
| 12 | `src/server/jobs/registry.ts` `handleIdempotent` empty body | No second step | Not a decision. |
| 13 | `src/server/ports/storage/index.ts` `parseDeleteInput` audit refusal | Audit objects cannot be deleted | BLOCKING (finding 4). |
| 14 | `src/server/ports/storage/vercel-blob.ts` `put` audit refusal | Store without a lock refuses audit | BLOCKING (finding 5). |
| 15 | `src/server/ports/storage/config.ts` default system clock | Clock choice | Clock port, allowed (B12). |
| 16 | `src/server/pulse.ts` schedule call before drain | Order of work | Orchestration, not a domain decision; the order is tested. |
| 17 | `src/server/db/schema/operations.ts` CHECK SQL built from `auditLimits` and `auditPatterns` | Stored-data rules | Deliberate mirror of lib (see Non-blocking). Not an app decision. |

### Rule results (B1 to B17)

| Rule | Result | Basis |
|---|---|---|
| B1 | Pass | DB access only in `src/server/db/audit.ts`; storage only through the port in `auditExport.ts`. No fetch or SDK call outside `src/server/`. |
| B2 | FAIL | Findings 3, 4, 5. Full ledger above. |
| B3 | Pass | `server-only` present in `src/server/db/audit.ts`, `auditExport.ts`, `auditSchedule.ts`. `operations.ts` is exempt (drizzle-kit). No environment-variable read in the diff outside the validated settings module. |
| B4 | Pass | `src/lib/audit.ts` imports only lib (`./catalog`, `./time`). `operations.ts` imports lib. No import against the diagram. |
| B5 | Pass | Job payload parsed by `defineJob` (`AuditExportPayloadSchema`); `writeAudit` parses with `parseAuditEntry`; raw Drizzle rows stay inside `src/server/`. See Non-blocking note. |
| B6 | Pass with question | No guest, host, or ops row written without a check. Audit read functions take no caller (see Non-blocking, system-job question). `writeAudit` documents that its path authorized the action. |
| B7 | Pass | `writeAudit` has no non-test importer and carries `TODO(U-055): first caller` at `src/server/db/audit.ts:11`; U-055 exists in `docs/plan/02-work-breakdown.md` and depends on U-020, so the exemption holds. Every other new export has a non-test importer. `auditActorKindEnum` has no importer at all (not B7's trigger; logged as dead export). |
| B8 | Pass | No client directive in the diff. |
| B9 | Pass | `writeAudit` takes the caller's transaction. `scheduleAuditExports` enqueues every day in one transaction. `exportAuditDay` writes storage objects only in `prepare`, which runs before the transaction; it is idempotent, and the job row is marked done after the transaction. Precedent: `prepareProviderEvent` in the registry. |
| B10 | N/A | No money, hold, or payment path in the diff. |
| B11 | Pass | No new vendor SDK import. Only the `vercel-blob` adapter changed, with a contract flag (`storesAudit`) on both adapters and the shared contract extended (`tests/contracts/storage-port.ts`). The adapter refusal is counted under B2 (finding 5). |
| B12 | Pass | Integer minor units in details (`refund_minor`). The system clock is used for time. `recorded_at` is timestamp with time zone. No `Date.now()` or argument-less `new Date()` in `lib/` or `server/`. |
| B13 | FAIL | Finding 3 (`putOnce`, `src/server/jobs/auditExport.ts:33-37`): a catch that returns undefined. |
| B14 | N/A | No `'use cache'` in the diff. |
| B15 | N/A | No new Route Handler. `/api/pulse` changed only in `pulse.ts`. |
| B16 | N/A | No stylesheet or inline style in the diff. |
| B17 | FAIL | Findings 1 and 2: `dayOf` duplicates `isoDateOf` (`src/lib/time.ts:24`); `ExportDaySchema` duplicates `IsoDateSchema` (`src/lib/sessions.ts:54`). Reuse checked for `maxChars`, `isReadableDate`, `WriteIdSchema`, `msPerDay`, `msPerMinute`: all reused. |

### Storage port extension (reviewed)

`StorageVisibility` gains `audit`; the key pattern accepts the audit prefix; `allowedContentTypes.audit` is `application/x-ndjson` only; `visibilityOfKey` returns `audit`. The shared put parse uses the content-type table, so a PDF or JSON write under the audit prefix is refused. Signed links are refused for non-private keys and deletes are covered by the shared contract. Fake adapter: `storesAudit: true`, stores once, returns no URL. Vercel Blob: `storesAudit: false`, refuses at put (finding 5). Architecture result: the extension is sound, but two decisions (delete refusal and locked-store refusal) sit in server code and must move (findings 4 and 5).

### New job kind (reviewed)

`audit-export` is registered in `src/server/jobs/registry.ts` with `AuditExportPayloadSchema` (strict, one `day` field). Its I/O runs in `prepare` (`exportAuditDay`), before the transaction, which the drain's `runJob` allows per attempt; the handler only marks the row done. Payload validation at the boundary is present (B5). The dedupe key is produced in lib and enqueued in `scheduleAuditExports` inside one transaction (B9). Dead letters keep their dedupe value, so a day is re-run by hand, as the comment says.

---
<sub>architecture-audit | haiku | read-only</sub>
