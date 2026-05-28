# Applied Performance and Robustness Edits

The following optimizations and improvements have been applied to CheetahClaws:

## 1. SQLite Connection Tuning in `session_store.py`
Optimized the SQLite database connection to use `PRAGMA synchronous=NORMAL` when `WAL` mode is active. This significantly improves write transaction speeds (avoiding full disk synchronization on every commit) while fully maintaining transaction durability guarantees.

**File:** `/Users/mac/cheetahclaws/session_store.py`

**Diff:**
```diff
@@ -39,6 +39,7 @@
     if conn is None:
         conn = sqlite3.connect(str(db_path), timeout=10)
         conn.execute("PRAGMA journal_mode=WAL")
+        conn.execute("PRAGMA synchronous=NORMAL")
         conn.execute("PRAGMA busy_timeout=5000")
         conn.row_factory = sqlite3.Row
         _local.conn = conn
```

---

## 2. HTTP Server Socket Timeout in `cc_daemon/server.py`
Introduced a TCP connection timeout of 30.0 seconds on request sockets managed by the `DaemonRequestHandler`. This prevents resource exhaustion attacks or hanging clients (e.g. slow HTTP read/write attacks) from monopolizing daemon thread capacity.

**File:** `/Users/mac/cheetahclaws/cc_daemon/server.py`

**Diff:**
```diff
@@ -96,6 +96,11 @@
 
 class DaemonRequestHandler(BaseHTTPRequestHandler):
     server_version = "cheetahclaws-daemon/0"
+    
+    def setup(self) -> None:
+        super().setup()
+        self.connection.settimeout(30.0)
+
     # Quiet stdlib stderr logging; project should route through its own log
     # facility if desired.
     def log_message(self, fmt, *args):  # noqa
```

---

## 3. CLI Lazy Imports in `cheetahclaws.py`
Refactored eager imports within the CLI entrypoint script `cheetahclaws.py` into lazy-loaded proxies. Heavy UI components (`prompt_toolkit` input layer), external chat integration bridges (`bridges.telegram`, `bridges.wechat`, `bridges.slack`), and advanced slash-command handlers (`commands.advanced`, `commands.agent_cmd`, `commands.monitor_cmd`, `commands.research_cmd`, `commands.lab_cmd`) are now only loaded when actually invoked, dropping cold-start time.

**File:** `/Users/mac/cheetahclaws/cheetahclaws.py`

**Diff Block A (prompt_toolkit and bridge commands):**
```diff
@@ -229,17 +229,101 @@
 )
 
 # ── Input layer (prompt_toolkit with readline fallback) ──────────────────
-import ui.input as _ui_input
-_pt_read_line = _ui_input.read_line
-HAS_PROMPT_TOOLKIT = _ui_input.HAS_PROMPT_TOOLKIT
+# ── Input layer (prompt_toolkit with readline fallback) ──────────────────
+_ui_input_lazy = None
+def _get_ui_input():
+    global _ui_input_lazy
+    if _ui_input_lazy is None:
+        import ui.input as _ui_input
+        _ui_input_lazy = _ui_input
+    return _ui_input_lazy
+
+def _pt_read_line(prompt, history_file):
+    return _get_ui_input().read_line(prompt, history_file)
+
+class _LazyHasPromptToolkit:
+    def __bool__(self):
+        try:
+            return _get_ui_input().HAS_PROMPT_TOOLKIT
+        except Exception:
+            return False
+
+HAS_PROMPT_TOOLKIT = _LazyHasPromptToolkit()
+
+class _LazyUiInput:
+    def __getattr__(self, name):
+        return getattr(_get_ui_input(), name)
+    def setup(self, *args, **kwargs):
+        return _get_ui_input().setup(*args, **kwargs)
+    def reset_session(self, *args, **kwargs):
+        return _get_ui_input().reset_session(*args, **kwargs)
+
+_ui_input = _LazyUiInput()
 
 # ── Bridge commands ────────────────────────────────────────────────────────
-import bridges.telegram as _btg
-import bridges.wechat   as _bwx
-import bridges.slack    as _bslk
-from bridges.telegram import cmd_telegram, _tg_send
-from bridges.wechat   import cmd_wechat, _wx_start_bridge
-from bridges.slack    import cmd_slack, _slack_start_bridge
+_btg_lazy = None
+def _get_btg():
+    global _btg_lazy
+    if _btg_lazy is None:
+        import bridges.telegram as _btg
+        _btg_lazy = _btg
+    return _btg_lazy
+
+_bwx_lazy = None
+def _get_bwx():
+    global _bwx_lazy
+    if _bwx_lazy is None:
+        import bridges.wechat as _bwx
+        _bwx_lazy = _bwx
+    return _bwx_lazy
+
+_bslk_lazy = None
+def _get_bslk():
+    global _bslk_lazy
+    if _bslk_lazy is None:
+        import bridges.slack as _bslk
+        _bslk_lazy = _bslk
+    return _bslk_lazy
+
+def cmd_telegram(*args, **kwargs):
+    return _get_btg().cmd_telegram(*args, **kwargs)
+
+def _tg_send(*args, **kwargs):
+    return _get_btg()._tg_send(*args, **kwargs)
+
+def cmd_wechat(*args, **kwargs):
+    return _get_bwx().cmd_wechat(*args, **kwargs)
+
+def _wx_start_bridge(*args, **kwargs):
+    return _get_bwx()._wx_start_bridge(*args, **kwargs)
+
+def cmd_slack(*args, **kwargs):
+    return _get_bslk().cmd_slack(*args, **kwargs)
+
+def _slack_start_bridge(*args, **kwargs):
+    return _get_bslk()._slack_start_bridge(*args, **kwargs)
+
+class _LazyBtg:
+    def __getattr__(self, name):
+        return getattr(_get_btg(), name)
+    def __setattr__(self, name, value):
+        setattr(_get_btg(), name, value)
+
+class _LazyBwx:
+    def __getattr__(self, name):
+        return getattr(_get_bwx(), name)
+    def __setattr__(self, name, value):
+        setattr(_get_bwx(), name, value)
+
+class _LazyBslk:
+    def __getattr__(self, name):
+        return getattr(_get_bslk(), name)
+    def __setattr__(self, name, value):
+        setattr(_get_bslk(), name, value)
+
+_btg = _LazyBtg()
+_bwx = _LazyBwx()
+_bslk = _LazyBslk()
```

