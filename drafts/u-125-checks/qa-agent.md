PASS (gaps named: no browser, no signed-in rendering, no Postgres/DB tests run, no real cache invalidation, public host/experience pages not exercised, no concurrent double-submit test, no page-level gate test, no test of the settings/experiences page files)

# QA U-125 (code and test trace, not browser) - head 313ec4d

`bunx vitest run --project unit --project components`: 468 files, 10347 tests passed. DB project (tests/db) not run.

## Flows traced
- Signed out on /host/experiences and /host/settings: both pages call loaders, `signed_out` redirects to signInHref(path). Covered by hostSettingsResult it.each and action test ("sends nobody signed in to sign in and back"). Experiences gate covered in src/lib/hostExperiences.ts logic; its signed_out/refused result function has no dedicated test in the list I saw (only the build tests).
- Non-host user: `not_a_host_owner` -> notFound(); owner whose host is gone -> refused. Tested for settings. host_staff and ops/admin come from hostAccessFor (existing) and authz matrix rows (tests/db/authzHostSettingsRows.ts, DB, not run).
- Host owner list: host from caller grant, not address; listHostExperiences is requireRole(HostOwner, hostId), any status, adult-first prices, name order. Rows show name, status badge, prices, cancellation "Tier: full refund up to N hours before", waiver line. Component and lib tests cover facts, no-price case, empty state, "contact Ramble" copy, read-only. No status filter in the query, so draft/in_review/paused included; lib tests use statuses via label maps, not each status explicitly.
- Dashboard links to both pages: added, covered by HostDashboard.test.
- Settings page: prefilled name/About/notification email (test), labels via Input/Textarea components with hints, noValidate with server validation, maxLength limits, optional markers, errors via errorProps (test). Plain form, works without script, submit is a button: keyboard-operable by construction.
- Edit: parse -> updated/unchanged/invalid notice; success, info, danger tones tested. Unchanged writes nothing, no audit (db test "writes nothing when nothing differs"). Invalid/oversized names fields (name,notificationEmail tested), redirect carries only field names so typed input is dropped (action test asserts exact href). Posted hostId/slug/timeZone ignored (parser test, action test, form posts only three fields).
- Audit: one row per change with changed_* flags only, no values (db test asserts not containing new name).
- Cache: name/about change -> hostProfile (catalog tag) plus per-experience tags, after commit; email-only -> no updateTag (db test, mocked updateTag). tagsFor test added.
- Double submit: row is locked (withLockedHost) so the second identical submit reads current values and returns unchanged; no test exercises it.

## Gaps
- Not exercised: browser rendering, signed-in pages, focus/keyboard behavior, visual layout, DB tests (host-settings.db.test.ts, authz matrix), real Next cache invalidation, effect on public host page and experience pages (hostPage.ts comment says ops edits still don't invalidate; settings edits do via catalog tag).
- No test for the two page.tsx files (redirect/notFound wiring) or server loaders; only the pure result functions.
- Concurrent double submit untested.

## Suggestions (not built)
- Add a page-level test for notFound/redirect on both pages, and a concurrency test for two simultaneous saves.
