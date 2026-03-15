#!/bin/zsh
set +e  # NEVER exit on error — CTO must survive
# ═══════════════════════════════════════════════════════════
# 🧠 CTO SADEC v8 — UNIQUE TASK PER WORKER
#
# RULES:
# 1. Each worker gets a UNIQUE task — no two workers same task
# 2. Read output context to decide next logical step  
# 3. Never dispatch to busy/queued workers
# 4. Task registry ensures diversity
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
LOCK_SEC=60

typeset -A LAST_DISPATCH
LAST_DISPATCH=([0]=0 [1]=0 [2]=0 [3]=0 [4]=0 [5]=0)

# ═══ TASK REGISTRY — each worker slot gets unique task ═══
# 6 workers = 6 different task categories, rotated each round
typeset -A WORKER_TASK_ROUND
ROUND_FILE="/Users/mac/mekong-cli/.cto-reports/sadec/round_state.txt"

# Load persisted round counters (survives restart)
if [[ -f "$ROUND_FILE" ]]; then
    source "$ROUND_FILE"
else
    WORKER_TASK_ROUND=([0]=0 [1]=0 [2]=0 [3]=0 [4]=0 [5]=0)
fi

# Fixed task slots — worker N always gets category N
# Each category has multiple tasks that rotate per round
SLOT_0_TASKS=(
    '/cook "Scan broken links meta tags accessibility audit '$SADEC_APP'"'
    '/cook "Audit security headers CSP CORS XSS '$SADEC_APP'"'
    '/cook "Toi uu SEO metadata og tags structured data '$SADEC_APP'"'
)
SLOT_1_TASKS=(
    '/dev-feature "Build notification system toast messages '$SADEC_APP'"'
    '/dev-feature "Them dark mode theme switching '$SADEC_APP'"'
    '/dev-feature "Build dashboard widgets charts KPIs '$SADEC_APP'/admin"'
)
SLOT_2_TASKS=(
    '/dev-bug-sprint "Fix console errors broken imports warnings '$SADEC_APP'"'
    '/dev-bug-sprint "Viet them tests tang coverage '$SADEC_APP'"'
    '/dev-bug-sprint "Debug fix loi visual UI alignment '$SADEC_APP'"'
)
SLOT_3_TASKS=(
    '/frontend-responsive-fix "Fix responsive 375px 768px 1024px '$SADEC_APP'"'
    '/frontend-responsive-fix "Fix mobile navigation hamburger menu '$SADEC_APP'"'
    '/frontend-responsive-fix "Fix tablet layout grid spacing '$SADEC_APP'"'
)
SLOT_4_TASKS=(
    '/eng-tech-debt "Refactor DRY shared utils consolidate '$SADEC_APP'"'
    '/eng-tech-debt "Remove dead code unused imports '$SADEC_APP'"'
    '/eng-tech-debt "Optimize bundle size tree shake '$SADEC_APP'"'
)
SLOT_5_TASKS=(
    '/cook "Toi uu performance minify CSS JS lazy load '$SADEC_APP'"'
    '/dev-pr-review "Review code quality patterns '$SADEC_APP'"'
    '/release-ship "Git commit push release notes '$SADEC_APP'"'
)

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

get_unique_task() {
    local worker=$1
    local ctx="$2"
    local round=${WORKER_TASK_ROUND[$worker]:-0}
    
    case "$worker" in
        0) local arr=("${SLOT_0_TASKS[@]}"); local sz=${#SLOT_0_TASKS[@]} ;;
        1) local arr=("${SLOT_1_TASKS[@]}"); local sz=${#SLOT_1_TASKS[@]} ;;
        2) local arr=("${SLOT_2_TASKS[@]}"); local sz=${#SLOT_2_TASKS[@]} ;;
        3) local arr=("${SLOT_3_TASKS[@]}"); local sz=${#SLOT_3_TASKS[@]} ;;
        4) local arr=("${SLOT_4_TASKS[@]}"); local sz=${#SLOT_4_TASKS[@]} ;;
        5) local arr=("${SLOT_5_TASKS[@]}"); local sz=${#SLOT_5_TASKS[@]} ;;
    esac
    
    local idx=$(( (round % sz) + 1 ))
    WORKER_TASK_ROUND[$worker]=$((round + 1))
    # Persist rotation
    echo "WORKER_TASK_ROUND=([0]=${WORKER_TASK_ROUND[0]:-0} [1]=${WORKER_TASK_ROUND[1]:-0} [2]=${WORKER_TASK_ROUND[2]:-0} [3]=${WORKER_TASK_ROUND[3]:-0} [4]=${WORKER_TASK_ROUND[4]:-0} [5]=${WORKER_TASK_ROUND[5]:-0})" > "$ROUND_FILE"
    echo "${arr[$idx]}"
}

get_worker_state() {
    local p=$1
    local raw=$($T capture-pane -t "$S:$W.$p" -p 2>/dev/null | tail -5 || echo "")
    
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
        log "🚫 S$p: ABORT — busy before dispatch"
        return 1
    fi
    
    $T send-keys -t "$S:$W.$p" Escape 2>/dev/null
    sleep 0.3
    $T send-keys -t "$S:$W.$p" "$task" Enter
    return 0
}

echo "╔══════════════════════════════════════════╗"
echo "║ 🧠 CTO SADEC v8 — UNIQUE SLOTS         ║"
echo "║ S0=scan S1=feature S2=bugfix S3=resp    ║"
echo "║ S4=refactor S5=perf  | No duplicates    ║"
echo "╚══════════════════════════════════════════╝"

while true; do
    CYCLE=$((CYCLE + 1))

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
                log "⏸️  S$p: QUEUED — skip"
                ;;
            DEAD)
                log "🔧 S$p: DEAD → restart CC CLI"
                $T send-keys -t "$S:$W.$p" "cd $SADEC_APP && claude --dangerously-skip-permissions" Enter
                LAST_DISPATCH[$p]=$((now + 25))
                ;;
            IDLE)
                # ═══ READ 45 LINES CONTEXT BEFORE DISPATCH ═══
                local ctx=$(read_context_45 "$p")
                local summary=$(get_context_summary "$ctx")
                local task=$(get_unique_task "$p" "$ctx")
                
                if safe_dispatch "$p" "$task"; then
                    log "✅ S$p [slot$p] → $(echo $task | head -c 55)..."
                    log "   📖 ctx: $summary"
                    LAST_DISPATCH[$p]=$now
                    DIS=$((DIS + 1))
                fi
                ;;
        esac
    done

    echo "═══ 🧠 SADEC-v8 $(date +%H:%M:%S) cy:$CYCLE dis:$DIS ═══"
    sleep 12
done
