---
phase: 3
title: "Cross-Repo idea scan CLI, phase_560 Schema Hardening & Test Suite"
status: completed
effort: "1 phase"
created: 2026-10-25
---

# Phase 3 — Cross-Repo `idea scan` CLI, `phase_560` Schema Hardening & Test Suite

## Context

Phase 1 and Phase 2 gave us the types, probe runner, 25-step catalog, classifier, and
sequence engine. Phase 3 wires them into the cross-repo runner (`grab_cross_repo_scanner`),
exposes the `idea scan` Typer command, hardens `phase_560` so it no longer relies on
caller-supplied counts or substring matching, and proves everything with a test suite.

## Requirements

| # | Requirement |
|---|-------------|
| 3.1 | `grab_cross_repo_scanner.py` implements `scan_target_repository(target_root: Path, archetype: str | None = None, execute_runtime: bool = True) -> ScanReport`: resolves archetype (auto-detected from repo docs if None, falling back to registry), runs probes across all 25 steps, evaluates readiness + sequence labels, produces recomputed market facts, embeds reference doc SHA-256 digests, and generates a deterministic JSON-serializable report. |
| 3.2 | Read-only guarantee: `scan_target_repository` NEVER writes, modifies, or deletes any file under `target_root`. Verified by recording `git status` of `target_root` before and after the scan. |
| 3.3 | Expose `idea scan` command on `src/cli/idea_commands.py`: `--target-root PATH` (default `.` or `/Users/macbook/durios`), `--archetype [auto|REGULATED_TRUST_NETWORK|OPEN_CORE_SAAS]`, `--no-execute` (disables runtime probe execution), `--json` (prints JSON), `--replay` (deterministic output). Rich table output has 25 lines with columns: `#`, `Step`, `Layer`, `Evidence`, `Readiness`, `Sequence`, `Basis`. |
| 3.4 | Update `_is_opencore_saas_idea` in `src/cli/idea_commands.py` so it routes via `classify_archetype()` rather than naive `deep or any(...)` substring search, preventing durian prompts from accidentally falling into the generic open-core pipeline unless requested. |
| 3.5 | Harden `phase_560_opencore_saas_readiness_engine.py`: `audit_blueprint()` validates that `tasks.md` has the required 25 checkboxes, 3 lens sections (`[Business]`, `[Agentic]`, `[Governance]`), and valid frontmatter rather than simple substring matching. `audit_repository()` derives step completion from `audit_blueprint()` when `completed_steps` is not explicitly passed. |
| 3.6 | Unit and integration test suite in `tests/test_durian_grab_honest_diagnosis.py`: (1) all 25 durian steps defined and valid; (2) `TWENTY_FIVE_OPENCORE_STEPS` byte-identical; (3) classifier tests (durian → REGULATED, opencore → OPEN_CORE, unknown → UNRESOLVED); (4) sequence evaluator tests (PREMATURE, INDETERMINATE, IN_ORDER); (5) economics recomputation (`428 > 281` and `saas_only_feasible=False`); (6) rehearsal-handler exclusion in `ProductionCallerCount`; (7) synthetic third catalog registration without engine code changes; (8) end-to-end scan against `/Users/macbook/durios` produces 25 rows, leaves durios git status clean, and bun typecheck exits 0; (9) LOC invariants: all new modules `<= 160` LOC. |
| 3.7 | `ruff check` and `mypy` pass on all touched files with 0 errors. |

## Files

| File | Action | Purpose |
|------|--------|---------|
| `src/core/opencore/grab_cross_repo_scanner.py` | create | Cross-repo runner, aggregation, output formatting |
| `src/cli/idea_commands.py` | modify | Add `scan` command, update archetype routing |
| `src/core/opencore/phase_560_opencore_saas_readiness_engine.py` | modify | Harden `audit_blueprint` to validate structured sections |
| `tests/test_durian_grab_honest_diagnosis.py` | create | Comprehensive test suite for all new functionality |

## Validation

1. `python3 -m pytest tests/test_durian_grab_honest_diagnosis.py -p no:randomly -v`.
2. `mekong idea scan --target-root /Users/macbook/durios --archetype auto --no-execute` outputs 25 lines.
3. `git -C /Users/macbook/durios status --porcelain` is empty (or unchanged).
4. `cd /Users/macbook/durios && bun run typecheck` exits 0.
5. `python3 -m ruff check src/core/opencore/ src/cli/idea_commands.py tests/test_durian_grab_honest_diagnosis.py`.
6. `python3 -m mypy src/core/opencore/grab_diagnostic_types.py src/core/opencore/grab_market_facts.py src/core/opencore/grab_probe_runner.py src/core/opencore/durian_export_steps_p1_p3.py src/core/opencore/durian_export_25_step_catalog.py src/core/opencore/archetype_catalog_registry.py src/core/opencore/grab_cross_repo_scanner.py`.
