# Mekong CLI Architecture for Codex

This file is generated from Mekong CLI architecture sources for Codex-native context.

## Snapshot

- Claude command sources: `505`
- Codex command prompts: `505`
- Command contracts: `667`
- Recipes: `352`
- Skills: `195`
- Agents: `6`
- Layers: `10`

## Layers

| Layer | Role | Commands | Hubs | Cascades To |
|---|---:|---:|---|---|
| `business` | Business Lead / GTM | 71 | business-hub | product |
| `cto` | CTO / Chief Architect | 10 | cto-hub | pm |
| `dev` | Developer / Tech Lead | 10 | engineering-hub | worker |
| `engineering` | Engineer / Tech Lead | 66 | engineering-hub | ops |
| `founder` | Founder / CEO | 52 | founder-hub | business |
| `ops` | DevOps / Platform | 41 | ops-hub | - |
| `pm` | Product Manager / Tactical Lead | 9 | product-hub | dev |
| `product` | Product Manager / Designer | 31 | product-hub | engineering |
| `studio` | VC Studio / Chairman / Investor | 8 | studio-hub | cto |
| `worker` | Worker / Atomic Executor | 12 | ops-hub | - |

## Code Surface

- `src/`: `a2ui`, `agents`, `ai`, `analytics`, `api`, `auth`, `billing`, `binh_phap`, `cli`, `commands`, `components`, `config`, `core`, `daemon`, `db`, `i18n`, `jobs`, `lib`, `metering`, `middleware`, `models`, `pages`, `polymarket`, `raas`, `security`, `services`, `sops`, `strategies`, `studio`, `telemetry`, `tests`, `usage`
- `packages/`: `agent-core`, `agent-forest`, `agents`, `alphaear`, `i18n`, `license-sdk`, `mekong-cli-core`, `mekong-engine`, `mekong-reports`, `mekongd`, `memory`, `observability`, `openclaw-engine`, `raas-landing`, `shared`, `tokens`, `ui`
- `apps/`: `algo-trader`, `api`, `dashboard`, `docs`, `ide-ui`, `landing`, `mekong-ide`, `mekonmind-landing`, `tauri-shell`, `web`

## Codex Artifacts

- `.codex/commands/registry.json`: command manifest generated from `.claude/commands/**/*.md`
- `.codex/commands/**/*.md`: Codex command prompts that dispatch through `mekong <command> $ARGUMENTS`
- `.codex/architecture/registry.json`: architecture manifest with counts, layer map, contract index, recipe index, and source hashes
- `.codex/architecture/sources/`: copied architecture source documents for Codex inspection
- `tools/verify_codex_sync.py --json`: self-check for command, architecture, docs, and wrapper wiring
