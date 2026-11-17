# U-076a spec compliance (r1)

Head: d5e9eeffe7d13d55d979d58c2539d250dedbcfbf (unit/U-076a-editorial-editing)
Spec: docs/plan/units.yaml U-076a (lite cut); PRD-50, PRD-53, PRD-54

VERDICT: PASS

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Structured rich-text editor (Tiptap) on U-117's document format | PASS | `src/components/RichTextEditor/RichTextEditor.tsx` (StarterKit from `@tiptap/starter-kit`, values through `sanitizeRichText`, types from `@/lib/richText/format`); `package.json` adds `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` |
| 2 | Editor offers only nodes/marks the format has | PASS | `RichTextEditor.tsx`: code, codeBlock, strike, underline off; headings 2-4 match `HEADING_LEVELS` in `src/lib/richText/format.ts` |
| 3 | Publish revalidates through tagsForChanges | PASS | `src/server/db/editorial.ts` `saveHelpArticle` returns `changes` with `visibleChange(parsed.status, …)`; `finish()` calls `updateTagsForChanges` (`src/server/cache/invalidate.ts:10`), which calls `tagsForChanges`. Publish intent maps to status `published` in `src/lib/editorialAdmin.ts` (`statusAfter`). Test: `tests/db/editorial-help-admin.db.test.ts` "clears the help tags on publish and on unpublish" |
| 4 | Ops routes and states (list, new, edit) | PASS | `src/app/(ops)/ops/editorial/page.tsx`, `new/page.tsx`, `[id]/page.tsx`, `loading.tsx`; nav entry in `src/lib/opsNav.ts` |
| 5 | Save as draft / publish / take down | PASS | `src/components/EditorialAdmin/EntryForm.tsx` buttons with `intent` save/publish/unpublish; `saveEntryAction` in `src/server/actions/editorial.ts` |
| 6 | Lite cut: no axe-matrix rows | PASS | No `axe` references in the diff (excluding lockfile) |
| 7 | Lite cut: no gifting | PASS | No gift-guide editor files in the diff; only a pre-existing type import (`HomeGiftGuide`) in `src/server/db/editorial.ts` |
| 8 | Lite cut: no edits under src/server/cache | PASS | `git diff origin/main <head> -- src/server/cache` is empty |
| 9 | PRD-50: staff edit editorial content | PASS | Ops-gated pages above; `getHelpArticleForEditing` and `saveHelpArticle` require staff (`requireStaff`) |
| 10 | PRD-53: marketplace terms, privacy, host agreement published | N/A (out of this unit's scope) | Scope names help articles only; legal documents are U-076c (`units.yaml`). Not a fail for U-076a |
| 11 | PRD-54: help pages linked from every email | N/A (out of this unit's scope) | Not in U-076a scope text; no email linking in the diff. Confirm it lands in a later unit (U-076c or the email units) |
| 12 | Audit row per save (supporting, not in scope text) | PASS | `src/server/db/editorial.ts` `writeAudit` inside the save transaction; `src/lib/editorialAdmin.ts` `entryAuditEntry` |

Notes (non-blocking):
- PRD-53 and PRD-54 are listed on the unit but the scope text covers only the editor and publish. Nothing in the diff is missing for the stated scope.
- The diff adds `helpArticles` cache usage through the existing `updateTagsForChanges` helper, so no new tag wiring was needed.
- Tests were read for names only; their pass/fail was not run.
