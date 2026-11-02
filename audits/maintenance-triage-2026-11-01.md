# Maintenance triage (2026-11-01)

**Scope:** every live audit row (`open`, `fix`, `decided`, `assigned`) across the pass files, 206 items once two duplicated rows are merged: 178 had a Todo ticket in the Maintenance sprint on board #19 when the check started, and the other 28 (SC-1 to SC-27, H-7) were filed by the ticket session during it, as #685 to #711 and #548. Each was checked against `origin/main` at `f196dbb` (after the 2026-11-01 promotion) by six read-only verifiers, one per pass file, then grouped by shared file or root cause. Verdict and bucket per row are below; the ticket holds the status once the ticket-writer applies this triage. The Owner column of the pass files is unchanged.

**Not done here:** no ticket, label, board or audit-row write. A separate session owns those; `drafts/maintenance-triage-actions.json` lists what to apply.

## Result

| Bucket | Rows | What happens |
|---|---|---|
| A: close now, no code | 18 | 13 already fixed by later PRs, 4 stale, 1 duplicate. Close with the evidence in the note. |
| B: clear fix, batch now | 92 | 55 XS, 35 S, 2 M. 24 PRs in 4 waves below, disjoint files per wave, one migration per wave. |
| C: Sprint 2 track | 46 | Stay in Maintenance with a `track:` label; the track's carrier PR closes them. |
| D: carried by a unit | 20 | Close the ticket as `later` with the unit named; a comment on the unit's issue carries the item. |
| E: owner decision | 30 | One answer sheet, `drafts/owner-decisions-2026-11-02.md`, recommendation per row. |

## A: close now (18)

