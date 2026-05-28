# Project: CheetahClaws Continuous Configuration & Tuning

## Architecture
- **cheetahclaws.py**: Entry point. Routes subcommands (e.g. `serve`, `daemon`) or runs REPL.
- **cc_daemon/**: Background persistent services (server, schema/SQLite, IPC, subprocess supervisor).
- **web/**: Zero-dependency connection dispatcher, server, and REST API controllers for the UI.
- **bootstrap.py**: Standard bootstrapper configuring logs, tools, and health HTTP endpoints.
- **logging_utils.py**: Thread-safe structured logging output.
- **tests/ & demos/**: Automated end-to-end testing and functional simulators.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|--------------|--------|-----------------|
| 1 | Diagnostics and Log Exploration | Map out codebase, explore configuration and logs, identify potential bottlenecks | none | DONE | e04b3639-93f4-4634-b54b-2fa1c21af407 |
| 2 | Programmatic Boot Checker & Sim Harness | Implement pythonic check_boot.py and a simulated stress runner (run_stress_sim.py) to generate active logs | M1 | DONE | 50a216c5-bf49-4946-a2ed-0122d64e91c3 |
| 3 | Logging Audit and Tuning | Run simulations, analyze logs for errors/exceptions/locks, optimize cheetahclaws.py & cc_config.py | M2 | DONE | 18fdcde9-722e-4176-be39-140af8d3e559 |
| 4 | Verification and Hardening | Verify zero errors/exceptions under stress, ensure clean boots, run standard tests | M3 | DONE | a5a8b10a-fe22-4c81-9405-0b4b2627bebd |

## Interface Contracts
### check_boot.py ↔ cheetahclaws
- Executes `python3 cheetahclaws.py serve` under sub-processes
- Verifies presence of `~/.cheetahclaws/daemon.json` and parses PID, port, UDS path
- Tests TCP/UDS socket connectivity
- Inspects `sessions.db` SQLite schema
- Returns exit code 0 on success, non-zero on failure

### run_stress_sim.py ↔ cheetahclaws
- Initiates stress simulation by driving multiple mock client requests to the background daemon/web server
- Focuses on socket connections, SQLite writes/reads, and high logging volume
- Scans `~/.cheetahclaws/logs/daemon.log` and auth/web logs for exceptions
