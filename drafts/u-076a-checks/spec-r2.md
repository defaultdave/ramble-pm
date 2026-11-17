# U-076a spec compliance (r2)

Head: 7d1d4d3edec6040e5e1410b5654c5cdb747a979e
Prior: r1 at d5e9eeffe7d13d55d979d58c2539d250dedbcfbf (VERDICT: PASS)
Spec: docs/plan/units.yaml U-076a (lite cut); PRD-50, PRD-53, PRD-54

VERDICT: PASS

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Structured rich-text editor (Tiptap) on U-117's document format | PASS | `src/components/RichTextEditor/RichTextEditor.tsx` (StarterKit, `sanitizeRichText`, types from `@/lib/richText/format`); `package.json` adds `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` |
| 2 | Editor offers only nodes/marks the format has | PASS | `RichTextEditor.tsx:1170-1174`: heading levels [2,3,4]; code, codeBlock, strike, underline set to false |
| 3 | Publish revalidates through tagsForChanges | PASS | `src/server/db/editorial.ts` `saveHelpArticle` now computes `settled.status` (`statusAfter(intent, before.status)`) and uses it for `visibleChange(settled.status, change)`; `finish()` -> `updateTagsForChanges` (`src/server/cache/invalidate.ts`). Publish intent -> `published`, unpublish -> `draft` (`src/lib/editorialAdmin.ts` `statusAfter`). Tests in `tests/db/editorial-help-admin.db.test.ts` (publish/unpublish tag clearing) still present |
| 4 | Ops routes and states (list, new, edit) | PASS | `src/app/(ops)/ops/editorial/page.tsx`, `new/page.tsx`, `[id]/page.tsx`, `loading.tsx`; nav in `src/lib/opsNav.ts` |
| 5 | Save as draft / publish / take down | PASS | `src/components/EditorialAdmin/EntryForm.tsx` submit buttons `name="intent"` value `save` and `publish`/`unpublish` (toggled by status); "Save changes" label for a published article; `saveEntryAction` in `src/server/actions/editorial.ts` |
| 6 | Lite cut: no axe-matrix rows | PASS | No `axe` string in the diff (lockfile excluded) |
| 7 | Lite cut: no gifting | PASS | No gift-guide files in the diff; only the pre-existing `HomeGiftGuide` type import in `src/server/db/editorial.ts` |
| 8 | Lite cut: no edits under src/server/cache | PASS | `git diff origin/main 7d1d4d3 -- src/server/cache` is empty (0 lines) |
| 9 | PRD-50: staff edit editorial content | PASS | `getHelpArticleForEditing` and `saveHelpArticle` call `requireStaff` (`src/server/db/editorial.ts`) |
| 10 | PRD-53: legal documents published | N/A (out of this unit's scope) | Same as r1: U-076c |
| 11 | PRD-54: help pages linked from every email | N/A (out of this unit's scope) | Same as r1: not in U-076a scope; no email changes in the diff |
| 12 | Audit row per save (supporting) | PASS | `saveHelpArticle` writes `auditFor(caller.userId, before?.status, settled.status, row.id)` inside the transaction (`src/server/db/editorial.ts`) |

## Round 2 changes checked

- Save keeps stored status and position: PASS. `saveHelpArticle` takes `intent` and, when `before && intent`, sets `status: statusAfter(intent, before.status)` and `position: before.position` (`src/server/db/editorial.ts`, locked row). Test: "keeps the stored status and position when a stale tab saves its draft".
- Blank slug keeps stored slug: PASS. `parseEntryForm` in `src/lib/editorialAdmin.ts` uses `formText(get,'slug') ?? …` with `currentSlug` fallback; tests "a blank address" in `src/lib/editorialAdmin.test.ts`.
- Empty-body refusal also on save of a published article: PASS. Check is `settled.status === 'published' && !hasContent(body)` -> `empty_body` (`src/server/db/editorial.ts`); form-level check `parsed.data.status === 'published'` in `parseEntryForm`. Since a save on a published article settles to `published`, it is refused.
- Link panel focus: PASS. `RichTextEditor.tsx` focuses the panel's input on open (`panelRef.current?.querySelector('input')?.focus()`) and Cancel returns focus to the editor (`editor?.commands.focus()`). Test "focuses the address field on open, and Cancel returns focus to the editor".
- ARIA: PASS. Toolbar `role="group"` with `aria-label="Formatting"`; `aria-pressed` on toggles, `aria-expanded` on link button, `aria-invalid`/`aria-describedby` on fields and link error, `aria-multiline`/`aria-labelledby` on the editor.

## Notes (non-blocking)

- Diff stat at head: 31 files, 2749 insertions, 128 deletions, including `pnpm-lock.yaml`. Also touches `src/lib/richText/href.ts` and `sanitize.ts` (1 line removed), not part of the r1 list. Not an AC matter; review's call on scope.
- Tests were checked for names only; pass/fail not run. No checkout was modified.
