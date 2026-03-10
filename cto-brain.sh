#!/bin/zsh
# ═══════════════════════════════════════════════════════════
# 🧠 CTO BRAIN v2.1 — FULLY AUTONOMOUS
# Plan→Dispatch→Watch→Unblock→Redispatch (zero human needed)
# Model: Ollama cto-brain:32b (thinking ON)
# Antigravity chỉ ghi plan.md → CTO Brain tự xử tất cả
# ═══════════════════════════════════════════════════════════

PROJECT="${1:-/Users/mac/.gemini/antigravity/scratch/sadec-marketing-hub}"
TMUX_BIN="/opt/homebrew/bin/tmux"
DISPATCH="$HOME/mekong-cli/tom-dispatch.sh"
OLLAMA_URL="http://localhost:11434/api/generate"
REPORT_DIR="$PROJECT/.cto-reports"
PLAN_INBOX="$REPORT_DIR/plan.md"
PLAN_PROCESSED="$REPORT_DIR/plan_processed"
SESSION="tom_hum"

NAMES=("📋 W0:PLANNER" "⚡ W1:BUILDER" "🔍 W2:TESTER" "🎨 W3:DESIGNER")
CYCLE=0
ALERT_COUNT=0
DISPATCHED_TASKS=0
CURRENT_PLAN=""

# Cooldown: skip redispatch for N cycles after worker completes
declare -A WORKER_COOLDOWN
WORKER_COOLDOWN=([0]=0 [1]=0 [2]=0 [3]=0)
COOLDOWN_CYCLES=3  # Skip this many cycles before redispatching

# Auto-detect best model
detect_model() {
    for m in "cto-brain:32b" "qwen3:32b" "qwen3:14b"; do
        if ollama show "$m" &>/dev/null; then echo "$m"; return; fi
    done
    echo "qwen3:32b"
}

MODEL=$(detect_model)
mkdir -p "$REPORT_DIR" "$PLAN_PROCESSED"
cd "$PROJECT" 2>/dev/null

# ═══ AI CALL (thinking ON) ═══
ai_call() {
    local prompt="$1"
    local max_tokens="${2:-400}"
    curl -sS --connect-timeout 8 --max-time 60 \
        "$OLLAMA_URL" \
        -d "{
            \"model\":\"$MODEL\",
            \"prompt\":$(echo "$prompt" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
            \"stream\":false,
            \"options\":{\"temperature\":0.3,\"num_predict\":$max_tokens,\"num_ctx\":8192}
        }" 2>/dev/null | python3 -c "
import sys,json,re
try:
    r=json.load(sys.stdin)
    resp=r.get('response','')
    think_match=re.search(r'<think>(.*?)</think>', resp, re.DOTALL)
    if think_match:
        think=think_match.group(1).strip()
        print('💭', think.split(chr(10))[0][:80])
    clean=re.sub(r'<think>.*?</think>', '', resp, flags=re.DOTALL).strip()
    print(clean[:600])
except: print('❌ AI offline')
" 2>/dev/null
}

# ═══ MAP ACTION → /COMMAND (hardcoded, AI cannot bypass) ═══
action_to_command() {
    local action="$1"
    local desc="$2"
    case "$(echo $action | tr '[:lower:]' '[:upper:]' | xargs)" in
        SCOUT)    echo "/scout \"$desc\"" ;;
        COOK)     echo "/cook \"$desc\"" ;;
        FIX)      echo "/fix \"$desc\"" ;;
        TEST)     echo "/test" ;;
        REFACTOR) echo "/refactor \"$desc\"" ;;
        REVIEW)   echo "/review" ;;
        COMMIT)   echo "/check-and-commit" ;;
        PLAN)     echo "/plan \"$desc\"" ;;
        SHIP)     echo "/ship" ;;
        *)        echo "/scout \"$desc\"" ;;
    esac
}

