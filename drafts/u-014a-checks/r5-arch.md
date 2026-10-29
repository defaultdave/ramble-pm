PASS

## architecture-audit: U-014a round 5 (head 70e4f6c)

### Blocking
None.

- B17, one `Transaction`: declared once at `src/server/db/client.ts:70`; `locks.ts`, `settings.ts`, `time.ts`, `holds.ts` and the other data-layer files import it from `./client`.
- B17, shared helpers: `sha256HexDigits` defined once (`src/lib/rateLimits.ts:81`); `rateLimitKeyPattern` built from it; `src/lib/holds.ts` imports it for `deviceHashPattern`; only the migrations' SQL CHECKs spell the digest out.
- B4: `src/lib/holds.ts`, `device.ts`, `botChallenge.ts` import only lib and zod; nothing in the diff imports app or components from lib or server.
- B10: the `locks.ts` lock-order comment intact (device, session, hold, order, gift); `lockDevice`, `lockSessionRow`, `lockHoldRow` transaction-level.
- Migrations: `schema/index.ts` exports `./holds`, `./people`, `./jobs`; journal idx 10 `0010_guests_consents_privacy`, idx 11 `0011_holds`; `0011_snapshot.json` `prevId` `7a258933-a335-4195-937a-3fef18a89754`.
- `privacy.ts`: `holds.device_key`, `holds.ip_hash` identifiers with deletion paths naming U-014b and U-085; the other columns non-personal.
- B3, B5, B6, B8, B13: nothing new from the merges; round 3 stands.

### Advisory
- A4: `src/server/device.ts:26` private `sha256()` repeats the inline digest in `src/server/ports/rate-limit/index.ts:31`; a one-liner, pre-existing on one side; a shared helper could come with U-085.

### Unconfirmed
- The holds race test's intermittent failure: static check, no database run; no claim either way (qa-agent leads).
