#!/usr/bin/env bash
# Prints what is actually installed on this machine, read from disk.
#
# The point is the diff, not the output: a catalog maintained by hand is the
# next drift surface. Run this, diff against the last run, and only revise the
# written catalog when the diff is non-empty. A calendar chore dies; a red diff
# does not.
#
#   scripts/inventory.sh            human-readable
#   scripts/inventory.sh > inv.txt  diff against the previous capture

set -uo pipefail
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

section() { printf '\n== %s ==\n' "$1"; }

section "node in use (WSL trap — see tooling-catalog SKILL.md trap 7)"
if command -v node >/dev/null 2>&1; then
  printf '%s -> %s (%s)\n' "$(command -v node)" "$(readlink -f "$(command -v node)")" "$(node --version 2>/dev/null)"
else
  echo "node not on PATH"
fi

section "plugins"
if [ -f "$CLAUDE_DIR/plugins/installed_plugins.json" ]; then
  cat "$CLAUDE_DIR/plugins/installed_plugins.json"
else
  ls -1 "$CLAUDE_DIR/plugins/cache" 2>/dev/null || echo "none"
fi

section "enabled plugins + marketplaces (settings.json)"
python3 - "$CLAUDE_DIR/settings.json" <<'PY' 2>/dev/null || echo "settings.json unreadable"
import json, sys
try:
    cfg = json.load(open(sys.argv[1]))
except Exception as exc:
    print(f"unreadable: {exc}"); raise SystemExit(0)
for key in ("enabledPlugins", "extraKnownMarketplaces"):
    print(f"[{key}]")
    for name in sorted(cfg.get(key) or {}):
        print(f"  {name}")
print("[hooks]")
for event, entries in sorted((cfg.get("hooks") or {}).items()):
    for entry in entries:
        for hook in entry.get("hooks") or []:
            cmd = hook.get("command", "")
            args = " ".join(hook.get("args") or [])
            print(f"  {event}: {cmd} {args}".rstrip())
PY

section "user skills"
for f in "$CLAUDE_DIR"/skills/*/SKILL.md; do
  [ -e "$f" ] || { echo "none"; break; }
  printf '  %s\n' "$(basename "$(dirname "$f")")"
done

section "user subagents"
ls -1 "$CLAUDE_DIR"/agents/*.md 2>/dev/null | xargs -r -n1 basename || echo "none"

section "project-local (.claude of cwd)"
if [ -d .claude ]; then
  find .claude -maxdepth 2 \( -name 'SKILL.md' -o -name '*.md' -path '*/agents/*' \) 2>/dev/null | sed 's/^/  /' | head -30
  [ -f .claude/settings.json ] && echo "  .claude/settings.json present"
else
  echo "no .claude/ in $(pwd)"
fi

section "MCP servers"
claude mcp list 2>/dev/null || echo "claude CLI unavailable or no MCP servers configured"
