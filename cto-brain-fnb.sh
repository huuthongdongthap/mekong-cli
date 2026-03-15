#!/bin/zsh
# ═══════════════════════════════════════════════════════════
# 🧠 CTO F&B v8 — UNIQUE TASK PER WORKER
#
# RULES:
# 1. Each worker gets a UNIQUE task — no two workers same task
# 2. Fixed slot assignment: F0=scan F1=feature F2=bugfix F3=UI
# 3. Never dispatch to busy/queued workers
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

typeset -A WORKER_TASK_ROUND
WORKER_TASK_ROUND=([0]=0 [1]=0 [2]=0 [3]=0)

# F0 = Scan / Audit / SEO / Performance
SLOT_0_TASKS=(
    '/cook "Scan broken links accessibility audit '$FNB_APP'"'
    '/cook "Toi uu Core Web Vitals LCP FCP CLS '$FNB_APP'"'
    '/cook "Audit security headers CSP CORS '$FNB_APP'"'
    '/cook "Them SEO metadata structured data '$FNB_APP'"'
)
# F1 = Features / Build
SLOT_1_TASKS=(
    '/dev-feature "Them dark mode toggle theme switching '$FNB_APP'"'
    '/dev-feature "Build customer reviews rating '$FNB_APP'/menu.html"'
    '/dev-feature "Build payment QR VNPay MoMo '$FNB_APP'/checkout.html"'
    '/dev-feature "Them i18n da ngon ngu Vietnamese English '$FNB_APP'"'
)
# F2 = Bug Fix / Test
SLOT_2_TASKS=(
    '/dev-bug-sprint "Fix console errors broken links '$FNB_APP'"'
    '/dev-bug-sprint "Viet tests verify components '$FNB_APP'"'
    '/dev-bug-sprint "Fix loi visual alignment spacing '$FNB_APP'"'
    '/frontend-responsive-fix "Fix responsive 375px 768px 1024px '$FNB_APP'"'
)
# F3 = UI / Refactor / Release
SLOT_3_TASKS=(
    '/frontend-ui-build "Nang cap UI animations skeleton loading '$FNB_APP'"'
    '/eng-tech-debt "Refactor DRY shared components '$FNB_APP'"'
    '/release-ship "Git commit push release notes deploy Cloudflare '$FNB_APP'"'
    '/dev-pr-review "Review code quality patterns '$FNB_APP'"'
)

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

get_unique_task() {
    local worker=$1
    local round=${WORKER_TASK_ROUND[$worker]:-0}
    
    case "$worker" in
        0) local arr=("${SLOT_0_TASKS[@]}"); local sz=${#SLOT_0_TASKS[@]} ;;
        1) local arr=("${SLOT_1_TASKS[@]}"); local sz=${#SLOT_1_TASKS[@]} ;;
        2) local arr=("${SLOT_2_TASKS[@]}"); local sz=${#SLOT_2_TASKS[@]} ;;
        3) local arr=("${SLOT_3_TASKS[@]}"); local sz=${#SLOT_3_TASKS[@]} ;;
    esac
    
    local idx=$(( (round % sz) + 1 ))
    WORKER_TASK_ROUND[$worker]=$((round + 1))
    echo "${arr[$idx]}"
}

get_worker_state() {
    local p=$1
    local raw=$($T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -5)
    
    if echo "$raw" | grep -qE "esc to"; then
        echo "BUSY"; return
    fi
    if echo "$raw" | grep -qE "thinking|Unfurling|Precipitating|Stewing|Pondering|Whirlpooling|Crunching|Clauding|Symbioting|Envisioning|Simmering"; then
        echo "BUSY"; return
    fi
    if echo "$raw" | grep -qE "queued messages|Press up to edit"; then
        echo "QUEUED"; return
    fi
    if echo "$raw" | grep -qE "◻|◼|pending|completed"; then
        echo "BUSY"; return
    fi
    if echo "$raw" | grep -qE "Read.*file|Write\(|Bash\(|Searched|Created|Updated|ctrl\+o|ctrl\+c"; then
        echo "BUSY"; return
    fi
    if echo "$raw" | grep -qE "approve edit|confirm|Enter to select|navigate.*Esc|Compacting"; then
        echo "BUSY"; return
    fi
    if echo "$raw" | grep -qE "bypass permissions|shortcuts"; then
        echo "IDLE"; return
    fi
    echo "DEAD"
}

safe_dispatch() {
    local p=$1
    local task="$2"
    
    local verify=$($T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -3)
    
    if echo "$verify" | grep -qE "thinking|esc to|◻|◼|queued|Read|Write|Bash|Searched|Compacting|Press up"; then
        log "🚫 F$p: ABORT — busy"
        return 1
    fi
    
    $T send-keys -t "$S:$W.$p" Escape 2>/dev/null
    sleep 0.3
    $T send-keys -t "$S:$W.$p" "$task" Enter
    return 0
}

echo "╔══════════════════════════════════════════╗"
echo "║ 🧠 CTO F&B v8 — UNIQUE SLOTS           ║"
echo "║ F0=scan/perf F1=feature F2=bug/test     ║"
echo "║ F3=UI/refactor | No duplicates          ║"
echo "╚══════════════════════════════════════════╝"

while true; do
    ((CYCLE++))

    for ((p=0; p<NP; p++)); do
        local now=$(date +%s)
        local last=${LAST_DISPATCH[$p]:-0}
        local age=$((now - last))
        
        if (( age < LOCK_SEC )); then
            continue
        fi
        
        local state=$(get_worker_state "$p")
        
        case "$state" in
            BUSY)
                LAST_DISPATCH[$p]=$now
                ;;
            QUEUED)
                LAST_DISPATCH[$p]=$now
                log "⏸️  F$p: QUEUED — skip"
                ;;
            DEAD)
                log "🔧 F$p: DEAD → restart"
                $T send-keys -t "$S:$W.$p" "cd $FNB_APP && claude --dangerously-skip-permissions" Enter
                LAST_DISPATCH[$p]=$((now + 25))
                ;;
            IDLE)
                local task=$(get_unique_task "$p")
                
                if safe_dispatch "$p" "$task"; then
                    log "✅ F$p [slot$p] → $(echo $task | head -c 60)..."
                    LAST_DISPATCH[$p]=$now
                    ((DIS++))
                fi
                ;;
        esac
    done

    echo "═══ 🧠 FNB-v8 $(date +%H:%M:%S) cy:$CYCLE dis:$DIS ═══"
    sleep 15
done
