---
codex-command: "/raas/security"
source: ".claude/commands/raas/security.md"
invocation: "mekong raas/security $ARGUMENTS"
description: "Security audit and hardening. 1 command, ~30-45 min."
argument-hint: "[security focus area]"
allowed-tools: "Read, Grep, Task, Bash"
content-sha256: "613d7aae817d83851d9e3864f62aa9f00236217f091a9445f4663f38d5f39ecb"
---

# /raas/security

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong raas/security $ARGUMENTS
```

## Source Command

# /security — Security Audit & Hardening

**Ops** — single command.

## Estimated: 5 credits, 30-45 minutes

## Workflow

[Scan Vulnerabilities] → [Check Auth/Authorization] → [Review Secrets] → [Test Input Validation] → [Verify Headers] → [Report + Fix]

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation (zod)
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] CSRF protection
- [ ] Rate limiting enabled
- [ ] Security headers configured
