---
codex-command: "/worker-push"
source: ".claude/commands/worker-push.md"
invocation: "mekong worker-push $ARGUMENTS"
description: "Push commits to remote with CI/CD verification"
argument-hint: "[branch]"
allowed-tools: "default"
content-sha256: "e6c54bd2fa047732fca695fff75513ef899c2eb09e1d45dba4c2a320acc51000"
---

# /worker-push

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong worker-push $ARGUMENTS
```

## Source Command

# /worker-push — Worker Operation

Push and verify deployment.

1. `git push origin [branch]`
2. Monitor CI/CD pipeline
3. Verify deployment status
4. Report: Push/CI/Deploy status
