#!/bin/sh
# Rebuild the served stylesheets from the readable copies in src/.
# csso 5.x, restructuring on. No package is added to the site.
set -eu
cd "$(dirname "$0")/.."
npx --yes csso-cli@5.0.5 src/echo11-app.css --output echo11-app.css
npx --yes csso-cli@5.0.5 src/echo11-web.css --output echo11-web.css
for f in echo11-app.css echo11-web.css; do
  note="/* Minified from src/$f with csso 5.0.5 (restructure on). Regenerate: scripts/minify-css.sh */"
  tmp="$(mktemp)"
  printf '%s\n' "$note" | cat - "$f" > "$tmp"
  mv "$tmp" "$f"
done
