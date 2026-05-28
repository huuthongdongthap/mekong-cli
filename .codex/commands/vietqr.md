---
codex-command: "/vietqr"
source: ".claude/commands/vietqr.md"
invocation: "mekong vietqr $ARGUMENTS"
description: "Tạo QR code VietQR chuẩn VN cho thanh toán ngân hàng. 40+ ngân hàng hỗ trợ."
argument-hint: "[generate|check] --amount <số_tiền> --bank <VCB|TCB|MB|...> --account <stk>"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "f8c344d042ed235d160fe3d8e03c33a3a87a0d44108cf59cf040085ea2e994c7"
---

# /vietqr

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong vietqr $ARGUMENTS
```

## Source Command

# /vietqr — VietQR Thanh Toán QR

**VN Payment command** — Tạo QR code chuẩn VietQR cho 40+ ngân hàng VN.

## Subcommands

```
/vietqr generate --amount <so_tien_vnd> --bank <bank_id> --account <so_tk> --desc <mo_ta>
/vietqr banks    (liệt kê ngân hàng hỗ trợ)
/vietqr check    --ref <ma_giao_dich>
```

## Supported Banks (phổ biến)

| Bank ID | Tên ngân hàng |
|---------|--------------|
| VCB | Vietcombank |
| TCB | Techcombank |
| ACB | ACB |
| MB | MB Bank |
| BIDV | BIDV |
| VTB | VietinBank |
| AGR | Agribank |
| VPB | VPBank |
| STB | Sacombank |
| HDB | HDBank |

## Integration

API: `integrations/vietqr.py` — VietQRClient
Endpoint: `https://api.vietqr.io/v2/generate`
Requires: `VIETQR_CLIENT_ID` + `VIETQR_API_KEY` in `.env`
Free tier: 500 QR/ngày

## Output

- QR code PNG (base64)
- Payment link: `https://qr.sepay.vn/...`
- Bank transfer info for manual input

## Goal context

<goal>$ARGUMENTS</goal>
