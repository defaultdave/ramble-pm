PASS

## spec-compliance: U-030 "displayText.ts, bannerText in settings, one paragraphs builder" (head 42168cc)

### Blocking
None.

### Non-blocking
- `src/lib/home.ts:249-251` and `:310-313`: the `hasContent(...)` ternaries are multi-line (prettier reflow); the calls are renamed and the logic is unchanged.
- The moved `bannerText` describe in `src/lib/settings.test.ts` sits after the existing "the banner" describe (about lines 77-86), not at the file end: its own `it.each` with the column named `banner` (no shadowing), and the file end stays free for U-014a. Meets the bullet.

### Unconfirmed
None (read and grep only; runtime is qa's).

### Per-criterion
Scope PASS: exactly 15 files (4 new, 11 edited); `text.ts`, `components/RichText/`, docs and the listed test-file helpers untouched; no A to E or G work.
Moves PASS: `presentText` (`displayText.ts:2`) and `textLines` (`:8`) out of experiencePage.ts; `bannerText` appended to `settings.ts:60-65` as `presentText(settings.bannerText)`, removed from home.ts; `docOfText` replaced by `paragraphs(...texts)` (`richText/paragraphs.ts:3-12`), none left in src, tests or docs; `hasText` replaced by `hasContent` (`:14-16`) with the null-accepting guard; seed `paragraphs` moved, `blocks` and `textOf` stay.
Call sites PASS: experiencePage.ts imports from `./displayText`; experiencePage.test.ts keeps only `includedItems('')` and the non-null cases moved to `displayText.test.ts:11-33`; home.ts imports `hasContent, paragraphs` and keeps `GuestSettings`; home.test.ts uses `paragraphs` and drops the `bannerText` describe; settings.ts imports `presentText`, renames the const to `bannerField` (`:17`, shorthand `:23`) and appends the function; settings.test.ts imports `bannerText`; seed fixtures and validate.test.ts import `paragraphs` from `@/lib/richText/paragraphs`; GuestBanner.tsx imports `bannerText` from `@/lib/settings`; HomeModules.fixtures.tsx uses `paragraphs`; `docs/runbooks/home.md` unedited.
PM rulings PASS: new `displayText.ts`, `text.ts` untouched; `hasContent` keeps its signature; seed `blocks` and `textOf` stay.
Risks PASS: `displayText.ts` has no imports; `paragraphs.ts` imports only the `RichTextDoc` type; knip-relevant importers exist; schemas unchanged apart from the const rename; settings.ts edits confined to the rename, the import and the appended function (nothing near U-014a's `:48-55`); no stale `bannerText` mock in GuestBanner.test.tsx.
Evidence: none required.
