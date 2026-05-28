---
codex-command: "/trading/cxo"
source: ".claude/commands/trading/cxo.md"
invocation: "mekong trading/cxo $ARGUMENTS"
description: "⚡⚡⚡ CXO Experience Command — trader UX audit, CLI usability, A2UI quality, onboarding flow"
argument-hint: "[action: audit|onboard|a2ui]"
allowed-tools: "default"
content-sha256: "fec9aed5d3c0af1f70b006758a253ffc9ddcfced84abf3c3987f76f81916a852"
---

# /trading/cxo

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/cxo $ARGUMENTS
```

## Source Command

**Ultrathink** CXO experience review: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/cxo-sops.md`

## Pipeline (4 steps)

### 1. ONBOARDING FLOW TEST
Run as new user: install → config → first backtest
- `pnpm install` clean? (<60s, 0 errors)
- API key setup intuitive?
- `/trading:auto BTC/USDT backtest` works first try?

### 2. CLI OUTPUT AUDIT
| Check | Standard | Pass? |
|-------|----------|-------|
| Colors | Rich formatting active | ✅/❌ |
| Tables | Aligned, scannable | ✅/❌ |
| Errors | Actionable, not cryptic | ✅/❌ |
| Progress | Real-time feedback | ✅/❌ |
| Reports | <100 lines, useful | ✅/❌ |

### 3. A2UI EVENT COVERAGE
Check `src/a2ui/types.ts` events implemented:
- [ ] INTENT_PREVIEW — shows what bot will do
- [ ] SIGNAL_RATIONALE — explains why
- [ ] CONFIDENCE_UPDATE — real-time %
- [ ] TRADE_EXECUTED — instant confirm
- [ ] RISK_ALERT — prominent, cannot miss
- [ ] AUTONOMY_CHANGE — explains level change

### 4. FRICTION POINTS
Identify + fix top 3 UX friction points.

## USAGE
```bash
/trading:cxo audit      # Full UX audit
/trading:cxo onboard    # Test onboarding flow
/trading:cxo a2ui       # A2UI event coverage
```
