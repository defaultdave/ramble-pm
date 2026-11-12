# Architecture Audit: U-074b part 2 (ops photo upload) — FAIL

Verdict: **FAIL** (`ARCH_VERDICT=REQUEST_CHANGES`, 6 blocking, all B17)
Branch: `unit/U-074b-photos`, HEAD `c27211aed4bbb448727444ea9e00208a2654690c`, against `origin/main`
Rules: `.claude/standards/architecture.md` (project)
Scope: in scope (components, lib, server, action, app page, module CSS, next.config). Not short-circuited.
Code was not modified.

Files audited (production, in scope): `next.config.ts`, `src/app/(ops)/ops/experiences/[id]/page.tsx`, `src/components/ExperienceEditor/{ExperienceEditView.tsx, ExperiencePhotos.tsx, ExperienceEditor.module.css, ExperienceEditor.stories.tsx, ExperienceEditor.fixtures.ts, index.ts}`, `src/lib/{photoForm.ts, experienceAudit.ts, experienceEditor.ts, cacheTags.ts, storage.ts}`, `src/server/actions/experiencePhotos.ts`, `src/server/db/{photos.ts, experienceEditor.ts}`, `src/server/coverPhotos.ts`, `src/server/photos/ingest.ts`. Tests (`*.test.*`, `tests/`) read only for B7 and B11.

## Blocking Issues

### B17: reuse before writing (6)

1. **B17-1: null-user guard re-implements `requireOpsUserId`.** `src/server/db/photos.ts:176-177` (`if (caller.userId === null) throw new ForbiddenError(Role.HostOwner); const userId = caller.userId;`) repeats the guard in `src/server/db/audit.ts:50-54` (`requireOpsUserId`). The logic is the same: refuse a caller with no user, then return the id. The only difference is the role, and `requireOpsUserId` hard-codes `Role.Ops`, which a host owner cannot satisfy. Fix: generalise to `requireUserId(caller, role)` in `audit.ts`, have `requireOpsUserId` delegate to it, and call it from `addPhoto`.

2. **B17-2: `photos` cache arm is a copy of the `schedule` arm.** `src/lib/cacheTags.ts:65-68`: `case 'schedule': return [tags.experience(change.experienceId)];` and `case 'photos': return [tags.experience(change.experienceId)];` are identical bodies. Fix: `case 'schedule': case 'photos': return [...]`. The new `CacheChange` kind can stay, since its name is accurate.

3. **B17-3: photo notice codes are a third hand-written copy of the refusal codes.** `src/lib/photoForm.ts:146-155` (`photoNoticeCodes`) lists `photo_too_large`, `photo_unsupported_format`, `photo_too_many_pixels`, `photo_too_small`, `photo_animated`, `photo_corrupt`. These are the six codes of `photoRefusalCodes` (`src/lib/photos.ts:37-44`) with a `photo_` prefix, and the `photoNotices` keys at `photoForm.ts:181-196` repeat them again. `photoRefusalOf` already derives from `photoRefusalCodes`, so the lists can drift: a new refusal code would compile, and `photoRefusalOf` would return a code with no notice. Fix: derive the refusal part of `photoNoticeCodes` from `photoRefusalCodes.map(photoRefusalNotice)`, and append the three non-refusal codes.

4. **B17-4: accepted upload types are a literal copy of the photo formats.** `src/components/ExperienceEditor/ExperiencePhotos.tsx:21` (`const acceptedTypes = 'image/jpeg,image/png,image/webp'`) names the same three types as `acceptedPhotoFormats = ['jpeg','png','webp']` (`src/lib/photos.ts:32`, not exported) and `allowedContentTypes.public` (`src/lib/storage.ts:68`). The set is the same; only the shape differs. Fix: export the MIME list from `src/lib/photos.ts` (derived from `acceptedPhotoFormats`) and build the `accept` value from it.

5. **B17-5: the `.thumb` frame repeats the `.photo` frame in GuideEntry.** `src/components/ExperienceEditor/ExperienceEditor.module.css:76-84` (`.thumb`) and `src/components/GuideEntry/GuideEntry.module.css:8-13` (`.photo`) share four identical declarations: `position: relative`, `aspect-ratio: 4 / 3`, `overflow: hidden`, `background: var(--color-bg-sunken)`. `.thumb` adds only `max-width: 12rem` and `border-radius: var(--radius-sm)`. `ExperienceGallery.module.css:27` `.item` has the same four plus flex and scroll-snap, and `Photo.stories.module.css` `.frame` is a further story-only copy. Fix: `.thumb { composes: photo from '../GuideEntry/GuideEntry.module.css'; max-width: 12rem; border-radius: var(--radius-sm); }`, following the composes-from-another-module pattern this file already uses for HostSetup. Alternatively, move the frame to a shared module.

