PASS

## review-agent: U-030 "displayText.ts, bannerText in settings, one paragraphs builder" (head 42168cc)

### Blocking
None.

### Non-blocking
- Scope: all 15 changed files in IN SCOPE; nothing from OUT OF SCOPE touched.
- The PM's resolution of the PR 254 merge is faithful (home.ts and home.test.ts diffed against origin/main): the gift guide view is `heading: copy.heading` then `hasContent(module.body) ? module.body : copy.summary ? paragraphs(copy.summary) : null`, main's logic with only the renames; home.test.ts keeps `collectionModuleCopy` and its describe, drops only `bannerText` and `docOfText` from the import, and main's new gift-guide tests use `paragraphs`.
- Moved bodies unchanged: `presentText` and `textLines` verbatim in displayText.ts; `bannerText` is `presentText(settings.bannerText)`, equal to the old trim-then-null; `hasText` became `hasContent` with the same body and guard.
- `paragraphs(text)` yields `{type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]}`, byte-identical to `docOfText(text)`; the multi-argument and zero-argument forms are the seed body verbatim; tests cover one-text, two-text and empty.
- Schemas unchanged: `bannerField` used via `bannerText: bannerField`, same shape and bound; settings.test.ts passes.
- Imports minimal: displayText.ts none; paragraphs.ts only `type RichTextDoc`; settings.ts gains only displayText.
- Moved tests kept every case (`textLines` null case now inside a superset `it.each`; `includedItems('')` still asserted; four `bannerText` cases carried over; new `presentText` cases).
- No second copy in src, tests or e2e (the `hasText` hits are Playwright's filter option).
- Gates run: `pnpm typecheck`, `pnpm lint`, `pnpm knip` exit 0; `format:check` clean; `vitest run src/lib tests/rich-text-bundle.test.ts` 73 files, 2472 tests pass.
- Audit items: test-file single-paragraph helpers (`editorial.test.ts:43-48`, `storable.test.ts:20-25`, `legal.test.ts:55-58`, `tests/db/editorial.db.test.ts:106-111`, `tests/db/editorial-races.db.test.ts:81-86`, `RichText.test.tsx:12,27`) and `RichText.tsx:67`'s own `content.length` check.
- Import order in HomeModules.fixtures.tsx and seed/validate.test.ts slightly unsorted; lint and prettier accept it.

### Unconfirmed
- Not run here: `pnpm test:db`, `pnpm storybook:test`, build, gitleaks.
- Evidence: none needed.
