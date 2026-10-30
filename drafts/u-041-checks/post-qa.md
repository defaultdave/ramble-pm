PASS

## qa-agent: U-041 "Booking bar, sheet, and panel" (head ddb7c43)

Seeded production build of `ddb7c43`, own database, throwaway secrets, one `next start` process, Playwright scripts.

### Blocking
None. (a), (b) and (c) pass; (d) reached `/orders/<ref>` but the order did not confirm, for a reason outside this unit.

### (a) Panel refusal at 1280: pass
- S5: with `?date=2026-11-03` sold out in the database, Continue in the panel shows "Those spaces just sold out" inline with three alternative dates; no `role=dialog`, nothing `inert`, Tab moves on into the notice's links; focus on the notice (`role=alert`, `tabindex=-1`); the refusal appears once (twice in round 1).
- S4: after 6 seats held from the panel, Continue for another session shows the device-limit notice inline, no dialog, focus on the notice, choices kept.

### (b) 390 refusal from the bar or sheet: pass
- A bar refusal opens the sheet with the notice; Escape returns focus to "Choose date". A plain open and Escape also returns to "Choose date". No sideways scroll in any state checked.

### (c) Calendar month: pass
- `?date=2026-12-05` opens the sheet on December with the 5th selected; `?date=2026-11-08` on November; nothing chosen opens on the first offered month.

### Non-blocking
- After a refusal inside the sheet, focus drops to BODY (the sheet's Continue becomes disabled once the choices clear); the first Escape does nothing; after one Tab, Escape closes and focus returns to "Choose date". Not compared with `e2619c6`. Audit item.
- (d) Panel, Nov 7, 3 guests, the real `/checkout/<holdId>`, details and terms, "Pay $105.00" with 4242 4242 4242 4242, then `/orders/RMB-K8ZGJ0` showing "Checking your payment" indefinitely; `payment_attempts.status='created'`, `orders.status='pending_payment'`; `/api/pulse` drained 0 jobs. Nothing in the running app delivers the fake payment's event to the webhook intake (audit item BC-38; outside U-041).
- The `/orders` header and footer render unstyled (BC-1, outside U-041).
- Not driven: 320, 768, dark mode, Figma comparison.

Evidence (`evidence/pr/unit-U-041-qa-agent/`):
- `r2-a-panel-before-1280.png`, `r2-a-s5-panel-refusal-1280.png`, `r2-a-s4-panel-refusal-1280.png`: panel refusals inline, no sheet.
- `r2-b-bar-refusal-sheet-390.png`, `r2-b-bar-refusal-after-escape-390.png`, `r2-b-sheet-refusal-390.png`, `r2-b-sheet-refusal-tab-escape-390.png`: phone refusals and focus.
- `r2-c-sheet-opens-on-chosen-december-390.png`, `r2-c-sheet-opens-on-first-offered-390.png`: the calendar month.
- `r2-d-1-panel-chosen-1280.png` to `r2-d-6-order-confirmation-1280.png`: the full booking to the pending order page.

![Panel refusal inline, no sheet](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041-qa-agent/r2-a-s5-panel-refusal-1280.png)
![Bar refusal opens the sheet](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041-qa-agent/r2-b-bar-refusal-sheet-390.png)
![Calendar on the chosen month](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041-qa-agent/r2-c-sheet-opens-on-chosen-december-390.png)

Round 1 (FAIL, the desktop sheet): `r1-qa.md`.
