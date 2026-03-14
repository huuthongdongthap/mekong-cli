#!/bin/zsh
# ═══════════════════════════════════════════════════════════
# 🧠 CTO SADEC v7 — CONTEXT-AWARE + ANTI-OVERLAP
#
# RULES:
# 1. Read worker output FIRST → decide next task
# 2. NEVER dispatch to busy/queued workers 
# 3. NEVER duplicate tasks across workers
# 4. Single atomic pane read per worker per cycle
# ═══════════════════════════════════════════════════════════

SADEC_APP="/Users/mac/mekong-cli/apps/sadec-marketing-hub"
T="/opt/homebrew/bin/tmux"
S="tom_hum"
W="0"
NP=6
LOG="/Users/mac/mekong-cli/.cto-reports/sadec/cto-sadec.log"

mkdir -p /Users/mac/mekong-cli/.cto-reports/sadec

CYCLE=0
DIS=0
LOCK_SEC=60  # Increased: give workers more time before re-checking

typeset -A LAST_DISPATCH
LAST_DISPATCH=([0]=0 [1]=0 [2]=0 [3]=0 [4]=0 [5]=0)

DISPATCHED_LIST=""

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

# ═══ SINGLE ATOMIC READ — one tmux call per worker ═══
get_worker_snapshot() {
    local p=$1
    $T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -15
}

# ═══ Worker state from snapshot (no extra tmux calls) ═══
get_worker_state() {
    local snap="$1"
    local last5=$(echo "$snap" | tail -5)
    
    # BUSY indicators (order matters: most definitive first)
    if echo "$last5" | grep -qE "esc to"; then
        echo "BUSY"; return
    fi
    if echo "$last5" | grep -qE "thinking|Unfurling|Precipitating|Stewing|Pondering|Whirlpooling|Crunching|Clauding|Symbioting|Envisioning"; then
        echo "BUSY"; return
    fi
    if echo "$last5" | grep -qE "queued messages|Press up to edit"; then
        echo "QUEUED"; return
    fi
    if echo "$last5" | grep -qE "◻|◼|pending|completed"; then
        echo "BUSY"; return
    fi
    if echo "$last5" | grep -qE "Read.*file|Write\(|Bash\(|Searched|Created|Updated|ctrl\+o|ctrl\+c"; then
        echo "BUSY"; return
    fi
    if echo "$last5" | grep -qE "approve edit|confirm|Enter to select|navigate.*Esc|Compacting"; then
        echo "BUSY"; return
    fi
    
    # IDLE indicators
    if echo "$last5" | grep -qE "bypass permissions|shortcuts"; then
        echo "IDLE"; return
    fi
    
    # No known state = probably dead
    echo "DEAD"
}

# ═══ Classify completed work from full 15-line context ═══
classify_completed_work() {
    local ctx="$1"
    
    if echo "$ctx" | grep -qiE "commit|push|release|deploy|shipped"; then
        echo "SHIPPED"
    elif echo "$ctx" | grep -qiE "test.*pass|tests.*pass|coverage|jest|vitest|playwright"; then
        echo "TESTED"
    elif echo "$ctx" | grep -qiE "fix.*bug|debug|console.*error|broken.*link|error.*fix"; then
        echo "FIXED"
    elif echo "$ctx" | grep -qiE "responsive|breakpoint|375px|768px|mobile"; then
        echo "RESPONSIVE"
    elif echo "$ctx" | grep -qiE "refactor|duplicate|tech.*debt|cleanup|consolidat"; then
        echo "REFACTORED"
    elif echo "$ctx" | grep -qiE "build|creat|implement|feature|add.*page|dark.*mode|SEO|component"; then
        echo "BUILT"
    elif echo "$ctx" | grep -qiE "review|audit|scan|accessibility|quality"; then
        echo "REVIEWED"
    elif echo "$ctx" | grep -qiE "performance|minify|lazy.*load|lighthouse|cache|optimize"; then
        echo "OPTIMIZED"
    else
        echo "UNKNOWN"
    fi
}

pick_next_task() {
    local phase="$1"
    local worker="$2"
    
    case "$phase" in
        BUILT)
            echo '/dev-bug-sprint "Viet tests verify code vua build trong '$SADEC_APP'"'
            ;;
        TESTED)
            echo '/frontend-responsive-fix "Fix responsive 375px 768px 1024px '$SADEC_APP'"'
            ;;
        FIXED)
            echo '/cook "Toi uu performance minify CSS JS lazy load cache '$SADEC_APP'"'
            ;;
        RESPONSIVE)
            echo '/dev-pr-review "Review code quality accessibility audit '$SADEC_APP'"'
            ;;
        REVIEWED)
            echo '/dev-feature "Build next feature dua tren review '$SADEC_APP'"'
            ;;
        REFACTORED)
            echo '/dev-bug-sprint "Run tests verify refactor khong break '$SADEC_APP'"'
            ;;
        OPTIMIZED)
            echo '/dev-feature "Them dark mode theme switching features moi '$SADEC_APP'"'
            ;;
        SHIPPED)
            echo '/cook "Scan broken links meta tags accessibility '$SADEC_APP'"'
            ;;
        *)
            echo '/cook "Scan project status broken links accessibility '$SADEC_APP'"'
            ;;
    esac
}

