#!/usr/bin/env bash
# Ingest one master video into the site as a project's assets.
#
#   tools/ingest-video.sh <slug> "<path/to/master.mp4>" [still-frame-seconds]
#
# Produces (overwriting placeholders of the same name):
#   assets/videos/<slug>-hero.mp4      1080p web encode of the full film (CRF 23, AAC 160k)
#   assets/thumbs/<slug>-hero.jpg      poster frame (from 2s in)
#   assets/thumbs/<slug>.jpg           4:3 tile still, centre-cropped frame at <start> seconds
#
# A hand-placed still is respected: if assets/thumbs/<slug>.keep exists it is not regenerated.
set -euo pipefail
cd "$(dirname "$0")/.."

slug="$1"; src="$2"; start="${3:-3}"
[ -f "$src" ] || { echo "no such file: $src" >&2; exit 1; }

hero="assets/videos/$slug-hero.mp4"
poster="assets/thumbs/$slug-hero.jpg"
still="assets/thumbs/$slug.jpg"

echo "== $slug"
echo "   hero   ← $(basename "$src")"
ffmpeg -y -loglevel error -stats -i "$src" \
  -vf "scale=-2:1080:flags=lanczos,fps=30" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -c:a aac -b:a 160k -ac 2 -movflags +faststart "$hero" 2>&1 | tr '\r' '\n' | tail -1
ffmpeg -y -loglevel error -ss 2 -i "$hero" -frames:v 1 -q:v 3 "$poster"

# 4:3 tile still, centre-cropped from the film at <start> seconds (default 3s).
# Skipped if assets/thumbs/<slug>.keep exists (a real still was placed by hand).
if [ ! -f "assets/thumbs/$slug.keep" ]; then
  echo "   still  ← frame at ${start}s, 4:3 crop"
  ffmpeg -y -loglevel error -ss "$start" -i "$src" -frames:v 1 \
    -vf "crop=ih*4/3:ih,scale=1200:900:flags=lanczos" -q:v 3 "$still"
fi
printf "   sizes  hero %.1f MB" "$(stat -f %z "$hero" | awk '{print $1/1048576}')"
echo
