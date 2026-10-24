Head ef592de. Review rounds: (1) DB CHECKs as strict as Zod, slug history keyed per kind (PM clarification of Q5), test gaps; (2) one shared URL pattern for Zod and the CHECKs, no infinite timestamps; (3) timestamp range CHECKs, years 1000 to 9999 (the driver misreads years below 100). Builder gates at ef592de: format, lint, typecheck, test 243, test:db 124, db:check, db:generate (no file), knip, build, e2e 24.

PM check of round 3: the round 3 review's only blocker was timestamps JavaScript cannot hold; the three CHECKs are now range CHECKs (diff checked by the PM).

REQUEST_CHANGES

U-011 round 3, head 2193d4d. Scope: all changes within scope. `pnpm test` 243/243 and `pnpm test:db` 116/116 pass on a throwaway Postgres 17 (compose project `u011fin`, container and volume removed afterwards). The worktree is clean; I added and deleted one temporary db test file, so no changes remain.

## Round 2 blockers: both fixed

1. URL pattern. I read `httpUrlPattern` out of `src/lib/catalog.ts` and ran the same text as a JS RegExp and as Postgres `~` on 100,075 inputs.
   - Inputs: 75 hand-picked and 100,000 fuzzed. The hand-picked set covered case, `XN--`, unicode and fullwidth, newlines, CR, ports (0, 65535, 65536, 00080, 099999, Arabic-Indic digits), userinfo, IPv6, IPs, trailing dots and underscores. The fuzz mixed random characters with structured host, port and path parts.
   - Result: 0 mismatches. 7,676 inputs were accepted.
   - Backtracking: 36 strings of 1k to 300k characters (long label chains, long paths, trailing garbage, repeated colons). JS took at most 1.3 ms and Postgres at most 17 ms. No catastrophic backtracking in either engine.
   - Both CHECKs and both snapshots carry the exact text, and `tests/catalog-migration.test.ts` pins it.
2. `isfinite()` CHECKs are present on `hosts.created_at`, `experiences.created_at` and `slug_history.retired_at`. `infinity` and `-infinity` are refused.

Kebab slug pattern: 80,000 fuzzed inputs with unicode, newlines, `K`, `ſ` and 100k-character strings gave 0 mismatches between JS and Postgres.

## Blocking: one remaining stored row that makes a read throw

`isfinite()` is not the same as "a date JavaScript can hold". Postgres timestamptz accepts BC dates and years above 275760. The Neon HTTP read path turns these into an Invalid Date, and `z.date()` rejects it. I reproduced this end to end through `dbRead` with a temporary db test:

| stored value | `getHostExperience` (`created_at`) | `findRetiredSlug` (`retired_at`) |
|---|---|---|
| `0044-03-15 BC` | throws ZodError (invalid_type, Invalid Date) | throws |
| `275761-01-01` | throws | throws |
| `294276-12-31` | throws | throws |
| `9999-12-31`, `10000-01-01` | ok | ok |

- Affected columns: `experiences.created_at`, which `listHostExperiences` and `getHostExperience` read, so one bad row breaks the whole host list. Also `slug_history.retired_at`, read by `findRetiredSlug`.
- Fix: replace `isfinite(x)` in the three CHECKs with a range CHECK that JS can hold, for example `x >= '0001-01-01 00:00:00+00' AND x < '10000-01-01 00:00:00+00'`.
- Keep the `schema/catalog.ts` helper, the migration and both snapshots in step. Add a db test that refuses `0044-03-15 BC`, `10000-01-01` and `infinity`.
- This is the same class as the round 2 `infinity` blocker. It needs a hand-written date, since the defaults and the trigger all use `now()`. By the "a stored row makes a read throw" rule it blocks.

## Column sweep: everything else agrees

- Slugs on hosts, categories, neighborhoods and experiences: same pattern in the CHECKs and `SlugSchema`.
- `name`, `key` and `time_zone`: the DB is stricter than Zod (`[^[:space:]]` against `min(1)`), so it is safe.
- `description`, `meeting_point`, `included`, `accessibility_notes`: free text with no Zod constraint.
- `duration_minutes`: `> 0` or NULL in both.
- Age rule, min and max: the CHECK and `ageRuleIssues` are equivalent in all four rules.
- `outdoor` and `weather_policy`, and `weather_decision_hours`: the CHECK and `weatherIssues` are equivalent.
- `guide_only` requires a link in both.
- URLs: one shared pattern.
- Enums: the same tuples feed Postgres and Zod.
- uuids: `z.guid()` accepts anything a uuid column can hold, nil included.
- `price_minor >= 0`: matches `int().nonnegative()`.
- `full_refund_hours_before >= 0`: matches.
- `slug_history.slug` has no CHECK, but `findRetiredSlug` only returns rows equal to a kebab-validated query slug, so it cannot throw.
- The hidden-status guard and `requireRole` ordering are unchanged from the earlier approved rounds. I found no cross-host data leak.

