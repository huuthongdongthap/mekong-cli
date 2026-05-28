---
codex-command: "/code/tdd-implement"
source: ".claude/commands/code/tdd-implement.md"
invocation: "mekong code/tdd-implement $ARGUMENTS"
description: "Implement feature using TDD methodology"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "54edf13825e93b7093edc7d63ec2698b0466b543a197a2f3c6273fd6d8a86b3b"
---

# /code/tdd-implement

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong code/tdd-implement $ARGUMENTS
```

## Source Command

// turbo

# /tdd-implement - TDD Implementation

Full TDD implementation from requirements to refactored code.

## Usage

```
/tdd-implement [feature-description]
```

## Claude Prompt Template

```
TDD Implementation workflow:

1. Analyze Requirements:
   - Parse feature description
   - Identify testable behaviors
   - Define acceptance criteria

2. Write Tests First (RED):
   - Create test file: tests/test_{feature}.py
   - Write comprehensive test cases
   - Include edge cases
   - Run and confirm failure

3. Implement Minimal Code (GREEN):
   - Write just enough to pass tests
   - No over-engineering
   - Focus on functionality

4. Refactor (REFACTOR):
   - Apply DRY principle
   - Improve readability
   - Add docstrings
   - Ensure tests still pass

5. Final Validation:
   - Run full test suite
   - Check coverage
   - Lint code

Create 3 commits (red, green, refactor).
```

## Example Output

```
🎯 TDD: Payment Processing

📝 Requirements analyzed: 5 test cases

🔴 RED Phase:
   Created: tests/test_payment.py
   - test_process_valid_payment
   - test_reject_insufficient_funds
   - test_handle_timeout
   - test_validate_card_number
   - test_refund_transaction
   ❌ 5 tests failing (expected)

🟢 GREEN Phase:
   Created: src/payment.py
   ✅ 5 tests passing

♻️ REFACTOR Phase:
   - Extracted CardValidator class
   - Added retry logic
   - Improved error messages
   ✅ 5 tests still passing

📊 Coverage: 94%
✅ 3 commits created
```
