---
name: legal-legal
description: "⚖️ Legal Command - Tuân thủ pháp luật kinh doanh online"
---

## Legal Overview

Hướng dẫn tuân thủ pháp lý cho Agency và SaaS business tại Việt Nam.

## Vietnam Business Registration

### Ngưỡng Đăng Ký Kinh Doanh

| Doanh thu/năm | Yêu cầu |
|---------------|---------|
| < 100M VND | Không bắt buộc |
| 100M - 1B VND | Hộ kinh doanh |
| > 1B VND | Công ty TNHH/CP |

### Loại Hình Doanh Nghiệp

| Loại | Vốn Tối Thiểu | Phù Hợp |
|------|---------------|---------|
| Hộ KD | 0 VND | Freelancer, Solo |
| TNHH 1TV | 0 VND | Agency nhỏ |
| TNHH 2TV+ | 0 VND | Partnership |
| Cổ phần | 0 VND | Startup, VC |

## Tax Obligations

### Cá Nhân (PIT)

| Thu nhập/năm | Thuế suất |
|--------------|-----------|
| < 60M VND | 0% |
| 60M - 120M | 5% |
| 120M - 216M | 10% |
| 216M - 384M | 15% |
| 384M - 624M | 20% |
| 624M - 960M | 25% |
| > 960M | 35% |

### Doanh Nghiệp (CIT)

| Loại | Thuế suất |
|------|-----------|
| Thu nhập DN | 20% |
| Startup công nghệ | 10% (ưu đãi) |

### VAT

| Sản phẩm | VAT |
|----------|-----|
| Phần mềm | 0% (xuất khẩu) |
| Dịch vụ trong nước | 10% |
| Giáo dục | 5% |

## International Revenue (Polar.sh)

### Merchant of Record (MoR)

Polar.sh là MoR = POLAR chịu trách nhiệm thuế VAT/GST toàn cầu.

**Anh chỉ cần**:
1. Khai thuế thu nhập cá nhân/DN tại VN
2. Số tiền = Net amount sau khi Polar đã trừ thuế

### Reporting Requirements

```
Polar Revenue (Gross)
- Polar Fees (5%)
- Global Taxes (by Polar)
= Your Net Revenue
  
→ Khai thuế VN trên Net Revenue này
```

## Contract Templates

### Client Agreement

Các điều khoản cần có:
- [ ] Scope of Work
- [ ] Payment Terms
- [ ] IP Ownership
- [ ] Confidentiality
- [ ] Limitation of Liability
- [ ] Termination

### SaaS Terms of Service

- [ ] Service Description
- [ ] Subscription Terms
- [ ] Data Privacy (PDPA)
- [ ] Refund Policy
- [ ] Acceptable Use

## Data Privacy (PDPA)

### Vietnam PDPA Requirements

| Requirement | Status |
|-------------|--------|
| Privacy Policy | ✅ Required |
| Cookie Consent | ✅ Required |
| Data Processing Agreement | ✅ Required |
| Data Localization | ⚠️ Sensitive data |

### GDPR (EU Customers)

Nếu có khách EU:
- [ ] Cookie Banner
- [ ] Right to Deletion
- [ ] Data Export
- [ ] DPA with processors

## CLI Commands

```bash
# Check legal status
/legal "kiểm tra tuân thủ"

# Tax calculation
/legal/tax "tính thuế $10,000"

# Contract template
/legal/contract "hợp đồng dịch vụ"
```

## Quick Checklist

### Solo/Freelancer

- [ ] Đăng ký MST cá nhân
- [ ] Khai thuế TNCN quý
- [ ] Privacy Policy trên website
- [ ] Terms of Service

### Agency/Company

- [ ] ĐKKD hoặc GCNĐKDN
- [ ] MST doanh nghiệp
- [ ] Khai thuế VAT/CIT hàng tháng/quý
- [ ] Hóa đơn điện tử
- [ ] Hợp đồng lao động (nếu có NV)

## Resources

| Resource | Link |
|----------|------|
| Đăng ký kinh doanh | dangkykinhdoanh.gov.vn |
| Thuế điện tử | thuedientu.gdt.gov.vn |
| Hóa đơn điện tử | einvoice.vn |

---

🏯 **Binh Pháp**: "Biết luật chơi, chơi đúng luật, thắng bền vững"

---

> ⚠️ **Disclaimer**: Đây là hướng dẫn chung. Tham khảo kế toán/luật sư cho case cụ thể.
