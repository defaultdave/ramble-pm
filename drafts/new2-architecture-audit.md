FAIL

## architecture-audit: NEW-2 "Ops admin UI kit" (head cb9f090)

Rules: .claude/standards/architecture.md (project; read in the worktree at head cb9f0901d2963548f8d9f21dd02bececab54ae89)
Diff: git diff origin/main...HEAD (44 files; 25 non-test, non-story source files audited)
Files audited: src/lib/tableQuery.ts, src/lib/statusBadge.ts, src/lib/flash.ts, src/lib/fieldIds.ts, src/components/DataTable/DataTable.tsx, src/components/StatusBadge/StatusBadge.tsx, src/components/StatusBadge/StatusFilterBar.tsx, src/components/SearchField/SearchField.tsx, src/components/Select/Select.tsx, src/components/Textarea/Textarea.tsx, src/components/Flash/Flash.tsx, src/components/ConfirmDestructive/ConfirmDestructive.tsx, and the CSS modules of the same folders

### Blocking
- src/lib/flash.ts:25-26: B13. catch { return null; } in lib/**. The rule has no exception for a parse of untrusted input, and the cookie is untrusted. The fail-closed behaviour (show nothing, never repair) is the intended design, so the fix is a PM ruling, not a rewrite: either Dave adds a B13 exception for an untrusted-input parse (as he did for rethrowOrLog), or the parse returns a discriminated result (ok: false) that the caller maps to "no flash", with no swallowed value returned from a catch. Blocking until one of those is decided.
- src/components/Textarea/Textarea.tsx:17-58 (and src/components/Input/Input.tsx:17-61): B17. The new Textarea nearly duplicates the existing Input: the same props (label, hint, errorText, optional, aria-describedby), the same label, optional marker, hint and error markup (Textarea.tsx:31-57 against Input.tsx:37-58), and the same id wiring. Only the element differs. Fix: extract the field frame (label, optional, hint, error, fieldIds wiring) into one shared component, or give Input a multiline variant and make Textarea a thin wrapper. Add a test that the frame renders the same for both.
- src/components/Select/Select.tsx:26-82: B17. Same finding as Textarea. The label, optional, hint and error shell (Select.tsx:42-80) is a copy of the Input shell. Fix: the same shared field frame, with the select element as its child.

### Non-blocking
- src/lib/tableQuery.ts:28-34 (parseCursor): an oversized or empty cursor silently restarts at the first page. Browse does the opposite (cursor_not_found, src/server/browse.ts). Not a security issue here, but the two read paths disagree. Decide once, before the first ops caller.
- src/lib/flash.ts:16 (serializeFlash): message.slice(0, FLASH_MAX_LENGTH) repairs an over-long message instead of failing closed. The input is server-authored and there is no caller yet (TODO(U-073) is present and valid). Recommend the U-073 action validate with flashSchema before serializing.
- src/lib/flash.ts:8 vs src/components/Alert/Alert.tsx:6: the tone set info|success|warning|danger is defined twice (Zod enum and AlertTone). A runtime list cannot be imported from a component, so the fix is one const in src/lib/, used by both. Audit item for the first Flash caller.
- src/lib/fieldIds.ts:2-20 vs src/components/Input/Input.tsx:27-35, src/components/Checkbox/Checkbox.tsx:28, src/components/Stepper/Stepper.tsx:34-42: the same id and describedby calculation already sat inline in these components before this diff. Audit item (predates the diff). Migrating Input, Checkbox and Stepper to fieldIds is the fix.
- src/components/StatusBadge/StatusBadge.tsx:18-24: a tone-to-icon map lives in the component while the tone-to-colour map lives in src/lib/statusBadge.ts:7-13. This is presentational, so it passes B2, but the two maps for one concept should sit together. Acceptable as is.
- CSS modules in DataTable, Select and Textarea use 1px and 2px border and outline widths as literals. Input.module.css:32,47-51 already uses them, so this matches the precedent. Not a B16 finding; a focus-ring width token would be a future cleanup.
- Exports with no non-test caller in the diff: parseCursor, parseSearchTerm, parseSort, parseStatusFilter, parseFlash. B7 names component and data-layer files, so these are not literal B7 hits. ARCH-6 still applies in spirit; they should get a caller in the ops units that consume the kit.
- ConfirmDestructive.tsx:1 ('use client') and its .confirm CSS overriding Button's --color-action-primary-* tokens: known and approved (delta-log). Not a finding. The CSS coupling to Button internals is noted for the next Button change.

### Unconfirmed
- B7 on the kit components: DataTable, Flash, SearchField, Select, StatusBadge, StatusFilterBar, Textarea and ConfirmDestructive have no importer in src/app or src/components outside their own folder. Their only importers are *.stories.tsx and *.test.tsx, and none carries TODO(U-xxx): first caller. B7 names importers that are tests, and stories are not in the test list (*.test.*, *.spec.*, e2e/**). If the PM reads stories as tests, all eight are B7 blocking; the fix is one TODO(U-xxx): first caller per export naming the ops unit that consumes it. PM ruling needed: is a Figma primitive shipped ahead of its first caller exempt when its only consumers are stories?

## Decisions (B2 sweep, round 1)

Every comparison, threshold, or state rule that yields a result, in the components and in lib. Components render only; the rules are in lib.

| Where | Decision | Lives in | Verdict |
|---|---|---|---|
| DataTable.tsx:82 | error state replaces the table | component (conditional render) | not a decision |
| DataTable.tsx:93,98 | empty state, and "Back to the first page" when a cursor is set | component (conditional render) | not a decision |
| DataTable.tsx:121,130 | aria-sort value | lib (ariaSortFor); component passes it on | pass |
| DataTable.tsx:135 | sort link target and direction flip | lib (sortHref, nextSortDirection) | pass |
| DataTable.tsx:172 | pager shown when a cursor or next cursor exists | component (conditional render) | not a decision |
| DataTable.tsx:128,160 | column alignment default "start" | component (presentation) | pass |
| DataTable.tsx:153 | th for row header, td otherwise | component (markup) | pass |
| StatusBadge.tsx:18-28 | tone to icon; tone to colour | icon map in component (presentation); colour map in lib (statusBadgeTone) | pass, see Non-blocking |
| StatusFilterBar.tsx:24 | chip list, selected chip, hrefs | lib (statusFilterChips) | pass |
| Select.tsx:52,55 | aria-invalid from error; placeholder option shown | component (presentation) | pass |
| Select.tsx:39 | id and describedby | lib (fieldIds) | pass |
| Textarea.tsx:29 | id and describedby | lib (fieldIds) | pass |
| Textarea.tsx:22 | default rows of 4 | component (constant) | pass |
| SearchField.tsx:60 | clear link shown when value is non-empty | component (conditional render) | not a decision |
| SearchField.tsx:42,62 | carried fields; clear href | lib (carriedFields, changedParamHref) | pass |
| Flash.tsx:11 | nothing shown when flash is null | component (conditional render) | not a decision |
| ConfirmDestructive.tsx:43-53 | close on confirm or failure | component (client island, approved) | pass |
| lib/tableQuery.ts: parseSort, parseCursor, parseSearchTerm, nextSortDirection, ariaSortFor, tableHref, sortHref, nextPageHref, firstPageHref, changedParamHref, carriedFields | address and sort rules | lib | pass (tested) |
| lib/statusBadge.ts: parseStatusFilter, statusFilterChips, statusBadgeTone | filter rule, chip labels, tone colours | lib | pass (tested) |
| lib/flash.ts: parseFlash, serializeFlash | cookie validity rule | lib | pass for the rule; B13 blocking, see above |
| lib/fieldIds.ts | id and describedby rule | lib | pass (tested) |

## Other rules checked
- B1, B3, B4: no fetch, SDK, DB, or process.env in any changed source. Imports go one way (components to lib, components to components, lib to lib and zod). lib/statusBadge.ts imports a type from lib/badge.ts, which is allowed. PASS.
- B8: 'use client' only on ConfirmDestructive.tsx, which is approved. PASS.
- B9, B10, B12: no multi-row writes, money, or time in the diff. PASS.
- B15: no Route Handlers. PASS.
- B16: no inline style prop; no colour, radius or font-size literal in the CSS modules (color-mix uses tokens). Border and outline widths match the Input precedent. PASS.
- B17 (other than above): classNames reused; splitPage in lib/pagination.ts is the cursor source per DataTable's docs; tableHref does not duplicate toQuery in lib/filters.ts (browse needs repeated params, which tableHref cannot express). PASS.

ARCH_VERDICT=FAIL ARCH_SHORTCIRCUIT=0 ARCH_BLOCKING_COUNT=3
