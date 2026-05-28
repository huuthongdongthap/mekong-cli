---
codex-command: "/trading/cmo/growth"
source: ".claude/commands/trading/cmo/growth.md"
invocation: "mekong trading/cmo/growth $ARGUMENTS"
description: "⚡⚡⚡ CMO Growth Metrics — AARRR funnel analysis, channel performance, WAT tracking, optimization"
argument-hint: "[period: week|month|quarter] [focus: funnel|channels|seo|social]"
allowed-tools: "default"
content-sha256: "0bcbc22ab9bf2139ce114119ddf6b3e08d6290d202cfbf5e3a5e75db077f2a24"
---

# /trading/cmo/growth

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/cmo/growth $ARGUMENTS
```

## Source Command

**Ultrathink** CMO growth analysis: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/cmo-sops.md` SOP-M04, SOP-M06

## Pipeline (4 steps)

### 1. NORTH STAR METRIC
**Weekly Active Traders (WAT):** users running ≥1 trade (paper/live) per week.

### 2. AARRR FUNNEL

```
Acquisition  → GitHub visitors, social impressions
  ↓ XX%
Activation   → Install + first backtest
  ↓ XX%
Retention    → WAT (weekly active traders)
  ↓ XX%
Revenue      → Paid conversion (Polar.sh)
  ↓ XX%
Referral     → Stars, forks, word-of-mouth
```

| Stage | Metric | Target | Current | Gap | Action |
|-------|--------|--------|---------|-----|--------|
| Acquisition | Visitors/week | 500 | {N} | | |
| Activation | First backtest % | 30% | {N}% | | |
| Retention | WAT | 40% | {N}% | | |
| Revenue | Paid % | 5% | {N}% | | |
| Referral | Stars/week | 20 | {N} | | |

**Focus:** Fix weakest funnel stage first.

### 3. CHANNEL PERFORMANCE

| Channel | Traffic | Conversion | CAC | ROI | Status |
|---------|---------|------------|-----|-----|--------|
| SEO (content) | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |
| Twitter/X | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |
| GitHub organic | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |
| Discord | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |
| YouTube | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |
| Reddit/HN | {N} | {N}% | $0 | ∞ | 🟢/🟡/🔴 |

### 4. OPTIMIZATION RECOMMENDATIONS
- Top 3 growth levers to pull
- Quick wins (this week)
- Strategic bets (this month)

## Output
Save: `plans/reports/cmo-growth-{date}.md`

## USAGE
```bash
/trading:cmo:growth week              # Weekly growth snapshot
/trading:cmo:growth month funnel      # Monthly funnel deep-dive
/trading:cmo:growth quarter channels  # Quarterly channel review
```
