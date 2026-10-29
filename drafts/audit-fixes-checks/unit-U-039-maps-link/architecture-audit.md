PASS

## architecture-audit: U-039 "Maps link sentence-end walk (BE-8)" (head 13e2c6e)

Rules: /Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md (project), B1 to B17 all applied to the diff (src/lib/experiencePage.ts and its test).

### Blocking
None.

B1, B3, B4, B12: purity holds. The new code imports nothing, reads no env, clock, or IO; it is string functions and two module-level Sets.
B2, B5 to B11, B13 to B16: not touched (no component, data layer, action, handler, catch, or style in the diff).
B7: the new helpers are all non-exported; the only export, `mapsHref`, is unchanged and has real callers.
Work bound: the walk stops at `windowEnd = min(length, 2 * maxMapsQueryLength)` = 400 chars, and a first sentence still open there returns null without walking on (test covers it). `wordBefore` and `tokenBeforeWord` walk back only toward index 0 inside the window. `wordAfter` walks forward over whitespace and one word; the spans of successive calls are disjoint (a word has no '.'), so total work is linear. No loop is unbounded by input.

B17 per helper (searched src/lib, src/server, src/components for whitespace test, word char, collapse, trim, sentence, abbreviation, first-line concepts):
- `innerAbbreviations`, `streetSuffixes`, `endsSentenceAt`: specific to street/title abbreviations in a Maps query. No equivalent exists. Not general.
- `isWhitespace` (`char.trim() === ''`): a one-line char test. No shared whitespace predicate exists in src/lib/text.ts (it holds `isStorable`, `isStorableJson`, `requiredText`, `optionalText`) or elsewhere. Private, used only by the walk. Not a duplicate.
- `isWordChar`, `wordBefore`, `wordAfter`, `tokenBeforeWord`: the word-boundary walk. No existing word or tokenizer helper in the repo. They exist to read the word beside a full stop, so they are specific to this walk; private, not exported.
- Whitespace collapse (`.replace(/\s+/g, ' ').trim()`): an inline expression, not a helper, in `mapsHref`.

### Non-blocking
- Audit item (pre-existing, now twice): `src/lib/email/message.ts:224` has the same inline `replaceAll(/\s+/g, ' ').trim()`. Two inline copies of one idiom; if a third appears, add `collapseWhitespace` to `src/lib/text.ts` and use it in all places. Not blocking: no helper is duplicated, and the lib-refactor lane is the place.
- `wordAfter` can read past the 400-char window when a '.' near the window end is followed by a very long whitespace run. Linear and bounded by the meeting point's existing length limit, so not a defect; a `Math.min(..., windowEnd)` limit on the whitespace skip would make the bound local. I did not confirm the length limit's value in this audit.
- `isWordChar` and `isWhitespace` are small, general predicates living in a page module. They are private and have no second user today; move them to `src/lib/text.ts` when the lib-refactor lane or a second caller needs them.

### Unconfirmed
- The builder's Reuse section was not provided to this check, so it was not compared against these findings.
