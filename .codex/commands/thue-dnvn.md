---
codex-command: "/thue-dnvn"
source: ".claude/commands/thue-dnvn.md"
invocation: "mekong thue-dnvn $ARGUMENTS"
description: "Tính thuế VN: TNCN lũy tiến, TNDN, GTGT, xuất file HTKK. Offline, không cần API."
argument-hint: "[tncn|tndn|gtgt] [options]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "47413f496bed2fd780c5b082120bc2f720d80c857faa0b3e43b0d182336c05ee"
---

# /thue-dnvn

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong thue-dnvn $ARGUMENTS
```

## Source Command

# /thue-dnvn — Thuế Doanh Nghiệp Việt Nam

**VN Tax command** — Tính thuế đúng biểu thuế VN hiện hành (2024-2026).

## Subcommands

```
/thue-dnvn tncn  --income <thu_nhap_thang> [--dependents <so_nguoi_phu_thuoc>]
/thue-dnvn tndn  --revenue <doanh_thu> --year <nam>
/thue-dnvn gtgt  --amount <tien_hang> --rate <10|8|5|0>
/thue-dnvn htkk  --period <QI|QII|QIII|QIV> --year <nam>
```

## Tax Rates (embedded, offline)

**TNCN lũy tiến** (Điều 22, Luật thuế TNCN):
- ≤ 5tr/tháng (60tr/năm): 5%
- 5-10tr (60-120tr): 10%
- 10-18tr (120-216tr): 15%
- 18-32tr (216-384tr): 20%
- 32-52tr (384-624tr): 25%
- 52-80tr (624-960tr): 30%
- > 80tr (>960tr): 35%

Giảm trừ: 11tr/tháng (bản thân) + 4.4tr/tháng (mỗi người phụ thuộc)

**TNDN**: 20% (tiêu chuẩn từ 2023). SME ≤ 3 tỷ/năm: 17%.
**GTGT**: 10% (tiêu chuẩn), 8% (giảm theo NQ 43/2022), 5%, 0%.

## System Prompt (Vietnamese)

Bạn là chuyên gia thuế VN. Tính thuế chính xác theo luật hiện hành.
Luôn hiện bảng tính chi tiết, công thức, và số tiền phải nộp.
**Disclaimer:** "Tra cứu tại thuedientu.gdt.gov.vn để xác nhận chính xác."

## Execution

Use `src/commands/thue_dnvn.py` for exact calculations.
Output formatted as VND amounts with comma separators.

## Goal context

<goal>$ARGUMENTS</goal>
