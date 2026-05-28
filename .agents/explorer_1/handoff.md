# Handoff Report — Code Structure and Test Explorer

This report documents the exact line numbers, file paths, and surrounding code segments in the `/Users/mac/cheetahclaws` workspace to support subsequent implementing subagents.

---

## 1. Observation

Direct code observations with exact line numbers and contents.

### A. SQLite Connection WAL/PRAGMA Setup (`session_store.py`)
- **File Path**: `/Users/mac/cheetahclaws/session_store.py`
- **Function**: `_get_conn()`
- **Line Numbers**: 35 to 46 (inclusive)
- **Surrounding Code**:
```python
35: def _get_conn() -> sqlite3.Connection:
36:     """Get a thread-local SQLite connection (one per thread, reused)."""
37:     conn = getattr(_local, "conn", None)
38:     db_path = _get_db_path()
39:     if conn is None:
40:         conn = sqlite3.connect(str(db_path), timeout=10)
41:         conn.execute("PRAGMA journal_mode=WAL")
42:         conn.execute("PRAGMA busy_timeout=5000")
43:         conn.row_factory = sqlite3.Row
44:         _local.conn = conn
45:         _init_tables(conn)
46:     return conn
```

### B. `DaemonRequestHandler` Class (`cc_daemon/server.py`)
- **File Path**: `/Users/mac/cheetahclaws/cc_daemon/server.py`
- **Class**: `DaemonRequestHandler`
- **Line Numbers**: 97 onwards
- **Class Definition and Start**:
```python
97: class DaemonRequestHandler(BaseHTTPRequestHandler):
98:     server_version = "cheetahclaws-daemon/0"
99:     # Quiet stdlib stderr logging; project should route through its own log
100:     # facility if desired.
101:     def log_message(self, fmt, *args):  # noqa
102:         return
```
- **Observation on `setup(self)`**: A case-sensitive search for `def setup` inside the file returned zero matches. This confirms that the `setup` method is **not currently overridden** in `DaemonRequestHandler` or in this file. It must be added to override `BaseHTTPRequestHandler.setup()`.

### C. Eager Import Blocks (`cheetahclaws.py`)
- **File Path**: `/Users/mac/cheetahclaws/cheetahclaws.py`
- **Block 1 (lines 232-243)**: Eager imports for `ui.input` and the telegram/wechat/slack network bridges:
```python
232: import ui.input as _ui_input
233: _pt_read_line = _ui_input.read_line
234: HAS_PROMPT_TOOLKIT = _ui_input.HAS_PROMPT_TOOLKIT
235: 
236: # ── Bridge commands ────────────────────────────────────────────────────────
237: import bridges.telegram as _btg
238: import bridges.wechat   as _bwx
239: import bridges.slack    as _bslk
240: from bridges.telegram import cmd_telegram, _tg_send
241: from bridges.wechat   import cmd_wechat, _wx_start_bridge
242: from bridges.slack    import cmd_slack, _slack_start_bridge
```
- **Block 2 (lines 266-281)**: Eager imports for advanced commands, autonomous agent loop, and subscriptions/lab:
```python
266: # ── Advanced commands ──────────────────────────────────────────────────────
267: from commands.advanced import (
268:     cmd_brainstorm, cmd_worker, cmd_ssj, cmd_draft, cmd_summarize,
269:     cmd_memory, cmd_agents, cmd_skills, cmd_mcp, cmd_plugin, cmd_tasks,
270:     _save_synthesis, _print_background_notifications,
271: )
272: 
273: # ── Agent (autonomous loop) command ───────────────────────────────────────
274: from commands.agent_cmd import cmd_agent
275: 
276: # ── Monitor / Subscribe commands ──────────────────────────────────────────
277: from commands.monitor_cmd import cmd_subscribe, cmd_subscriptions, cmd_unsubscribe, cmd_monitor
278: 
279: from commands.research_cmd import cmd_research, cmd_reports
280: from commands.lab_cmd import cmd_lab
```

---

## 2. Logic Chain

1. **WAL/PRAGMA Setup Verification**:
   - `_get_conn` is defined in `/Users/mac/cheetahclaws/session_store.py` at line 35.
   - Examining the lines inside `_get_conn` (lines 40-42) shows it establishes a connection using `sqlite3.connect` and executes PRAGMAs for `journal_mode=WAL` and `busy_timeout=5000`.
   - It does *not* set `PRAGMA synchronous=NORMAL`. Setting this synchronous mode is a standard WAL optimization to prevent blocking commits on full disk flushes (which otherwise default to FULL synchronous mode in SQLite).

2. **RequestHandler Setup Verification**:
   - `DaemonRequestHandler` is defined in `/Users/mac/cheetahclaws/cc_daemon/server.py` at line 97.
   - Grep search for `def setup` inside `/Users/mac/cheetahclaws/cc_daemon/server.py` returned no results.
   - Therefore, `DaemonRequestHandler` inherits `setup` directly from `BaseHTTPRequestHandler` (which does not set a socket timeout). Overriding `setup` in `DaemonRequestHandler` to call `super().setup()` and `self.connection.settimeout(30.0)` is safe and necessary to prevent hung connection threads.

3. **Eager Imports Optimization**:
   - Startup latency in CLI commands is frequently dominated by eager imports of large frameworks (like `prompt_toolkit` used by `ui.input`) and unused command groups/network bridges.
   - The eager imports blocks at `cheetahclaws.py` lines 232-243 and 266-281 load all bridges and commands unconditionally during every CLI boot.
   - Deferring these imports to lazy functions/accessors or proxies will directly reduce cold-start boot time of `cheetahclaws.py`.

---

## 3. Caveats

- **No Caveats**: The investigation was highly scoped to finding exact targets and line numbers, which was completely successful. All files were read directly from their respective absolute paths in `/Users/mac/cheetahclaws/`.

---

## 4. Conclusion

The exact line ranges and files for implementing the dynamic tuning optimizations have been successfully cataloged and verified. The proposed changes can be made with high precision using the identified target areas.

---

## 5. Verification Method

To verify these observations independently:
1. Read `/Users/mac/cheetahclaws/session_store.py` from line 35 to 46 using `view_file` to verify `_get_conn()` signature and lines.
2. Read `/Users/mac/cheetahclaws/cc_daemon/server.py` starting at line 97 to confirm `DaemonRequestHandler`'s presence and the absence of a `setup(self)` method definition.
3. Read `/Users/mac/cheetahclaws/cheetahclaws.py` from lines 230 to 285 to confirm the location of eager bridge and command imports.
