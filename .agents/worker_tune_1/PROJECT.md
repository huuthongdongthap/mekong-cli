# Project: CheetahClaws Dynamic Tuning

## Architecture
- SQLite session store (`session_store.py`)
- Daemon server (`cc_daemon/server.py`)
- CLI command lazy loader (`cheetahclaws.py`)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | SQLite Tuning | Add PRAGMA synchronous=NORMAL right after WAL | none | DONE |
| 2 | Socket Timeout | Override setup(self) in DaemonRequestHandler with 30s timeout | M1 | DONE |
| 3 | CLI Lazy Imports | Refactor import blocks in cheetahclaws.py to be lazy | M2 | DONE |
| 4 | Verification | Run check_boot.py and run_stress_sim.py | M3 | DONE |

## Interface Contracts
- Tuning internals of SQLite connection, socket timeout, and imports. No interface modifications.
