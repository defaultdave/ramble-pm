FAIL

## architecture-audit: NEW-2 "Ops admin UI kit" (head 0955798, round 5, final)

Rules: .claude/standards/architecture.md (project; read in the worktree at head 095579885cbc7b982880824d647723572215b203)
Diff: git diff origin/main...HEAD (51 files). Round 5 delta: commit 0955798 (ConfirmDestructive removed).
Files audited: the full diff; every changed file read or grep-swept for B1 to B17; the Flight dispatcher in node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-server.node.development.js (useId, lines 6479 to 6490); the HomeHero select (src/components/HomeModules/HomeHero.tsx:34 to 58); src/lib/filters.ts (toQuery, browseHref, parseSingle, BrowseQuerySchema); docs/plan/units.yaml (U-073, U-077, U-113); the scope manifest in ramble-pm/drafts/new-2-issue-body.md.

### ConfirmDestructive and 'use client' (round 4 B8)
- RESOLVED. `git diff origin/main...HEAD` contains no `'use client'` line (added or context). Each changed file was also grepped at HEAD: none carries the directive.
- Server compatibility of the seven named components, checked by reading each file and the React 19.3.1 and Flight code:
  - DataTable, Field, StatusBadge, Flash: no hook at all. Pass.
  - Select, Textarea, Input (and SearchField, which renders Input): the only hook is `useId`. Flight implements `useId` (react-server-dom-webpack-server.node.development.js:6479 to 6490, it returns a server id), so these render from a Server Component. Any other hook (useState, useEffect) would throw there, so these components must stay hook-free apart from useId. Pass.
  - Link, ButtonLink, Button (allowlisted), and lucide icons are passed as elements or plain props; no function crosses a client boundary today. Pass.
- No dangling reference: `git grep -n ConfirmDestructive HEAD` returns nothing; no `src/components/ConfirmDestructive/` exists. Note for the PM (non-blocking): delta-log.md:116 still says the dialog is approved under the 2026-10-29 rule; that entry is now stale and should be updated.

### Blocking
- Scope manifest (not a B row, but the wave-3 rules judge the diff against it, and scope-discipline rule 5 makes an out-of-scope change REQUEST_CHANGES): the manifest in ramble-pm/drafts/new-2-issue-body.md says "New component folders only: components/{DataTable,Select,Textarea,SearchField,StatusBadge,ConfirmDestructive,Flash}/". This diff also:
  - adds `src/components/Field/` (Field.tsx, Field.module.css, Field.test.tsx, index.ts), which is not named;
  - edits existing `src/components/Input/Input.tsx` (imports Field and fieldIds, drops TriangleAlert) and `src/components/Alert/Alert.tsx:3-7` (imports and re-exports AlertTone);
  - adds lib helpers `src/lib/alertTone.ts`, `fieldIds.ts`, `flash.ts`, `statusBadge.ts`, `tableQuery.ts` with tests.
  The spec-compliance draft at cb9f090 PASSED a file list that had none of the Field, Input, or Alert edits, so these are new since that review. delta-log.md:116 also says "Flash ships without cookie code (U-073's first page writes it)", but src/lib/flash.ts:26 (`serializeFlash`) builds the cookie value and `readFlash`/`parseFlash` read it. The audit cannot waive this. Fix: the PM amends the manifest in delta-log.md to name these paths (and records the flash cookie-value contract), or the builder moves the Field, Input, and Alert edits out of the unit. Dave decides whether the manifest changes.
- B17 (duplication): src/components/Select/Select.tsx:28-83 duplicates `SelectField` in src/components/HomeModules/HomeHero.tsx:34-58. Both are a label, a native select, and a ChevronDown in a wrapper, with `useId` for the id. HomeHero's version is on main and could have been extended: the new Select takes a variant prop for the hero's look, and HomeHero calls it. Fix: extend Select with the hero's styling as a variant and migrate HomeHero's SelectField to it (the HomeHero edit is outside this manifest, so the PM routes it as its own unit or names it in the manifest amendment), or name the reason Select's markup cannot serve HomeHero in the Reuse section and have the PM log the duplicate. Note that the Reuse section is not checked here (the PR body is on GitHub, which this audit does not call).

