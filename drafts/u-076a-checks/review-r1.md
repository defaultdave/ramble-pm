VERDICT: REQUEST_CHANGES

# Review r1: PR 1022, U-076a (head d5e9eeff)

Size: 2260 insertions, 121 deletions, 28 files. About 1,500 of it is lockfile, tests, stories, fixtures. One logical change; no split needed.
Not run: no node_modules in the scratch worktree, so tests, lint, tsc were not executed. Review is by reading.

## Scope audit
All changes within scope or among the declared departures. Nothing in U-076b/c, settings, src/server/cache, schema, gifting, axe rows. Departures accepted: audit rows in saveHelpArticle (null userId skipped, justified in a comment), authzEditorialRows row, Tiptap deps, nav link in opsNav.ts (test and README count updated), help_articles as the entry store.

## Findings

1. **Required** src/lib/editorialAdmin.ts:parseEntryForm + src/components/EditorialAdmin/EntryForm.tsx (hidden `status`, `position`) - the status an entry is saved in comes from a hidden field the form was rendered with, not from the database. "Save" keeps `current` from the form. Input that goes wrong: open an article as a draft in tab A, publish it in tab B, then press "Save draft" in tab A. The save writes status=draft, so a live article is unpublished, the notice says "Saved.", and a cached guest page is cleared. The same stale form also overwrites a changed `position`. Fix: for intent `save`, omit status from the update (keep the stored one inside the transaction), or take status from the locked `before` row; derive position from the row too. Add a DB test: publish, then save with a stale `status=draft` form, assert still published.

2. **Required** src/app/(ops)/README.md (new Editorial table, saveEntryAction row and the cache row) - says a save clears "`help-articles` and the article's own tag". Only `{kind:'helpArticles'}` is emitted, which maps to the single tag `help-articles` (src/lib/cacheTags.ts:79, src/server/help.ts:16,25); there is no per-article tag. The page map is a checked doc under CLAUDE.md. Fix: say `help-articles` only.

3. **Nit** src/lib/editorialAdmin.ts:130,146 - `not_found` notice code and text are defined but the action redirects to `editorialPath` with no notice (src/server/actions/editorial.ts:28). A save of a deleted/unknown id lands on the list with no explanation. Redirect with `noticeHref(editorialPath, 'not_found')` or drop the code.

4. **Nit** src/lib/richText/sanitize.ts:608 - `TODO(U-076a): first caller` is now stale (the editor and action are the callers). Remove it (one-line touch outside the diff, acceptable as the unit that resolves it).

5. **Optional** parseEntryForm: a blank slug on an existing published article is regenerated from the title, so clearing the field silently renames the public address. Consider keeping the stored slug when the field is blank on edit.

6. **Optional** Validation and slug-clash redirects reload the form from the database, so a long unsaved body is lost on `invalid`/`slug_taken` (same pattern as src/server/actions/experiences.ts, so consistent with the repo). The slug clash on a long new article is the worst case; consider a client-side check or accept and log as follow-up.

7. **FYI** Last-write-wins with no version check: two editors saving the same article overwrite each other. Not in the unit's ACs; note for U-076c.

## Checked and fine
- Authz: page gate holdsOpsRole, action opsCallerOrLeave, DB fns requireStaff; new authz row added; id parsed through parseIdField before the query, so a bad id is a 404, not a DB error.
- Stored-document safety: server re-validates through HelpArticleInputSchema (richTextSchema refuses unsafe hrefs, unknown nodes; byte cap 100k; DB CHECK backstop; raw field cap 200k before JSON.parse). Client sanitize is convenience only; server is the boundary. Links limited by safeLinkHref (no javascript:).
- Unbounded work: sanitizer has visit budget and depth cap; list reads capped at 200; raw text fields capped at 1000 chars before Zod.
- Empty publish: empty paragraphs are dropped by the sanitizer, so hasContent refuses a publish of a blank body.
- Audit rows written in the same transaction, ids and codes only, no PII; subjectKind `help_article` fits the audit word pattern.
- CSRF: Server Action (framework origin check); intent whitelisted via pickKnown.
- Tiptap packages align on 3.34.0 core; static-renderer 3.33.1 resolves against core 3.34.0 (single core in the lockfile).
- Tests: form parser, action, editor, DB behaviour, authz row all covered; one gap noted in finding 1.