# ═══ PLAN INTAKE ═══
check_plan_inbox() {
    [ ! -f "$PLAN_INBOX" ] && return 1
    local plan_content=$(cat "$PLAN_INBOX")
    [ -z "$plan_content" ] && return 1
    
    echo ""
    echo "╔═══════════════════════════════════════════╗"
    echo "║  📨 PLAN MỚI TỪ ANTIGRAVITY!            ║"
    echo "╚═══════════════════════════════════════════╝"
    echo "$plan_content" | head -10
    echo ""
    
    CURRENT_PLAN="$plan_content"
    
    # RULE-BASED DISPATCH (AI unreliable cho dispatch, dùng keyword mapping)
    echo "🚀 Rule-based dispatch từ plan keywords..."
    
    # Extract task lines from plan
    local tasks=$(echo "$plan_content" | grep -E "^[0-9]+\.|^- " | head -8)
    local task_count=$(echo "$tasks" | wc -l | xargs)
    
    echo "📋 Found $task_count tasks in plan"
    echo ""
    
    # Worker assignment by keyword matching
    local p0_cmd="" p1_cmd="" p2_cmd="" p3_cmd=""
    
    while IFS= read -r task_line; do
        local tl=$(echo "$task_line" | tr '[:upper:]' '[:lower:]')
        
        if echo "$tl" | grep -qiE "scout|kiểm tra|check|scan|tìm|search|dọn|xoá.*bak"; then
            [ -z "$p0_cmd" ] && p0_cmd="/scout \"$(echo "$task_line" | sed 's/^[0-9]*\. *//' | sed 's/^- *//' | head -c 100)\""
        elif echo "$tl" | grep -qiE "fix|sửa|xoá|delete|remove|consolidate|merge|duplicate"; then
            [ -z "$p1_cmd" ] && p1_cmd="/fix \"$(echo "$task_line" | sed 's/^[0-9]*\. *//' | sed 's/^- *//' | head -c 100)\""
        elif echo "$tl" | grep -qiE "cook|build|tạo|create|cải thiện|improve|enhance|responsive|dashboard|ui"; then
            [ -z "$p1_cmd" ] && p1_cmd="/cook \"$(echo "$task_line" | sed 's/^[0-9]*\. *//' | sed 's/^- *//' | head -c 100)\""
            [ -n "$p1_cmd" ] && [ -z "$p3_cmd" ] && p3_cmd="/cook \"$(echo "$task_line" | sed 's/^[0-9]*\. *//' | sed 's/^- *//' | head -c 100)\""
        elif echo "$tl" | grep -qiE "test|verify|smoke|chạy.*test|responsive"; then
            [ -z "$p2_cmd" ] && p2_cmd="/test"
        elif echo "$tl" | grep -qiE "review|quality|consistency|report"; then
            [ -z "$p3_cmd" ] && p3_cmd="/review"
        elif echo "$tl" | grep -qiE "refactor|tách|split|modular"; then
            [ -z "$p1_cmd" ] && p1_cmd="/refactor \"$(echo "$task_line" | sed 's/^[0-9]*\. *//' | sed 's/^- *//' | head -c 100)\""
        elif echo "$tl" | grep -qiE "commit|push|deploy|ship"; then
            [ -z "$p0_cmd" ] && p0_cmd="/check-and-commit"
        fi
    done <<< "$tasks"
    
    # Fallbacks if no match
    [ -z "$p0_cmd" ] && p0_cmd="/scout \"project status after plan\""
    [ -z "$p1_cmd" ] && p1_cmd="/cook \"implement plan tasks\""
    [ -z "$p2_cmd" ] && p2_cmd="/test"
    [ -z "$p3_cmd" ] && p3_cmd="/review"
    
    # Dispatch all 4 workers
    for target_cmd in "P0|$p0_cmd" "P1|$p1_cmd" "P2|$p2_cmd" "P3|$p3_cmd"; do
        local target=$(echo "$target_cmd" | cut -d'|' -f1)
        local cmd=$(echo "$target_cmd" | cut -d'|' -f2-)
        echo "  🚀 $target ← $cmd"
        $DISPATCH "$target" "$cmd" 2>/dev/null
        DISPATCHED_TASKS=$((DISPATCHED_TASKS + 1))
        sleep 2
    done
    
    mv "$PLAN_INBOX" "$PLAN_PROCESSED/plan_$(date +%Y%m%d_%H%M%S).md"
    echo "✅ Dispatched! Plan archived."
    echo "[$(date '+%H:%M')] DISPATCH from plan" >> "$REPORT_DIR/dispatch_log.txt"
    echo "$dispatch_result" >> "$REPORT_DIR/dispatch_log.txt"
    echo "---" >> "$REPORT_DIR/dispatch_log.txt"
    return 0
}

