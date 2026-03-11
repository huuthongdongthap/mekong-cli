#!/bin/zsh
# ═══════════════════════════════════════════════════════════
# 🦞 TÔM HÙM DISPATCH — Giao việc cho agents từ terminal
# Usage:
#   tom-dispatch P0 "refactor auth.js"
#   tom-dispatch P1 "phân tích portal-client.js"
#   tom-dispatch all "chạy /status"
#   tom-dispatch status
# ═══════════════════════════════════════════════════════════

SESSION="tom_hum"
TMUX="/opt/homebrew/bin/tmux"

# Pane mapping: P0=0.0, P1=0.1, P2=0.2, P3=0.3
declare -A PANE_MAP
PANE_MAP=(
    [P0]="0.0"  [p0]="0.0"  [cto]="0.0"     [planner]="0.0"
    [P1]="0.1"  [p1]="0.1"  [builder]="0.1"  [developer]="0.1"
    [P2]="0.2"  [p2]="0.2"  [tester]="0.2"   [reviewer]="0.2"
    [P3]="0.3"  [p3]="0.3"  [designer]="0.3" [binh-phap]="0.3"
)

PANE_NAMES=("📋 W0:PLANNER" "⚡ W1:BUILDER" "🔍 W2:TESTER" "🎨 W3:DESIGNER")

show_help() {
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║  🦞 TÔM HÙM DISPATCH — Giao việc cho agents         ║"
    echo "╠═══════════════════════════════════════════════════════╣"
    echo "║  Cách dùng:                                          ║"
    echo "║    tom-dispatch P0 \"task description\"                ║"
    echo "║    tom-dispatch builder \"refactor file.js\"           ║"
    echo "║    tom-dispatch all \"/status\"                        ║"
    echo "║    tom-dispatch status                               ║"
    echo "║    tom-dispatch cook \"task for all agents\"           ║"
    echo "╠═══════════════════════════════════════════════════════╣"
    echo "║  Agents (Workers, quản lý bởi CTO Brain): ║"
    echo "║    P0/planner     — Lên kế hoạch, review    ║"
    echo "║    P1/builder/dev — Production code          ║"
    echo "║    P2/tester      — Test & quality           ║"
    echo "║    P3/designer    — UI/UX & CSS              ║"
    echo "║    all            — Gửi cho tất cả           ║"
    echo "║    cook           — Phân chia tự động        ║"
    echo "╚═══════════════════════════════════════════════════════╝"
}

send_to_pane() {
    local pane="$1"
    local task="$2"
    $TMUX send-keys -t "$SESSION:$pane" "$task" Enter 2>/dev/null
    return $?
}

get_pane_status() {
    local pane="$1"
    local output=$($TMUX capture-pane -t "$SESSION:$pane" -p 2>/dev/null | tail -3)
    if echo "$output" | grep -q "❯"; then
        echo "IDLE ✅"
    elif echo "$output" | grep -q "thinking\|Perusing\|Running\|Writing"; then
        echo "WORKING 🔥"
    else
        echo "BUSY ⏳"
    fi
}

cmd_status() {
    echo ""
    echo "═══ 🦞 TÔM HÙM STATUS $(date +%H:%M:%S) ═══"
    echo ""
    
    # Check tmux session
    if ! $TMUX has-session -t $SESSION 2>/dev/null; then
        echo "❌ tmux session '$SESSION' not found!"
        echo "   Run: ~/mekong-cli/tom-hum-factory.sh"
        return 1
    fi
    
    for i in 0 1 2 3; do
        local pstatus=$(get_pane_status "0.$i")
        printf "  %s  %s\n" "${PANE_NAMES[$((i+1))]}" "$pstatus"
    done
    echo ""
}

cmd_send() {
    local target="$1"
    local task="$2"
    
    if [ -z "$task" ]; then
        echo "❌ Thiếu task! Usage: tom-dispatch $target \"task\""
        return 1
    fi
    
    local pane="${PANE_MAP[$target]}"
    if [ -z "$pane" ]; then
        echo "❌ Agent '$target' không tồn tại!"
        echo "   Dùng: P0, P1, P2, P3, cto, builder, tester, designer, all"
        return 1
    fi
    
    local idx=${pane#0.}
    echo "📤 Giao việc cho ${PANE_NAMES[$idx]}:"
    echo "   → $task"
    send_to_pane "$pane" "$task"
    echo "✅ Đã gửi!"
}

cmd_all() {
    local task="$1"
    echo "📤 Giao việc cho TẤT CẢ agents:"
    echo "   → $task"
    echo ""
    for i in 0 1 2 3; do
        send_to_pane "0.$i" "$task"
        echo "  ✅ ${PANE_NAMES[$i]}"
        sleep 1
    done
}

cmd_cook() {
    local task="$1"
    echo "🍳 COOK MODE — Phân chia task tự động:"
    echo "   → $task"
    echo ""
    
    # P0 CTO: plan
    send_to_pane "0.0" "Lên plan cho task sau, CHỈ phân tích KHÔNG code: $task"
    echo "  ✅ ${PANE_NAMES[0]} → Planning"
    sleep 2
    
    # P1 Builder: implement  
    send_to_pane "0.1" "Implement task sau, tự động code: $task"
    echo "  ✅ ${PANE_NAMES[1]} → Building"
    sleep 2
    
    # P2 Tester: test
    send_to_pane "0.2" "Viết tests cho task sau: $task"
    echo "  ✅ ${PANE_NAMES[2]} → Testing"
    sleep 2
    
    # P3 Designer: review
    send_to_pane "0.3" "Review code quality và UI cho task: $task"
    echo "  ✅ ${PANE_NAMES[3]} → Reviewing"
    
    echo ""
    echo "🦞 4 agents đang làm việc! Chạy 'tom-dispatch status' để theo dõi."
}

# ─── MAIN ───
case "$1" in
    ""|help|-h|--help)
        show_help
        ;;
    status)
        cmd_status
        ;;
    all)
        cmd_all "$2"
        ;;
    cook)
        cmd_cook "$2"
        ;;
    *)
        cmd_send "$1" "$2"
        ;;
esac