## Nit

- Pattern file `src/server/db/schema/catalog.ts`: `sql.raw` with the pattern pasted in is safe because the text is a constant, but a comment saying why (no parameter binding in DDL) would help the next reader.

--- Round 1 review
REQUEST_CHANGES

# U-011 Catalog schema and read layer: review at 1f9cc49 (critical tier, pattern-setter)

REVIEW_VERDICT=REQUEST_CHANGES

Scope audit: all changes within scope. 14 files, all under the manifest's tables, reads, Zod, migrations, tests. No `.claude/`, `docs/plan/`, `.github/`, `package.json`, or `CLAUDE.md` changes. The one file the manifest does not name, `tests/db/harness.ts`, is needed by the unit's own tests (see finding N2). Docs-currency: no user-facing surface added, so no README/CLAUDE update owed. Logging audit: no `console.*` or `logger.*` calls.

Method: read the full diff and issue #16, and applied 0000, 0001 and 0002 to a throwaway Postgres 17 container (removed afterwards; nothing in the repo or on GitHub was touched) to probe CHECKs and triggers directly. I did not rerun the builder's suites.

Pattern-note audit, rule by rule (all met unless a finding below says otherwise):
- Files and `relations()`: met. Reads in `db/catalog.ts` and `db/policies.ts` export reads only. Zod, tuples and types in `src/lib/catalog.ts`; each `pgEnum` is built from the same tuple. Names are Ramble names (B5).
- Columns, enums: met; status set, age/weather/tax/waiver columns, `price_minor integer`, `cancellation_tier_id` NOT NULL, tier rows by migration.
- No soft delete: met; every FK is `on delete restrict`, no `deleted_at`.
- Guest status condition: met. One private `guestVisible` built from `guestVisibleStatuses`, used in both guest experience reads, and the guest schema's status enum is narrowed to the same tuple.
- Guest reads take no `Caller`, read no cookies, headers, clock: met. No `next/cache` or cache-module import: met.
- Restricted reads: met. `caller` first, one role (`HostOwner`), `requireRole` before any query in `listHostExperiences`, and on the row's `hostId` in `getHostExperience`. No ownership in a `WHERE`, no `catch`.
- Zod-parsed arguments, `Schema.parse` results, `dbRead`, one statement per call (relational `with`, no loop): met.
- B7: all ten exports carry `TODO(U-xxx): first caller`; the five unit ids exist in `docs/plan/units.yaml` and are plausible first callers.
- Tests: the note's minimum list is covered.

## Blocking

### B1. The database CHECKs are looser than the Zod schemas, so one bad row makes a whole read throw
`src/server/db/schema/catalog.ts:55,70` (and `:39,98`, hosts and experiences `name`), `:115-116` (URLs), `src/server/db/schema/policies.ts:19` (`key`), against `src/lib/catalog.ts:43,51,60,100,107,141-142`.

Because results are `Schema.parse`d (per the pattern note), any row the DB accepts but Zod rejects takes down every caller of that read, not just that row. Verified on Postgres 17 against the committed migrations:
- `INSERT INTO categories(slug,name) VALUES ('empty','')` succeeds. `CategorySchema` has `name: z.string().min(1)`, so `listCategories()` would throw for every browse page. Same for `neighborhoods.name`, `hosts.name`, `experiences.name`, `cancellation_tiers.key` and `name`.
- A guide-only row with `link_out_url = 'http://'` succeeds (the CHECK is only `~* '^https?://'`). `z.url()` rejects `http://`, `https://a b`, `http://:80`, so `listGuestExperiences()` would throw for the entire index.

This is the pattern every later write unit copies, and the first write unit that forgets a Zod parse (or a seed row, U-021a) turns the browse page into a 500. Fix, in the unmerged `0001` (regenerate it; no production data yet):
1. Add `CHECK (length(btrim(name)) > 0)` on all four `name` columns, `key` and `name` on `cancellation_tiers`, and keep Zod at `min(1)` (or make both trim).
2. Tighten the URL CHECK to something that cannot be shorter than a host, for example `~* '^https?://[^[:space:]/?#]+'`, and make the Zod URL schema and the CHECK agree on what a valid link is. State in a comment which side is authoritative.
3. Add `it.each` rows to the constraints table in `tests/db/catalog.db.test.ts` for an empty name and `http://`.
The rule to carry forward: any Zod refinement on a read schema is mirrored by a CHECK, or dropped from the read schema.

