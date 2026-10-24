Head ef592de. Review rounds: (1) DB CHECKs as strict as Zod, slug history keyed per kind (PM clarification of Q5), test gaps; (2) one shared URL pattern for Zod and the CHECKs, no infinite timestamps; (3) timestamp range CHECKs, years 1000 to 9999 (the driver misreads years below 100). Builder gates at ef592de: format, lint, typecheck, test 243, test:db 124, db:check, db:generate (no file), knip, build, e2e 24.

PASS

# U-011 spec compliance (branch unit/U-011, diff origin/integration...HEAD, 14 files)

Sources: issue #16 (IN SCOPE, PATTERN NOTE, Q1-Q8, minimum test list), docs/plan/units.yaml U-011, PRD.md PRD-09, PRD-12, PRD-23, PRD-46, PRD-63, PRD-78. Paths are relative to the worktree root.

## Scope and record

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | IN SCOPE line: hosts, experiences, price options, categories, neighborhoods, cancellation tiers, slug history, Zod schemas, server-only reads with role checks | PASS | src/server/db/schema/catalog.ts:36-242; src/server/db/schema/policies.ts:13-31; src/lib/catalog.ts:37-234; src/server/db/catalog.ts:1; src/server/db/policies.ts:1 |
| 2 | units.yaml scope text for U-011 | PASS | same evidence as row 1; U-011 record at docs/plan/units.yaml:321-341 |
| 3 | units.yaml prd list [9,12,23,46,78,63] | PASS | PRD rows 63-68 below |

## Where things live

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 4 | Tables in schema/catalog.ts (hosts, experiences, price_options, categories, neighborhoods, slug_history) with relations() | PARTIAL | Tables at schema/catalog.ts:36, 51, 66, 81, 166, 191. Relations at schema/catalog.ts:208-242 cover hosts, experiences, priceOptions, categories, neighborhoods. slugHistory has no relations() block; it has no FK, so this is arguably moot. |
| 5 | cancellation_tiers in schema/policies.ts with relations() | PARTIAL | Table at src/server/db/schema/policies.ts:13-31. No relations() block in that file. The only link is the one-side at schema/catalog.ts:222-225. |
| 6 | Read files export read functions only (db/catalog.ts, db/policies.ts) | PASS | src/server/db/catalog.ts:44-177 (all exports are async functions); src/server/db/policies.ts:9-18 |
| 7 | Zod schemas, enum tuples, and z.infer types in src/lib/catalog.ts (Q2) | PASS | src/lib/catalog.ts:3-35 (tuples), 37-84 (schemas and types), 216-234 (guest and host experience) |
| 8 | pgEnums built from the same tuples | PASS | src/server/db/schema/catalog.ts:15-32 imports tuples from @/lib/catalog; no drizzle-zod in the diff |
| 9 | Types carry Ramble names, no *Row or *Dto | PASS | src/lib/catalog.ts:51, 58, 67, 75, 84, 225, 234 (Category, Neighborhood, CancellationTier, RetiredSlug, PriceOption, GuestExperience, HostExperience); grep finds no Row or Dto names |

