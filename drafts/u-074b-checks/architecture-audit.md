# Architecture Audit: U-074b final re-audit (round 4, delta 8d2fa8c..d467017)

Verdict: **PASS** (0 blocking)
HEAD: `d467017ed25af0ab06e5c5e09abecec973782c5c` (matches expected)
Rules: `.claude/standards/architecture.md` (project, in worktree)
Scope: delta `8d2fa8c31cc9d2e38980241d2e42927cace5918a..HEAD` touches one in-scope file, `src/server/db/catalog.ts` (+2 / -3). In scope under `server/**`.

## Round-3 blocking item (B17, `byNameThenId`): fixed

- The private constant `const byNameThenId = [asc(experiences.name), asc(experiences.id)];` is gone from `src/server/db/catalog.ts`. A grep of `src/` finds no other definition or inline copy of that ordering in `catalog.ts`.
- `catalog.ts:23` imports `byNameThenId` from `./keysetPage`. `catalog.ts:119` calls `orderBy: byNameThenId(experiences)`, the same table the old constant was built on, so the ordering is unchanged.
- The import is server-to-server (`src/server/db` to `src/server/db`), so B4 holds.
- `asc` is still used in `catalog.ts` (`adultFirst`, and the category, neighborhood and slug-history orders), so the import list is not left with an unused name.
- Existing callers of the shared helper are unchanged: `experienceEditor.ts:107`, `hostSetup.ts:175`.

## Regression check on the delta

- No other file changed between 8d2fa8c and HEAD.
- No new import outside `src/server/`, no `process.env`, no `'use client'`, no vendor SDK, no `catch`, no style, no money or time code.

## Part (b): B1 to B17 on the delta

| Rule | Result | Notes |
|---|---|---|
| B1 | PASS | No fetch, DB or SDK call added outside the data layer. |
| B2 | PASS | Only an ordering expression moved; SQL `ORDER BY` is not a decision. |
| B3 | PASS | `catalog.ts` already imports `server-only`. No new `process.env`. |
| B4 | PASS | `./keysetPage` is a same-layer import. |
| B5 | PASS | Return path unchanged (`HostExperienceSchema.array().parse(rows)`). |
| B6 | PASS | `listHostExperiences` still calls `requireRole` before the query (unchanged by this commit). |
| B7 | PASS | `byNameThenId` now has non-test callers in `catalog.ts`, `experienceEditor.ts` and `hostSetup.ts`. |
| B8 to B16 | PASS or N/A | No `'use client'`, route handler, money, cache, or style change in the delta. |
| B17 | PASS | The duplicate is removed. The shared helper is the only definition. |

## Advisory (carried from round 3, none in this delta, not re-checked this round)

1. `src/lib/privateSession.ts:48`: `dollarsText` strips `[$,\s]` on its own, so a budget of `12,50` still reads as 1250 dollars. The money change refuses that input elsewhere. Route the budget through `priceMinorFromText` or a whole-dollar variant in `money.ts`.
2. `src/lib/signIn.ts:128`: inline `/^\d{1,7}$/` duplicates `wholeNumberPattern` (`src/lib/text.ts:4`).
3. `src/components/CheckoutPage/CheckoutForm.tsx:48`: `optionalError` repeats the wrap half of `errorProps` (`src/lib/opsForm.ts:66`). Similar local copies exist in `HostSessionForms.tsx`, `ContactForm.tsx:71`, `PrivateSessionForm.tsx:45`.
4. Inline `asc(x.name), asc(x.id)` ordering that `keysetPage.byNameThenId` could cover: `src/server/db/experienceEditor.ts:123` (choices list), `hosts.ts:52`, `home.ts:48`, `browse.ts:285`, `sessions.ts:743`.
5. `src/lib/money.ts:40`: `priceMinorFromText` now refuses `1 200` and `$ 85`, which the old parser accepted. The tests assert this on purpose. Behaviour change for Dave to confirm, not a layer violation.

## Proposed debt for Dave (not blocking)

CheckField vs Checkbox; duplicated `.problem` / `.muted` CSS; duplicated `.pair` media-query CSS; duplicated `.legend` CSS.

## Result

PASS. 0 blocking. The one round-3 blocking item is fixed with no leftover copy, and the delta has no other changes.

Files audited: `src/server/db/catalog.ts`, `src/server/db/keysetPage.ts`, `src/server/db/experienceEditor.ts`, `src/server/db/hostSetup.ts`.

---
<sub>architecture-audit | haiku | read-only | u-074b round 4</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
