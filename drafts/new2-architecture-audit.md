FAIL

## architecture-audit: NEW-2 "Ops admin UI kit" (head b293490, round 7)

Rules: .claude/standards/architecture.md (project; read in the worktree at head b293490aaff8207e5cb868cc72515f82ee2c752c), with wave-3 rules (drafts/wave3-review-rules.md).
Diff: git diff origin/main...HEAD (53 files, 2458 insertions) and git diff 0955798 HEAD (7 files: Select, HomeHero, HomeHero.module.css).
Judged against the amended manifest in delta-log.md "NEW-2 rulings" (2026-11-10), which now names HomeHero.tsx and HomeHero.module.css.
Files audited: the full diff file list; src/components/Select/Select.tsx and Select.module.css; src/components/HomeModules/HomeHero.tsx and HomeHero.module.css; src/components/Field/Field.tsx and Field.module.css; src/components/Input/Input.module.css; src/lib/tableQuery.ts, flash.ts, fieldIds.ts, alertTone.ts; src/lib/filters.ts (browseHref, toQuery, SelectOption) on origin/main; evidence/pr/unit-U-NEW-2/hero-*.png.

### Round 6 blocker
- Select / HomeHero duplication: RESOLVED. HomeHero.tsx no longer defines SelectField or imports SelectOption. It renders `<Select variant="hero">` twice (HomeHero.tsx:58 and :76, import at :6). Select gained a `hero` variant (Select.tsx:29, 40, 60; Select.module.css:37-43), and the markup exists once in src/components/Select/.
- Dead CSS: RESOLVED. HomeHero.module.css no longer has .label, .select, .selectControl or .chevron. Every remaining class (.hero, .inner, .copy, .art, .heading, .body, .search, .field, .submit) is read by HomeHero.tsx. Select.module.css classes (.control, .select, .chevron, .hero) are all read by Select.tsx.
- Unused exports: RESOLVED. The new type exports (SelectVariant, SelectOption, SelectProps) are type-only and exempt from B7. Every non-type export of the new component and lib files has a non-test importer or a `TODO(U-073): first caller` marker (checked by grep across src/, excluding tests and stories). lib exports used only by tests are outside B7, which covers components and data-layer files.
- HomeHero behavior: unchanged, with one exception noted under Non-blocking. Compared with the round-6 SelectField: label tokens come from Input.module.css .label (same tokens as the removed .label); padding-right space-10 comes from `.control.hero .select` (three classes, so it beats `.control .select`); chevron colour comes from `.control.hero .chevron`; no placeholder option, name and defaultValue pass through `...rest`, and the id comes from useId, as before. Pixel check: evidence/pr/unit-U-NEW-2/ holds six before/after pairs (375 and 1024 desktop, mobile 1024, guests-default 375 and 1024). Each pair has the same SHA-256 (for example hero-before-hero-mobile-375.png and hero-after-hero-mobile-375.png both 26f65cc1...). The after files share the head commit's minute (11:27). I did not re-render them.

### Full-diff sweep (defect classes and rules B1 to B17)
- B1, B3, B12, B16: no fetch, process.env, Date.now, new Date(), toFixed, inline style, hex or rgb colour, or px literal in added lines. Nothing added outside the data layer touches the network or the database.
- B2: .filter, .sort, .reduce in added lines appear only in src/lib (fieldIds.ts:17, tableQuery.ts filter over singleValues). None in components, app, or server.
- B3, B8, B11: no 'use client' or 'server-only' added in the diff. No vendor SDK import.
- B4: added imports point one way. Components import components and lib; lib imports lib and zod only; no components or server import from lib.
- B13: one catch (flash.ts:39, parseJson) returns a typed failure ({ ok: false }) that readFlash turns into reason 'not-json'. It is not an empty catch and returns no null or []. Accepted.
- Data in logs: no console, logger, Sentry, or captureException in added lines.
- B17 (reuse): one blocking finding below. Field frame, alertTone, fieldIds, and the Select look are shared and reused (Input, Textarea, Select, Field; Alert imports AlertTone from lib/alertTone.ts). tableQuery reuses parseSingle, RawSearchParams, and the cursor schema from filters.ts; splitPage from pagination.ts is the cursor source.

### Blocking
- B17 duplication: src/lib/tableQuery.ts:86 `tableHref` repeats the job of `browseHref` at src/lib/filters.ts:246-248. Both build `path?query` from URLSearchParams and return the bare path when the query is empty. Input for the duplicate: tableHref(path, {name: value}) with null, undefined, and '' dropped; browseHref(query) through toQuery's entries. Fix: move the path-and-entries builder into one shared src/lib function that accepts [name, value] pairs (as toQuery does, so repeated keys survive), have browseHref and tableHref both call it, and cover the shared function in one test. tableHref maps its record to pairs and drops the empty values first.

### Non-blocking
- Select.tsx:9-13: `SelectOption` redeclares the type at src/lib/filters.ts:361 (same name, same value and label, plus disabled). A type is not in B17's list (function, hook, component, constant, Zod schema), so this is not blocking. Fix when touched: `SelectOption & { disabled?: boolean }` built on the lib type, so one name means one shape.
- Select.module.css:15: `.control .select` sets cursor: pointer, so the hero selects now show a pointer cursor. The old hero select had the default cursor (Input.module.css sets a cursor only when disabled). This is a hover change the PNG evidence cannot show. Dave should accept it or the hero select should override it. This is the one departure from "HomeHero behaviour unchanged".
- tableQuery.ts:63-64: parseSearchTerm turns an over-limit term (over 100 characters) into an empty term, so the page shows the unfiltered list. readFlash refuses bad input instead. Consider failing closed (an error message, or refusing the term) so the user sees why the search did nothing. Not a security boundary; judgment for the PM.

### Unconfirmed
- Vitest was not run in this audit (read-only scope). Select.test.tsx:58-70 (hero variant) and HomeHero behaviour were checked by reading the code, not by execution.

Verdict: FAIL on one blocking item (B17, tableHref). The round-6 blocker is resolved; the other rules are clean.

---
<sub>architecture-audit | haiku | read-only</sub>
