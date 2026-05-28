# Original User Request

## Initial Request — 2026-05-28T09:04:37+07:00

You are the Worker subagent (worker_tune_1_implementer) for the CheetahClaws project.
Your workspace directory is `/Users/mac/cheetahclaws`.

Your task is to apply the following dynamic tuning optimizations and verify them.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

---

### Implementation Instructions:

#### 1. SQLite Tuning in `session_store.py`
Add `conn.execute("PRAGMA synchronous=NORMAL")` to `session_store.py` inside the `_get_conn()` function, right after journal_mode WAL setup.
Target lines:
```python
    if conn is None:
        conn = sqlite3.connect(str(db_path), timeout=10)
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
        conn.execute("PRAGMA busy_timeout=5000")
```

#### 2. HTTP Server Socket Timeout in `cc_daemon/server.py`
In `cc_daemon/server.py`, override the `setup(self)` method in the `DaemonRequestHandler` class to set a socket read/write timeout of 30.0 seconds.
Target class `DaemonRequestHandler`:
```python
class DaemonRequestHandler(BaseHTTPRequestHandler):
    server_version = "cheetahclaws-daemon/0"
    
    def setup(self) -> None:
        super().setup()
        self.connection.settimeout(30.0)
```

#### 3. CLI Lazy Imports in `cheetahclaws.py`
Refactor the eager imports in `cheetahclaws.py` (lines 232-243 and 266-281) to load modules lazily on-demand.
Specifically:
- Defer `ui.input` using a lazy accessor.
- Defer `bridges.telegram`, `bridges.wechat`, `bridges.slack` using lazy accessors and the `_LazyBtg`, `_LazyBwx`, `_LazyBslk` proxy classes.
- Defer `commands.advanced`, `commands.agent_cmd`, `commands.monitor_cmd`, `commands.research_cmd`, `commands.lab_cmd` using lazy functions.

Provide the exact replacement code:

Replace the `ui.input` and `bridges` eager imports block:
```python
# ── Input layer (prompt_toolkit with readline fallback) ──────────────────
_ui_input_lazy = None
def _get_ui_input():
    global _ui_input_lazy
    if _ui_input_lazy is None:
        import ui.input as _ui_input
        _ui_input_lazy = _ui_input
    return _ui_input_lazy

def _pt_read_line(prompt, history_file):
    return _get_ui_input().read_line(prompt, history_file)

class _LazyHasPromptToolkit:
    def __bool__(self):
        try:
            return _get_ui_input().HAS_PROMPT_TOOLKIT
        except Exception:
            return False

HAS_PROMPT_TOOLKIT = _LazyHasPromptToolkit()

class _LazyUiInput:
    def __getattr__(self, name):
        return getattr(_get_ui_input(), name)
    def setup(self, *args, **kwargs):
        return _get_ui_input().setup(*args, **kwargs)
    def reset_session(self, *args, **kwargs):
        return _get_ui_input().reset_session(*args, **kwargs)

_ui_input = _LazyUiInput()

# ── Bridge commands ────────────────────────────────────────────────────────
_btg_lazy = None
def _get_btg():
    global _btg_lazy
    if _btg_lazy is None:
        import bridges.telegram as _btg
        _btg_lazy = _btg
    return _btg_lazy

_bwx_lazy = None
def _get_bwx():
    global _bwx_lazy
    if _bwx_lazy is None:
        import bridges.wechat as _bwx
        _bwx_lazy = _bwx
    return _bwx_lazy

_bslk_lazy = None
def _get_bslk():
    global _bslk_lazy
    if _bslk_lazy is None:
        import bridges.slack as _bslk
        _bslk_lazy = _bslk
    return _bslk_lazy

def cmd_telegram(*args, **kwargs):
    return _get_btg().cmd_telegram(*args, **kwargs)

def _tg_send(*args, **kwargs):
    return _get_btg()._tg_send(*args, **kwargs)

def cmd_wechat(*args, **kwargs):
    return _get_bwx().cmd_wechat(*args, **kwargs)

def _wx_start_bridge(*args, **kwargs):
    return _get_bwx()._wx_start_bridge(*args, **kwargs)

def cmd_slack(*args, **kwargs):
    return _get_bslk().cmd_slack(*args, **kwargs)

def _slack_start_bridge(*args, **kwargs):
    return _get_bslk()._slack_start_bridge(*args, **kwargs)

class _LazyBtg:
    def __getattr__(self, name):
        return getattr(_get_btg(), name)
    def __setattr__(self, name, value):
        setattr(_get_btg(), name, value)

class _LazyBwx:
    def __getattr__(self, name):
        return getattr(_get_bwx(), name)
    def __setattr__(self, name, value):
        setattr(_get_bwx(), name, value)

class _LazyBslk:
    def __getattr__(self, name):
        return getattr(_get_bslk(), name)
    def __setattr__(self, name, value):
        setattr(_get_bslk(), name, value)

_btg = _LazyBtg()
_bwx = _LazyBwx()
_bslk = _LazyBslk()
```

