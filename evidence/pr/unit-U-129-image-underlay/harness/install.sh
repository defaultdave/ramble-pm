#!/bin/sh
# U-129 measurement harness. Usage: install.sh <ramble checkout> | install.sh <ramble checkout> remove
#
# Copies a no-database pair of routes into src/app/(measure)/ of a LOCAL checkout, plus the photos into
# public/measure/. Nothing here is committed to ramble.
#   /measure          real ExperienceCardItem cards (vertical layout) over production's seeded photos
#   /measure/exp/<n>  the real ExperiencePage, with its gallery fed the same photos
# The photos are production's seeded source files (fetch-photos.py, public Blob objects). They are served
# from public/measure/, so next/image optimises them from disk at the app's own widths and quality: no
# remote host, no token and no deploy is involved, and nothing needs a secret. (Photos cannot display
# under the fake storage, and Next's optimiser resolves a remote host's DNS itself, which a sandboxed
# agent cannot do.) The routes sit in their own route group with their own root layout, so they never
# touch the database, auth or the guest shell.
set -eu
root="$1"
here="$(cd "$(dirname "$0")" && pwd)"
if [ "${2:-}" = "remove" ]; then
  rm -rf "$root/src/app/(measure)" "$root/public/measure"
  exit 0
fi
mkdir -p "$root/src/app/(measure)" "$root/public/measure"
cp -R "$here/app/." "$root/src/app/(measure)/"
cp "$here/prod-photos.json" "$root/src/app/(measure)/measure/prod-photos.json"
cp "$here/photos/"*.jpg "$root/public/measure/"
