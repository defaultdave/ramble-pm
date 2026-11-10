## spec-compliance: NEW-2 PASS

Scope: issue #910, head cb9f0901d2963548f8d9f21dd02bececab54ae89, diff `origin/main...HEAD` (44 files, all added, all under `src/components/{DataTable,Select,Textarea,SearchField,StatusBadge,ConfirmDestructive,Flash}/` or `src/lib/{fieldIds,flash,statusBadge,tableQuery}.ts`).

### Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | DataTable with sort, cursor pagination, empty state, error state | PASS | Sort: `src/components/DataTable/DataTable.tsx:130-143` (aria-sort, sort links via `sortHref`). Cursor pagination: `DataTable.tsx:172-188` (First/Next links via `firstPageHref`, `nextPageHref`). Empty: `DataTable.tsx:93-105`. Error: `DataTable.tsx:82-91`. Helpers: `src/lib/tableQuery.ts:74-98`. |
| 2 | Select | PASS | `src/components/Select/Select.tsx:26-83` |
| 3 | Textarea | PASS | `src/components/Textarea/Textarea.tsx:17-58` |
| 4 | SearchField | PASS | `src/components/SearchField/SearchField.tsx:26-69` (GET form, role="search", term in address, clear link at :60-66) |
| 5 | StatusBadge with a filter bar | PASS | Badge: `src/components/StatusBadge/StatusBadge.tsx:26-29`. Filter bar: `src/components/StatusBadge/StatusFilterBar.tsx:17-36`, chip logic `src/lib/statusBadge.ts:43-71`. |
| 6 | ConfirmDestructive dialog | PASS | `src/components/ConfirmDestructive/ConfirmDestructive.tsx:33-86`. Dialog gates the action (:65-83), Cancel takes focus first (:73), action runs only through the confirm form submit (:71). |
| 7 | Flash message after a Server Action | PASS (contract only) | Component: `src/components/Flash/Flash.tsx:10-12`. Cookie contract: `src/lib/flash.ts:15-30` (`serializeFlash`, `parseFlash`). See Non-blocking. |
| 8 | Storybook stories for each component, every state, under axe | PASS | Stories: `DataTable.stories.tsx:106-134` (sorted asc/desc, first/middle/last page, empty, empty past last page, error, focus); `Select.stories.tsx:25-45` (default, no hint, placeholder, focus, optional, error, disabled); `Textarea.stories.tsx:20-35`; `SearchField.stories.tsx:34-48`; `StatusBadge.stories.tsx:13-19` (all five tones); `StatusFilterBar.stories.tsx:38-55`; `ConfirmDestructive.stories.tsx:50-77` (closed, open, dark, submitting); `Flash.stories.tsx:20-40` (four tones, null). Axe gate: `.storybook/preview.tsx:17` (`a11y: { test: 'error' }`). |
| 9 | No ops page or data function; no file outside the seven component folders and new src/lib helpers | PASS | `git diff --name-status origin/main...HEAD` lists only `A` entries under the seven folders and four `src/lib` helpers. No `'use server'`, no `app/` or `src/server/` paths, no exported async functions in the diff. |

### Blocking
None.

### Non-blocking
- **AC #8 (axe scope):** `landmark-unique` is disabled in `src/components/DataTable/DataTable.stories.tsx:90`, `src/components/SearchField/SearchField.stories.tsx:18`, and `src/components/StatusBadge/StatusFilterBar.stories.tsx:22`. Axe still runs on those stories, but one rule is off for them.
- **AC #7 (flash flow):** `src/lib/flash.ts:14` carries `TODO(U-073)`. No Server Action in this diff writes the flash cookie, so the flash is shown after an action only once U-073 wires the caller. This matches the scope manifest (no ops pages or data functions), so I did not count it as a FAIL.
- **Naming:** `export const Error` in `src/components/DataTable/DataTable.stories.tsx:121` shadows the global `Error` inside that module.

### Unconfirmed
- Axe pass was not run. The gate is configured globally (`.storybook/preview.tsx:17`), but no run result was checked.
- The issue body was not fetched (no GitHub calls). `ramble-pm/drafts/new-2-issue-body.md` holds the scope manifest but no `## Acceptance Criteria` checklist, so the nine criteria above come from the caller's list.
- `splitPage` (named in `DataTable.tsx:40`) exists on main at `src/lib/pagination.ts`. Its ops-side caller is out of scope for this unit.

---
<sub>spec-compliance | manual check | read-only</sub>
