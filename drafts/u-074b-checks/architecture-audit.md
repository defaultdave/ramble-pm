# U-074b Architecture Audit: FAIL

Branch `unit/U-074b`, HEAD `51dba4806ae21cdbb24e58bb053b0bcf6d280896`, diffed against `origin/main` (43 files).
Rules: `.claude/standards/architecture.md` (project)
Exemptions applied: B15, B6, B8 (not exercised by this diff).

## Last-round fixes

- **opsForm.ts extraction: real, with one copy left.** `formText`, `formHas`, `oversizedFields`, `slugFor`, `parseIdField`, `parseNotice`, `noticeText`, `parseProblemFields`, `noticeHref` are defined only in `src/lib/opsForm.ts`. `src/lib/hostSetup.ts` imports them and no longer defines `textOf`, `slugFor` or `parseHostIdField`. The issue-to-field loop was not extracted (see B17-1).
- **ActionNotice: real.** `src/components/HostSetup/HostNotice.tsx` is deleted and nothing references `HostNotice`, `parseHostNotice`, `parseHostIdField` or `noticeCodes` any more. The host pages and the three new experience pages all use `ActionNotice`.
- **userActor: real.** `userActor` is exported from `src/lib/audit.ts:90` and used by `src/lib/hostAudit.ts` and `src/lib/experienceAudit.ts`. No literal `{ actorKind: 'user', actorId }` copy remains in the diff. `src/lib/opsAudit.ts:19` has one, but that file is not in the diff (see A-5).
- **No behaviour change on host pages.** I compared against `origin/main`:
  - `hostNoticeCodes` lists the same 13 codes in the same order as the old `noticeCodes`.
  - `noticeHref` now goes through `tableHref`, which builds the same `URLSearchParams` (`notice` then `fields`) and drops an empty `fields`, as the old code did.
  - `parseProblemFields` gets `hostFormFields` as an argument, the same list the old code used.
  - `parseIdField` uses the same `WriteIdSchema` as `parseHostIdField`.
  - `oversizedFields(get, hostFormFields, hostLimits.rawField)` and `formText` match the old inline `hostFormFields.filter` and `textOf`.
  - `ActionNotice` renders the same `Alert` with the same tone and title, and nothing when there is no notice.

## Blocking Issues

- **B17-1** `src/lib/experienceEditor.ts:275-283` (the `parsed.error.issues` loop) copies `src/lib/hostSetup.ts:111-117`, and the ordered-field filter at `src/lib/experienceEditor.ts:246-248` copies `src/lib/hostSetup.ts:116` and `:131`. The rule is new in this diff, so it is not exempt as predating code. Fix: add `fieldsFromIssues(issues, fields)` and an ordered-fields helper to `src/lib/opsForm.ts`, and have both forms call them.
- **B17-2** `src/lib/experienceEditor.ts:160-171` (`CENTS_PER_DOLLAR`, `priceText`, `parsePriceMinor`) repeats `src/lib/hostSessions.ts:272-278` (`dollarsPattern`, exported `priceMinorFromText`). It is the same dollars-and-cents regex with the same `padEnd(2, '0')` arithmetic. `CENTS_PER_DOLLAR` also repeats the private constant at `src/lib/money.ts:4`. Fix: move the parser into `src/lib/money.ts`, which already owns the money text boundary, and have both forms use it. Keep the range check in the experience module and cover it with one test.
- **B17-3** `src/components/ExperienceEditor/ExperienceForm.tsx:45-69` (`CheckField`) and the `.check`, `.check input` and `.check input:focus-visible` rules in `src/components/ExperienceEditor/ExperienceEditor.module.css` duplicate `src/components/HostSetup/HostForm.tsx:113-121` and the same three rules in `src/components/HostSetup/HostSetup.module.css:56-76`. The CSS blocks are identical. The existing `src/components/Checkbox` primitive is controlled (it requires `onChange` and uses `useId`), so it is not a drop-in. Fix: one shared check-field component with its CSS, under `src/components/`, used by both forms. Do not add a third copy.

## Advisory

- **A-1** `src/server/db/experienceEditor.ts:218`: `waiver?.status === 'published' && legalKindOf(waiver.doc) === 'waiver'` is a decision in the data layer (B2, borderline). Move it to a `src/lib/` predicate such as `isPublishedWaiver` and unit-test it.
- **A-2** B5 judgment: `createExperience` (`src/server/db/experienceEditor.ts:244`) and `updateExperience` (`:279`) use their typed `input` without a Zod parse. The actions parse first (`src/server/actions/experiences.ts:33` and `:51`). `createHost` and `updateHost` in `src/server/db/hostSetup.ts:59` and `:122` follow the same pattern, so this matches existing precedent and is not counted as blocking. Decide whether the data layer should re-parse.
- **A-3** `src/lib/experienceEditor.ts:164` `parsePriceMinor` is exported with no non-test importer. B7 covers component and data-layer files only, so this is advisory. Un-export it, or use it through the B17-2 fix.
- **A-4** `src/components/ExperienceEditor/ExperienceEditor.module.css` `.form` and `.filters` use `max-width: 40rem`, and the focus ring uses `2px`. Neither is a colour, spacing, radius or font-size literal, so B16 does not fire. Noted only.
- **A-5** Not in this diff: `src/lib/opsAudit.ts:19` writes the user actor literal inside its own null-aware `actor()` helper. It is pre-existing and handles the guest case, so it is not a copy of `userActor`. Log it in `audits/` if you want it tidied.

## Rule checks (whole diff)

| Rule | Result | Note |
|---|---|---|
| B1 | Pass | No `fetch`, Drizzle or SDK call outside `src/server/`. |
| B2 | Pass, with A-1 | Decisions are in `src/lib/experienceEditor.ts`. |
| B3 | Pass | `src/server/db/experienceEditor.ts` has `import 'server-only'`. `actions/experiences.ts` has `'use server'`. No `process.env` in the diff. |
| B4 | Pass | The imports point one way, and components import only `src/components`, `src/lib`, and types from `src/server`. |
| B5 | Pass, with A-2 | Results are Ramble types. Actions parse with Zod. |
| B6 | Pass | Every read and write calls `requireRole(..., Role.Ops)` or `requireOpsUserId` (`src/server/db/audit.ts:50`) before any row access. |
| B7 | Pass | No test-only export in a component or data-layer file. |
| B8 | Exempt | |
| B9 | Pass | `createExperience` and `updateExperience` each write the row, its price options and its audit row in one `db.transaction`. Cache tags go out after commit. |
| B10 | N/A | No money, hold or ledger path. |
| B11 | Pass | Drizzle appears only in `src/server/db/`. |
| B12 | Pass | Prices are integer minor units. No `Date.now` or `new Date()` in `server/` or `lib/`. |
| B13 | Pass | No `catch` in the diff. |
| B14 | Pass | No new `'use cache'`. |
| B15 | Exempt | |
| B16 | Pass | No `style={}`. CSS uses `var(--…)` tokens for colour and spacing. |
| B17 | **Fail** | B17-1, B17-2, B17-3. |

## Verdict

FAIL (REQUEST_CHANGES). Three blocking B17 duplications, all introduced by this diff.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=REQUEST_CHANGES
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=3
