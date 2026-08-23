#!/usr/bin/env bash
# Vibe Coding Factory — Role-Based Setup Script
set -euo pipefail

ROLE="${1:-dev}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEKONG_DIR="$HOME/.mekong"
LINEAGE_DIR="$MEKONG_DIR/lineage"
FACTORY_DIR="$REPO_ROOT/factory"

_log() { echo "[factory] $*"; }
_ok()  { echo "[factory] OK: $*"; }
_warn(){ echo "[factory] WARN: $*" >&2; }
_fail(){ echo "[factory] ERROR: $*" >&2; exit 1; }

_log "Bootstrapping for role: $ROLE"

mkdir -p "$LINEAGE_DIR"
_ok "Created $LINEAGE_DIR"

[[ -f "$FACTORY_DIR/layers.yaml" ]] || _fail "layers.yaml not found"
_ok "layers.yaml found"

PROFILE_MAP_dev="$FACTORY_DIR/profiles/dev.yaml"
PROFILE_MAP_founder="$FACTORY_DIR/profiles/founder.yaml"
PROFILE_MAP_business="$FACTORY_DIR/profiles/founder.yaml"
PROFILE_MAP_product="$FACTORY_DIR/profiles/founder.yaml"
PROFILE_MAP_ops="$FACTORY_DIR/profiles/dev.yaml"

PROFILE_VAR="PROFILE_MAP_${ROLE}"
PROFILE_PATH="${!PROFILE_VAR}"

if [[ -f "$PROFILE_PATH" ]]; then
  _ok "Profile loaded: $PROFILE_PATH"
else
  _warn "No profile found for role '$ROLE' (looked at $PROFILE_PATH)"
fi

PYTHON="${PYTHON:-python3}"
if $PYTHON -c "import yaml" 2>/dev/null; then
  _ok "pyyaml available"
else
  _warn "pyyaml not installed — some features unavailable"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Vibe Coding Factory — Setup Complete"
echo " Role   : $ROLE"
echo " Lineage: $LINEAGE_DIR"
echo " Factory: $FACTORY_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo " Next: mekong start"
