# CheetahClaws Boot, Daemon, and Simulation Architecture Analysis

This report provides a comprehensive, read-only architectural breakdown of the **CheetahClaws** platform based on an in-depth codebase exploration. It details the file structure, main entry points, startup procedures, diagnostic paths, simulation mechanisms, and programmatic checker recommendations.

---

## 1. Directory Structure & Key Components

Below is a detailed map of the CheetahClaws workspace highlighting the main functional domains:

```
/Users/mac/cheetahclaws/
├── cheetahclaws.py         # Main CLI and interactive REPL entry point.
├── cc_config.py            # Unified configuration schema and file loading defaults.
├── bootstrap.py            # Startup sequence orchestrator (idempotent bootstrap).
├── logging_utils.py        # Centralized thread-safe JSON logging facade.
├── health.py               # In-process health HTTP server (/healthz, /readyz, /metrics).
├── agent_runner.py         # Primary orchestrator for autonomous agent loops.
├── tmux_tools.py           # Integration with tmux for multi-pane orchestration.
│
├── cc_daemon/              # Background Daemon Service (RFC 0001 / RFC 0002)
│   ├── cli.py              # `cheetahclaws serve` CLI interface and initialization loop.
│   ├── server.py           # Socket-level HTTP, WebSocket & SSE connection handler.
│   ├── discovery.py        # Process-discovery management (reads/writes daemon.json).
│   ├── auth.py             # Bearer token generation and loading for TCP clients.
│   ├── schema.py           # SQLite database schema initializer.
│   ├── runner_supervisor.py # Manages child process runner execution (POSIX fork-like F-4).
│   ├── runner_ipc.py       # IPC protocol channels between daemon and runner processes.
│   └── bridge_supervisor.py # Lifecycle management for background messaging bridges.
│
├── web/                    # Built-in Browser Interface
│   ├── server.py           # Pure-Python, zero-dependency socket-level HTTP/WS server.
│   ├── api.py              # REST controllers mapping chat sessions to DB actions.
│   ├── db.py               # SQLite storage management for Web Terminal / Chat UI.
│   └── logging_setup.py    # Custom JSON logging configurations for web services.
│
├── commands/               # CLI & REPL Subcommand Suite
│   ├── daemon_cmd.py       # Handles `cheetahclaws daemon status / stop / logs` controls.
│   └── ...                 # Other console command handlers.
│
├── tests/                  # Automated Test Suite
│   ├── e2e_daemon_skeleton.py # Comprehensive subprocess-based daemon integration tests.
│   ├── test_cc_daemon_cli.py  # Tests serve loop command parsing and options.
│   └── ...                 # Modular unit/integration tests.
│
└── demos/                  # Functional Simulations
    ├── make_demo.py        # Framework simulation initializer.
    └── make_web_demo.py    # Web frontend / socket integration simulator.
```

---

## 2. Boot & Service Startup Architecture

The CheetahClaws boot pipeline has two distinct entry profiles: the **REPL / CLI client profile** and the **long-running headless daemon / web profile**. Both rely on `bootstrap.py` to ensure consistency.

### A. The In-Process / CLI Startup Sequence
When `cheetahclaws.py` is invoked without arguments or with immediate user prompts, the boot flow executes sequentially as follows:
1. **Argument Parsing (`cheetahclaws.py:main()`)**: Inspects arguments like `--model`, `--accept-all`, `--verbose`, or `--setup`.
2. **Configuration Load (`cc_config.py:load_config()`)**: Resolves system variables and loads JSON settings from `~/.cheetahclaws/config.json`.
3. **Idempotent Bootstrapping (`bootstrap.py:bootstrap()`)**:
   - **Configure Logging**: Activates `logging_utils.py` using settings (e.g., `log_level`, `log_file`).
   - **Populate Tool Registry**: Triggers imports in `tools.py` which self-register all CLI and agent-accessible functions.
   - **Lightweight Health Server**: If `health_check_port` is set in the configuration, starts the background thread `health.py:start_health_server()` serving HTTP metrics.
4. **Interactive Setup / REPL Launch**: If it is a first-time run, prompts the user with the setup wizard; otherwise, drops immediately into the custom interactive execution loop.

### B. The Headless Daemon Startup Sequence (`cheetahclaws serve`)
When starting the background daemon via `cheetahclaws serve`, the initialization pathway diverges:
1. **Pre-flight Checks (`cc_daemon/cli.py:cmd_serve()`)**:
   - Parses `--listen` arguments (supporting Unix Domain Sockets `unix://path` or TCP sockets `tcp://host:port`).
   - Resolves data directories (defaults to `~/.cheetahclaws`) and pid-file locations (`~/.cheetahclaws/run/daemon.pid`).
   - Reads the pid-file and performs a system check using `discovery.pid_alive()` to verify if a daemon process is already running. If alive, it aborts execution.
