Head ef592de. Review rounds: (1) DB CHECKs as strict as Zod, slug history keyed per kind (PM clarification of Q5), test gaps; (2) one shared URL pattern for Zod and the CHECKs, no infinite timestamps; (3) timestamp range CHECKs, years 1000 to 9999 (the driver misreads years below 100). Builder gates at ef592de: format, lint, typecheck, test 243, test:db 124, db:check, db:generate (no file), knip, build, e2e 24. Architecture audit ran at 1f9cc49; later rounds changed CHECKs, the shared URL pattern in src/lib/catalog.ts, and tests.

PASS

## Architecture Audit: U-011 "Catalog schema and read layer" (branch unit/U-011 vs origin/integration)

Rules: `.claude/standards/architecture.md` (project). Owner changes of 2026-10-24 (B6 guest-visible exemption, B7 `TODO(U-xxx): first caller` exemption) applied as stated.
Files audited: src/lib/catalog.ts, src/lib/catalog.test.ts, src/server/db/catalog.ts, src/server/db/policies.ts, src/server/db/schema/catalog.ts, src/server/db/schema/policies.ts, src/server/db/schema/index.ts, src/server/db/policies.ts, src/server/db/migrations/0001_catalog_tables.sql, src/server/db/migrations/0002_slug_history_and_cancellation_tiers.sql, tests/db/catalog.db.test.ts, tests/db/harness.ts

### Blocking Issues
None.

Checks, rule by rule:
- B1 PASS: no drizzle-orm or @neondatabase import under src/ outside src/server/db/. Only tests/ imports them.
- B2 PASS: all decisions (age rules, weather rules, guide-only rule) live in src/lib/catalog.ts:136-209. Ordering and filtering are SQL ORDER BY and WHERE only.
- B3 PASS: src/server/db/catalog.ts:1 and src/server/db/policies.ts:1 carry `import 'server-only'`. Schema files are exempt. No process.env read in the diff.
- B4 PASS: src/lib/catalog.ts imports only zod. src/server/db/schema/catalog.ts:21 imports @/lib/catalog (server to lib, allowed).
- B5 PASS: every exported read parses its ID or slug input with Zod before the query (catalog.ts:62, 97, 110, 125, 145) and parses its output through the Zod schemas before return (catalog.ts:54, 72, 81, 90, 103, 116, 136, 156, 176). Stripped columns (taxTreatment, waiverDocumentId, createdAt, host timeZone) do not reach guest callers.
- B6 PASS:
  - listHostExperiences (catalog.ts:147) calls requireRole before its query.
  - getHostExperience (catalog.ts:175) reads the row, then calls requireRole on row.hostId before returning it. This is the permitted order.
  - The guest reads (listGuestExperiences:44, getGuestExperience:59) are filtered by the one guestVisible condition (line 31). They take no Caller and check no role, as the owner exemption allows.
  - The remaining reads (categories, neighborhoods, cancellation tiers, slug history) are reference data with no guest, host, or ops ownership, so B6 does not apply.
- B7 PASS: every export in src/server/db/catalog.ts and src/server/db/policies.ts has no non-test importer. Each carries a `TODO(U-xxx): first caller` comment naming a unit that exists in docs/plan/units.yaml:
  - U-031 (catalog.ts:42, 75, 84)
  - U-039 (catalog.ts:57)
  - U-035 (catalog.ts:93, 106)
  - U-091 (catalog.ts:119)
  - U-074b (catalog.ts:139, 159; policies.ts:7)
  All five are later than U-011.
- B8 PASS: no 'use client' in the diff.
- B9 PASS: no writes in the diff.
- B10 N/A: no money or hold writes.
- B11 PASS: tests/db/harness.ts (test support) imports drizzle-orm and @neondatabase/serverless. This is the permitted test-support exemption. src/ imports nothing vendor-side outside the wrapper.
- B12 PASS: prices are integer columns and `z.int().nonnegative()` (schema/catalog.ts:175, lib/catalog.ts:44). Migrations contain no `timestamp` without time zone. hosts.timeZone is an IANA text column (schema/catalog.ts:43). No Date.now() or argument-less new Date() in src/lib or src/server.
- B13 PASS: no catch in src/lib or src/server/db. The one catch in tests/db/harness.ts:147 returns the error to the client as HTTP 400 and is not swallowed (test support in any case).
- B14 PASS: no 'use cache', no cookies, headers, or getCaller in the guest read path. Guest reads take no caller.
- B15 N/A: no Route Handler.
- B16 N/A: no styles.

### Advisory
- src/server/db/catalog.ts:59-63 and 98, 111, 126: a malformed ID or slug returns null through safeParse. This is a not-found result, not a swallowed error, so it is acceptable. Note that an invalid ID and a missing row look the same to callers.
- src/server/db/catalog.ts:145-146: listHostExperiences returns [] for a malformed host ID before requireRole runs. No row is read, so nothing leaks, but a caller gets an empty list rather than a refusal.

---
<sub>architecture-audit | haiku | read-only</sub>
