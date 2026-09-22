#!/usr/bin/env bash
# Publish the site: stamp a fresh cache-busting version on the script/style tags,
# commit everything, push. GitHub Pages rebuilds in ~1 minute.
#   tools/publish.sh "what changed"
set -euo pipefail
cd "$(dirname "$0")/.."
msg="${1:-Update site}"
v=$(date +%Y%m%d%H%M%S)
for f in index.html project.html about.html contact.html; do
  sed -i '' -E "s#(css/style\.css|js/projects\.js|js/main\.js|js/fx\.js)(\?v=[0-9]+)?\"#\1?v=$v\"#g" "$f"
done
git add -A
git commit -q -m "$msg

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" || { echo "nothing to commit"; exit 0; }
git push -q
echo "published v=$v  ($(git log --oneline -1 | cut -c1-7))"
