#!/bin/zsh
set +e  # NEVER exit on error — CTO must survive
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
ROUND_FILE="/Users/mac/mekong-cli/.cto-reports/fnb/round_state.txt"

# Load persisted round counters (survives restart)
if [[ -f "$ROUND_FILE" ]]; then
    source "$ROUND_FILE"
else
    WORKER_TASK_ROUND=([0]=0 [1]=0 [2]=0 [3]=0)
fi

# F0 = New pages and features
SLOT_0_TASKS=(
    'Tao file moi loyalty-program.html chuong trinh tich diem khach hang VIP voi UI dep trong '$FNB_APP''
    'Tao file moi kitchen-display.html man hinh hien thi don hang realtime cho bep trong '$FNB_APP''
    'Tao file moi staff-schedule.html lich lam viec nhan vien drag drop theo tuan trong '$FNB_APP''
    'Tao file moi analytics-dashboard.html bieu do doanh thu Chart.js top 10 mon ban chay trong '$FNB_APP''
)
# F1 = Interactive components
SLOT_1_TASKS=(
    'Tao file moi table-reservation.html he thong dat ban online chon ngay gio so nguoi trong '$FNB_APP''
    'Tao file moi feedback-form.html form danh gia 5 sao comment upload anh mon an trong '$FNB_APP''
    'Tao file moi promotions.html trang flash sale countdown timer voucher code trong '$FNB_APP''
    'Tao file moi delivery-tracking.html theo doi don giao hang status timeline trong '$FNB_APP''
)
# F2 = JS modules
SLOT_2_TASKS=(
    'Tao file moi js/cart-manager.js module gio hang add remove quantity localStorage tinh tien trong '$FNB_APP''
    'Tao file moi js/order-api.js mock REST API tao don hang goi mon tinh bill trong '$FNB_APP''
    'Tao file moi js/notification.js toast notification system voi bell icon badge count trong '$FNB_APP''
    'Tao file moi js/search-filter.js tim kiem mon theo ten loc theo gia category realtime trong '$FNB_APP''
)
# F3 = Design and content pages
SLOT_3_TASKS=(
    'Tao file moi receipt-template.html va css/print-receipt.css mau in hoa don nhiet A5 trong '$FNB_APP''
    'Tao file moi about-us.html trang gioi thieu quan cafe lich su doi ngu hinh anh trong '$FNB_APP''
    'Tao file moi contact.html ban do Google Maps form lien he so dien thoai email trong '$FNB_APP''
    'Tao file moi gallery.html lightbox slider hinh anh mon an khong gian nha hang trong '$FNB_APP''
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
    # Persist to disk so rotation survives restart
    echo "WORKER_TASK_ROUND=([0]=${WORKER_TASK_ROUND[0]:-0} [1]=${WORKER_TASK_ROUND[1]:-0} [2]=${WORKER_TASK_ROUND[2]:-0} [3]=${WORKER_TASK_ROUND[3]:-0})" > "$ROUND_FILE"
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
                log "⏸️  F$p: QUEUED — skip"
                ;;
            DEAD)
                log "🔧 F$p: DEAD → restart"
                $T send-keys -t "$S:$W.$p" "cd $FNB_APP && claude --dangerously-skip-permissions" Enter
                LAST_DISPATCH[$p]=$((now + 25))
                ;;
            IDLE)
                # ═══ READ 45 LINES CONTEXT BEFORE DISPATCH ═══
                local ctx=$(read_context_45 "$p")
                local summary=$(get_context_summary "$ctx")
                local task=$(get_unique_task "$p" "$ctx")
                
                if safe_dispatch "$p" "$task"; then
                    log "✅ F$p [slot$p] → $(echo $task | head -c 55)..."
                    log "   📖 ctx: $summary"
                    LAST_DISPATCH[$p]=$now
                    DIS=$((DIS + 1))
                fi
                ;;
        esac
    done

    echo "═══ 🧠 FNB-v8 $(date +%H:%M:%S) cy:$CYCLE dis:$DIS ═══"
    sleep 15
done
