---
description: "RAM cleanup + machine cooldown — purge memory, kill orphan processes, flush caches, reduce swap. 1 step, ~10s."
argument-hint: "[--dry-run] [--aggressive]"
allowed-tools: Bash
---

# /ops:ram-cool — RAM Cleanup & Cooldown

**Ops command** — runs `scripts/ram-cool.sh` to free RAM and cool the machine.

## Usage

```bash
# Standard cleanup (safe defaults)
bash scripts/ram-cool.sh

# Dry run — preview what would be killed
bash scripts/ram-cool.sh --dry-run

# Aggressive — also trim duplicate MCP instances
bash scripts/ram-cool.sh --aggressive
```

## What it does

| Step | Action | Sudo? |
|------|--------|-------|
| 1 | Kill redundant caffeinate (keep 1) | No |
| 2 | Kill orphan/stale processes | No |
| 3 | `sync` + `purge` + `drop_caches` | Yes (skipped if no sudo) |
| 4 | *(aggressive)* Trim duplicate MCP instances | No |

## Output

```
BEFORE | Free: X.XXGB | Swap: XXXXXMB | caffeinate: N | load: { x.xx x.xx x.xx }
AFTER  | Free: X.XXGB | Swap: XXXXXMB | caffeinate: N | load: { x.xx x.xx x.xx }
DONE   | +X.XX GB freed
```

## Post-run tips

- Run `sudo pmset -a powermode 1` to unlock M1 Max full performance
- Restart Claude session if context7 MCP was killed
