# Scope: CheetahClaws Boot & Sim Setup

## Architecture
- CheetahClaws runs a daemon serve mechanism (`python3 cheetahclaws.py serve`).
- Transport: TCP bearer-token file path (or UNIX socket). We are using TCP loopback (`tcp://127.0.0.1:8189`).
- Session database: `~/.cheetahclaws/sessions.db` (SQLite).
- Essential tables to verify: `daemon_events`, `agent_runs`, `schema_meta`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Research & Prep | Review imports and daemon serve mechanism | none | DONE |
| 2 | Boot Checker | Create `check_boot.py` and verify it runs successfully | M1 | DONE |
| 3 | Stress Simulator | Create `run_stress_sim.py` and run baseline tests | M2 | DONE |
| 4 | Reporting | Write `changes.md` and `handoff.md`, message Orchestrator | M3 | DONE |

## Interface Contracts
### Daemon Config
- SQLite DB location: `~/.cheetahclaws/sessions.db`
- Connection protocol: TCP bearer-token loading from `~/.cheetahclaws/daemon_token` (or matching path) and `daemon.json` reading from `~/.cheetahclaws/daemon.json`.
