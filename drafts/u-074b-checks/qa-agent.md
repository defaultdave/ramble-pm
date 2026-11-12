PASS (gaps named: no browser rendering, no signed-in page render, no Postgres so tests/db/experience-editor.db.test.ts not run, no page-level test of the three pages, no visual check against Figma)

# QA verdict, U-074b ops experience editor (head 6bd331b)

Method: code and test trace only (no browser, no database, no servers). Ran `bunx vitest run --project unit --project components` on the six new/changed test files (experienceEditor, experienceViews, experienceWrites, opsNav, ExperienceEditor component, experiences action): 6 files, 149 tests, all pass.

## Flows traced

- Index filters and paging: page parses status, host, category and cursor from the address. Host/category values are accepted only if they are in the offered choices (parseExperienceFilters), then read with a name+id keyset cursor, 25 per page. The status bar, host/category GET form (status carried as hidden input) and DataTable paging links are all addresses. Covered by ExperiencesList component tests (status links keep other filters, form carries status, paging by link) and by the DB test (paging with cursor, each row once, three filters together).
- Empty state: ExperiencesList passes an empty message ("No experiences match"); component test covers it.
- Create a draft: /ops/experiences/new shows form with default cancellation tier, createExperienceAction parses, createExperience inserts draft, price options and one audit row in a transaction, then redirects to the new experience with notice "created". Covered by action tests and DB test (draft, options, audit row naming user and host; adult-only price; waiver rules).
- Edit content and prices: updateExperience locks the row, diffs, writes experience and price options (upsert on experience+kind) and the audit row in one transaction. Covered by DB test (changed field, changed price to same row, added price to new row) and cache invalidation tests (live listing, place move, refused save invalidates nothing).
- Refused form: parse failure redirects back to the form with notice=invalid and fields=comma list of known field names; data-layer refusals (guide-only with no link, saved price removed, stale reference) do the same or show reference_missing. Form marks fields invalid with the problem text (component test, including checkbox as alert). Action tests cover parse failure and data-layer refusal for both create and update.
- Unchanged save: no write, no audit row, redirect with "unchanged" info notice. DB test covers it, notice text covered.
- Non-ops visitor: all three pages render OpsAccessDenied (next path kept) for anyone without the ops role, before any read. Actions redirect non-ops callers (admin, nobody) to the list, parsing and writing nothing (action test). Data-layer functions throw ForbiddenError for refused callers and a snapshot proves nothing is written (DB access test).
- Unknown or malformed id: page calls notFound() (the ops area has a not-found.tsx and error.tsx); action sends a bad id or missing experience to the list.
- Nav: Experiences link added to opsNav, test updated.

## Findings

No failures found. Observations, none blocking:

1. The three page.tsx files have no test of their own (no render of the denied branch, notFound branch, or the notice/problems wiring). The branches are small and the pieces are tested, but the wiring is only read, not run.
2. Notice "reference_missing" on the new form and "unchanged" are exercised through unit tests of text and actions, never rendered in a page.
3. The edit page titles itself with the experience name; an experience with a very long name (120 chars max) was not visually checked.
4. Removed the `TODO(U-074b): first caller` comment in policies.ts, consistent with listCancellationTiers now being used.
5. Scope: only files in the unit's area plus a small export refactor in lib/catalog.ts (rule helpers made public, behaviour unchanged); not a scope violation.

## Gaps I could not exercise

- Browser: no real rendering, layout at mobile widths, focus handling, keyboard use, or a11y of the form and table.
- Signed-in rendering: whether an ops session reaches the pages and the nav link shows; the real redirect with a query string.
- Database: the DB suite (684 lines, tests/db/experience-editor.db.test.ts and authz matrix additions) was read, not run; the keyset cursor SQL and the slug-retirement trigger depend on Postgres.
- Cache invalidation effect on guest pages (updateTagsForChanges) in a running app.
- Figma-vs-built visual check (Storybook stories exist; not viewed).
