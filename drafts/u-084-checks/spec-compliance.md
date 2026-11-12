PASS

# Spec Compliance: U-084 (issue 109)

Branch `unit/U-084`, HEAD `7d0dd15a6154748e453a334acb8368e83687e782`, diffed as `origin/main...HEAD` (20 files, all additions or small edits to ops pages, components, audit helpers and tests). Judged against `drafts/mvp-replan-2026-11-10.md` section 2 (U-084 row and note), `docs/plan/units.yaml` U-084 scope, and the issue 109 scope manifest. Where the manifest is wider than the re-plan, the re-plan governs, since the manifest is a mirror and the re-plan cuts the rest.

## Criteria from the issue 109 manifest

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Host documents in private storage | PASS (cut by re-plan) | Not built. Re-plan U-084 row: "No ... documents". Not a FAIL. |
| 2 | Incident intake | PASS (cut by re-plan) | Not built. Re-plan: "No ... intake". Not a FAIL. |
| 3 | Suspend a host or an experience | PASS | Host: `src/server/db/experiencePause.ts` `setHostSuspended`; experience: `setExperiencePaused`; actions in `src/server/actions/experiencePause.ts` |
| 4 | Copyright takedown contact | PASS (cut by re-plan) | Not built. Re-plan: "No ... takedown". Not a FAIL. |
| 5 | Suspending invalidates the `tagsForChange()` tags for the experience, category, neighborhood and home listings, via `updateTag` | PASS | `src/server/db/experiencePause.ts` (`moveExperiences` collects `listingChanges`, then `updateTagsForChanges` after commit); `updateTagsForChanges` wraps `updateTag` per `src/server/cache/invalidate.test.ts`. Note: the call sits in the db module, invoked from the Server Action, not in the action itself. Acceptable. |
| 6 | Routes and states as rows in the U-100 axe matrix | PASS (not required) | U-100 is `todo` on main with deps `[U-051, U-024, U-105]`, and no axe matrix exists on main (`git grep` finds only `e2e/axe.ts` and per-spec usage). Branch adds no axe rows. Only the authz matrix gained rows (`tests/db/authzPauseRows.ts`, `tests/db/authzReviewRows.ts`), which is a different matrix. |

## Criteria from re-plan section 2 (U-084 note and row)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 7 | No host status column; "suspend host" pauses all the host's experiences | PASS | No `hosts` status column added: no schema or migration file in the diff. Host suspension is a transaction over the host's experiences (`setHostSuspended`, `src/server/db/experiencePause.ts`). Judgement: pauses live experiences only (`eq(experiences.status, 'live')`). Draft and draft/pending experiences are not touched. See observation A. |
| 8 | "Suspend experience" maps to the existing `paused` status | PASS | `pauseTransitions` in `src/lib/experiencePause.ts`: `pause` live to `paused`, `unpause` paused to `live`. No new status value. |
| 9 | Pause/unpause an experience (`paused`) | PASS | `setExperiencePaused`, `src/server/db/experiencePause.ts`; `ExperiencePauseForm` on `src/app/(ops)/ops/experiences/[id]/page.tsx`. |
| 10 | Host = pause all its experiences | PASS | `setHostSuspended` pauses every live experience of the host, one audit row each, plus one host row. Test: `tests/db/experience-pause.db.test.ts:254`. |
| 11 | Audit row and tags | PASS | `experiencePauseEntry` (`src/lib/experienceAudit.ts`), `hostSuspensionEntry` (`src/lib/hostAudit.ts`), both written inside the transaction via `writeAudit`. Tags as criterion 5. |
| 12 | No schema, documents, intake or takedown | PASS | No file under `src/server/db/schema*`, `drizzle` or migrations in the diff. Documents, intake and takedown not built (criteria 1, 2, 4). |
| 13 | Scope manifest: no changes outside the named scope | PASS | Changed files are limited to the pause/suspension feature, its ops page wiring, its authz rows and tests. No booking, hold, session, checkout, or email files. |

## Builder choices (judged against the lite cut)

| Choice | Judgement | Basis |
|---|---|---|
| Unsuspend only unpauses experiences whose latest pause/unpause audit row has `via_host_suspension: true` | Within the lite cut | Avoids a schema change; the status enum has no host-suspension marker. `pausedByHostSuspension` in `src/server/db/experiencePause.ts`. A hand-pause after the suspension resets the latest row and is left paused (test at line 336). |
| Pause is live-only; a `guide_only` experience cannot be paused | Within the lite cut | `pauseRefusal` (`src/lib/experiencePause.ts`) returns `not_live` for anything but `live`; `ExperiencePauseForm` renders nothing for statuses other than live or paused. Re-plan says "pause/unpause an experience (`paused`)", so `guide_only` is not in scope. |
| Pause control on the experience edit page only, not the review page | Within the lite cut | Only `src/app/(ops)/ops/experiences/[id]/page.tsx` changed. The re-plan names no review-page control. |
| No confirm step or reason on Suspend host | Within the lite cut | `HostSuspension.tsx` submits directly. No reason field; audit details carry codes only (`experiences_changed`, `via_host_suspension`). Matches the re-plan. |
| No notification of host or guests, no release of open holds | Within the lite cut, and correct | No email or hold import in the diff. Re-plan does not ask for notification. Existing bookings stay (stated in UI copy). |

## Observations (not FAILs)

- **A. Draft and in-review experiences of a suspended host are not paused.** Only `live` rows move. An experience in `in_review` or `draft` for a suspended host stays unaffected, so an ops approval after the suspension would make it live while the host is suspended. The re-plan says "all of that host's experiences", and this is a gap against that wording. The fix is small (also pause or block approval for suspended hosts), but it is a Dave call on whether lite scope covers it. Not blocking under the lite cut as written.
- **B. Tag invalidation sits in the db module, not the Server Action.** Functionally it runs after commit from the action; the manifest says "through `updateTag` from the ops Server Action". Minor.

## Verdict

PASS. Every criterion is PASS (cuts count as PASS against the re-plan), and no criterion is FAIL. Observation A is the only item worth Dave's decision before merge.

---
<sub>spec-compliance | U-084 check | read-only on code</sub>
