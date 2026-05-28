---
codex-command: "/gateway-key"
source: ".claude/commands/gateway-key.md"
invocation: "mekong gateway-key $ARGUMENTS"
description: "API key provisioning, rotation, and revocation"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1f3321bc592426c83dec13229f9deb37321049eb28bfe37f626965c291fad2b2"
---

# /gateway-key

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong gateway-key $ARGUMENTS
```

## Source Command

# /gateway:key — API Key Management
**IC super command** — API key provisioning, rotation, and revocation
## Pipeline
```
SEQUENTIAL: provision → set-scopes → monitor-usage
```
## Trigger
Runs recipe `recipes/gateway/key.json` through DAGScheduler.
## Execution
1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report
## Usage
```
/gateway:key [goal]
```
## Estimated: 2 credits, 5 minutes
## Goal context
<goal>$ARGUMENTS</goal>
Pass this goal to every sub-command as context for their analysis.
