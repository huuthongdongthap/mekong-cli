# LinkEduVN — Mô hình dòng tiền & thu phí chi tiết

## Tổng quan

LinkEduVN là **trung gian kết nối** (platform/coordinator), KHÔNG phải cơ sở đào tạo. → Không thu học phí trực tiếp từ học viên. → Thu phí dịch vụ từ **trường** và **doanh nghiệp**.

---

## 1. Các bên trong hệ sinh thái

```
┌──────────────────────────────────────────────────────────┐
│                   HỆ SINH THÁI LINKEDUVN                  │
│                                                           │
│  ┌──────────┐   đặt hàng    ┌──────────────┐  tuyển dụng  │
│  │ Doanh    │ ──────────→   │              │ ──────────→  │
│  │ nghiệp  │ ←──────────   │  LinkEduVN   │              │
│  │ (DN)    │   CTĐT + KQ    │  (trung gian)│              │
│  └──────────┘                └──────┬───────┘              │
│                                     │ kết nối             │
│                            ┌────────▼────────┐             │
│                            │   Trường Nghề  │ ←── học phí  │
│                            │   / ĐH / CĐ    │            │
│                            └───────┬────────┘             │
│                                    │ đào tạo              │
│                            ┌───────▼────────┐             │
│                            │   Học viên    │              │
│                            └───────────────┘             │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Dòng tiền chi tiết

### 2.1 Doanh nghiệp → LinkEduVN (5 kênh thu)

| # | Nguồn thu | Giá | Tần suất | Điều kiện thu |
|---|-----------|-----|----------|---------------|
| 1 | **Đặt hàng CTĐT** (Setup fee) | 15-30M VNĐ/CTĐT | Một lần / chương trình | Khi trường đăng ký chương trình mới |
| 2 | **Phí dịch vụ tuyển dụng** (Placement fee) | 10-25% lương tháng đầu / HV | Mỗi lần có việc làm | HV tốt nghiệp + được nhận vào DN |
| 3 | **Học phí liên kết quốc tế** (SSW/EPS/GIZ) | Giá thị trường đối tác | Tháng / học kỳ | HV đi học ở nước ngoài |
| 4 | **SaaS platform** (LMS/CRM) | 5-15M VNĐ/tháng / trường | Hàng tháng | License năm đầu miễn phí |
| 5 | **Hội thảo & Tư vấn** | 20-50M VNĐ/đợt | Theo sự kiện | DN tham gia |

### 2.2 LinkEduVN trả cho đối tác

| Đối tác | Chi trả | Loại |
|---------|---------|------|
| **Trường** | 5-8% học phí/sinh viên/năm | Revenue share |
| **Giảng viên thực hành** | Theo buổi thực hành tại DN | Hợp đồng dịch vụ |
| **Giảng viên ngoại ngữ** | Theo giờ / giảng dạy | Hợp đồng dịch vụ |
| **Học viên ưu tú** | Học bổng (từ quỹ) | Chi phí hỗ trợ |

### 2.3 Cấu trúc chi phí LinkEduVN

```
                    THU
           ┌──────────────┐
           │   100%        │
           └──────┬───────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
   60-70%       25-30%      5-10%
   (COGS)      (Opex)      (Học bổng)
      │           │           │
   ┌──▼───┐   ┌──▼──┐    ┌───▼────┐
   │Chi cho│   │Nhân │   │Quỹ học │
   │trường │   │sự   │   │bổng    │
   │+GV    │   │+IT  │   │        │
   └───────┘   └─────┘   └────────┘
```

---

## 3. Phân tích dòng tiền theo giai đoạn

### Y1 (12 tháng đầu)

```
THU
├── 5 trường × 1 CTĐT/school × 20M = 100M
├── 20 DN × 5 HV placed × 8M HV = 800M  (phí đặt hàng tái ký)
├── 20 DN × 10 HV training × 5M = 2,000M  (phí đào tạo HV)
├── 500 HV × 8M/tháng × 12 = 48,000M  (SSW/EPS/GIZ tuition)
├── 5 trường × 10M SaaS/tháng × 12 = 600M
└── 2 hội thảo × 30M = 60M
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG THU Y1: ~51,560M (~51.6 tỷ VND ≈ ~2.06 triệu USD @ 25,000 VND/USD)

