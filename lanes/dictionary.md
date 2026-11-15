# Lane: dictionary

## Moved from STATUS.md, 2026-11-15 (page-maps sweep)

#### Lane: dictionary
- **2026-11-14, U-128 (#974) merged and Done.** [PR 975](https://github.com/defaultdave/ramble/pull/975) landed as `98b925c` (head `b2176d7`: `main` merged in so `human-read` could read U-128 from `units.yaml`). [PR 977](https://github.com/defaultdave/ramble/pull/977) added U-128 to `units.yaml` (Dave bypass-merge). Board #19: Done, 0.3 days (estimate 0.75, under by more than 25%: the builder ran clean in one pass, no rework), 10 Dave minutes, about 450K subagent tokens. Worktrees and branches removed. Evidence: `evidence/pr/unit-U-128/`.
- **Decided (Dave, 2026-11-14, approval of PR 975):** the copy lint rules are OFF in `pnpm lint` and WARN under `pnpm lint:copy` (412 warnings, exit 0), because CI runs `--max-warnings 0`; each folder is added to `copyErrorFolders` in `eslint.config.copy.mjs` to turn them into errors as it migrates. Client islands may import `common`, `format` and their own area file (custom rule `ramble-copy/client-copy-imports`).
- **Client JS baseline (gzip KB, main to branch):** home 193.5 to 194.3, browse 200.9 to 201.7, experience 283.5 to 283.2, checkout 227.8 to 227.7.
- **Follow-ups for later phases:** split `commonCopy` into named exports before phase 2 (it ships whole to the client nav and footer); move the `andList` `Intl.ListFormat` out of `format.ts` top level; give the attribute check its own rule id (it shares `no-restricted-syntax`); the client import rule does not check dynamic `import()` or relative `../copy` paths; the 404 contract check asserts the dictionary string, not the rendered notice.
- **For the lead:** (1) A unit's `units.yaml` PR must merge before its unit PR opens, or `human-read` reads the old base and cannot find the tier; a rerun does not help, `main` must be merged into the branch. (2) `scope-manifest` blocks a bookkeeping PR that adds a unit, so each new unit costs Dave a bypass merge. (3) In the sandbox, `agent-git.ts` and `post-check.ts` need the sandbox off (EPERM on `~/.config/ramble-agents`); `bun install` fails in a QA worktree (tempdir), `pnpm install` works. (4) I ran `gh pr edit 975 --title` with Dave's login by mistake; the merge desk has no retitle command, so a title fix needs Dave or a new subcommand.

#### Next chat: dictionary
- **Lane done.** U-128 is merged and Done, worktrees and branches removed. There is no further lane work; phases 1 to 4 ride with page-change units.

