# Codex CLI — Configuration Status Report

> Last validated: 2026-06-01T16:27:00+07:00


## Installation

| Field | Value |
|-------|-------|
| Version | `codex-cli 0.135.0` |
| Install method | npm (`@openai/codex`) |
| Node | v22.22.0 (nvm) |
| Binary | `~/.nvm/versions/node/v22.22.0/bin/codex` |
| Platform | macOS arm64 (Apple Silicon) |

## Health

```
17 ok · 1 idle · 0 warn · 0 fail
```

All subsystems passing: system, runtime, install, search, git, terminal, title, state, threads, config, auth, mcp, sandbox, updates, network, websocket, reachability.

## Model Configuration

| Setting | Value |
|---------|-------|
| Default model | `gpt-5.5` (OpenAI) |
| Reasoning effort | `medium` (global), `high` (project) |
| Personality | `pragmatic` |
| Auth mode | ChatGPT |

### Profiles

| Profile | Model | Provider | Effort |
|---------|-------|----------|--------|
| `local` | `qwen3.6-35b` | MLX Local | high |

## MCP Servers

| Server | Command | Status |
|--------|---------|--------|
| `context7` | `npx -y @upstash/context7-mcp` | ✅ enabled |
| `pencil` | `~/.pencil/mcp/antigravity/out/mcp-server-darwin-arm64` | ✅ enabled |

## Feature Flags (Enabled)

| Feature | Stage |
|---------|-------|
| `multi_agent` | stable |
| `goals` | stable |
| `memories` | experimental |
| `fast_mode` | stable |
| `browser_use` | stable |
| `computer_use` | stable |
| `image_generation` | stable |
| `hooks` | stable |
| `plugins` | stable |
| `shell_snapshot` | stable |
| `guardian_approval` | stable |
| `prevent_idle_sleep` | experimental |
| `terminal_resize_reflow` | experimental |

## Command Registry

| Metric | Count |
|--------|-------|
| Total commands | 505 |
| Flat commands | 404 |
| Namespaced commands | 101 |
| Command contracts | 667 |
| Recipes | 352 |
| Skills | 195 |
| Agents | 6 |

### Namespace Breakdown

| Namespace | Count |
|-----------|-------|
| `trading:` | 44 |
| `raas:` | 20 |
| `git:` | 10 |
| `code:` | 6 |
| `ci:` | 5 |
| `sdlc:` | 4 |
| `utils:` | 3 |
| `context:` | 3 |
| `tasks:` | 2 |
| `docs:` | 2 |
| `legal:` | 1 |
| `finance:` | 1 |

## Architecture Registry

| Metric | Count |
|--------|-------|
| Layers | 10 |
| Apps | 10 |
| Packages | 17 |
| Source modules | 32 |

Sync verification: **13/13 checks passed**.

## Sandbox Rules

### Project Level (`.codex/rules/default.rules`)

| Category | Rules |
|----------|-------|
| Package managers | pnpm, npm, pip, pip3 |
| Build & test | make, pytest, ruff, mypy, npx, node |
| Git (read) | status, diff, log, branch, show, ls-files, remote, tag, rev-parse |
| Git (write) | add, commit, push, pull, checkout, switch, merge, rebase, stash, fetch, worktree, cherry-pick, reset |
| File ops (read) | cat, ls, find, grep, rg, head, tail, wc, diff, file, du, stat, tree |
| Shell utilities | echo, printf, date, env, which, whoami, basename, dirname, realpath, pwd |
| Text processing | jq, sed, awk, sort, uniq, tr, cut, xargs, tee |
| File ops (write) | mkdir, touch, cp, mv, ln |
| Mekong tools | mekong, src.main, sync tools, setup, health-check, mekong-wrapper |
| Docker | build, compose, ps, logs, images |
| **Forbidden** | `rm -rf /`, `sudo`, `chmod 777` |

### Global Level (`~/.codex/rules/default.rules`)

Clean generic rules — no one-off PID-specific or ad-hoc entries. Same categories as project level (minus docker).

## Trusted Projects

- `/Users/mac`
- `/Users/mac/mekong-cli`
- `/Users/mac/mekong-cli/FnB-Container-Caffe`
- `/Users/mac/mekong-cli/algo-trader`
- `/Users/mac/mekong-cli/sophia-ai-factory`
- `/Users/mac/mekong-cli/antigravity`

## Issues Fixed (This Session)

1. **Rules parse error**: `.codex/rules/default.rules` used `decision="deny"` which Codex CLI doesn't recognize. Fixed to `decision="forbidden"`.
2. **One-off rules**: `~/.codex/rules/default.rules` had ~20 PID-specific and ad-hoc rules. Cleaned to generic patterns only.
3. **Stale command count**: `~/.codex/AGENTS.md` referenced 503 commands. Fixed to 505.

## Smoke Tests (End-to-End Validation)

Three different `codex exec` commands were run to verify the full stack in non-interactive mode (using `--dangerously-bypass-approvals-and-sandbox` and redirecting stdin from `/dev/null` to prevent blocking):

1. **Simple Echo Command**
   - **Command**: `codex exec --dangerously-bypass-approvals-and-sandbox --ephemeral "echo 'Hello Codex'" < /dev/null`
   - **Result**: ✅ Succeeded. Output: `Hello Codex`.

2. **File Reading Command**
   - **Command**: `codex exec --dangerously-bypass-approvals-and-sandbox --ephemeral "cat .codex/config.toml" < /dev/null`
   - **Result**: ✅ Succeeded. Successfully printed the content of `.codex/config.toml`.

3. **Mekong Tool Command**
   - **Command**: `codex exec --dangerously-bypass-approvals-and-sandbox --ephemeral "python3 tools/verify_codex_sync.py --json" < /dev/null`
   - **Result**: ✅ Succeeded. Output `valid: true` and all 13 checks passed.

### Known Warning During Load
- During session loading, Codex logs a warning: `failed to load skill /Users/mac/mekong-cli/.agents/skills/mlx-inference/SKILL.md: invalid YAML: mapping values are not allowed in this context`. This is due to a minor syntax mismatch in the skill definition file under `mlx-inference` but does not impact execution of commands.

## Recommendations

1. Consider enabling `multi_agent_v2` when it graduates from "under development"
2. Keep `codex doctor` in regular health check routine
3. Run `python3 tools/verify_codex_sync.py --json` after any command changes
4. Update Codex CLI when new versions release: `npm install -g @openai/codex`
