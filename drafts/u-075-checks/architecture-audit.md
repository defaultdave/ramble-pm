# Architecture Audit: U-075 (branch unit/U-075, HEAD 5ab07c3707faa1fdf03d4be12a4a69e1ab8d10c7, against origin/main)

## Verdict: FAIL (REQUEST_CHANGES), 4 blocking

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project)
Scope: in scope (25 files; src/app, src/components, src/lib, src/server; tests read for B7/B11 only).

## Blocking

### B2 (decision in a component)
- `src/components/ExperienceReview/ExperienceReviewView.tsx:28-39` `listingFacts`: builds display strings ("Meet at: ", "Included: ", "Access: ", "Adult price: ", "Child price: " via `formatPrice`), conditional inclusion, and `.filter(...)` inside a component. Fix: move to `src/lib/experienceReview.ts` as `listingFacts(view)` with a unit test (`formatPrice` in `src/lib/money.ts` is already pure, so it can be called from lib). Cost: small.

### B2 (decision in a Server Action)
- `src/server/actions/experienceReview.ts:50` `reason === null ? null : { kind: 'reject', reason }` and `:22` `if (decision === null) redirect(noticeHref(here, 'no_reason'))`: the "a rejection needs a reason" gate is a decision made in the action, not in lib. Fix: a lib function (for example `reviewDecisionFromForm(get, kind)` returning `ReviewDecision | null`) in `src/lib/experienceReview.ts`, tested there. Cost: small.

### B17 (exact duplicate of an existing helper)
- `src/lib/experienceReview.ts:33-34` `rejectionReasonOptions = Object.entries(rejectionReasonLabels).map(([value, label]) => ({ value, label }))` is the same body as `labelledOptions` in `src/lib/experienceEditor.ts:740-745` (already used for `ageRuleLabels`, `weatherPolicyLabels`, `taxTreatmentLabels`, `photoRightsBasisOptions`). Fix: `labelledOptions(rejectionReasonLabels)`; `experienceReview.ts` already imports from `./experienceEditor`. Cost: one line.

### B17 (nearly the job of an existing rule)
- `src/lib/experienceReview.ts:54-58` `photosNeedingAlt` tests `photo.decorative || (photo.altText ?? '').trim() !== ''` to decide alt-or-decorative. That is the rule `PhotoDescriptionSchema` in `src/lib/photos.ts:232-240` already states (not exported), and the DB check `photos_alt_or_decorative` in `src/server/db/schema/catalog.ts:328-331`. Fix: export `PhotoDescriptionSchema` (or a `hasAltOrDecorative` predicate beside it in `src/lib/photos.ts`) and use it here. Cost: small. Note the stored-row case is guarded by the DB check, so the fix is about one rule in one place, not a behaviour change.

## Advisory / minor

- B17 (minor) `src/lib/experienceReview.ts:122-135` `reviewNoticeText` re-implements the null and lookup step of `noticeText` (`src/lib/opsForm.ts:120-125`). Fix: `noticeText(reviewNotices, code)` and then the alt-photo override. Cost: small. The `reviewNotices` table itself follows the `experienceNotices` pattern (`src/lib/experienceEditor.ts:703`), so it is fine.
- B17 (minor) `src/components/ExperienceReview/ReviewQueue.tsx:1-40` repeats the DataTable wiring of `src/components/ExperienceEditor/ExperiencesList.tsx` (caption, columns, sort, path, cursor). It reuses `experienceColumns`, so the duplication is limited to the table props. Leave unless a third list appears.
- B17 (minor, tests) `src/server/actions/experienceReview.test.ts:43-55` `formOf` and `redirectOf` are copies of the same helpers in `src/server/actions/experiences.test.ts:49-60` and `experiencePhotos.test.ts:50-70`. `tests/db/experience-review.db.test.ts:136` `auditRows` repeats `tests/db/experience-editor.db.test.ts:108`. Fix: one shared test helper each. Test-only, so not blocking.
- B2 (minor) `src/server/actions/experienceReview.ts:41` `result.photoNumbers.map(String)` is a data conversion for the address, not a decision; noted only.

## Rule checks (whole diff)

- B1 pass. No fetch, Drizzle, or SDK call in `app/`, `components/`, or `lib/`. The data is read through `readExperienceForOps` and `readExperiencesForOps` (existing).
- B2 FAIL (two blocking, above). Otherwise the logic sits in `src/lib/experienceReview.ts` (`reviewRefusal`, `photosNeedingAlt`, `reviewNoticeText`).
- B3 pass. `src/server/db/experienceReview.ts:1` has `import 'server-only'`; the action file has `'use server'`; `src/lib/*` new files read no `process.env`.
- B4 pass. `src/lib` imports lib only; `src/components/ExperienceReview` imports components, lib, and types; `src/app` imports components, lib, and actions; `src/server` imports lib and server. No relative escapes into `server/` or `app/`.
- B5 pass. The action guards with `opsCallerOrLeave` and `idOrLeave`; the data layer parses the id with `WriteIdSchema.safeParse` before any read. Returns `ReviewResult` (a Ramble type), not a row.
- B6 pass. `decideExperienceReview` calls `requireOpsUserId`, which calls `requireRole(caller, Role.Ops, {})` (`src/server/db/audit.ts:50-53`), before the transaction. Both pages check `holdsOpsRole` before any read (`src/app/(ops)/ops/review/page.tsx`, `[id]/page.tsx`).
- B7 pass. `ExperienceReview.fixtures.ts` exports are imported by the stories as well as the tests (a non-test importer). `experienceColumns` and `ExperiencePhotoList` have production importers.
- B8 pass. No `'use client'` in any added file.
- B9 pass. `decideExperienceReview` (`src/server/db/experienceReview.ts:43-79`) does the status update and the audit row (`writeAudit(tx, ...)`) in one `db.transaction`, with `.for('update')` on the row. Cache invalidation (`updateTagsForChanges`) runs after the commit and sends no job, email, or provider call.
- B10 N/A (no money or hold path).
- B11 pass. `tests/db/authzReviewRows.ts` follows the existing `authz*Rows.ts` pattern. No vendor SDK in `src/`.
- B12 N/A for money code. `formatPrice` is the existing helper; no float arithmetic added.
- B13 pass. No empty or defaulting `catch` in the diff.
- B14 N/A. No `'use cache'` in the diff.
- B15 pass. No Route Handler added.
- B16 pass. No inline `style`. `ExperienceReview.module.css` has no colour, spacing, radius, or font literals (the only literal is the `@media (min-width: 768px)` breakpoint, which is the accepted media-query debt). New styles use `composes:` from `ExperienceEditor.module.css`.
- B17 FAIL (two blocking, above).

