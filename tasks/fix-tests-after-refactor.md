# CTO MISSION: Fix 28 Test Collection Errors After Refactor Cleanup

## Bối cảnh
Sau khi chạy refactor cleanup (4 batches xoá ~60 files/dirs lỗi thời),
có 28 test collection errors vì một số tests import files đã bị xoá.

## Nhiệm vụ
1. Chạy `python3 -m pytest tests/ -q --tb=short 2>&1 | head -40` để xác định lỗi
2. Với mỗi test file lỗi → kiểm tra import nào bị broken
3. Nếu test file test cho code đã xoá → `git rm` test file đó
4. Nếu test file vẫn cần → fix import path
5. Verify: `python3 -m pytest tests/ -q --tb=short` → 0 errors
6. Commit: `git commit -m 'refactor: fix test imports after cleanup'`

## 28 Orphan src/ files cần review
```
agent_execution_sandbox, agent_preferences_registry,
agent_process_lifecycle_manager, auto_discovery, auto_updater,
billing, bmad-commands, collector_registry, cost_tracker,
crash_reporter, credit_metering_middleware, credit_rate_limiter,
dead_letter_queue, durable_step_store, exceptions,
health_watchdog, ipc_agent_message_bus, learner, missions,
protocol_handler, provider_registry, routing_strategy, sdk,
session_lifecycle_manager, task_queue, tool_permission_registry,
webhook_delivery_engine, zx_executor
```

## Verification
```bash
python3 -m pytest tests/ -q --tb=short
python3 -m src.main agi benchmark
```
