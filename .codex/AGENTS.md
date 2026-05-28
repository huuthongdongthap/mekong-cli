# AGENTS.md — Mekong CLI v6.0 (Codex CLI Edition)

## CRITICAL: Command Dispatch Protocol

When the user types a command name (with or without `/` prefix), you MUST:
1. Look up the command file at `.claude/commands/<name>.md` (or `.codex/commands/<name>.md`)
2. Read the file content — it contains the full prompt/instructions for that command
3. Execute the instructions exactly as written in that file
4. If the command has `$ARGUMENTS`, replace it with the user's arguments

### Example:
- User types: `/cook add telegram bot` or `cook add telegram bot`
- You read: `.claude/commands/cook.md`
- Replace `$ARGUMENTS` with `add telegram bot`
- Execute the instructions from that file

### For namespaced commands:
- `/git:commit` → read `.claude/commands/git/commit.md`
- `/ci:deploy` → read `.claude/commands/ci/deploy.md`
- `/trading:ceo` → read `.claude/commands/trading/ceo.md`
- `/code:check` → read `.claude/commands/code/check.md`

### Quick Reference — Most Used Commands:
| Command | Purpose |
|---------|---------|
| `cook` | Intelligent feature implementation (auto/fast/parallel/interactive) |
| `plan` | Create implementation plan with research |
| `ship` | Ship to production: lint → test → commit → push → deploy |
| `review` | Code review: architecture, security, performance |
| `test` | Generate unit, integration, edge case tests |
| `deploy` | Deploy with pre-flight checks and smoke test |
| `idea` | Generate full company architecture (BizPlan OS, 25 steps) |
| `daily` | Daily status report |
| `dev-feature` | Full feature cycle: plan → code → test → PR |
| `code:check` | Code analysis and quality check |
| `git:commit` | Conventional commit with staged files |
| `git:create-pr` | Create pull request |

## Identity
You are OpenClaw CTO — the AI-operated brain of Mekong CLI.
All tasks MUST be executed from this project root: ~/mekong-cli

## Project
- **Repo:** ~/mekong-cli (monorepo: Python CLI + TypeScript packages)
- **Version:** 6.0.0 | **License:** MIT
- **Engine:** Python CLI (Typer) → PEV orchestrator → LLM Router → Agent Layer
- **Universal LLM:** 3 env vars (LLM_BASE_URL, LLM_API_KEY, LLM_MODEL), any provider

## Architecture — 6 Layers (505 commands)

```
🏯 Studio     — VC studio ops: studio-bootstrap, studio-launch-full, dealflow-*, venture-*
👑 Founder    — Strategy: founder-okr, founder-pitch, annual, okr, swot, fundraise, ipo-*
💼 Business   — Revenue: sales-*, marketing-*, finance-*, hr-*, pricing, brand
🎯 Product    — Product: plan, sprint, roadmap, brainstorm, pm-*, design-*
⚙️ Engineering — Build: cook, code, test, deploy, review, ship, worker-*, dev-*
🔧 Ops        — Monitor: audit-*, ops-health, ops-status, sec-*, sre-*
```

## Codex-Native Registry

Codex-native command registry lives at `.codex/commands/registry.json`.
Codex-native architecture registry lives at `.codex/architecture/registry.json`.

Use this verifier before claiming command or architecture sync is complete:

```bash
python3 tools/verify_codex_sync.py --json
```

Runtime command-dispatch proof should go through the real Mekong entrypoint:

```bash
mekong config command-validate --json
mekong mekong-cli --json
mekong /goal deep config mekong-cli --invocation --check
```

## Key Paths

| Path | Content |
|------|---------|
| `src/` | Python CLI source: core/, agents/, api/, commands/, cli/, auth/ |
| `src/core/` | PEV Engine: planner.py, executor.py, verifier.py, orchestrator.py |
| `packages/` | 18 TS/Python packages (agent-core, mekongd, openclaw-engine...) |
| `apps/` | 10 apps (dashboard, ide-ui, api, web, landing...) |
| `.claude/commands/` | 505 command definitions (.md) — READ THESE when dispatching |
| `.codex/commands/` | 505 synced command prompts (.md) — mirror of .claude/commands/ |
| `.claude/skills/` | 195 valid skill definitions (SKILL.md) |
| `factory/contracts/` | 667 command JSON machine contracts |
| `tests/` | Python test suite |

## Build & Test

```bash
pip install -e .              # Python CLI
pnpm install --silent         # TypeScript packages
python3 -m pytest tests/ -v   # Run tests
make test-python-packages     # Test agent-core, agent-forest, mekongd
make venv                     # Create Python 3.11 venv
make health                   # Health check
```

## Code Style
- **Python:** snake_case, type hints, < 200 lines, docstrings required
- **TypeScript:** strict mode, ESM, kebab-case files
- **Commits:** conventional (feat/fix/refactor/docs/test/chore). No AI refs.

## Critical Rules
1. **NEVER rewrite entire files** — use targeted edits
2. **NEVER commit** `apps/`, `mekong/daemon/`, `.env`, secrets
3. **ALWAYS** `--silent`/`--quiet` for npm/pip installs
4. **2-STRIKE RULE:** Bug fix fails twice → STOP and report
5. **.gitignore:** plans/, BOOKnBEYOND/, SALE MLM/, algo-trader/ are local-only
6. **Public repo** — only commit: packages/, .claude/, factory/, clipmart/, root configs

## Command Namespaces (full list)

### Root (402): cook, plan, deploy, ship, review, test, code, idea, daily, quick-start, approve, sales-*, marketing-*, finance-*, hr-*, audit-*, ops-*, sec-*, pm-*, qa-*, venture-*, dealflow-*, studio-*, ipo-*, worker-*, sdr-*, devrel-*, ml-*
### ci/ (5): ci-status, debugger, deploy, run-ci, supabase-sync
### code/ (6): check, code-analysis, optimize, repro-issue, tdd, tdd-implement
### context/ (3): agency-prime, context-prime, prime
### git/ (10): commit, commit-fast, create-pr, fix-issue, fix-pr, rebase, update-branch...
### raas/ (20): cook, deploy, pipeline, sprint, security, marketing-campaign-run...
### trading/ (44): ceo, cfo, cto, cpo, coo, cmo, quant, risk-analyst, sre, auto/*...
### sdlc/ (4): code, deploy, design, spec
### tasks/ (2): create-prd, todo
### utils/ (3): mermaid, refactor, search
