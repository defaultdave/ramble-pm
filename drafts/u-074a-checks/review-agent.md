# U-074a review-agent verdict

**Verdict: PASS** (APPROVE_WITH_NITS)
**Head:** 98fe33d59fc5019dd8ef962fd9f130c48e1aee57
**Reviewed:** whole unit as previously passed at 21b3aa7, plus delta 21b3aa7..98fe33d (11 files, +167/-117).

## Delta checks
- Behaviour: no change. The agreement tick label and the record prompt render the same strings as before, now from `agreementTickLabel` and `agreementRecordPrompt` in `src/lib/hostSetup.ts`. `defaultHostTimeZone` equals the old `defaultZone` ('America/New_York'). `maxEmailAddressLength` is 254, the same as the old literals in `HostForm` and `optionalEmail`.
- Imports: `appOrigin` is now exported from `src/server/auth/forms.ts`, and `hostInvite.ts` is its only consumer. `signInLink.ts` no longer imports env. No stale references remain, `tsc --noEmit` is clean, and `host-setup.db.test.ts` still uses `hosts` and `expectConstraint`.
- Moved tests: the five CHECK-constraint refusals and the max-values acceptance moved verbatim to `tests/db/host-limits.db.test.ts`, and the file has its own harness setup. Nothing was lost. The new wording helpers have tests in `src/lib/hostSetup.test.ts`.
- `catalog.db.test.ts`: only the host-skip mechanism changed (`it.skipIf` became an `it.skip` alias). The same two shared-slug cases run for category/experience and skip for host. Two titles were reworded.
- Scope: no creep. Every change is a refactor or test move inside U-074a's files.

## Findings
- **Nit** `src/server/auth/signInLink.test.ts` — the "appOrigin is the origin of APP_URL, without its path" test was deleted with the move, and no test covers `appOrigin` in `forms.ts` now. It is a one-line `new URL(...).origin`. A forms test or the host-invite test could assert the invite link's origin if you want it pinned. Not blocking.
- **FYI** `hostInvite.ts` now imports from `auth/forms.ts` (the form-handler module) only to get a helper. It is acceptable here, and a small `auth/origin.ts` would be cleaner if a second consumer appears.

No Critical or Required findings. Earlier PASS items (scope, ACs, tests, logging, docs) are unaffected by the delta.
