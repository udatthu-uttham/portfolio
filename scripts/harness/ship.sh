#!/bin/bash
# Ship the website in one clean push: build, gate, push to main, wait for
# Cloudflare, confirm from outside the office network. Used by /ship.
#   scripts/harness/ship.sh            ship HEAD of the current branch to main
#   scripts/harness/ship.sh --dry-run  everything except the push and the wait
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
DRY=0; [ "${1:-}" = "--dry-run" ] && DRY=1
LIVE=https://portfolio.uniqueuttham.workers.dev   # same Worker as uttham.fyi; reachable from the office
PAGES="/ /work/meesho-mall/ /work/a-line-of-card-height/ /ai/resona/ /ai/realistic-prototype/"
OUT="$(mktemp -d -t website-ship)"
trap 'rm -rf "$OUT"' EXIT

step() { printf '\n== %s\n' "$1"; }

step "1/6 Working tree"
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Uncommitted changes to tracked files. Commit them first, so what ships is what was checked:"
  git status --short --untracked-files=no
  exit 1
fi
echo "Clean at $(git log --oneline -1)"

step "2/6 Build"
./node_modules/.bin/astro build --outDir "$OUT" 2>&1 | grep -iE "error|warn|\[case\]|\[seo\]|Complete!" || true
[ -f "$OUT/index.html" ] || { echo "Build produced no index.html"; exit 1; }

step "3/6 Release gate (source and built site)"
node scripts/harness/release-gate.mjs --dist "$OUT"

if [ "$DRY" = 1 ]; then echo; echo "Dry run: stopping before the push."; exit 0; fi

step "4/6 Push to main (the pre-push hook runs the gate once more)"
git push origin HEAD:main

step "5/6 Waiting for Cloudflare to serve this build"
# The build is deterministic, so each live page should match its local copy byte
# for byte once the deploy lands; nonce-free static HTML makes that a clean test.
want=""
for p in $PAGES; do want="$want$(shasum -a 256 "$OUT${p}index.html" | cut -c1-16) "; done
live=""
for i in $(seq 1 40); do
  live=""
  for p in $PAGES; do live="$live$(curl -s "$LIVE$p?ship=$RANDOM$i" | shasum -a 256 | cut -c1-16) "; done
  [ "$live" = "$want" ] && { echo "Live after ~$((i * 15))s: every page matches the build."; break; }
  sleep 15
done
[ "$live" = "$want" ] || { echo "Not matching after 10 minutes. Check the Cloudflare build log."; exit 1; }
for p in $PAGES /no-such-page/; do printf '  %-32s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$LIVE$p?q=$RANDOM")"; done

step "6/6 uttham.fyi from outside (check-host.net)"
rid=$(curl -s -H 'Accept: application/json' "https://check-host.net/check-http?host=https://uttham.fyi/&max_nodes=3" | python3 -c "import sys,json;print(json.load(sys.stdin)['request_id'])" 2>/dev/null || true)
if [ -n "$rid" ]; then
  sleep 10
  curl -s -H 'Accept: application/json' "https://check-host.net/check-result/$rid" | python3 -c "
import sys, json
d = json.load(sys.stdin)
rows = [(k.split('.')[0], v[0][2], v[0][3]) for k, v in d.items() if v and v[0]]
print('  ' + ', '.join(f'{n}: {s} {c}' for n, s, c in rows) if rows else '  (no node answered yet)')"
else
  echo "  check-host.net did not answer; the workers.dev check above stands."
fi
echo; echo "Shipped $(git log --oneline -1)."
