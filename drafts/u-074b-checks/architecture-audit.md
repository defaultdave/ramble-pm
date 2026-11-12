## Architecture Audit — FAIL (REQUEST_CHANGES)

Unit: U-074b. Branch `unit/U-074b`, head `6bd331b5e7c8a7b4193965d624cd386441de9862`, audited against `origin/main` (`git diff origin/main...HEAD`).
Rules: `.claude/standards/architecture.md` (project, in worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-ad82e145fcdf66972`)
Exemptions in force: B15 (`/api/auth/*`), B6 (identity reads), B8 (sign-in island). None is exercised by this diff: no Route Handler, no `'use client'` file, no identity read.
Scope: in scope (changes under `src/app`, `src/components`, `src/lib`, `src/server`). No short-circuit.
Files audited: `src/app/(ops)/ops/experiences/page.tsx`, `.../new/page.tsx`, `.../[id]/page.tsx`; `src/components/ExperienceEditor/*` (ExperienceEditView, ExperienceForm, ExperiencesList, ExperienceNotice, index, module.css); `src/lib/experienceEditor.ts`, `experienceAudit.ts`, `catalog.ts`, `opsNav.ts`; `src/server/actions/experiences.ts`; `src/server/db/experienceEditor.ts`, `src/server/db/policies.ts`. Test, story and fixture files read only.

### Blocking Issues

- **B17 (reuse before writing): form-reading helpers copied from `src/lib/hostSetup.ts`.** The bodies are identical or differ only by a constant or a code list. The copies are new in this diff, so the "predates the diff" carve-out does not apply.
  - `textOf` and the `FormGetter` type: `src/lib/experienceEditor.ts:154-161` duplicates `src/lib/hostSetup.ts:70-77`.
  - `slugFor`: `src/lib/experienceEditor.ts:254-261` duplicates `src/lib/hostSetup.ts:99-106`. Only the limit constant differs, and both limits are 80.
  - ID field parser: `parseExperienceIdField`, `src/lib/experienceEditor.ts:376-379`, duplicates `parseHostIdField`, `src/lib/hostSetup.ts:197-200`. The bodies are the same `WriteIdSchema.safeParse`.
  - Fix: move these to one shared module with their tests, and have both `experienceEditor.ts` and `hostSetup.ts` import them. The `hostSetup.ts` edit is a mechanical import swap and removal of private copies. Behavior is unchanged, and the existing host tests are the check.

- **B17 (reuse before writing): notice and problem-field parsing and links duplicated.** These differ from the host versions only by the code map, the field list, or the href builder. The rule's own fix for this case is "extend it with a parameter", so this is not exempt because it is a refactor of another unit's file.
  - `parseProblemFields`: `src/lib/experienceEditor.ts:766-772` duplicates `src/lib/hostSetup.ts:504-510`. The bodies match except for the field list. The exported name is the same in both modules.
  - `parseExperienceNotice`: `src/lib/experienceEditor.ts:759-761` duplicates `parseHostNotice`, `src/lib/hostSetup.ts:497-502`. Only the code map differs.
  - `experienceNoticeHref`: `src/lib/experienceEditor.ts:774-780` does the job of `noticeHref`, `src/lib/hostSetup.ts:512-521`. It builds the same kind of path and query, through `tableHref` instead of `URLSearchParams`.
  - Fix: one generic problem-field parser and one notice parser, each taking its code list or field list as an argument, plus one href builder. Both modules use them. The hosts edit is the same mechanical import change as above.

- **B17 (reuse before writing): notice component and audit actor helper duplicated.**
  - `src/components/ExperienceEditor/ExperienceNotice.tsx:1-16` duplicates `src/components/HostSetup/HostNotice.tsx`. Both render an `Alert` from a code-keyed map. Only the map differs.
  - `userActor` at `src/lib/experienceAudit.ts:38-39` duplicates the private `userActor` at `src/lib/hostAudit.ts:8-9`. This is a two-line helper, and the fix is to export one from `src/lib/audit.ts` or `src/lib/opsAudit.ts`.
  - Fix: one notice component taking tone and title, and the shared actor helper.

Judgement on the duplicate notice and problem-field helpers: they differ only by data (code map or field list), and no part of the rule exempts them. The sharing needs a refactor of `hostSetup.ts`, which is another unit's file. That is a real cost, but it is not an exemption. The agent cannot waive B17 here. If Dave prefers to defer the refactor, he records that decision in `delta-log.md` and the PR's Decisions. Until then this is REQUEST_CHANGES.

No other blocking rule was violated. Checked and clean: B1 (no fetch, SDK, or database call outside `src/server`), B2 (no decisions in components beyond the advisory below), B3 (`import 'server-only'` present in `src/server/db/experienceEditor.ts`; no `process.env`), B4 (every import points the allowed way; `src/lib` imports only `src/lib` and pure libraries), B5 (see advisory on the data-layer inputs), B6 (`readExperiencesForOps`, `readExperienceChoices`, `readExperienceForOps` call `requireRole`; `createExperience` and `updateExperience` call `requireOpsUserId`, which calls `requireRole`), B7 (`listCancellationTiers` now has a caller in `readExperienceChoices`, so the `TODO(U-074b)` removal in `policies.ts` is correct), B8 (no `'use client'` in the diff), B9 (create and update write the experience, price options, and audit row in one `db.transaction`; cache invalidation runs after the commit), B12 (money is integer minor units; no `Date.now()`, `new Date()`, or float in money code), B13 (no empty or silent `catch`), B14 (no `'use cache'`), B15 (no Route Handler added), B16 (no inline `style`; no colour, spacing, radius, or font-size literal in the CSS module, see advisory).

### Advisory

- `src/components/ExperienceEditor/ExperienceEditView.tsx:40` `guideOnly={view.status === 'guide_only'}` decides a rule inside a component. `src/components/ExperienceEditor/ExperienceForm.tsx:327-328` (`optional`, `required`) restates the same rule that `guideOnlyIssues` in `src/lib/catalog.ts` enforces. Fix hint: a `src/lib` predicate such as `linksOut(status)`, used by the view and tested. Not blocking; B2 targets filters, sorts, money, parses, and display strings, and this is a one-line boolean.
- `src/lib/experienceEditor.ts:633` `Choice` has the same shape as `SelectOption` in `src/lib/filters.ts:372`. Reuse candidate under A4. The rule does not enumerate type aliases, so this is advisory.
- `src/server/db/experienceEditor.ts` `createExperience` and `updateExperience` take already-typed input and use it before any Zod parse in the data layer. The Zod parse happens at the boundary, in `src/server/actions/experiences.ts` via `parseExperienceCreateForm` and `parseExperienceEditForm`. This matches the existing `createHost` in `src/server/db/hostSetup.ts:59-63`. Read literally, B5 names the data-layer function, so Dave may want to confirm that the Server Action boundary is the accepted reading. Not counted as blocking.
- `src/components/ExperienceEditor/ExperienceEditor.module.css:12,80` `max-width: 40rem`, and `:63-66` the focus ring `2px` and `4px`. These are layout and focus widths, not colour, spacing, radius, or font-size, so B16 does not apply. `src/styles/tokens.css` has no token for them. The same pattern appears in `src/app/(guest)/contact/ContactForm.module.css`. Fine to keep; a `--measure` token would be a tokens-file change for Dave.
- `src/components/ExperienceEditor/ExperienceEditor.fixtures.ts` exports are used by the tests and by the stories. Eight other `*.fixtures.*` files in `src/components` follow the same convention, so B7 is not triggered.
- `src/lib/catalog.ts` now exports `experienceRuleIssues` and reuses it in `checkExperienceRules`. This is the reuse the rules ask for. No finding.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=REQUEST_CHANGES
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=3