is_duplicate_task() {
    local task_key=$(echo "$1" | grep -oE '/[a-z-]+ "' | head -1)
    echo "$DISPATCHED_LIST" | grep -q "$task_key"
}

get_fallback_task() {
    local worker=$1
    local tasks=(
        '/eng-tech-debt "Refactor DRY shared utils '$SADEC_APP'"'
        '/cook "Them SEO metadata og tags '$SADEC_APP'"'
        '/dev-feature "Build notification toast messages '$SADEC_APP'"'
        '/frontend-ui-build "Nang cap UI animations hover effects '$SADEC_APP'"'
        '/dev-bug-sprint "Fix console warnings deprecated '$SADEC_APP'"'
        '/cook "Audit security headers CSP CORS '$SADEC_APP'"'
    )
    echo "${tasks[$((worker % ${#tasks[@]} + 1))]}"
}

# ═══ SAFE DISPATCH — pre-dispatch verify + clear queue ═══
safe_dispatch() {
    local p=$1
    local task="$2"
    
    # PRE-DISPATCH VERIFY: read pane ONE MORE TIME right before sending
    local verify=$($T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -3)
    
    # ABORT if worker became busy between check and dispatch
    if echo "$verify" | grep -qE "thinking|esc to|◻|◼|queued|Read|Write|Bash|Searched|Compacting"; then
        log "🚫 S$p: ABORT — worker became busy before dispatch"
        return 1
    fi
    
    # ABORT if queued messages exist — NEVER add to queue
    if echo "$verify" | grep -qE "queued messages|Press up to edit"; then
        log "🚫 S$p: ABORT — queued messages detected"
        return 1
    fi
    
    # CLEAR any stale input before sending
    $T send-keys -t "$S:$W.$p" Escape 2>/dev/null
    sleep 0.3
    
    # DISPATCH
    $T send-keys -t "$S:$W.$p" "$task" Enter
    return 0
}

echo "╔══════════════════════════════════════════╗"
echo "║ 🧠 CTO SADEC v7 — ANTI-OVERLAP         ║"
echo "║ Atomic read | Pre-dispatch verify       ║"
echo "║ No queue stacking | Context-aware       ║"
echo "╚══════════════════════════════════════════╝"

DISPATCHED_LIST=""

while true; do
    ((CYCLE++))
    
    if (( CYCLE % 6 == 0 )); then
        DISPATCHED_LIST=""
    fi

    for ((p=0; p<NP; p++)); do
        local now=$(date +%s)
        local last=${LAST_DISPATCH[$p]:-0}
        local age=$((now - last))
        
        # Lock check
        if (( age < LOCK_SEC )); then
            continue
        fi
        
        # ═══ SINGLE ATOMIC READ ═══
        local snap=$(get_worker_snapshot "$p")
        local state=$(get_worker_state "$snap")
        
        case "$state" in
            BUSY)
                LAST_DISPATCH[$p]=$now
                ;;
            QUEUED)
                # Worker has queued messages — DO NOT dispatch, extend lock
                LAST_DISPATCH[$p]=$now
                log "⏸️  S$p: QUEUED — skipping, wait for queue to clear"
                ;;
            DEAD)
                log "🔧 S$p: DEAD → restarting CC CLI"
                $T send-keys -t "$S:$W.$p" "cd $SADEC_APP && claude --dangerously-skip-permissions" Enter
                LAST_DISPATCH[$p]=$((now + 25))
                ;;
            IDLE)
                # ═══ CONTEXT-AWARE DISPATCH ═══
                local phase=$(classify_completed_work "$snap")
                local task=$(pick_next_task "$phase" "$p")
                
                if is_duplicate_task "$task"; then
                    task=$(get_fallback_task "$p")
                    log "⚡ S$p: duplicate → fallback"
                fi
                
                # ═══ SAFE DISPATCH with pre-verify ═══
                if safe_dispatch "$p" "$task"; then
                    log "✅ S$p [$phase] → $(echo $task | head -c 55)..."
                    LAST_DISPATCH[$p]=$now
                    DISPATCHED_LIST="$DISPATCHED_LIST|$(echo $task | grep -oE '/[a-z-]+ "' | head -1)"
                    ((DIS++))
                fi
                ;;
        esac
    done

    echo "═══ 🧠 SADEC-v7 $(date +%H:%M:%S) cy:$CYCLE dis:$DIS ═══"
    sleep 12
done
