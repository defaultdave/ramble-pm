# U-020 pattern note

(The designated path /Users/davidfleming/Workspace/ramble-pm/drafts/u-020-pattern-note.md was refused by the worktree isolation guard on Write, so the note is here. Copy it over if wanted.)

Scope. Building: insert-only `audit_log`, `audit_writer` role, trigger blocking UPDATE/DELETE/TRUNCATE, transaction-only `writeAudit`, nightly `audit-export` job on the U-005 outbox scheduled from the pulse, written through the storage port (fake provider), PII-inventory and retention rows. Not building: storage accounts, secrets, deploys, audit calls in any feature, any other unit.

## Table shape (`audit_log`)
- `id` bigint identity PK; `recorded_at` timestamptz default `clock_timestamp()`.
- `actor_kind` enum `user|guest|system`; `actor_id` uuid, present exactly when kind is `user`. A guest acting by capability token is identified by the subject, so the table holds no guest person link. No FK yet: TODO(U-004a) as for `ledger_entries.created_by`.
- `action` text (dotted lower snake, <=64), `subject_kind` text (lower snake, <=40), `subject_id` uuid NOT NULL. Text, not enum, so later units add actions with no migration (same as `jobs.kind`); lib and CHECK state one pattern.
- `details` jsonb: flat object, keys lower snake <=40, values safe integers, booleans, null, or id-like strings (no spaces, no `@`) <=100. Ids, codes, amounts; never free text. Lib caps 16 keys; CHECK enforces shape plus a 4096-byte ceiling.

## Role grants
`audit_writer` NOLOGIN, REVOKE ALL, GRANT INSERT, SELECT; duplicate-safe creation as `ledger_writer`.

## Trigger
`guard_audit_log()` raises `restrict_violation`; BEFORE UPDATE OR DELETE per row and BEFORE TRUNCATE per statement; fires for the owner. Own `--custom` migration.

## Export job
Kind `audit-export`, payload `{day}` (UTC day of `recorded_at`). Pulse enqueues the last 7 complete days with dedupe key `audit-export:<day>`; a day is due 1 hour after it ends; judged on the system clock never the demo `asOf`. Handler (all I/O in `prepare`, outside the job transaction) pages rows by id (2,000 per page), puts `audit/<day>/part-NNNN.ndjson` then `audit/<day>/manifest.ndjson` (written for an empty day too); an existing key is an earlier attempt and is skipped; over 50 parts throws. Storage port gains an `audit/` prefix: ndjson only, no public address, no signed link, no delete; Vercel Blob adapter refuses it.

## Retention
Rows kept for good (trigger allows no purge). Export objects: the bucket's lock period. Both `pending_counsel` (Q-16) rows in the retention schedule.
