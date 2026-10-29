PASS

## spec-compliance: U-047a round 3 (head 59fa24b)

Blocking: none. Diffs read, suites not run.
- Merge lost nothing: U-054's and U-016's migrations and snapshots identical to 50d84cc; against integration the head changes only U-047a's files, the journal and the three named fixtures.
- U-047a's files unchanged from eb30c2b apart from `0017_order_parent_foreign_keys.sql`, `meta/0017_snapshot.json`, `meta/_journal.json` and the fixtures; `db/checkout.ts`, `schema/orders.ts`, `privacy.ts` unchanged.
- 0017 identical to the old 0014 (R100): `orders_hold_id_holds_id_fk`, `orders_session_id_sessions_id_fk`, `orders_waiver_document_id_legal_documents_id_fk`, `orders_terms_document_id_legal_documents_id_fk`.
- 0017 `prevId` 45aafded (0016's id); only the four constraints added against 0016. Journal idx 14 to 17, 18 entries.
- Fixtures only change inserted ids (`insertHold`, `parents.sessionId`, `parents.termsDocumentId`, a `waiver-parents-<tag>` document); U-054's manage-link access test and U-016's ledger tests test what they did.
Unconfirmed: builder gates and a from-zero migration not verified here.
