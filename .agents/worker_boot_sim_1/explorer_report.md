# CheetahClaws Daemon Serve Mechanism Investigation Report

This report presents findings from a read-only investigation of the CheetahClaws codebase located at `/Users/mac/cheetahclaws` to analyze the daemon's architecture, serve mechanism, state management, database schema, and authentication protocols.

---

## 1. Daemon Start-Up & Entry Point

### Entry Points
The CheetahClaws daemon is started through two primary entry points:
1. **CLI command**: `cheetahclaws serve` (dispatched from the root `cheetahclaws.py`).
2. **Direct module execution**: `python -m cc_daemon.cli serve`.

The main code handling CLI parsing and execution lives in `/Users/mac/cheetahclaws/cc_daemon/cli.py`.
- `serve_main(argv: Optional[list[str]] = None) -> int`: The programmatic parser entry point.
- `cmd_serve(args: argparse.Namespace) -> int`: The actual serve loop executor.

### Supported CLI Arguments
The `ArgumentParser` constructed in `_build_serve_parser()` supports the following CLI arguments:

| Option | Type | Default Value | Description |
|---|---|---|---|
| `--listen` | `str` | `unix://~/.cheetahclaws/run/daemon.sock` | Transport/address specification. Format: `unix://<path>` or `tcp://<host>:<port>`. |
| `--data-dir` | `str` | `~/.cheetahclaws` | Base directory for storing configuration, tokens, pid files, discovery indexes, and databases. |
| `--token-path` | `str` | `~/.cheetahclaws/daemon_token` | Custom file path for storing the TCP bearer token (applicable to TCP transport only). |
| `--no-audit` | flag | `False` (default is ON) | If specified, disables the authorization/audit event log (`logs/auth.jsonl`). |
| `--print-token`| flag | `False` | Prints the active TCP bearer token to stdout (applicable to TCP transport only). |
| `--unauthenticated-metrics` | flag | `False` | Opt-in to expose system health and telemetry (`/healthz`, `/readyz`, `/metrics`) without credentials. |
| `--enable-kernel` | flag | `False` | Opt-in to enable `cc_kernel` (RFC 0003: AgentProcess + EventLog support). |
| `--kernel-db` | `str` | `None` (resolves to `<data-dir>/kernel.db`) | Path to the SQLite database used by `cc_kernel`. |
| `--kernel-recovery` | choices | `"suspend"` | Startup recovery policy for stale running/waiting rows. Choices: `"suspend"` or `"mark-dead"`. |

---

## 2. Configuration & State Storage Locations

By default, the daemon stores its persistent state within the `~/.cheetahclaws` directory (which expands to `Path.home() / ".cheetahclaws"`). The paths are defined in `cc_config.py` and resolved dynamically during bootstrap.

- **`daemon.json` (Discovery file)**:
  - Default Location: `~/.cheetahclaws/daemon.json`
  - Function: Tells CLI, Web, and REPL clients where the running daemon is bound. Written atomically on bind (using a `.tmp` file and `os.replace`) with strict `0600` permissions. Cleared automatically on graceful shutdown or when client detects a dead PID.
  - Schema: Contains keys for `pid`, `started_at` (UTC timestamp), `transport` (`unix` or `tcp`), `address` (absolute socket path or host:port), `version`, `schema` version, and optionally `token_path`.
- **`daemon_token`**:
  - Default Location: `~/.cheetahclaws/daemon_token` (overridable via `--token-path`).
  - Function: Persists the random 32-byte URL-safe cryptographic token used to validate TCP connections. Created on-demand with `0600` permissions if it does not exist.
- **`sessions.db`**:
  - Default Location: `~/.cheetahclaws/sessions.db`
  - Function: The central SQLite database shared between the daemon's asynchronous subsystems (events, agent runs, jobs, monitor subscriptions) and the interactive REPL's session store.
