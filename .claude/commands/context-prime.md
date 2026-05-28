---
description: "Load full project context — CLAUDE.md, ARCHITECTURE.md, package.json, dir structure, key configs"
argument-hint: [project-path | --current]
allowed-tools: Bash, Read
---

# /context-prime — Full Context Loader

Load toàn bộ context của dự án hiện tại để AI có đầy đủ thông tin trước khi xử lý task.

## Usage
```
/context-prime                    # Load context project hiện tại
/context-prime ~/mekong-cli/FnB-Container-Caffe  # Load context project cụ thể
```

## Implementation

1. **Xác định project root** — tìm `CLAUDE.md`, `ARCHITECTURE.md`, hoặc `package.json` gần nhất
2. **Load các file context chính:**
   - `CLAUDE.md` — Execution protocol + rules
   - `ARCHITECTURE.md` — Kiến trúc dự án
   - `package.json` — Dependencies + scripts
   - `.gitignore` — Exclude patterns
   - `README.md` — Project overview
3. **Scan cấu trúc thư mục** — liệt kê top-level directories + key subdirectories
4. **Check Mekong commands available** — verify `~/.claude/commands/mekong/` accessible
5. **Output summary** — architecture overview, key files, available commands, active project

## Output format
```
## Project: <name>
## Architecture: <type> (Next.js / Python / etc)
## Key Files: <list>
## Mekong Commands: 336 available
## Status: Ready
```
