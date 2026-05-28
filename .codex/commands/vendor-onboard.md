---
codex-command: "/vendor-onboard"
source: ".claude/commands/vendor-onboard.md"
invocation: "mekong vendor-onboard $ARGUMENTS"
description: "Vendor onboarding with security questionnaire"
argument-hint: "[goal]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "1012eb90281638e48a9647362822ece34fd2898939d2465895a61ebd3d2eadba"
---

# /vendor-onboard

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong vendor-onboard $ARGUMENTS
```

## Source Command

# /vendor:onboard — Vendor Onboard

**IC super command** — Vendor onboarding with security questionnaire

## Pipeline

```
SEQUENTIAL: intake-form → security-review → approve → setup-access
```

## Trigger

Runs recipe `recipes/vendor/onboard.json` through DAGScheduler.

## Execution

1. Load recipe DAG definition
2. Execute DAG groups in dependency order
3. Compile results into summary report

## Usage

```
/vendor:onboard [goal]
```

## Estimated: 2 credits, 8 minutes

## Goal context
<goal>$ARGUMENTS</goal>

Pass this goal to every sub-command as context for their analysis.
