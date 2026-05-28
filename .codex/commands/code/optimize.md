---
codex-command: "/code/optimize"
source: ".claude/commands/code/optimize.md"
invocation: "mekong code/optimize $ARGUMENTS"
description: "Performance optimization suggestions with implementation"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "5c0cc91e0c3a1d601053f80cde1fda89750607f76b0eba0d1dd80a526ae5ba6f"
---

# /code/optimize

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code/optimize $ARGUMENTS
```

## Source Command

// turbo

# /optimize - Performance Optimizer

Analyze and optimize code for better performance.

## Usage

```
/optimize [file]
/optimize --memory
/optimize --speed
```

## Claude Prompt Template

```
Performance optimization workflow:

1. Profile Analysis:
   - Identify bottlenecks
   - Memory usage patterns
   - CPU-intensive operations
   - I/O blocking calls

2. Optimization Opportunities:
   - Algorithm improvements (O(n²) → O(n log n))
   - Caching opportunities
   - Lazy loading candidates
   - Parallel execution points

3. Generate Optimizations:
   - Show before/after code
   - Estimated improvement %
   - Risk assessment

4. Apply (with confirmation):
   - Create optimized version
   - Add benchmarks
   - Update tests

Report with implementation steps.
```

## Example Output

```
⚡ Optimization: src/data/processor.ts

🐢 Bottlenecks Found:
   1. Line 45: O(n²) nested loop → O(n) with hash map
   2. Line 88: Sync file read → Async stream
   3. Line 120: No memoization on recursive call

📈 Estimated Improvements:
   - Speed: +340% faster
   - Memory: -25% usage

🔧 Ready to apply 3 optimizations.
Run /optimize --apply to implement.
```
