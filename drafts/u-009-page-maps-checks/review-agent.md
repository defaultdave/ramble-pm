VERDICT: FAIL

Commit 58dee04 on unit/U-009-page-maps. Size: 2973 insertions, 9 README.md files, docs only.

## Checks
1. Scope: PASS. Only the 9 README.md files under src/app changed, all in the manifest. No code touched.
2. Accuracy: FAIL, 2 wrong or misleading claims (below). About 60 other claims checked against code and correct: 'use client' marks, 'use cache' and cacheLife/cacheTag on every cached read named, Suspense boundaries (home, sign-in, confirm, account, experience dates and booking, ops nav, none in checkout/host), revalidatePath('/host/sessions') in hostSessions run(), updateTag vs revalidateTag('max') split (orderCancel, cancelSession, confirmOrder, pulse use revalidate; sessions, settings, editorial, photos use update), cache profile numbers, proxy matcher excluding /api, token TTL 5 minutes, 2048-byte form cap, route handler POST only.
3. Mermaid: PASS. All blocks start with `flowchart TD`, every :::kind is defined by a classDef in that block, labels with special characters are quoted. Unquoted labels are plain words only.
4. Links: PASS. Every relative link resolves (checked with percent-decoding and balanced-paren targets). `src/lib/pages/siteNav` in checkout README is a name without extension (siteNav.ts exists). `src/app/layout.tsx` appears only in "does not exist" statements, correctly.
5. Em dashes: PASS, none in the diff.

## Wrong claims
- FAIL `src/app/(guest)/README.md:697`: "Help, legal, collection, host and experience reads switch to `cacheLife('uncached')` on a miss". `src/server/help.ts` getHelpArticle (line 20-26) has no uncached switch; a made-up help slug does fill a cache entry. Drop help from the list, or note it as an exception.
- FAIL (misleading) `src/app/(guest)/sign-in/README.md:209`, `src/app/(checkout)/checkout/README.md:215`, `src/app/(guest)/README.md:681`: present "Ops change site settings / An ops user saves settings / Settings saved" as a live clearing path. `updateSettings` in `src/server/db/settings.ts:68` has no caller and is marked `// TODO(U-078): first caller`; no ops page or action edits settings (`src/app/(ops)/README.md` correctly lists none). A builder will look for the screen. Add "no caller yet, U-078" to each row.

## Minor, not blocking
- BookingChoices and useBookingDraft are marked `client` in the experience map but carry no `'use client'`; the README says so in the Notes column. Acceptable.
