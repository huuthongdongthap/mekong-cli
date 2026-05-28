---
codex-command: "/worker-health"
source: ".claude/commands/worker-health.md"
invocation: "mekong worker-health $ARGUMENTS"
description: "Health check: build status, test results, dependency audit"
argument-hint: "[project-name]"
allowed-tools: "default"
content-sha256: "3665e06130f9d5ef50d12e061bcd97b5eb57451e6e7c17138078b6bb488a4fc0"
---

# /worker-health

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-health $ARGUMENTS
```

## Source Command

# /worker-health — Worker Operation

Run comprehensive health check.

1. `npm run build` — check for errors
2. `npm test` — check pass rate
3. `npm audit` — security check
4. Report: Build/Tests/Security status
