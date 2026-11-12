PASS (gaps named: no browser, no real multipart post through Next, no signed-in rendering, no DB run, 11 MiB body limit not exercised in a running app, page-level notice wiring untested)

# QA, U-074b part 2 (ops photo upload)
Head c27211aed4bbb448727444ea9e00208a2654690c, branch unit/U-074b-photos. Code-and-test QA only; no code modified.

Ran `bunx vitest run --project unit --project components`: 436 files, 9820 tests, all passed. (The one logged "Runtime cache read failed" line is expected test noise.)

## Flow trace (page -> action -> lib -> data)
| Flow | Trace | Test cover |
|---|---|---|
| Empty state | `readExperienceForOps` carries `galleryWith`; `ExperiencePhotos` shows "This experience has no photos yet." and "0 of N" | component test "says when there are none"; DB test "empty gallery" |
| Valid photo with alt text | form -> `parsePhotoForm` ready -> `addPhoto` (bytes, storage port) -> audit row -> `photo_added` notice | action test "adds the photo as the ops caller..."; DB audit tests |
| Refused file shows ingest reason on file field | `PhotoRefusedError` -> `photo_<code>` notice + `fields=photoFile`; page `photoRefusalOf` -> `photoProblemTexts(refusal)` replaces file sentence | action test per refusal code (it.each); photoForm round-trip test; component test "shows why the file was refused" |
| Missing alt without decorative | `description` issue maps to `altText`; redirect `photo_invalid&fields=...altText` | photoForm it.each (blank alt, no alt); action test; component aria-invalid test |
| Oversized file / text | file > limit -> `photo_too_large` on photoFile without `arrayBuffer()` read; text over `maxUrlLength` -> field named; fields named before size judged | photoForm "refuses by size", "names the fields before it judges the size"; action test with 11 MiB File |
| Licensed needs holder, licence, source | rights schema issues map to rightsHolder/rightsLicense/rightsSourceUrl; other bases ignore them | photoForm licensed cases and "ignores a licence and source on a basis that needs neither" |
| Photo limit | action catches `PhotoLimitError` -> `photo_limit`; `addPhoto` checks before decode and again in the transaction | action test "limit notice"; notice copy test |
| Unknown experience | `ExperienceNotFoundError` -> list; page `notFound()` for unknown id | action test "sends a missing experience to the list"; DB test (no tag published) |
| Non-ops redirected first | `opsCallerOrLeave` runs before id/form parsing | action it.each admin and nobody: redirect to list, `addPhoto` not called |
| Notices render | page maps `photoNotices` after experience notices via `ActionNotice` | copy tests in photoForm.test and stories; page itself has no test |
| Gallery alt / "Decorative" | `photoAltSummary` -> "Alt text: X" / "Decorative, no alt text." | component test and photoForm it.each |
| Keyboard / labels | Plain `<form>` with real labelled `Input`/`Select`/`CheckField`, native file input with accept, `noValidate` with server error sentences via `errorProps`, aria-invalid asserted | component tests use getByLabelText for every field, one submit button |

## Findings (none blocking)
1. Minor, untested: the page-level wiring (notice precedence `experienceNotices ?? photoNotices`, `photoRefusalOf`, `parseProblemFields`) has no test; only the pieces do. Covered only by stories.
2. Minor: `serverActionBodyLimit` is exactly 11 MiB. A 10 MiB file plus fields fits, and the action test models an 11 MiB file by faking `size`, so the real framework cutoff (a file near 11 MiB would be rejected by Next before the action's friendly `photo_too_large` notice) is unverified.
3. Minor, UX: the alt text field is marked `optional` even though it is required unless the decorative box is ticked; the hint does not say so until the error shows. Not a defect in logic.
4. `addPhoto` refuses a caller with a null userId (audit needs a user); covered by a DB test, not run here.

## Gaps I could not exercise
- Real browser rendering, keyboard tab order, focus and screen-reader behaviour.
- A real multipart post through Next (file serialisation, the Server Action body limit, redirect with query).
- Signed-in ops rendering of the page and the `ActionNotice` output.
- The DB tests (`tests/db/experience-photos.db.test.ts`, audit rows, transaction, cache tag) were read, not run.
- Real image ingest/storage (mocked in the action tests).
