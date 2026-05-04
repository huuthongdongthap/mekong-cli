#!/bin/bash
SESSION="worker_4p"
tmux has-session -t $SESSION 2>/dev/null && tmux kill-session -t $SESSION
tmux new-session -d -s $SESSION -n "brain" -x 200 -y 50

# Create 2x2 grid
tmux split-window -t $SESSION -h
tmux select-pane -t $SESSION:0.0
tmux split-window -t $SESSION -v
tmux select-pane -t $SESSION:0.2
tmux split-window -t $SESSION -v
tmux select-layout -t $SESSION tiled

# Send commands using -p "prompt" syntax to avoid truncation
# Pane 0: TASK-006
tmux send-keys -t $SESSION:0.0 "cd '/Users/mac/mekong-cli/SALE MLM' && CLAUDE_CONFIG_DIR=~/.claude-developer claude -p '/dev-feature TASK-006: Deploy AI Training Coach & Retention Guard Agents. Cốt lõi Phase 2. Viết background job nhắc nhở daily, trigger alert. Khớp kiến trúc. Bypassing manual review. Save and commit.' --dangerously-skip-permissions" Enter

# Pane 1: TASK-007
tmux send-keys -t $SESSION:0.1 "cd '/Users/mac/mekong-cli/SALE MLM' && CLAUDE_CONFIG_DIR=~/.claude-developer claude -p '/dev-feature TASK-007: Full AI agent deployment. Cốt lõi Phase 3. Hoàn thiện Content Engine, PSN Analyst, Onboarding Bot. Thiết lập RAG pipeline từ log chat. Auto-accept bypass cẩm nang và commit.' --dangerously-skip-permissions" Enter

# Pane 2: TASK-008
tmux send-keys -t $SESSION:0.2 "cd '/Users/mac/mekong-cli/SALE MLM' && CLAUDE_CONFIG_DIR=~/.claude-developer claude -p '/dev-feature TASK-008: Platform SaaS launch for external teams. Nâng cấp DB Multi-tenant. Auto-accept thay đổi và commit.' --dangerously-skip-permissions" Enter

# Pane 3: Standby
tmux send-keys -t $SESSION:0.3 "cd '/Users/mac/mekong-cli/SALE MLM' && clear && echo '🚀 CHẾ ĐỘ STANDBY - Worker 4 ĐÃ SẴN SÀNG NHẬN LỆNH' && CLAUDE_CONFIG_DIR=~/.claude-developer claude --dangerously-skip-permissions" Enter