# ═══ AUTO-UNBLOCK: phát hiện prompts treo → tự giải quyết ═══
auto_unblock_prompts() {
    for i in 0 1 2 3; do
        local pout=$(get_pane_output $i 15)
        
        # Fetch permission
        if echo "$pout" | grep -q "Do you want to allow Claude to fetch"; then
            echo "🔓 P$i: Auto-approve Fetch"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" "2" Enter
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: Fetch" >> "$REPORT_DIR/unblock_log.txt"
        fi
        
        # Tool permission
        if echo "$pout" | grep -q "Do you want to allow"; then
            echo "🔓 P$i: Auto-approve tool"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" "1" Enter
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: tool" >> "$REPORT_DIR/unblock_log.txt"
        fi
        
        # API key
        if echo "$pout" | grep -q "Do you want to use this API key"; then
            echo "🔓 P$i: Auto-approve API key"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" "y" Enter
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: API" >> "$REPORT_DIR/unblock_log.txt"
        fi
        
        # Skip permissions
        if echo "$pout" | grep -q "dangerously-skip-permissions"; then
            echo "🔓 P$i: Skip permissions"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" Enter
        fi

        # License/config file prompt → option 3 (gitignore)
        if echo "$pout" | grep -qiE "License file|config\.json.*xử lý|Bạn muốn xử lý"; then
            echo "🔓 P$i: License/config → gitignore"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" Down Down C-m
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: license→gitignore" >> "$REPORT_DIR/unblock_log.txt"
        fi

        # Trust workspace → option 1 (Yes, trust)
        if echo "$pout" | grep -q "Is this a project you created or one you trust"; then
            echo "🔓 P$i: Trust workspace"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" C-m
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: trust" >> "$REPORT_DIR/unblock_log.txt"
        fi

        # Bypass permissions accept → option 2 (Yes, I accept)
        if echo "$pout" | grep -q "Yes, I accept"; then
            echo "🔓 P$i: Bypass accept"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" Down C-m
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: bypass-accept" >> "$REPORT_DIR/unblock_log.txt"
        fi

        # Enter to confirm (generic)
        if echo "$pout" | grep -q "Enter to confirm"; then
            local last_line=$(echo "$pout" | tail -3)
            if ! echo "$last_line" | grep -q "❯\|thinking\|Perusing\|Running"; then
                echo "🔓 P$i: Enter to confirm"
                $TMUX_BIN send-keys -t "$SESSION:0.$i" C-m
                echo "[$(date +%H:%M:%S)] UNBLOCK P$i: enter-confirm" >> "$REPORT_DIR/unblock_log.txt"
            fi
        fi

        # Generic Yes/No → Yes
        if echo "$pout" | grep -qE "^\s*[Yy]es$|^\s*❯.*[Yy]es"; then
            if echo "$pout" | grep -q "Enter to confirm"; then
                echo "🔓 P$i: Yes confirm"
                $TMUX_BIN send-keys -t "$SESSION:0.$i" C-m
                echo "[$(date +%H:%M:%S)] UNBLOCK P$i: yes-confirm" >> "$REPORT_DIR/unblock_log.txt"
            fi
        fi

        # Commit changes → option 1 (Commit tất cả)
        if echo "$pout" | grep -qiE "Commit changes|Bạn muốn làm gì với.*thay đổi|Commit tất cả"; then
            echo "🔓 P$i: Commit all"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" C-m
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: commit-all" >> "$REPORT_DIR/unblock_log.txt"
        fi

        # XÁC NHẬN / Vietnamese confirmation → Esc to dismiss
        if echo "$pout" | grep -qiE "XÁC NHẬN|Bạn có đang|Test system|Yêu cầu khác|Tôi có thể giúp"; then
            echo "🔓 P$i: XÁC NHẬN → dismiss"
            $TMUX_BIN send-keys -t "$SESSION:0.$i" Escape
            echo "[$(date +%H:%M:%S)] UNBLOCK P$i: confirm-dismiss" >> "$REPORT_DIR/unblock_log.txt"
        fi

        # Vietnamese choice prompts (cursor on ❯ 1.) → accept default
        if echo "$pout" | grep -qE "❯\s+1\." && echo "$pout" | grep -qE "2\.\s"; then
            if ! echo "$pout" | grep -qE "thinking|Perusing|Running|Writing"; then
                echo "🔓 P$i: Choice→default"
                $TMUX_BIN send-keys -t "$SESSION:0.$i" C-m
                echo "[$(date +%H:%M:%S)] UNBLOCK P$i: choice-default" >> "$REPORT_DIR/unblock_log.txt"
            fi
        fi
    done
}

