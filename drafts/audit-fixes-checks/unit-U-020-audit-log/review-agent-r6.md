PASS

## review-agent: U-020 "Audit log" (head d9743ef, round 6; round 5 passed at bd29697)

Focused re-check of the one-line fix for the CI `db` job failure. All commands ran in a scratch worktree detached at d9743ef with node_modules symlinked from the agent worktree. The scratch worktree was removed afterwards. Nothing was pushed, posted, committed, or edited in any checkout.

### Blocking
None.

### 1. The delta is one change

`git diff bd29697 d9743ef` touches one file, `src/server/db/schema/operations.ts`, one line (`--stat`: 1 insertion, 1 deletion):

`-const auditActorKindEnum = pgEnum('audit_actor_kind', auditActorKinds);`
`+export const auditActorKindEnum = pgEnum('audit_actor_kind', auditActorKinds);`

That is the exact reverse of the `export` removal made in 5a0e014 (same file, same line, same text; 5a0e014's diff for this file shows `-export const` and `+const`). Nothing else changed.

### 2. `pnpm db:generate` writes nothing

At d9743ef: output ends "No schema changes, nothing to migrate", and `git status --porcelain -- src/server/db/migrations` is empty. `pnpm db:check` prints "Everything's fine". Control: the same command at bd29697 wrote `0022_vengeful_marvel_zombies.sql`, `meta/0022_snapshot.json` and a `_journal.json` change, so the check is sensitive to the defect and the fix removes it. I reset and removed those files in the scratch worktree before removing it.

### 3. Could the failed CI step have hidden anything

`.github/workflows/ci.yml` lines 55 to 75: the `db` job runs `db:migrate`, `db:check`, the generate-and-porcelain step, then `pnpm test:db` as the last step. The generate step failed at bd29697, so `test:db` never ran in CI at that head. I ran what CI would have run, against the local Postgres on localhost:5432 (it was reachable; docker was not, and was not needed):

- `vitest run --project db tests/db/audit.db.test.ts`: 54 passed.
- `pnpm test:db` (whole db project): 38 files, 1671 tests, all passed.
- `pnpm exec knip` (CI's `check` job runs knip): clean, rc 0. The re-added export reaches knip through `export * from './operations'` in the schema index, so it is not reported as unused.

Round 5 also reported 54 audit db tests passing at bd29697, and the delta is a keyword on a value the table already uses (`actorKind: auditActorKindEnum()` at operations.ts:122), so the runtime schema object is identical. The failed step hid nothing. One caveat: the db tests create a fresh database on that local Postgres through `createFreshDatabase`; I did not inspect whether it drops it afterwards.

### 4. Other unexported schema declarations

In `src/server/db/schema/*.ts` every `pgEnum`, `pgTable` and `relations(...)` declaration is `export const`: a grep for non-exported `const|let|var|function` bound to `pgEnum|pgTable|relations|pgView|pgMaterializedView|pgSequence|pgRole|pgSchema|pgPolicy` finds nothing, and none of `pgView`, `pgSequence`, `pgRole`, `pgSchema`, `pgMaterializedView`, `pgPolicy` is used. `auditActorKindEnum` was the only unexported one. Every file is re-exported from `schema/index.ts` (`shared.ts` by name for `publishStatusEnum`, which is its only declaration). The defect class is not present elsewhere. (A construct built across lines, or one that is not bound at top level, would not be caught by a line grep; the clean `db:generate` result covers it from the other side.)

### 5. Do the earlier verdicts carry

| Verdict | Head judged | Carries to d9743ef | Reason |
|---|---|---|---|
| review r5 | bd29697 | Yes | Delta is the `export` keyword only; no behavior, no input, no log, no test, no copy changes. I re-ran the db suite, `db:generate`, `db:check` and knip at the new head. Round 5's non-blocking items stand. |
| spec-compliance r3 | 4b39c96 | Yes | Its four criteria concern the log being insert-only, the export job, refusal on a provider with no locked store, and the fake store. None reads this line; the enum's name, values and column are unchanged. |
| architecture-audit r4 | 8c7f543 | Yes, with one note | Round 4 passed with zero blocking findings and no schema-file finding in the delta. The note: the round 1 audit (architecture-audit.md) flagged this exact export as dead ("Drop the `export` keyword") and 5a0e014 did that. This round reverses it; see the B7 section below. The verdict is not a different one on the merits. |
| qa-agent r3 | 4b39c96 | Yes | Backend-only unit judged by running the production build against a migrated database. The migration SQL is unchanged by the delta (generate writes nothing), so the database objects QA ran against are the same, and the delta changes no runtime path. |

### B7 and the removed export

B7 in the project's `.claude/standards/architecture.md` line 70 reads: a non-type export from a component or data-layer file whose only importer is a test. `auditActorKindEnum` is imported by nothing outside its own file: not by a test, and not by app code. B7's condition (only importer is a test) is not met. The reason the export is needed is drizzle-kit's schema loader, which finds enums only among module exports; that is a build-tool requirement, not a test. Every other `pgEnum` declaration in `src/server/db/schema/` is `export const` (see item 4), so the export brings this file in line with its siblings. knip raises no unused export (its entry set and the schema index re-export cover it), so the only thing that cited the keyword in round 1 was the architecture audit's "dead export" note, which did not account for drizzle-kit as a consumer. The change at 5a0e014 was made to satisfy that note and is what broke CI. A one-line comment stating why enums must be exported (for drizzle-kit) would stop it being removed again; that is optional and not a condition of this verdict.

### Non-blocking
- Optional: add the comment above to `operations.ts:96`. Suggestion only; the unit's scope is already met.
- Round 5's carried items stand unchanged (the `store` name shared in tests/db/audit.db.test.ts, no alert on unexported rows).

### Unconfirmed
- The CI run itself at d9743ef: I ran each CI `db` step locally against a local Postgres, not on the runner. Whether the runner's Postgres service is configured the same way is not something I checked.