- **Other State Files**:
  - `~/.cheetahclaws/run/daemon.pid`: Persists the daemon's active process ID to prevent concurrent duplicate processes.
  - `~/.cheetahclaws/logs/daemon.log`: Main daemon serve log.
  - `~/.cheetahclaws/logs/auth.jsonl`: Append-only structured JSON lines log recording security audit records (successes, denies, lockouts).
  - `~/.cheetahclaws/originators.json`: Persists recognized unique clients and their corresponding client kinds.

---

## 3. Database Schema of `sessions.db`

The daemon-owned database tables are initialized dynamically via `init_schema()` in `/Users/mac/cheetahclaws/cc_daemon/schema.py`. The initialization applies connection optimizations: `PRAGMA journal_mode=WAL`, `PRAGMA synchronous=NORMAL`, and a `PRAGMA busy_timeout=5000` configuration.

### Tables & Column Definitions

#### A. `schema_meta`
Keeps track of active schema versions for future data migrations.
```sql
CREATE TABLE IF NOT EXISTS schema_meta (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
```

#### B. `daemon_events`
Append-only log recording daemon-wide lifecycle events.
```sql
CREATE TABLE IF NOT EXISTS daemon_events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    ts            TEXT NOT NULL,
    kind          TEXT NOT NULL,
    payload_json  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_daemon_events_ts ON daemon_events(ts);
```

#### C. `agent_runs`
Maintains records of active and complete asynchronous agent runner workflows.
```sql
CREATE TABLE IF NOT EXISTS agent_runs (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    template        TEXT NOT NULL,
    args            TEXT,
    status          TEXT NOT NULL,
    auto_approve    INTEGER NOT NULL DEFAULT 1,
    started_at      TEXT NOT NULL,
    ended_at        TEXT,
    last_iteration  INTEGER DEFAULT 0,
    error           TEXT
);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
```

#### D. `agent_iterations`
Stores diagnostic execution logs for each individual iteration within an agent run loop.
```sql
CREATE TABLE IF NOT EXISTS agent_iterations (
    run_id      TEXT NOT NULL,
    iteration   INTEGER NOT NULL,
    ts          TEXT NOT NULL,
    status      TEXT NOT NULL,
    duration_s  REAL,
    summary     TEXT,
    in_tokens   INTEGER DEFAULT 0,
    out_tokens  INTEGER DEFAULT 0,
    cost_usd    REAL DEFAULT 0,
    PRIMARY KEY (run_id, iteration)
);
```

#### E. `jobs`
Durable queue to store and retry scheduled background jobs.
```sql
CREATE TABLE IF NOT EXISTS jobs (
    id              TEXT PRIMARY KEY,
    title           TEXT,
    prompt          TEXT,
    source          TEXT,
    status          TEXT NOT NULL,
    created_at      TEXT,
    started_at      TEXT,
    done_at         TEXT,
    duration_s      REAL DEFAULT 0,
    steps_json      TEXT,
    step_count      INTEGER DEFAULT 0,
    current_step    TEXT,
    result          TEXT,
    error           TEXT,
    retry_of        TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
```

#### F. `monitor_subscriptions`
Stores durable subscription definitions for periodic checks (`/monitor`).
```sql
CREATE TABLE IF NOT EXISTS monitor_subscriptions (
    topic           TEXT PRIMARY KEY,
    schedule        TEXT NOT NULL,
    enabled         INTEGER NOT NULL DEFAULT 1,
    last_run_at     TEXT,
    next_run_at     TEXT,
    recipients_json TEXT,
    config_json     TEXT
);
```

#### G. `monitor_reports`
Stores historically generated diagnostic reports.
```sql
CREATE TABLE IF NOT EXISTS monitor_reports (
    id           TEXT PRIMARY KEY,
    topic        TEXT NOT NULL,
    ts           TEXT NOT NULL,
    body         TEXT,
    sent_to_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_monitor_reports_topic_ts ON monitor_reports(topic, ts);
```

