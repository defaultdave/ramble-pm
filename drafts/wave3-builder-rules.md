# Ramble Prototype wave 3: rules for every builder

Five units are being built in parallel, each in its own worktree. You build one. These rules are the same for all five.

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

## Migrations
U-012, U-018, and U-010 each add a migration, on different branches; they merge in that order. Generate yours with `pnpm db:generate` from the schema as normal and commit it. Whichever lands later merges `main` and regenerates its migration; never hand-number migrations.

## Finish
- Commit on `unit/<UNIT>` with the message `<UNIT>: <title>` and the trailer `Co-Authored-By: Claude <noreply@anthropic.com>`. Several commits are fine.
- **Do not push, open a PR, or call GitHub in any way.** The PM does that.
- Final report, in this order (it becomes the PR body, so no em dashes and no "not just X, it's Y"):
  1. Branch and head SHA.
  2. What was built, by file group.
  3. Decisions you made where the manifest or design doc left room, each with its reason.
  4. Gates run, with counts (tests passed, e2e passed).
  5. Anything in IN SCOPE you did not do, and why.
  6. Suggestions (adjacent work you noticed and did not build).
