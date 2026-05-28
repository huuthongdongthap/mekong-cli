---
codex-command: "/code/repro-issue"
source: ".claude/commands/code/repro-issue.md"
invocation: "mekong code/repro-issue $ARGUMENTS"
description: "Create reproducible test case for GitHub issue"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "3fb8734ae3c899ce0c21f4d4b1813f8a6aba20ba4d352d47215de98e8f0f6133"
---

# /code/repro-issue

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code/repro-issue $ARGUMENTS
```

## Source Command

// turbo

# /repro-issue - Issue Reproducer

Create a minimal reproducible test case for a bug report.

## Usage

```
/repro-issue [issue-number]
```

## Claude Prompt Template

````
Issue reproduction workflow:

1. Fetch Issue:
   - Get issue details from GitHub
   - Extract steps to reproduce
   - Identify expected vs actual behavior

2. Create Minimal Reproduction:
   - Write isolated test case
   - Remove unnecessary dependencies
   - Include only essential code

3. Generate Test File:
   tests/repro/test_issue_{number}.py

   ```python
   """
   Reproduction for Issue #{number}
   {issue_title}

   Steps:
   1. {step1}
   2. {step2}

   Expected: {expected}
   Actual: {actual}
   """

   def test_issue_{number}_reproduces():
       # Arrange
       ...
       # Act
       ...
       # Assert - should FAIL to reproduce the bug
       ...
````

4. Verify Test Fails:
    - Run the test
    - Confirm it reproduces the issue
    - Document reproduction steps

```

## Example Output
```

🐛 Repro: Issue #42

📋 Title: Login fails with special characters

📝 Created: tests/repro/test_issue_42.py

Test Case:

- Input: password with "é" character
- Expected: Login success
- Actual: 500 error

❌ Test fails (bug reproduced!)

Ready for /fix-issue 42

```

```