6. **B17-6: the ops action preamble is copied from `updateExperienceAction`.** `src/server/actions/experiencePhotos.ts:21-24` (`opsCallerOrLeave(experiencesPath)`, `parseIdField(formData.get('experienceId'))` with `redirect(experiencesPath)` on null, `const here = experiencePath(experienceId)`) is the same three steps as `src/server/actions/experiences.ts:36-39`. `src/server/actions/hosts.ts:19` already has the sibling helper `hostIdOrLeave(formData)` for the same job. Fix: add `experienceIdOrLeave(formData)` beside it and use it in both actions.

## Advisory

- **A-1: notice choice in the async shell.** `src/app/(ops)/ops/experiences/[id]/page.tsx:66-70` picks between `experienceNotices` and `photoNotices` with `?? noticeText(photoNotices, photoNotice)`. This is a branch that the async-shell row says should not live in `src/app`. Consider a `src/lib` function that returns the notice for a query.
- **A-2: round-trip through fake issues.** `src/lib/photoForm.ts:102-108` wraps each issue as `{ path: [fieldOfIssue(...) ?? ''] }` only to feed `fieldsFromIssues`. Equivalent and simpler: `new Set(issues.map(...))` with the `null` filtered out.
- **A-3: `isRightsKey` is a membership guard.** `src/lib/photoForm.ts:54-56` duplicates the job of `pickKnown` (`src/lib/pickKnown.ts`). Using `pickKnown(String(key), Object.keys(rightsFields), null)` is an option. Low priority.
- **A-4: `rawTextLimit` borrows a URL limit.** `src/lib/photoForm.ts:37` is `photoLimits.maxUrlLength`. `experienceLimits.rawField` (`src/lib/experienceEditor.ts:60`, 6000) and `hostLimits.rawField` (`src/lib/hostSetup.ts:30`, 4000) show the pattern. Add `photoLimits.rawField` and use it.
- **A-5: the parse skeleton is copied a third time (pre-existing pattern).** `parsePhotoForm` (`src/lib/photoForm.ts:75-112`) repeats the shape of `parseFields` in `src/lib/experienceEditor.ts:244-258` and `src/lib/hostSetup.ts:101-113`: oversized check, `safeParse`, `fieldsFromIssues`, `inFieldOrder`. Each piece is an existing helper, so this is composition, not a duplicated function. Log as an audit item for a shared form-reader.
- **A-6: near-identical invalid notice copy.** `src/lib/photoForm.ts:183-186` ("Some photo details need another look.", danger) against `src/lib/experienceEditor.ts:713` and `src/lib/hostSetup.ts:472` ("Some details need another look.", danger). The copy differs by one word, which may be intended. Decide whether area-specific copy is wanted.
- **A-7: test and story helpers repeated (tests are outside B17 scope, so these are notes only).** `const noop = () => undefined` appears in `ExperiencePhotos.test.tsx:17`, `ExperienceEditor.test.tsx:29`, `ExperienceEditor.stories.tsx:22`, `HostSetup.test.tsx:21`, and `HostSetup.stories.tsx:15`. `class Redirected` appears in `experiencePhotos.test.ts:10`, `experiences.test.ts:10`, and `opsAccess.test.ts:5`. `{ ...savedView, photos: savedPhotos }` is written out in `ExperienceEditor.test.tsx` and as `withPhotos` at `ExperienceEditor.stories.tsx:164`. Move these to a shared support file.

## B-rule check (whole diff)