CHI
├── Chi cho trường (revenue share): 48,000M × 6% = 2,880M
├── Giảng viên + thực hành: 500M/tháng × 12 = 6,000M
├── Nhân sự: 12 người × 15M/tháng × 12 = 2,160M
├── Pháp lý + có sở: 200M/tháng × 12 = 2,400M
├── Marketing: 500M/tháng × 12 = 6,000M
├── Công nghệ (server, tooling): 300M/tháng × 12 = 3,600M
├── Văn phòng: 200M/tháng × 12 = 2,400M
└── Quỹ học bổng (5% doanh thu): ~1,300M
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG CHI Y1: ~24,740M

LỢI NHUẬN Y1: ~26,820M (~780M/tháng EBITDA)
```

> Lưu: Revenue model này có điều kiện — SSW ko phải áp dụng từ tháng 1. Y1 thực tế chủ yếu từ DN đặt hàng (không học phí học viên).

### Y2 (20 trường, 100 DN, 3,000 HV)

```
THU Y2 (ước)
├── CTĐT setup: 20 × 3 CTĐT × 20M = 1,200M
├── Placement fee: 100 DN × 30 HV × 10M = 30,000M
├── Học phí liên kết: 3,000 HV × 8M × 12 = 288,000M
├── SaaS: 20 × 12M × 12 = 2,880M
├── Tư vấn: 10 đợt × 35M = 350M
└── SSW/EPS expand: +80,000M
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG THU Y2: ~402,430M ≈ 12 tỷ VND (trung bình 10-15 tỷ theo live page)

CHI Y2 (ước)
├── Revenue share trường + GV: ~25,000M
├── Nhân sự (25 người): ~4,500M
├── Marketing: ~15,000M
├── Chi phí khác: ~20,000M
└── Quỹ học bổng (5%): ~18,000M
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG CHI Y2: ~82,500M

LỢI NHUẬN Y2: ~320 tỷ VND
```

### Y3 (50 trường, 300 DN, 10,000 HV)

```
TỔNG THU Y3: ~30-50 tỷ VND (theo live page)
→ EBITDA Margin ~70%
```

---

## 4. Đề xuất kết hợp học phí học viên → quỹ học bổng

### 4.1 Cơ chế đề xuất

```
HIỆN TẠI HV (VND):
Học viên ──trả học phí──→ Trường (6-10M/tháng)
Trường ──5-8% rev share──→ LinkEduVN

ĐỀ XUẤT (bổ sung):
Học viên ──đóng 5% học phí──→ Quỹ học bổng (linkededu.vn/scholarship)
                          ↓
            ┌─────────────┴──────────────┐
            │   Phân bổ học bổng         │
            │  • HV ưu tú (100%)        │
            │  • HV khó khăn (50-80%)   │
            └────────────────────────────┘
```

### 4.2 Cách thức triển khai

**Giai đoạn 1 (Y1) — Làm sạch cơ chế:**
- Không thu học phí trực tiếp (LinkEduVN không phải CSGD)
- LinkEduVN chỉ là nền tảng kết nối + thu phí CTĐT + placement fee
- Quỹ học bổng → **Doanh nghiệp đặt hàng** (DN có điều khoản QĐ trong hợp đồng) hoặc **Sự kiện/tiền tài trợ**

**Giai đoạn 2 (Y2+) — Khi có đủ 5 trường:**
- Mỗi trường tự quyết % học phí → quỹ học bổng (theo TT 23/2021 CSGD tự chủ)
- LinkEduVN cung cấp template + công cụ quản lý quỹ (giá thêm: 2-5M/tháng/trường)
- Đây là **DỊCH VỤ ADD-ON** — Không thu phí học viên trực tiếp

### 4.3 Mô hình học phí ngược (Reverse Tuition) — riêng SSW/EPS/GIZ

```
THÔNG THƯỜNG:    HV trả tiền trước → học → ra trường → xin việc
REVERSE TUITION: HV học miễn phí → có việc làm → trả lại 10% lương 3 năm

Ưu điểm:
  ✓ Không cần upfront cost → dễ tiếp cận HV nghèo
  ✓ Lương đầu sau tốt nghiệp cao → HV dễ trả được
  ✓ Incomes contingent → không gánh nặng nếu thất nghiệp

