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
    '/cook "Tao file moi engagement-tracker.html trang theo doi tuong tac khach hang trong '$SADEC_APP'"'
    '/cook "Tao file moi campaign-builder.html tao chien dich marketing drag drop trong '$SADEC_APP'"'
    '/cook "Tao file moi social-scheduler.html len lich dang bai Facebook Instagram trong '$SADEC_APP'"'
)
SLOT_1_TASKS=(
    '/cook "Tao file moi lead-funnel.html pheu chuyen doi khach hang tu cold den hot trong '$SADEC_APP'"'
    '/cook "Tao file moi email-template-editor.html trinh soan email marketing template trong '$SADEC_APP'"'
    '/cook "Tao file moi crm-contacts.html quan ly danh ba khach hang tags notes trong '$SADEC_APP'"'
)
SLOT_2_TASKS=(
    '/cook "Tao file moi js/analytics-engine.js module tinh toan ROI CPL CTR cac chien dich trong '$SADEC_APP'"'
    '/cook "Tao file moi js/ab-testing.js he thong A/B test so sanh 2 phien ban landing page trong '$SADEC_APP'"'
    '/cook "Tao file moi js/form-builder.js module tao form dong keo tha cac truong input trong '$SADEC_APP'"'
)
SLOT_3_TASKS=(
    '/cook "Tao file moi brand-guidelines.html trang huong dan thuong hieu logo mau font trong '$SADEC_APP'"'
    '/cook "Tao file moi content-calendar.html lich noi dung hang thang dang bai theo chu de trong '$SADEC_APP'"'
    '/cook "Tao file moi competitor-analysis.html bang phan tich doi thu canh tranh trong '$SADEC_APP'"'
)
SLOT_4_TASKS=(
    '/cook "Tao file moi seo-audit-tool.html cong cu kiem tra SEO on-page meta title description trong '$SADEC_APP'"'
    '/cook "Tao file moi keyword-research.html nghien cuu tu khoa volume difficulty SERP trong '$SADEC_APP'"'
    '/cook "Tao file moi sitemap-generator.html tao sitemap XML tu dong cho website trong '$SADEC_APP'"'
)
SLOT_5_TASKS=(
    '/cook "Tao file moi report-builder.html xuat bao cao PDF tong hop chien dich marketing trong '$SADEC_APP'"'
    '/cook "Tao file moi client-portal.html cong khach hang xem bao cao thanh toan invoice trong '$SADEC_APP'"'
    '/cook "Tao file moi team-workspace.html khong gian lam viec nhom task board kanban trong '$SADEC_APP'"'
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