# ═══ AUTO-REDISPATCH: giao task mới cho IDLE workers ═══
auto_redispatch_idle() {
    # Skip redispatch entirely if no plan has been received
    if [ -z "$CURRENT_PLAN" ]; then
        return
    fi

    local idle_workers=""
    for i in 0 1 2 3; do
        # Check cooldown
        local cd=${WORKER_COOLDOWN[$i]:-0}
        if [ "$cd" -gt 0 ]; then
            WORKER_COOLDOWN[$i]=$((cd - 1))
            continue
        fi

        local pout=$(get_pane_output $i 10)
        local pstatus=$(get_pane_status "$pout")
        [ "$pstatus" = "DONE" ] && idle_workers="$idle_workers $i"
    done
    
    [ -z "$idle_workers" ] && return
    
    echo "🔄 IDLE workers:$idle_workers — auto-dispatching..."
    
    local git_log=$(cd $PROJECT && git log --oneline -3 2>/dev/null)
    local git_status=$(cd $PROJECT && git status --short 2>/dev/null | head -5)
    
    for widx in $idle_workers; do
        local default_action=""
        case $widx in
            0) default_action="SCOUT" ;; 1) default_action="FIX" ;;
            2) default_action="TEST" ;;  3) default_action="REVIEW" ;;
        esac
        
        local task_result=$(ai_call "Worker P$widx (${NAMES[$((widx+1))]}) IDLE, cần task mới.
Git: $git_log
Changed: $git_status
Plan: $CURRENT_PLAN
Output 1 dòng: P$widx|ACTION|description
ACTION: SCOUT,COOK,FIX,TEST,REFACTOR,REVIEW,COMMIT" 80)
        
        local parsed=$(echo "$task_result" | grep "^P[0-3]|" | head -1)
        if [ -n "$parsed" ]; then
            echo "$parsed" | IFS='|' read -r target action desc
            local cmd=$(action_to_command "$action" "$desc")
            echo "  🚀 P$widx ← $cmd"
            $DISPATCH "P$widx" "$cmd" 2>/dev/null
            DISPATCHED_TASKS=$((DISPATCHED_TASKS + 1))
            WORKER_COOLDOWN[$widx]=$COOLDOWN_CYCLES
            echo "[$(date +%H:%M:%S)] REDISPATCH P$widx: $cmd" >> "$REPORT_DIR/dispatch_log.txt"
        else
            # No valid AI response — set cooldown, do NOT fallback
            echo "  ⏸️ P$widx — no task, cooldown $COOLDOWN_CYCLES cycles"
            WORKER_COOLDOWN[$widx]=$COOLDOWN_CYCLES
        fi
        sleep 2
    done
}

# ═══ PANE FUNCTIONS ═══
get_pane_output() {
    local pane=$1; local lines=${2:-20}
    $TMUX_BIN capture-pane -t "$SESSION:0.$pane" -p -S -$lines 2>/dev/null
}

get_pane_status() {
    local pout="$1"
    if echo "$pout" | grep -q "esc to interrupt"; then echo "WORKING"
    elif echo "$pout" | grep -q "? for shortcuts"; then echo "DONE"
    elif echo "$pout" | grep -q "sadec-marketing-hub %"; then echo "EXITED"
    else echo "UNKNOWN"; fi
}

get_task() {
    get_pane_output $1 50 | grep "^❯ " | tail -1 | sed 's/^❯ //' | head -c 300
}

clean_log() {
    echo "$1" | grep -v "^$" | grep -v "^─" | grep -v "shortcuts" \
        | grep -v "interrupt" | grep -v "ctrl+t" | grep -v "▐▛" \
        | grep -v "▝▜" | grep -v "▘▘" | grep -v "Enter to confirm" \
        | grep -v "Esc to cancel" | grep -v "Checking for updates"
}

# ═══ ANALYSIS + DRIFT ═══
analyze_agent() {
    local idx=$1 pout="$2" pstatus="$3"
    local task=$(get_task $idx)
    local clean=$(clean_log "$pout" | tail -8)
    ai_call "CTO giám sát. Tiếng Việt, 3 dòng:
WORKER: ${NAMES[$((idx+1))]}
TASK: $task
STATUS: $pstatus
OUTPUT:
$clean
Format:
ĐANG LÀM: [1 dòng]
ĐÚNG TASK: [OK/LỆCH/XONG/KẸT]
TIẾN ĐỘ: [0-100]%" 150
}

