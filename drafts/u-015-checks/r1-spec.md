FAIL

## spec-compliance: U-015 "Orders, attempts, events, refunds, transfers schema" (head 37bb8ea)

Coverage: all six tables with every column, row check and index design doc 4.2.3 names; migration 0011 carries the partial unique indexes; uuid-without-FK columns carry TODOs; `guest_id` FK; `manage_token_version`, `synthetic`, unique `manage_token_hash`; `tokens.ts`, the env entry, derivation and bump/resolve db tests present; nothing out of scope touched. Defects below reproduced by direct probes (local Postgres, the repo's zod and pg).

### Blocking
- `src/server/db/schema/shared.ts` `notBlank` (`~ '[^[:space:]]'`) vs `src/lib/text.ts` `notBlank` (`/\S/`): the database accepts text Zod refuses as blank. In Postgres (en_US.utf8) `' '` (U+00A0) and U+FEFF match `[^[:space:]]`; JS `/\S/` rejects both. So a lead guest name, contact phone, guardian name or contact of only U+00A0 or U+FEFF passes `orders_lead_guest_name_text`, `orders_contact_phone_text`, `orders_guardian_text`; the same reaches attribution fields, `order_items.label`, `provider_payment_id`, `provider_event_id`, `object_id`, `last_error`, `provider_refund_id`, `provider_transfer_id`. The db tests use only ASCII blanks. Fix: one character class for the Zod test and the CHECK; refusal tests for U+00A0 and U+FEFF on one orders column and one provider id; `shared.ts` also feeds the editorial tables.
- `ProviderEventPayloadSchema` (16 KB by `JSON.stringify`) vs CHECK `provider_events_payload_object` (32 KB of the stored jsonb text): a 13,891-byte payload of 1000 keys with value `1e-300` passes Zod but is stored as 311,890 bytes and refused, as a raw SQLSTATE 23514 whose message carries the bound payload (logs). Fix: measure the stored form in Zod (or bound numeric literals) so Zod refuses first; a test for that case.
- `src/lib/text.ts` `isStorableJson` (`pending.push(...current)`) runs before the 16 KB refinement (Zod runs every refinement): `ProviderEventPayloadSchema.safeParse({ data: new Array(130000).fill(1) })` throws `RangeError: Maximum call stack size exceeded` instead of refusing. Fix: push children in a loop; check the size before walking.

### Non-blocking
- `orders.contact_email` is `text` with a lowercase CHECK where 4.2.3 says `citext` (matches `guests.email`); PM to accept or change.
- `src/lib/rules.ts` `addRuleIssues` repeats the loop at `src/lib/catalog.ts:235-241`; migrate it or log.
- `src/lib/transitions.ts` `isTerminal` has no caller.
- `rehashTokens` cap exists; batching and cap untested.
- `bumpTokenVersion(tx, kind, id)` and `resolveToken(kind, token, reference?)` differ from the spec's two-argument forms, needed by the design.
- `orders_money_in_range` has no db test naming it (backstop).

### Unconfirmed
- A new attempt only after the previous is canceled, and attempt `amount_minor` = order `amount_due_minor` at creation: cross-row rules not enforced here; confirm U-047a owns them.
