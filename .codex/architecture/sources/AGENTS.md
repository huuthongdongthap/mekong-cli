# AGENTS.md - Mekong CLI v6.0
# Read by: Claude Code, Gemini CLI, OpenCode, Cursor, Codex, Amp, Antigravity

## Project
AI-operated business platform. 6 layers, 870 commands. MIT License.
Universal LLM: 3 env vars (LLM_BASE_URL, LLM_API_KEY, LLM_MODEL), any provider.

## Commands
Commands live in .claude/commands/*.md. Execute via: mekong <name> <args>
Engine: Python CLI (Typer) → PEV orchestrator → LLM Router → Agent Layer
Registry-backed slash commands that are not native Typer commands dispatch through the Codex registry fallback.

## Codex CLI Registry
Codex-native command registry lives at .codex/commands/registry.json.
Synced command prompts live at .codex/commands/**/*.md.
When a user asks for a slash command in Codex, resolve it first:

python3 -m src.main codex-command /goal "deep config" --json --check
python3 -m src.main codex-command /goals "deep config" --json --check
python3 -m src.main codex-command /code/check src/main.py --invocation --check
python3 -m src.main /goal "deep config" --invocation --check
python3 -m src.main code/check src/main.py --invocation --check

Regenerate the registry with:

python3 tools/sync_codex.py --json

The resolver auto-refreshes stale registry data by default. Use --no-sync only for debugging.

## Codex Architecture Registry
Codex-native architecture registry lives at .codex/architecture/registry.json.
Architecture summary lives at .codex/architecture/ARCHITECTURE.md.
Copied source documents live at .codex/architecture/sources/.
Use this registry for layer maps, command contracts, recipes, source hashes, apps, packages, and src modules.
Verify Codex command + architecture wiring with:

python3 tools/verify_codex_sync.py --json

## Build & Test
pip install -e .           # Python CLI
pnpm install               # TypeScript packages
python3 -m pytest tests/   # Tests
make test-python-packages  # Test agent-core, agent-forest, mekongd
mekong doctor check        # Health

## Style
Python: snake_case, type hints, < 200 lines. TypeScript: strict, ESM.
Commits: conventional (feat/fix/refactor/docs/test). No AI refs in messages.

## Architecture
Studio → Founder → Business → Product → Engineering → Ops
Water Protocol 水: multi-agent context flow between layers.

## Key Packages
- packages/agent-core/ — Agent management
- packages/agent-forest/ — Multi-agent orchestration
- packages/mekongd/ — Daemon service
- packages/mekong-reports/ — Report generation
- packages/openclaw-engine/ — Core engine (PUBLIC SDK)
