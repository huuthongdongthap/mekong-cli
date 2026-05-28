---
codex-command: "/trading/cfo"
source: ".claude/commands/trading/cfo.md"
invocation: "mekong trading/cfo $ARGUMENTS"
description: "⚡⚡⚡⚡ CFO Financial Command — P&L tracking, fee analysis, tax optimization, financial modeling, cost dashboard"
argument-hint: "[action: review|costs|tax|model]"
allowed-tools: "default"
content-sha256: "b7e543057581829334420cee7a1ca3dd1e8ef57e911b90cf50bf43f978236ff5"
---

# /trading/cfo

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/cfo $ARGUMENTS
```

## Source Command

**Ultrathink** CFO financial review: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/cfo-sops.md`

## Pipeline (5 steps)

### 1. P&L DASHBOARD
| Category | Amount | Trend | Source |
|----------|--------|-------|--------|
| Trading profit | ${N} | ↑↓→ | `PerformanceAnalyzer.ts` |
| Arb profit | ${N} | ↑↓→ | `arbitrage-execution-engine.ts` |
| Exchange fees | -${N} | ↑↓→ | Exchange APIs |
| Infra costs | -${N} | →  | Manual entry |
| API/LLM costs | -${N} | ↑↓→ | Token tracking |
| **Net P&L** | **${N}** | | **Gross - Costs** |
| Fee/Profit ratio | XX% | | Target: <15% |

### 2. COST BREAKDOWN
| Cost | Monthly | % of Revenue | Optimization |
|------|---------|-------------|-------------|
| Maker fees | ${N} | XX% | Volume tier discount |
| Taker fees | ${N} | XX% | Shift to limit orders |
| Withdrawals | ${N} | XX% | Batch withdrawals |
| VPS/Cloud | ${N} | XX% | Right-size instances |
| API tokens | ${N} | XX% | Cache + prompt optimize |
| **Total** | **${N}** | **XX%** | |

### 3. TAX OPTIMIZATION
| Strategy | Status | Est. Savings |
|----------|--------|-------------|
| Loss harvesting | Active/Inactive | ${N} |
| Long-term holding | Positions >1yr | ${N} |
| Fee deductions | Tracked/Missing | ${N} |
| Infra deductions | Tracked/Missing | ${N} |

### 4. FINANCIAL MODEL
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Monthly ROI | XX% | 5-8% | ±X% |
| Sharpe ratio | X.X | >1.5 | ±X |
| Max drawdown | XX% | <15% | ±X% |
| Profit factor | X.X | >1.5 | ±X |
| Break-even | ${N}/mo | — | — |

### 5. REPORT
Save: `plans/reports/cfo-financial-{date}.md`

## USAGE
```bash
/trading:cfo review     # Full financial review
/trading:cfo costs      # Cost breakdown + optimization
/trading:cfo tax        # Tax optimization check
/trading:cfo model      # Financial projections
```
