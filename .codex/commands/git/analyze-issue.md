---
codex-command: "/git/analyze-issue"
source: ".claude/commands/git/analyze-issue.md"
invocation: "mekong git/analyze-issue $ARGUMENTS"
description: "Create implementation specification from GitHub issue"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "14b3725fea8c0aa5e912b4e77d508e231ae50633428af7701ea498bd5bd81204"
---

# /git/analyze-issue

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong git/analyze-issue $ARGUMENTS
```

## Source Command

// turbo

# /analyze-issue - Issue Analyzer

Deep analysis of a GitHub issue to create implementation spec.

## Usage

```
/analyze-issue [issue-number]
```

## Claude Prompt Template

```
Analyze GitHub issue workflow:

1. Fetch issue: gh issue view {number} --json title,body,labels,comments
2. Parse requirements from issue body
3. Create implementation specification:

   ## Summary
   {concise problem statement}

   ## Requirements
   - [ ] Requirement 1
   - [ ] Requirement 2

   ## Technical Approach
   {implementation strategy}

   ## Files to Modify
   - path/to/file1.ts: {changes}
   - path/to/file2.ts: {changes}

   ## Testing Strategy
   {how to verify}

   ## Estimated Effort
   {time estimate}

Save spec to: .claude/specs/issue-{number}.md
```

## Example Output

```
📋 Issue #42: Add dark mode support

📝 Spec created: .claude/specs/issue-42.md

Summary:
- 5 requirements identified
- 8 files to modify
- ~4 hours estimated

Ready for /do-issue 42
```
