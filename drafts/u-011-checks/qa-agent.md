Head ef592de. Review rounds: (1) DB CHECKs as strict as Zod, slug history keyed per kind (PM clarification of Q5), test gaps; (2) one shared URL pattern for Zod and the CHECKs, no infinite timestamps; (3) timestamp range CHECKs, years 1000 to 9999 (the driver misreads years below 100). Builder gates at ef592de: format, lint, typecheck, test 243, test:db 124, db:check, db:generate (no file), knip, build, e2e 24. QA ran at 1f9cc49; later rounds tightened CHECKs, and each re-review re-ran migrations and hostile inserts on Postgres 17.

PASS

U-011 Catalog schema and read layer, branch unit/U-011, head 1f9cc49. Postgres 17 via `docker compose -p u011qa up -d --wait` (fresh volume), psql run through `docker exec` in the container (no local psql). Container, volume and network removed at the end; `git status` clean. No browser testing (not needed).

1. Suites: PASS
   - `pnpm test`: 19 files, 236 tests passed.
   - `pnpm test:db`: 2 files, 49 tests passed.
   - `pnpm db:check`: "Everything's fine".
   - `pnpm db:generate`: "No schema changes, nothing to migrate"; no file written (git status empty).

2. Migrate: PASS
   - Empty database, `pnpm db:migrate` -> "migrations applied successfully". Seven tables created (cancellation_tiers, categories, experiences, hosts, neighborhoods, price_options, slug_history).
   - Second run: success, and drizzle.__drizzle_migrations still holds exactly 3 rows (0000, 0001, 0002), so it is a no-op.

3. Constraint breaking (each tried by hand; valid controls inserted fine first): PASS
   - negative price (-1): rejected, price_options_price_not_negative
   - minimum_age with null min_age: rejected, experiences_age_rule_limits
   - age_range max 5 < min 10: rejected, experiences_age_rule_limits
   - outdoor=true with no weather_policy: rejected, experiences_outdoor_has_weather_policy
   - status guide_only with no link_out_url: rejected, experiences_guide_only_has_link
   - non-http URLs: link_out_url `ftp://x.com` and `javascript:alert(1)`, affiliate_url `mailto:a@b.c`: all rejected, experiences_urls_are_http
   - delete host that has experiences: rejected, FK experiences_host_id_hosts_id_fk (ON DELETE RESTRICT)
   - duplicate category slug: rejected, categories_slug_unique
   - Positive controls accepted: age_range 5-10, outdoor with rain_or_shine, guide_only with https link, price 1000.

4. Slug trigger: PASS
   - Renamed category qa-cat -> qa-cat-2: slug_history = {qa-cat}.
   - Renamed qa-cat-2 -> qa-cat-3: slug_history = {qa-cat, qa-cat-2}, both old slugs held.
   - Renamed back qa-cat-3 -> qa-cat: qa-cat dropped from history; history = {qa-cat-2, qa-cat-3}.

5. Cancellation tiers: PASS
   - After migrating twice (and after test:db ran), cancellation_tiers has exactly one row each: flexible (24h, default), moderate (48h), strict (168h).

Observation (not a failure, not in the brief): the retire_slug trigger also fires on INSERT. Inserting a brand-new category with the slug `qa-cat-2` (retired by the first category) succeeded and removed qa-cat-2 from slug_history. So a retired slug can be claimed by a different row of the same kind, and its redirect history disappears. Confirm this is intended.
