PASS

## spec-compliance: U-030 "menu dismiss" (head b07f2e3), round 2

All 8 criteria PASS: Escape closes; focus returns to Menu; outside press closes; JS off intact; 44px and focus ring unchanged (no CSS in the diff); logic in dismissAction with a unit test; three Storybook plays; one shared hook for SiteMenu and WhenDetails (the round 1 blocker).

### Blocking
- None.

### Non-blocking
- src/lib/disclosureDismiss.* and the GuestShell test and story edits sit outside the widened manifest's named paths; they are the unit's own files (confirmed).
