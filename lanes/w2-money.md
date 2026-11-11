# Lane w2-money history

## 2026-11-10 (first chat)
Claimed the lane, ran U-056 (4 rounds, PR 935 merged `2e9b805`), U-106 (6 rounds, PR 937 merged `b001c83`), U-055 (6 rounds, PR 944 open, head `a801f1a`).

### Lessons to carry into every builder brief
- Every domain decision (comparison, threshold, state rule, mapping to a domain result, including error-to-outcome and gate outcomes) is a plain tested `src/lib` function; the data layer and actions only fetch, lock, persist and act on the lib verdict (architecture B2). Display copy too: components render what lib returns.
- No `catch` that returns or recovers a value (B13): read the provider first and decide beforehand; let errors propagate. No lock on a row the `locks.ts` plan takes alone; use a status-guarded write under the order lock. Parse every exported entry's input with Zod (B5). A server action's data-layer function takes a value only the token check can produce (B6).
- No new client island without Dave's approval (B8): use a server-rendered form.
- One shared helper per concept (B17): search `src/lib` and `src/server` by concept before writing; extract the shared one when a copy would be needed.
- The review agent mutates every branch: write tests that pin each branch (boundary minute, one minor unit either side, a second row of the same kind untouched, app-clock skew vs database clock, lock waits with `raceAgainstOpenTransaction`, every status in a constant by iterating the constant, stubbed ports for refusals).
- Test files under the 800-line hard limit: new tests in new files.
- Builders run Chromium only with the sandbox off (e2e, Storybook); QA agents cannot.
- Parallel lanes land on `main` while you work: rebase before the checks and again before posting.

### Process notes
- Round count: the architecture audit (haiku) finds new instances each round; the cap in DECISIONS 2026-11-10 (after round 4 its findings are follow-ups) was not applied here. Apply it.
- Posting: `post-check.ts` for the four checks on the head SHA copied from `git rev-parse`; verdicts from an earlier head may be reposted only when the source is identical (tests-only commits), saying so in the summary.
