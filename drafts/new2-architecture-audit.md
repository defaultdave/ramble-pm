PASS

## architecture-audit: NEW-2 "Ops admin UI kit" (head 7569c58, round 9)

Rules: .claude/standards/architecture.md (project; read in the worktree at head 7569c587d8610ad43e0eab94a62fd27ad031aaf7), with wave-3 rules (drafts/wave3-review-rules.md, including the 2026-10-28 duplication sweep).
Diff: git diff 557be46 HEAD (14 files: src/lib and src/components only; no CSS, server, route, or migration change).
Tests run (vitest, read-only, no files changed): src/lib/fieldIds, alertTone, pickKnown, tableQuery, statusBadge, filters, filters.choices; src/components Input, Select, Textarea, Alert, DataTable, Field, Flash. 14 files, 254 tests, all pass.

### Round 8 blockers
- Labels built in DataTable: RESOLVED. DataTable.tsx:116 calls `tableScrollLabel(caption)` and DataTable.tsx:176 calls `tablePagesLabel(caption)`, both in src/lib/tableQuery.ts:156-163. They return `Scrollable ${caption}` and `${caption} pages`, the same strings as before. New test case "table labels" in tableQuery.test.ts.
- toneRole in Alert: RESOLVED. `alertRole` in src/lib/alertTone.ts:11-13 returns 'alert' for warning and danger and 'status' otherwise, which matches the removed map for all four AlertTone values. Alert.tsx:39 calls it. The icon and class maps stay in Alert.tsx as markup lookups. Test in alertTone.test.ts.
- Repeated id and aria-invalid preamble: RESOLVED. `fieldControl` in src/lib/fieldIds.ts:28-53 returns fieldId, describedBy, and ariaInvalid. Input.tsx:27, Select.tsx:45, and Textarea.tsx:29 call it. Output compared branch by branch: id is `id ?? generatedId` (same); describedBy is `fieldIds(fieldId, {hint, errorText, describedBy}).describedBy` (same inputs as before); aria-invalid is `errorText ? true : rest['aria-invalid']` (same). Field.tsx:26 still calls fieldIds directly for the label-side ids; it has no control props, so it is not a repeat. Tests in fieldIds.test.ts.
- parseStatusFilter vs parseSort: RESOLVED for both. parseSort (tableQuery.ts:42) and parseStatusFilter (statusBadge.ts:37-41) call `pickKnown` in src/lib/pickKnown.ts. parseStatusFilter returns the same value as before (first option value equal to the named one, else null). parseSort returns the same column or the fallback. Test in pickKnown.test.ts. resolveBadgeTone is not migrated; see Non-blocking.

### Blocking
- None.

### Non-blocking
- Audit item (pre-existing, outside the diff): src/lib/badge.ts:9 `resolveBadgeTone` is the same pick-known shape (`BADGE_TONES.find(...) ?? FALLBACK_TONE`). Round 8's fix text named it as a second caller of pickKnown; it is not migrated, and badge.ts is unchanged here and predates this diff, so it is logged under the wave-3 rule rather than blocking. If Dave wants it closed, the change is one line: `return pickKnown(tone, BADGE_TONES, FALLBACK_TONE);` plus the import. Log in audits/ in ramble-pm.
- Audit item (pre-existing, outside the diff): src/lib/richText/sanitize.ts:337 and :349 use the same find-or-fallback shape over HEADING_LEVELS. Log in audits/ in ramble-pm; reuse pickKnown when that file is next touched.
- Audit item (pre-existing, outside the diff, same class as the DataTable labels fixed this round): src/components/Stepper/Stepper.tsx:73 and :84 build `Decrease ${label}` and `Increase ${label}` as aria-label templates inside a component. Fix when touched: a label helper in src/lib with a test.
- src/lib/fieldIds.ts:1 `AriaInvalid` redeclares the aria-invalid type React already exports. New in this diff. Prefer `AriaAttributes['aria-invalid']` (type-only import from 'react' is allowed in lib) so the union cannot drift.

### Checked and clean
- B1, B3, B8, B11: no fetch, SDK, process.env, 'use client', or vendor import in any changed file.
- B2: every new decision (alertRole, pickKnown, fieldControl's aria-invalid rule, parseSort, parseStatusFilter, tableScrollLabel, tablePagesLabel) lives in src/lib. Conditional rendering in components (Input, Select, Textarea, DataTable, Alert) is exempt.
- B4: imports point one way. Components import @/lib/fieldIds, alertTone, tableQuery; lib imports lib only (pickKnown imports nothing; statusBadge and tableQuery import ./pickKnown).
- B7: all five new exports have a non-test importer (tableScrollLabel and tablePagesLabel in DataTable; alertRole in Alert; fieldControl in Input, Select, Textarea; pickKnown in statusBadge and tableQuery). No TODO exemption is used.
- B13: no catch added. B16: no CSS or inline style in the diff. B5, B6, B9, B10, B12, B14, B15: no server, route, money, time, or cache code in the diff.
- Wave-3 classes 1 to 4: no new input bounds, loops, retries, failing-open paths, or logged data in the diff.
- Class 2 (database accepting what Zod rejects): no table or migration in the diff.
- Em dash check on the added lines of the diff: none.

### Unconfirmed
- The builder's Reuse section in the PR body was not checked (no GitHub calls this round).
- Mutation testing was not run in this round.
- Rendered-output equality is established by reading each replaced branch against its replacement and by the passing component tests above; no snapshot or browser render was taken.

Verdict: PASS. Round 8's four blockers are resolved with unchanged output, and the diff adds no violation of B1 to B17 or the wave-3 classes. The resolveBadgeTone migration and the other pre-existing find-or-fallback sites are audit items for the PM.

---
<sub>architecture-audit | haiku | read-only</sub>
