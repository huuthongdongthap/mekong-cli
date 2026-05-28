import sys
import os
import time

# Thêm đường dẫn tới thư viện turboquant-mlx (native compression)
repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "turboquant-mlx"))
sys.path.append(repo_path)

try:
    from mlx_lm import load, generate
    from turboquant_mlx import apply_patch, make_adaptive_cache
except ImportError as e:
    print(
        f"Lỗi import: {e}. Vui lòng đảm bảo đã chạy pip install -r requirements.txt trong turboquant-mlx"
    )
    sys.exit(1)


def main():
    # Sử dụng bản MLX 6-bit chuẩn chỉnh đã tải
    model_name = "Jackrong/MLX-Qwopus3.5-27B-v3-6bit"
    print(f"Đang tải Qwopus v3 — {model_name}...")

    model, tokenizer = load(model_name)

    # Kích hoạt Metal Attention tốc độ siêu cao từ TurboQuant (Cực kỳ quan trọng)
    apply_patch()

    # Layer-adaptive cache:
    # Giữ 4 lớp đầu cuối (đầu vào & đầu ra) ở chất lượng cao nhất (FP16/FP32).
    # Áp dụng chuẩn nén TurboQuant cực mạnh (3-bit) cho tất cả các lớp ẩn ở giữa.
    # -> Cứu ~50% RAM trong khi vẫn giữ nguyên IQ của model.
    print("Đang khởi tạo TurboQuant Adaptive Cache (3-bit với FP16 boundaries)...")
    cache = make_adaptive_cache(len(model.layers), bits=3, fp16_layers=4)

    # Lưu ý: Mô hình này đã được Distill từ Claude 4.6 Opus, nó hiểu thẻ <think>
    messages = [
        {
            "role": "user",
            "content": "Viết một hàm Python tính số Fibonacci thứ N tối ưu nhất. Nhớ suy luận từng bước một.",
        }
    ]

    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

    print("\n--- ĐANG SINH VĂN BẢN (Kèm tốc độ đo đạc) ---")
    start = time.time()

    # Truyền cache nén của TurboQuant vào tham số cache
    response = generate(model, tokenizer, prompt=prompt, max_tokens=1024, cache=cache, verbose=True)

    end = time.time()
    print(f"\n[Hoàn thành trong {end-start:.2f} giây]")


if __name__ == "__main__":
    main()
