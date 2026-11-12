PASS

# U-125 (NEW-6, issue 950) spec compliance

Branch unit/U-125, head 313ec4d16296844c6a2a3dd827645a8893067c1a, diffed with `git diff origin/main...HEAD` (33 files, +1579/-6). Checked against the issue 950 scope manifest and the replan row NEW-6 in `drafts/mvp-replan-2026-11-10.md`.

Verdict: PASS. No criterion FAILs. Two builder choices are flagged for a human look (see judgment calls).

## Per-criterion

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | /host/experiences exists and is read-only | PASS | `src/app/(host)/host/experiences/page.tsx`; `src/components/HostExperiences/HostExperiences.tsx` has no form or input elements |
| 2 | Shows each experience's status | PASS | `src/lib/hostExperiences.ts` `statusLabel`/`statusTone`; rendered by `StatusBadge` in `HostExperiences.tsx` |
| 3 | Shows price options | PASS | `src/lib/hostExperiences.ts` `prices` (kind label plus formatted price, `None set` when empty) |
| 4 | Shows cancellation terms | PASS | `src/lib/hostExperiences.ts` `cancellation` via `refundWindowLabel` |
| 5 | Shows waiver | PASS | `src/lib/hostExperiences.ts` `waiver` ("Guests accept a waiver" / "No waiver") |
| 6 | /host/settings exists, edits notificationEmail | PASS | `src/components/HostSettings/HostSettings.tsx` field `notificationEmail`; `src/lib/hostSetup.ts` `hostSettingsFields` |
| 7 | /host/settings edits name | PASS | `HostSettings.tsx` field `name`; `src/server/db/hostSettings.ts` `updateHostSettings` writes it |
| 8 | /host/settings edits about | PASS | `HostSettings.tsx` field `description` labelled "About"; maps to `hosts.description` |
| 9 | Host-side experience editing out of scope | PASS (absent) | No experience write path in the diff; the only experience-related write is the cache invalidation fan-out in `src/server/db/hostSettings.ts` |
| 10 | Payouts out of scope | PASS (absent) | No payout references in the diff |
| 11 | Status changes, notifications, photo upload not added | PASS (absent) | Grep of the diff for status mutations, notify/send, photo, payout finds nothing new beyond the settings email field |
| 12 | No schema change or migration | PASS | None of the 33 changed files is a migration, `schema.ts`, or drizzle folder; `src/server/db/schema` untouched |
| 13 | Depends on U-067, U-074b | PASS (by presence) | Host area files (`hostAccess.ts`, `hostDashboard.ts`, `listHostExperiences`) are on main and reused; U-074b's TODO is removed in `src/server/db/catalog.ts` |
| 14 | Axe matrix rows not required (U-100 not on main) | PASS | No axe rows added. The matrix rows added (`tests/db/authzHostSettingsRows.ts`, wired in `tests/db/authzReviewRows.ts`) are DB authorization rows, not axe |
| 15 | Review tier Standard | N/A | meta, not diff-verifiable |
| 16 | Estimate 0.75 days | N/A | planning meta |

## Builder choices

| Choice | Verdict | Note |
|---|---|---|
| "about" is `hosts.description`, form field `description`, label "About" | In scope | Matches the replan wording and the existing column |
| Slug and time zone not editable by the host | In scope | `hostSettingsFields` is `name`, `description`, `notificationEmail` only; a test asserts the posted field list |
| Only `host_owner` can use /host/settings; host derived from caller's own grant | In scope | `src/lib/hostAccess.ts` `hostAccessFor`; `src/server/actions/hostSettings.ts` ignores any posted host id |
| Suspended host can still edit settings | Judgment, flag | Not in the issue. `hostAccessFor` and `updateHostSettings` do not call `hostIsSuspended`. The existing dashboard does not check suspension either, so this matches the host area as it stands. A human should decide whether suspension should block host edits. Not a missing requirement |
| Cancellation as "<Tier name>: full refund up to N hours before" via `refundWindowLabel` | In scope | `src/lib/hostExperiences.ts`. The 0-hour and 1-hour wording are extra cases, harmless |
| No detail view (list shows every fact) | In scope | Not required by the row |
| `getHostExperience` still has no caller; TODO removed | In scope | Only definition at `src/server/db/catalog.ts:124`; comment now says no page calls it |
| Dashboard ButtonLinks to both pages | In scope | `src/components/HostDashboard/HostDashboard.tsx`. Needed to reach the pages; no nav list exists |
| New `hostProfile` cache kind so name/about edits invalidate guest pages | In scope (supporting) | `src/lib/cacheTags.ts`, `src/server/db/hostSettings.ts`. Without it guest pages would show stale name/about. Cost is one experience change per host experience, as the builder states |
| Host edits write `host.updated` with flags only | In scope | `src/lib/hostAudit.ts` `hostUpdatedEntry` emits `changed_<field>: true` only; test in `tests/db/host-settings.db.test.ts` asserts `{ changed_notification_email: true }` |
| "To change an experience, contact Ramble" copy | In scope | `HostExperiences.tsx` |

## Notes
- Nothing in the diff is out of scope. No FAIL, so the verdict is PASS.
- The only open question is the suspended-host edit path (judgment, not a missing AC).
- Source patch saved at the scratch path used for this check: `/tmp/claude-501/u125.patch`.
