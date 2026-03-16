# AGENTS-WORKFLOW.md — Quy trình phối hợp Multi-Agent

> Tài liệu này mô tả cách các agent phối hợp trong môi trường Antigravity.
> Mỗi agent đọc file này để hiểu vai trò và ranh giới trách nhiệm.

---

## Kiến trúc tổng thể

```
╔══════════════════════════════════════════════════════════════╗
║                     ANTIGRAVITY IDE                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌──────────────────────────┐                                ║
║  │   🧠 CTO AGENT           │  Ollama · Qwen 3.0 32B        ║
║  │                          │                                ║
║  │  Vai trò:                │  • Phân tích requirements      ║
║  │  - Strategic planning    │  • Thiết kế kiến trúc          ║
║  │  - Architecture decisions│  • Tạo coding plan             ║
║  │  - Code review           │  • Review output của workers   ║
║  │  - Quality gate          │  • Quyết định merge/reject     ║
║  └────────────┬─────────────┘                                ║
║               │                                              ║
║               │ Coding Plan (structured task)                ║
║               ▼                                              ║
║  ┌──────────────────────────┐                                ║
║  │   ⚡ CLAUDE CODE CLI     │  API: Qwen coding plan         ║
║  │                          │                                ║
║  │  Vai trò:                │  • Nhận plan → implement       ║
║  │  - Primary coder         │  • Đọc CLAUDE.md cho context   ║
║  │  - Complex logic         │  • Self-verify trước output    ║
║  │  - Integration work      │  • Tạo/sửa multiple files     ║
║  │  - Debugging             │  • Giải thích decisions        ║
║  └────────────┬─────────────┘                                ║
║               │                                              ║
║               │ Delegated sub-tasks                          ║
║               ▼                                              ║
║  ┌──────────────────────────┐                                ║
║  │   🔧 OPENCLAW WORKERS   │  Terminal-based                 ║
║  │                          │                                ║
║  │  Vai trò:                │  • File operations (mv, cp)    ║
║  │  - Grunt work            │  • Batch formatting            ║
║  │  - Repetitive tasks      │  • Running tests/linters       ║
║  │  - File manipulation     │  • Git operations              ║
║  │  - Build/Deploy          │  • Dependency management       ║
║  └──────────────────────────┘                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Luồng xử lý task

### Phase 1: Planning (CTO Agent — Qwen 3.0 32B)

CTO nhận requirement từ người dùng và tạo **Coding Plan** có cấu trúc:

```markdown
## CODING PLAN #[number]

### Objective
[Mô tả mục tiêu rõ ràng, 1-2 câu]

### Context
- Related files: [danh sách file cần đọc]
- Dependencies: [các module/API liên quan]
- Design reference: [link hoặc mô tả UI nếu có]

### Tasks
1. [ ] Task 1 — [Mô tả cụ thể]
   - File: `path/to/file.js`
   - Action: create | modify | delete
   - Details: [Chi tiết implementation]

2. [ ] Task 2 — [Mô tả cụ thể]
   ...

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] No console errors
- [ ] Responsive on mobile

### Constraints
- DO NOT modify: [files không được sửa]
- Must use: [patterns/APIs bắt buộc]
- Priority: P0 | P1 | P2

### Estimated Scope
- Files affected: [số lượng]
- Complexity: Low | Medium | High
- Agent assignment: Claude Code (primary) + OpenClaw (support)
```

### Phase 2: Implementation (Claude Code CLI)

Claude Code nhận plan và thực hiện theo thứ tự:

```
Step 1: READ — Đọc CLAUDE.md + files liên quan
         ↓
Step 2: ANALYZE — Kiểm tra code hiện tại, tìm patterns
         ↓
Step 3: PLAN — Xác nhận approach (nếu có ambiguity, hỏi CTO)
         ↓
Step 4: IMPLEMENT — Code theo plan, tuân thủ conventions
         ↓
Step 5: VERIFY — Kiểm tra syntax, logic, no regressions
         ↓
Step 6: REPORT — Báo cáo kết quả cho CTO review
```

**Claude Code output format:**

```markdown
## IMPLEMENTATION REPORT — Plan #[number]

### Completed
- ✅ Task 1: [mô tả ngắn]
  - Modified: `path/to/file.js` (lines 45-120)
  - Added: `path/to/new-file.js`

### Issues Found
- ⚠️ [Mô tả issue phát hiện trong quá trình code]
  - Suggestion: [đề xuất giải pháp]

### Testing
- [ ] Browser test: [kết quả]
- [ ] Console errors: none | [danh sách]

### Files Changed
[git diff summary hoặc danh sách files]
```

### Phase 3: Support Tasks (OpenClaw Workers)

OpenClaw xử lý các task không cần "suy nghĩ":

```bash
# File operations
mv RELEASE-NOTES-*.md docs/releases/
mv AUDIT_*.md docs/audits/

# Formatting
npx prettier --write "assets/**/*.{js,css,html}"
npx eslint --fix "assets/js/**/*.js"

# Testing
npx html-validate "admin/**/*.html"
npx linkinator https://sadec-marketing-hub.pages.dev

