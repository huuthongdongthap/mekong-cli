# Scope: Tuning CheetahClaws Concurrency, Reliability, and Speed

## Architecture
- `cheetahclaws.py`: CLI entry point (high import latency needs to be optimized).
- `cc_config.py`: Configuration store and defaults.
- `cc_daemon/server.py`: Daemon RPC and API server (HTTP request backlog, connections, multi-threaded writes/reads).
- SQLite Database: Concurrency under write/read workloads, locked/busy errors, WAL mode.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Baseline Simulation | Run `python3 tests/run_stress_sim.py` and capture logs/output | None | PLANNED |
| 2 | Diagnostics | Identify SQLite database locked/busy error, import latency, backlog limits, etc. | M1 | PLANNED |
| 3 | Tune & Implement | Apply SQLite WAL, busy_timeout, lazy imports, backlog queue adjustments | M2 | PLANNED |
| 4 | Verification | Run `check_boot.py` and `run_stress_sim.py`, ensuring clean exit 0 | M3 | PLANNED |

## Interface Contracts
### SQLite Tuning
- WAL mode: `PRAGMA journal_mode=WAL;`
- Synchronous mode: `PRAGMA synchronous=NORMAL;`
- Busy timeout: Set database busy timeout to at least 30000ms.
### Server Tuning
- TCP socket backlog to handle high concurrent connection requests.
### CLI Startup
- Move heavy imports to dynamic/lazy imports to improve boot speed.
