---
description: "Khởi tạo sách mới cho BOOKnBEYOND — sync Sheet, config, cover, deploy. 1 command, ~10 min."
argument-hint: [tên sách tiếng Việt]
allowed-tools: Read, Write, Bash, Task
---

# /bookclub:new-book — Khởi Tạo Sách Mới

**Workflow command** — chuyển đổi sách hiện tại sang sách mới cho câu lạc bộ BOOKnBEYOND.

## Pipeline

```
SEQUENTIAL:
  ├── 1. sheet-sync       → đọc Google Sheet lấy mục lục thật
  ├── 2. cover-setup      → copy/download ảnh bìa
  ├── 3. config-update    → cập nhật config.json
  ├── 4. chapters-data    → tạo file dữ liệu chương
  ├── 5. library-archive  → đánh dấu sách cũ hoàn thành
  ├── 6. validate         → kiểm tra JSON hợp lệ
  └── 7. deploy           → git commit + push + wrangler deploy
```

## Working directory: /Users/mac/mekong-cli/BOOKnBEYOND

## Input: $ARGUMENTS (tên sách tiếng Việt hoặc tên gốc)

## Step 1: Sheet Sync — LẤY DỮ LIỆU THẬT

> 🚨 **RULE BẮT BUỘC**: Dữ liệu chương PHẢI lấy từ Google Sheet, KHÔNG được tự bịa.

```
Luồng dữ liệu:
Google Sheet → tab tên sách → CSV export → parse → config.json
```

1. Đọc Google Sheet CSV:
   ```
   URL: https://docs.google.com/spreadsheets/d/18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU/gviz/tq?tqx=out:csv
   ```
2. Tìm tab có tên sách mới (cột đầu tiên dòng 1 = tên sách)
3. Parse: Tên chương | Từ trang | Số trang | Tên người đăng ký | Số tuần
4. Xác định lịch tuần từ cột "Số tuần" (format: "Tuần X - DD/MMM")

**Nếu Sheet chưa có tab sách mới** → thông báo user tạo tab trước, STOP.

## Step 2: Cover Setup

1. Nếu user upload ảnh bìa → copy vào `assets/cover-{slug}.png`
2. Nếu không có → search web tìm bìa tiếng Việt → download
3. Slug = tên sách lowercase, không dấu, gạch nối (ví dụ: `metahuman`, `zero-to-one`)

## Step 3: Config Update — `data/config.json`

Cập nhật object `currentBook`:
```json
{
  "title": "Tên tiếng Việt",
  "author": "Tác giả",
  "originalTitle": "Tên gốc tiếng Anh",
  "translator": "Dịch giả (nếu có)",
  "publisher": "NXB",
  "cover": "assets/cover-{slug}.png",
  "totalChapters": N,
  "totalPages": N,
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

Cập nhật array `schedule` từ dữ liệu Sheet:
- Mỗi entry "Tuần X" trong Sheet → 1 object trong schedule
- Các chương giữa 2 mốc tuần → sharers của tuần trước đó
- Giữ nguyên tên người đăng ký nếu Sheet đã có

## Step 4: Chapters Data

Tạo file `data/{slug}-chapters.md` chứa:
- Metadata sách (title, author, cover, dates)
- Bảng chương chi tiết (copy từ Sheet)
- Bảng phân bổ tuần đọc
- Hướng dẫn nhập Google Sheet (cho reference)

## Step 5: Library Archive

Trong `data/config.json`, tìm entry có `"status": "reading"` trong array `library`:
1. Xóa `"status": "reading"`
2. Cập nhật `finishedDate` = endDate của sách cũ
3. Cập nhật `rating` (nếu user cung cấp, mặc định 0)
4. Cập nhật `topInsight` (rút ra từ nội dung sách)
5. Thêm entry mới cho sách mới với `"status": "reading"`

## Step 6: Validate

```bash
python3 -m json.tool data/config.json > /dev/null && echo "✅ JSON valid"
```

## Step 7: Deploy

```bash
git add assets/cover-*.png data/ && \
git commit -m "feat: switch to {tên sách} — new book season" && \
git push origin main && \
npx wrangler pages deploy . --project-name book-and-beyond --branch main --commit-dirty=true
```

## Output

Bảng tóm tắt:
| Item | Status |
|------|--------|
| Sách cũ → Library | ✅ |
| Cover ảnh bìa | ✅ |
| Config.json | ✅ |
| Chapters data | ✅ |
| Schedule (X tuần) | ✅ |
| Deploy live | ✅ |

## Lưu ý quan trọng

- **KHÔNG bao giờ bịa tên chương hoặc số trang** — luôn lấy từ Google Sheet
- **Slide design rules** vẫn áp dụng khi tạo slide tuần sau: đọc `.agent/workflows/slide-design-rules.md`
- **Slide template** lấy từ slide chương 3 Zero to One hoặc slide gần nhất làm base CSS/JS