#### H. `bridges`
Manages setup configs and error tracking for chat integration adapters (e.g., Slack, Telegram, WeChat).
```sql
CREATE TABLE IF NOT EXISTS bridges (
    kind          TEXT PRIMARY KEY,
    enabled       INTEGER NOT NULL DEFAULT 0,
    config_json   TEXT,
    last_poll_at  TEXT,
    last_error    TEXT
);
```

---

## 4. Connection Authentication, Endpoints, & RPC Mechanism

### Transport Protocols & Bind Locations
The daemon initiates a multithreaded server (derived from `socketserver.ThreadingMixIn` and `HTTPServer`) supporting two protocols:
1. **Unix Domain Sockets (`unix://`)**:
   - Bounds to the file socket path (default: `~/.cheetahclaws/run/daemon.sock`).
   - Standard transport for Unix/macOS. Parent directory permissions are set strictly to `0700` and the socket file is given `0600` permissions.
2. **TCP Socket (`tcp://`)**:
   - Bounds to loopback/network interface addresses (e.g., `tcp://127.0.0.1:8765`).
   - Useful for non-POSIX platforms (Windows) or remote orchestration.

### Authentication Mechanisms

#### A. Peer Credential Verification (Unix Sockets)
When using the Unix domain socket transport, the daemon automatically validates local process credentials:
- It fetches the process group/user ID of the client socket via `SO_PEERCRED` on Linux, or `getpeereid()` on macOS/Darwin.
- It compares the client process's effective UID against the daemon's own process owner UID (`os.geteuid()`).
- If UIDs match, access is seamlessly granted without requiring token lookup or headers.

#### B. Cryptographic Bearer Token Validation (TCP)
When connecting over TCP, HTTP headers are scrutinized:
- The client must include the header `Authorization: Bearer <token>`, where `<token>` is the secret 32-byte string read from the server's `daemon_token` file.
- The comparison is safely computed in constant time using `secrets.compare_digest`.

#### C. Throttling and Lockouts
- To prevent brute-force attacks on TCP or unauthorized Unix sockets, an in-memory `Throttle` logs failures.
- If any address or UID fails authentication 3 times within a 10-second window, the peer is locked out for 60 seconds (HTTP `429 Rate Limited`).

#### D. API Version Gate
- To guarantee API compatibility, all authenticated requests must contain the `Cheetahclaws-Api-Version` header matching `API_VERSION` (currently `"0"`).
- If the header is missing or mismatching, the request is rejected with `426 Upgrade Required` along with details of the mismatch.

---

### Request Routes & HTTP Endpoints

The HTTP serve loop in `/Users/mac/cheetahclaws/cc_daemon/server.py` routes incoming requests dynamically by their HTTP path:

- `POST /rpc`:
  - **Interface**: JSON-RPC 2.0.
  - **Function**: Accepts POST bodies containing JSON-RPC envelopes (e.g., `{"jsonrpc": "2.0", "method": "echo.ping", "params": {}, "id": 1}`).
  - **Registry**: Dispatched by `RpcRegistry` (defined in `rpc.py`). Methods are split across modules (e.g. `system_methods`, `monitor_methods`, `agent_methods`, `proactive_methods`, `bridge_methods`, `session_methods`) and executed inside a `CallContext` capturing `client_id` (derived from client identification header `X-Client-Id`) and `transport`.
- `GET /events`:
  - **Interface**: Server-Sent Events (SSE) stream (`text/event-stream`).
  - **Function**: Provides real-time tailing of daemon events.
  - **Replay**: Accepts a query parameter `?since=<index>` to replay missed history from the DB-backed event bus. Sends periodic comments as heartbeats every 15 seconds to prevent connection drops.
- `GET /healthz`, `GET /readyz`, `GET /metrics`:
  - **Interface**: Simple JSON health payloads.
  - **Telemetry**: Exposes Prometheus-ready system scrapable metrics. If the `--unauthenticated-metrics` flag is enabled at start-up, these endpoints completely bypass auth checks.