handle_drift() {
    local idx=$1 analysis="$2"
    if echo "$analysis" | grep -qi "LỆCH\|KẸT"; then
        ALERT_COUNT=$((ALERT_COUNT + 1))
        echo "⚠️ ${NAMES[$((idx+1))]} LỆCH/KẸT!"
        local fix_result=$(ai_call "${NAMES[$((idx+1))]} bị LỆCH/KẸT.
Task: $(get_task $idx)
Output 1 dòng: P$idx|ACTION|fix description" 80)
        local parsed=$(echo "$fix_result" | grep "^P[0-3]|" | head -1)
        if [ -n "$parsed" ]; then
            echo "$parsed" | IFS='|' read -r t action desc
            local cmd=$(action_to_command "$action" "$desc")
            echo "  🔧 P$idx ← $cmd"
            $DISPATCH "P$idx" "$cmd" 2>/dev/null
            echo "[$(date +%H:%M:%S)] FIX P$idx: $cmd" >> "$REPORT_DIR/drift_log.txt"
        fi
    fi
}

# ═══ REPORT ═══
write_report() {
    local report="$REPORT_DIR/report_$(date +%H%M).md"
    {
        echo "# 🧠 CTO Brain Report — $(date '+%Y-%m-%d %H:%M')"
        echo "## Model: $MODEL | Dispatched: $DISPATCHED_TASKS | Alerts: $ALERT_COUNT"
        for i in 0 1 2 3; do
            local pout=$(get_pane_output $i 15)
            echo "### ${NAMES[$((i+1))]} — $(get_pane_status "$pout")"
            echo '```'
            clean_log "$pout" | tail -5
            echo '```'
        done
        echo "## Git: $(git log --oneline -3 2>/dev/null)"
    } > "$report"
    echo "📝 $(basename $report)"
}

# ═══════════════════════════════════════
# MAIN LOOP — FULLY AUTONOMOUS
# ═══════════════════════════════════════

echo "╔═══════════════════════════════════════════════════╗"
echo "║  🧠 CTO BRAIN v2.1 — FULLY AUTONOMOUS           ║"
echo "║  Plan→Dispatch→Watch→Unblock→Redispatch          ║"
echo "║  Model: $MODEL"
echo "║  Plan inbox: $PLAN_INBOX"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "🔄 Loading $MODEL..."
ai_call "OK" 5 > /dev/null 2>&1
echo "✅ CTO Brain tự vận hành — Antigravity CHỈ ghi plan.md"
echo ""

while true; do
    CYCLE=$((CYCLE + 1))
    clear
    
    echo "═══ 🧠 CTO v2.1 $(date +%H:%M:%S) ═══ cycle:$CYCLE dispatched:$DISPATCHED_TASKS alerts:$ALERT_COUNT ═══"
    echo ""

    # 1. PLAN INBOX
    check_plan_inbox && sleep 5

    # 2. AUTO-UNBLOCK (mỗi cycle — critical)
    auto_unblock_prompts

    # 3. SYSTEM
    echo "RAM: $(vm_stat | awk '/Pages active/ {printf "%.0f", $3*4096/1048576}') MB | Git: $(git log --oneline -1 2>/dev/null | head -c 60)"
    echo ""

    # 4. SCAN WORKERS
    for i in 0 1 2 3; do
        pout=$(get_pane_output $i 20)
        pstatus=$(get_pane_status "$pout")
        clean=$(clean_log "$pout" | tail -4)
        
        case $pstatus in
            WORKING) icon="🔥";; DONE) icon="✅";;
            EXITED) icon="💤";; *) icon="⏳";;
        esac
        
        echo "┌─ ${NAMES[$((i+1))]} ── $icon $pstatus"
        echo "$clean" | while read -r line; do
            [ -n "$line" ] && echo "│ $line"
        done
        
        if [ $((CYCLE % 3)) -eq 0 ] && [ "$pstatus" = "WORKING" ]; then
            echo "│"
            analysis=$(analyze_agent $i "$pout" "$pstatus")
            echo "$analysis" | while read -r aline; do
                [ -n "$aline" ] && echo "│ 🧠 $aline"
            done
            handle_drift $i "$analysis"
        fi
        
        echo "└──────────"
        echo ""
    done

    # 5. AUTO-REDISPATCH IDLE (every 5 cycles = ~1 min)
    if [ $((CYCLE % 5)) -eq 0 ]; then
        auto_redispatch_idle
    fi

    # 6. REPORT (every 15 cycles = ~3 min)
    if [ $((CYCLE % 15)) -eq 0 ]; then
        write_report
    fi
    
    echo "📨 Inbox: $([ -f "$PLAN_INBOX" ] && echo "📬 NEW PLAN!" || echo "empty") | Next scan: 12s"

    sleep 12
done