## Columns

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 10 | experiences.status with the five values; guests see live and guide_only | PASS | src/lib/catalog.ts:3-12; schema/catalog.ts:104; migration 0001_catalog_tables.sql:2 |
| 11 | Slugs lower-case kebab; unique for categories and neighborhoods | PASS | schema/catalog.ts:55, 70 (.unique()), 47, 61, 76, 97, 125 (kebab CHECKs); migration 0001 lines 11, 78 |
| 12 | Experience and host addresses carry the uuid; lookup by ID (Q4) | PASS | src/server/db/catalog.ts:59-73 (getGuestExperience by id), 161-177 (getHostExperience by id); no experience or host slug lookup exists |
| 13 | slug_history (entity_kind, entity_id, slug, retired_at), unique on kind and slug | PASS | schema/catalog.ts:191-206 (uniqueIndex at 201-204); migration 0001 lines 91-97, 118 |
| 14 | price_minor integer CHECK >= 0, USD, no currency column | PASS | schema/catalog.ts:174-175, 183; no currency column |
| 15 | price option kind (adult, child) and uses_space | PASS | schema/catalog.ts:173, 176; lib/catalog.ts:28 |
| 16 | age_rule enum, min_age and max_age, CHECKs tying them to the rule | PASS | schema/catalog.ts:108-110, 123-143; migration 0001 lines 43-54 |
| 17 | outdoor with weather_policy, CHECK that outdoor rows have one (Q7) | PASS | schema/catalog.ts:105-106, 144-147 |
| 18 | tax_treatment enum, default unknown | PASS | schema/catalog.ts:111; lib/catalog.ts:26 |
| 19 | waiver_required and waiver_document_id uuid, no FK | PASS | schema/catalog.ts:112-114 (comment at 113, no references()) |
| 20 | cancellation_tier_id FK, not null (Q6) | PASS | schema/catalog.ts:94-96; migration 0001 line 112 |
| 21 | guide-only rows need link_out_url; affiliate_url optional | PASS | schema/catalog.ts:115-116, 155-157 |
| 22 | hosts.time_zone for U-012 | PASS | schema/catalog.ts:43. Note: no IANA validation in the DB or Zod (lib/catalog.ts host shape omits timeZone). Not a FAIL. |
| 23 | No soft delete; FKs on delete restrict | PASS | schema/catalog.ts:87, 90, 93, 96, 172 all onDelete 'restrict'; no deleted_at column |

## Read functions

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 24 | Guest reads take no Caller (Q1); no cookies, headers, getCaller, or clock | PASS | src/server/db/catalog.ts:44, 59, 76, 85, 94, 107, 121; src/server/db/policies.ts:9; imports at db/catalog.ts:2-28 contain no getCaller or next/headers |
| 25 | Restricted reads take caller first and check one role each (HostOwner; Ops if any ops read ships) | PASS | src/server/db/catalog.ts:141-143 (caller first), 147 and 175 (Role.HostOwner). No ops read ships, so no Role.Ops check is required. |
| 26 | Argument-scoped read calls requireRole(caller, role, { hostId }) before any query | PASS | src/server/db/catalog.ts:145-148 (requireRole at 147, query at 148) |
| 27 | Row-ID read selects the row's host_id, checks it, then returns | PARTIAL | src/server/db/catalog.ts:167-176: the full row with children is fetched first, then requireRole at 175 checks row.hostId, then the parse returns. The check runs before any return, so nothing leaks, but the pattern says select host_id, check, then return. |
| 28 | Ownership never placed in WHERE in place of requireRole | PASS | src/server/db/catalog.ts:149 uses hostId in WHERE, but requireRole at 147 runs first |
| 29 | Arguments Zod-parsed first | PASS | src/server/db/catalog.ts:62, 97, 110, 125, 145, 165 |
| 30 | Guest non-uuid returns null; lists return []; failed check throws ForbiddenError; no catch (B13) | PASS | src/server/db/catalog.ts:62-63 (null), 145-146 ([]), 147 and 175 (throw via requireRole in src/server/auth/caller.ts:51-59). No try or catch in catalog files. |
| 31 | Results Schema.parse(row), never Drizzle rows | PASS | src/server/db/catalog.ts:54, 72, 81, 90, 103, 116, 136, 156, 176; src/server/db/policies.ts:17 |
| 32 | dbRead, one statement per call; children via join or relational with; no query in a loop | PASS | src/server/db/catalog.ts:45-53, 64-71, 148-155, 167-173 (relational with); no loops over queries |
| 33 | Ships all ten named reads | PASS | listGuestExperiences:44, getGuestExperience:59, listCategories:76, listNeighborhoods:85, getCategoryBySlug:94, getNeighborhoodBySlug:107, findRetiredSlug:121, listHostExperiences:141, getHostExperience:161 (src/server/db/catalog.ts); listCancellationTiers src/server/db/policies.ts:9 |
| 34 | Read functions are imported only by tests; TODO names the first caller | PASS | TODO(U-031), U-039, U-035, U-091, U-074b markers at src/server/db/catalog.ts:42, 57, 75, 84, 93, 106, 119, 139, 159; policies.ts:7. No src/app or component file in the diff imports them. |