### Non-blocking
- B17 audit items (predate NEW-2, log in audits/): src/components/FakePaymentForm/FakePaymentForm.tsx:413 renders the same warning-icon error line that Field.tsx's error block renders; the round 4 tone unions remain open (src/lib/fakePayment.ts:75 `NoticeTone`, src/lib/bookingOutcome.ts:10 `NoticeTone`, src/lib/orderReceipt.ts:45 inline union); the email templates under src/server/ports/email/templates/ carry pre-existing `style=` props.
- B17 near-duplicate (new, small): src/lib/tableQuery.ts:86-100 `tableHref` builds an address from a path and params the way src/lib/filters.ts:242-248 `toQuery` and `browseHref` do. The two take different input types (a typed BrowseQuery versus a record that skips null, undefined, and empty values), so this is not blocking. Suggest browseHref calls tableHref (or the reverse) when the next unit touches filters.ts.
- Failing open by repair (defect class 3), carried from round 4 and now confirmed by tests: src/lib/statusBadge.ts:33 `parseStatusFilter` turns an unknown status into All; src/lib/tableQuery.ts:60 `parseSearchTerm` turns an over-limit term into no filter (tableQuery.test.ts "over the limit, refused"); src/lib/tableQuery.ts:53 `parseCursor` turns a malformed cursor into the first page. This follows the browse convention (src/lib/filters.ts, "a value no one offers is dropped like any malformed one"), but on an ops table a mistyped filter shows broader rows. Decide before the first ops caller (U-077 or U-113 per Unconfirmed); no data is exposed beyond the role's read.
- Unbounded work (class 1): src/lib/tableQuery.ts `singleValues` and `carriedFields` walk every key of the address with no cap on the key count; the bound is the URL length the server accepts. Hidden fields in SearchField are the same walk. Non-blocking.
- B13: the one new catch, src/lib/flash.ts (parseJson, the catch block), drops the parse error and returns `{ ok: false }`, which readFlash turns into the typed reason `not-json`. It is typed and not silent, and nothing is logged, so it is not an empty catch. PASS, noted.
- CSS composition: src/components/Field/Field.module.css:3-7 composes its frame classes (field, label, optional, hint, error, errorIcon) from src/components/Input/Input.module.css. The shared frame's styles should live in Field.module.css, with Input composing from Field. Non-blocking.
- CSS literals (B16): the only numeric px literals are 1px borders and 2px and 4px focus rings (DataTable.module.css:9, 15, 17 to 18, 64, 66 to 67, 80, 115), which follow the outline convention in SiteMenu.module.css and Footer.module.css. Colour, spacing, radius, and font size are all var(--...) tokens. PASS, noted.
- CLAUDE.md comments (describe what, not why): src/lib/tableQuery.ts:85 "An address from a path and its params, leaving out the unset ones."; src/components/Field/Field.tsx "The label, optional marker, hint, and error around one form control, shared by every field."; src/components/DataTable/DataTable.tsx prop docs. Non-blocking.
- delta-log.md:116 is stale (see ConfirmDestructive above).

### Unconfirmed
- B7 owner of the TODO(U-073) exemption: DataTable, SearchField, StatusFilterBar, Select, Textarea, StatusBadge, Flash, and the lib exports parseSort, parseCursor, parseSearchTerm, serializeFlash, readFlash, and parseFlash all name U-073 as first caller. docs/plan/units.yaml U-073 (lines 1820 to 1837) is "Ops shell, passkeys, and audit wiring" and its scope names none of them. The units whose scope names search and lists are U-077 ("Search and history per booking") and U-113 ("Gift search by buyer or recipient email"). If U-073 is not the unit that will call these, each is a test-only export under B7. The PM confirms the owner for each name; Flash is confirmed by delta-log.md:116.

## Decisions (round 5)

| Where | Decision | Lives in | Verdict |
|---|---|---|---|
| lib/tableQuery.ts parseSort | sort column and direction from the address | lib | pass (fallback on unknown column) |
| lib/tableQuery.ts parseCursor, parseSearchTerm | cursor and term from the address | lib | pass, with the repair note above |
| lib/tableQuery.ts nextSortDirection, ariaSortFor | sort flip and aria state | lib | pass |
| lib/statusBadge.ts parseStatusFilter, statusFilterChips | which status is selected and the chip set | lib | pass, with the repair note above |
| lib/statusBadge.ts statusBadgeTone | status tone to Badge tone | lib | pass (tested, exhaustive via satisfies) |
| lib/flash.ts serializeFlash, readFlash, parseFlash | flash cookie value accepted or refused | lib | pass (Zod strict; refuses rather than cuts) |
| lib/fieldIds.ts fieldIds | described-by ids | lib | pass |
| lib/alertTone.ts AlertToneSchema | one tone list | lib | pass (round 3 fix holds) |
| components/StatusBadge toneIcon | status tone to icon | component (presentation, same pattern as Alert) | pass |
| components/DataTable, SearchField, StatusFilterBar | empty, error, and cursor branches as conditional markup | component | pass |

## Rules (B1 to B17, full-diff sweep)
- B1: PASS. No fetch, Drizzle, SDK, or process.env in added lines.
- B2: PASS. Decisions are in lib; components only branch on lib results and map to markup.
- B3: PASS. No file under src/server or root configs in the diff.
- B4: PASS. lib imports only lib and zod; components import components, lib, next/link, and lucide; no relative escape.
- B5: PASS. readFlash parses the cookie with a strict Zod object; serializeFlash validates before it writes.
- B6, B9, B10, B14, B15: N/A. No data-layer function, Server Action, Route Handler, cache, or money path.
- B7: see Unconfirmed. No test-only export in a component file without a TODO(U-073).
- B8: PASS. No 'use client' in the diff.
- B11: PASS. No vendor SDK.
- B12: PASS. No money, Date.now, argument-less new Date(), or toFixed.
- B13: PASS (see the catch note).
- B16: PASS. No `style=` prop in added lines, stories included. Tokens for colour, spacing, radius, font size.
- B17: FAIL (Select and HomeHero). Otherwise PASS: Field centralises the wiring Input, Select, and Textarea would each repeat; DataTable takes splitPage-shaped cursors; parseCursor reuses BrowseQuerySchema's cursor schema; statusBadge reuses resolveBadgeTone; alertTone is the one tone list.

## Verification
- node_modules/.bin/vitest run src/lib/alertTone.test.ts src/lib/flash.test.ts src/lib/tableQuery.test.ts src/lib/statusBadge.test.ts src/lib/fieldIds.test.ts: 5 files, 90 tests, all pass.
- Typecheck and the component tests were not run in this round.
- Mutation testing was not run (read-only audit).

Rules: .claude/standards/architecture.md (project)
Files audited: as listed above.

ARCH_VERDICT=FAIL ARCH_SHORTCIRCUIT=0 ARCH_BLOCKING_COUNT=2
