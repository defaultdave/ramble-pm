PASS

## architecture-audit: U-030 "displayText.ts, bannerText in settings, one paragraphs builder" (head 42168cc)

Rules: `.claude/standards/architecture.md` (project), `eslint.config.boundaries.mjs`, `wave3-review-rules.md`. Static read of the 15-file diff and the repo; lint, tests, knip not run.

### Blocking
None.

### Rules B1 to B17
- B1 pass. No fetch, Drizzle or SDK call.
- B2 pass. Decisions only move into src/lib (`presentText`, `textLines`, `hasContent`, `paragraphs`, `bannerText`), bodies unchanged; GuestBanner calls `bannerText` from lib.
- B3 n/a. B4 pass: `displayText.ts` has no imports; `paragraphs.ts` only `import type { RichTextDoc } from './format'`; `settings.ts` gains a lib-to-lib import; app imports lib; seed imports stay in lib; layers and lib-packages zones hold.
- B5 n/a. B6 n/a.
- B7 pass. Each moved export has a non-test importer; `textLines` no longer exported from experiencePage.ts.
- B8 to B10 n/a. B11 pass. B12 pass. B13 pass. B14 to B16 n/a.
- B17 pass (sweep below).

### Intent and risks
- Drizzle schema graph: `schema/policies.ts:17` imports from `@/lib/settings`, which now also imports `./displayText` (no imports). No dependency added to the schema graph.
- U-014a: F's settings.ts edits are the import at line 2, the `bannerField` rename (lines 17 and 24), and the appended function; settings.test.ts gains an import line and a separate `describe('bannerText')`. Additive; merge main before U-014a is promoted.
- Scope: all 15 files in IN SCOPE; seed/richText.ts loses only `paragraphs`.

### B17 sweep
One definition each of `presentText`, `textLines`, the paragraph builder (`richText/paragraphs.ts`; `docOfText` and the seed copy deleted, no shim), `hasContent`, and `bannerText` (the `bannerText` hits in tests are local parameter names). `richText/sanitize.ts:473,487,589` build nodes while sanitising, not a text-to-doc builder. Test-file single-paragraph helpers (out of scope, allowed): `editorial.test.ts:43-48`, `storable.test.ts:20-25`, `legal.test.ts:55-58`, `tests/db/editorial.db.test.ts:106-111`, `tests/db/editorial-races.db.test.ts:81-86`, `RichText.test.tsx:12,27`.

Page modules still holding general-shaped helpers (pre-existing, for G or the audit log): `browse.ts:129-139` `dateChipLabel` and its formatter; `experiencePage.ts:24-26,87-93` `hoursLabel` and `windowLabel` (cancellation wording, not a duration duplicate); `experiencePage.ts` `mapsHref` and `placeOf` (address helpers). `home.ts` now holds only home-specific code.

### Non-blocking
- `richText/paragraphs.ts:14` `hasContent` has no doc comment (optional). `RichText.tsx:67` has its own `content.length` check (suggestion only per the plan).
- Audit items: `dateChipLabel`, `hoursLabel`/`windowLabel`, `mapsHref`/`placeOf` as above.

### Unconfirmed
- Gates not run here; knip's view inferred from the import search.
