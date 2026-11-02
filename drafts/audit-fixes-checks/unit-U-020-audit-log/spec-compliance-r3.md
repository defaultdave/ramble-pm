PASS

## spec-compliance: U-020 round 3 (head 4b39c96, delta d8cded6..4b39c96) (agent verdict, recorded by the PM because the agent is read-only)

Judged against the narrowed U-020 entry in DECISIONS.md, 2026-11-01.

| # | Criterion | Status |
|---|---|---|
| 1 | The audit log exists and is insert-only | PASS (unchanged) |
| 2 | The nightly export job exists and writes a day to the audit store | PASS (`auditExport.ts`, `registry.ts`, `auditSchedule.ts`) |
| 3 | Export refuses on a provider with no locked store | PASS: both selectable providers declare `storesAudit: false`; the scheduler queues nothing, and a queued job dead-letters as `unsupported` |
| 4 | The fake does not claim a locked store | PASS (`fake.ts:62-64`, `config.ts:21`) |

`storesAudit: true` appears only in test files. Blocking: none.
