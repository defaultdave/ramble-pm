# QA r1: PR 1022, U-076a editorial editing (head d5e9eef)

VERDICT: ACTION_REQUIRED

The run is incomplete. The shared local Postgres (localhost:5432) stopped accepting queries mid-run and did not come back within about 5 minutes. Every connection fails with `read ECONNRESET`, including to the `postgres` maintenance database. Restarting it means touching the shared Docker instance that other agents' DBs live on (`ramble_u021b_r1`, `ramble_perf_home_*`, ...), which I did not do. Docker is also unreachable from the sandbox. No fake evidence was produced.

## Setup (works as documented)
- Scratch worktree at /tmp/claude-501/qa-u076a (detached d5e9eef). `git worktree add` had to run outside the sandbox (`.git/worktrees` is read-only there).
- Own database `ramble_qa_u076a`: `pnpm db:migrate`, then `SEED_TARGET=local pnpm db:seed`. Personas seeded.
- `next dev` could not run (Turbopack "unable to start FSEvent stream" under the sandbox), so I used `next build` and `next start -p 3077`. The build passed.
- Env needed beyond `.env.example` defaults: `SIGN_IN_LINK_SECRET`, `BETTER_AUTH_SECRET`, `DEV_MAILBOX_SECRET`, `NEON_HTTP_ENDPOINT` (via `pnpm db:http`).
- Chromium cannot launch inside the sandbox, so Playwright ran unsandboxed against localhost only. The Playwright MCP tools were not available, so I drove the repo's @playwright/test from scripts.
- Sign-in by mailbox link works as ops, guest and owner.a. The 5-per-hour sign-in link limit was hit on ops@ramble.test during setup; I cleared my own DB's `rate_limits`.

## Observed (desktop 1280 only)
| Check | Result | Evidence |
|---|---|---|
| Ops sees /ops/editorial list: 8 seeded help articles, all Published, title/address/status/updated columns, "New article" link | PASS | qa-list-initial-desktop.png |
| /ops/editorial/new renders: Title, Address (optional), Summary (optional), Body with toolbar (Bold, Italic, Link, Heading, Subheading, Bulleted list, Numbered list, Quote), Save draft, Publish | PASS | qa-new-form-desktop.png |
| Publish with empty body is refused: "Some details need another look.", with "Add some text to the body before publishing, and check each link." on the body field | PASS | qa-empty-body-publish-refused-desktop.png |
| Bold via toolbar: `<strong>` applied, focus returns to editor, button reports aria-pressed | PASS | scripted check, no screenshot |
| Link via toolbar: inline address input appears; produces `<a href="https://example.com/qa" target="_blank" rel="noopener noreferrer nofollow">` | PASS | qa-editor-link-ui-desktop.png |
| Save draft: "Saved." banner, "Draft" badge, Address auto-filled `qa-flow-article-desktop`, redirected to the article page | PASS | qa-draft-saved-desktop.png |

## Findings
1. Possible bug, to confirm: after the refused empty-body publish, the Title I had typed came back empty (see qa-empty-body-publish-refused-desktop.png). The user's input is lost on a validation refusal. It may be intended because the server redirects with `?notice=invalid&fields=body`, but a re-entry cost on every refusal is poor UX. Please verify.
2. Unconfirmed: the saved draft in qa-draft-saved-desktop.png shows only "Intro with wo" and the "Visit the site" link. The heading and bullet list I typed are missing and the bold text is truncated. My script was racy (two runs overlapped), so I cannot tell whether this is a defect or my input. It needs a clean re-run to confirm that headings and lists survive save and reload.
3. Observation: the ops pages render the "Skip to main content" link permanently visible, with default blue link styling for "Back to the articles". Check whether this is pre-existing for all /ops pages or specific to this PR.
4. Environment note: `/ops/mailbox` logs a "unstable value new Date() while prerendering" error in the production build. It is unrelated to this PR as far as I can tell.

Note: qa-editor-formatted-desktop.png came from a faulty script run and should be ignored. The `after-*` PNGs in that folder were not made by this QA run.

## Not run
- Edit of an existing article (/ops/editorial/[id]) and the published/unpublished states.
- Publish, then the guest /help page shows the article, then unpublish, then it disappears.
- Invalid address and slug conflict.
- Non-ops denial (guest and host-owner sessions are saved and ready; the check was not run).
- Mobile 390 width.
- Keyboard-only toolbar use, including Tab order and Enter/Space.
- e2e, which I did not run.

## To resume
Restore the Postgres container (`docker compose up -d --wait`, or restart it from outside the sandbox). Then rerun: build is at /tmp/claude-501/qa-u076a/.next, start script /tmp/claude-501/start.sh, Playwright scripts in /tmp/claude-501/pw (flow4.cjs is the happy-path script; `node flow4.cjs mobile` for 390). Session files ops.json, guest.json and host.json are stale if the DB was reset.

Evidence directory: /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-076a-editorial-editing/
