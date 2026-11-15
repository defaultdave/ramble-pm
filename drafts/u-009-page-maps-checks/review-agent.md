VERDICT: PASS

Round 2 of f2a9860 on unit/U-009-page-maps. Fix diff 58dee04..f2a9860 is 3 README.md files, 4 lines changed, nothing else.

## Round 1 findings and round 2 resolution
1. Guest README claimed help reads skip the cache on a miss. RESOLVED: `src/app/(guest)/README.md` now says help is the exception. Verified: `src/server/help.ts` keeps `cacheLife('editorial')` at lines 15 and 24 with no uncached switch. legalPage.ts (18, 25), collections.ts (53), hostPage.ts (30) and experiencePage.ts (31, 48) do switch to `cacheLife('uncached')` on a miss, as the README says.
2. Three READMEs (guest, sign-in, checkout) showed an ops settings save as a live clearing path. RESOLVED: each row now reads "no screen yet: `updateSettings` has no caller, `TODO(U-078)`". Verified: `src/server/db/settings.ts:63` carries `TODO(U-078): first caller`, line 80 calls `updateTagsForChanges([{ kind: 'settings' }])`, and no file in src other than settings.ts references `updateSettings`.

## Other checks
Scope: only README.md files, unchanged set. No em dashes added. No other claims changed.