## Non-blocking, should fix in this PR (cheap)

### N1. Slug history for `experience` and `host` is ambiguous and lossy, and the migration comment is wrong
`src/server/db/migrations/0002_slug_history_and_cancellation_tiers.sql:1-4,8-16`.
The comment says a retired slug can never point at the address it came from. That holds only for categories and neighborhoods, whose slugs are unique. Experience and host slugs are not unique, and I reproduced two failures:
- Experiences X and Y both have slug `pottery`. Rename X to `pottery-2`: `slug_history` now holds (experience, pottery -> X) while Y is live at `pottery`.
- Insert any new experience Z with slug `pottery`: the trigger's `DELETE` removes X's history row. History count goes to 0.
Nothing reads these two kinds yet, and the address carries the uuid, so there is no live harm. But the table is the pattern for the next 301 unit, and the note's Q5 itself says experience and host renames "need no history". Two options for Dave (decision D6 below): (a) keep four kinds and fix the comment to say experience/host history is best-effort, last-writer-wins, and may be wiped; or (b) restrict the trigger to category and neighborhood and drop `experience` and `host` from `slug_entity_kind` (smaller surface, no wrong data). I lean (b), but Q5 settled "all four", so it is Dave's call; at minimum fix the comment.

### N2. `tests/db/harness.ts`: the `"public".` rewrite is safe and needed; record two constraints
`tests/db/harness.ts:35-50,72-81`.
- Needed: drizzle-kit hardcodes `"public"."enum"` and `REFERENCES "public"."table"` for the default schema. The first test file would build the enums in `public` and the second would fail with "type already exists". This is the first migration with enums and FKs, so it first bites here. The unit's own tests need it, so it is in scope even though the manifest does not name the file. It does not hide a real migration problem: the shipped SQL is exercised unmodified by CI (`.github/workflows/ci.yml:63`, `pnpm db:migrate`, and `db:check` at `:65`).
- Cleanup is correct (`finally` removes the temp folder, even when `migrate` throws); the schema name is `t_` plus 12 hex chars, so no quoting or injection concern.
- Constraints to write down (a one-line comment is enough): (1) the rewrite only covers the quoted `"public".` form, so a hand-written custom migration that writes `public.x` unquoted would leak into the shared schema in tests; `0002` correctly uses unqualified names, and that is the convention custom migrations must follow. (2) The tests run rewritten SQL, so `test:db` does not prove the `"public"` form; only the CI migrate step does. Neither blocks. The more robust long-term alternative is a database per test file (`CREATE DATABASE ... TEMPLATE`), which tests the shipped bytes; not for this unit.

### N3. Tests miss two branches of the new SQL
`tests/db/catalog.db.test.ts:276-328,410-501`.
- The trigger's insert path (`DELETE FROM slug_history` on `INSERT`) has no test. The "live again" test goes through `UPDATE`. Removing the `DELETE` for inserts fails nothing, so a category created with a previously retired slug would still 301 away from itself.
- `experiences_weather_decision_hours` is tested only for "decide-before-start with no hours". The other arms are untested: `rain_or_shine` with hours set (rejected, verified by hand), hours of 0, and hours with a null policy. Add them to the same `it.each`. Also add `duration_minutes = 0`, `cancellation_tiers.full_refund_hours_before = -1`.

## Nits

- `src/server/db/policies.ts:6` says "Exactly one tier is the default". The partial unique index guarantees at most one. `UPDATE cancellation_tiers SET is_default = false` leaves none (verified). Say "at most one", or have the first caller handle none.
- `0002...sql:33-36` tier `INSERT` has no `ON CONFLICT (key) DO NOTHING`. Not an idempotence problem under drizzle's one-time journal, but U-021a will want to re-run seeds; tier ids are random per database, so every later unit must look tiers up by `key`, never by a pasted uuid. Worth one sentence in the PR.
- `src/lib/catalog.ts:133` and `experiences.min_age`/`max_age`: no upper bound (2,000,000 accepted). Cosmetic.
- `src/lib/catalog.ts:229` comment says `HostExperienceSchema` is "for the owning host and for ops", but the only read refuses ops (the no-hierarchy rule, and a test says so). Reword.
- `experiences.hosts.time_zone` has no CHECK (cannot be validated in SQL); the builder already notes the unit-test follow-up.

