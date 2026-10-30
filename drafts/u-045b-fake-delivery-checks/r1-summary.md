# Round 1 at a5d41b0: all four FAIL (2026-10-30)

- **qa-agent:** forged webhook 500 not 400 after a Pay (gateway on globalThis, `PaymentsError` from another bundle); decline then success shows "didn't go through" until a reload. Passed: full booking at 390 and 1280, restart between Continue and Pay, 3-D Secure, double tap one event, no Sentry on checkout, 429 surfaces, no secrets in logs, migration on an empty database, both mutations caught. Evidence in `evidence/pr/unit-U-045b-fake-delivery-qa-agent/`.
- **review:** `apple_pay` and `google_pay` assertion lost in the action test rewrite (mutation survived). Unconfirmed: clock skew on the single drain (taken as a fix).
- **spec-compliance:** `z.object` strips unknown keys, so a bad row is repaired on the next write.
- **architecture-audit:** two B2 (size caps in `fakeState.ts`, missing-row rule in `fakeGateway.ts`), B13 (drain catch), B17 (`signatureHeader` copied).

Round 2 sent to the builder with all of these plus five non-blocking items.
