PASS

## architecture-audit: U-021a "Seed guard: SEED_HOST confirmation" (head 38f7af0)

Rules: `.claude/standards/architecture.md` (project), B1 to B17 applied. Files audited: `src/lib/seed/target.ts`, `scripts/seed.ts`, `src/server/env.ts`, `.env.example`, `docs/runbooks/seed.md`, `src/server/db/seed/cli.test.ts`, plus tests and one research doc line.

### Blocking
None.

### B2 decisions found (every one, data layer and scripts)
- `src/lib/seed/target.ts:166`, the `host_not_confirmed` rule (`seedTarget !== 'local' && seedHost !== database.host`): in `src/lib`, pure, unit tested in `target.test.ts`. Correct place.
- `src/server/db/seed/cli.ts`: the only decision is the call to `checkSeedTarget` (unchanged, not in the diff). No new decision.
- `scripts/seed.ts`: passes `env.SEED_HOST` through. No comparison, threshold, or state rule. No decision.
- `src/server/env.ts` `hostname` schema (max 253, charset pattern): input validation at the environment boundary (Zod parse in the one validated env module, SET-19), not a domain decision. Tested in `env.test.ts`. Not a B2 finding.
- No `.filter`, `.sort`, `.reduce`, money arithmetic, or display string was added in `src/server` or `scripts` by this diff.

### Checks asked for
- Decision stays in `src/lib`, pure: confirmed. `target.ts` has no `process.env`, `Date.now()`, I/O, or import beyond `seedTargets`. B2, B3, B12 hold.
- Script and env module carry no decision: confirmed (see above). B3: the only `process.env` read is still `src/server/env.ts:103`.
- Env schema checks length before pattern: confirmed, `.max(253)` precedes the `.refine` (`src/server/env.ts:29-32`). Tests cover 254 characters, a URL, and a space.
- Nothing logs the database URL or password: confirmed. The refusal message names only `database.host` (`target.ts:168`); `refusalLine` is unchanged; the test "does not repeat the URL" asserts no `secret` or `neondb` in the message. The runbook's `sed` extracts only the host into `SEED_HOST`. Data-in-logs class: clean.
- Duplication (B17, A4): searched `src/lib`, `src/server`, `scripts` for hostname, host, `new URL`, `URL.canParse`. Existing code: `src/lib/sentryDsn.ts` (DSN parse), `src/lib/richText/href.ts` (href protocol check), `src/lib/images.ts` (image host config), `readUrl` in `target.ts` (the seed's own URL reader, which the new check reuses via `database.host`). None is a hostname validator or host comparer; no duplicate. The `hostname` schema is local to `env.ts` and not exported.
- Other blocking rules (B1, B4 to B11, B13 to B16): no change touches them. No new import crosses a layer; no SDK, `fetch`, catch block, route, cache, or style change.
- Defect classes: unbounded work (host capped at 253), failing open (missing or mismatched `SEED_HOST` refuses; production-word check still runs first), data in logs (clean).

### Non-blocking
- `src/server/env.ts:28`: the comment says zod runs the pattern even after `.max()` fails. That is accurate and the regex is linear, so a 254-character host costs one pass. No action.
- `src/server/env.ts:32`: the pattern rejects bracketed IPv6, so a non-local IPv6 database host can never be confirmed and the seed refuses it. That fails closed; mention in the runbook only if such a host is ever expected.
- `src/lib/seed/target.ts:8`: the new header comment line runs long; formatting only.
- `src/server/db/seed/cli.test.ts` fixture lines are in scope per the PM ruling.

### Unconfirmed
- I read the diff and surrounding files only; I did not run the test suite.