## NULL-semantics audit of every CHECK (as asked)
- `experiences_age_rule_limits`: correct after the builder's fix; every arm pins both limits (`IS NULL` or `IS NOT NULL`), and `age_rule` is NOT NULL, so no arm can evaluate to unknown.
- `experiences_weather_decision_hours`: `coalesce(policy = 'decided_before_start', false) = (hours IS NOT NULL) AND coalesce(hours > 0, true)`; both sides are boolean-valued, never null. Correct (I probed `rain_or_shine` plus hours: rejected).
- `experiences_outdoor_has_weather_policy`, `experiences_guide_only_has_link`: left operands are NOT NULL, right operands use `IS [NOT] NULL`. Correct.
- `experiences_duration_positive` (`NULL > 0` passes by design, column nullable), `price_options_price_not_negative`, `cancellation_tiers_hours_not_negative` (NOT NULL columns): correct.
- `experiences_urls_are_http`: null-guarded. Correct, but see B1 for strength.
- Slug regex: `$` anchors at true end, so a trailing newline is refused (probed). Correct.
No additional NULL bug found. The remaining CHECK defect is strength (B1), not NULL handling.

## Migrations
- `0001` (generated) and `0002` (custom) apply cleanly in order to an empty Postgres 17 and the journal is monotonic (`when` increases). Snapshot 0002 equals 0001, as expected for a custom migration. `drizzle-kit check` and a no-change `generate` are reported clean by the builder; CI also runs `db:check`.
- `retire_slug()`: `CREATE FUNCTION` has no `OR REPLACE`, and `retire_slug` and `slug_history` are unqualified, so it resolves through `search_path` at call time. Fine for production (`public`) and for the per-test schemas. Not SECURITY DEFINER, which is right. `OLD` is referenced in an `INSERT` firing behind `TG_OP = 'UPDATE' AND`; this works on PG 11+ (OLD is a null record) and Neon is 15+. The `UPDATE OF slug` list fires on unchanged slugs too, but the `IS DISTINCT FROM` guard handles it.
- Concurrency: two simultaneous renames to the same slug of the same kind collide on the unique index and one fails with 23505; acceptable (surfaces, does not corrupt).

## getHostExperience: null before the role check
`src/server/db/catalog.ts:167-175`. A well-formed uuid with no row returns `null`; one that exists but belongs to another host throws `ForbiddenError`. Any caller, including the anonymous one, can therefore tell "exists" from "missing" for a uuid, in any status including `draft`. Real, but it exposes one bit about a 122-bit random id that is not published for non-live rows; guessing is infeasible and live ids are public anyway. It is not a cross-host data leak. The note's pattern (select row, check host, then return) cannot avoid an existence signal without either throwing `ForbiddenError` for a missing row (which turns a stale link into a 403 for the real owner) or returning `null` for forbidden (which contradicts "a failed check throws"). Recommendation: accept as is, and say so in the pattern note so later by-ID reads (bookings, orders) do not copy it where ids ARE guessable or shown to third parties. For those, a missing row must be indistinguishable from someone else's.

The same reasoning covers D5 (malformed ids return `[]`/`null` before the role check): the signal is id syntax only.

## Decisions for Dave: my recommendation on each
1. Content columns beyond the named list: accept. All nullable so drafts save. Add to the editor unit (U-074b) a publish-time completeness check, because nothing in the DB stops a `live` row with a null description, meeting point and duration.
2. Unique `(experience_id, kind)`: accept. Dropping an index later is trivial; adding one over dirty data is not.
3. Guest result shape (no `taxTreatment`, `waiverDocumentId`, `createdAt`, narrowed host, embedded tier and prices): accept. Checkout units get a narrower server read for tax and waiver.
4. `getHostExperience` order of checks: accept (see section above); carry the caveat forward for guessable or third-party-visible ids.
5. Malformed ids on restricted reads: accept.
6. Trigger on insert plus delete-when-live-again plus last-wins: accept for category and neighborhood. For experience and host see N1: restrict to those two kinds (my preference) or document best-effort.
7. Extra CHECKs (http-only URLs, positive durations, kebab slugs): accept, and strengthen per B1. The `javascript:` URL guard is worth keeping.
8. Tier keys and names (`flexible`, `moderate`, `strict`): accept. Keys are stable identifiers; ids differ per database.
9. Harness change: accept, with the two notes in N2.

## Verdict basis
Everything in the pattern note is met except for B1, which is a concrete, cheap-to-fix correctness gap in the pattern this unit sets (a regenerated `0001`, three or four `CHECK`s, and a few test rows). Fix B1, preferably N1 and N3, then this is an APPROVE for Dave's promotion batch.