## B17 sweep (every new function, constant, type, component, schema, CSS rule)

| New | Location | Existing equivalent | Same logic? | Fix cost | Group |
|---|---|---|---|---|---|
| `rejectionReasonOptions` | src/lib/experienceReview.ts:33 | `labelledOptions` src/lib/experienceEditor.ts:740 | yes, identical body | 1 line | blocking |
| `photosNeedingAlt` predicate | src/lib/experienceReview.ts:54 | `PhotoDescriptionSchema` src/lib/photos.ts:232; DB check src/server/db/schema/catalog.ts:328 | yes, the same rule | small | blocking |
| `listingFacts` | src/components/ExperienceReview/ExperienceReviewView.tsx:28 | none in lib; `manageBooking.ts:97` builds "Meet at" for another surface | n/a | small (move to lib) | blocking (B2) |
| reject-without-reason gate | src/server/actions/experienceReview.ts:22,50 | none | n/a | small (move to lib) | blocking (B2) |
| `reviewNoticeText` | src/lib/experienceReview.ts:122 | `noticeText` src/lib/opsForm.ts:120 | partial (lookup and null step) | small | advisory |
| `reviewNotices` table | src/lib/experienceReview.ts:107 | `experienceNotices` src/lib/experienceEditor.ts:703 | pattern only | none | clean |
| `reviewPath`, `reviewItemPath` | src/lib/experienceReview.ts:8-12 | `experiencePath` src/lib/experienceEditor.ts:85 | pattern only | none | clean |
| `rejectionReasons`, `RejectionReason`, `parseRejectionReason` | src/lib/experienceReview.ts:17-30 | `pickKnown` reused; no existing reason list | no | none | clean |
| `decisionStatuses` | src/lib/experienceReview.ts:41 | no existing ops status transition table | no | none | clean |
| `reviewRefusal`, `ReviewRefusal` | src/lib/experienceReview.ts:62-79 | none | no | none | clean |
| `photoNumberFields`, `photoNumbersText`, `altNeededText` | src/lib/experienceReview.ts:82-95 | `andList` reused; no existing numbered-photo copy | no | none | clean |
| `experienceApprovedEntry`, `experienceRejectedEntry` | src/lib/experienceAudit.ts:107-132 | `photoAddedEntry` pattern; no status-change entry exists | no | none | clean |
| `ExperiencePhotoList` (extracted) | src/components/ExperienceEditor/ExperiencePhotos.tsx:24 | the inline list it replaces; `photoAltSummary` reused | extraction, not a copy | none | clean |
| `experienceColumns` (extracted) | src/components/ExperienceEditor/ExperiencesList.tsx:19 | the inline columns it replaces | extraction | none | clean |
| `ReviewQueue` | src/components/ExperienceReview/ReviewQueue.tsx | `ExperiencesList` DataTable wiring | partial (table props only) | medium | advisory |
| `ExperienceReviewView` CSS (`.stack`, `.summary`, `.section`, `.heading`, `.muted`, `.cellLink`) | ExperienceReview.module.css | `composes:` from ExperienceEditor.module.css | reuse | none | clean |
| `.text` CSS | ExperienceReview.module.css | no exact match | no | none | clean |
| `ExperienceReview.fixtures.ts` (`queueRows`, `reviewView`, `needsAltView`) | src/components/ExperienceReview/ExperienceReview.fixtures.ts | `ExperienceEditor.fixtures` reused via `listRows`, `savedView`, `savedPhotos` | reuse | none | clean |
| `formOf`, `redirectOf` (test) | src/server/actions/experienceReview.test.ts:43-55 | same helpers in experiences.test.ts:49, experiencePhotos.test.ts:50 | yes | small (shared helper) | advisory (test) |
| `auditRows` (db test) | tests/db/experience-review.db.test.ts:136 | tests/db/experience-editor.db.test.ts:108 | yes | small | advisory (test) |
| `authzReviewRows` | tests/db/authzReviewRows.ts | `authzExperienceRows.ts` pattern | pattern only | none | clean |

## Accepted debt, not re-reported

CheckField vs Checkbox, `.problem`/`.muted`, `.pair`/media-query and `.legend` CSS, U-074b part-2 advisory A2-A5, A8, A9, A13-A16. Not checked again.

---
<sub>architecture-audit | haiku | read-only</sub>
