#!/bin/zsh
# =============================================
# Mekong CLI — tmux Vibe Session Auto-Start
# Chạy sau khi Homebrew + tmux đã cài xong
# =============================================

set -e

PROJECT="/Users/mac/.gemini/antigravity/scratch/sadec-marketing-hub"
MEKONG="$HOME/mekong-cli"
SESSION="vibe"

echo "🚀 Starting Mekong Vibe tmux session..."

# Thêm Homebrew vào PATH
eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || true
eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null || true

# Kill old session nếu có
tmux kill-session -t $SESSION 2>/dev/null || true

# Tạo session mới
tmux new-session -d -s $SESSION -x 230 -y 55 -c "$PROJECT"

# === PANE 0 (top-left): CC CLI Main ===
tmux send-keys -t $SESSION "source ~/.zshrc && echo '🤖 P0: CC CLI Main (gemini-3-pro-high)' && claude" Enter

# === PANE 1 (top-right): Qwen Coder ===
tmux split-window -h -t $SESSION -c "$PROJECT"
tmux send-keys -t $SESSION "source ~/.zshrc && echo '⚡ P1: Qwen Coder (DashScope)' && claude-mekong" Enter

# === PANE 2 (bottom-left): Mekong CLI ===
tmux split-window -v -t $SESSION:0.0 -c "$MEKONG"
tmux send-keys -t $SESSION "source ~/.zshrc && echo '🌊 P2: Mekong CLI' && mekong" Enter

# === PANE 3 (bottom-right): Monitor/Git ===
tmux split-window -v -t $SESSION:0.1 -c "$PROJECT"
tmux send-keys -t $SESSION "source ~/.zshrc && echo '📊 P3: Monitor' && git status && tail -f /tmp/openclaw-gateway.log" Enter

# Layout: tiled
tmux select-layout -t $SESSION tiled

# Focus P0
tmux select-pane -t $SESSION:0.0

echo "✅ Session '$SESSION' ready!"
echo "   Attach: tmux attach -t $SESSION"

# Auto-attach
tmux attach-session -t $SESSION