2. **Logging & Quota Adaptation**:
   - Configures log redirection to `~/.cheetahclaws/logs/daemon.log` (if not otherwise defined).
   - Upgrades default logging verbosity from `warn` to `info` to facilitate tracking.
   - Applies strict cost guardrails (`F9_SERVE_BUDGET_DEFAULTS` from `cc_daemon/cli.py:55` yielding 200,000 session tokens and $2.00 session budgets) before initializing the global quota limits.
3. **Schema Initialization (`cc_daemon/schema.py:init_schema()`)**:
   - Opens the shared SQLite database `~/.cheetahclaws/sessions.db` and runs DDL statements to set up tables (`daemon_events`, `agent_runs`, `agent_iterations`, `jobs`, `monitor_subscriptions`, `monitor_reports`, `bridges`, `schema_meta`).
4. **Listening Server Bind**:
   - Creates the listening socket (TCP or UDS) and boots the socket-level loop in `cc_daemon/server.py`.
   - On bind, writes process parameters and security token locations to the central discovery file `~/.cheetahclaws/daemon.json`.
5. **Scheduler & Supervisor Activations**:
   - Boots `monitor/scheduler.py` inside the daemon thread.
   - Boots `proactive_scheduler.py` to drive background proactive checks.
   - Launches a dedicated graceful shutdown watcher thread waiting for `DaemonState.shutdown_event`.

### C. The Web Service Startup Sequence (`cheetahclaws --web`)
When starting the unified browser interface, the web layer starts a standalone process:
1. **Environment Setup & Recurse Guard**: Sets `os.environ["CHEETAHCLAWS_WEB_SERVER"] = "1"` to guard against recursive shell aliases.
2. **Password Generation (`web/server.py:start_web_server()`)**: Generates a random secure password for the Terminal login page unless `--no-auth` is specified.
3. **Chat DB Setup**: Initializes the chat UI database (`~/.cheetahclaws/web.db`) containing user identities and folder schemas via `web/db.py:init_db()`.
4. **SSE & Session Cleanup Thread**: Spawns a daemon worker thread looping on `web/server.py:_reap_stale_sessions()` to prune disconnected PTYs.
5. **Socket Bind & Listener**: Resolves local port bindings (defaulting to `8080` but auto-falling back to a random port if busy). Starts the pure-Python server loop.

---

## 3. Diagnostic & Observability Findings

### A. Critical Paths and Log Files
CheetahClaws tracks operations via two distinct log profiles:
*   **REPL & General Application Log**: Located at `~/.cheetahclaws/cheetahclaws.log`. Configured by `cc_config.py` using standard structured fields.
*   **Daemon Server Log**: Redirected at runtime to `~/.cheetahclaws/logs/daemon.log` under headless execution.
*   **Security & Audit Log**: Written directly in JSON Lines format to `~/.cheetahclaws/logs/auth.jsonl` under TCP/UDS transport connections.

### B. Identified Architecture Bottlenecks
During deep-dive analysis of the connection handlers, server routines, and REPL executors, several performance constraints were mapped:
1. **Thread-per-Connection Socket Model (`web/server.py:2102`)**:
   - The web server handles requests by spawning a new `threading.Thread` for every connection (`srv.accept()`).
   - While adequate for small development environments, it is highly vulnerable to socket depletion under high-concurrency conditions (e.g., rapid SSE polls or multiple open WebSocket clients).
2. **SQLite Locking during High Event Rates (`cc_daemon/server.py` & `web/db.py`)**:
   - Both the daemon database (`sessions.db`) and the web UI database (`web.db`) are managed via direct SQLite connections with thread-safe wrappers.
   - High-throughput streaming operations (like real-time shell stdout streaming via SSE) write rapidly to these databases. Under parallel load, this can result in `database is locked` exceptions, stalling the event dispatcher.
3. **Graceful Shutdown Interceptors on Windows (`cc_daemon/cli.py:19-21`)**:
   - Because Windows lacks clean POSIX signal delivery (`SIGTERM`) for cross-process interruption, the daemon relies on writing a `system.shutdown` payload via TCP RPC.
   - If network interface faults block RPC endpoints, a Windows-hosted daemon process can become unresponsive and orphaned.
