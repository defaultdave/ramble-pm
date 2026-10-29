FAIL

## spec-compliance: U-021a "seed guard: SEED_HOST confirms the database host" (head 38f7af0)

### Blocking
- src/server/env.ts:29-33 and :49: AC 5 asks for SEED_HOST to be "length checked before any pattern". The chain is `.max(253).refine(pattern)`, but zod 4 (`"zod": "^4.6.7"`) runs every check unless it is aborted, so the pattern still runs on an over-long value. Probe: a 254-character string with spaces and underscores returns two issues, `too_big` and `custom` "not a hostname". The comment at env.ts:29 ("Length first: the pattern walks the string, and zod runs it even after `.max()` fails") states the opposite of what the code does. Reject is still correct for every input, and the regex is linear, so there is no practical defect. The fix is to make the pattern run only on a value within the length, for example `.superRefine((value, ctx) => { if (value.length > 253) return; if (!/^[A-Za-z0-9.-]+$/.test(value)) ctx.addIssue({ code: 'custom', message: 'not a hostname' }); })`, or to use `z.string().max(253, { abort: true })` if the installed zod version supports it. Then correct the comment. Add an env.test.ts case that asserts only the length issue for a 254-character value containing a space.

### Non-blocking
- docs/runbooks/seed.md:32: "Copy the host from the database you intend, not from the refusal message." The refusal at src/lib/seed/target.ts:169 prints `Set SEED_HOST=<host>`, so the sentence tells the operator to ignore the one line that names the host. Reword so it says to check the printed host against the database they meant to write to.
- src/lib/seed/target.ts:166 with src/server/env.ts:31-33: the SEED_HOST pattern rejects `[`, `]`, and `:`, and WHATWG `URL.hostname` returns `[::1]` for an IPv6 literal. A staging or load-test database addressed by an IPv6 literal can therefore never be confirmed. No Neon or Vercel target uses one, so this is a note, not a gap against the ACs.
- src/lib/seed/target.ts:7: the header comment line runs past the file's line width. Style is the review agent's call; noted only.

### Unconfirmed
- None.

### AC results
1. PASS. src/lib/seed/target.ts:166-171 refuses when `seedTarget !== 'local'` and `seedHost !== database.host`, with a new `host_not_confirmed` refusal kind (target.ts:40). The message at target.ts:169 names `database.host` and tells the operator to set `SEED_HOST=<host>`. The comparison is exact.
2. PASS. Every earlier refusal is still in the code and still runs before the new check: no_database (target.ts:122), production_runtime for NODE_ENV (125) and VERCEL_ENV (131), target_not_declared (137), scale_on_demo (143), unreadable_database_url (70, 103), address_overridden (83), looks_like_production (155), not_local (161). The new check is placed last (166), so no earlier refusal is pre-empted. The test diff removes no assertions.
3. PASS. The `!== 'local'` guard at target.ts:166 leaves local unchanged, and src/lib/seed/target.test.ts (new "does not ask local for SEED_HOST, and ignores one it is given") covers it.
4. PASS. The decision is only in src/lib/seed/target.ts. scripts/seed.ts:13 passes `seedHost: env.SEED_HOST`, and src/server/db/seed/cli.ts:31 forwards `command.target` unchanged, so the field reaches the check.
5. FAIL on the ordering clause (see Blocking). The rest is PASS: SEED_HOST is in the validated schema at src/server/env.ts:49 as `optional(hostname)`, so an empty string reads as unset, and `.env.example:20-22` documents it.
6. PASS. src/lib/seed/target.test.ts (new "SEED_HOST confirmation" block) covers: each of staging, load-test, and production-demo with a Neon URL and no SEED_HOST expecting `host_not_confirmed` and a message containing the host; a different host, a prefix, a suffix, and an uppercase variant refused; each target accepted with the matching host. src/server/db/seed/cli.test.ts:35 and :109 add the field to fixtures.
7. PASS. docs/runbooks/seed.md:12 (staging command) and :45-46 (production-demo command) include SEED_HOST, and seed.md:28 states the rule. The observability note at docs/adr/research/industry/observability-and-delivery.md:61 no longer says the seed refuses production outright. No other doc in the diff makes that claim.
8. PASS. The nine changed files are exactly the manifest set: .env.example, the observability note, docs/runbooks/seed.md, scripts/seed.ts, src/lib/seed/target.test.ts, src/lib/seed/target.ts, src/server/db/seed/cli.test.ts (+2 lines), src/server/env.test.ts, src/server/env.ts.

Evidence (files read for this verdict):
- git -C /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a6ad82f90b8b6e4dd diff origin/main...HEAD: the full diff, 9 files, +161/-14
- src/lib/seed/target.ts: the guard, refusal kinds, and the new check at lines 166-171
- src/server/env.ts: SEED_HOST schema at lines 29-33 and 49
- src/server/db/seed/cli.ts: target forwarded unchanged at line 31
- scripts/seed.ts: env.SEED_HOST passed at line 13
- docs/runbooks/seed.md: lines 12, 28, 32, 45-46
- zod probe (node, zod in worktree node_modules): 254-character value returns both `too_big` and `custom` issues

---
Check run by spec-compliance (haiku, read-only). Tests were not run; the verdict rests on reading the diff and code.
