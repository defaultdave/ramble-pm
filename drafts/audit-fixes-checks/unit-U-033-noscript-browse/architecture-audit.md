PASS

## architecture-audit: PF-7 (head d9376c1, range 053bd1a..d9376c1) (agent verdict, recorded by the PM because the agent is read-only)

ARCH_VERDICT=APPROVE. ARCH_BLOCKING_COUNT=0.

Blocking: none. B1, B2, B3, B4, B7, B8, B11, B16, B17 pass; B5, B6, B9, B10, B12, B13, B14, B15 N/A.

B2 ledger for `NoScriptFilters`: which filters the day form keeps (`withDate`, composed at FilterBar.tsx L134), hidden fields (`toQueryEntries`, `browseParamNames`), form target (`browsePath`), chips (`guestChips`, `listChips`, `ChipGroup`). All lib or reused. Day minimum is a pass-through, pre-filled day and group order are presentational.

Advisory: `defaultValue={filters.date ?? undefined}` reads more directly than the conditional spread. If a second caller needs "drop the day", move it to `src/lib/filters.ts`.
