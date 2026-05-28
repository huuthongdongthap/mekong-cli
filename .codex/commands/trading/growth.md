---
codex-command: "/trading/growth"
source: ".claude/commands/trading/growth.md"
invocation: "mekong trading/growth $ARGUMENTS"
description: "⚡⚡⚡ Growth Hacker — AARRR funnel optimization, growth experiments, viral loops, conversion analysis"
argument-hint: "[action: funnel|experiment|viral|conversion]"
allowed-tools: "default"
content-sha256: "3d0369881f6b9d131d0aa5351f0baf206f2847bbdde8aa6285d5e220fa9750a0"
---

# /trading/growth

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/growth $ARGUMENTS
```

## Source Command

**Ultrathink** Growth analysis: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/trading-team-subordinates-sops.md` PART 11
**Reports to:** CMO (`/trading:cmo`)

## Pipeline (4 steps)

### 1. AARRR FUNNEL
| Stage | Metric | Current | Target | Conv% |
|-------|--------|---------|--------|-------|
| Acquisition | GitHub visitors/wk | X | 100 | — |
| Activation | Install→backtest | XX% | >60% | XX% |
| Retention | Weekly active | XX% | >40% | XX% |
| Revenue | Free→PRO | XX% | >5% | XX% |
| Referral | Referral rate | XX% | >10% | XX% |

### 2. GROWTH EXPERIMENTS
| Experiment | Hypothesis | Metric | Result | Decision |
|-----------|-----------|--------|--------|----------|
| {name} | If X then Y | {KPI} | ±X% | Scale/Kill |

Template: Hypothesis → Metric → Duration → Result → Decision

### 3. VIRAL LOOP
```
User profits → shares on Twitter → follower clicks
    → installs → profits → shares → LOOP
    Amplifiers: leaderboard, badges, public portfolios
```
| Loop Component | Status | Multiplier |
|---------------|--------|-----------|
| Social sharing | Active/Off | X.Xx |
| Leaderboard | Built/Planned | X.Xx |
| Referral program | Active/Off | X.Xx |
| Public portfolios | Built/Planned | X.Xx |

### 4. CONVERSION ANALYSIS
| Touchpoint | Drop-off% | Fix |
|-----------|----------|-----|
| Landing → Install | XX% | {action} |
| Install → Config | XX% | {action} |
| Config → First trade | XX% | {action} |
| Free → PRO upgrade | XX% | {action} |

## USAGE
```bash
/trading:growth funnel       # AARRR funnel analysis
/trading:growth experiment   # Growth experiment tracker
/trading:growth viral        # Viral loop design
/trading:growth conversion   # Conversion optimization
```