## Caching seam

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 35 | No import from next/cache or any cache module (U-009 owns it) | PASS | grep of db/catalog.ts, db/policies.ts, lib/catalog.ts, schema/ finds no next/cache import |
| 36 | Guest reads uncached and argument-only; results carry id, hostId, categoryId, neighborhoodId | PASS | src/lib/catalog.ts:94-100 (experienceFields ids), 216-225 (GuestExperienceSchema keeps them via omit at 217 only for taxTreatment, waiverDocumentId, createdAt) |

## Tests (ADR 0006)

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 37 | Unit: schemas accept a valid shape | PASS | src/lib/catalog.test.ts:81-90 |
| 38 | Unit: schemas strip an unknown field | PASS | src/lib/catalog.test.ts:92-104 |
| 39 | Unit: reject a bad enum | PASS | src/lib/catalog.test.ts:115-124 |
| 40 | Unit: reject min_age > max_age | PASS | src/lib/catalog.test.ts:150-154, 170-173 |
| 41 | DB test uses createFreshDatabase and serveNeonHttp from tests/db/harness.ts | PASS | tests/db/catalog.db.test.ts:19-20, 44-45 |
| 42 | DB test uses testCaller with the inserted host ID, not TEST_HOST_ID | PASS | tests/db/catalog.db.test.ts:137-139 (testCaller({ roles: [Role.HostOwner], hostIds: [hostId] })); TEST_HOST_ID not referenced. The builder added roles, which the note's example omits. |
| 43 | Minimum: guest reads hide draft, in_review, paused | PASS | tests/db/catalog.db.test.ts:155-189 (setup), 191-198, 223-237 |
| 44 | Minimum: non-uuid ID returns null | PASS | tests/db/catalog.db.test.ts:239-246 |
| 45 | Minimum: owner lists their drafts | PASS | tests/db/catalog.db.test.ts:350-365 |
| 46 | Minimum: other host's owner, anonymous caller, and guest each get ForbiddenError from both restricted reads | PASS | tests/db/catalog.db.test.ts:376-392 (also covers ops and host staff) |
| 47 | Minimum: retired slug resolves | PASS | tests/db/catalog.db.test.ts:276-293 |
| 48 | Minimum: CHECK rejects a negative price | PASS | tests/db/catalog.db.test.ts:412-420 (price_options_price_not_negative) |
| 49 | Minimum: CHECK rejects a bad age range | PASS | tests/db/catalog.db.test.ts:411-500 (experiences_age_rule_limits rows) |
| 50 | Minimum: CHECK rejects an outdoor row with no policy | PASS | tests/db/catalog.db.test.ts:411-500 (experiences_outdoor_has_weather_policy row) |
| 51 | Minimum: CHECK rejects a guide-only row with no link | PASS | tests/db/catalog.db.test.ts:411-500 (experiences_guide_only_has_link row) |

