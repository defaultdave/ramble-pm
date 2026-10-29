PASS

## qa-agent: U-030 "displayText.ts, bannerText in settings, one paragraphs builder" (head 42168cc)

No behaviour change found.

### Blocking
None.

### Non-blocking
- Mutation `texts.filter(Boolean).map(...)` in `paragraphs` survived all unit tests: nothing pins that `paragraphs('')` keeps an empty paragraph, which the one-arg byte-identity with the old `docOfText` requires. Worth a test case; not a defect in the diff.
- Out-of-scope single-paragraph test helpers correctly left alone.

### Unconfirmed
- `pnpm test:db`, `pnpm storybook:test`, build and gitleaks not run by this check; `storybook:test` and `test:db` apply (fixtures and settings.ts touched) and run in CI.

### Behaviour-equivalence dump: identical
A throwaway vitest at HEAD and at origin/main (f66702e), each in its own scratch worktree, written to JSON; `diff` of the two 89,889-byte files is empty. 31 `buildHomePage` cases, none threw. Private `presentText` and `hasText` on main were extracted and transpiled to compare.
- Strings: null, '', ' ', whitespace and newlines, padded, multi-line with blank lines and trailing spaces, CRLF, 5000 characters, 300 lines, nbsp, zero-width space; through `presentText`, `textLines`, `bannerText`, and one-arg `paragraphs` against main's `docOfText`.
- Multi-arg `paragraphs`, main's seed copy against HEAD's, for 0, 1, 2, 3 and 13 texts.
- `hasText`/`hasContent`: null, empty doc, doc with an empty paragraph, real doc, `paragraphs('')`.
- `SettingsSchema.parse` and `SettingsChangeSchema.parse`, 14 inputs each (valid, bannerText null, '', blank, padded, 280 and 281 characters, a number, undefined, out-of-range ints, bad enum, extra key, `{}`, null; undefined-only changes).
- `buildHomePage`: gift guide with three module bodies, four collection states and two headings; hero with three bodies, with and without its own heading; a combined page.
- Seed editorial `collections`, `homeModules`, `pageCopy`, and `blocks()` output.

### Gates in the HEAD scratch tree
`pnpm test` 172 files, 3768 tests pass; format, lint, typecheck, knip clean.

### Mutation checks
`paragraphs` keeping only the first text: 1 failure. Dropping empty texts: survived (above). `hasContent` `length > 1`: 3; no null check: 7; `doc !== null`: 2. `bannerText` raw value: 2; partial trim: 1. `presentText` without trim: 6. Builder's worktree untouched; scratch trees removed.

### Evidence
No visible change; the identical JSON dumps are the evidence.
