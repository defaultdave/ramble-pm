Reposted on head 3201db5: the only change since 9c84242 restores docs/adr/research/industry/observability-and-delivery.md to main (docs/adr/ is a protected path; the corrected sentence goes to the owner as a note).

Posted on head 9c84242 (round 2 at 4ae1232 with main merged; every gate rerun on the merge commit by the PM). Round 1 failed one item; round 2 re-check below.

PASS

## spec-compliance: U-021a "seed guard: SEED_HOST confirms the database host" (head 4ae1232)

### Blocking
- None.

### Non-blocking
- docs/runbooks/seed.md:12: the staging example still reads `SEED_HOST=<the host in DATABASE_URL>`. This is an operator placeholder, not a line that derives the value, so it is not a round-2 gap. Noted only because it is the one recipe that still tells the operator to copy the host from the URL.
- src/server/env.test.ts:133: the new test asserts one issue (split length 2) and no "not a hostname" text. It does not assert the length issue's own text. Non-blocking: the single-issue assertion plus the absence of the pattern message leaves only the length issue.

### Unconfirmed
- None.

### AC results (round 1 criteria on the full diff origin/main...HEAD, plus round-2 items)
1. PASS. src/lib/seed/target.ts:166-171 refuses a non-local target when SEED_HOST differs from the DATABASE_URL host (`host_not_confirmed`). Round 2 did not touch the check.
2. PASS. Earlier refusals are unchanged and still run first (target.ts, unchanged in the logic lines).
3. PASS. The `!== 'local'` guard is unchanged; local is still not asked for SEED_HOST.
4. PASS. scripts/seed.ts:13 passes `env.SEED_HOST` through unchanged.
5. PASS (was FAIL in round 1). src/server/env.ts:29-33 now sets `.refine((value) => value.length > 253 || /^[A-Za-z0-9.-]+$/.test(value), ...)`. For a value over 253 characters the pattern expression short-circuits to true, so the pattern never walks the string and no `not a hostname` issue is raised. The comment at env.ts:29-30 ("Zod runs every check even after `.max()` fails, so the pattern check passes an over-long value without walking it: only the length issue is reported.") matches the code.
6. PASS. src/lib/seed/target.test.ts (SEED_HOST confirmation block) and src/server/db/seed/cli.test.ts:35, :109 are unchanged in round 2; they still cover each target with and without a matching SEED_HOST.
7. PASS. docs/runbooks/seed.md:28 and the observability note are unchanged in round 2 and still state the rule.
8. PASS. Full-diff file list is the nine manifest files. The round-2 diff (38f7af0..4ae1232) touches only docs/runbooks/seed.md, src/lib/seed/target.ts, src/server/env.ts, and src/server/env.test.ts.

Round-2 items:
- Item 2 PASS. src/server/env.ts:29-33 is the length-first refine; src/server/env.test.ts:125-137 "reports only the length issue for an over-long SEED_HOST that also has a bad character" builds 253 `a` plus a space, expects exactly one issue, and expects no "not a hostname". `pnpm exec vitest run src/server/env.test.ts` in the worktree: 78 passed, 0 failed.
- Item 3 PASS. docs/runbooks/seed.md:45 sets `SEED_HOST=<the production host from the Neon console>` by hand. No line in the production-demo recipe derives SEED_HOST from the pulled DATABASE_URL (the old `sed` derivation is removed). docs/runbooks/seed.md:49 gives the reason: deriving it from the pulled URL would make the guard confirm the URL against itself.
- Item 4 PASS. docs/runbooks/seed.md:32 now says to check that the host a refusal prints is the database meant to be written to, and to take SEED_HOST from the Neon console (where that database's address is known), not from the refusal.
- Item 5 PASS. src/lib/seed/target.ts:1-9 is rewrapped; the word sequence is identical to the round-1 header (checked by normalizing both to one word per line, no differences). Only line breaks moved.
- Item 6 PASS. `git diff --name-only 38f7af0..HEAD` lists exactly docs/runbooks/seed.md, src/lib/seed/target.ts, src/server/env.test.ts, src/server/env.ts.

Evidence (files read for this verdict):
- git -C /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a8d474e2e288a7205 diff 38f7af0883c2d35cca33980744f016c8567038ed HEAD: the round-2 diff, 4 files, +25/-7
- git -C <same worktree> diff origin/main...HEAD --stat: the full diff, 9 files, +180/-15
- src/server/env.ts:20-60: length-first hostname refine and SEED_HOST schema
- src/server/env.test.ts:122-137: new length-issue test
- docs/runbooks/seed.md:28-49: guard rule, production-demo recipe, and the SEED_HOST sentences
- src/lib/seed/target.ts:1-9: header comment, word-compared with the round-1 header
- `pnpm exec vitest run src/server/env.test.ts`: 78 passed

---
Check run by spec-compliance (haiku, read-only). Round-2 test run: env.test.ts only; target.ts and seed runbook verified by reading.
