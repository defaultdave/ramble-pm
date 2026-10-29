# Architecture lens: verifier verdicts (`5121048`)

Verifier read a `git archive` extract (the sandbox refused `git worktree add`); nothing built or run. Vercel dashboard firewall not visible from the repo.

| ID | Verdict | Note |
|---|---|---|
| A1 | CONFIRMED (dev 500 plausible, not run) | `addPhoto` has no non-test caller; `fake.ts` documents its URLs "will not display"; risk is only that nothing blocks fake in production. Medium-latent or low. Recorded as BE-2 (low, latent). |
| A2 | CONFIRMED | No rate limit or firewall config in repo; `botid` only on checkout; unknown slugs reach Postgres via `inArray` subqueries; `null` experience cached and tagged. Recorded as BE-1 (medium). |
| A3 | CONFIRMED, intentional | Minute key on purpose; `revalidate`/`expire` never act. Recorded as BE-3 (low). |
| A4 | CONFIRMED for photos, REFUTED for the calendar | Calendar lag bounded to about a minute by the A3 key and documented. Photo half recorded as BE-4 (low). |
| A5 | CONFIRMED | Recorded as BE-5 (low). |
| A6 | CONFIRMED | Recorded as BE-6 (low). |
| A7 | CONFIRMED | Evidence for H-2. |
| A8 | CONFIRMED, overstated | Documented race guard; informational evidence for H-7. |
