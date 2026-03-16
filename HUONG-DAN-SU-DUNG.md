# 📦 Bộ tài liệu cho Mekong Agency — Hướng dẫn sử dụng

## Cách deploy vào project

### Bước 1: Copy CLAUDE.md (BẮT BUỘC)
```bash
# Thay thế file CLAUDE.md hiện tại
cp CLAUDE.md /path/to/sadec-marketing-hub/CLAUDE.md
```
> File này là "bộ não" — Claude Code đọc đầu tiên mỗi khi bắt đầu task.

### Bước 2: Copy AGENTS-WORKFLOW.md
```bash
cp AGENTS-WORKFLOW.md /path/to/sadec-marketing-hub/docs/AGENTS-WORKFLOW.md
```
> Mô tả quy trình phối hợp CTO Agent ↔ Claude Code ↔ OpenClaw.

### Bước 3: Copy project-rules.md vào .claude/commands/
```bash
mkdir -p /path/to/sadec-marketing-hub/.claude/commands/
cp .claude/commands/project-rules.md /path/to/sadec-marketing-hub/.claude/commands/
```
> Quick reference — Claude Code dùng khi cần tra cứu nhanh patterns.

### Bước 4: Chạy cleanup script (khuyến nghị)
```bash
cp scripts/cleanup-root.sh /path/to/sadec-marketing-hub/scripts/
cd /path/to/sadec-marketing-hub

# Xem trước (không thay đổi gì)
bash scripts/cleanup-root.sh --dry-run

# Thực hiện
bash scripts/cleanup-root.sh
git add -A
git commit -m "chore: organize root directory, move docs to subfolders"
```

## Cấu trúc files

```
output/
├── CLAUDE.md                      ← File chính, đặt ở root repo
├── AGENTS-WORKFLOW.md             ← Đặt trong docs/
├── .claude/commands/
│   └── project-rules.md           ← Quick reference cho Claude Code
├── scripts/
│   └── cleanup-root.sh            ← Script dọn dẹp root directory
└── HUONG-DAN-SU-DUNG.md           ← File này
```

## Workflow sau khi deploy

```
1. Bạn nhận requirement mới
2. CTO Agent (Qwen 3.0) tạo Coding Plan theo format trong AGENTS-WORKFLOW.md
3. Gửi plan cho Claude Code CLI
4. Claude Code tự đọc CLAUDE.md → hiểu context → implement
5. OpenClaw chạy linting/testing/git operations
6. CTO review output → merge hoặc request changes
```
