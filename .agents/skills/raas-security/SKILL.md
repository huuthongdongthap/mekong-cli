---
name: raas-security
description: "Security audit and hardening. 1 command, ~30-45 min."
---

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
