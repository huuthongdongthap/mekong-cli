---
codex-command: "/cto-workforce"
source: ".claude/commands/cto-workforce.md"
invocation: "mekong cto-workforce $ARGUMENTS"
description: "Show CTO workforce — registered workers, project states, throughput per pane"
argument-hint: "[--detailed | --throughput]"
allowed-tools: "Bash"
content-sha256: "249fabb2b178c71075f510bbf6dd78027da9ae89e91aede3a59a68b8ad2760fd"
---

# /cto-workforce

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cto-workforce $ARGUMENTS
```

## Source Command

# /cto-workforce — CTO Workforce Dashboard

Shows all registered workers (doanh-trai divisions), their project state, and throughput metrics.

## Implementation

```bash
echo "=== CTO WORKFORCE DASHBOARD ==="
echo "$(date)"
echo ""

node -e "
  try {
    const ft = require('$HOME/mekong-cli/apps/openclaw-worker/lib/factory-throughput-optimizer');
    const ws = ft.getWorkforceStatus();

    console.log('--- Workforce Structure ---');
    console.log('Divisions: ' + ws.divisions);
    console.log('Total files: ' + ws.totalFiles);
    console.log('Active panes: ' + ws.panes.length);
    console.log('');

    console.log('--- Pane Workers ---');
    console.log('Pane | Project              | State        | Dispatches | Success | Avg Time | Cooldown');
    console.log('-----|----------------------|--------------|------------|---------|----------|--------');
    for (const p of ws.panes) {
      const tp = p.throughput;
      const row = [
        ('P' + p.idx).padEnd(4),
        p.project.padEnd(20),
        p.state.padEnd(12),
        String(tp.dispatches).padStart(10),
        (tp.successRate + '%').padStart(7),
        (tp.avgDuration + 's').padStart(8),
        (p.recommendedCooldown + 's').padStart(7),
      ].join(' | ');
      console.log(row);
    }

    console.log('');
    console.log('--- Throughput Recommendations ---');
    const cooldowns = ft.getRecommendedCooldowns();
    for (const [pane, cd] of Object.entries(cooldowns)) {
      const speed = cd <= 120 ? 'FAST' : cd <= 180 ? 'MEDIUM' : 'SLOW';
      console.log('  ' + pane + ': ' + cd + 's cooldown (' + speed + ')');
    }

    // Division details
    try {
      const reg = require('$HOME/mekong-cli/apps/openclaw-worker/lib/doanh-trai-registry');
      if (reg.DIVISIONS) {
        console.log('');
        console.log('--- Doanh Trai Divisions ---');
        for (const [id, div] of Object.entries(reg.DIVISIONS)) {
          console.log('  ' + div.label + ' — ' + (div.files || []).length + ' files');
        }
      }
    } catch(e) {}

  } catch(e) {
    console.log('Error: ' + e.message);
    console.log('Ensure factory-throughput-optimizer.js exists in openclaw-worker/lib/');
  }
" 2>/dev/null
```

## Goal context

<goal>$ARGUMENTS</goal>