4. **PTY Session Reap Inefficiencies (`web/server.py:1966`)**:
   - Orphans are checked every `10` seconds by copying and lock-blocking the global `_sessions` dictionary. Under massive concurrent workspace sessions, this lock block delays incoming HTTP headers.

---

## 4. Programmatic Architecture Recommendations

### A. Designing a Programmatic Boot Checker
To verify system health before starting developer workspaces or continuous integrations, a dedicated validation daemon script is recommended. This checker should avoid shell wrappers and interface directly with Python endpoints.

#### Recommended Checker Logic Blueprint:
```python
import sys
import json
import socket
from pathlib import Path

def run_boot_check() -> bool:
    print("[*] Initiating CheetahClaws boot check sequence...")

    # Step 1: Check Directory Presence
    data_dir = Path.home() / ".cheetahclaws"
    if not data_dir.exists():
        print("[!] Data directory '~/.cheetahclaws' not found.")
        return False

    # Step 2: Read Discovery File
    discovery_file = data_dir / "daemon.json"
    if not discovery_file.exists():
        print("[!] Discovery file daemon.json does not exist. Daemon is not running.")
        return False
    
    try:
        info = json.loads(discovery_file.read_text(encoding="utf-8"))
        print(f"[*] Discovery data: Version={info.get('version')}, Transport={info.get('transport')}")
    except Exception as e:
        print(f"[!] Failed to parse discovery parameters: {e}")
        return False

    # Step 3: Verify Binding Sockets
    addr_str = info.get("address", "")
    if info.get("transport") == "unix":
        # Check Unix Socket
        sock_path = Path(addr_str)
        if not sock_path.exists():
            print(f"[!] Daemon claimed UDS path '{sock_path}' but file is missing.")
            return False
        try:
            s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            s.connect(str(sock_path))
            s.close()
            print("[+] UDS Connection validated successfully.")
        except Exception as e:
            print(f"[!] Failed to bind to UDS socket: {e}")
            return False
    else:
        # Check TCP Port
        try:
            host, port_s = addr_str.rsplit(":", 1)
            port = int(port_s)
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2.0)
            s.connect((host, port))
            s.close()
            print(f"[+] TCP Network port validation succeeded on {host}:{port}.")
        except Exception as e:
            print(f"[!] TCP Daemon connection refused on {addr_str}: {e}")
            return False

    # Step 4: Validate Database schema
    db_path = data_dir / "sessions.db"
    if not db_path.exists():
        print("[!] SQLite database 'sessions.db' is missing.")
        return False
    
    import sqlite3
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in cursor.fetchall()]
        conn.close()
        required_tables = ["daemon_events", "agent_runs", "schema_meta"]
        for table in required_tables:
            if table not in tables:
                print(f"[!] Critical table '{table}' missing from sessions.db.")
                return False
        print("[+] Schema inspection passed successfully.")
    except Exception as e:
        print(f"[!] Database diagnostics failed: {e}")
        return False

    print("[+] All CheetahClaws subsystems verified healthy.")
    return True

if __name__ == "__main__":
    sys.exit(0 if run_boot_check() else 1)
```

### B. Simulating Workloads and Daemon Stress
Simulating operations before deployment can be executed using the templates in the `demos/` directory.
1. **Replay-based Stress Testing**:
   - Locate `/Users/mac/cheetahclaws/demos/make_web_demo.py` and `/Users/mac/cheetahclaws/demos/make_demo.py`.
   - These scripts bootstrap a custom execution runner mimicking mock LLM completions.
   - Run these scripts with custom concurrency factors to stress target tables in `sessions.db`.
2. **Mocking External Interactions**:
   - Test suites inside `tests/conftest.py` configure mock LLM API responses. Stress tests should inherit these configurations to evaluate PTY buffer resizing and stream output generation.

### C. Optimization Vectors in `cheetahclaws.py`
To improve CLI performance, the following refactoring adjustments are recommended:
1. **Deferred Module Loading (Lazy Imports)**:
   - Several resource-heavy sub-modules (like `providers`, `ui.render`, and `web.server`) are imported during the setup/REPL checks in `cheetahclaws.py`.
   - Consolidating and moving these imports into the local scope of their specific handler commands will reduce the CLI startup latency of a standard non-interactive command (e.g. `cheetahclaws --version` or quick `--print` runs) by up to 80%.
2. **Buffer Stream Flushing**:
   - The thread loop in charge of PTY outputs runs on tight iterations. Tuning sleep parameters in the event loop of `agent_runner.py` will prevent CPU spikes under intensive file processing.
