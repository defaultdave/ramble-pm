PASS

## spec-compliance: U-047b "Checkout page" (head c76e047)

Static check. All 12 scope-line clauses PASS: contact (`CheckoutPage.tsx:~255-290`); unticked opt-in (`src/lib/pages/checkoutForm.ts:28`, `CheckoutPage.test.tsx:117-124`); age and guardian fields from `ageRule.requirements` (`checkoutPage.ts:50-73`, rendered `:~298-358`); waiver and terms (`:362-392`, `readCheckoutView` throws on missing required waiver or no terms); validation display (per-field messages, "Check your details" summary, focus on first error, browser runs the server schema first); hold timer (`HoldTimer` in the island header, `useHoldCountdown`, database clock, S6 and `reholdSpaces`); order summary (`:204-217`); express pay area (wallets above the card form in `FakePaymentForm.tsx:183-200`, the ruled two-tap flow); card island wired to the fake gateway (`startPayment` only from submit `:130`, five-mounts test `CheckoutPage.test.tsx:107`); demo no-payment notice (`FakePaymentForm.tsx:167-171`, `CheckoutPage.tsx:421`); maintenance (`[holdId]/page.tsx:46-76`, `CheckoutPage.tsx:222-227`, test `:347`); success to `/orders/<ref>?t=<token>` (`routes.ts:94-102`, `CheckoutPage.test.tsx:193`).
S6, S7, S9 implemented; ADR 0007 test exemption of `src/server/env.ts` left to review; scope bounds kept.
Blocking: none.
Non-blocking: `src/server/db/migrations/0014_order_parent_foreign_keys.sql` (4 lines) is added by the diff and is not U-047b's (PM: a stale copy of U-047a's migration, which is `0017` on integration; being removed).
Unconfirmed: evidence, Figma, runtime behaviour left to QA.
