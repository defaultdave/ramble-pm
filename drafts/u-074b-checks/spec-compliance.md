FAIL

# Spec compliance: U-074b (issue 91) Experience editor

Branch `unit/U-074b`, head `6bd331b5e7c8a7b4193965d624cd386441de9862`, checked against `drafts/mvp-replan-2026-11-10.md` (section 2, U-074b row) and `docs/plan/units.yaml` (U-074b, line 1880). `docs/` has no separate acceptance-criteria list for U-074b; the criteria below are the units.yaml scope line, the issue 91 scope manifest, and the replan lite-cut text.

Replan row: `IN | MVP-2 | Ops routes only, reads cancellation tiers without editing policies.ts. +/ops/experiences index by status, host, category`

## Criteria

| # | Criterion | Status | Evidence | Lite cut? |
|---|---|---|---|---|
| 1 | Every experience field editable (content columns) | PASS | `src/components/ExperienceEditor/ExperienceForm.tsx` renders every content column of `experiences` (`src/server/db/schema/catalog.ts:158-200`): host, name, slug, description, meeting point, included, accessibility notes, duration, category, neighborhood, outdoor, weather policy and decision hours, age rule, min/max age, tax treatment, waiver required and document, link-out and affiliate URLs. Saves via `updateExperienceAction` (`src/server/actions/experiences.ts`). | n/a |
| 2 | Price options (adult, child) | PASS | `ExperienceForm.tsx:193-217` (`adultPrice`, `childPrice`, `childUsesSpace`); upsert on `priceOptions` in `src/server/db/experienceEditor.ts:229-232`. | n/a |
| 3 | Cancellation tier | PASS | Select `cancellationTierId` at `ExperienceForm.tsx:224-231`, options from `readExperienceChoices` (`src/server/db/experienceEditor.ts:127`, calls `listCancellationTiers`). | n/a |
| 4 | Waiver | PASS | `waiverRequired` and `waiverDocumentId` at `ExperienceForm.tsx:298-311`; waiver choices limited to published waiver documents (`experienceEditor.ts:138`, `:215-218`). | n/a |
| 5 | Photo upload through ingest | FAIL | Not found. No photo field or upload action in the diff. `ingestPhoto` exists in `src/server/photos/ingest.ts:44` and `photos` table in `src/server/db/schema/catalog.ts:279`, so the seam is present on main. The replan does not cut it: the U-074b row lists no photo exclusion, and the row is `IN`, not `IN-LITE`. Only U-021b (seed photos) and U-075 (alt-text check) mention photos in the replan. | **No.** Missing requirement. The builder's stated reason (replan excludes it) is not in the replan text. |
| 6 | Reused for ops edits after go-live (edit path works on live experiences) | PASS | Edit route `src/app/(ops)/ops/experiences/[id]/page.tsx` reads any status via `readExperienceForOps`; `updateExperienceAction` checks guest-visible status for cache invalidation (`experienceEditor.ts:323`). | n/a |
| 7 | Ops routes only | PASS | Diff adds only `src/app/(ops)/ops/experiences/{page,new/page,[id]/page}.tsx`, each gated by `holdsOpsRole` / `OpsAccessDenied`. No guest or host routes added. | Yes, in lite cut |
| 8 | Reads cancellation tiers without editing policies.ts | PASS, with a note | `listCancellationTiers` is called from `experienceEditor.ts:44,127`. No tier logic changed. But the diff does edit `src/server/db/policies.ts` (deletes the `// TODO(U-074b): first caller` line, 1 line). The lite cut says "without editing policies.ts", so the literal wording is breached by a comment removal. Non-behavioral. | Yes, in lite cut. Literal nit: restore the line or accept the removal. |
| 9 | +/ops/experiences index by status | PASS | `src/app/(ops)/ops/experiences/page.tsx`; status filter `FiltersSchema` and `eq(experiences.status, …)` in `src/server/db/experienceEditor.ts:60-95`. | Yes, in lite cut |
| 10 | +/ops/experiences index by host | PASS | Same query, `eq(experiences.hostId, …)` (`experienceEditor.ts:96-98`); host select from `choices.hosts`. | Yes, in lite cut |
| 11 | +/ops/experiences index by category | PASS | Same query, `eq(experiences.categoryId, …)` (`experienceEditor.ts:99-101`). | Yes, in lite cut |
| 12 | Status editable | Not met, deviation accepted | Status is not editable; `experienceEditor.ts:34` states that the review queue (U-075) and pause (U-084) own status. Create always writes `draft` (`ExperienceForm`, `new/page.tsx` copy). | **Yes, within the lite cut in spirit.** units.yaml gives approve/reject to U-075 and pause to U-084, both of which depend on U-074b. The issue's "every field" line is about content fields. Decide with Dave if he wants a status control here. |
| 13 | Axe matrix rows for new routes (whichever of U-074b and U-100 lands second) | PASS (not due yet) | U-100 is a test-bed unit that runs after MVP-3 (replan line 222). No matrix exists on main. U-074b is landing first, so it need not add rows. | n/a |

## Blocking

- **Criterion 5 (photo upload through ingest):** add a photo upload to the experience edit page that calls `ingestPhoto` (`src/server/photos/ingest.ts:44`) and links the result to the experience. Keep the ops-only route scope. Either build it, or get Dave to amend the replan row to cut it. The builder's note alone does not cut it.

## Non-blocking

- Criterion 8: the policies.ts edit is a comment deletion. Restore the line to match the literal lite cut, or accept it.
- Criterion 12: status not editable matches the lite cut's ownership split. Confirm with Dave.

## Scope check

Diff touches 27 files, all under ops routes, `src/components/ExperienceEditor`, `src/lib/experience*`, `src/server/db/experienceEditor.ts`, `src/server/actions/experiences.ts`, `src/lib/catalog.ts`, `src/lib/opsNav.ts` (adds the Experiences nav link), and tests. No out-of-scope route, schema, or migration changes. `src/lib/catalog.ts` changed by 39 lines; not audited here (review's job).

Verdict: FAIL, 1 blocking AC (criterion 5).
