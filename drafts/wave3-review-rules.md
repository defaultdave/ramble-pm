# Ramble Prototype wave 3: rules for every reviewer

You review one unit branch, read-only. Your brief gives the unit, its worktree path, its base (`origin/main` or `origin/integration`), and its scope manifest.

- Review the diff `git -C <worktree> diff origin/<BASE>...HEAD` and read whatever surrounding code you need. Do not edit, commit, push, or call GitHub.
- Judge against: the scope manifest (anything outside IN SCOPE is a finding); `docs/plan/01-design-doc.md` and the ADRs the unit touches; `.claude/standards/architecture.md` with B6 and B7 as amended on 2026-10-24 (guest-visible reads are exempt from `requireRole`; an export shipped ahead of its first caller is exempt from B7 when it carries `TODO(U-xxx): first caller` naming a later unit in `docs/plan/units.yaml`); `CLAUDE.md` (comments only for a non-obvious why; `TODO(U-123)` is the only comment naming a ticket).
- Sweep for whole defect classes, not single instances. Earlier waves kept finding these classes late, one instance per round; find every instance now:
  1. Unbounded work: inputs with no size limit, loops or retries with no cap, queries with no limit.
  2. The database accepting what Zod rejects: a stored value whose Zod rule has no matching CHECK, NOT NULL, length limit, or enum, or no test that the database refuses it.
  3. Failing open: a provider, parse, or lookup error that lets a request through or repairs input.
  4. Data in logs: raw database errors, their params, or request bodies reaching a logger or Sentry.
  Also: missing auth checks or missing tests for the refusal; code that repairs bad input instead of failing closed; secrets compared in non-constant time; tests that call the network.
- Up to five units are built in parallel on separate branches. Code another unit owns (it will arrive in its own PR) is not missing from this one.
- Verify before you report: run the specific test or read the specific line. A finding you could not confirm goes under "Unconfirmed", not "Blocking".

Verdict format (it is posted as a GitHub check summary, so no em dashes):

```
PASS | FAIL

## <check name>: <UNIT> "<title>" (head <short sha>)

### Blocking
- file:line: the defect, the input that breaks it, and the fix. (Or "None.")

### Non-blocking
- ...

### Unconfirmed
- ...
```

FAIL if and only if there is at least one blocking finding.

## Added 2026-10-26 (wave 3 lesson)
- Architecture audits: list EVERY B2 decision in the data layer and route handlers in round 1 (every comparison, threshold, or state rule that yields a domain result), not the first one found. A finding that existed in round 1 code and is reported only in a later round counts against the audit, not the builder.
- Severity is fixed by the rule, not the round: a B2 decision is blocking whenever it is found.
- Mutation testing runs in your own scratch worktree (`git -C <worktree> worktree add <scratch path> HEAD --detach`), removed when you finish. Never mutate the builder's worktree: other reviewers and the builder share it.

## Added 2026-10-28: duplication (DRY; owner rule)
- Every reviewer sweeps the diff for a fifth defect class, **duplication**, against the whole repository, not only the diff: for each new export, hook, component, constant, or schema, search `src/lib`, `src/server`, and `src/components` by concept (several words for the idea, not only the name) for one that already does the job or nearly does.
- **Blocking:** a new function, hook, component, or schema that duplicates or nearly duplicates an existing one that could have been used or extended; a general helper (money, durations, dates, the New York day, addresses, labels, card building, read wrappers) added to a page module instead of a shared module; a rule, label, or calculation defined inside a component instead of a tested `src/lib` function. Name the existing code and say how to reuse or extend it.
- **Non-blocking, logged:** duplication that existed before this diff. Report it under Non-blocking with "audit item" so the PM logs it in `audits/` in the ramble-pm repo.
- Check the builder's **Reuse** section against what you find; a missing or wrong Reuse section is a finding.

## Added 2026-10-29: evidence (owner rule)
- The qa-agent check looks at the builder's before-and-after files in `evidence/pr/<dir>/` in the ramble-pm repo, adds its own where the builder's are missing or do not show the finding (same naming, same folder), and names each file it relied on in the verdict under a **Evidence** line, one file per line with what it shows. The PM embeds them in the posted check summary and the PR body, so the owner can see the change without running it.
