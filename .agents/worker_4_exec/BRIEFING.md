# BRIEFING — 2026-05-26T14:17:34+07:00

## Mission
Implement final Bazi-aligned polish, FOUT optimizations, and brand compliance fixes for Bazi v5.1 Sprint.

## 🔒 My Identity
- Archetype: worker
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/mac/mekong-cli/.agents/worker_4_exec/
- Original parent: main agent
- Original parent conversation ID: f2c85e9c-6155-4119-87d2-e672d9a799a2

## 🔒 My Workflow
- **Pattern**: Project / Canonical
- **Scope document**: /Users/mac/mekong-cli/.agents/worker_4_exec/PROJECT.md
1. **Decompose**: Decompose the implementation tasks and verify each.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Explorer -> Worker -> Reviewer -> test -> gate.
   - **Delegate (sub-orchestrator)**: Spawn a subagent to help with exploration and review as needed.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: At 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Font Preloading & FOUT Optimization in loyalty-calculator.html [pending]
  2. Eliminate Banned Gold & Earth Tones [pending]
  3. Eliminate Banned Red & Fire Tones [pending]
  4. Eliminate Banned Orange Color [pending]
  5. Lingering "Gold" (Vàng) Terminology in active brand book brand-guideline.html [pending]
  6. Font Preload Placement Mismatch in brand-guideline.html [pending]
  7. Verification [pending]
- **Current phase**: 1
- **Current focus**: Context analysis and planning

## 🔒 Key Constraints
- DO NOT CHEAT. All implementations must be genuine.
- Never write, modify, or create source code files directly.
- Never run build/test commands yourself — require workers to do so.
- You MAY use file-editing tools ONLY for metadata/state files (.md) in your .agents/ folder.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh

## Current Parent
- Conversation ID: f2c85e9c-6155-4119-87d2-e672d9a799a2
- Updated: not yet

## Key Decisions Made
- [TBD]

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| worker_1 | self | Bazi Compliance Implementation & Verification | in-progress | cfe9e7b4-f460-4bc9-8e68-4e81120b4cea |

## Succession Status
- Succession required: no
- Spawn count: 1 / 16
- Pending subagents: cfe9e7b4-f460-4bc9-8e68-4e81120b4cea
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 079d3df4-e4d8-46b4-a0bc-cc0e04039a0b/task-22
- Safety timer: none

## Artifact Index
- /Users/mac/mekong-cli/.agents/worker_4_exec/original_prompt.md — Original User Request
- /Users/mac/mekong-cli/.agents/worker_4_exec/BRIEFING.md — My working memory
- /Users/mac/mekong-cli/.agents/worker_4_exec/progress.md — Liveness check and workflow tracking
