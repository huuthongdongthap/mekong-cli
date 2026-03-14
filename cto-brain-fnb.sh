#!/bin/zsh
# ═══════════════════════════════════════════════════════════
# 🧠 CTO F&B v7 — CONTEXT-AWARE + ANTI-OVERLAP
#
# RULES:
# 1. Read worker output FIRST → decide next task
# 2. NEVER dispatch to busy/queued workers
# 3. NEVER duplicate tasks across workers
# 4. Single atomic pane read per worker per cycle
# ═══════════════════════════════════════════════════════════

FNB_APP="/Users/mac/mekong-cli/apps/fnb-caffe-container"
T="/opt/homebrew/bin/tmux"
S="tom_hum"
W="fnb"
NP=4
LOG="/Users/mac/mekong-cli/.cto-reports/fnb/cto-fnb.log"

mkdir -p /Users/mac/mekong-cli/.cto-reports/fnb

CYCLE=0
DIS=0
LOCK_SEC=60

typeset -A LAST_DISPATCH
LAST_DISPATCH=([0]=0 [1]=0 [2]=0 [3]=0)

DISPATCHED_LIST=""

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

get_worker_snapshot() {
    local p=$1
    $T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -15
}

get_worker_state() {
    local snap="$1"
    local last5=$(echo "$snap" | tail -5)
    
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
    
    if echo "$last5" | grep -qE "bypass permissions|shortcuts"; then
        echo "IDLE"; return
    fi
    
    echo "DEAD"
}

classify_completed_work() {
    local ctx="$1"
    
    if echo "$ctx" | grep -qiE "commit|push|release|deploy|shipped|cloudflare"; then
        echo "SHIPPED"
    elif echo "$ctx" | grep -qiE "test.*pass|tests.*pass|coverage|jest|vitest"; then
        echo "TESTED"
    elif echo "$ctx" | grep -qiE "fix.*bug|debug|console.*error|broken.*link|error.*fix"; then
        echo "FIXED"
    elif echo "$ctx" | grep -qiE "responsive|breakpoint|375px|768px|mobile"; then
        echo "RESPONSIVE"
    elif echo "$ctx" | grep -qiE "refactor|duplicate|tech.*debt|cleanup|DRY"; then
        echo "REFACTORED"
    elif echo "$ctx" | grep -qiE "build|creat|implement|feature|add.*page|dark.*mode|payment|i18n|component"; then
        echo "BUILT"
    elif echo "$ctx" | grep -qiE "review|audit|scan|accessibility|quality|security"; then
        echo "REVIEWED"
    elif echo "$ctx" | grep -qiE "performance|minify|lazy.*load|lighthouse|cache|skeleton|animation"; then
        echo "OPTIMIZED"
    else
        echo "UNKNOWN"
    fi
}

pick_next_task() {
    local phase="$1"
    
    case "$phase" in
        BUILT)
            echo '/dev-bug-sprint "Viet tests verify code vua build trong '$FNB_APP'"'
            ;;
        TESTED)
            echo '/frontend-responsive-fix "Fix responsive 375px 768px 1024px '$FNB_APP'"'
            ;;
        FIXED)
            echo '/cook "Toi uu Core Web Vitals performance '$FNB_APP'"'
            ;;
        RESPONSIVE)
            echo '/dev-pr-review "Review code quality accessibility '$FNB_APP'"'
            ;;
        REVIEWED)
            echo '/dev-feature "Build next feature dua tren review '$FNB_APP'"'
            ;;
        REFACTORED)
            echo '/dev-bug-sprint "Run tests verify refactor '$FNB_APP'"'
            ;;
        OPTIMIZED)
            echo '/dev-feature "Them dark mode payment QR i18n '$FNB_APP'"'
            ;;
        SHIPPED)
            echo '/cook "Scan loi moi sau deploy broken links '$FNB_APP'"'
            ;;
        *)
            echo '/cook "Scan project status broken links '$FNB_APP'"'
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
        '/eng-tech-debt "Refactor DRY shared components '$FNB_APP'"'
        '/cook "Them SEO metadata structured data '$FNB_APP'"'
        '/dev-feature "Build customer reviews rating '$FNB_APP'/menu.html"'
        '/frontend-ui-build "Nang cap UI animations skeleton '$FNB_APP'"'
    )
    echo "${tasks[$((worker % ${#tasks[@]} + 1))]}"
}

safe_dispatch() {
    local p=$1
    local task="$2"
    
    local verify=$($T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -3)
    
    if echo "$verify" | grep -qE "thinking|esc to|◻|◼|queued|Read|Write|Bash|Searched|Compacting"; then
        log "🚫 F$p: ABORT — worker busy before dispatch"
        return 1
    fi
    
    if echo "$verify" | grep -qE "queued messages|Press up to edit"; then
        log "🚫 F$p: ABORT — queued messages"
        return 1
    fi
    
    $T send-keys -t "$S:$W.$p" Escape 2>/dev/null
    sleep 0.3
    
    $T send-keys -t "$S:$W.$p" "$task" Enter
    return 0
}

echo "╔══════════════════════════════════════════╗"
echo "║ 🧠 CTO F&B v7 — ANTI-OVERLAP           ║"
echo "║ Atomic read | Pre-dispatch verify       ║"
echo "║ No queue stacking | Context-aware       ║"
echo "╚══════════════════════════════════════════╝"

DISPATCHED_LIST=""

while true; do
    ((CYCLE++))
    
    if (( CYCLE % 4 == 0 )); then
        DISPATCHED_LIST=""
    fi

    for ((p=0; p<NP; p++)); do
        local now=$(date +%s)
        local last=${LAST_DISPATCH[$p]:-0}
        local age=$((now - last))
        
        if (( age < LOCK_SEC )); then
            continue
        fi
        
        local snap=$(get_worker_snapshot "$p")
        local state=$(get_worker_state "$snap")
        
        case "$state" in
            BUSY)
                LAST_DISPATCH[$p]=$now
                ;;
            QUEUED)
                LAST_DISPATCH[$p]=$now
                log "⏸️  F$p: QUEUED — skip, wait for clear"
                ;;
            DEAD)
                log "🔧 F$p: DEAD → restarting CC CLI"
                $T send-keys -t "$S:$W.$p" "cd $FNB_APP && claude --dangerously-skip-permissions" Enter
                LAST_DISPATCH[$p]=$((now + 25))
                ;;
            IDLE)
                local phase=$(classify_completed_work "$snap")
                local task=$(pick_next_task "$phase")
                
                if is_duplicate_task "$task"; then
                    task=$(get_fallback_task "$p")
                    log "⚡ F$p: duplicate → fallback"
                fi
                
                if safe_dispatch "$p" "$task"; then
                    log "✅ F$p [$phase] → $(echo $task | head -c 55)..."
                    LAST_DISPATCH[$p]=$now
                    DISPATCHED_LIST="$DISPATCHED_LIST|$(echo $task | grep -oE '/[a-z-]+ "' | head -1)"
                    ((DIS++))
                fi
                ;;
        esac
    done

    echo "═══ 🧠 FNB-v7 $(date +%H:%M:%S) cy:$CYCLE dis:$DIS ═══"
    sleep 15
done
