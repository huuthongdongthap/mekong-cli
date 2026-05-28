---
codex-command: "/trading/founder/strategy"
source: ".claude/commands/trading/founder/strategy.md"
invocation: "mekong trading/founder/strategy $ARGUMENTS"
description: "⚡⚡⚡ Founder Strategy Lifecycle — promote/demote/kill strategies, phase transitions, weight optimization"
argument-hint: "[action: review|promote|demote|kill] [strategy: macd-bollinger-rsi|rsi-sma|bollinger|macd-crossover|all]"
allowed-tools: "default"
content-sha256: "41c5b737409fd4d6c223eadff41f3ce40555b4366447e9a9defc2b69a0fe2406"
---

# /trading/founder/strategy

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/founder/strategy $ARGUMENTS
```

## Source Command

**Ultrathink** Founder strategy lifecycle: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/founder-sops.md` SOP-F07

## Strategy Lifecycle — 5 Phases

```
RESEARCH → BACKTEST → PAPER → LIVE SMALL → LIVE SCALE
   1-2d      1d        3-7d     2-4 weeks    ongoing
```

## Pipeline (4 steps)

### 1. Strategy Inventory
| Strategy | Weight | Phase | Trades | WR | Sharpe | DD | Status |
|----------|--------|-------|--------|-----|--------|-----|--------|
| MacdBollingerRsi | 0.30 | {phase} | {N} | XX% | X.XX | XX% | 🟢/🟡/🔴 |
| RsiSma | 0.25 | {phase} | {N} | XX% | X.XX | XX% | 🟢/🟡/🔴 |
| Bollinger | 0.25 | {phase} | {N} | XX% | X.XX | XX% | 🟢/🟡/🔴 |
| MacdCrossover | 0.20 | {phase} | {N} | XX% | X.XX | XX% | 🟢/🟡/🔴 |

**Source:** `src/core/SignalGenerator.ts`, trading reports

### 2. Kill Criteria Check (Per Strategy)
- [ ] Sharpe <0.5 for 1 week live? → **KILL**
- [ ] Win Rate <40% (20+ trades)? → **KILL**
- [ ] Max DD >15%? → **KILL**
- [ ] 5 consecutive losses? → **DEMOTE**

### 3. Promotion Criteria Check
| Transition | Criteria | Met? |
|-----------|----------|------|
| RESEARCH → BACKTEST | Hypothesis documented | ✅/❌ |
| BACKTEST → PAPER | Sharpe >1, WR >55%, DD <10% | ✅/❌ |
| PAPER → LIVE SMALL | ≥20 trades, consistent P&L | ✅/❌ |
| LIVE SMALL → LIVE SCALE | 2 weeks profitable | ✅/❌ |

### 4. Weight Optimization
Self-learning adjustments:
- Win → strategy weight +0.05
- Loss → strategy weight -0.05
- Rebalance: ensure sum = 1.0

**Source:** `src/core/autonomy-controller.ts` → `recordSuccess()`, `escalate()`

## USAGE
```bash
/trading:founder:strategy review              # Full strategy review
/trading:founder:strategy promote rsi-sma     # Promote to next phase
/trading:founder:strategy demote bollinger     # Demote to previous phase
/trading:founder:strategy kill macd-crossover  # Kill strategy
```
