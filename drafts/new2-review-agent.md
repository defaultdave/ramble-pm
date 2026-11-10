PASS

## review-agent: NEW-2 "Ops admin UI kit" (head 3f4dc00)

Round 4 delta review, dd65569..3f4dc00.

### Blocking
None.

### Non-blocking
- src/lib/orderReceipt.ts:45 spells a three-tone subset ('info' | 'warning' | 'danger') by hand. Pre-existing and a deliberate subset, not a duplicate of the four-tone list; audit item only, could become Extract<AlertTone, ...>.

### Unconfirmed
None.

### Checks
- src/lib/alertTone.ts is now the single tone list. A repo search found no other four-tone list: src/lib/statusBadge.ts StatusTone has a fifth value (neutral) and is a different concept.
- src/lib/flash.ts uses AlertToneSchema; flashSchema stays strictObject, so flash behaviour is unchanged. The 'info' ordering change in the enum has no effect.
- src/components/Alert/Alert.tsx: the import and `export type { AlertTone }` are type-only, so there is no runtime change. The public exports are unchanged: src/components/Alert/index.ts still re-exports AlertProps and AlertTone, and the old and new Alert.tsx export lists match.
- src/lib/alertTone.test.ts covers all four accepted tones and the refused cases (neutral, error, empty string, INFO) as it.each tables. No duplicate coverage.
- The flash.test.ts comment matches the existing serializeFlash refusal behaviour.
- tsc --noEmit is clean. vitest src/lib and src/components: 219 files, 5816 tests passed.
- Nothing is out of scope in the delta. The new code adds no unbounded work, logging, or fail-open path.
