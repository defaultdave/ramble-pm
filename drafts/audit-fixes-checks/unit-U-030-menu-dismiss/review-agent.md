PASS

## review-agent: U-030 "Menu dismiss" (head b07f2e3), round 2

### Blocking
None.

### Non-blocking
- Round 1 B17 resolved: the dismiss logic exists once (src/components/Disclosure/useDismissableDetails.ts, on the tested rule in src/lib/disclosureDismiss.ts); SiteMenu and WhenDetails both call it.
- WhenDetails behaviour unchanged (date-change close, focus memory, Escape not closing the drawer when the calendar is closed). Capture phase is safe; listener cleanup is correct.
- SiteMenu 'use client' and the shared hook follow the PM ruling in DECISIONS 2026-11-01; the allowlist edit is Dave's.
- Tests: 5 files, 77 pass.

### Unconfirmed
- Storybook plays not run by this reviewer (qa ran them).
