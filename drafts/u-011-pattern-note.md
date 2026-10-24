PATTERN NOTE (Dave, 2026-10-24; drafted by the PM; lever 4a). Every later catalog, booking, and host unit copies what this unit sets, so these are rules, not suggestions. Sources: design doc 3.2, 4.2, 4.2.1; PRD-9, 12, 13, 23, 24, 46, 63, 78; ADR 0001 (2026-10-18 amendment), ADR 0002, ADR 0008; .claude/standards/architecture.md; U-003 and U-116 as landed; DECISIONS 2026-10-22.

Where things live
- Tables: `src/server/db/schema/catalog.ts` (hosts, experiences, price_options, categories, neighborhoods, slug_history) and `schema/policies.ts` (cancellation_tiers), per design doc 4.2.1, with their `relations()`.
- Reads: `src/server/db/catalog.ts` and `src/server/db/policies.ts`. They export read functions only.
- Zod schemas, enum value tuples, and `z.infer` types: `src/lib/catalog.ts` (Q2). Each `pgEnum` is built from the same tuple. Types carry Ramble names (`GuestExperience`, `PriceOption`), never `*Row` or `*Dto` (B5).

Columns (on top of U-003's)
- `experiences.status`: `draft`, `in_review`, `live`, `paused`, `guide_only`. Guests see `live` and `guide_only` (Q3), through one private SQL condition that every guest read uses.
- Slugs: lower-case kebab, unique for categories and neighborhoods. Experience and host addresses carry the uuid (Q4), so lookup is by ID. `slug_history` (`entity_kind`, `entity_id`, `slug`, `retired_at`; unique on kind and slug) is read here; the 301s are U-091's (Q5).
- Money: `price_options.price_minor integer CHECK (>= 0)`, USD, no currency column. `kind` (`adult`, `child`) and `uses_space` per option (Q8).
- `age_rule` (`all_ages`, `minimum_age`, `age_range`, `twenty_one_plus`) with `min_age`, `max_age` and CHECKs tying them to the kind. `outdoor` with `weather_policy`, a CHECK that outdoor rows have one (Q7). `tax_treatment` (`taxable`, `not_taxable`, `unknown`), default `unknown`; the rate is U-018's setting. `waiver_required` and `waiver_document_id` uuid with no FK (U-018 adds it, as U-015 does for orders). `cancellation_tier_id` FK, not null (Q6). Guide-only rows need `link_out_url`; `affiliate_url` optional. Hosts carry `time_zone` (IANA) for U-012.
- No soft delete: rows leave the site by status, never by `DELETE`; FKs `on delete restrict`.

Read functions
- Guest reads take no `Caller` (Q1) and read no cookies, headers, `getCaller()`, or clock, so a `'use cache'` wrapper can hold them (B14).
- Restricted reads take `caller: Caller` first and check one role each: host reads `Role.HostOwner`, ops reads `Role.Ops` (no hierarchy, no `try`/`catch` chains over two roles). A read scoped by an argument calls `requireRole(caller, role, { hostId })` before any query; a read by row ID selects the row's `host_id`, checks it, then returns. Never put ownership in the `WHERE` in place of `requireRole`.
- Arguments are Zod-parsed first. A guest read given a non-uuid ID returns `null`, like a missing row; lists return `[]`; a failed check throws `ForbiddenError`; no `catch` (B13).
- Results are `Schema.parse(row)`, never Drizzle rows; Zod's strip keeps host-only fields off guest pages.
- `dbRead`, one statement per call: children through a join or relational `with`, no query in a loop.
- Ships: `listGuestExperiences()` (the whole guest-visible index ADR 0001 filters in memory; filters and paging are U-031's), `getGuestExperience(id)`, `listCategories()`, `listNeighborhoods()`, `getCategoryBySlug`, `getNeighborhoodBySlug`, `findRetiredSlug(kind, slug)`, `listCancellationTiers()`, `listHostExperiences(caller, hostId)`, `getHostExperience(caller, id)`. Imported only by tests until pages land; that is not B7.

Caching
- U-009 owns `cacheLife`, tags, and `tagsForChange()`, and its module is not on `integration`. This unit imports nothing from `next/cache` or any cache module. The seam: guest reads are uncached, argument-only, and every result carries `id`, `hostId`, `categoryId`, `neighborhoodId` for tagging. No page imports these reads yet.

Tests (ADR 0006)
- Unit: `src/lib/catalog.test.ts`: schemas accept a valid shape, strip an unknown field, reject a bad enum and `min_age > max_age`.
- Database: `tests/db/catalog.db.test.ts` with `createFreshDatabase` and `serveNeonHttp` from `tests/db/harness.ts` (where U-003's helper landed), set up like `client.db.test.ts`. Use `testCaller({ hostIds: [insertedHostId] })`; `TEST_HOST_ID` is not a uuid.
- Minimum: guest reads hide `draft`, `in_review`, `paused`; a non-uuid ID returns `null`; an owner lists their drafts; role denied: another host's owner, the anonymous caller, and a guest each get `ForbiddenError` from both restricted reads; a retired slug resolves; CHECKs reject a negative price, a bad age range, an outdoor row with no policy, and a guide-only row with no link.

Seed and fixtures are U-021a's, the tier rows aside (Q6).

Out of scope even though nearby: sessions and templates (U-012), photos (U-010), legal documents and settings (U-018), redirects (U-091), pricing and cancellation windows (U-111), filters (U-031), tags (U-009), writes and Server Actions (U-074a, U-074b, U-075), host suspension (U-084), the authorization matrix (U-022).

Open questions for the owner
- Q1. B6 wants `requireRole` on a host's row, but the anonymous caller holds no role and B14 bars cached code from reading the caller. Recommend: guest-visible reads take no caller; Dave adds that line to B6.
- Q2. The sources do not say where Zod schemas live. Recommend `src/lib/catalog.ts`, shared by lib, components, seed, and schema files; `drizzle-zod` would put `drizzle-orm` outside `src/server/db/`.
- Q3. Whether `paused` shows to guests, and how a discontinued experience (PRD-33) is marked. Recommend: hidden, and `paused` covers discontinued. Host status (PRD-50, U-084) is not in 4.2.1 either; recommend U-074a or U-084 add it to the one guest condition.
- Q4. "ID-bearing" names no ID. Recommend the uuid, no extra column.
- Q5. With the ID in the address, experience and host renames need no history; category and neighborhood renames do. Recommend the table for all four kinds, written by a trigger on slug updates.
- Q6. PRD-46 gives only the ends and the default. Recommend `key`, `name`, `full_refund_hours_before`, `is_default`, and rows 24 hours (default), 48 hours, 7 days, inserted by migration as reference data.
- Q7. PRD-12's set is proposed. Recommend `rain_or_shine` and `decided_before_start` with `weather_decision_hours`.
- Q8. Design doc 4.2.1 puts "children use spaces" on both the age rule and price options. Recommend price options only.
