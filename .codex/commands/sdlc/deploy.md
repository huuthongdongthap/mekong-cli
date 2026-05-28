---
codex-command: "/sdlc/deploy"
source: ".claude/commands/sdlc/deploy.md"
invocation: "mekong sdlc/deploy $ARGUMENTS"
description: "SDLC phase 4 — Deploy: verify gates → ship or hold. Queries GitHub Actions gates.yml, scaffolds DEPLOY_REPORT.md, prints tester agent prompt."
argument-hint: "[feature-slug, e.g. auth-mfa]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "d217f15a829af83d3deb7f4c0f2e5bd078a6f371598e0569b5396b7c5a925440"
---

# /sdlc/deploy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong sdlc/deploy $ARGUMENTS
```

## Source Command

# /sdlc:deploy — Deploy Phase

**Phase 4 of 4** in the agentic SDLC. Reads `TASKS.todo` + `CLAUDE.deploy.md` contract → queries CI gates → scaffolds `DEPLOY_REPORT.md` → prints tester agent prompt.

## Dispatch

```bash
mekong deploy new $ARGUMENTS
```

## Gate verification

Auto-queries `.github/workflows/gates.yml` latest run via `gh run list`. Prints per-gate table:

| Gate | Covers |
|------|--------|
| G1 Validation | ruff + pyright + tsc + pytest |
| G2 Security | bandit + semgrep + trivy |
| G3 Quality | coverage ≥ 40% |
| G4 Dep Audit | osv-scanner + pip-audit |
| G5 Deploy Ready | wrangler dry-run |
| Merge Gate | aggregates G1-G5 |

Non-blocking if `gh` CLI unavailable. Repo auto-detected from `git remote origin url` (no `gh repo set-default` required).

## Output

`.mekong/DEPLOY_REPORT.md` populated with: Gate summary, Test results, Smoke test URLs, Rollback plan, Go/No-Go verdict.

## Post-deploy

After 24h of production traffic:

```bash
mekong eval-agent $ARGUMENTS --days 1   # success rate, p95, avg credits
mekong metrics                           # overall dashboard
```

## Contract

`.mekong/phases/CLAUDE.deploy.md` — tester agent instructions (6-gate verification, smoke test protocol, rollback criteria).

## Related

- `/sdlc` — full flow overview
- `/sdlc:code` ← previous phase
- `/sdlc` — restart with new feature
