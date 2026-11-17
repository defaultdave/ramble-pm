# Owner commands and edits, 2026-11-17

Saved by the lead for the next chat. The owner said on 2026-11-17 that he will have run all of these, edits included, before the next lead chat starts. The next lead verifies each on GitHub and on `main` before relying on it: read the issue states and labels, and grep the two files.

Source: the owner's "all recommended" answer to section B of `drafts/ticket-closeout-2026-11-17.md` (DECISIONS 2026-11-17). The issue numbers in command 1 came from the triage agent's draft and were not checked row by row.

## 1. Close the 32 units cut on 2026-11-10

```bash
for n in 6 35 53 58 62 63 78 79 80 81 86 101 102 103 104 105 106 110 112 113 115 118 119 120 123 124 125 126 127 129 131 132; do gh issue close $n --repo defaultdave/ramble --reason "not planned" --comment "Cut from the MVP on 2026-11-10 (DECISIONS in ramble-pm); can be re-filed if the goal changes."; done
```

## 2. Close U-119, built and merged

```bash
gh issue close 151 --repo defaultdave/ramble --reason completed --comment "Built and merged (commit 6672afb1, PR 163)."
```

## 3. Close the audit tickets the owner ruled on

```bash
gh issue close 997 --repo defaultdave/ramble --reason completed --comment "The CSS fallback landed in PR 1027. No client onError island, per DECISIONS 2026-11-14."
```

```bash
gh issue close 791 --repo defaultdave/ramble --reason "not planned" --comment "The client bot-challenge skip is the fix; a seeded e2e database is a separate project."
```

```bash
gh issue close 319 --repo defaultdave/ramble --reason completed --comment "Live guards fixed in PR 1035; the sessions clock floor is deliberate."
```

## 4. Close two audit tickets that need no edit

Read on 2026-11-17: the `main` ruleset (`main: tiered auto-merge`, id 25513279) already lists `human-read` as a required status check, and `NoScriptFilters` is already on the client islands allowlist (`.claude/standards/architecture.md` line 40, dated 2026-11-16).

```bash
gh issue close 998 --repo defaultdave/ramble --reason completed --comment "human-read is already a required status check in the main ruleset (25513279), read 2026-11-17."
```

```bash
gh issue close 890 --repo defaultdave/ramble --reason completed --comment "NoScriptFilters is on the client islands allowlist (architecture.md, ratified 2026-11-16)."
```

## 5. Label the 19 parked issues

```bash
gh label create parked --repo defaultdave/ramble --color BFD4F2 --description "Out of the slim MVP, kept for later"
```

```bash
for n in 73 74 75 76 77 98 48 111 114 117 121 122 128 992 993 994 995 367 996; do gh issue edit $n --repo defaultdave/ramble --add-label parked; done
```

The first fails harmlessly if the label already exists.

## 6. Edit for #999: `scripts/merge-desk/scope-check.ts`, line 5

Replace:

```ts
export const PROTECTED = [".github/", ".claude/", "CLAUDE.md", "scripts/merge-desk/", "docs/adr/", "docs/plan/", "eslint.config", "tsconfig"];
```

with:

```ts
export const PROTECTED = [".github/", ".claude/", "CLAUDE.md", "scripts/merge-desk/", "docs/adr/", "docs/plan/", "eslint.config", "tsconfig", ".gitleaks", "vitest.config", "knip.json", "playwright.config", "scripts/test-size"];
```

- The check matches by prefix: `.gitleaks` covers `.gitleaks.toml` and `.gitleaksignore`; `scripts/test-size` covers the script and its test.
- `package.json` and the lockfile stay unprotected, per the owner's answer.
- `scripts/merge-desk/scope-check.test.ts` may assert the list (not read). Run `bun test scripts/merge-desk` before pushing.
- The file is itself protected, so the PR fails `scope-manifest` and needs the owner's bypass merge, as PR 988 did. The merged PR closes #999 with `Closes #999`, or the owner closes it.

## 7. Edit for #1005: `.claude/standards/architecture.md`, line 42

Replace:

```md
**Route Handlers** exist only for the machine endpoints in design doc 3.2: `/api/webhooks/payments`, `/api/webhooks/email`, `/api/pulse`, `/api/beacon/events`, `/api/beacon/vitals`, and file downloads. Each checks a signature or secret and is rate limited. Reads go through Server Components and writes through Server Actions.
```

with:

```md
**Route Handlers** exist only for the machine endpoints in design doc 3.2: `/api/webhooks/payments`, `/api/webhooks/email`, `/api/pulse`, `/api/beacon/events`, `/api/beacon/vitals`, and file downloads. Each checks a signature or secret and is rate limited. Three more sit under `/api/auth/`: Better Auth's catch-all handler (Dave, 2026-11-10), and the browser form posts `/api/auth/confirm-sign-in` and `/api/auth/end-session`, which check the request origin instead of a signature (Dave, 2026-11-17, #1005). Reads go through Server Components and writes through Server Actions.
```

Open point, not settled by the owner: issue #1005 also asks for a rate-limit key on those two handlers. The standards edit does not add one. The lead recommended adding the key (`confirm-sign-in` is a sign-in path), as a small build in the auth lane. Until the owner answers, #1005 stays open.

## Other standards lines the lanes asked for (same file, owner edits)

- Add `holdsAnyRoleGrant` beside `readRoleGrants` in the B6 exempt text (lane `guest-signin` ruling, 2026-11-17).
- Add `RichTextEditor` to the client islands allowlist (lane `w3-cms` ruling, 2026-11-17).
- `Photo` is NOT added (#997 closed without an island).

## What the next lead checks after these have run

- `gh issue list --repo defaultdave/ramble --state open --limit 200 --json number,labels`: expect the 19 parked issues, plus whatever is still in flight: #1001 and #1004 (lane `audit-auth`), #1005 (rate-limit key), #999 until its PR merges, #61 and #133 and #326, #735, #830 unless the bookkeeping agent closed them (its entry is in `lanes/lead.md`).
- `git show origin/main:scripts/merge-desk/scope-check.ts | grep PROTECTED` and `git show origin/main:.claude/standards/architecture.md | grep -c confirm-sign-in`.
