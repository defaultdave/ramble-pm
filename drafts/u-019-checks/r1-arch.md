PASS

## architecture-audit: U-019 "Guests, consents, and privacy" (head 2eba439)

### Blocking
None.

B2 in the data layer, all of it: the email rule is `GuestEmailSchema`; `findOrCreateGuest` is `INSERT ... ON CONFLICT (email) DO UPDATE SET email = <same>` with no conditional `WHERE`; `guestAcceptsWrites`, `consentDecision`, `privacyRequestDecision`, `consentKindsToWithdraw`, `anonymizeDecision`, `anonymizedEmail` are lib functions with tests; the reads use exempt `WHERE`, `ORDER BY`, `LIMIT`, `DISTINCT ON`.

B6: `recordPrivacyRequest` and `anonymizeGuest` call `requireStaff`; `findOrCreateGuest` and `recordConsent` take no caller per the PM ruling, and no route, action or page calls them. B7: TODO(U-047a) and TODO(U-085) first-caller markers name real units. B17: email helpers, `isReadableDate`, `requireStaff`, `Transaction`, `EntityIdSchema` reused; `WriteIdSchema` and the race helper moved, one copy each. B1, B3, B4, B5, B9, B12, B13 satisfied; B8, B10, B11, B14, B15, B16 not applicable.

### Non-blocking
- "Latest consent per kind" is chosen two ways (`DISTINCT ON` in `anonymize.ts`, `ORDER BY ... LIMIT 1` in `recordConsent`); a shared query if a third reader appears.
