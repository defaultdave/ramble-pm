FAIL

## architecture-audit: NEW-2 "Ops admin UI kit" (head 557be46, round 8)

Rules: .claude/standards/architecture.md (project; read in the worktree at head 557be46a8e36857f2ea0b19063eea43d50e97741), with wave-3 rules (drafts/wave3-review-rules.md, including the 2026-10-28 duplication sweep).
Diff: git diff b293490 HEAD (6 files) for the round-7 blocker and the sweep of changes since; git diff origin/main...HEAD (56 files) for the full pass over every non-test source file in scope (32 files).
Tests run (vitest, read-only, no files changed): src/lib/queryHref.test.ts, filters.test.ts, filters.choices.test.ts, tableQuery.test.ts, src/components/Select, src/components/HomeModules, src/lib/pages. 18 files, 580 tests, all pass. No browse or filter test changed in this round.
Files audited: src/lib/queryHref.ts, queryHref.test.ts, filters.ts (browseHref, toQuery, toQueryEntries), tableQuery.ts, statusBadge.ts, flash.ts, fieldIds.ts, alertTone.ts; src/components/Alert, DataTable, Field, Flash, HomeModules/HomeHero, Input, SearchField, Select, StatusBadge, Textarea (tsx and module.css); the import graph of every changed file; repo-wide greps for path-plus-query builders, helper patterns, and banned patterns.

### Round 7 blocker
- tableHref repeats browseHref: RESOLVED. The path-plus-query builder is one function, src/lib/queryHref.ts:6-9 (`hrefWithQuery`). `browseHref` (filters.ts:247-249) and `tableHref` (tableQuery.ts:87-98) both call it. A repo-wide grep finds no other `${path}?${...}` builder in the diff.
- filters.ts edit: MINIMAL AND BEHAVIOR-PRESERVING. Two lines change plus one import. Old: `toQuery(query)` then `?` join when non-empty. New: `hrefWithQuery(browsePath, toQueryEntries(query))`, which runs `new URLSearchParams(entries).toString()` and joins with `?` when non-empty. That is the same expression toQuery already uses (filters.ts:243-245), so the output is identical. The browse tests (filters.test.ts:317-323 and the round-trip table) pass unchanged.
- tableHref: `search.set` became `entries.push`. Equivalent, because `Object.entries` of a record has unique keys, so no name can repeat. Covered by tableQuery.test.ts, unchanged and passing.
- Stale TODO on Select: RESOLVED. The `TODO(U-073)` comment is gone from Select.tsx (it now has callers: HomeHero.tsx:57 and :75).
- Hero select cursor: RESOLVED. Select.module.css:45-47 `.control.hero .select:not(:disabled) { cursor: default; }` restores the default cursor (the round-7 non-blocking note). Specificity beats `.control .select` (Select.module.css:11-16).

### Blocking
- B17 / B2, label built in a component: src/components/DataTable/DataTable.tsx:114 `aria-label={`Scrollable ${caption}`}` and :174 `aria-label={`${caption} pages`}`. Both are display strings built by template inside a component. Fix: `scrollRegionLabel(caption)` and `pagesLabel(caption)` in src/lib (a small module such as src/lib/tableLabels.ts) with a unit test; the component calls them.
- B17 / B2, rule defined in a component: src/components/Alert/Alert.tsx:33-39 `toneRole` decides which tones announce politely (`status`) and which assertively (`alert`), with its own why as the comment. That is a decision that yields a result. Its icon and class maps (Alert.tsx:19-31) are markup lookups and are not flagged. Fix: `alertRole(tone)` in src/lib/alertTone.ts with a test (alertTone.test.ts already exists); Alert.tsx:47 calls it.
- B17, duplicated wiring across three components: the id preamble and the aria-invalid rule are written three times, once in Input.tsx:26-28 and :42 (existing on origin/main), again in Select.tsx:44-46 and :66, and in Textarea.tsx:28-30 and :46. The rule "an error marks the control invalid" lives inside each component. Fix: extend fieldIds (src/lib/fieldIds.ts) to return `ariaInvalid` from its inputs, or add one shared hook for the id and aria wiring, and have Input, Select, and Textarea call it; add the case to fieldIds.test.ts.
- B17, near-duplicate pick-from-known-values: src/lib/statusBadge.ts:33-39 `parseStatusFilter` (parseSingle, then find the option whose value is named, else null) repeats src/lib/tableQuery.ts:36-51 `parseSort` (parseSingle, then find the column named in the allowed list, else fallback). Both are new in this unit. The same pattern also exists in src/lib/badge.ts:8-10 `resolveBadgeTone` (pre-existing, audit item below). Fix: one `pickKnown(raw, allowed, fallback)` in src/lib (parse-and-match over an allowed list, with a test), used by parseSort, parseStatusFilter, and resolveBadgeTone; each keeps its own return shape.

