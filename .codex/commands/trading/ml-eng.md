---
codex-command: "/trading/ml-eng"
source: ".claude/commands/trading/ml-eng.md"
invocation: "mekong trading/ml-eng $ARGUMENTS"
description: "⚡⚡⚡ ML Engineer — self-learning loop, strategy weight optimization, signal model performance, feature engineering"
argument-hint: "[action: learning|weights|features|model]"
allowed-tools: "default"
content-sha256: "238644151a5d1d4f4ad466eaa4325d687286bc3fe65a07aa29448018fe5633ea"
---

# /trading/ml-eng

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong trading/ml-eng $ARGUMENTS
```

## Source Command

**Ultrathink** ML engineering review: <args>$ARGUMENTS</args>

**CWD:** `apps/algo-trader` | **REF:** `docs/trading-team-subordinates-sops.md` PART 10
**Reports to:** CAIO (`/trading:caio`)

## Pipeline (4 steps)

### 1. SELF-LEARNING LOOP STATUS
Using `src/core/autonomy-controller.ts`:
| Component | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Win → weight +0.05 | Active | ✅/❌ | 🟢/🔴 |
| Loss → weight -0.05 | Active | ✅/❌ | 🟢/🔴 |
| Weight cap [0.05, 0.5] | Enforced | ✅/❌ | 🟢/🔴 |
| Normalization sum=1.0 | Correct | ✅/❌ | 🟢/🔴 |
| 3 losses → escalate | Triggered | ✅/❌ | 🟢/🔴 |
| 5 wins → restore | Triggered | ✅/❌ | 🟢/🔴 |

### 2. STRATEGY WEIGHT OPTIMIZATION
Using `src/core/SignalGenerator.ts`:
| Strategy | Current W | Optimal W | Drift | Action |
|----------|-----------|-----------|-------|--------|
| MacdBollingerRsi | 0.XX | 0.XX | ±X% | Hold/Adjust |
| RsiSma | 0.XX | 0.XX | ±X% | Hold/Adjust |
| BollingerBand | 0.XX | 0.XX | ±X% | Hold/Adjust |
| MacdCrossover | 0.XX | 0.XX | ±X% | Hold/Adjust |

### 3. FEATURE ENGINEERING
| Feature | Source Module | Type |
|---------|-------------|------|
| Price momentum | `SignalGenerator.ts` | Indicator |
| Regime state | `signal-market-regime-detector.ts` | Classification |
| Cross-pair | `SignalMesh.ts` | Correlation |
| Signal filter | `SignalFilter.ts` | Math filter |
| Filter helpers | `signal-filter-math-helpers.ts` | Utilities |
| Filter types | `signal-filter-types.ts` | Type defs |

### 4. MODEL PERFORMANCE
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Signal accuracy | XX% | >60% | 🟢/🔴 |
| False positive rate | XX% | <20% | 🟢/🔴 |
| Signal latency | Xms | <2000ms | 🟢/🔴 |
| Weight convergence | X cycles | <50 | 🟢/🔴 |

## USAGE
```bash
/trading:ml-eng learning   # Self-learning loop check
/trading:ml-eng weights    # Weight optimization analysis
/trading:ml-eng features   # Feature engineering review
/trading:ml-eng model      # Model performance metrics
```
