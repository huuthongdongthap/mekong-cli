# MEKONG RAAS — GLOBAL CONTEXT LOADER
Auto-load mỗi khi OpenCode CLI khởi động. Source of truth: `~/mekong-cli/`

## COMMAND SYSTEM (17 core + 336 total)
Commands có sẵn qua slash `/` hoặc Task tool. 
- **opencode.json** → 17 core commands registered in opencode DB
- **.claude/commands/** → 336 .md command definitions (full catalog)
- **.opencode/commands/** → 336 OpenCode native versions

**Core Commands:**
```
/plan              — Create implementation plan with research and analysis
/cook              — Recipe executor — run multi-step DAG recipe from recipes/ directory
/worker-exec       — Execute shell command safely with timeout and error handling
/dev-feature       — Feature build — plan, code, test, PR. Full feature cycle in 15 min
/dev-bug-sprint    — Bug sprint — debug, fix, test. Batch bug fixes in 15 min
/deploy            — Deployment execution — pre-flight checks, deploy, smoke test, rollback plan
/cto-dashboard     — CTO brain health dashboard — ROI scores, active missions, learning state
/cto-health        — Run CTO health check dashboard — all subsystems in one view
/incident-respond  — Incident response — triage, investigation, mitigation, post-mortem template
/review            — Code review — architecture check, security scan, performance analysis
/ship              — Ship code to production — test, commit, push, deploy
/test              — Test generation — unit, integration, edge cases, coverage report
/commands-status   — Show command health — dispatch count, success rate, avg duration
/idea              — Generate full company architecture from business idea (BizPlan OS)
/quick-start       — Start any new project from idea to production in 5 commands
/context-prime     — Load full project context — architecture, deps, dir structure
/prime             — Quick prime — load essential project context in 5 seconds
```

Full catalog: `ls ~/mekong-cli/.claude/commands/` (336 files, auto-updates via git)

## ARCHITECTURE
```
~/.claude/                      # Claude Code Config (symlinked to repo)
  commands/mekong/              → ~/mekong-cli/.claude/commands/ (336 slash commands)
  skills/                       # Skills modules (loaded via skill tool)
  agents/                       # Agent definitions

~/mekong-cli/                   # Mekong CLI Root (git repo)
  GLOBAL_CONTEXT.md             # ← THIS FILE (source of truth, symlinked from ~/CLAUDE.md)
  opencode.json                 # OpenCode command definitions (17 core commands)
  CLAUDE.md                     # Execution Protocol
  .claude/                      # Claude Code config in repo
    commands/                   # 336 command definitions
    skills/                     # Skill modules
    agents/                     # Agent definitions
  .opencode/                    # OpenCode native config
    commands/                   # 336 OpenCode command definitions
  FnB-Container-Caffe/          # F&B Project
  algo-trader/                  # Algo Trading
  antigravity/                  # IDE
  sophia-ai-factory/            # AI Factory
```

## EXECUTION PROTOCOL (from CLAUDE.md)
- Output tối thiểu: Lệnh → Kết quả → Task tiếp theo
- KHÔNG giải thích dài dòng, không chào hỏi, không xin lỗi
- Dùng Mekong commands (`/cook`, `/worker-exec`, ...) thay vì prompt văn xuôi
- 2 STRIKES & MAX: 2 lần fix lỗi không được → DỪNG, chờ user
- Silent flags cho terminal commands để tránh tràn log (`--silent`, `-q`, `> /dev/null`)
- Bám sát Blueprint (ARCHITECTURE.md, company.json)
- Wrap task cho Worker qua Mekong CLI command format
- Dùng Edit chunk thay vì full file rewrite khi sửa code
- KHÔNG tự sửa UI/CSS (.pen files) trừ khi có lệnh cụ thể

## HOW TO INVOKE COMMANDS
Trong OpenCode CLI, commands được invoke qua Task tool:
```
Task(description="...", prompt="/command-name args...", subagent_type="general")
```

## AUTO-UPDATE MECHANISM
File này là symlink target của `~/CLAUDE.md`. Khi chạy `git pull` trong `~/mekong-cli/`:
- Commands trong `.claude/commands/` tự động cập nhật
- Context này tự động phản ánh thay đổi
- Chạy `python3 ~/mekong-cli/setup-mekong.py` để sync commands vào opencode DB
