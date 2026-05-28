#!/bin/bash
# SYNC: .claude/commands/*.md → .gemini/commands/*.toml + .opencode/commands/*.md + .codex/commands + AGENTS.md
set -uo pipefail
MEKONG_ROOT="${MEKONG_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
SRC="$MEKONG_ROOT/.claude/commands"

echo "🔄 Syncing commands from .claude/commands/..."

# Gemini CLI (.toml format)
sync_gemini() {
  local DEST="$MEKONG_ROOT/.gemini/commands" count=0
  mkdir -p "$DEST"
  find "$DEST" -name "*.toml" -type f -delete 2>/dev/null
  while IFS= read -r md; do
    [ -f "$md" ] || continue
    local rel base dest_dir
    rel="${md#$SRC/}"
    base="${rel%.md}"
    dest_dir=$(dirname "$DEST/${base}.toml")
    mkdir -p "$dest_dir"
    local desc
    desc=$(sed -n 's/^description: *"\(.*\)"/\1/p' "$md" | head -1)
    [ -z "$desc" ] && desc="Mekong: $base"
    cat > "$DEST/${base}.toml" << TOML
description = "$desc"
[steps]
[steps.run]
command = "mekong $base {{args}}"
TOML
    count=$((count + 1))
  done < <(find -L "$SRC" -name "*.md" -type f | sort)
  echo "  ✅ Gemini: $count → .gemini/commands/"
}

# OpenCode (.md — $ARGUMENTS is native, preserve directory structure)
sync_opencode() {
  local DEST="$MEKONG_ROOT/.opencode/commands" count=0
  mkdir -p "$DEST"
  find "$DEST" -name "*.md" -type f -delete 2>/dev/null
  # Find all .md files recursively (root + subdirectories)
  while IFS= read -r md; do
    [ -f "$md" ] || continue
    # Get relative path from SRC directory
    local rel="${md#$SRC/}"
    # Preserve directory structure (OpenCode uses dirs for namespacing)
    local dest_dir
    dest_dir=$(dirname "$DEST/$rel")
    mkdir -p "$dest_dir"
    # Copy as-is (OpenCode uses $ARGUMENTS natively like Claude Code)
    cp "$md" "$DEST/$rel"
    count=$((count + 1))
  done < <(find -L "$SRC" -name "*.md" -type f | sort)
  echo "  ✅ OpenCode: $count → .opencode/commands/"
}

# Codex CLI registries (.json manifests + command prompts + architecture context)
sync_codex() {
  python3 "$MEKONG_ROOT/tools/sync_codex.py"
}

# AGENTS.md (universal — all tools read)
sync_agents() {
  local CMD_COUNT
  CMD_COUNT=$(find -L "$SRC" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  cat > "$MEKONG_ROOT/AGENTS.md" << EOF
# AGENTS.md - Mekong CLI v6.0
# Read by: Claude Code, Gemini CLI, OpenCode, Cursor, Codex, Amp, Antigravity

## Project
AI-operated business platform. 6 layers, $CMD_COUNT commands. MIT License.
Universal LLM: 3 env vars (LLM_BASE_URL, LLM_API_KEY, LLM_MODEL), any provider.

## Commands
Commands live in .claude/commands/*.md. Execute via: mekong <name> <args>
Engine: Python CLI (Typer) → PEV orchestrator → LLM Router → Agent Layer
Registry-backed slash commands that are not native Typer commands dispatch through the Codex registry fallback.

## Codex CLI Registry
Codex-native command registry lives at .codex/commands/registry.json.
Synced command prompts live at .codex/commands/**/*.md.
When a user asks for a slash command in Codex, resolve it first:

python3 -m src.main codex-command /goal "deep config" --json --check
python3 -m src.main codex-command /goals "deep config" --json --check
python3 -m src.main codex-command /code/check src/main.py --invocation --check
python3 -m src.main /goal "deep config" --invocation --check
python3 -m src.main code/check src/main.py --invocation --check

Regenerate the registry with:

python3 tools/sync_codex.py --json

The resolver auto-refreshes stale registry data by default. Use --no-sync only for debugging.

## Codex Architecture Registry
Codex-native architecture registry lives at .codex/architecture/registry.json.
Architecture summary lives at .codex/architecture/ARCHITECTURE.md.
Copied source documents live at .codex/architecture/sources/.
Use this registry for layer maps, command contracts, recipes, source hashes, apps, packages, and src modules.
Verify Codex command + architecture wiring with:

python3 tools/verify_codex_sync.py --json

## Build & Test
pip install -e .           # Python CLI
pnpm install               # TypeScript packages
python3 -m pytest tests/   # Tests
make test-python-packages  # Test agent-core, agent-forest, mekongd
mekong doctor check        # Health

## Style
Python: snake_case, type hints, < 200 lines. TypeScript: strict, ESM.
Commits: conventional (feat/fix/refactor/docs/test). No AI refs in messages.

## Architecture
Studio → Founder → Business → Product → Engineering → Ops
Water Protocol 水: multi-agent context flow between layers.

## Key Packages
- packages/agent-core/ — Agent management
- packages/agent-forest/ — Multi-agent orchestration
- packages/mekongd/ — Daemon service
- packages/mekong-reports/ — Report generation
- packages/openclaw-engine/ — Core engine (PUBLIC SDK)
EOF
  echo "  ✅ AGENTS.md generated ($CMD_COUNT commands)"
  sync_codex >/dev/null
  echo "  ✅ Codex architecture refreshed from AGENTS.md"
}

# OpenCode GLOBAL (~/.config/opencode/commands/ — available in ALL sessions)
sync_opencode_global() {
  local DEST="$HOME/.config/opencode/commands" count=0
  mkdir -p "$DEST"
  # Clean old commands first
  find "$DEST" -name "*.md" -type f -delete 2>/dev/null
  # Find all .md files recursively (root + subdirectories)
  while IFS= read -r md; do
    [ -f "$md" ] || continue
    local rel="${md#$SRC/}"
    local dest_dir
    dest_dir=$(dirname "$DEST/$rel")
    mkdir -p "$dest_dir"
    cp "$md" "$DEST/$rel"
    count=$((count + 1))
  done < <(find -L "$SRC" -name "*.md" -type f | sort)
  echo "  ✅ OpenCode Global: $count → ~/.config/opencode/commands/"
}

case "${1:---all}" in
  --gemini) sync_gemini;; --opencode) sync_opencode;; --codex) sync_codex;; --agents) sync_agents;;
  --global) sync_opencode_global;;
  --all) sync_gemini; sync_opencode; sync_agents; sync_opencode_global;;
  *) echo "Usage: $0 [--all|--gemini|--opencode|--codex|--agents|--global]";;
esac
echo "✅ Sync complete."
