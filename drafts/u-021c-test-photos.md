# U-021c: Test photo set on Blob (draft, 2026-10-29)

Standard tier. Builder: `/senior`, Sonnet, medium. Needs Dave's store and token before the live run, not before the build.

## Why
Test thumbnails and large images, and preloading of each, across offerings, served from the Vercel CDN. The seed has no photos today; the fake store has no displayable addresses.

## SCOPE MANIFEST
IN SCOPE:
- A generator (script or `src/lib/seed` module with a unit test) that makes license-free images: a labelled gradient or pattern per experience and position, no third-party art. Mixed source sizes per experience: one small (about 640 px), one medium (about 1600 px), one at the 2,400 px ceiling; 3 to 5 photos each; position 0 is the cover. Alt text on every photo.
- A seed step that sends each image through the existing ingest and storage port and writes the `photos` rows, idempotent on rerun, refusing production unless the existing demo opt-in is set.
- Runs against the fake provider (tests, local) and `vercel-blob` (live); a coverage check that every seeded experience has a cover and at least three photos.
- Runbook lines in `docs/runbooks/` and `.env.example` for creating the public store and running the step.
- Evidence: before-and-after PNGs of home, browse and an experience page, plus the Network panel's image sizes at 390 and 1280 px, in `evidence/pr/<branch>/` in `ramble-pm`.
OUT OF SCOPE: the licensed photo pool and copy (U-021b), host upload (U-074b), changes to ingest limits, `imageConfigFor`, card or gallery components, `next.config.ts`, the production guard, any change to Dave's Vercel or GitHub settings.
REFERENCE CODE: `src/lib/photos.ts`, `src/lib/storage.ts`, `src/lib/images.ts`, `src/lib/coverPhotos.ts`, `src/lib/seed/`, `scripts/seed.ts`.

## Done when
Gates pass; builder reports a Reuse section; with a public store configured, the seed fills every experience and the pages load photos from `*.public.blob.vercel-storage.com/public/photos/` through `/_next/image` at the widths in `imageConfigFor`.

## Dave, before the live run
1. `vercel blob create-store ramble-photos --access public`
2. Set `STORAGE_PROVIDER=vercel-blob` and `BLOB_PUBLIC_READ_WRITE_TOKEN` in the target Vercel environment, and redeploy (the store id is read at build).
