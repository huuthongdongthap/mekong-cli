---
codex-command: "/dev-deploy"
source: ".claude/commands/dev-deploy.md"
invocation: "mekong dev-deploy $ARGUMENTS"
description: "Dev deploy command. Delegates to worker level."
argument-hint: "[feature or context]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "81bbdd1b5451fb17139b0cdbed02d35015fcb04655437f69b2c35e664cb23faf"
---

# /dev-deploy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong dev-deploy $ARGUMENTS
```

## Source Command

# /dev:deploy — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:deploy → worker:*
OUTPUT: reports/dev/deploy/

## Execution

Load recipe: recipes/dev/deploy.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