# Git operations
git add -A
git commit -m "chore: move release notes to docs/releases/"
git push origin feat/cleanup-root

# Dependency management
npm install -D eslint prettier
npm audit fix
```

---

## Quy tắc phối hợp

### CTO Agent — DOs and DON'Ts

```
✅ DO:
- Chia task lớn thành sub-tasks nhỏ (max 3-5 files per task)
- Cung cấp context đầy đủ trong plan
- Specify rõ file nào KHÔNG được sửa
- Review output trước khi merge vào main

⛔ DON'T:
- Gửi plan mơ hồ ("làm đẹp trang admin")
- Yêu cầu refactor toàn bộ project trong 1 task
- Bỏ qua review step
- Thay đổi architecture không cập nhật CLAUDE.md
```

### Claude Code — DOs and DON'Ts

```
✅ DO:
- Đọc CLAUDE.md TRƯỚC MỌI TASK
- Follow existing patterns trong codebase
- Tạo code chạy được ngay (no-build)
- Comment logic phức tạp
- Báo cáo issues phát hiện
- Giữ scope đúng plan (không gold-plating)

⛔ DON'T:
- Tự ý refactor ngoài scope
- Tạo file .md ở root directory
- Thêm dependencies/frameworks mới không có trong plan
- Bỏ qua auth checks trên protected pages
- Hardcode credentials
- Tạo file TypeScript trong frontend
```

### OpenClaw Workers — DOs and DON'Ts

```
✅ DO:
- Chạy lệnh chính xác như được giao
- Báo cáo output/errors
- Confirm trước khi xóa files

⛔ DON'T:
- Tự ý sửa code logic
- Push trực tiếp vào main cho thay đổi lớn
- Chạy destructive commands không có backup
```

---

## Xử lý Conflict

### Khi Claude Code phát hiện vấn đề trong plan:

```
SCENARIO: Plan yêu cầu sửa file X nhưng file X đã thay đổi
          hoặc plan conflict với CLAUDE.md conventions

ACTION:
1. DỪNG implementation
2. Báo cáo conflict cho CTO:
   "⚠️ CONFLICT: Plan #12 yêu cầu thêm SCSS vào admin/,
    nhưng CLAUDE.md quy định CSS Custom Properties only.
    Đề xuất: Dùng CSS variables thay vì SCSS."
3. Chờ CTO quyết định
```

### Khi có lỗi không lường trước:

```
SCENARIO: Code chạy nhưng phát hiện bug trong module liên quan

ACTION:
1. Fix bug NẾU nằm trong scope (< 10 lines, same file)
2. Report bug NẾU ngoài scope:
   "🐛 BUG FOUND: auth.js line 234 — session refresh
    không handle edge case khi Supabase trả 401.
    Không fix vì ngoài scope Plan #12.
    Recommend: Tạo Plan #13 cho auth hardening."
3. KHÔNG FIX NẾU ảnh hưởng nhiều files
```

---

## Communication Protocol

### Task handoff format (CTO → Claude Code)

```
@claude-code
PLAN: #15
PRIORITY: P1
TASK: Thêm drag-drop cho Content Calendar
FILES: admin/content.html, assets/js/content-calendar.js
READ FIRST: assets/js/components/sadec-sidebar.js (pattern reference)
CONSTRAINT: Vanilla JS only, no libraries. Use HTML Drag and Drop API.
```

### Status update format (Claude Code → CTO)

```
@cto
PLAN: #15
STATUS: ✅ COMPLETE | ⚠️ PARTIAL | ❌ BLOCKED
SUMMARY: Implemented drag-drop using native HTML5 API.
CHANGED:
  - admin/content.html (+45 lines)
  - assets/js/content-calendar.js (new file, 230 lines)
NOTES: Cần thêm mobile touch support (Plan mới?)
```

### Delegation format (Claude Code → OpenClaw)

```
@openclaw
RUN: npx prettier --write "admin/content.html" "assets/js/content-calendar.js"
RUN: npx html-validate "admin/content.html"
REPORT: Output of both commands
```

---

## Anti-Patterns — Bài học từ 274 commits

Repo hiện tại có vấn đề do thiếu quy trình agent. Tránh lặp lại:

| Anti-Pattern | Đã xảy ra | Cách phòng tránh |
|---|---|---|
| Documentation sprawl | 40+ .md files ở root | Mọi docs → `docs/` subfolders |
| Naming chaos | Mix kebab/snake/UPPER case | Thống nhất: kebab-case cho files |
| Agent config explosion | 7 thư mục ẩn cho agents | Dùng `.claude/` và `.agents/` đủ rồi |
| Duplicate reports | AUDIT*.md × 5, PERF*.md × 4 | Mỗi loại chỉ giữ latest + archive |
| Version confusion | v1.1 → v4.36 → v5.10 random | Semantic versioning nghiêm túc |
| Credential exposure | Demo passwords trong README | KHÔNG BAO GIỜ, dùng seed script |

---

> **Cập nhật lần cuối**: 2026-03-15
> **Maintained by**: CTO Agent + Human oversight
