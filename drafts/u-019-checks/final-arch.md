PASS

## architecture-audit: U-019 "Guests, consents, and privacy" (head 42831b8)

### Blocking
None. The round 2 delta is its two items; the merge added no layer or import changes.

### B2 (all placed correctly)
Every decision is a tested lib function in `src/lib/guests.ts` or `src/lib/privacy.ts` (`guestAcceptsWrites`, `consentDecision`, `privacyRequestDecision`, `consentKindsToWithdraw`, `anonymizeDecision`, `anonymizedEmail`, `isAnonymizedEmail`, `consentSourceAllowsStatus`); email validation is `GuestEmailSchema`; `findOrCreateGuest` is one unconditional upsert; reads use exempt `WHERE`, `ORDER BY`, `LIMIT`, `DISTINCT ON`; `anonymizeGuest` and `recordPrivacyRequest` branch through lib decisions.

### B17 candidates (none block)
`WriteIdSchema` moved, one copy; `EntityIdSchema`, `isReadableDate`, `requireStaff`, `Transaction`, `EmailAddressSchema` reused. "Latest consent per kind" read two ways (non-blocking, from round 1). A local `snake()` helper in `tests/pii-inventory.test.ts` (non-blocking).

### B7 candidates (none block)
The four data functions carry TODO(U-047a) or TODO(U-085) first-caller markers. `piiVendors` and `retentionSchedule` are imported only by their test and carry no TODO; they are plan-required inventories, and a first-caller TODO would apply the rule strictly.

### Other rules
B6: `recordPrivacyRequest` and `anonymizeGuest` call `requireStaff`; `findOrCreateGuest` and `recordConsent` take no caller per the PM ruling, outside the written B6 exemptions (worth recording in the standards). B3, B1, B4, B5, B9, B12, B13 hold; B8, B10, B11, B14, B15, B16 not applicable.
