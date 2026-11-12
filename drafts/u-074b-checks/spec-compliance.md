PASS
PR 1 of 2 (photo upload deferred to PR 2 by the lead's ruling)

# Spec compliance: U-074b (issue 91), PR 1

Branch unit/U-074b, head 51dba4806ae21cdbb24e58bb053b0bcf6d280896, diffed as `git diff origin/main...HEAD` (43 files).
Criteria source: the SCOPE MANIFEST in issue 91 (the issue has no `## Acceptance Criteria` section; its body mirrors the `scope` field of `docs/plan/units.yaml` U-074b) plus the draft row in `drafts/mvp-replan-2026-11-10.md`.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Ops routes only | PASS | New pages all under `src/app/(ops)/ops/experiences/` (`page.tsx`, `new/page.tsx`, `[id]/page.tsx`). No guest or host route added. `src/lib/opsNav.ts:25` adds an ops nav link only. |
| 2 | Every experience field editable | PASS | `src/components/ExperienceEditor/ExperienceForm.tsx` covers name, slug, description, meeting point, included, accessibility notes, duration, category, neighborhood, adult and child price, child-uses-space, cancellation tier (l.224-228), age rule, min/max age, outdoor, weather policy and decision hours, tax treatment, waiver required and waiver document (l.297-305), link-out and affiliate URLs. Field set matches the `ExperienceContent` type in `src/lib/experienceEditor.ts`. |
| 3 | Price options | PASS | Adult and child price fields, `ExperienceForm.tsx:196-207`; stored as minor units in `ExperienceContent`. |
| 4 | Cancellation tier, read from shared list without editing policy | PASS (with one note) | Read: `src/server/db/experienceEditor.ts:127` calls `listCancellationTiers()`, which feeds the form at `ExperienceForm.tsx:228`. No tier create, edit or delete in the diff. Note: `src/server/db/policies.ts` is touched only by deleting the line `// TODO(U-074b): first caller` (the file's only diff hunk). The function body, query and schema are unchanged. The TODO's condition (a caller exists) is now true, so removing it is bookkeeping, not a policy edit. Literal reading of "without editing policies.ts" is breached by one comment line. Judged acceptable because the intent (tiers are read, not changed) holds. If Dave wants the letter of the rule, restore the comment and drop it in a follow-up. |
| 5 | Waiver | PASS | `ExperienceForm.tsx:297-305` (required flag and document picker). Server side lists only published waivers (`experienceEditor.ts` `readExperienceChoices`, and the waiver check at ~l.215-218). |
| 6 | Photo upload through ingest | DEFERRED to PR 2 | Not in the diff by the lead's ruling. Grep for `photo` in `ExperienceForm.tsx` and `src/lib/experienceEditor.ts` finds nothing. Not a FAIL for this PR. Issue 91 stays open until PR 2 lands. |
| 7 | /ops/experiences index by status | PASS | `src/app/(ops)/ops/experiences/page.tsx`; status filter via `StatusFilterBar` in `src/components/ExperienceEditor/ExperiencesList.tsx:69-73`; query `readExperiencesForOps` filters `experiences.status` (`src/server/db/experienceEditor.ts:93-95`). |
| 8 | /ops/experiences index by host | PASS | Host `Select` in `ExperiencesList.tsx:85`; `hostId` filter at `experienceEditor.ts:96-98`. |
| 9 | /ops/experiences index by category | PASS | Category `Select` in `ExperiencesList.tsx:92`; `categoryId` filter at `experienceEditor.ts:99-101`. |
| 10 | Status not editable in the editor (owned by U-075/U-084) | PASS (intended absence) | No status input in `ExperienceForm.tsx`. `updateExperience` takes status from the stored row (`experienceEditor.ts:307`, `experienceRuleFailures(input, current.status)`), not from the form. |
| 11 | Axe matrix rows for the new routes and states | N/A (conditional) | The scope says rows are added by whichever of U-074b or U-100 lands second. U-100 is not on main. This PR lands first, so no row is required here. `e2e/routes.ts` has no `/ops/experiences` row yet; U-100 adds it when it lands. Re-check if U-100 merges before this PR. |
| 12 | Review and QA verdicts | N/A | Meta items, not code-verifiable. |

## Blocking issues
None for PR 1.

## Observations outside the AC list (not blocking)
- The diff also reworks the host pages and `HostSetup` (`src/components/HostSetup/*`, `src/lib/hostSetup.ts`, `src/server/actions/hosts.ts`) to use shared `opsForm` helpers. That is U-074a's surface. It is a refactor in service of this unit and may be worth a line in the PR description.
- `src/lib/catalog.ts` now exports the rule helpers. Reasonable reuse, no AC impact.

---
Verdict: PASS for PR 1 of 2. Photo upload is deferred to PR 2 by the lead's ruling. Issue 91 stays open until PR 2 lands.