### Non-blocking
- Round-7 item still open, repeated for the PM: src/lib/tableQuery.ts:64-65 `parseSearchTerm` turns an over-limit term (over 100 characters) into an empty term, so the page silently shows the unfiltered list. This is a repair of bad input (the wave-3 class "repairs bad input instead of failing closed"). The input element's maxLength (SearchField.tsx:51) stops typing past 100, so only a hand-edited address reaches it. Fail closed (refuse with a message) or accept it as a read-only judgment; Dave decides.
- Duplicate query stringifying: src/lib/filters.ts:243-245 `toQuery` and src/lib/queryHref.ts:8 both run `new URLSearchParams(pairs).toString()`. Fix when touched: export `queryString(entries)` from queryHref.ts and have toQuery call it.
- Two tone lists: src/lib/statusBadge.ts:6 `StatusTone` and src/lib/alertTone.ts:3 `ALERT_TONES` overlap (info, success, warning, danger; StatusTone adds neutral). alertTone.ts calls itself "the one list of alert tones". Not in B17's list (a type, not a function, hook, component, constant, or schema), so not blocking. Fix when touched: derive StatusTone from AlertTone plus 'neutral'.
- SelectOption redeclared in src/components/Select/Select.tsx:9-13, repeated from round 6 and 7 (src/lib/filters.ts SelectOption, with the same value and label). Not blocking; fix as before.
- Unbounded work, query params: src/lib/tableQuery.ts:26-33 `singleValues` and :145-152 `carriedFields` visit every query name, and SearchField.tsx:42 renders one hidden input per carried name. No count cap. The practical bound is the server's URL and header limit (not verified here). Consider a cap (for example maxFilterValues-style) as the table units land.
- Style literal: src/components/HomeModules/HomeHero.module.css:38 `letter-spacing: -0.01em`. B16 names colour, spacing, radius, and font-size; letter-spacing is not named, so this is a note, not a finding. Use a token if one exists.
- Audit items (pre-existing, not in this diff; log in audits/ in ramble-pm): src/lib/routes.ts:97 and src/lib/upcomingSessions.ts:135 build `path?name=value` by hand (a path-plus-query builder that could call hrefWithQuery). src/lib/badge.ts:8-10 `resolveBadgeTone` pick-known pattern (see the blocking item above).

### Checked and clean
- B1: no fetch, Drizzle, Neon, or SDK call in any changed file.
- B2 (lib decisions): parseSort, parseCursor, parseSearchTerm, parseStatusFilter, statusFilterChips, carriedFields, readFlash, serializeFlash, parseFlash, tableHref, hrefWithQuery all live in src/lib. Conditional rendering in components (DataTable rows and error branch, Select placeholder, SearchField clear link, Field hint and error, Flash null) is exempt.
- B3: no src/server file in the diff; no process.env read.
- B4: every import in the changed files points one way (components to components, lib, and next/link; lib to lib and zod only). lib/statusBadge.ts imports `./badge` (type only, lib).
- B5: readFlash and serializeFlash parse with Zod before use; parseSingle uses safeParse.
- B6, B9, B10, B14, B15: no server action, route handler, transaction, or cached read in the diff.
- B7: each new export has a non-test importer, except the six TODO(U-073) components and functions (DataTable, SearchField, Flash, Textarea, StatusBadge, StatusFilterBar). Accepted under the B7 exemption; see Unconfirmed.
- B8: no 'use client' in any changed file.
- B11: no vendor SDK import; no test-only export in a component or data-layer file.
- B12: no money, Date.now, or new Date in the changed code.
- B13: one catch, flash.ts:39 parseJson, returns a typed failure ({ ok: false }) that readFlash turns into reason 'not-json'. Not an empty catch and it returns no null, [], or {}. Accepted, as in round 7.
- B16: no inline style prop; every colour, spacing, radius, and font-size in the changed module.css files is a var(--...) token (the letter-spacing note above aside).
- Data in logs and failing open (wave-3 classes 3 and 4): no console, logger, Sentry, or captured error in the diff; the flash cookie is refused (too long, not JSON, wrong shape) and never repaired; serializeFlash refuses an over-length value rather than cutting it.
- Database accepting what Zod rejects (class 2): no table or migration in the diff. Flash and search Zod bounds (message 200, raw 400, search 100, cursor uuid) match their checks.

### Unconfirmed
- B7 exemption for DataTable, SearchField, Flash, Textarea, StatusBadge, and StatusFilterBar relies on TODO(U-073): first caller. docs/plan/units.yaml:1820 has U-073 ("Ops shell, passkeys, and audit wiring") but NEW-2 is not listed there, so the "later unit" ordering was not confirmed from the plan. Accepted on the TODO as in round 7.
- Mutation testing was not run in this audit.

Verdict: FAIL on four blocking items (B17 and B2): the aria-label templates in DataTable.tsx, the toneRole rule in Alert.tsx, the three-way id and aria-invalid wiring, and the pick-from-known near-duplicate. The round-7 blocker (tableHref repeating browseHref) is resolved, the filters.ts edit is minimal and behavior-preserving, and the hero select cursor is restored.

---
<sub>architecture-audit | haiku | read-only</sub>
