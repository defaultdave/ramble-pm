#!/bin/sh
# Usage: build-variant.sh <ramble checkout> <after|before> <out dir>
# Builds the checkout with the harness installed and leaves the result in <out dir>/.next.
# "before" first puts the Photo and ExperienceGallery files back to origin/main's, builds, then restores HEAD's.
set -eu
root="$1"; variant="$2"; out="$3"
here="$(cd "$(dirname "$0")" && pwd)"
sh "$here/install.sh" "$root"
cd "$root"
placeholder=postgres://placeholder:placeholder@127.0.0.1:1/placeholder
if [ "$variant" = before ]; then
  git checkout origin/main -- src/components/Photo src/components/ExperienceGallery
  mv src/components/Photo/PhotoWithUnderlay.tsx "$out/PhotoWithUnderlay.tsx.held"
fi
status=0
DATABASE_URL=$placeholder DATABASE_URL_UNPOOLED=$placeholder pnpm build > "$out/build-$variant.log" 2>&1 || status=$?
if [ "$variant" = before ]; then
  mv "$out/PhotoWithUnderlay.tsx.held" src/components/Photo/PhotoWithUnderlay.tsx
  git checkout HEAD -- src/components
fi
[ "$status" -eq 0 ] || { echo "build failed, see $out/build-$variant.log"; exit 1; }
rm -rf "$out/next-$variant"
cp -R .next "$out/next-$variant"
echo "built $variant"
