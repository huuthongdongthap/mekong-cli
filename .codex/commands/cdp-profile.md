---
codex-command: "/cdp-profile"
source: ".claude/commands/cdp-profile.md"
invocation: "mekong cdp-profile $ARGUMENTS"
description: "Unified customer profile across all touchpoints"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "363b2c18fed608b40ae51b2747ca300e8baf37b9ad7507fe4d512f55c9485f44"
---

# /cdp-profile

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cdp-profile $ARGUMENTS
```

## Source Command

# /cdp:profile — Customer 360
**IC super command** — Unified customer profile across all touchpoints
## Pipeline
```
SEQUENTIAL: merge-sources → resolve-identity → build-profile
```
## Trigger
Runs recipe `recipes/cdp/profile.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/cdp:profile [goal]
```
## Estimated: 3 credits, 10 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
