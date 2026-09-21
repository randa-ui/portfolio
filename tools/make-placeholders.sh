#!/usr/bin/env bash
# Generates placeholder tiles + pages so the site works before real footage is dropped in.
# For each slug: 4:3 hover loop + poster, 16:9 hero + poster. Real files with the same
# names replace these directly. Requires ffmpeg. Safe to delete once real assets exist.
set -euo pipefail
cd "$(dirname "$0")/.."

slugs=(abandoned-office your-crm-is-old truth-bomb wordtune the-biggest-deal im-an-actor
       monday-crm-agents salt monday-service monday-crm-demo fortis the-worst-about-it
       the-president crm-nightmare art-of-work)
# muted palette pairs, cycled
c0=(6161ff e2445c 00c875 ffcb00 a25ddc 0086c0 ff7575 9cd326 579bfc 784bd1 ff642e 037f4c 7e3b8a 66ccff bb3354)
c1=(2b2b6b 5a1c26 004d2e 665200 3c1f56 003a52 5a2929 3d5410 1f3c64 2e1c52 5a2210 013a24 2f1633 22475a 4a1520)

for i in "${!slugs[@]}"; do
  s=${slugs[$i]}; a=${c0[$((i % 15))]}; b=${c1[$((i % 15))]}
  ffmpeg -y -loglevel error -f lavfi -i "gradients=s=800x600:c0=0x$a:c1=0x$b:speed=0.03:d=4:r=30" \
    -c:v libx264 -pix_fmt yuv420p -crf 30 -movflags +faststart "assets/videos/$s-preview.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$s-preview.mp4" -frames:v 1 -q:v 5 "assets/thumbs/$s.jpg"
  ffmpeg -y -loglevel error -f lavfi -i "gradients=s=1280x720:c0=0x$b:c1=0x$a:speed=0.02:d=6:r=30" \
    -c:v libx264 -pix_fmt yuv420p -crf 30 -movflags +faststart "assets/videos/$s-hero.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$s-hero.mp4" -frames:v 1 -q:v 5 "assets/thumbs/$s-hero.jpg"
  echo "made $s"
done

# Portrait placeholder (4:5) — only if none exists yet
[ -f assets/portrait.jpg ] || ffmpeg -y -loglevel error -f lavfi -i "gradients=s=800x1000:c0=0x222222:c1=0x777777:d=1" -frames:v 1 -q:v 4 assets/portrait.jpg
echo "done"
