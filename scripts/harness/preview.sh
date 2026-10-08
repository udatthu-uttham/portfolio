#!/bin/bash
# Open or close a separate preview of the website (see .claude/skills/preview).
#   scripts/harness/preview.sh open <name>    worktree + branch + dev config + launch entry
#   scripts/harness/preview.sh close <name>   remove all of it (stop its server first)
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cmd="${1:-}"; name="${2:-}"
[ -n "$cmd" ] && [ -n "$name" ] || { echo "usage: preview.sh open|close <name>"; exit 1; }
case "$name" in *[!a-z0-9-]*) echo "name: lowercase letters, digits and hyphens only"; exit 1;; esac
W="$ROOT/.claude/worktrees/$name"
LAUNCH="$ROOT/.claude/launch.json"

if [ "$cmd" = open ]; then
  [ -e "$W" ] && { echo "$W already exists"; exit 1; }
  git -C "$ROOT" worktree add -q "$W" -b "$name" HEAD
  ln -s "$ROOT/node_modules" "$W/node_modules"
  cat > "$W/astro.devlocal.config.mjs" <<EOF
import base from './astro.config.mjs';
export default { ...base, vite: { ...(base.vite ?? {}), cacheDir: '.vite-local', server: { fs: { allow: ['..', '$ROOT/node_modules'] } } } };
EOF
  port=$(python3 - "$LAUNCH" <<'PY'
import json, sys
used = {c.get('port') for c in json.load(open(sys.argv[1]))['configurations']}
print(next(p for p in range(4331, 4400) if p not in used))
PY
)
  python3 - "$LAUNCH" "$name" "$W" "$port" <<'PY'
import json, sys
p, name, w, port = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
d = json.load(open(p))
d['configurations'] = [c for c in d['configurations'] if c['name'] != name] + [{
  "name": name, "runtimeExecutable": "npx",
  "runtimeArgs": ["astro", "dev", "--root", w, "--config", "astro.devlocal.config.mjs", "--port", str(port), "--host", "127.0.0.1"],
  "port": port}]
json.dump(d, open(p, 'w'), indent=2)
PY
  echo "Preview '$name' ready: $W (branch $name, port $port). Start it with preview_start {name: \"$name\"}."
elif [ "$cmd" = close ]; then
  python3 - "$LAUNCH" "$name" <<'PY'
import json, sys
p, name = sys.argv[1], sys.argv[2]
d = json.load(open(p))
d['configurations'] = [c for c in d['configurations'] if c['name'] != name]
json.dump(d, open(p, 'w'), indent=2)
PY
  [ -e "$W" ] && git -C "$ROOT" worktree remove --force "$W"
  git -C "$ROOT" branch -D "$name" 2>/dev/null || true
  echo "Preview '$name' removed."
else
  echo "usage: preview.sh open|close <name>"; exit 1
fi
