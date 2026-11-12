# Architecture Audit (delta) — U-074b part 2, commit 130c8cd

Range: `b4a7cc0e040667b21e6cfc31af4b1b4fc65f4bcc..130c8cdef7c239ee04ba26a14b2fcae308e75e26`
Rules: `.claude/standards/architecture.md` (project)
Files audited: `src/lib/cacheTags.ts`, `src/lib/cacheTags.test.ts`, `src/lib/cancelSession.ts`, `src/lib/cancelSession.test.ts`, `src/lib/photoForm.ts`, `src/lib/photoForm.test.ts`, `src/lib/photos.ts`, `src/lib/storage.ts`, `src/server/actions/experiencePhotos.ts`, `src/server/actions/hosts.ts`, `src/server/db/photos.ts`, `src/server/db/sessions.ts`, `src/server/pulse.ts`, `src/server/pulse.test.ts`, `src/components/ExperienceEditor/index.ts`

## Verdict: PASS

## Blocking Issues
None.

## Checks requested
- **B17 (photos duplicating schedule): fixed.** `photos` is deleted from `CacheChange`; the `experience` kind carries the one `experienceId` tag for session and photo changes. No second kind maps to the same tag.
- **Stale references: none.** `grep` for `kind: 'schedule'`, `kind: 'photos'`, and quoted forms across `src/` and `tests/` returns nothing. The remaining `'schedule'` hits are unrelated: `src/server/pulse.ts:203` and `src/server/pulse.test.ts:205` are a rate-limit bucket name, and `src/server/pulse.test.ts:507,517` is an ordering label. The migration SQL hits refer to the `photos` table.
- **Emitted tag strings unchanged.** Before: `schedule` and `photos` each emitted `tags.experience(id)`. After: `experience` emits `tags.experience(id)`. Every producer (`sessions.ts`, `photos.ts`, `pulse.ts`, `cancelSession.ts`) emits the same string as before.
- **B1 to B17: no new violation.**
  - Layers: the `lib` files import only `lib`. `server/actions` imports `@/lib` and `@/server`, which is permitted.
  - B2: the new `refusedHref` in `experiencePhotos.ts` composes two existing `lib` calls and makes no decision. The `acceptedPhotoFormats` derivation in `lib/photos.ts` is a pure `lib` function.
  - B3 and B12: `mebibyte` is a plain integer constant in `lib/storage.ts`. No `process.env` or `Date` use was added.
  - B5: `idOrLeave` validates the id before use.
  - B6: `resendHostInviteAction` still runs `opsCallerOrLeave` before its work.
  - B9: `addPhoto` still updates tags after commit, as before.
  - B13: no empty catch added.
  - B17: `hosts.ts` removes an inline copy of the id parse in favour of the existing `idOrLeave` in `src/server/opsAccess.ts`. This reduces duplication.
  - `parseIdField` remains used in `hosts.ts` at line 65, so the import is still live.
- **B7 (lost its only non-test importer):**
  - `ExperiencePhotos` lost only its barrel export in `src/components/ExperienceEditor/index.ts`. It keeps a non-test importer: `ExperienceEditView.tsx` imports it directly. No B7 issue.
  - `photoNoticeCodes` and `photoRefusalOf` were exported only for the tests. They are now private, and the tests reach the same behaviour through `experiencePageNotice`, which the ops page imports. No B7 issue.
  - `AcceptedPhotoFormat` type is removed, and nothing in `src/` or `tests/` referenced it.
- **Advisory A6 (`mebibyte`) and A7 (`acceptedPhotoFormats`):** the derived formats are `jpeg`, `png`, `webp`, which is the same set as before, because `allowedContentTypes.public` is `image/jpeg`, `image/png`, `image/webp`. Behaviour is unchanged.

## Advisory
- `src/lib/photos.ts:35`: `acceptedPhotoFormats` is typed `readonly string[]`, so the narrowed literal type is gone. `isAcceptedFormat` is now a plain `boolean` guard. Nothing depends on the literal type, so this is a note only.

---
<sub>architecture-audit | haiku | read-only | delta:130c8cd</sub>
