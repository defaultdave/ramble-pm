VERDICT: APPROVE

# Review r2: PR 1022, U-076a (head 7d1d4d3e)

Read-only review of the round-2 delta (d5e9eeff..7d1d4d3e, lockfile excluded): 26 files, 1084 insertions, 304 deletions. Part of this is main's merge (guardedForm, contact, privateSession, support), which I did not judge. Tests, lint and tsc were not run.

## Round 1 findings

| # | Finding | Status | Evidence |
|---|---|---|---|
| 1 | Stale form overwrote status and position | Fixed | `saveHelpArticle(caller, input, intent)` in src/server/db/editorial.ts settles status (`statusAfter(intent, before.status)`) and position from the locked row. DB test "keeps the stored status and position when a stale tab saves its draft" and "unpublishes only on the unpublish intent" cover it. |
| 2 | README claimed a per-article tag | Fixed | `(ops)/README.md` now says `help-articles` only, and the saveEntryAction row describes the stale-tab behaviour. |
| 3 | `not_found` had no notice | Fixed | `entryRedirect` sends `not_found` to `/ops/editorial?notice=not_found`. The list page parses `entryNoticeCodes`. Tests in editorialAdmin.test.ts and editorial.test.ts. |
| 4 | Stale TODO in sanitize.ts | Fixed | Line removed. |
| 5 | Optional: blank slug renamed the article | Taken | The hidden `currentSlug` field is the fallback for an existing article. The hint text is updated. |

## New code sweep

No Critical or Required findings.

- **Optional** src/lib/editorialAdmin.ts:parseEntryForm - the parser still derives status from the form's `status` field, so the `hasContent` check runs against the form's status, not the stored one. Input: tab A holds a published form, tab B unpublishes it, and A clears the body and presses Save. The parser refuses it as `invalid` on the body even though the stored row is a draft and would accept it. This is harmless (the editor sees a body notice and reloads) and the safe direction. Accept as is.
- **Optional** `currentSlug` is the form-open snapshot. Input: tab B renames the slug, then tab A blanks the field and saves, so the old slug is restored. The editor cleared the field themselves, and the hint says "keep the current one". Accept as is.
- **FYI** Title, summary and body stay last-write-wins (the r1 FYI 7), unchanged. Only status and position are now settled server-side.
- **FYI** `empty_body` is returned inside the transaction before any write, so nothing is persisted and no cache change is emitted. It maps to the `invalid` notice on the body field through `entryRedirect`, and DB test "refuses a save that leaves a published article without text" covers it.
- `auditFor` returns null for a null userId and otherwise delegates to `entryAuditEntry`. It carries ids and codes only, and it uses the settled status, so the audit action matches what was written.
- `getHelpArticleForEditing` now validates the id with `WriteIdSchema` and returns null instead of reaching the database with a bad value.
- `parseBody` now returns the raw text when it is not JSON, so the schema names the `body` field instead of reporting a missing one. This is an improvement.
- Not judged: the main-merge files. `src/lib/richText/href.ts` and `src/app/(guest)/guide/[slugAndId]/page.tsx` appeared in the delta, and I did not check whether they belong to main or to U-076a.

## Required changes
None.
