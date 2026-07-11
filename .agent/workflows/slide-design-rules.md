---
description: MANDATORY rules for designing BOOKnBEYOND presentation slides from book content
---

# Slide Design Rules — BOOKnBEYOND

## 🚨 RULE BẮT BUỘC: Đánh Dấu Nguồn Nội Dung

Khi thiết kế slide từ nội dung sách, **PHẢI** phân biệt rõ ràng 3 loại nội dung:

### 1. Nguyên tác (Original) — Không cần badge
- Nội dung **trích dẫn trực tiếp** hoặc **tóm tắt sát nghĩa** từ nguồn lực/chương được giao
- Trích dẫn phải ghi rõ trang (ví dụ: `tr. 213`)

### 2. Mở rộng (Expanded) — Badge `📌 Mở rộng`
- Nội dung **tham khảo từ nguồn lực/chương KHÁC** trong cùng cuốn sách
- Nội dung **bổ sung từ bên ngoài sách**
- Sử dụng badge: `<div class="badge-source badge-expand">📌 Mở rộng — tham khảo [nguồn]</div>`
- Màu: tím (#818cf8), viền tím nhạt

### 3. Ví dụ minh họa (Example) — Badge `💡 Ví dụ minh họa`
- Các **ví dụ do người thiết kế tạo ra** để minh họa cho ý tác giả
- Các đoạn **hội thoại mẫu, tình huống giả định**
- Sử dụng badge: `<div class="badge-source badge-example">💡 Ví dụ minh họa — không trích nguyên văn</div>`
- Màu: vàng gold (#f59e0b), viền vàng nhạt

## CSS Required

```css
.badge-source {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
  border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;
  margin-bottom: 20px;
}
.badge-expand {
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
  color: #818cf8;
}
.badge-example {
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3);
  color: #f59e0b;
}
```

## Quy tắc áp dụng

1. **LUÔN giữ nguyên ý tác giả** — không sửa đổi nội dung gốc
2. **Trích dẫn phải có trang số** — `— Bill George, True North Groups, tr. XXX`
3. **Phần mở rộng đặt SAU phần nguyên tác** trong slide deck
4. **Mỗi slide chỉ nên có MỘT ý chính** (Zen Presentation)
5. **Badge đặt ngay dưới tag và TRƯỚC heading** để người xem thấy ngay

## 🔍 RULE BẮT BUỘC: Kiểm Chứng Thông Tin (Fact-Check)

Trước khi hoàn tất slide, **PHẢI** kiểm chứng tất cả thông tin theo checklist sau:

### Checklist kiểm chứng

1. **Con số & thống kê** — PHẢI khớp nguyên văn với sách
   - Tỷ lệ phần trăm, số tiền, năm, số liệu phải đúng chính xác
   - Không được làm tròn hoặc ước lượng khi sách có con số cụ thể
   - Ví dụ sai: "~3% thị phần công nghệ" khi sách ghi "<0.24% consumer tech ($964B)"

2. **Trích dẫn (quote)** — PHẢI tra cứu nguyên văn
   - Không được dịch ngược từ bản tóm tắt hoặc bài review
   - Tên tác giả phải đúng chính tả (ví dụ: Lev Tolstoy, KHÔNG phải Leo Tolstoy)
   - Tên sách phải đúng ngôn ngữ gốc

3. **Ngữ cảnh** — PHẢI đúng context trong sách
   - Không được lấy thông tin từ chương A gán vào ngữ cảnh chương B
   - Ví dụ sai: Sách nhắc "xe tự lái" ở ngữ cảnh ngụy trang thị trường (tr.41), KHÔNG phải ví dụ R&D đầu tư
   - Nếu suy luận/mở rộng từ ý tác giả → PHẢI gắn badge `📌 Mở rộng`

4. **Số trang** — PHẢI nằm trong phạm vi chương được giao
   - Nếu tham khảo chương khác → gắn badge `📌 Mở rộng`
   - Không được ghi số trang bịa (hallucinated page numbers)

5. **Ví dụ minh họa tự tạo** — PHẢI trung lập và chính xác
   - Tránh ví dụ gây tranh cãi (chính trị, tôn giáo, công ty bị điều tra)
   - Thông tin về công ty/tổ chức phải đúng thực tế

### Quy trình kiểm chứng

```
1. Viết slide xong → Liệt kê TẤT CẢ con số, trích dẫn, tên riêng
2. Tra cứu từng mục trong sách gốc (web search nếu không có sách)
3. So khớp ngữ cảnh: thông tin này nằm ở đâu trong sách? Đúng chương không?
4. Đánh dấu badge cho nội dung suy luận/mở rộng
5. Sửa tất cả sai lệch TRƯỚC KHI commit
```
