---
codex-command: "/model-matrix"
source: ".claude/commands/model-matrix.md"
invocation: "mekong model-matrix $ARGUMENTS"
description: "Show model capabilities matrix — which model for which task type"
argument-hint: "[--recommend "task description"]"
allowed-tools: "Bash"
content-sha256: "a433d1639cb935b4849c175e90a6b9e19adfd4e03cfa6e9503c48c6dd2f43688"
---

# /model-matrix

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong model-matrix $ARGUMENTS
```

## Source Command

# /model-matrix — Model Capabilities & Routing

## Implementation

```bash
echo "=== MODEL ROUTING MATRIX ==="
node -e "
  const mr = require('$HOME/mekong-cli/apps/openclaw-worker/lib/model-router');
  const matrix = mr.getModelMatrix();
  console.log('Model             | Tier   | Speed  | Context | Strengths');
  console.log('------------------|--------|--------|---------|----------');
  matrix.forEach(m => {
    console.log(m.model.padEnd(17) + ' | ' + m.tier.padEnd(6) + ' | ' + m.speed.padEnd(6) + ' | ' + m.context.padEnd(7) + ' | ' + m.strengths);
  });
  console.log('');
  const tasks = ['Refactor authentication architecture', '/cook Build landing page', 'Fix lint errors in utils.ts'];
  console.log('--- Sample Routing ---');
  tasks.forEach(t => {
    const r = mr.recommendModel(t);
    console.log('  ' + t.slice(0,40).padEnd(40) + ' -> ' + r.tier + ' (' + r.reason + ')');
  });
" 2>/dev/null
```

## Goal context

<goal>$ARGUMENTS</goal>