Replace the eager `advanced` and `monitor` commands block:
```python
# ── Advanced commands ──────────────────────────────────────────────────────
_adv_lazy = None
def _get_commands_advanced():
    global _adv_lazy
    if _adv_lazy is None:
        import commands.advanced as _adv
        _adv_lazy = _adv
    return _adv_lazy

def cmd_brainstorm(*args, **kwargs): return _get_commands_advanced().cmd_brainstorm(*args, **kwargs)
def cmd_worker(*args, **kwargs): return _get_commands_advanced().cmd_worker(*args, **kwargs)
def cmd_ssj(*args, **kwargs): return _get_commands_advanced().cmd_ssj(*args, **kwargs)
def cmd_draft(*args, **kwargs): return _get_commands_advanced().cmd_draft(*args, **kwargs)
def cmd_summarize(*args, **kwargs): return _get_commands_advanced().cmd_summarize(*args, **kwargs)
def cmd_memory(*args, **kwargs): return _get_commands_advanced().cmd_memory(*args, **kwargs)
def cmd_agents(*args, **kwargs): return _get_commands_advanced().cmd_agents(*args, **kwargs)
def cmd_skills(*args, **kwargs): return _get_commands_advanced().cmd_skills(*args, **kwargs)
def cmd_mcp(*args, **kwargs): return _get_commands_advanced().cmd_mcp(*args, **kwargs)
def cmd_plugin(*args, **kwargs): return _get_commands_advanced().cmd_plugin(*args, **kwargs)
def cmd_tasks(*args, **kwargs): return _get_commands_advanced().cmd_tasks(*args, **kwargs)
def _print_background_notifications(*args, **kwargs): return _get_commands_advanced()._print_background_notifications(*args, **kwargs)
def _save_synthesis(*args, **kwargs): return _get_commands_advanced()._save_synthesis(*args, **kwargs)

# ── Agent (autonomous loop) command ───────────────────────────────────────
_agent_lazy = None
def _get_commands_agent():
    global _agent_lazy
    if _agent_lazy is None:
        import commands.agent_cmd as _agent
        _agent_lazy = _agent
    return _agent_lazy

def cmd_agent(*args, **kwargs): return _get_commands_agent().cmd_agent(*args, **kwargs)

# ── Monitor / Subscribe commands ──────────────────────────────────────────
_mon_lazy = None
def _get_commands_monitor():
    global _mon_lazy
    if _mon_lazy is None:
        import commands.monitor_cmd as _mon
        _mon_lazy = _mon
    return _mon_lazy

def cmd_subscribe(*args, **kwargs): return _get_commands_monitor().cmd_subscribe(*args, **kwargs)
def cmd_subscriptions(*args, **kwargs): return _get_commands_monitor().cmd_subscriptions(*args, **kwargs)
def cmd_unsubscribe(*args, **kwargs): return _get_commands_monitor().cmd_unsubscribe(*args, **kwargs)
def cmd_monitor(*args, **kwargs): return _get_commands_monitor().cmd_monitor(*args, **kwargs)

_res_lazy = None
def _get_commands_research():
    global _res_lazy
    if _res_lazy is None:
        import commands.research_cmd as _res
        _res_lazy = _res
    return _res_lazy

def cmd_research(*args, **kwargs): return _get_commands_research().cmd_research(*args, **kwargs)
def cmd_reports(*args, **kwargs): return _get_commands_research().cmd_reports(*args, **kwargs)

_lab_lazy = None
def _get_commands_lab():
    global _lab_lazy
    if _lab_lazy is None:
        import commands.lab_cmd as _lab
        _lab_lazy = _lab
    return _lab_lazy

def cmd_lab(*args, **kwargs): return _get_commands_lab().cmd_lab(*args, **kwargs)
```

---

### Verification:
1. Run `python3 tests/check_boot.py` inside `/Users/mac/cheetahclaws` to verify the daemon boots up, discovery file schema is correct, and SQLite connection works properly.
2. Run `python3 tests/run_stress_sim.py` inside `/Users/mac/cheetahclaws` to execute the multi-threaded simulation stress harness. Verify it runs successfully, returning `exit code 0` with zero unhandled exceptions, locking errors, or failed requests!
3. Produce the final `/Users/mac/mekong-cli/.agents/worker_tune_1/changes.md` report showing all applied edits, and `/Users/mac/mekong-cli/.agents/worker_tune_1/handoff.md` summarizing the outcomes.
4. Message the parent with the results.

Apply the edits, execute the verification tests, and write the reports. Do not skip any steps!