## Settled at approval (Q1-Q8)

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 52 | Q1: guest reads take no caller | PASS | src/server/db/catalog.ts:44-121. Adding the line to B6 is Dave's action and is not checked here. |
| 53 | Q2: Zod schemas in src/lib/catalog.ts, not drizzle-zod | PASS | src/lib/catalog.ts; no drizzle-zod import in the diff |
| 54 | Q3: paused hidden from guests; one guest condition | PASS | src/lib/catalog.ts:11-12; src/server/db/catalog.ts:30-31 (guestVisible), 45, 65 |
| 55 | Q4: ID-bearing addresses use the uuid, no extra column | PASS | schema/catalog.ts:84, 39 (uuid id); no slug column on the address path |
| 56 | Q5: slug history for all four kinds, written by a trigger on slug updates | PASS | src/server/db/migrations/0002_slug_history_and_cancellation_tiers.sql:5-25 (function and four triggers) |
| 57 | Q6: cancellation tiers with key, name, full_refund_hours_before, is_default; 24 default, 48, 7 days; inserted by migration | PASS | src/server/db/schema/policies.ts:13-21; migration 0002 lines 26-29 |
| 58 | Q7: rain_or_shine and decided_before_start with weather_decision_hours | PASS | src/lib/catalog.ts:21-24; schema/catalog.ts:106-107, 148-153 |
| 59 | Q8: children-use-spaces on price options only, not on the age rule | PASS | schema/catalog.ts:176 (usesSpace on priceOptions); no usesSpace on experiences (schema/catalog.ts:81-164) |

## Out of scope

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 60 | No out-of-scope feature (sessions, photos, legal docs, redirects, pricing windows, filters, tags, writes, suspension, authz matrix) | PASS | Diff file list (14 files) contains none of these; the only out-of-scope-adjacent file is tests/db/harness.ts (see flags) |

## PRD rows

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 61 | PRD-09: experience page fields (description, host, neighborhood, meeting point, duration, price per person, included, age rules, accessibility, cancellation terms) | PASS | schema/catalog.ts:97-103, 104-116 (fields), 166-185 (price per option), 191 n/a; guest shape src/server/db/catalog.ts:45-53 with host and cancellationTier; photos (U-010) and dates are out of this unit |
| 62 | PRD-12: outdoor labeled; weather policy from a fixed set | PASS | schema/catalog.ts:105-106, 144-153; lib/catalog.ts:21-24 |
| 63 | PRD-23: 21+ rule; kids' age range; children counted toward capacity and priced differently | PASS | schema/catalog.ts:108-110, 123-143 (21+ and age_range); 173 (child kind), 176 (usesSpace). Per-child age and guardian contacts are booking-side and not in this unit. |
| 64 | PRD-46: tiers from 24h to 7 days; default 24h; terms visible on host pages | PASS | src/server/db/schema/policies.ts:13-21; migration 0002 lines 26-29 (24, 48, 168 hours; flexible default); src/server/db/catalog.ts:45-53 (cancellationTier on guest reads) |
| 65 | PRD-63: adding a city changes no page address | PASS | uuid addresses (schema/catalog.ts:39, 84); slug_history triggers (migration 0002:5-25); no city column in the diff |
| 66 | PRD-78: tax treatment taxable, not_taxable, unknown; default unknown; hidden from guests | PASS | schema/catalog.ts:111; lib/catalog.ts:26, 114; lib/catalog.ts:217 (guest schema omits taxTreatment). Tax rate and finance flag are U-018 and U-056. |

## Flags (files that serve no criterion, or that touch shared code)

- tests/db/harness.ts (+29 lines, changed): adds copyMigrationsInto() and a temp migrations folder that rewrites `"public".` to a per-file schema before migrate(). It serves only tests/db/catalog.db.test.ts, and it edits the U-003 shared helper that the pattern note names as the thing to use. No criterion names it. Needs owner decision: keep as a necessary test change, or move to its own unit.
- src/server/db/migrations/meta/0001_snapshot.json, meta/0002_snapshot.json, meta/_journal.json: generated drizzle-kit plumbing that migrate() requires. They serve the migrations, not a separate criterion.
- src/server/db/schema/index.ts: now re-exports catalog and policies. Serves the schema imports; no criterion names it directly.

## Counts

- Criteria checked: 66
- PASS: 63
- PARTIAL: 3 (rows 4, 5, 27)
- FAIL: 0

Verdict: no FAIL. The three PARTIALs are a missing relations() block on cancellation_tiers, a missing relations() on slug_history (arguably not needed), and the row-ID read fetching the full row before its host check. The harness change is flagged, not counted.