Nhược điểm:
  ✗ Cashflow negative Y1-2 (phải tài trợ trước)
  ✗ Rủi ro HV không trả (10-15% default rate)
  ✗ Cần quỹ vốn ban đầu 5-10 tỷ VND
```

---

## 5. Mô hình tài chính tối ưu đề xuất

```
DOANH NGHIỆP → LinkEduVN (nguồn thu STABLE)     [60-70% revenue]
  ├─ Phí đặt hàng CTĐT: 15-30M/chuyên ngành
  ├─ Phí dịch vụ tuyển dụng: 8-15% lương đầu
  └─ SaaS platform: 5-15M/tháng/trường

HỌC VIÊN → Trường (trường tự thu)               [← học phí không qua LEVN]
  └─ % học phí → quỹ học bổng (mã LEVN gợi ý qua công cụ)

DOANH NGHIỆP → TRỰC TIẾP → QUỸ HỌC BỔNG         [5% revenue → impact fund]
  └─ DN ký hợp đồng có điều khoản "đóng góp xã hội"

QUỸ HỌC BỔNG ──→ IU TRƯỜNG (theo TT 23/2021)   [compliance với pháp luật]
  └─ LEVN cung cấp platform quản lý (thu thêm 2-5M/tháng)
```

---

## 6. Unit Economics

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| CAC (Customer Acquisition Cost) — Trường mới | 50-80M | 30-50M | 20-30M |
| LTV (Giá trị vòng đời trường) | 400M+ | 800M+ | 1,500M+ |
| CAC Payback (tháng) | 3-4 tháng | 2-3 tháng | 1-2 tháng |
| LTV/CAC | 5:1 | 10:1 | 20:1 |
### Org Chart + Hiring Plan
| Năm | FTE | Roles |
|-----|-----|-------|
| Y1 | 10 | CEO, COO, CTO, Biz Dev×2, Content×2, Legal, Finance |
| Y2 | 20 | +Biz Dev×3, Tech×5, Sales×2, Content×1 |
| Y3 | 50+ | +Operations, International, Product, QA, Support |

---
| Gross Margin | 65% | 70% | 75% |
| Runway cần có | ≥18 tháng chi phí cố định |

---

## 7. Kết luận & Khuyến nghị

### Nên kết hợp học phí học viên → quỹ học bổng?
**CÓ** — nhưng không LinkEduVN tự thu. Làm như sau:

1. **LinkEduVN KHÔNG thu học phí học viên** trực tiếp
   - LinkEduVN là doanh nghiệp, không phải CSGD
   - Trường mời học viên → trường thu học phí

2. **Học bổng qua 3 kênh (dự phòng):**
   ```yaml
   Kênh A (40%): Doanh nghiệp đặt hàng có điều khoản học bổng
   Kênh B (40%): Trường tự giữa lại từ học phí (TT 23/2021)
   Kênh C (20%): Sự kiện + tài trợ + fundraising
   ```

3. **LinkEduVN cung cấp giá trị:**
   - Platform quản lý quỹ học bổng (theo dõi, phân bổ, báo cáo)
   - Matching HV cần học bổng ↔ DN tài trợ (AI matching)
   - Báo cáo social impact (cho DN ESG reporting)

4. **Reverse tuition (học phí ngược):** Nên thử nghiệm 1 chương trình pilot (SSW II có tiềm năng nhất). Cần quỹ vốn ban đầu 2-5 tỷ.

---

*Tài liệu này dùng cho đối thoại với co-founder. Cập nhật khi có data thực tế pilottest.*

## 6. AARRR Funnel Metrics
| Metric | Mục tiêu Y1 | Threshold |
|--------|-------------|-----------|
| Acquisition | 5,000 HV (organic + paid) | Y1 |
| Activation | D90 activation ≥ 50% | ≥ 50% |
| Churn | ≤ 10%/tháng | ≤ 10%/tháng |
| Revenue | CTĐT setup + Placement fee + SaaS | ≥ 2-4 tỷ/tháng |
| Referral | HV giới thiệu bạn bè / CTV tuyển sinh | TBD |
