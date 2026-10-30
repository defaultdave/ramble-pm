PASS

## review: U-050 "Confirmation page" (head 43f4d0b)

### Blocking
None. The round 1 blocking item is fixed: `mapsHref` and its helpers live in `src/lib/maps.ts` (byte-identical to the old copy, so the experience page's Maps link behaves as before; 84 test lines moved to `maps.test.ts`); `orderReceipt.ts` calls `mapsHref(source.meetingPoint)`, so the receipt searches the first sentence plus the venue city; `mapsSearchUrl` is gone.

### Non-blocking
Round 1's non-blocking items are fixed: stale TODOs (`TODO(U-050)` gone, demo TODOs say `TODO(U-041)`); `isDemoOrder`, `orderStatusResult`, `settledMessage` in `src/lib` with tests, no new B2 outside `src/lib`; focus moves to the status region after "Check again" (tested), the settled message shows in the `role="status"` region during `router.refresh()` (tested); a rejected `check` goes through `pollStep('error')`; the poll comment matches the 171 s. The unknown-reference versus wrong-token timing difference is unchanged and not exploitable.

### Unconfirmed
- Gates not rerun by the reviewer (the fixer's and the PM's runs stand). All 20 files are inside round 2's list.

---

PASS

## a11y-audit: U-050 "Confirmation page" (head 43f4d0b)

### Blocking
None. The round 1 blocker is closed: "Check again" calls `region.current?.focus()` on the always-mounted `role="status"` wrapper (`tabIndex={-1}`), so focus is on the region before the button unmounts (test added). The `:focus-visible` ring is 2 px sky-700 on ink-50 at 5.92:1 (light) and sky-300 on ink-900 at 9.15:1 (dark), above the 3:1 minimum. The settled message is written into the existing live region before `router.refresh()`.

---
Round 1: `drafts/u-050-checks/r1-review.md`, `r1-a11y.md` in ramble-pm.
