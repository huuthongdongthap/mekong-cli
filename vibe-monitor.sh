#!/bin/zsh
# ═══════════════════════════════════════════════════════
# 📊 VIBE-FACTORY Monitor v3 — AI-Powered (Qwen 3.5 9B)
# Local LLM giám sát tôm hùm: đọc hiểu + cảnh báo lệch task
# ═══════════════════════════════════════════════════════

PROJECT="${1:-/Users/mac/.gemini/antigravity/scratch/sadec-marketing-hub}"
TMUX_BIN="/opt/homebrew/bin/tmux"
OLLAMA_MODEL="qwen3.5:9b"
OLLAMA_URL="http://localhost:11434/api/generate"
AI_INTERVAL=3  # AI phân tích mỗi 3 chu kỳ (tức ~24s)
CYCLE=0

NAMES=("🎯 P0:CTO" "⚡ P1:BUILDER" "🔍 P2:TESTER" "🎨 P3:DESIGNER")
TASKS=("" "" "" "")  # Lưu task giao cho mỗi agent

cd "$PROJECT" 2>/dev/null

# Hàm gọi Ollama AI (no-think mode, nhanh)
ai_analyze() {
    local agent_name="$1"
    local task_assigned="$2"
    local current_output="$3"
    
    local prompt="Bạn là giám sát viên. Phân tích ngắn gọn (2-3 dòng, tiếng Việt):
AGENT: $agent_name
TASK ĐƯỢC GIAO: $task_assigned
OUTPUT HIỆN TẠI:
$current_output

Trả lời:
1) Đang làm gì? (1 dòng)
2) Có đúng task không? (OK/LỆCH)
3) Tiến độ? (%)"

    local response=$(curl -sS --connect-timeout 5 --max-time 10 \
        "$OLLAMA_URL" \
        -d "{\"model\":\"$OLLAMA_MODEL\",\"prompt\":$(echo "$prompt" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),\"stream\":false,\"options\":{\"temperature\":0.1,\"num_predict\":100,\"num_ctx\":2048}}" \
        2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('response','❌ AI offline'))" 2>/dev/null)
    
    echo "${response:-❌ AI không phản hồi}"
}

# Hàm lấy task đã giao (đọc từ prompt CC CLI)
get_assigned_task() {
    local pane=$1
    local full=$($TMUX_BIN capture-pane -t tom_hum:0.$pane -p -S - 2>/dev/null)
    echo "$full" | grep "^❯ " | tail -1 | sed 's/^❯ //' | head -c 200
}

echo "🧠 VIBE Monitor v3 — AI: $OLLAMA_MODEL"
echo "   Đảm bảo Ollama đang chạy..."
ollama ps 2>/dev/null || ollama serve &>/dev/null &

while true; do
    clear
    CYCLE=$((CYCLE + 1))
    
    echo "═══ $(date +%H:%M:%S) VIBE CHECK v3 🧠 ═══"
    echo ""

    # RAM
    RAM_USED=$(vm_stat | awk '/Pages active/ {printf "%.0f", $3*4096/1048576}')
    SWAP=$(sysctl vm.swapusage 2>/dev/null | awk '{print $7}')
    echo "RAM: ${RAM_USED} MB | SWAP: ${SWAP}"
    echo ""

    echo "─── 🦞 TÔM HÙM ───"
    
    for i in 0 1 2 3; do
        pout=$($TMUX_BIN capture-pane -t tom_hum:0.$i -p -S -15 2>/dev/null)
        
        if [ -z "$pout" ]; then
            echo "${NAMES[$((i+1))]}: ❌ NO SESSION"
            continue
        fi

        # Detect status
        if echo "$pout" | grep -q "esc to interrupt"; then
            pst="🔥 WORKING"
        elif echo "$pout" | grep -q "? for shortcuts"; then
            pst="✅ DONE"
        elif echo "$pout" | grep -q "sadec-marketing-hub %"; then
            pst="💤 EXITED"
        else
            pst="⏳"
        fi

        # Extract log lines
        log_lines=$(echo "$pout" | grep -v "^$" | grep -v "^─" | grep -v "shortcuts" \
            | grep -v "interrupt" | grep -v "ctrl+t" | grep -v "▐▛" \
            | grep -v "▝▜" | grep -v "▘▘" | grep -v "Enter to confirm" \
            | grep -v "Esc to cancel" | grep -v "Checking for updates" \
            | tail -4)

        echo ""
        echo "┌─ ${NAMES[$((i+1))]} ── $pst"
        echo "$log_lines" | while read -r line; do
            [ -n "$line" ] && echo "│ $line"
        done

        # AI phân tích mỗi AI_INTERVAL chu kỳ
        if [ $((CYCLE % AI_INTERVAL)) -eq 0 ] && [ "$pst" = "🔥 WORKING" ]; then
            task=$(get_assigned_task $i)
            echo "│"
            echo "│ 🧠 AI: $(ai_analyze "${NAMES[$((i+1))]}" "$task" "$log_lines")" | fold -w 60 | while read -r aline; do
                echo "│    $aline"
            done
        fi
        
        echo "└──────────"
    done
    echo ""

    # Git
    echo "─── Git (last 3) ───"
    cd "$PROJECT" && git log --oneline -3 2>/dev/null
    echo ""

    # AI cycle indicator
    if [ $((CYCLE % AI_INTERVAL)) -eq 0 ]; then
        echo "🧠 AI scan: ON (cycle $CYCLE)"
    else
        next=$((AI_INTERVAL - (CYCLE % AI_INTERVAL)))
        echo "🧠 AI scan: next in ${next} cycles"
    fi

    sleep 8
done
