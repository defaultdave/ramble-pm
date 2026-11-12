# U-074b part 2 review (head c27211a)

Verdict: PASS, no blocking findings. REVIEW_VERDICT=APPROVE_WITH_NITS

Size: 1546 insertions, 24 deletions (27 files), about 60% tests/stories. One logical change. Under 1000-line rule.
Scope: all changes within scope. No changes under src/server/auth, .github, .claude, docs, e2e. No reorder/crop/delete, no ingest behaviour change (ingest.ts only drops a TODO).
Checks run: vitest on photoForm, action, ExperienceEditor, cacheTags, experienceViews: 118 pass. tsc --noEmit clean. DB tests not run (need DB).

## Checks
- Authz before work: experiencePhotos.ts:12 `opsCallerOrLeave` is the first statement; id parse, form parse and file read follow. Test covers admin and anonymous. addPhoto re-checks role per experience.
- File validation: size refused from File.size before bytes are read (action test asserts arrayBuffer not called); addPhoto then runs the existing ingest (type sniff, pixels, re-encode).
- XSS: alt text rendered as React text only (ExperiencePhotos.tsx:64). Credit and source URL are not rendered anywhere in this diff. Source URL is validated server-side by httpUrlPattern (http/https only, no javascript:/data:), enforced by NewPhotoSchema, same pattern as the DB check. Notice code comes from a closed enum.
- Lost data: audit row is written in the same transaction as the photo row; a failed audit rolls back the row and the existing catch removes the stored file. updateTag runs after commit, outside the try, so a tag failure cannot delete a stored file.
- Tag: published only for guest-visible status; kind `photos` maps to the experience tag, test added.
- Existing callers: no other addPhoto caller in src, scripts or tests (seed does not call it). New behaviour for any future caller: a caller with userId null is refused (photos.ts, after role check), and addPhoto now calls updateTag, which throws outside a Server Action for a guest-visible experience. Both are documented in the JSDoc. DB tests updated accordingly (updateTag mocked, real user ids).

## Findings
- FYI next.config.ts:30 bodySizeLimit 11 MiB is app-wide. Every Server Action (sign-in, contact, checkout, holds, including unauthenticated ones) may now buffer up to 11 MiB, up from 1 MB, so the memory cost of one junk POST to a public action rises about 11x. Framework still rejects over the limit, and ops-only gating applies only to this action. Acceptable for a demo; accept it on purpose (ADR or decision-log line) rather than silently. Next only allows this per app, not per action.
- FYI Hosting caveat: if deployed on Vercel functions, the platform caps request bodies near 4.5 MB before Next sees them, so a 5 to 10 MiB photo gets a platform 413 and not the friendly "too large" notice. Confirm the target before relying on the 10 MiB cap in the UI hint (the form hint does not state a size).
- Optional experiencePhotos.ts:19 `experienceId` invalid id redirects to the list with no notice; fine, matches part 1 pattern.
- Optional photos.ts: the `status` read for the tag decision happens before the transaction; an experience published during the upload misses one invalidation until revalidate. Negligible.
- Nit ExperiencePhotos.tsx:84-87 alt text input is `optional` while the decorative checkbox is the alternative; server enforces it and the error text says so. Fine; consider a hint saying "Leave empty only if decorative".

## Required changes
None.
