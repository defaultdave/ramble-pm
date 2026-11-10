FAIL

## architecture-audit: NEW-2 "Ops admin UI kit" (head 0955798, round 6, final)

Rules: .claude/standards/architecture.md (project; read in the worktree at head 095579885cbc7b982880824d647723572215b203), with wave-3 rules (drafts/wave3-review-rules.md).
Diff: git diff origin/main...HEAD (51 files, unchanged since round 5). Judged against the amended manifest in delta-log.md "NEW-2 rulings" (2026-11-10).
Files audited: the diff file list against the amended manifest; src/components/Select/Select.tsx; src/components/HomeModules/HomeHero.tsx:27-58; src/components/Field/Field.tsx; src/lib/flash.ts; the Input.tsx and Alert.tsx diffs; TODO(U-073) markers; docs/plan/units.yaml U-073 (line 1820).

### Round 5 items
- Scope manifest: RESOLVED. The changed files match the amended manifest: src/components/Field/ (Field.tsx, Field.module.css, Field.test.tsx, index.ts), Input.tsx (imports Field and fieldIds), Alert.tsx (type-only: AlertTone moves to lib and is re-exported, no runtime change), and the five lib helpers tableQuery, statusBadge, flash, fieldIds, alertTone with tests. No other path is touched outside the named component folders.
- serializeFlash: RESOLVED. src/lib/flash.ts:26-34 validates with the strict Zod schema and returns the value; it calls no cookie API. readFlash and parseFlash only parse a string handed to them. Cookie write and read stay with the first ops Server Action.
- ConfirmDestructive and 'use client': RESOLVED. git grep at head finds no ConfirmDestructive reference and no src/components/ConfirmDestructive/ folder; none of the NEW-2 files carries 'use client'. The round 5 server-compatibility reading (useId only, no other hooks in Select, Textarea, Input, SearchField) still holds at head.
- TODO(U-073): RESOLVED. The PM confirmed U-073 as first caller; the markers are at DataTable.tsx:66, Flash.tsx:9, SearchField.tsx:25, Select.tsx:27, StatusBadge.tsx:26, StatusFilterBar.tsx:16, Textarea.tsx:17, flash.ts:23/44/58, tableQuery.ts:34/52/59. U-073 (units.yaml:1820) depends on NEW-2 and is the ops shell page.
- Select / HomeHero duplication: NOT RESOLVED (blocking, see below).

### Blocking
- B17 duplication (wave-3 rule, 2026-10-28): src/components/Select/Select.tsx:27-76 duplicates `SelectField` in src/components/HomeModules/HomeHero.tsx:34-58. Both render a label, a native select with name and defaultValue or spread props, a ChevronDown in a relative wrapper, and a useId for the id. The only difference is styling: the hero uses HomeHero.module.css classes and Select uses Select.module.css, which composes Input's classes.
  - Why the PM's audit-item ruling does not clear it: the wave-3 rule makes duplication non-blocking only when it "existed before this diff". HomeHero's SelectField is on main, but the new Select that copies it is introduced by this diff, so the duplicate is new. Logging it as an audit item is a scheduling choice, and the rule has no PM waiver. The audit-item route is available only for the pre-existing copy.
  - Why the Reuse-section exit does not hold: Select already passes name and defaultValue through `...rest`, so the markup can serve the hero. The one gap is hero styling, which a variant covers. Nothing about Select's markup blocks reuse.
  - Fix, either of:
    1. Clear it in this unit: add a hero look to Select as a variant prop (a class or enum, no inline style), and replace HomeHero's SelectField with Select in this PR. This edits src/components/HomeModules/HomeHero.tsx and HomeHero.module.css, so the PM must add both paths to the manifest (the Reuse section must name them).
    2. Or Dave, as owner of the duplication rule, approves in writing that this one duplicate is carried to a named follow-up unit that migrates the hero. Then the PR body Reuse section names HomeHero.tsx:34-58 as the duplicate and the follow-up unit's ID, and the PM logs it as an audit item. Without that written approval, this stays blocking.

### Non-blocking
- Audit items (predate NEW-2, log in audits/): src/components/FakePaymentForm/FakePaymentForm.tsx:413 renders the same warning-icon error line as Field.tsx's error block; NoticeTone unions at src/lib/fakePayment.ts:75 and src/lib/bookingOutcome.ts:10 and an inline union at src/lib/orderReceipt.ts:45; email templates under src/server/ports/email/templates/ carry pre-existing style= props.
- Carried from round 5 (still open): src/lib/tableQuery.ts:86-100 tableHref near-duplicates src/lib/filters.ts:242-248 toQuery and browseHref; suggest one calls the other when filters.ts is next touched.
- Failing open by repair (class 3), carried: src/lib/statusBadge.ts:33 parseStatusFilter turns an unknown status into All; src/lib/tableQuery.ts:60 parseSearchTerm turns an over-limit term into no filter; src/lib/tableQuery.ts:53 parseCursor turns a malformed cursor into the first page. Decide before the first ops caller (U-073 now). No data beyond the role's read is exposed.
- Unbounded work (class 1), carried: tableQuery.ts singleValues and carriedFields walk every key of the address with no key cap; the bound is the URL length the server accepts. SearchField hidden fields walk the same way.
- CSS composition: src/components/Field/Field.module.css composes its frame classes from Input.module.css; the shared frame should live in Field.module.css with Input composing from Field. Non-blocking.
- CLAUDE.md comments that describe what: src/lib/tableQuery.ts:85; src/components/Field/Field.tsx:17.
- B13: flash.ts parseJson catch returns { ok: false }, which readFlash reports as the typed reason not-json. Typed, not silent. PASS.
- B16: PASS. Colour, spacing, radius, font size are tokens; px literals are 1px borders and 2px and 4px focus rings.
- B2, B4, B5, B12: PASS as in round 5. B1, B3, B6, B9, B10, B11, B14, B15: N/A or PASS.

### Unconfirmed
- The Reuse section of the PR body is on GitHub and was not read (no GitHub calls). The duplication verdict above does not depend on it.

## Verification
- Read-only. Code unchanged since round 5, so the round 5 vitest run (5 lib files, 90 tests, all pass) is not repeated.

Rules: .claude/standards/architecture.md (project)
Files audited: as listed above.

ARCH_VERDICT=FAIL ARCH_SHORTCIRCUIT=0 ARCH_BLOCKING_COUNT=1
