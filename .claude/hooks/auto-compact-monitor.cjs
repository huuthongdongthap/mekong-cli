#!/usr/bin/env node
/**
 * Auto-Compact Monitor Hook
 * Fires on UserPromptSubmit — checks if context is growing too large
 * and injects a compact reminder into the session.
 * 
 * For PMV proxy: context >80K should trigger compact warning
 * because upstream often fails at 100K+.
 */
'use strict';

const COMPACT_WARN_THRESHOLD = 80000; // tokens

try {
  // Read the hook input from stdin
  const input = require('fs').readFileSync('/dev/stdin', 'utf8');
  const data = JSON.parse(input);
  
  // Check conversation stats if available
  const stats = data.session_stats || data.stats || {};
  const inputTokens = stats.input_tokens || stats.total_input_tokens || 0;
  
  if (inputTokens > COMPACT_WARN_THRESHOLD) {
    // Output a message to remind about compacting
    const result = {
      decision: "ALLOW",
      message: `⚠️ Context at ${Math.round(inputTokens/1000)}K tokens (threshold: ${COMPACT_WARN_THRESHOLD/1000}K). Consider /compact to prevent upstream errors.`
    };
    process.stdout.write(JSON.stringify(result));
  } else {
    process.stdout.write(JSON.stringify({ decision: "ALLOW" }));
  }
} catch (e) {
  // Never block — just allow
  process.stdout.write(JSON.stringify({ decision: "ALLOW" }));
}

process.exit(0);