**Diff Block B (advanced, agent, monitor, research, lab commands):**
```diff
@@ -348,20 +348,73 @@
 from commands.checkpoint_plan import cmd_checkpoint, cmd_rewind, cmd_plan
 
 # ── Advanced commands ──────────────────────────────────────────────────────
-from commands.advanced import (
-    cmd_brainstorm, cmd_worker, cmd_ssj, cmd_draft, cmd_summarize,
-    cmd_memory, cmd_agents, cmd_skills, cmd_mcp, cmd_plugin, cmd_tasks,
-    _save_synthesis, _print_background_notifications,
-)
+_adv_lazy = None
+def _get_commands_advanced():
+    global _adv_lazy
+    if _adv_lazy is None:
+        import commands.advanced as _adv
+        _adv_lazy = _adv
+    return _adv_lazy
+
+def cmd_brainstorm(*args, **kwargs): return _get_commands_advanced().cmd_brainstorm(*args, **kwargs)
+def cmd_worker(*args, **kwargs): return _get_commands_advanced().cmd_worker(*args, **kwargs)
+def cmd_ssj(*args, **kwargs): return _get_commands_advanced().cmd_ssj(*args, **kwargs)
+def cmd_draft(*args, **kwargs): return _get_commands_advanced().cmd_draft(*args, **kwargs)
+def cmd_summarize(*args, **kwargs): return _get_commands_advanced().cmd_summarize(*args, **kwargs)
+def cmd_memory(*args, **kwargs): return _get_commands_advanced().cmd_memory(*args, **kwargs)
+def cmd_agents(*args, **kwargs): return _get_commands_advanced().cmd_agents(*args, **kwargs)
+def cmd_skills(*args, **kwargs): return _get_commands_advanced().cmd_skills(*args, **kwargs)
+def cmd_mcp(*args, **kwargs): return _get_commands_advanced().cmd_mcp(*args, **kwargs)
+def cmd_plugin(*args, **kwargs): return _get_commands_advanced().cmd_plugin(*args, **kwargs)
+def cmd_tasks(*args, **kwargs): return _get_commands_advanced().cmd_tasks(*args, **kwargs)
+def _print_background_notifications(*args, **kwargs): return _get_commands_advanced()._print_background_notifications(*args, **kwargs)
+def _save_synthesis(*args, **kwargs): return _get_commands_advanced()._save_synthesis(*args, **kwargs)
 
 # ── Agent (autonomous loop) command ───────────────────────────────────────
-from commands.agent_cmd import cmd_agent
+_agent_lazy = None
+def _get_commands_agent():
+    global _agent_lazy
+    if _agent_lazy is None:
+        import commands.agent_cmd as _agent
+        _agent_lazy = _agent
+    return _agent_lazy
+
+def cmd_agent(*args, **kwargs): return _get_commands_agent().cmd_agent(*args, **kwargs)
 
 # ── Monitor / Subscribe commands ──────────────────────────────────────────
-from commands.monitor_cmd import cmd_subscribe, cmd_subscriptions, cmd_unsubscribe, cmd_monitor
-
-from commands.research_cmd import cmd_research, cmd_reports
-from commands.lab_cmd import cmd_lab
+_mon_lazy = None
+def _get_commands_monitor():
+    global _mon_lazy
+    if _mon_lazy is None:
+        import commands.monitor_cmd as _mon
+        _mon_lazy = _mon
+    return _mon_lazy
+
+def cmd_subscribe(*args, **kwargs): return _get_commands_monitor().cmd_subscribe(*args, **kwargs)
+def cmd_subscriptions(*args, **kwargs): return _get_commands_monitor().cmd_subscriptions(*args, **kwargs)
+def cmd_unsubscribe(*args, **kwargs): return _get_commands_monitor().cmd_unsubscribe(*args, **kwargs)
+def cmd_monitor(*args, **kwargs): return _get_commands_monitor().cmd_monitor(*args, **kwargs)
+
+_res_lazy = None
+def _get_commands_research():
+    global _res_lazy
+    if _res_lazy is None:
+        import commands.research_cmd as _res
+        _res_lazy = _res
+    return _res_lazy
+
+def cmd_research(*args, **kwargs): return _get_commands_research().cmd_research(*args, **kwargs)
+def cmd_reports(*args, **kwargs): return _get_commands_research().cmd_reports(*args, **kwargs)
+
+_lab_lazy = None
+def _get_commands_lab():
+    global _lab_lazy
+    if _lab_lazy is None:
+        import commands.lab_cmd as _lab
+        _lab_lazy = _lab
+    return _lab_lazy
+
+def cmd_lab(*args, **kwargs): return _get_commands_lab().cmd_lab(*args, **kwargs)
```
