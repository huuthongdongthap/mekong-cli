---
description: "BOOKnBEYOND new book onboarding — toàn bộ quy trình chuyển sách mới"
---

# Workflow: BOOKnBEYOND New Book Onboarding

## Tổng quan

Khi câu lạc bộ hoàn thành 1 cuốn sách và bắt đầu cuốn mới, workflow này tự động hóa toàn bộ quy trình chuyển đổi.

## Điều kiện tiên quyết

1. ✅ Google Sheet đã có tab mới với tên sách, mục lục, lịch tuần
2. ✅ Ảnh bìa sách tiếng Việt (user upload hoặc tìm trên web)
3. ✅ Sách cũ đã hoàn thành (có thể chưa review)

## Luồng dữ liệu (Data Flow)

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│  Google Sheet    │────▶│  parse CSV   │────▶│ config.json  │
│  (tab sách mới) │     │  chapters    │     │ schedule     │
└─────────────────┘     └──────────────┘     └──────────────┘
                                                    │
┌─────────────────┐     ┌──────────────┐           │
│  User upload    │────▶│  assets/     │           │
│  (ảnh bìa)      │     │  cover-*.png │           │
└─────────────────┘     └──────────────┘           │
                                                    ▼
                                             ┌──────────────┐
                                             │  git + deploy│
                                             │  Cloudflare  │
                                             └──────────────┘
```

## Google Sheet Format

Sheet URL: https://docs.google.com/spreadsheets/d/18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU

### Cấu trúc tab sách

| Cột A | Cột B | Cột C | Cột D | Cột E |
|-------|-------|-------|-------|-------|
| Tên chương | Từ trang | Số trang | Tên đăng ký | Tuần + Ngày |

### Ví dụ

```
Meta Human    | Từ trang | Số trang | Tên   | Số tuần
Lời nói đầu  | 8-15     | 8        |       | Tuần 1 - 06/Sep
Tổng quan    | 16-42    | 27       | Giang |
Ch.1         | 44-70    | 27       |       |
Ch.2         | 71-91    | 21       |       | Tuần 2 - 20/Sep
...
```

### Quy tắc parse

1. **Dòng 1** (header): cột A = tên sách
2. **Cột E** chứa "Tuần X": đánh dấu bắt đầu tuần mới
3. **Cột D** có tên: người đã đăng ký chương đó
4. Các dòng có `Số trang = 1` thường là tiêu đề phần (Part header)

## Files cần thay đổi

| File | Hành động |
|------|-----------|
| `data/config.json` | MODIFY — currentBook, schedule, library |
| `data/{slug}-chapters.md` | NEW — dữ liệu chương cho reference |
| `assets/cover-{slug}.png` | NEW — ảnh bìa sách |

## Checklist thực thi

```
[ ] 1. Đọc Google Sheet CSV → parse mục lục
[ ] 2. Copy/download ảnh bìa → assets/
[ ] 3. Cập nhật config.json → currentBook
[ ] 4. Cập nhật config.json → schedule (từ Sheet)
[ ] 5. Cập nhật config.json → library (archive sách cũ + thêm sách mới)
[ ] 6. Tạo data/{slug}-chapters.md
[ ] 7. Validate JSON
[ ] 8. Git commit + push + Cloudflare deploy
[ ] 9. Xác nhận website hiển thị sách mới
```

## Lệnh gọi

```bash
# Claude Code
/bookclub:new-book MetaHuman

# Gemini CLI
/bookclub/new-book MetaHuman

# Antigravity
/bookclub:new-book MetaHuman
```

## Sách đã qua

| # | Sách | Tác giả | Ngày hoàn thành |
|---|------|---------|-----------------|
| 1 | Trò Chơi Vô Cực | Simon Sinek | 23/02/2025 |
| 2 | Flow — Dòng Chảy | Mihaly Csikszentmihalyi | 15/04/2025 |
| 3 | Quản Lý Nghiệp | Geshe Michael Roach | 20/06/2025 |
| 4 | Súng, Vi Trùng và Thép | Jared Diamond | 15/09/2025 |
| 5 | The 4 Pillar Plan | Dr. Rangan Chatterjee | 20/10/2025 |
| 6 | Cuộc Chiến Vi Mạch | Chris Miller | 25/11/2025 |
| 7 | Hồi Ký Lý Quang Diệu | Lý Quang Diệu | 30/12/2025 |
| 8 | Nhóm Chính Bắc | Bill George | 26/04/2026 |
| 9 | Nexus | Yuval Noah Harari | 28/06/2026 |
| 10 | Không đến Một | Peter Thiel | 16/08/2026 |
| 11 | **Siêu Nhân Loại** | **Deepak Chopra** | **Đang đọc** |
