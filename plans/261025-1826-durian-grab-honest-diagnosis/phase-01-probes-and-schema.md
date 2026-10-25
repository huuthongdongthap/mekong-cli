---
phase: 1
title: "StepSpec, Six Probe Primitives & Market Facts Snapshot"
status: completed
effort: "1 phase"
created: 2026-10-25
---

# Phase 1 — StepSpec, Six Probe Primitives & Market Facts Snapshot

## Context

Today a step is "done" when a slug substring appears in `tasks.md`, or when a caller
passes `completed_step_Count=25`. Phase 1 introduces the vocabulary that makes that
impossible: a step is a declaration that carries an explicit `evidence_class`, a
declarative `probe`, mandatory prerequisites, and two separate labels. It also adds the
V2 document digest snapshot and the recomputed market arithmetic.

## Requirements

| # | Requirement |
|---|-------------|
| 1.1 | `StepSpec` fields: `step_number`, `layer`, `slug`, `industry_anchor`, `evidence_class`, `probe`, `mandatory_prerequisites`, `not_authorized_covers`, `microcontract` (outcome/constraints/non_goals/acceptance_criteria rendered in the report). |
| 1.2 | Two labels, never merged: `ReadinessLabel(level: ReadinessLevel, measurable: bool, probe_basis: str)` and `SequenceLabel(verdict: SequenceVerdict, violated_prerequisites: tuple[str, ...], basis: str)`. |
| 1.3 | `ReadinessLevel` ordered enum `ABSENT < DECLARED < IMPLEMENTED < GUARDED < REACHABLE < MEASURED`; `ReadinessLabel.render()` returns `"UNMEASURABLE"` when `measurable` is False regardless of level. |
| 1.4 | Six probe primitives as frozen dataclasses with a shared `kind` and a `execute(target_root) -> ProbeOutcome` contract on the runner: `GrepSymbol(symbol, min_occurrences, exclude_paths)`, `AstTypePresent(type_names, target_glob)`, `RuntimeExec(module_path, function_name, fixture_expr, expected_basis)`, `ProductionCallerCount(symbol, min_callers, exclude_paths)`, `ArtifactSchema(artifact_path, schema_kind, checks)`, `CommandExit(command, argv, cwd_relative)`. |
| 1.5 | `GrepSymbol` excludes `test` paths by default and honours `exclude_paths`; symbol count across non-test, non-excluded files yields `min_occurrences` → else `ABSENT`. |
| 1.6 | `AstTypePresent` parses TS/TSX and reports each requested type name as present/absent; any missing type caps the step at `DECLARED`. |
| 1.7 | `ProductionCallerCount` counts import/usage sites in `src/` excluding `test` paths and the rehearsal handler; count `< min_callers` caps at `IMPLEMENTED` (never `REACHABLE`). |
| 1.8 | `RuntimeExec` is disabled unless `execute_runtime=True`; when disabled it returns an explicit `not-run` basis and never contributes above `GUARDED`. |
| 1.9 | `ArtifactSchema` reads a JSON/JSONL artifact and applies internal-consistency checks only (e.g. `keys_present`, `len_ge`, `equals`, `not_null`); file absence is `ABSENT`, schema violation is `DECLARED`. |
| 1.10 | `CommandExit` runs an allowlisted command (default `bun run typecheck`) with a timeout and `cwd` scoped to `target_root`; non-zero exit is `DECLARED` with the captured exit code in the basis. |
| 1.11 | `market_facts` module holds `PACKHOUSES=281`, `REGISTERED_PUC_ORCHARDS=1599`, `SAAS_PRICE_VND_PER_YEAR=60_000_000`, `VND_PER_USD=25_637`, `TARGET_ARR_USD=1_000_000` and a pure `recompute_saas_ceiling() -> tuple[int, bool]` returning `(428, False)` — computed, never trusted from a markdown paragraph. |
| 1.12 | `grab_standard_snapshot()` embeds SHA-256 digests of the three V2 reference docs and prints them with every scan; values are measured from the current `/Users/macbook/durios` tree and recorded in this phase for review. |
| 1.13 | No module exceeds 160 LOC; no `:any`-equivalent dynamic dicts in step declarations without comments; pure stdlib only for these modules. |

## Files

| File | Action | Purpose |
|------|--------|---------|
| `src/core/opencore/grab_diagnostic_types.py` | create | StepSpec, labels, levels, probe declarations, evidence classes |
| `src/core/opencore/grab_market_facts.py` | create | market constants + recomputed SaaS ceiling + V2 digests |
| `src/core/opencore/grab_probe_runner.py` | create | executes the six probe kinds against a target root |

## Implementation Shape

```python
# grab_diagnostic_types.py
class EvidenceClass(str, Enum):
    STATIC_SOURCE = "STATIC_SOURCE"
    RUNTIME_BEHAVIOR = "RUNTIME_BEHAVIOR"
    LIVE_OPERATION = "LIVE_OPERATION"
    MARKET = "MARKET"

@dataclass(frozen=True)
class StepSpec:
    step_number: int
    layer: str
    slug: str
    industry_anchor: str
    evidence_class: EvidenceClass
    probe: ProbeDeclaration
    mandatory_prerequisites: tuple[str, ...]
    not_authorized_covers: tuple[str, ...] = ()
    microcontract: dict[str, str] = field(default_factory=dict)
```

```python
# grab_market_facts.py
def recompute_saas_ceiling() -> tuple[int, bool]:
    required = -(-TARGET_ARR_USD * VND_PER_USD // SAAS_PRICE_VND_PER_YEAR)
    return required, required <= PACKHOUSES
```

## Validation

1. `python3 -c "from src.core.opencore.grab_market_facts import recompute_saas_ceiling; assert recompute_saas_ceiling() == (428, False)"`.
2. Unit tests: each of the six probe kinds against a synthetic tmp fixture target root (ABSENT for missing symbol/type/artifact, DECLARED for schema violation and non-zero command exit, IMPLEMENTED for under-count callers, skipped-with-basis for `RuntimeExec` when `execute_runtime=False`).
3. `ruff check src/core/opencore/` and `mypy src/core/opencore/`.

## Risks

- `RuntimeExec` calls into a foreign repository: mitigated by an explicit allowlist of pure exported functions, synthetic in-memory fixtures only, `--no-execute`, and no constructor/server/network path.
- Probe outcomes drifting as durios renames files: the basis always names the file and line range so a rename is visible as a downgrade rather than a silent failure.

## Rollback

Delete the three new modules; no existing module imports them before Phase 2.
