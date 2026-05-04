#!/bin/bash
# TurboQuant+ Native Inference Endpoint
# Llama-cpp-turboquant integration designed for Mekong-CLI

cd "$(dirname "$0")"

MODEL_PATH="./models/Qwen3.5-27B.Q5_K_M.gguf"
BINARY_PATH="./llama-cpp-turboquant/build/bin/llama-server"

if [ ! -f "$BINARY_PATH" ]; then
    echo "Llama-server binary not found! Please build llama-cpp-turboquant first."
    exit 1
fi

if [ ! -f "$MODEL_PATH" ]; then
    echo "Model file $MODEL_PATH not found! Please download the GGUF model first."
    exit 1
fi

# Tối ưu cho M1 Max:
# -ctk q8_0 -ctv turbo4: Nén V-cache 4-bit, giữ nguyên K-cache Q8 an toàn tuyệt đối cho lý luận
# -c 32768: Gấp 4 lần context window thông thường nhờ TurboQuant+
# -ngl 99: Đẩy toàn bộ tác vụ lên GPU Apple Silicon
# -fa on: Flash attention

echo "Khởi động TurboQuant+ Server cho Qwen3.5-27B..."
echo "API Endpoint: http://127.0.0.1:8080/v1"

exec "$BINARY_PATH" \
  -m "$MODEL_PATH" \
  --alias "qwen-turboquant" \
  -ctk q8_0 \
  -ctv turbo4 \
  -fa on \
  -ngl 99 \
  -c 32768 \
  --host 127.0.0.1 \
  --port 8080 \
  --metrics
