# Nightly triage (2026-11-04), working draft

The 79 nightly tickets filed untriaged on 2026-11-04 (N1102-1 to 70, #735 to #804; N1103-1 to 9, #805 to #813), checked read-only against `origin/main` `d0203cc` by three Sonnet readers. Buckets as in `audits/maintenance-triage-2026-11-01.md`. Not applied: no ticket, label, board or audit-row write yet. Held for Dave's answer on the filing bar (lead, 2026-11-04).

## N1102-36 to 70

All 35 are live on `d0203cc`. N1102-36: the browse `48rem` copy moved into `page-shell.module.css`, so three places remain. N1102-58: `ignoreUntil` is already 2027-02-01; only the reason text is stale.

ID | Ticket | Bucket | Size | Files | Note
--- | --- | --- | --- | --- | ---
N1102-36 | #770 | B | XS | tokens.css, page-shell.module.css, LandingPage.module.css, ExperiencePage.module.css | Three literals; add `--size-prose-max`.
N1102-37 | #771 | B | S | BookingChoices.module.css, Dialog.module.css | Hand-matched negative margin; add `--sheet-inline-padding`.
N1102-38 | #772 | B | S | StickyAside.tsx, ExperiencePage.module.css, FilterBar.module.css, DatePicker.module.css | Literal 768px query; extends N1101-2.
N1102-39 | #773 | B | XS | lib/pages/browse.ts, landing.ts, lib/routes, TargetButton.tsx, BrowseResultsList.tsx | `FormTarget` in browse.ts; extends N1030-18 (P22).
N1102-40 | #774 | B | XS | BrowseResults.tsx, BrowseResults.module.css | Four repeated `noticeTitle` blocks; pairs with N1030-9.
N1102-41 | #775 | B | S | lib/text.ts, bookingDraft.ts, pages/browse.ts, checkoutFlow.ts, checkoutPage.ts, experience.ts, orderSummary.ts | Private `countLabel`, hand-rolled plurals.
N1102-42 | #776 | B | S | tests/support, six test files | Three pasted matchMedia stubs; test-audit track candidate.
N1102-43 | #777 | B | S | CheckoutPage.tsx, checkoutFlow.ts, CheckoutPage.test | Focus lost on refused re-hold; extends closed BC-30.
N1102-44 | #778 | B | S | LandingRoute.tsx, LandingPage.tsx, e2e/landing.spec.ts | No skip target on landing; related PF-7.
N1102-45 | #779 | B | XS | LazyDatePicker.tsx | `aria-busy` on the status node; unverified with a screen reader.
N1102-46 | #780 | B | S | useDismissableDetails.ts, WhenDetails.tsx | No focusout close; same gap in SiteMenu.
N1102-47 | #781 | B | S | ErrorNotice.tsx, PageHeading, Notices.test.tsx | No focus move or live region.
N1102-48 | #782 | E | - | FilterBar.module.css | Recommend: record the browser floor as a known limit; no code.
N1102-49 | #783 | B | XS | Card.tsx, Header.tsx (+ tests) | Default prefetch on Card and Header links.
N1102-50 | #784 | B | XS | src/app/icon.svg (new) | No favicon.
N1102-51 | #785 | E | - | src/app/fonts.ts | Recommend: keep full variable fonts; revisit at the perf pass.
N1102-52 | #786 | B | S | BrowseSkeleton.tsx, BrowseResults.module.css | Fixed six skeleton cards; cap at 3.
N1102-53 | #787 | B | M | checkout/[holdId]/page.tsx, renderPerRequest.tsx, page test | Not-found paths send an empty shell.
N1102-54 | #788 | B | M | CheckoutForm.tsx, CheckoutPage.tsx, CheckoutFrame.tsx, lib/checkout.ts, siteNav.ts | Zod and siteNav in the client closure; ship with 55.
N1102-55 | #789 | B | S | tests/checkout-client-modules.test.ts | Walk seeded only from error boundaries; with 54.
N1102-56 | #790 | B | XS | Footer.tsx, CheckoutFrame.tsx | Footer prefetch prop.
N1102-57 | #791 | E | - | botid-client.ts, next.config.ts, e2e config | Recommend: local `initBotId` skip now; seeded e2e db to test-audit track.
N1102-58 | #792 | B | XS | osv-scanner.toml | Reason text only.
N1102-59 | #793 | B | M | FilterBar.tsx, new island, FilterBar test | No-script chip groups throw in the segment swap. Highest-value row.
N1102-60 | #794 | B | S | BrowseContent.tsx, BrowseContent.test.tsx | Filter options share the results try; pairs with BE-5.
N1102-61 | #795 | B | XS | base.css, page-shell.module.css | `scripting: none` padding.
N1102-62 | #796 | B | S | FilterBar.module.css, Dialog.module.css, DatePicker.module.css | Popover under 360 px; after 37.
N1102-63 | #797 | B | S | RichText.tsx + css, LandingPage.tsx + css | Landing lede style; with N1101-3.
N1102-64 | #798 | B | XS | LandingPage.stories.tsx | Story props.
N1102-65 | #799 | E | - | LandingPage.tsx | Recommend: departure row now, breadcrumb in a U-035 follow-up.
N1102-66 | #800 | E | - | FilterBar.tsx | Recommend: scroll first selected chip into view (XS).
N1102-67 | #801 | B | XS | fakePaymentFlow.ts, test | Focus target null on form decline.
N1102-68 | #802 | E | - | CheckoutPage.module.css | Recommend: record single-column checkout as a departure.
N1102-69 | #803 | B | XS | Alert.module.css | Root draws no focus ring.
N1102-70 | #804 | B | XS | FakePaymentForm.tsx | Notice order; helps 67.

Shared files: 36/61, 36/63, 36/38, 37/62, 38/62 (styles); 44/63 (landing); 54/55/56, 43/54, 41/43 (checkout); 39/41 (`lib/pages/browse.ts`); 42/43, 42/59 (tests).

## N1103-1 to 9

ID | Ticket | Bucket | Size | Files | Note
--- | --- | --- | --- | --- | ---
N1103-1 | #805 | B | XS | src/server/device.ts | `sha256()` wrapper; follow-up to N1031-14.
N1103-2 | #806 | B | XS | BookingPanelSkeleton.module.css | Double `composes`; related H-77 (P08).
N1103-3 | #807 | B | S | Skeleton.module.css, HomeStates.module.css, pulse.module.css | Compose-only rules; overlaps H-77 (P08).
N1103-4 | #808 | B | XS | HomeStates.module.css | Fold into P08 (H-78).
N1103-5 | #809 | B | XS | lib/time.ts, sessionWindow.ts, pages/browse.ts | Local time consts.
N1103-6 | #810 | B | XS | BookingPanelIsland.tsx, BookingSheetIsland.tsx, focusBookingNotice.ts | Duplicates N1102-14; fold.
N1103-7 | #811 | D | XS | migrations | Next unit that adds a guard table.
N1103-8 | #812 | B | XS | seed/run.ts | `.limit(500)` without a constant.
N1103-9 | #813 | C | S | filters.ts, BrowseContent.tsx, filters.test.ts | Advisory; tighten track.

## Wave 4 re-check on `d0203cc`

- P19: BE-16 (#358) fixed by PR 820, close. BE-11 (#357) live; add `ExperienceGallery.module.css`. BE-17 (#359) live: PR 820 restored `tabIndex` for Storybook axe; Dave approved the island on 2026-11-04.
- P21 (H-74, H-75, N1101-4, SC-15, SC-22): all live, file lists right.
- P22: live. N1030-17 add `src/lib/pages/brand.ts` and `SiteMenu.tsx`; N1030-18 add `src/server/db/browse.ts`.
- P23 BC-21: live; files are `src/server/actions/checkout.ts`, `src/server/checkout.ts`, `src/server/db/checkout.ts` (not `src/lib/checkout.ts`).
- P24 H-38: live; the new migration is 0024 (latest is 0023).

## N1102-1 to 35

All 35 are live on `d0203cc`; none closes now.

ID | Ticket | Bucket | Size | Files | Note
--- | --- | --- | --- | --- | ---
N1102-1 | #735 | B | S | lib/fakePayment.ts (+test), server/fakePaymentDelivery.ts | B2: recall rule inline in the data layer.
N1102-2 | #736 | B | XS | server/db/editorial.ts | B7: add `TODO(U-036)`.
N1102-3 | #737 | E | XS | architecture.md (protected) | Recommend: Dave adds StickyAside to the allowlist.
N1102-4 | #738 | E | XS | architecture.md (protected) | Recommend: log the `useWhenDisclosure` approval.
N1102-5 | #739 | C | S | Dialog.tsx | client-islands-review; folds into JS-2.
N1102-6 | #740 | B | S | CheckoutForm.tsx, lib/pages/checkoutForm.ts | `setFieldValue` helper.
N1102-7 | #741 | B | XS | lib/pages/landing.ts, lib/cacheTags.ts | `landingTag` restates tags.
N1102-8 | #742 | B | S | lib/cacheTags.ts, three server callers | Lowercasing in callers.
N1102-9 | #743 | C | S | BrowseResults.tsx, landing.ts, browse.ts | dictionary; with N1030-9.
N1102-10 | #744 | E | XS | server/db/audit.ts | Recommend: one-line comment, no schema.
N1102-11 | #745 | D | XS | server/jobs/auditSchedule.ts | Carried by the SC-13 store.
N1102-12 | #746 | C | S | StickyAside.tsx, stickyPanel.ts | client-islands-review.
N1102-13 | #747 | B | XS | lib/datePicker.ts | Parity test and comment.
N1102-14 | #748 | B | S | Alert.tsx, focusBookingNotice.ts, two islands, CheckoutForm.tsx | Three notice-focus copies; N1103-6 folds in.
N1102-15 | #749 | B | S | datePickerLoader.ts, drawerLoader.ts, FilterDrawerHost.tsx, WhenDetails.tsx | Twin loaders.
N1102-16 | #750 | B | M | PageError, UpcomingSessions, BrowseResults, TargetButton, RetryAlert | Three retry-form shapes; collides with JS-6.
N1102-17 | #751 | B | XS | PageHeading.module.css | Dead rules.
N1102-18 | #752 | B | XS | lib/audit.ts | Duplicate regex.
N1102-19 | #753 | B | XS | lib/audit.ts, lib/storage.ts | Content type spelled twice.
N1102-20 | #754 | B | S | lib/jobs.ts and nine server files | Error-kind ternaries; extends H-89.
N1102-21 | #755 | B | S | audit.ts, scrubEvent.ts, sanitize.ts, log.ts | Four plain-object guards.
N1102-22 | #756 | B | S | lib/time.ts and five lib files | Nine day-parse copies.
N1102-23 | #757 | B | XS | auditExport.ts, auditSchedule.ts, storage config, fakePaymentDelivery.ts | Clock and type spelling.
N1102-24 | #758 | B | XS | filters.ts, landing.ts, home.ts | `filtersForCategory`.
N1102-25 | #759 | B | S | catalog.ts and seven files | `NamedSlug` type.
N1102-26 | #760 | B | XS | lib/photos.ts | Rebuilt URL regex.
N1102-27 | #761 | B | XS | lib/jobs.ts | Hand-written bounds.
N1102-28 | #762 | B | XS | cancellation.ts, experience.ts, test | Re-export.
N1102-29 | #763 | B | S | lib/storage.ts, storage port | String instead of the code union.
N1102-30 | #764 | E | XS | lib/pages/landing.ts | Recommend: won't until a third kind.
N1102-31 | #765 | C | S | tests/support, nine server tests | test-audit track.
N1102-32 | #766 | B | S | checkout error.tsx, CheckoutPage.tsx, [holdId]/page.tsx | `CheckoutShell`; closes N1031-24.
N1102-33 | #767 | E | XS | four error.tsx | Recommend: won't.
N1102-34 | #768 | B | XS | BrowseContent.tsx, LandingRoute.tsx | Fold into P16 (SC-3).
N1102-35 | #769 | E | S | CheckoutPage, FakePaymentForm, OrderStatusPoller css | Recommend: one focus-ring style, then a fix.

## Under the proposed filing bar

Of the 79, 11 meet "blocking rule, WCAG AA failure, budget breach, or real bug": N1102-1 and 2 (B2, B7), 43, 44, 45, 46, 47, 69 (accessibility), 53, 59, 67 (bugs). The other 68 are duplication, naming, styling or test nits, which the bar would put in a weekly digest instead of tickets. Buckets across all 79: B 60, C 5, D 2, E 12, A 0.
