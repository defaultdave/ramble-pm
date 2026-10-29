# Ramble Prototype wave 3: rules for every builder

Up to five units are being built in parallel, each in its own worktree. You build one. These rules are the same for all of them.

## Setup
1. In your worktree: `git fetch origin`, then `git switch -c unit/<UNIT> origin/<BASE>` (your brief gives UNIT and BASE). Then `pnpm install`. Every commit goes on `unit/<UNIT>`; check `git branch --show-current` before each commit and never commit on a detached HEAD.
2. Read before coding: `CLAUDE.md`, `README.md`, `.claude/standards/architecture.md` (the project's layer rules, including B6 and B7: guest-visible reads are exempt from `requireRole`; a contract shipped ahead of its first caller is exempt from B7 when the export carries `TODO(U-xxx): first caller` naming a unit not yet built), `.claude/standards/stack-decisions.md` if present, the parts of `docs/plan/01-design-doc.md` your unit touches, and the ADRs your brief names.
3. Postgres for `pnpm test:db`: one shared local database on localhost:5432. If it is not reachable, run `docker compose -p ramble up -d --wait` (the `-p ramble` keeps every worktree on the same container; never start a second one). Each test file gets its own schema, so sharing is safe.

## Scope
- Echo the scope manifest before writing code. Build exactly what IN SCOPE names. Adjacent ideas go in a Suggestions section of your report, not in code.
- Do not edit `docs/plan/` (frozen), `.github/workflows/` (the App cannot push them; if your unit needs a workflow, describe it in Suggestions), or another unit's code.
- A new env var goes in the validated env module (`src/server/env.ts`) and `.env.example`, optional with a safe default when the service is external, so the app builds and tests pass with no real keys.
- No real third-party accounts or keys. Adapters for external services must work with none configured (fake or no-op), and tests never call the network.
- The database client is lazy: importing it never connects, and a use without `DATABASE_URL` throws. Its Proxy has only a `get` trap, so in unit tests mock the module rather than spying on the client.

## Reuse before writing (DRY; owner rule, 2026-10-28)
Before you write any function, hook, component, constant, or Zod schema, look for one that already does the job or nearly does:
1. **Search by concept, not just by name.** List what exists: `git grep -n -E "^export (async )?(function|const|class|type)" -- src/lib src/server src/components ':!*.test.*' ':!*.stories.*'`. Then grep for the idea in several words (for a duration label: `duration`, `minutes`, `hr`; for a price: `price`, `priceMinor`, `money`, `From`). Read the candidates, including page modules such as `src/lib/home.ts`, `browse.ts`, and `experiencePage.ts`, where general helpers have ended up before.
2. **Use it, or extend it.** If something fits, call it. If it nearly fits, extend it (a parameter, an option, a variant) with a test for the new case, rather than writing a near copy. If extending would change what its current callers get, say so in the report instead.
3. **Shared code lives in a shared module.** A helper that two pages need, or that is not about one page (formatting money, durations, dates, the New York day, addresses, read-or-refuse wrappers, card building), goes in a shared module named for what it does (`src/lib/money.ts`, `src/lib/text.ts`, or a new one such as `src/lib/duration.ts`), never in a page module. Page modules hold only what composes that page. If you find a general helper inside a page module and you need it, move it to a shared module (callers updated, tests moved) in a separate commit, and say so in the report.
4. **Logic leaves components.** A component renders; any rule, label, formatting, or calculation it needs is a plain function in `src/lib` with a unit test, so it can be found and reused. No helpers defined inside component files beyond tiny render-only pieces.
5. **Ask before inventing a new shared abstraction.** A new hook, a new shared component, or a new cross-cutting module (anything other pages would be expected to use) is named in the report under Decisions with the alternatives you checked, so the PM can confirm it is not a duplicate.

Your final report gains a **Reuse** section: existing helpers you used, helpers you extended (and why), helpers you moved to a shared module, and each new export with the existing ones you checked and why none fit.

## Quality bar
Waves 1 and 2 kept finding the same defect classes, one instance per round. Sweep your whole diff for each class before you finish, not only the obvious instance:
1. **Unbounded work:** every input has a size limit, every loop and retry has a cap, every query that can grow has a limit. Regexes over user input are linear (no nested quantifiers; CodeQL flags them).
2. **The database accepting what Zod rejects:** every Zod rule on a stored value has a matching CHECK, NOT NULL, length limit, or enum in the schema, and a test proves the database refuses a bad row.
3. **Failing open:** an error from a provider, a parse, or a lookup refuses the request; it never lets it through or repairs the input.
4. **Leaking data into logs:** never log a raw database error, its params, or a request body; log the error kind and an id.
Also: auth checks on every route or action that needs one, with a test for the refusal; decisions live in the domain layer, not in route handlers or server actions; secrets compared in constant time (`src/server/secureEqual.ts`).

UI units: match the Figma library (`docs/design/figma-library.json` for node and variable ids; tokens, not raw values), mobile first with min-width breakpoints, no sideways scroll at 320 px, 44 px touch targets, a visible focus ring, and a Storybook story per state.

Comments only for a non-obvious why. `TODO(U-123): ...` is the only comment that names a ticket.

## Gates (all must pass before you commit)
Run them exactly as CI does:
- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip`.
- `env -u DATABASE_URL pnpm build` (CI builds with no database).
- `gitleaks git --log-opts="origin/<BASE>..HEAD" .` over your branch range. Test fixtures that look like secrets get an obviously fake shape or a `gitleaks:allow` marker with a reason.
- e2e, only through the shared lock: `lockf -k /private/tmp/claude-501/ramble-wave3-e2e.lock env CI=1 pnpm e2e`. Playwright serves on the fixed port 3100 and, without `CI`, silently reuses whatever server is already there, which could be another builder's worktree. The lock makes the builders take turns; `CI=1` makes a port clash fail loudly. Specs that visit guest pages import `test` from `e2e/fixtures.ts`.
- If you touch the database: `pnpm test:db`, `pnpm db:check`, and `pnpm db:generate` producing no new file after your committed migration.
- UI units also: `pnpm storybook:test`.
- If you start a server yourself, record its PID and stop it with `kill <pid>`. Never `pkill` or `killall`: other builders' servers run on this machine.


## Lessons from wave 3 reviews (apply from the first commit)
- **Every domain decision lives in a plain `src/lib` function with a unit test**: every comparison, threshold, or state rule that yields a domain result (a refusal, a typed result, a count, "is past", "is a draft", "same kind", version checks, horizon checks, zone validity), including rules hidden in a SQL `WHERE` on a write path. The data layer only fetches, locks, persists, and returns the lib's answer. Guest-visibility filters and ordering in SQL are fine. Reviewers sweep for this exhaustively; each one found later costs a round.
- **Zod runs every refinement even after `.max()` fails.** Any refinement or regex that walks the string checks the length first; never put a repeated group in a regex over user input.
- **Ids from callers are lowercased at the write schema** (Postgres returns uuids in lowercase).
- **Concurrency**: a refusal re-checked under a lock needs a test that fails if the locked re-check is removed (hold the lock on a second connection, change the row, release).
- **Timestamps that order records** come from `clock_timestamp()` after any lock, not `now()`.
- **A refusal for a caller without rights is identical** for a missing row, another owner's row, and a staff-only row (same error, same role, same message).

## Migrations
If you add a migration, generate it with `pnpm db:generate --name <name>` from the schema and commit it. Hand-written SQL (triggers, seed rows) goes in its own `pnpm db:generate --custom --name <name>` migration, never appended to a generated one. If another unit's migration lands first, the PM has you merge `main` and regenerate; never hand-number migrations.

## Finish
- Commit on `unit/<UNIT>` with the message `<UNIT>: <title>` and the trailer `Co-Authored-By: Claude <noreply@anthropic.com>`. Several commits are fine.
- **Do not push, open a PR, or call GitHub in any way.** The PM does that.
- Final report, in this order (it becomes the PR body, so no em dashes and no "not just X, it's Y"):
  1. Branch and head SHA.
  2. What was built, by file group.
  3. Decisions you made where the manifest or design doc left room, each with its reason.
  4. Reuse: existing helpers used, extended, or moved to a shared module, and each new export with what you checked first.
  5. Gates run, with counts (tests passed, e2e passed).
  6. Anything in IN SCOPE you did not do, and why.
  7. Suggestions (adjacent work you noticed and did not build).

## Evidence (owner rule, 2026-10-29)
Every change the owner can see gets pictures in the PR. Before you finish a UI change (a page, a component, a state, a layout or theme rule):
1. Capture **before and after** PNGs of the same view at the widths that matter for the change (at least one phone width and one desktop width, light and dark when a colour or scheme rule changed), "before" from a scratch worktree at `origin/<BASE>` (`git worktree add <scratch> origin/<BASE> --detach` under `$TMPDIR`, removed afterwards). Name them `<view>-<width>-<scheme>-before.png` and `...-after.png`. Where the change is an interaction (focus, hover, a transition, a breakpoint switch), add one short recording: Playwright `recordVideo` to webm, converted to a GIF with `ffmpeg -i <webm> -vf "fps=10,scale=800:-1" <name>.gif` if `ffmpeg` is installed, else keep the webm.
2. Copy them into the ramble-pm repo at `evidence/pr/<branch name with / replaced by ->/` (for example `evidence/pr/unit-U-030-hero/`), under 2 MB each, at most about 12 files. `bun scripts/plan/site.ts dir` prints the ramble-pm path. Do not publish ramble-pm; the PM does.
3. List every file in your report under a **Evidence** heading with one line saying what each shows. The PM embeds them in the PR body as `![<what it shows>](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/<dir>/<file>)`.
