#!/bin/bash
# ═══════════════════════════════════════════════════════
# Warmup Ollama — CTO + Worker dual-model warmup
# ═══════════════════════════════════════════════════════
# Usage:
#   bash scripts/warmup-ollama.sh            # Warm CTO brain only
#   bash scripts/warmup-ollama.sh --worker   # Warm Worker coder only
#   bash scripts/warmup-ollama.sh --all      # Warm both (simultaneous)
# ═══════════════════════════════════════════════════════
set -uo pipefail

OLLAMA_URL="${OLLAMA_BASE_URL:-http://127.0.0.1:11434}"
CTO_MODEL="${CTO_MODEL:-qwen3.6:35b-a3b}"
WORKER_MODEL="${WORKER_MODEL:-qwen3-coder-next}"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

warmup_model() {
  local model="$1"
  local role="$2"
  echo -e "${CYAN}⏳ ${role}: ${model}...${NC}"

  if ! curl -s "${OLLAMA_URL}/api/tags" >/dev/null 2>&1; then
    echo -e "${YELLOW}Starting Ollama...${NC}"
    ollama serve &>/dev/null &
    sleep 3
  fi

  RESP=$(curl -s --max-time 180 "${OLLAMA_URL}/api/generate" \
    -d "{\"model\":\"${model}\",\"prompt\":\"ready\",\"stream\":false,\"keep_alive\":\"24h\",\"options\":{\"num_predict\":1}}" 2>/dev/null)

  if echo "$RESP" | grep -q "response"; then
    echo -e "${GREEN}✅ ${role}: WARM (keep_alive=24h)${NC}"
    return 0
  else
    echo -e "${RED}⚠️  ${model} warmup failed${NC}"
    echo "$RESP" | grep -qi "not found" && echo -e "${YELLOW}Pulling ${model}...${NC}" && ollama pull "$model" &
    return 1
  fi
}

MODE="${1:-cto}"

case "$MODE" in
  --worker)
    warmup_model "$WORKER_MODEL" "Worker Coder ⚙️"
    ;;
  --all)
    warmup_model "$CTO_MODEL" "CTO Brain 🧠"
    warmup_model "$WORKER_MODEL" "Worker Coder ⚙️"
    echo ""
    echo -e "${CYAN}Loaded models:${NC}"
    ollama ps 2>/dev/null | sed 's/^/  /'
    ;;
  *)
    warmup_model "$CTO_MODEL" "CTO Brain 🧠"
    ;;
esac
