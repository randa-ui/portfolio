#!/usr/bin/env bash
# Build a project's page gallery + credits + description from a Dropbox PROCESS folder.
#
#   tools/ingest-process.sh <slug>          one project
#   tools/ingest-process.sh all             every folder under PROCESS/
#
# Reads  ___THUMBS/PROCESS/<slug>/{*.mp4,*.mov,*.gif,*.png,*.jpg,credits.txt,description.txt}
# Writes assets/gallery/<slug>/NN.(mp4|jpg)  and updates that project's gallery/credits/description
#        in js/projects.js. Files appear in name order; a name containing "wide" spans both columns;
#        "NN name -- Caption.ext" sets a caption.
set -euo pipefail
cd "$(dirname "$0")/.."
PROC="/Users/randa/Library/CloudStorage/Dropbox-Monday.com/Ran Daskal/Motion Teammates/Ran/_____My stuff/Showreel25/___THUMBS/PROCESS"

ingest_one() {
  local slug="$1" src="$PROC/$1" out="assets/gallery/$1"
  [ -d "$src" ] || { echo "no folder: $src" >&2; return 1; }
  mkdir -p "$out"; rm -f "$out"/*
  local n=0 items=()
  while IFS= read -r -d '' f; do
    local base ext caption span type dst
    base="$(basename "$f")"; ext="${base##*.}"; ext="$(echo "$ext" | tr 'A-Z' 'a-z')"
    case "$ext" in mp4|mov|gif|png|jpg|jpeg|webp) ;; *) continue;; esac
    n=$((n+1)); local nn; nn=$(printf "%02d" "$n")
    caption=""; [[ "$base" == *" -- "* ]] && caption="${base#* -- }" && caption="${caption%.*}"
    span=1; [[ "$(echo "$base" | tr 'A-Z' 'a-z')" == *wide* ]] && span=2
    if [[ "$ext" == "mp4" || "$ext" == "mov" || "$ext" == "gif" ]]; then
      type=video; dst="$out/$nn.mp4"
      ffmpeg -y -loglevel error -i "$f" -an -vf "scale='min(1600,iw)':-2:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" \
        -c:v libx264 -preset slow -crf 24 -movflags +faststart "$dst"
    else
      type=image; dst="$out/$nn.jpg"
      ffmpeg -y -loglevel error -i "$f" -vf "scale='min(1600,iw)':-2:flags=lanczos" -q:v 3 "$dst"
    fi
    printf "   %s  %-5s span %s  %s%s\n" "$nn" "$type" "$span" "$base" "${caption:+  → \"$caption\"}"
    items+=("{\"type\":\"$type\",\"src\":\"$dst\",\"span\":$span,\"caption\":\"$caption\"}")
  done < <(find "$src" -maxdepth 1 -type f ! -name ".*" -print0 | sort -z)

  local credits="[]" desc="[]"
  [ -f "$src/credits.txt" ] && credits=$(python3 -c '
import sys,json
lines=[l.strip() for l in open(sys.argv[1],encoding="utf-8") if l.strip()]
print(json.dumps([l for l in lines if not l.rstrip().endswith("—")]))' "$src/credits.txt")
  [ -f "$src/description.txt" ] && desc=$(python3 -c '
import sys,json,re
t=open(sys.argv[1],encoding="utf-8").read().strip()
print(json.dumps([p.strip().replace("\n"," ") for p in re.split(r"\n\s*\n", t) if p.strip()]) if t else "[]")' "$src/description.txt")
  local gallery="[$(IFS=,; echo "${items[*]:-}")]"

  python3 - "$slug" "$gallery" "$credits" "$desc" <<'EOF'
import sys, re, json
slug, gallery, credits, desc = sys.argv[1:5]
p='js/projects.js'; s=open(p).read()
m=re.search(r'  \{\n    slug: "%s",.*?\n  \}' % re.escape(slug), s, re.S)
assert m, "project not found: "+slug
b=m.group(0)
def js(v):  # JSON → JS literal, one item per line
    arr=json.loads(v)
    if not arr: return "[]"
    return "[\n" + ",\n".join("      "+json.dumps(x, ensure_ascii=False) for x in arr) + ",\n    ]"
n=re.sub(r'description: \[.*?\],', 'description: '+js(desc)+',', b, count=1, flags=re.S)
n=re.sub(r'credits: \[.*?\],', 'credits: '+js(credits)+',', n, count=1, flags=re.S)
n=re.sub(r'gallery: \[.*?\],', 'gallery: '+js(gallery)+',', n, count=1, flags=re.S)
open(p,'w').write(s.replace(b,n))
print("   → %d gallery items, %d credits, %d paragraphs" % (len(json.loads(gallery)), len(json.loads(credits)), len(json.loads(desc))))
EOF
}

echo
if [ "${1:-}" = "all" ]; then
  for d in "$PROC"/*/; do s=$(basename "$d"); echo "== $s"; ingest_one "$s"; done
else
  echo "== $1"; ingest_one "$1"
fi
node -e "const fs=require('fs'); const m={}; new Function(fs.readFileSync('js/projects.js','utf8')+'; this.projects=projects;').call(m); console.log('projects.js parses ✓')"
