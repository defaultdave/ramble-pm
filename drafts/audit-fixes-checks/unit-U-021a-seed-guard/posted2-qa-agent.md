Reposted on head 3201db5: the only change since 9c84242 restores docs/adr/research/industry/observability-and-delivery.md to main (docs/adr/ is a protected path; the corrected sentence goes to the owner as a note).

Posted on head 9c84242 (round 2 at 4ae1232 with main merged; every gate rerun on the merge commit by the PM). This verdict was given on round 1 at 38f7af0; round 2 changed only src/server/env.ts, env.test.ts, docs/runbooks/seed.md and the target.ts header comment, re-checked by spec-compliance (PASS).

PASS

## qa-agent: U-021a "Seed host confirmation (N1029-1)" (head 38f7af0)

I ran the real CLI (`pnpm db:seed`, bun, scripts/seed.ts) with `env -i` and fake values. No database was involved. Every host that could be reached was the reserved `.invalid` TLD, so nothing could resolve. The one run that used the Neon-shaped host from the brief was a refusal that never connected.

### Blocking
None.

### Non-blocking
- An uppercase SEED_HOST is refused. This is stricter than needed but safe: the URL parser lowercases the URL host, and the message prints the lowercase host to copy. The runbook's `sed` extraction does not lowercase. Neon hosts are lowercase, so this is theoretical.
- `SEED_HOST=` (empty) is treated as unset and refuses with the same message. This is correct.

### Unconfirmed
- None.

### CLI results (exit code, first line)
| Case | Result |
|---|---|
| staging, Neon URL, no SEED_HOST | exit 1, `Refusing to seed: SEED_TARGET is staging and DATABASE_URL points at ep-quiet-cell-123.us-east-2.aws.neon.tech. Set SEED_HOST=<that host> ...`. The message names the host. It does not print the URL, the user, or the password. |
| staging, SEED_HOST=different host | exit 1, same refusal |
| staging, SEED_HOST=uppercase variant | exit 1, same refusal |
| load-test, the same three cases | exit 1, the same refusal each time (names load-test) |
| production-demo, the same three cases | exit 1, the same refusal each time (names production-demo) |
| staging / load-test / production-demo, SEED_HOST = exact host (fake `.invalid` host) | The guard passes. Output is `Seeding the <target> database on <host>`, then `Seed failed: DNSException (ENOTFOUND)`, exit 1. The failure is only at connecting, so the guard let it through. |
| local, localhost:5999 URL, no SEED_HOST | The guard passes with no SEED_HOST. Output is `Seeding the local database on localhost`, then `Seed failed: AggregateError (ECONNREFUSED)`. |
| staging, host `db-prod.qa-fake.invalid`, with SEED_HOST exact and with it unset | exit 1 both times, `looks like a production database`. The production refusal comes first. |
| SEED_HOST=`https://host/`, `a b`, 254 x `a` | exit 1. Env validation throws "Invalid environment variables ... at SEED_HOST" before any seed output. The password does not appear in the output. |
| SEED_HOST of 253 characters (boundary) | Passes validation and then refuses as `host_not_confirmed`. |

### Mutation test (scratch worktree `$TMPDIR/qa-seed-guard`, removed afterwards)
- Unmutated: `target.test.ts` has 81 of 81 passing.
- I replaced the new condition `input.seedTarget !== 'local' && input.seedHost !== database.host` with `false`. 7 tests failed, all under "SEED_HOST confirmation": no SEED_HOST for staging, load-test, and production-demo; another host; the host in another case; a prefix; a suffix. The guard is covered.
- The scratch worktree is removed and the builder's worktree is untouched (clean status).

### Runbook (docs/runbooks/seed.md)
- The staging command with `SEED_HOST=<the host in DATABASE_URL>` matches the CLI.
- The `host_not_confirmed` description matches the observed refusal. It says the message names the host and never the connection string, and I confirmed both.
- The "local needs no SEED_HOST" behaviour matches.
- The production-demo `sed` extraction returns the bare host for a URL with a query string, a port, and an encoded password (tested on three samples). The result is the exact host the guard compares against.
- `.env.example` documents SEED_HOST consistently.

### Evidence
- None. This is a CLI-only change with no UI, and no evidence files are required. The tables above are the observed output.
