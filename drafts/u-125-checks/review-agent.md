# U-125 review (head 313ec4d, unit/U-125)

VERDICT: PASS. No blocking findings. REVIEW_VERDICT=APPROVE_WITH_NITS

Size: 1579 insertions + 6 deletions = 1585 changed lines (about 1000 tests/stories/fixtures). Not a failure. See the split answer below.
Scope: all within NEW-6 (read-only /host/experiences, /host/settings for notificationEmail/name/about, dashboard links). Host-side experience editing and payouts are absent. Ops updateHost untouched.
Checks run: tsc clean; prettier clean; eslint clean on all changed ts/tsx; 7 related vitest files, 81 tests pass. DB tests (tests/db) were not run (no database here); read them.

## Authorization (no hole found)
- Host is derived from the caller's own host_owner grant (src/lib/hostAccess.ts hostAccessFor) in the loaders (src/server/hostExperiences.ts, src/server/hostSettings.ts) and the action (src/server/actions/hostSettings.ts:22-26). No URL or form field names a host; a posted hostId is ignored (action test hostSettings.test.ts:88).
- The db layer re-checks: requireRole(HostOwner, {hostId}) is the first statement in readHostSettings (db/hostSettings.ts:21) and updateHostSettings (:46), and in listHostExperiences (catalog.ts:112). Matrix rows (authzHostSettingsRows.ts) allow only the owner of that host; db test refuses other-host owner, host_staff, guest, ops, admin, anonymous for both read and write, and asserts no row change, no audit row, no updateTag.
- host_staff: hostAccessFor ignores them, so page 404s and the action redirects to the page (which 404s). Ops/admin cannot use these functions (ForbiddenError), they keep updateHost.
- Several grants: the first host_owner grant wins, same as the dashboard; the other host is unreachable here. Consistent, FYI only.
- Suspended host: the owner can still view and save settings (no hostIsSuspended check). Nothing guest-visible leaks, since a suspended host's experiences are paused. Spec is silent. FYI.

## Cross-host leakage / internal fields
- listHostExperiences filters eq(experiences.hostId, parsed) only, all statuses, role-checked; catalog.db.test.ts:389-443 already covers it plus the matrix row (authz-matrix:332). HostExperienceSchema carries internal fields (taxTreatment, affiliateUrl, waiverDocumentId...) but buildHostExperiences (lib/hostExperiences.ts:42) projects only id, name, status label/tone, price lines, cancellation tier name + window, waiver yes/no. Nothing internal reaches the page. Notice email is shown only to its own host.

## Input limits / parse
- parseHostSettingsForm (hostSetup.ts:204): oversizedFields at hostLimits.rawField first, then FieldsSchema.pick (the ops schema, same limits and email parser), only 3 fields read. Inputs are Zod-parsed before the db call. Input components set maxLength from hostLimits and maxEmailAddressLength. Form works without JS.

## Audit row
- hostUpdatedEntry(userId, hostId, changed) yields details {changed_name: true, ...}: flags only, no free text, no email. Written in the same tx as the update; nothing differing writes nothing (db test :160). Actor is the host owner's user id.

## Cache
- hostProfile -> catalog tag (cacheTags.ts:83); hostPage.ts cacheTag(catalog) so host page is covered. Experience pages are tagged only experience(id), so one experience change per owned experience is needed to refresh the host name there; correct. Invalidation runs after commit via withLockedHost (rolled back = nothing). Notice-address-only change invalidates nothing (test :147). Collections/browse/home carry the catalog tag.
- Cost: N updateTag per N experiences for the host, plus one unbounded id select inside the host-locked transaction. Fine at demo and realistic marketplace sizes (tens). Next's 128-tag limit applies to cacheTag(), not updateTag(). Optional below.

## Ops updateHost
- Unchanged (db/hostSetup.ts:116); still does not invalidate caches, and the hostPage.ts comment now says so. Pre-existing gap, not this unit's.

## widened satisfies (tests/db/authzReviewRows.ts)
- allows widened to Partial<Record<string, readonly string[]>>; rows are spread into `const rows: Row[]` (authz-matrix:216, :512), where Place and Subject keys are still type-checked, and tsc passes. No lost checking in the matrix. The pause rows' own file keeps its narrow type.

## Lost coverage / duplication
- No tests deleted. The two TODO(U-074b) comments removed; getHostExperience keeps no caller (comment says so; its use is exported-but-unused, was already true).
- No existing parser or label duplicated: reuses FieldsSchema, hostLimits, oversizedFields, changedFields, hostFieldProblems, errorProps, hostPageNotice, experienceStatusLabels/Tones, priceKindLabel, formatPrice. refundWindowLabel is new; grep found no existing refund-window wording in src.

## Findings
Blocking: none.

Nits / optional (none required):
1. Optional src/server/db/hostSettings.ts:62-70: a host with very many experiences produces one tag per experience. If hosts can grow large, cap or batch; not needed now.
2. Nit src/lib/hostSetup.ts:211-215: the pick({name,description,notificationEmail}) repeats hostSettingsFields; could build the mask from the const array. Cosmetic.
3. Nit src/server/db/hostSettings.ts:46: updateHostSettings runs requireRole on the raw hostId while readHostSettings parses it first; harmless (the guard then WriteIdSchema in withLockedHost refuse a malformed id), but the two entry points differ.
4. FYI src/server/hostPage.ts comment lines now exceed the doc's usual width; prettier passes.

## Does a split leave unused exports?
Yes. The natural halves are (a) /host/experiences + view + listHostExperiences caller and (b) /host/settings + hostProfile cache change + db writer + matrix rows. Each half is self-contained and neither leaves unused exports, BUT they share the dashboard links, hostDashboardPath export, and the TODO removals; the strongest dependency is (b) alone, which is ~1000 lines. A split would be possible without dead exports, so the standing "ships as one PR" exception does not strictly apply; it is still a single acceptance unit in the replan (NEW-6) and about 60% tests. Recommendation: one PR is acceptable; do not fail for size. Owner decision, not a blocker.
