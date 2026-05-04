#!/bin/bash
# Script để dọn dẹp rác, giải phóng RAM, làm mát máy và giữ máy không tắt khi chạy lệnh
# Cách sử dụng: ./keep_awake.sh <lệnh>

if [ $# -eq 0 ]; then
    echo "⚠️  Vui lòng nhập lệnh cần chạy!"
    echo "👉 Ví dụ: $0 ollama pull qwen3-coder-next"
    exit 1
fi

echo "🧹 BƯỚC 1: Đang dọc dẹp và giải phóng bộ nhớ (RAM/Cache)..."
# Yêu cầu quyền sudo để chạy `purge` - lệnh chuyên dụng của macOS để clear Inactive Memory
sudo purge

# Dọn dẹp bộ nhớ đệm (cache) của hệ thống quản lý gói Homebrew
if command -v brew &> /dev/null; then
    echo "🍺 Đang dọn dẹp cache của Homebrew..."
    brew cleanup
fi

# Xoá cache log của hệ thống (an toàn)
sudo rm -rf /private/var/log/*
echo "✨ Đã dọn dẹp xong dung lượng rác và RAM/VRAM."

echo "❄️ BƯỚC 2: Tạm nghỉ hệ thống để tản nhiệt (Làm mát máy)..."
echo "Chờ 10 giây để CPU/GPU hạ nhiệt độ..."
sleep 10

echo "---------------------------------------------------"
echo "🚀 BƯỚC 3: Bắt đầu chạy lệnh: $@"
echo "☕ Máy Mac của bạn sẽ được kích hoạt chế độ 'Thức' để không tự động sleep..."
echo "---------------------------------------------------"

# Chạy lệnh chặn sleep màn hình & máy
caffeinate -dis "$@"

echo "---------------------------------------------------"
echo "✅ Đã xong tác vụ! Máy Mac trở về thiết lập năng lượng mặc định."
