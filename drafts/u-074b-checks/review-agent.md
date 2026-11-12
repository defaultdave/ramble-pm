# U-074b review (head 6bd331b)

Verdict: REQUEST_CHANGES on size only (owner decision). No code defect found that blocks. REVIEW_OWNER_DECISION=size

Size: 4455 insertions, 16 deletions, 27 files. Source about 2150, tests/stories/fixtures about 2300. Not marked mechanical, no owner acceptance found.

Scope: all changes within scope. No policies edit (policies.ts only drops a TODO comment), no .github/.claude/docs/e2e/auth. catalog.ts change is an export-only refactor (experienceRuleIssues) for reuse; acceptable.

Owner decision (size): over 1000. Proposed split: (1) src/lib/experienceEditor.ts + experienceAudit.ts + catalog.ts export + their tests; (2) db layer + actions + authz rows + db tests; (3) pages, components, nav, stories. Or Dave accepts in writing as one unit.

Blocking (author): none.

Authz/security: PASS. requireRole/requireOpsUserId is the first line of every data function (src/server/db/experienceEditor.ts:63-ish reads, createExperience, updateExperience); page checks holdsOpsRole before reads (ops/experiences/[id]/page.tsx); action redirects non-ops and the data layer throws anyway. Filters and cursor zod-parsed, cursor uses a bound parameter. Authz matrix rows added.
Transaction: one tx per change with audit row; no-op writes nothing; row locked FOR UPDATE; tags invalidated after commit for old and new place, only for guest-visible status. Correct.

Nits / optional:
- Optional, src/server/db/experienceEditor.ts updateExperience: last-write-wins. The FOR UPDATE serializes saves but an ops user holding a stale form silently reverts another's price/field change (diff is computed against the DB, so the audit row names the second user). Fix if wanted: hidden updatedAt/version field compared in the tx, return a 'stale' status.
- Optional, readExperienceChoices: hosts capped at 500 and waivers at 200 with no signal; hosts past 500 vanish from the filter and create form.
- FYI, db/experienceEditor.ts helpers parallel hostSetup.ts (page splitting, audit pattern) as the builder reported; splitPage is shared, so remaining duplication is small.
- FYI, no README/CLAUDE.md change; nav link adds a user-facing ops area. Check whether README lists ops areas; add a line if so.
- FYI, builder-reported deviations (no photo upload, no status edit, tax editable, price not removable, grouped audit details) match the diff; spec row says "reads tiers without editing policies", satisfied.

Tests: good coverage at lib, action, component and db layers (create, update, no-op, refusals, stale ref, slug history, concurrency, tag invalidation, filters/paging, choices, authz). Not run by me; no run output reviewed.
