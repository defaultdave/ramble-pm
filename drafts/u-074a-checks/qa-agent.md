PASS (gaps named: e2e, Storybook, db tests and the browser were not run by the QA agent)

## qa-agent: U-074a "Host setup, lite cut" round 2 (head 21b3aa7)

### Blocking
None.

### Non-blocking
- Ran in a scratch worktree at 21b3aa7 (removed after, node_modules linked from the unit worktree, `pnpm exec next typegen` run first): vitest on src/lib/hostSetup*, src/lib/hostAudit*, src/lib/email, src/server/ports/email/hostInviteRender.test.ts, src/lib/opsNav.test.ts, src/components/HostSetup, src/server/auth/signInLink.test.ts: 14 files, 370 tests, all pass.
- `pnpm typecheck`: exit 0, no errors.
- Slug-related unit tests (vitest `-t slug` over hostSetup, HostSetup component, hostAudit): 9 passed, 100 skipped, all in src/lib/hostSetup.test.ts. They cover: slug derived from name with lower-cased addresses; typed slug kept; capitals refused naming the field; over-limit slug refused; name leaving no slug refused; name too long to make a slug refused; blank slug on edit refused instead of renaming from the name; isSlugTakenError on a non-error value; the slug-taken notice is known and names the slug field.
- Gaps: e2e, Storybook (HostSetup stories), db tests (tests/db/host-setup.db.test.ts, which is where migration 0031 and the hosts_slug_unique collision would be exercised) and the browser were not run by this agent. No Postgres here.
- Evidence: no browser, so no screenshots. The PM should capture the host create form, the slug_taken notice on a duplicate slug, and the host detail view.

### Unconfirmed
- Migration 0031 applying and the unique constraint raising hosts_slug_unique through the real action (slug_taken outcome end to end).
- The malformed acceptance id now being invalid, and acceptance state in lib, beyond what the unit tests above cover.
- The sign-in link flow (signInLink.ts) beyond its unit test, and the HostSetup UI in a browser.
