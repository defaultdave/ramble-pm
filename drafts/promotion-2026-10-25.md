## Promote integration 2026-10-25

Opened from `promote/2026-10-25`, a branch cut from `integration`, so merging it deletes only that branch (DECISIONS 2026-10-25).

### Critical-tier units in this batch

**U-011 Catalog schema and read layer** (PR #189, issue #16, pattern-setter)
- Tables for hosts, experiences, price options, categories, neighborhoods, slug history, and cancellation tiers; Zod schemas in `src/lib/catalog.ts`; ten server-only read functions (guest reads take no caller; restricted reads check one role).
- Built to your pattern note, with one PM clarification of Q5: experience and host slug history is keyed per entity (DECISIONS 2026-10-24).
- Review: three rounds. Fixed: database CHECKs looser than the Zod read schemas (blank names, URLs, punycode hosts, infinite and out-of-range timestamps); slug history keys; test gaps. Final review found no blocker.
- QA PASS (migrations apply twice cleanly; every bad row rejected by hand), spec PASS (63 of 66, 3 partial), architecture PASS.
- Two migrations: `0001_catalog_tables`, `0002_slug_history_and_cancellation_tiers` (custom: `retire_slug()` trigger and the three tier rows).
- Decisions the builder left for you are in the PR body (#189), with the reviewer's recommendation on each.

### Also in the diff
- The sync merge commit from PR #190 (main's PR #188 and #182, already on main).

### Not yet available
- No overnight race or access suites exist yet; nothing to report for them.

### After merging
- Production database: run the `db-migrate-production` workflow before promoting any deployment that reads the catalog. No production page reads it yet, so the order is not urgent this week.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
