#!/bin/bash
# Desktop notification when a long piece of work finishes (Remote Control and
# phone pushes are off by org policy). UserPromptSubmit stamps the start; Stop
# notifies only if the turn ran longer than two minutes.
#   notify.sh start | notify.sh stop
STAMP="${TMPDIR:-/tmp}/website-claude-turn-start"
case "${1:-}" in
  start) date +%s > "$STAMP" ;;
  stop)
    [ -f "$STAMP" ] || exit 0
    secs=$(( $(date +%s) - $(cat "$STAMP") ))
    rm -f "$STAMP"
    [ "$secs" -ge 120 ] || exit 0
    mins=$(( secs / 60 ))
    osascript -e "display notification \"Finished after ${mins} min — your turn.\" with title \"website\" sound name \"Glass\"" >/dev/null 2>&1 || true ;;
esac
exit 0
