#!/usr/bin/env bash
# Generates placeholder clips + posters so the site works before real footage is dropped in.
# Safe to delete once you have real assets. Requires ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."

slugs=(woohoo monday-crm green-room felt-cat logo-mitosis lower-thirds)
c0=(f4d35e 6161ff 3f8f5a f2a541 00c875 e2445c)
c1=(fff3c4 e4e4ff c8e6cf ffe4c4 c6f6e0 ffd6dc)

for i in "${!slugs[@]}"; do
  s=${slugs[$i]}; a=${c0[$i]}; b=${c1[$i]}
  # 4:3 hover preview + poster
  ffmpeg -y -loglevel error -f lavfi -i "gradients=s=800x600:c0=0x$a:c1=0x$b:speed=0.03:d=4:r=30" \
    -c:v libx264 -pix_fmt yuv420p -crf 28 -movflags +faststart "assets/videos/$s-preview.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$s-preview.mp4" -frames:v 1 -q:v 4 "assets/thumbs/$s.jpg"
  # 16:9 hero + poster
  ffmpeg -y -loglevel error -f lavfi -i "gradients=s=1280x720:c0=0x$b:c1=0x$a:speed=0.02:d=6:r=30" \
    -c:v libx264 -pix_fmt yuv420p -crf 28 -movflags +faststart "assets/videos/$s-hero.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$s-hero.mp4" -frames:v 1 -q:v 4 "assets/thumbs/$s-hero.jpg"
  # gallery clips (mixed sizes)
  for n in 1 2 3; do
    ffmpeg -y -loglevel error -f lavfi -i "gradients=s=960x720:c0=0x$a:c1=0x$b:nb_colors=2:speed=0.0$((n+2)):d=4:r=30" \
      -c:v libx264 -pix_fmt yuv420p -crf 28 -movflags +faststart "assets/gifs/$s-0$n.mp4"
  done
  echo "made $s"
done

# Portrait placeholder (4:5)
ffmpeg -y -loglevel error -f lavfi -i "gradients=s=800x1000:c0=0x222222:c1=0x777777:d=1" -frames:v 1 -q:v 4 assets/portrait.jpg
echo "done"
