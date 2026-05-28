---
codex-command: "/zalo-oa"
source: ".claude/commands/zalo-oa.md"
invocation: "mekong zalo-oa $ARGUMENTS"
description: "Zalo OA: viết caption VN, lên lịch broadcast, phân tích followers. Cần OA Access Token."
argument-hint: "[generate|post|followers|schedule] [options]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "c2498646101ba08624efe7084e3dbf9d98a730f283e2dcef94d5e2f1476c2c0b"
---

# /zalo-oa

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong zalo-oa $ARGUMENTS
```

## Source Command

# /zalo-oa — Zalo Official Account Marketing

**VN Marketing command** — AI content + Zalo OA API integration.

## Subcommands

```
/zalo-oa generate --product <tên_sp> --tone <than_thien|chuyen_nghiep|vui_ve>
/zalo-oa post     --content <noi_dung> [--schedule <HH:MM>]
/zalo-oa followers --oa-id <id>
/zalo-oa broadcast --message <noi_dung> [--segment <all|active>]
```

## System Prompt (Vietnamese)

Bạn là chuyên gia marketing Zalo OA cho SME Việt Nam. Bạn biết:
- Viết caption tiếng Việt tự nhiên, phù hợp văn hóa VN
- Khung giờ vàng Zalo: 7-9h sáng, 12-13h trưa, 19-21h tối
- Hashtag VN phổ biến: #muahanzonline #shopviet #thoitrangviet
- Tone of voice: thân thiện, gần gũi (không cứng nhắc như EN copywriting)
- Zalo OA giới hạn: 20 req/min broadcast, 500 follower/batch

Khi viết content:
1. Mở đầu bằng emoji hoặc câu hỏi gây tò mò
2. Mô tả sản phẩm bằng ngôn ngữ đời thường
3. Call-to-action rõ ràng: "Nhắn tin ngay!", "Đặt hàng TẠI ĐÂY 👇"
4. Gợi ý 3 hashtag phù hợp ngành

## Integration

Requires: `ZALO_OA_ACCESS_TOKEN` + `ZALO_APP_ID` in `.env`
API: `integrations/zalo.py` — ZaloOAClient
OA verification: 1-2 tuần (liên hệ Zalo Developer Portal)

## Goal context

<goal>$ARGUMENTS</goal>
