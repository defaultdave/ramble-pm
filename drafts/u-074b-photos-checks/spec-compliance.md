PASS
PR 2 of 2 (photo upload through ingest). Issue 91 can close once this PR merges.

# Spec compliance: U-074b part 2 (issue 91), photo upload

Branch unit/U-074b-photos, head c27211aed4bbb448727444ea9e00208a2654690c, diffed as `git diff origin/main...HEAD` (27 files). PR 1 is already on origin/main, so its files do not appear in this diff.
Criteria source: the SCOPE MANIFEST in issue 91, the U-074b row in `drafts/mvp-replan-2026-11-10.md`, `docs/plan/units.yaml` U-074b scope ("photo upload through ingest"), and criterion 5 of `drafts/u-074b-checks/spec-compliance.md`, which was deferred to this PR.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Ops uploads a photo from the edit page through ingest and addPhoto | PASS | `src/app/(ops)/ops/experiences/[id]/page.tsx:79` passes `addExperiencePhotoAction`; `src/components/ExperienceEditor/ExperiencePhotos.tsx` (form, `action={add}`); `src/server/actions/experiencePhotos.ts:34` calls `addPhoto`; `src/server/db/photos.ts:184` calls `ingestPhoto(upload)` (bounded, re-encoded, no location data). |
| 2 | Alt text with the photo (or decorative mark) | PASS | `ExperiencePhotos.tsx` alt-text `Input name="altText"` and `CheckField name="decorative"`; `src/lib/photoForm.ts` `parsePhotoForm` builds `description` as decorative or alt text, validated by `NewPhotoSchema`; invalid alt text redirects with `photo_invalid` and field `altText`. |
| 3 | Rights record with the photo | PASS (supporting) | `ExperiencePhotos.tsx` rights fields; `photoForm.ts` `rights` block; `photos.ts` audit records `rightsBasis`. Not a named AC, noted for completeness. |
| 4 | Audit | PASS | `src/server/db/photos.ts` (inside the insert transaction) `writeAudit(tx, photoAddedEntry(...))`; `src/lib/experienceAudit.ts` `photoAddedEntry` writes `experience.photo_added` with photo id, position, decorative, rights basis. Caller without a user is refused (`photos.ts`, `userId` check). |
| 5 | Tag invalidation after a photo commits | PASS | `src/server/db/photos.ts` after the transaction: `updateTagsForChanges([{ kind: 'photos', experienceId }])`, guarded by `isGuestVisible(experience.status)`; `src/lib/cacheTags.ts` new `'photos'` kind mapped to `tags.experience(...)`; `src/lib/cacheTags.test.ts` covers it. |
| 6 | TODO(U-074b) markers resolved where this part is the first caller | PASS | Removed from `src/server/db/photos.ts` (`ExperienceNotFoundError`, `PhotoLimitError`, `addPhoto`), `src/server/photos/ingest.ts` (`PhotoRefusedError`), and `src/server/coverPhotos.ts` (the cover-tag TODO, now described as published by `addPhoto`). `policies.ts` TODO was already gone on origin/main. |
| 7 | listHostExperiences / getHostExperience left for NEW-6 | PASS (left in place) | `src/server/db/catalog.ts:104` and `:124` still carry `// TODO(U-074b): first caller`; no caller added in the diff; no NEW-6 marker. Consistent with the instruction. Non-blocking: the marker still names U-074b, so re-tag it `TODO(NEW-6)` when NEW-6 is picked up or in a follow-up. |
| 8 | Delete and reorder are outside the lite cut | PASS (correctly absent) | Neither is named in the issue 91 scope manifest, the `units.yaml` U-074b scope line, or the draft U-074b row. The diff has no delete or reorder code (grep of the diff finds only unrelated uses of "remove"/"move" text). Only add is in scope; `addPhoto` appends as last in gallery. |
| 9 | Routes and states as rows in the U-100 axe matrix | N/A (conditional, see note) | Scope says whichever of U-074b or U-100 lands second adds the rows. No `e2e/` change in this diff; `e2e/routes.ts` has no `/ops/experiences` row. U-100 is not on main as of the PR 1 check. If U-100 has merged by merge time, confirm its matrix covers the photo add states, or add the rows here. |
| 10 | Review and QA verdicts | N/A | Meta items, not code-verifiable. |

Also checked: `next.config.ts` raises the Server Action body limit to the 10 MiB object bound plus 1 MiB (`src/lib/storage.ts` `serverActionBodyLimit`), so the upload is not cut off by the framework. Supporting, not a named AC.

Criteria already covered by PR 1 (fields, price options, cancellation tier read-only, waiver, /ops/experiences filters by status, host, and category, status not editable): unchanged in this diff and on origin/main. Not re-verified here.

## Blocking issues
None.

## Does this close U-074b and issue 91?
Yes, once this PR merges. Every named criterion is PASS. The only open item is the axe-matrix row (criterion 9), which the scope assigns to whichever unit lands second. Re-check that before closing if U-100 lands first.

## Observations outside the AC list (not blocking)
- The `ingestPhoto` path has a second caller in `src/server/db/seed/photos.ts`, which is unrelated to this PR and was already there.
- Tag invalidation runs only for guest-visible experiences (draft, archived, and other non-visible statuses skip it). Consistent with the cache model, but the issue scope does not state it. Noted for review.

Verdict: PASS. Issue 91 can close after this PR merges and the axe-matrix condition (criterion 9) is confirmed.
