FAIL

## architecture-audit: U-054 "Booking emails" (head 769c79b)

### Blocking
- B7, `src/server/jobs/bookingEmails.ts` `export class BookingEmailError`: a non-type export whose only outside importer is `tests/db/bookingEmails.db.test.ts:487`, with no first-caller TODO. Fix: assert on the thrown message, or move the class to `src/lib/` if it is a real contract.
- B7, same file `export function liveManageToken`: no importer anywhere; used only inside the file. Fix: drop the export.

### Checked and clean
- B2: templates render only; copy from `src/lib/email/bookingBody.ts` and `src/lib/bookingEmails.ts`; `confirmationDecision` and the data builders in lib; the data layer only reads. (`liveManageToken`'s null check and hash compare stay in the server layer: a security guard needing tokens and `secureEqual`.)
- B3: `server-only` in the db, job, render and template files; no new `process.env` (uses `env.APP_URL`).
- B4: lib imports only lib and zod; server imports lib and server.
- B11: attachment changes in the shared `message.ts` and both adapters; contract test extended.
- B17: `zonedLabels.ts`, `ics.ts`, `oneLineClipped` duplicate nothing; `managePath` in `routes.ts`; `EmailParts.tsx` beside `EmailLayout` reusing `emailColors`; existing money and label helpers reused.

### Advisory
- `maxMoneyLines = 4` in `src/lib/email/bookingTemplates.ts` repeats the unexported `MAX_LINES = 4` in `src/lib/orderSummary.ts`; export one and share it.
- `EmailParts.tsx` inline styles are email-client necessity (as `EmailLayout`); B16-exempt.