| Rule | Result | Evidence |
|---|---|---|
| B1 | Pass | No `fetch(`, SDK, or DB call in components, pages, or lib. Storage is reached through `getStorage` (`experiencePhotos.ts:15,38`). |
| B2 | Pass, with A-1 | Decisions are in `src/lib/photoForm.ts`. Only the page's notice `??` is a branch outside lib. |
| B3 | Pass | `src/server/db/photos.ts:1` has `server-only`. `src/server/actions/experiencePhotos.ts:1` has `'use server'`. No new `process.env`. |
| B4 | Pass | Imports point one way. `lib/photoForm` imports `lib/*` only. The component imports `lib/*` and `components/*`. The action imports `server/*`. |
| B5 | Pass | `parsePhotoForm` and `addPhoto` both Zod-parse. `addPhoto` returns `GuestPhotoSchema.parse(row)`. The action returns `void`. |
| B6 | Pass | The ops guard `opsCallerOrLeave` (`experiencePhotos.ts:21`) runs before the parse and before any read. `addPhoto` checks the role (`photos.ts:162-172`) before the transaction, and refuses a missing user (`:176`). The experience read at `:154-161` only feeds `photoAccessFor`, so it does not return data before the check. A missing experience and another host's experience return the same refusal (`lib/photos.ts:171-183`). |
| B6 identity-read exemption | Not applied | |
| B7 | Pass | Every new non-type export has a non-test importer: `ExperiencePhotos`, `photoNotices`, `photoNoticeCodes`, `photoRefusalOf`, `galleryWith`, `serverActionBodyLimit`, `photoAddedEntry`, and the others. |
| B8 | Pass | No new `'use client'`. The page, `ExperienceEditView`, and `ExperiencePhotos` are server or sync components. |
| B8 sign-in island | Exempt | |
| B9 | Pass | `db/photos.ts:191-226`: `FOR UPDATE` on the experience, position read, photo insert, and `writeAudit(tx, photoAddedEntry(...))` all in one `db.transaction`. The file is stored before the transaction, by design, and it is not a row. The cache tag is published after commit (`photos.ts:250`), the same as `experienceEditor.ts:334`. |
| B10 | N/A | No money or hold path. The storage key is derived from Ramble IDs (`photos.ts:186`). |
| B11 | Pass | `src/` imports no vendor SDK. `next.config.ts` imports only `src/lib/storage`. `sharp` stays in the existing ingest code. Tests are exempt. |
| B12 | Pass | `systemClock.now()` (`experiencePhotos.ts:38`). No `Date.now`, no `new Date()`, no floats in the diff. |
| B13 | Pass | The action rethrows unknown errors (`experiencePhotos.ts:48`). `addPhoto` rethrows after cleanup, and cleanup failures are logged and attached, not swallowed. |
| B14 | Pass | `galleryWith` is used only by the uncached ops read. |
| B15 | N/A | No Route Handler. |
| B16 | Pass | No inline `style`. The new CSS uses `var(--radius-sm)` and `var(--color-bg-sunken)`. `max-width: 12rem` is a layout length, not a token category. |
| B17 | FAIL, 6 items | See Blocking Issues. |

## Known debt (not re-reported)

`CheckField` vs `Checkbox`, the duplicated `.problem`/`.muted`, the `.pair` media query, and the `.legend` CSS are not reported. `ExperiencePhotos.tsx` uses `CheckField` and the existing `.muted`.

## B17 sweep: checked, reused or distinct

Each new item was checked against `src/`. These are not findings.

- `galleryWith` (`db/photos.ts:75`) extends `coverWith` with a different `limit`. It is a variant, so reuse is correct.
- `photoAddedEntry` (`lib/experienceAudit.ts:82`) uses `userActor` and follows the sibling `*Entry` builders.
- `photoRightsBasisOptions` uses the existing `labelledOptions`. No other rights-basis labels exist.
- `refusalForUpload`, `photoRefusalMessage`, `photoRefusalCodes`, `problemText`, `errorProps`, `oversizedFields`, `inFieldOrder`, `fieldsFromIssues`, `formText`, `formHas`, `parseNotice`, `noticeHref`, and `parseIdField` are all reused.
- The `Record<PhotoFormField, string>` pattern matches `experienceEditor.ts` and `hostSetup.ts`. The copy is distinct.
- `thumbSizes` (`ExperiencePhotos.tsx:22`) does not match `cardPhotoSizes`, `leadSizes`, or `sideSizes`.
- `serverActionBodyLimit` (`lib/storage.ts`) is new, and it is built from the existing `maxObjectBytes`.
- `photoAltSummary` has no existing equivalent.
- The `.section`, `.heading`, `.list`, `.photoRow`, and `.photoText` composes reuse HostSetup and the module's own `.muted`.
- `'photos'` is a new cache kind. The `CacheChange` union entry is correct, and only the arm body duplicates (B17-2).
- `PhotoLimitError`, `ExperienceNotFoundError`, and `PhotoRefusedError` are now used by the action, so removing their `TODO(U-074b): first caller` comments is correct.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=REQUEST_CHANGES
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=6
