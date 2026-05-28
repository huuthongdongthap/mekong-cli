## 2026-05-28T01:51:47Z
You are a read-only exploration agent. Your task is to investigate the CheetahClaws codebase at /Users/mac/cheetahclaws to understand its daemon serve mechanism and imports.
Specifically, find out:
1. How is the daemon started? What is the entrypoint (e.g. cheetahclaws.py serve)? What CLI arguments does it support (like --listen, --unauthenticated-metrics)?
2. Where does it store its state, daemon.json, daemon_token, and sessions.db?
3. What is the schema of sessions.db? Are there tables named daemon_events, agent_runs, schema_meta? What are their column definitions or how are they initialized?
4. How is the daemon connection authenticated? How does one make HTTP or RPC requests to it? What endpoints/ports does it listen on?
5. Write your findings to `/Users/mac/mekong-cli/.agents/worker_boot_sim_1/explorer_report.md`.
