---
codex-command: "/trading/product-analyst"
source: ".claude/commands/trading/product-analyst.md"
invocation: "mekong trading/product-analyst $ARGUMENTS"
description: "⚡⚡⚡ Product Analyst — product metrics, feature adoption, user segmentation, impact analysis"
argument-hint: "[action: metrics|adoption|segments|impact]"
allowed-tools: "default"
content-sha256: "81b2eb54596f57c02a86c04b6cd29063807fcfaf5a554491a7a57efb21033420"
---

# /trading/product-analyst

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/product-analyst $ARGUMENTS
```

## Source Command

**Ultrathink** Product analysis: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/trading-team-subordinates-sops.md` PART 12
**Reports to:** CPO (`/trading:cpo`)

## Pipeline (4 steps)

### 1. PRODUCT METRICS DASHBOARD
| Metric | Definition | Current | Trend |
|--------|-----------|---------|-------|
| DAU | Daily active bot instances | X | ↑↓→ |
| Feature adoption | % users per feature | XX% | ↑↓→ |
| Error rate | Errors per session | X.X | ↑↓→ |
| Task completion | Config→running | XX% | ↑↓→ |
| NPS proxy | Stars/issues ratio | X.X | ↑↓→ |

### 2. FEATURE ADOPTION
| Feature | Users | Adoption% | Trend |
|---------|-------|-----------|-------|
| Paper trading | X | XX% | ↑↓→ |
| Live trading | X | XX% | ↑↓→ |
| Arbitrage | X | XX% | ↑↓→ |
| Multi-exchange | X | XX% | ↑↓→ |
| Stealth mode | X | XX% | ↑↓→ |
| Custom strategies | X | XX% | ↑↓→ |

### 3. USER SEGMENTS
| Segment | Behavior | Size | Needs |
|---------|----------|------|-------|
| Beginner | Paper trading only | X | Easy setup, docs |
| Active trader | 1-3 pairs, conservative | X | Reliability, alerts |
| Power user | 5+ pairs, multi-exchange | X | Performance, API |
| Quant | Custom strategies | X | Extensibility |

### 4. FEATURE IMPACT ANALYSIS
| Feature | Before | After | Uplift | Keep? |
|---------|--------|-------|--------|-------|
| {feature} | X | X | ±X% | ✅/❌ |

## USAGE
```bash
/trading:product-analyst metrics    # Product metrics dashboard
/trading:product-analyst adoption   # Feature adoption tracking
/trading:product-analyst segments   # User segmentation
/trading:product-analyst impact     # Feature impact analysis
```
