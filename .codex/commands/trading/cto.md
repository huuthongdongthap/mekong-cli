---
codex-command: "/trading/cto"
source: ".claude/commands/trading/cto.md"
invocation: "mekong trading/cto $ARGUMENTS"
description: "⚡⚡⚡⚡⚡ CTO Tech Command — architecture, code quality, tech debt, performance, infrastructure, testing strategy"
argument-hint: "[action: review|debt|perf|arch|deps] [period: weekly|monthly]"
allowed-tools: "default"
content-sha256: "369c016713e97efe15a47087b38a157f00d1c24dd50159018258503dcd7474cf"
---

# /trading/cto

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/cto $ARGUMENTS
```

## Source Command

**Ultrathink** CTO tech review: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/cto-sops.md`

## Pipeline (6 steps)

### 1. BUILD + TEST GATE
```bash
tsc --noEmit 2>&1 | tail -5          # 0 errors
pnpm test 2>&1 | tail -10            # all PASS
```

### 2. TECH DEBT SCAN
```bash
grep -rc "@ts-ignore\|@ts-nocheck" src/ --include="*.ts" | grep -v ":0$"
grep -rc ": any" src/ --include="*.ts" | grep -v ":0$"
grep -rc "TODO\|FIXME" src/ --include="*.ts" | grep -v ":0$"
grep -rc "console\." src/ --include="*.ts" | grep -v ":0$"
```
Score: 0 = CLEAN, >0 = debt items to fix.

### 3. ARCHITECTURE AUDIT
| Module | Files | Pattern | Healthy? |
|--------|-------|---------|----------|
| Core | `src/core/` | Plan-Execute-Verify | ✅/❌ |
| Strategies | `src/strategies/` | SignalGenerator consensus | ✅/❌ |
| Execution | `src/execution/` | Stealth + circuit breakers | ✅/❌ |
| Pipeline | `src/pipeline/` | WorkflowPipelineEngine | ✅/❌ |
| A2UI | `src/a2ui/` | Event-driven | ✅/❌ |
| Netdata | `src/netdata/` | HealthManager | ✅/❌ |

### 4. PERFORMANCE CHECK
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Build | <10s | Xs | 🟢/🔴 |
| Tests | <3min | Xmin | 🟢/🔴 |
| File >200 LOC | 0 | N | 🟢/🔴 |
| Memory | <500MB | XMB | 🟢/🔴 |

### 5. DEPENDENCY AUDIT
```bash
pnpm audit 2>&1 | tail -10
pnpm outdated 2>&1 | head -20
```

### 6. REPORT
Save: `plans/reports/cto-{period}-{date}.md`

## USAGE
```bash
/trading:cto weekly          # Full weekly review
/trading:cto debt            # Tech debt scan only
/trading:cto perf            # Performance only
/trading:cto arch            # Architecture audit
/trading:cto deps            # Dependency audit
```
