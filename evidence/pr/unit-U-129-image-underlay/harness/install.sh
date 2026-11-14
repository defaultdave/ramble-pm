#!/bin/sh
# U-129 measurement harness. Usage: install.sh <ramble checkout> | install.sh <ramble checkout> remove
#
# Copies a no-database pair of routes into src/app/(measure)/ of a LOCAL checkout, never committed:
#   /measure          real ExperienceCardItem cards (vertical layout) over production's seeded Blob photos
#   /measure/exp/<n>  the real ExperiencePage, with its gallery fed the same photos
# The photos are production's public Blob URLs. Photos cannot display under the fake storage the
# local app has, and a local build allows a Blob host only when a token names the store; the build
# line in README.md gives it a placeholder token whose store id is the (public) host name, so
# nothing secret is read or needed. The routes sit in their own route group with their own root
# layout, so they never touch the database, auth or the guest shell.
set -eu
root="$1"
dest="$root/src/app/(measure)"
here="$(cd "$(dirname "$0")" && pwd)"
if [ "${2:-}" = "remove" ]; then
  rm -rf "$dest"
  exit 0
fi
mkdir -p "$dest"
cp -R "$here/app/." "$dest/"
cp "$here/prod-photos.json" "$dest/measure/prod-photos.json"
