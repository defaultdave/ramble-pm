# Audit pass: Prototype browse and experience page (2026-10-28)

**Scope:** browse (`src/app/(guest)/new-york/browse/`, `BrowseResults/`, `BrowseSkeleton/`, `src/server/browse.ts`, `src/server/actions/browse.ts`, `src/server/db/browse.ts`, `src/lib/browse.ts`), the experience page (`src/app/(guest)/experiences/[slugAndId]/`, `ExperiencePage/`, `ExperienceGallery/`, `BookingPanel/`, `src/server/experiencePage.ts`, `src/lib/experiencePage.ts`), and card photos (`src/lib/photos.ts`, `src/lib/storage.ts`, `src/server/coverPhotos.ts`, `src/server/photos/`, `src/server/db/photos.ts`, `src/server/ports/storage/`, migration `0008_photos`). Helpers shared with home are the home pass's (H-2); this pass adds only what it finds new.
**Status:** running since 2026-10-28 on `main` at `5121048` (after PR 220), beside the home pass (DECISIONS 2026-10-28, "work beside the deep review"). Findings only.
**Figma:** 02 Browse 45:190, 02b Browse filters open 45:413, D02 Browse 64:200, 03 Experience 46:678, 03b Guide-only page 46:897, D03 Experience 65:358, S1 Loading 53:7, S2 Zero results 53:117, S3 Error with retry 53:249, S5 Sold out before the hold 54:287 (file `tGNKJSWGHyx4UVmpnd5LUp`).
**Evidence:** `evidence/audit-browse-experience-2026-10-28/`.

## Items raised before the pass

Carried from the home pass file, where they were logged while the experience page was built. They keep their home-pass IDs.

| ID | Item | Lens | From | Status |
|---|---|---|---|---|
| H-15 | A well-formed address for a missing experience shows the not-found page with `noindex` but answers 200. | Code | U-039 builder | open (this pass) |
| H-16 | The S1 loading skeleton is not built, and the "Ramble pick" and "Step-free" badges and a host photo need data the page does not read. | Visual | U-039 builder | open (this pass) |
| H-17 | Image LCP cannot be measured until real photos exist (fake storage provider in production; U-021b brings the photo pool). | Performance | U-039 builder | later: re-measure when U-021b lands |

## Findings from the pass

Added when the pass reports. IDs `BE-1` onward.