ID | Ticket | Verdict | Evidence
--- | --- | --- | ---
H-28 | [#369](https://github.com/defaultdave/ramble/issues/369) | STALE | Departure recorded in ramble-pm audits/design-departures.md line 10; no code per owner.
H-36 | [#372](https://github.com/defaultdave/ramble/issues/372) | STALE | Owner decided keep one-minute cut (`minuteAsOf` still used); no code.
H-61 | [#377](https://github.com/defaultdave/ramble/issues/377) | FIXED | One PageError on PageHeading (display-m title); used by HomeContent, LandingRoute, experience page.
H-65 | [#379](https://github.com/defaultdave/ramble/issues/379) | FIXED | Retry form `justify-self: start` from 768 px via `:has(> button:only-child)`.
H-66 | [#380](https://github.com/defaultdave/ramble/issues/380) | STALE | Departure recorded in ramble-pm audits/design-departures.md line 11; no code per owner.
H-76 | [#382](https://github.com/defaultdave/ramble/issues/382) | DUP | Same root cause as H-62 (visually-hidden copies).
H-98 | [#395](https://github.com/defaultdave/ramble/issues/395) | FIXED | Meta comment now a single clean line (line 26); no trailing comma.
BE-18 | [#360](https://github.com/defaultdave/ramble/issues/360) | FIXED | FilterBar has no Clear all filters link; FilterBar.test.tsx asserts it never offers one. Only BrowseResults empty state does.
BE-20 | [#361](https://github.com/defaultdave/ramble/issues/361) | FIXED | Picker loaded via dynamic import() on first open (or chip hover/focus prefetch); no static react-aria import in bar.
BC-1 | [#307](https://github.com/defaultdave/ramble/issues/307) | FIXED | /orders now sits in GuestShell via (site)/layout.tsx; only group error.tsx keeps plain SiteShell, by design
BC-4 | [#310](https://github.com/defaultdave/ramble/issues/310) | FIXED | focusTarget() plus focus effect moves to sheet heading, notice, or Pay on each view change
BC-7 | [#313](https://github.com/defaultdave/ramble/issues/313) | FIXED | hostRow sets notificationEmail via hostNotificationEmail(slug) for every seeded host
BC-8 | [#314](https://github.com/defaultdave/ramble/issues/314) | FIXED | maxMoneyLines gone; query limits on MAX_LINES from lib/pricing
BC-18 | [#323](https://github.com/defaultdave/ramble/issues/323) | FIXED | One lockOrderRow/lockOrderById and one readHoldSettings serve checkout and providerEvents
BC-20 | [#325](https://github.com/defaultdave/ramble/issues/325) | FIXED | metadata referrer 'no-referrer'; e2e shows token redirected into a path-scoped cookie
BC-27 | [#331](https://github.com/defaultdave/ramble/issues/331) | FIXED | dueClock (+5 s) used by provider-events, bookingEmails, fake-payment-delivery tests; audit.db.test still systemClock, see BC-28
N1030-25 | [#451](https://github.com/defaultdave/ramble/issues/451) | STALE | Process note already recorded in ramble-pm DECISIONS.md 2026-10-29 (duplicate PR 265/267 entries); no code action.
N1030-28 | [#454](https://github.com/defaultdave/ramble/issues/454) | FIXED | Chip.module.css:114 forced-colors rule covers aria-pressed/aria-current; ChipLink and dateChip compose .chip; BE-15 closed.

## B: fix now, 24 PRs in 4 waves (92)

Each wave's PRs touch disjoint files, so up to five builders run at once (machine limit). A later wave touches files an earlier one changed, so it waits for that wave to merge and merges `main` before its checks. Before launch the lane PM re-checks the file overlap against `main` (lesson from the lib refactor: stale move tables). Sizes are the verifiers' estimates for an agent builder.

### Wave 1

PR | Rows | Size | Scope
--- | --- | --- | ---
P01 `visually-hidden` | H-62 | 1S | One shared VisuallyHidden class replaces 13 module copies (mechanical, wide).
P02 `db-reads` | N1029-8, N1030-13, N1030-14, H-106, N1031-9, H-108 | 1S 5XS | photos.ts, home.ts, editorial.ts: derive column lists, guestVisible in one place, coverImage, narrow gift-guide read.
P03 `lib-constants` | N1029-3, N1029-9, H-88, H-95, N1029-15, N1030-12 | 1S 5XS | cancellation.ts bounds with .max() and a CHECK migration; shared time constants; HttpUrlSchema. Carries this wave's migration.
P04 `fake-delivery` | N1031-1, N1031-2, BC-47, BC-49 | 1M 3XS | Fake gateway redelivers the stored event on confirm, tests outcome.kind, logs failed drains, reads method back.
P05 `checkout-form` | N1031-10, N1031-12, BC-30, N1031-25, BC-34, N1031-3 | 3S 3XS | CheckoutForm DRY (ExternalLink, one field wrapper), focus the details notice, autocomplete on the fake form, fitParty notice, draft dispatch outside try.
P06 `browse-ui` | H-101, H-102, SC-6, SC-14, SC-2 | 3S 2XS | BrowseResults and FilterBar: shared error block, shared chip groups and hidden-field helper, one page-shell CSS module with LandingPage, settle the 20 px offset in a browser.
P07 `tooling-smalls` | N1030-27, N1030-3, SC-26, SC-27, SC-1 | 1S 4XS | global-error title, vercel.json patterns and test, osv overrides, schema enum comment plus db:generate gate in CLAUDE.md, coverPhotos uses tagExperiences.

### Wave 2

PR | Rows | Size | Scope
--- | --- | --- | ---
P08 `skeleton-css` | H-77, H-78, N1030-20 | 2S 1XS | One pulse keyframe, composes for the home skeleton rules, drop the unused .empty.
P09 `browse-reads` | N1030-4, N1030-5, N1030-6, BE-3, BE-9, N1030-21, N1031-17 | 2S 5XS | Date clamp in knownFilters, explicit getBrowseDates args, limit max+1 caps, asOf cache key, zero-results summary, price label, guestOptions constant.
P10 `seed` | N1029-10, N1029-11, N1030-11, N1030-19, N1029-17, N1030-23, H-69, N1029-5 | 3S 5XS | Occurrence indexing and max, target hint and shared loopback list, constants out of coverage/photos/storage, split testPhotos, guestHomeModules db test, seats_sold guard.
P11 `server-hash` | N1031-13, N1031-14 | 2XS | src/server/hash.ts: one sha256Hex and secureEqual for device, tokens, rate limit, formGuard, fake.
P12 `checkout-a11y` | SC-17, SC-18, SC-24 | 3XS | Focus-visible rings on checkout containers, scope the notice focus to the sheet, fix the BookingSheet story width.
P13 `audit-export-hardening` | SC-9, SC-10, SC-11 | 2S 1XS | Transaction timeouts and maxDuration, alert when queueing throws, typed permanent-failure marker.
P14 `consents-guard` | BC-2 | 1S | Append-only trigger on consents like the ledger, with db test. Carries this wave's migration.

### Wave 3

PR | Rows | Size | Scope
--- | --- | --- | ---
P15 `home-modules` | H-59, H-60, H-26, H-97, N1031-16, H-104, H-105 | 1S 6XS | ButtonLink for the gift action, Badge tone, rail hrefs through categoryPath, aria-current test, picksCandidates and idListSchema in lib/idLookup.
P16 `guest-page-loaders` | H-79, H-99, SC-3, SC-5, SC-16 | 3S 2XS | Brand constant and PageHeading in HomeStates; HomeContent, BrowseContent, LandingRoute read systemClock and name the landing error.
P17 `error-kind` | H-89, H-90, N1031-4 | 3XS | errorKind beside errorDigest; rethrowOrLog, readOrRefuse, checkout and the remote cache log stop interpolating error.message.
P18 `ports-dry` | N1029-12, N1029-13 | 2S | Storage rules into lib, one error base and requireEnv across the ports.
P19 `experience-gallery` | BE-11, BE-17, BE-16 | 1S 2XS | Gallery renders See-all photos from one source, conditional tab stop, real fallback titles.
P20 `small-components` | BC-23, BC-31, H-87 | 2S 1XS | Footer link target size, UpcomingSessions skeleton rows and selected state, Card price at 320 px.

### Wave 4

PR | Rows | Size | Scope
--- | --- | --- | ---
P21 `shell` | H-74, H-75, N1101-4, SC-15, SC-22 | 3S 2XS | base.css body>main onto a GuestShell class, Storybook imports base.css, fonts fallback constant, shared SkipLink, styled client-safe shell for the checkout group error.
P22 `pages-moves` | N1030-17, N1030-18 | 2S | siteNav, dateChipLabel and splitPage out of lib/pages into shared modules.
P23 `checkout-maintenance` | BC-21 | 1S | startPayment refuses while checkoutMaintenance is set, not only the page.
P24 `home-sessions-limit` | H-38 | 1M | Sold-out filtered in SQL with a partial index, not in code after .limit. Carries this wave's migration.

### B rows by PR, with tickets

ID | Ticket | PR | Size | Files | Note
--- | --- | --- | --- | --- | ---
H-62 | [#378](https://github.com/defaultdave/ramble/issues/378) | P01 | S | 13 CSS modules (e.g. `src/components/Button/Button.module.css`) + one shared class | Now 13 copies, not seven (Chip, CheckoutPage, FakePaymentForm, UpcomingSessions added).
N1029-8 | [#419](https://github.com/defaultdave/ramble/issues/419) | P02 | XS | src/server/db/photos.ts | listGuestPhotos (:288) still hand-writes inArray; the other read (:312) already uses guestVisible.
N1030-13 | [#439](https://github.com/defaultdave/ramble/issues/439) | P02 | XS | src/server/db/photos.ts | photoColumns, coverWith.columns, coverSelection still three nine-column lists; derive from photoColumns.
N1030-14 | [#440](https://github.com/defaultdave/ramble/issues/440) | P02 | XS | src/server/db/home.ts, src/server/db/photos.ts | home.ts:60 still inlines photoView(GuestPhotoSchema.parse(cover)); call coverImage with null adjustment.
H-106 | [#403](https://github.com/defaultdave/ramble/issues/403) | P02 | XS | `src/server/db/editorial.ts` | `columnsWithoutIntro` still hand-listed; db tests assert no `intro` on pick but mutation survival unverified.
N1031-9 | [#463](https://github.com/defaultdave/ramble/issues/463) | P02 | XS | src/server/db/editorial.ts | columnsWithoutIntro still hand-listed; derive from getTableColumns (already imported) omitting intro.
H-108 | [#405](https://github.com/defaultdave/ramble/issues/405) | P02 | S | `src/server/db/editorial.ts`, `src/server/home.ts` | `getPublishedGiftGuide` still reads full entries and intro via `readCollections`.
N1029-3 | [#416](https://github.com/defaultdave/ramble/issues/416) | P03 | S | src/lib/catalog.ts, src/lib/cancellation.ts, src/server/db/schema/policies.ts | Schemas and CHECKs still have no max; define bounds once, add .max(), CHECK migration. Note experiencePage now lib/pages/experience.ts.
N1029-9 | [#420](https://github.com/defaultdave/ramble/issues/420) | P03 | XS | src/lib/cancellation.ts, src/lib/sessions.ts | formatterFor still has its own TIME_ZONE_NAME; call TimeZoneSchema/isKnownTimeZone, keep RangeError.
H-88 | [#386](https://github.com/defaultdave/ramble/issues/386) | P03 | XS | `tests/db/seed.db.test.ts`, `tests/db/browse.db.test.ts`, `src/lib/cancellation.ts` | Hand day math remains at seed.db:244-251, browse.db:245; MS_PER_HOUR in cancellation.ts; browse.test.ts 86_400_000 gone.
H-95 | [#393](https://github.com/defaultdave/ramble/issues/393) | P03 | XS | `src/lib/seed/coverage.ts`, `src/lib/cancellation.ts` | `kayak-other-dates` still `> now + msPerDay` inline.
N1029-15 | [#425](https://github.com/defaultdave/ramble/issues/425) | P03 | XS | src/lib/seed/plan.ts, src/lib/sessions.ts | time.ts now has msPerDay/isoDateOf; coverage.ts uses them. plan.ts dayMs/isoDate and sessions.ts:156,309,311 remain.
N1030-12 | [#438](https://github.com/defaultdave/ramble/issues/438) | P03 | XS | src/lib/experienceCards.ts, src/lib/catalog.ts, src/lib/seed/plan.ts | linkOutUrl still z.string() (HttpUrlSchema unexported); defaultTimeZone still dup. Unexport part is FIXED (both have non-test importers).
N1031-1 | [#455](https://github.com/defaultdave/ramble/issues/455) | P04 | M | src/server/fakePaymentDelivery.ts, src/server/ports/payments/fake.ts, src/server/ports/payments/gateway.ts | No lastEventFor or redeliver exists; retry still hits invalid_state, refused. Runbook still says nothing retries.
N1031-2 | [#456](https://github.com/defaultdave/ramble/issues/456) | P04 | XS | src/server/fakePaymentDelivery.ts, src/lib/providerEvents.ts, src/server/paymentWebhook.ts | isDeliveryTaken(response.status) still used at fakePaymentDelivery.ts; export outcome body, test kind accepted.
BC-47 | [#344](https://github.com/defaultdave/ramble/issues/344) | P04 | XS | src/server/fakePaymentDelivery.ts | after(drained) leaves a failed drain to Next's console.error; catch and log through logger
BC-49 | [#529](https://github.com/defaultdave/ramble/issues/529) | P04 | XS | src/server/ports/payments/fake.test.ts | Fake stores payment.method but no test reads it back; assert retrieve().method after confirm
N1031-10 | [#464](https://github.com/defaultdave/ramble/issues/464) | P05 | S | src/components/CheckoutPage/CheckoutForm.tsx, src/components/Card/Card.tsx | Three hand-written target=_blank copies remain (Card, CheckoutForm, ButtonLink); add ExternalLink component.
N1031-12 | [#466](https://github.com/defaultdave/ramble/issues/466) | P05 | S | src/components/CheckoutPage/CheckoutForm.tsx, src/components/Input/Input.tsx | TextField/AgeField still twin memo wrappers; optionalError still local. Keep stable-prop contract.
BC-30 | [#334](https://github.com/defaultdave/ramble/issues/334) | P05 | S | src/components/CheckoutPage/CheckoutForm.tsx, src/components/OrderSummary/OrderSummary.tsx | Details-step notice Alert never focused; summary toggle is a button with no no-script path; third part unverified
N1031-25 | [#479](https://github.com/defaultdave/ramble/issues/479) | P05 | XS | src/components/FakePaymentForm/FakePaymentForm.tsx | Four fields still autoComplete="off", type forbids tokens; use cc-number, cc-exp, cc-csc, postal-code (no design-departures file exists).
BC-34 | [#338](https://github.com/defaultdave/ramble/issues/338) | P05 | XS | src/lib/bookingDraft.ts | fitParty trims children then adults with no notice set; add a BookingNotice
N1031-3 | [#457](https://github.com/defaultdave/ramble/issues/457) | P05 | XS | src/components/BookingChoices/useBookingDraft.ts | Dispatch and router.push still inside the try; bare catch sends held guest to error notice.
H-101 | [#398](https://github.com/defaultdave/ramble/issues/398) | P06 | S | `src/components/BrowseResults/BrowseResults.tsx` | Browse error block still hand-built Alert + retry form beside PageError.
H-102 | [#399](https://github.com/defaultdave/ramble/issues/399) | P06 | XS | `src/components/BrowseResults/BrowseResults.module.css` | Comment at line 101 still says "as PageError's does".
SC-6 | [#690](https://github.com/defaultdave/ramble/issues/690) | P06 | XS | src/components/BrowseResults/BrowseResults.module.css | Unverified. Notice box is flush left; 20px equals Button padding-inline, so may be label inset by design. Check in browser first.
SC-14 | [#698](https://github.com/defaultdave/ramble/issues/698) | P06 | S | src/components/FilterBar/FilterBar.tsx, src/components/BrowseResults/BrowseResults.tsx | NoScriptFilters repeats the three ChipGroups of the drawer; hidden-input loop repeated in TargetButton.
SC-2 | [#686](https://github.com/defaultdave/ramble/issues/686) | P06 | S | src/components/LandingPage/LandingPage.module.css, src/app/(guest)/new-york/browse/page.module.css | .page and .title identical in both files; move to one shared module.
N1030-27 | [#453](https://github.com/defaultdave/ramble/issues/453) | P07 | XS | src/app/global-error.tsx | Still no <head><title>; add one.
N1030-3 | [#429](https://github.com/defaultdave/ramble/issues/429) | P07 | XS | vercel.json, tests/vercel-config.test.ts | revert/* and dependabot/* still unlisted; add patterns, extend test matcher. Vercel glob semantics unverified.
SC-26 | [#710](https://github.com/defaultdave/ramble/issues/710) | P07 | S | package.json, pnpm-lock.yaml, osv-scanner.toml (new) | No overrides or exception file for deepmerge 4.3.1, glob 13.0.6, minimatch; push scan on main still runs.
SC-27 | [#711](https://github.com/defaultdave/ramble/issues/711) | P07 | XS | src/server/db/schema/operations.ts, CLAUDE.md | auditActorKindEnum has no comment; add one line, and list pnpm db:generate in the local gates.
SC-1 | [#685](https://github.com/defaultdave/ramble/issues/685) | P07 | XS | src/server/coverPhotos.ts, src/server/cache/tagExperiences.ts | Loop still inline at coverPhotos.ts; call tagExperiences(ids.map(toLowerCase)); helper takes ids as given.
H-77 | [#383](https://github.com/defaultdave/ramble/issues/383) | P08 | S | `src/components/Skeleton/Skeleton.module.css`, `src/components/HomeStates/HomeStates.module.css` | `@keyframes pulse` now in four modules (also UpcomingSessions, BookingPanelSkeleton).
H-78 | [#572](https://github.com/defaultdave/ramble/issues/572) | P08 | S | `src/components/HomeStates/HomeStates.module.css`, `src/components/HomeModules/HomeHero.module.css` | `.band/.skeletonInner/.copy/.art/.pills/.cards` still copied; no `composes`.
N1030-20 | [#446](https://github.com/defaultdave/ramble/issues/446) | P08 | XS | src/components/HomeModules/HomeModules.module.css | .empty at :259 still unused by any HomeModules component (UpcomingSessions has its own); delete.
N1030-4 | [#430](https://github.com/defaultdave/ramble/issues/430) | P09 | S | src/lib/filters.ts, src/server/browse.ts | knownFilters leaves date untouched; any ISO date makes a cache entry. Clamp to upcomingWindow(browseWindowDays).
N1030-5 | [#431](https://github.com/defaultdave/ramble/issues/431) | P09 | XS | src/app/(guest)/new-york/browse/BrowseContent.tsx | Type narrowed to Pick incl. guests, but known.filters (with date) still passed, so key includes date. Pass picked fields.
N1030-6 | [#432](https://github.com/defaultdave/ramble/issues/432) | P09 | XS | src/server/db/browse.ts, src/lib/pages/browse.ts | .limit equals schema .max for both day-row caps; use .limit(max + 1) so the schema refuses.
BE-3 | [#353](https://github.com/defaultdave/ramble/issues/353) | P09 | XS | src/lib/cacheProfiles.ts, src/server/browse.ts | getBrowseResults keyed by minute asOf; browse profile revalidate 60/expire 600 never act. Match profile to key.
BE-9 | [#356](https://github.com/defaultdave/ramble/issues/356) | P09 | XS | src/lib/pages/browse.ts | resultsSummary(cards.length, hasMore) still says "Showing N"; zero cards with nextCursor yields "Showing 0 experiences".
N1030-21 | [#447](https://github.com/defaultdave/ramble/issues/447) | P09 | S | src/lib/experienceCards.ts, src/server/db/browse.ts | cardPriceLabel uses Math.min yet withPriceOptions sorts and attachPriceOptions orders; drop one. Query-shape sharing is bigger.
N1031-17 | [#471](https://github.com/defaultdave/ramble/issues/471) | P09 | XS | src/lib/filters.ts, src/components/HomeModules/HomeHero.tsx | guestOptions() still a function, chipState still exported for tests only; "Anywhere" label still needs Dave's copy nod.
N1029-10 | [#421](https://github.com/defaultdave/ramble/issues/421) | P10 | XS | src/lib/seed/plan.ts, src/lib/seed/types.ts | Leaves still indexed over all occurrences, then upcoming filtered; filter first or reword type comment.
N1029-11 | [#422](https://github.com/defaultdave/ramble/issues/422) | P10 | XS | src/lib/seed/validate.ts | maxOccurrenceIndex still 9; range is 57 dates so max index 8. Derive from sessionWeeksAhead, add test.
N1030-11 | [#437](https://github.com/defaultdave/ramble/issues/437) | P10 | XS | src/lib/seed/target.ts | host_not_confirmed message still prints SEED_HOST=<host>; drop the host from the hint.
N1030-19 | [#445](https://github.com/defaultdave/ramble/issues/445) | P10 | XS | src/server/env.ts, src/lib/seed/target.ts | loopbackHosts (env.ts:38) and localHosts (target.ts:44) still separate lists.
N1029-17 | [#426](https://github.com/defaultdave/ramble/issues/426) | P10 | S | src/lib/seed/coverage.ts, src/lib/photos.ts, src/lib/storage.ts | homeOrder, two 10 MiB literals, hard-coded refusal copy, slugify all unchanged. Copy part overlaps dictionary track.
N1030-23 | [#449](https://github.com/defaultdave/ramble/issues/449) | P10 | S | src/lib/seed/testPhotos.ts | Still 372 lines with renderer inside and minPhotos alias at :17-18; split to testPhotoImage.ts.
H-69 | [#381](https://github.com/defaultdave/ramble/issues/381) | P10 | S | `src/lib/seed/coverage.ts`, `tests/db/editorial.db.test.ts` | `guestHomeModules` still TS copy of `listHomeModules` rule; add db test comparing them.
N1029-5 | [#418](https://github.com/defaultdave/ramble/issues/418) | P10 | XS | src/server/db/seed/run.ts | seats_sold read outside tx, update by id only; add lt(seatsSold, planned) guard, count from returning().
N1031-13 | [#467](https://github.com/defaultdave/ramble/issues/467) | P11 | XS | src/server/formGuard.ts, src/server/ports/payments/fake.ts | formGuard.ts:31 and fake.ts:579 still call timingSafeEqual directly; use secureEqual.
N1031-14 | [#468](https://github.com/defaultdave/ramble/issues/468) | P11 | XS | src/server/hash.ts (new), src/server/device.ts, src/server/tokens.ts | Four createHash sha256 hex copies remain (device, tokens, rate-limit, fake.ts); add sha256Hex.
SC-17 | [#701](https://github.com/defaultdave/ramble/issues/701) | P12 | XS | src/components/CheckoutPage/CheckoutPage.module.css | .payment:focus and .state:focus set outline none on tabindex -1 containers; use :focus-visible ring like .title.
SC-18 | [#702](https://github.com/defaultdave/ramble/issues/702) | P12 | XS | src/components/BookingSheet/BookingSheetIsland.tsx, src/components/BookingChoices/focusBookingNotice.ts | Passes '[role="dialog"]'; scope to the sheet with a data attribute.
SC-24 | [#708](https://github.com/defaultdave/ramble/issues/708) | P12 | XS | src/components/BookingSheet/BookingSheet.stories.tsx | Story wraps bare DatePicker; the 320px calendar padding borrow lives in BookingChoices.module.css, not the story.
SC-9 | [#693](https://github.com/defaultdave/ramble/issues/693) | P13 | S | src/server/db/client.ts, src/app/api/pulse/route.ts | No idle_in_transaction_session_timeout, transaction_timeout or maxDuration anywhere in src. Set on the pool and the route.
SC-10 | [#694](https://github.com/defaultdave/ramble/issues/694) | P13 | S | src/server/pulse.ts, src/server/jobs/auditSchedule.ts | queueAuditExports only logger.error; add alerts.raise now. Skip and old-day alerts only make sense once store exists (SC-13).
SC-11 | [#695](https://github.com/defaultdave/ramble/issues/695) | P13 | XS | src/lib/jobs.ts, src/server/ports/storage/index.ts | isPermanentFailure checks 'permanent' in error; replace with a symbol marker StorageError sets.
BC-2 | [#308](https://github.com/defaultdave/ramble/issues/308) | P14 | S | src/server/db/migrations (new), tests/db/guests.db.test.ts | No guard trigger on consents; add BEFORE UPDATE/DELETE/TRUNCATE guard like 0016/0021, plus db test
H-59 | [#375](https://github.com/defaultdave/ramble/issues/375) | P15 | XS | `src/components/HomeModules/GiftGuideSection.tsx`, `src/components/HomeModules/HomeModules.module.css` | Gift action still hand-built `Link` with `.action`; swap to `ButtonLink variant=secondary`.
H-60 | [#376](https://github.com/defaultdave/ramble/issues/376) | P15 | S | `src/components/Badge/Badge.tsx`, `src/components/Card/Card.tsx`, `src/components/HomeModules/Eyebrow.tsx` | Card.module.css:172 and HomeModules.module.css:39 still say Badge has no highlight tone.
H-26 | [#368](https://github.com/defaultdave/ramble/issues/368) | P15 | XS | `src/lib/pages/home.ts`, `src/components/HomeModules/HomeModules.test.tsx` | Rail href still `hrefForFilters`; use existing `categoryPath` (routes.ts:66); landing page now real.
H-97 | [#394](https://github.com/defaultdave/ramble/issues/394) | P15 | XS | `src/components/HomeModules/HomeModules.test.tsx` | Test still checks 8 links and only Cooking href; no aria-current assertion.
N1031-16 | [#470](https://github.com/defaultdave/ramble/issues/470) | P15 | XS | src/lib/idLookup.ts, src/lib/pages/home.ts, src/lib/editorial.ts | picksCandidates (now 5) still defined in idLookup.ts and re-exposed in homeLimits; move beside editorialLimits.
H-104 | [#401](https://github.com/defaultdave/ramble/issues/401) | P15 | XS | `src/lib/idLookup.ts` | `idListSchema` still `z.unknown()` + pipe with the "checks every ID" comment.
H-105 | [#402](https://github.com/defaultdave/ramble/issues/402) | P15 | XS | `src/lib/idLookup.test.ts` | No `expect(cardLookupLimit).toBe(240)`; only derived-value checks.
H-79 | [#384](https://github.com/defaultdave/ramble/issues/384) | P16 | XS | `src/lib/pages/siteNav.ts`, `src/components/HomeStates/HomeSkeleton.tsx`, `src/app/(guest)/HomeContent.tsx` | Literal "Ramble" h1 in Skeleton, Empty, Title, HomeContent, SiteShell; no brand constant.
H-99 | [#396](https://github.com/defaultdave/ramble/issues/396) | P16 | S | `src/components/HomeStates/HomeStates.module.css`, `src/components/HomeStates/HomeEmpty.tsx` | `.page/.pageInner/.title` still repeat PageHeading's shell.
SC-3 | [#687](https://github.com/defaultdave/ramble/issues/687) | P16 | S | src/app/(guest)/new-york/_landing/LandingRoute.tsx, src/app/(guest)/new-york/browse/BrowseContent.tsx, src/app/(guest)/HomeContent.tsx | Three try/rethrowOrLog/error-view blocks; error views differ, so helper value is low. Could close as won't-fix.
SC-5 | [#689](https://github.com/defaultdave/ramble/issues/689) | P16 | XS | src/lib/pages/landing.ts, src/app/(guest)/new-york/_landing/LandingRoute.tsx | PageError still passes landingFallbackTitle; derive a name from kind and slug.
SC-16 | [#700](https://github.com/defaultdave/ramble/issues/700) | P16 | S | src/app/(guest)/HomeContent.tsx, src/app/(guest)/new-york/browse/BrowseContent.tsx, src/app/(guest)/new-york/_landing/LandingRoute.tsx | systemClock exists in server/ports/clock. Also still TODO in UpcomingSessionsContent, BookingContent, webhooks/email route.
H-89 | [#387](https://github.com/defaultdave/ramble/issues/387) | P17 | XS | `src/lib/errorDigest.ts`, `src/server/monitoring/rethrowOrLog.ts`, `src/server/cache/readOrRefuse.ts` | No `errorKind` exists; same ternary also in checkout.ts:72 and pulse/drain/heartbeat variants.
H-90 | [#388](https://github.com/defaultdave/ramble/issues/388) | P17 | XS | `src/server/cache/remote.ts` | `console.error` still interpolates `error.message`; log `errorKind` through logger.
N1031-4 | [#458](https://github.com/defaultdave/ramble/issues/458) | P17 | XS | src/server/cache/remote.ts | readRemoteOrFallback still logs error.message; log error.name only.
N1029-12 | [#423](https://github.com/defaultdave/ramble/issues/423) | P18 | S | src/lib/storage.ts, src/server/ports/storage/index.ts, src/server/ports/storage/vercel-blob.ts | superRefine, key-prefix tests and deadline math still in port/adapters; move to lib with tests.
N1029-13 | [#424](https://github.com/defaultdave/ramble/issues/424) | P18 | S | src/server/ports/storage/index.ts, src/server/ports/storage/config.ts, src/server/ports/email/config.ts | Three same error classes and duplicate required() still present; add coded-error base and requireEnv.
BE-11 | [#357](https://github.com/defaultdave/ramble/issues/357) | P19 | S | src/components/ExperienceGallery/ExperienceGallery.tsx, src/lib/pages/experience.ts | Photos 4+ rendered in strip (hidden by nth-child CSS) and again in the moreList; render from one source.
BE-17 | [#359](https://github.com/defaultdave/ramble/issues/359) | P19 | XS | src/components/ExperienceGallery/ExperienceGallery.tsx, src/components/ExperienceGallery/ExperienceGallery.module.css | Strip keeps tabIndex=0 and role=group unconditionally; overflow:visible from 768px leaves an empty tab stop.
BE-16 | [#358](https://github.com/defaultdave/ramble/issues/358) | P19 | XS | src/lib/pages/experience.ts, src/app/(guest)/experiences/[slugAndId]/page.tsx | fallbackTitle = 'Experience' still used for missing, draft, paused pages; give the 404 its own title.
BC-23 | [#328](https://github.com/defaultdave/ramble/issues/328) | P20 | XS | src/components/Footer/Footer.module.css | .link has block padding only, no min inline size, so short words stay under 44 px wide
BC-31 | [#335](https://github.com/defaultdave/ramble/issues/335) | P20 | S | src/components/UpcomingSessions/UpcomingSessions.tsx, UpcomingSessions.module.css | Skeleton always maxRows; .selected is sunken bg same as hover, no border; retry drops ?date=
H-87 | [#385](https://github.com/defaultdave/ramble/issues/385) | P20 | S | `src/components/Card/Card.module.css` | Unverified: `.price` is nowrap inside overflow-hidden card; needs a 320 px render to tell story vs component.
H-74 | [#568](https://github.com/defaultdave/ramble/issues/568) | P21 | S | `src/styles/base.css`, `src/components/GuestShell/GuestShell.module.css` | `body > main` still element rule in base.css; other layouts import base.css, check them first.
H-75 | [#569](https://github.com/defaultdave/ramble/issues/569) | P21 | S | `.storybook/preview.tsx` | Preview imports tokens and forced-colors only, not base.css; may shift story visuals.
N1101-4 | [#484](https://github.com/defaultdave/ramble/issues/484) | P21 | XS | src/app/fonts.ts, src/styles/base.css, e2e/font-swap.spec.ts | 'Fraunces Fallback' still typed in three places; add shared constant and base.css platform note.
SC-15 | [#699](https://github.com/defaultdave/ramble/issues/699) | P21 | XS | src/components/CheckoutPage/CheckoutFrame.module.css, src/components/GuestShell/GuestShell.module.css | .skip rules identical line for line; extract a SkipLink component.
SC-22 | [#706](https://github.com/defaultdave/ramble/issues/706) | P21 | S | src/app/(checkout)/error.tsx, src/components/SiteShell.tsx | By design: error file is a client module, cannot use GuestShell. Needs a styled client-safe frame with footer.
N1030-17 | [#443](https://github.com/defaultdave/ramble/issues/443) | P22 | S | src/lib/pages/siteNav.ts, src/components/GuestShell/GuestShell.tsx, src/components/CheckoutPage/CheckoutFrame.tsx | siteNav still in lib/pages, also used by CheckoutFrame; '© 2026' hard-coded. Year needs a clock arg (B12).
N1030-18 | [#444](https://github.com/defaultdave/ramble/issues/444) | P22 | S | src/lib/time.ts, src/lib/pages/browse.ts, src/components/FilterBar/FilterBar.tsx | FilterBar still imports dateChipLabel and db/browse.ts splitPage from lib/pages/browse; move to shared modules.
BC-21 | [#326](https://github.com/defaultdave/ramble/issues/326) | P23 | S | src/server/db/checkout.ts, src/lib/checkout.ts | startPayment never reads checkoutMaintenance; only CheckoutPage hides the form; add a refusal
H-38 | [#373](https://github.com/defaultdave/ramble/issues/373) | P24 | M | `src/server/db/home.ts`, `src/server/db/schema/catalog.ts`, new migration after 0021 | Still `.limit(thisWeekSessions)` then sold-out in code; no partial starts_at index (latest migration 0021).

## C: Sprint 2 tracks (46)

These are real but belong to a track in `drafts/sprint-2-production-ready.md`, where one builder works a whole directory at a time; fixing them one by one now would collide with that pass. They keep their tickets, get a `track:` label, and the track's PRs close them.

### tighten (21)

ID | Ticket | Size | Note
--- | --- | --- | ---
H-91 | [#389](https://github.com/defaultdave/ramble/issues/389) | XS | No rethrow case in that file (HomeContent.test has one at line 111).
H-93 | [#391](https://github.com/defaultdave/ramble/issues/391) | XS | Hand-built single-paragraph docs remain in 6 test files; RichText.tsx still checks `content.length === 0`.
H-94 | [#392](https://github.com/defaultdave/ramble/issues/392) | XS | No `paragraphs('')` case; tests only cover no args.
H-100 | [#397](https://github.com/defaultdave/ramble/issues/397) | S | Copy still inline in 4 PageError sites plus checkout and BrowseResults; "next error state" trigger has fired.
BE-5 | [#355](https://github.com/defaultdave/ramble/issues/355) | S | Cover half done. browseDays still throws RangeError on unknown zone; only writer (sessions.ts) already runs resolveHostZone, so latent.
BC-3 | [#309](https://github.com/defaultdave/ramble/issues/309) | S | Nine identical .visuallyHidden classes; one shared class via composes or global utility
BC-14 | [#319](https://github.com/defaultdave/ramble/issues/319) | S | requireMinor/requireInt twins remain; jobs.ts and sessions.ts keep own date windows beside isReadableInstant
BC-25 | [#329](https://github.com/defaultdave/ramble/issues/329) | S | MS_PER_HOUR and millisecondsPerHour still separate; jobs.ts, formGuard.ts inline ms math
BC-33 | [#337](https://github.com/defaultdave/ramble/issues/337) | M | readUpcomingSessions still does one getSpacesLeft per session (up to 60); add bulk read with per-session tags
BC-36 | [#340](https://github.com/defaultdave/ramble/issues/340) | XS | Array.from age range repeated in schema/orders.ts:57 and checkout.ts allowedChildAges; no shared helper
N1030-26 | [#452](https://github.com/defaultdave/ramble/issues/452) | S | aria-current still on <summary> (:121) and selected style keys off it; needs a data attribute for the styling.
N1031-5 | [#459](https://github.com/defaultdave/ramble/issues/459) | XS | Offset math still in the hook; style nit, move to holdTimer.ts with tests.
N1031-7 | [#461](https://github.com/defaultdave/ramble/issues/461) | S | Whole events array still serialized per call; persist eventCount. Conflicts with N1031-1 (needs last event kept).
N1031-8 | [#462](https://github.com/defaultdave/ramble/issues/462) | XS | Refund/Transfer status enums still re-typed; no refundStatuses/transferStatuses tuples exist.
N1031-20 | [#474](https://github.com/defaultdave/ramble/issues/474) | S | State divs still tabIndex=-1 with no role/name; HoldTimer status and danger alert still both announce. Needs screen reader.
N1031-21 | [#475](https://github.com/defaultdave/ramble/issues/475) | S | No live region or focus move on new sections; Continue still natively disabled with no reason text.
N1031-22 | [#476](https://github.com/defaultdave/ramble/issues/476) | S | Summary Alert still at form bottom with count only; focusFirstInvalid still on rAF. Needs screen reader.
N1031-23 | [#477](https://github.com/defaultdave/ramble/issues/477) | S | Warning/expired still colour-only, same icon and text, no forced-colors rule.
N1031-24 | [#478](https://github.com/defaultdave/ramble/issues/478) | XS | Load-failure branch still bare main/h1 with timer sentence and no layout CSS.
N1031-26 | [#480](https://github.com/defaultdave/ramble/issues/480) | S | Unverified (needs browser): 736px container query and select padding unchanged; do the width sweep.
N1101-3 | [#483](https://github.com/defaultdave/ramble/issues/483) | S | .body.body > * still present; RichText has no size prop.

### client-islands-review (14)

ID | Ticket | Size | Note
--- | --- | --- | ---
JS-2 | [#409](https://github.com/defaultdave/ramble/issues/409) | L | Dialog still react-aria Modal/ModalOverlay. Native dialog needs scroll lock, focus return, double-tap guard rework.
JS-3 | [#410](https://github.com/defaultdave/ramble/issues/410) | L | Sheet, bar and panel islands imported statically; Dialog and calendar not lazy on phones. High risk, desktop needs calendar.
JS-4 | [#411](https://github.com/defaultdave/ramble/issues/411) | M | Photo still renders next/image (client component); no getImageProps use anywhere.
JS-5 | [#412](https://github.com/defaultdave/ramble/issues/412) | S | Still uses Analytics, SpeedInsights components and next/script. Vercel route grouping risk.
JS-6 | [#413](https://github.com/defaultdave/ramble/issues/413) | S | TargetButton still imports next/form. ~1.5 KB; becomes full page load.
JS-7 | [#414](https://github.com/defaultdave/ramble/issues/414) | XS | Unverified (needs a build). global-error imports client Button which imports lucide; duplicate chunk plausible.
JS-8 | [#415](https://github.com/defaultdave/ramble/issues/415) | XS | Unverified (needs a build). No guest-tree import of checkout components, so leak would be bundler CSS merging; check .next css.
BC-56 | [#349](https://github.com/defaultdave/ramble/issues/349) | XS | No close on link click in SiteMenu
BC-57 | [#350](https://github.com/defaultdave/ramble/issues/350) | S | Three separate capture-phase pointerdown listeners remain
N1031-19 | [#473](https://github.com/defaultdave/ramble/issues/473) | S | Partial: not-found.tsx now uses GuestShell. error.tsx still SiteShell, deliberately (client module, CSP nonce); needs a client-safe frame.
N1101-1 | [#481](https://github.com/defaultdave/ramble/issues/481) | XS | WhenDetails now covered via the PR 303 hook sentence; FilterDrawerHost and LazyDatePicker are 'use client' but not named.
N1101-5 | [#485](https://github.com/defaultdave/ramble/issues/485) | M | close() still uses nested requestAnimationFrame, no unmount guard, no real-dialog browser test.
N1101-6 | [#486](https://github.com/defaultdave/ramble/issues/486) | XS | DrawerButton still uses openers?.open silently; drawerLoadFailedMessage() still a function.
SC-23 | [#707](https://github.com/defaultdave/ramble/issues/707) | M | router.push under cacheComponents keeps old page hidden, duplicate #main; likely app-wide, so unverified fix.

### test-audit (8)

ID | Ticket | Size | Note
--- | --- | --- | ---
BC-6 | [#312](https://github.com/defaultdave/ramble/issues/312) | XS | Per-suite schemas exist but no max_connections/worker cap set; unverified under load
BC-28 | [#332](https://github.com/defaultdave/ramble/issues/332) | S | run_after still DB default vs JS clock in claim; stamp runAfter from the clock port or compare in SQL
BC-55 | [#348](https://github.com/defaultdave/ramble/issues/348) | XS | e2e asserts heading and main for tokenless /orders and /gift, not banner or contentinfo
N1030-15 | [#441](https://github.com/defaultdave/ramble/issues/441) | M | id() still copied in about 20 files, driverError in 11; one shared helpers module.
N1030-16 | [#442](https://github.com/defaultdave/ramble/issues/442) | XS | Both still import pages/experience.fixtures; experienceCards.test.ts import already fixed. Move helpers with N1030-15.
N1030-24 | [#450](https://github.com/defaultdave/ramble/issues/450) | XS | No guestCovers test exists; only HomeContent reaches it. Add if the test audit keeps it.
N1031-18 | [#472](https://github.com/defaultdave/ramble/issues/472) | S | waitUntilBlocked still duplicated; uuid copy in fakeState.test.ts; browser mount boilerplate and class-substring selectors remain.
SC-19 | [#703](https://github.com/defaultdave/ramble/issues/703) | S | importsOf regex has no ^ or m flag; two other tests have their own file walkers beside listFiles.

### dictionary (2)

ID | Ticket | Size | Note
--- | --- | --- | ---
N1030-9 | [#435](https://github.com/defaultdave/ramble/issues/435) | S | Filtered/unfiltered empty copy still chosen in component; move to browseView. Copy belongs with dictionary track.
N1030-22 | [#448](https://github.com/defaultdave/ramble/issues/448) | S | Same sentence now in 7+ places (Home, Landing, experience page, UpcomingSessions, BrowseResults); default body in PageError.

### comment-cleanup (1)

ID | Ticket | Size | Note
--- | --- | --- | ---
N1031-15 | [#469](https://github.com/defaultdave/ramble/issues/469) | XS | All seven plain ticket-number comments still present (U-017, BC-20, U-109, U-114, U-049, U-014b).

## D: carried by a unit (20)

The audits README already says a `later` item is carried by the unit it names and gets no ticket. These were filed as `open` before the unit was known. Close each ticket as `later` with the unit, and add one comment line to the unit's issue so the builder sees it.

ID | Ticket | Unit | Note
--- | --- | --- | ---
H-7 | [#548](https://github.com/defaultdave/ramble/issues/548) | U-012 follow-up (write path) | `sessionLocalDate` coalesce still in SQL beside lib rule; carried by U-012 write path (store local_date).
BE-2 | [#352](https://github.com/defaultdave/ramble/issues/352) | U-021b | No servable-URL check in addPhoto or GuestPhotoSchema; storage.ts still allows fake in prod, TODO(U-021b) stands.
BE-4 | [#354](https://github.com/defaultdave/ramble/issues/354) | U-074b | addPhoto calls no updateTagsForChanges; no photo CacheChange kind exists. Latent, no caller until U-074b.
PF-7 | [#487](https://github.com/defaultdave/ramble/issues/487) | PF-7 island PR (approved 2026-11-01) | Partial fix landed (data-reveal-without-script, base.css). First load still cut to 5 cards; island not yet on allowlist. Home unfixed.
BC-5 | [#311](https://github.com/defaultdave/ramble/issues/311) | U-046 | confirmFakePayment has no limiter (secret is the capability); fake-only, Stripe confirms client-side
BC-11 | [#316](https://github.com/defaultdave/ramble/issues/316) | U-106 | providerPayment uses retrieved payment without a canceled check; latent, no cancelPayment caller until U-106
BC-12 | [#317](https://github.com/defaultdave/ramble/issues/317) | U-056 | Unique index covers cash events only; refundRequested/refundFailed/giftRedeemed have no callers yet
BC-13 | [#318](https://github.com/defaultdave/ramble/issues/318) | U-071 | Units unbuilt; add boundary statement to both scopes
BC-16 | [#321](https://github.com/defaultdave/ramble/issues/321) | U-068 | updateTagsForChanges post-commit; today's callers are all Server Actions; U-068 must keep it so
BC-17 | [#322](https://github.com/defaultdave/ramble/issues/322) | U-055 | confirmOrder runs under the events lock; cancel/refund paths (U-055, U-056) must take it first
BC-26 | [#330](https://github.com/defaultdave/ramble/issues/330) | U-109 | confirmDecision throws on terminal order; takeRefundPath is still the U-109 stub
BC-46 | [#343](https://github.com/defaultdave/ramble/issues/343) | U-046 | pollStep stops on any non-pending state; payment_failed maps to 'failed'; Stripe unbuilt
BC-52 | [#346](https://github.com/defaultdave/ramble/issues/346) | U-055 | Still a RoutePlaceholder: no referrer metadata, no overflow-wrap on the token
BC-53 | [#531](https://github.com/defaultdave/ramble/issues/531) | U-074a | Hosts upsert still sets notificationEmail from excluded; fill only when null once real hosts exist
N1029-4 | [#417](https://github.com/defaultdave/ramble/issues/417) | first ops editing unit | Seed still upserts experiences/prices; no ops edit path yet. Carried by first ops edit unit (unnamed).
N1031-11 | [#465](https://github.com/defaultdave/ramble/issues/465) | no unit: reopen when a second <select> consumer appears | SelectField still sole <select> in src; no Select component. Wait for second consumer.
SC-4 | [#688](https://github.com/defaultdave/ramble/issues/688) | U-092 | Behaviour is Next's, not our code. Crawler-view test sits in U-092 scope; U-091 is slug history.
SC-12 | [#696](https://github.com/defaultdave/ramble/issues/696) | audit-store adapter unit (new, with SC-13) | StoragePort has no read or head, so putOnce cannot compare. Needs a port method; do with the R2 adapter.
SC-20 | [#704](https://github.com/defaultdave/ramble/issues/704) | U-103 | Nothing warms pages. U-103 scope already says "warm published pages after promotion"; U-104 only reviews.
SC-21 | [#705](https://github.com/defaultdave/ramble/issues/705) | U-098 | R2 entry reads hourly dump as live; only the audit export is marked not switched on. Reword when U-098 lands.

## E: owner decisions (30)

Answer sheet with a recommendation per row: `drafts/owner-decisions-2026-11-02.md`. Ten of them need no decision, only your login or account (Neon console, seed rerun, a workflow push, standards-file edits); four are PM measurements that were waiting in the ticket queue and are now scheduled as PM actions.

## Also found

- The 113 duplicate tickets from the double filing (#488 to #607) were closed by the ticket session while this triage ran, and SC-1 to SC-27 filed; open audit issues now equal the 206 live rows.
- The 178 kept tickets carry their labels (`audit`, `lens: ...`); the dropped labels were on the duplicates.
- Several rows have grown since they were raised: H-62 has 13 `visuallyHidden` copies (was 7), `pulse` is in four modules, H-89's ternary is in checkout and pulse too, and H-26 shrank to one line now that `categoryPath` exists.
- Order of two fixes matters: N1031-7 (store only an event count) conflicts with N1031-1 (redelivery keeps the last event); N1031-1 ships first (P04), N1031-7 waits in the tighten track.
- Verifier doubts to settle in a browser before closing: SC-6 (the 20 px may be the Button inset by design), H-87 (320 px price wrap), N1031-26 (hero row widths), SC-23 (duplicate `main` after re-hold).

## Owner answers (2026-11-01 night)

Dave: all 30 rows as recommended. Effects on the buckets:

- Close as won't: H-15, H-92, H-103, H-107, N1031-6 (fix the comment first, in P09), SC-25.
- H-1 and H-39 close as duplicates of H-22; H-22 and H-34 stay open behind the PM's Neon measurement.
- Close as later, carried by a unit: H-16 (U-039 follow-up), BC-19 (U-105), BC-22 (U-051; the pill, desktop-only badge and full footer are recorded in `design-departures.md`), BC-32 (U-051; the stale TODO goes in P23), N1101-2 (dictionary track), SC-8 and SC-13 (audit-store adapter unit, which gates U-055's first production deploy).
- BC-40 closes as a duplicate of N1030-1.
- Two rows move to B: **P25 `limiter-idempotent`** (wave 2, S): BC-9, idempotent refreshes and confirmed orders stop spending `payment_tries`; **N1030-10** joins P10 `seed`: refuse a non-fake storage provider on a local target.
- N1030-2: manual `vercel deploy --prod` from a clean `origin/main` copy is the deploy policy; `drafts/production-deploy-policy.md` records it and the ticket closes.
- Still open on Dave's side, actions not decisions: H-11, BC-48, N1030-1, and the one standards-file edit (BC-15, N1030-7, N1030-8).
- PM actions: H-22, H-23, H-35, SC-7.
