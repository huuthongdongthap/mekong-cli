---
title: "25-Step Durian Export Grab-Standard Honest Diagnosis Engine & Cross-Repo Scanner"
description: "Deliver a deterministic 25-step regulated-trust-network diagnostic engine and cross-repo scanner (--target-root) in mekong-cli that measures DuriOS against the Grab-standard durian export architecture using 6 behavioral probe classes, two separate labels (ReadinessLabel + SequenceLabel), recomputed market arithmetic, and an archetype CatalogRegistry while leaving TWENTY_FIVE_OPENCORE_STEPS byte-identical."
status: completed
priority: P1
effort: "3 phases"
issue: 91
branch: feat/durian-grab-honest-diagnosis
tags: [opencore, idea, diagnostics, durian, grab-standard, tdd]
blockedBy: []
blocks: []
created: 2026-10-25
---

# 25-Step Durian Export Grab-Standard Honest Diagnosis Engine & Cross-Repo Scanner

## Overview

`mekong idea` currently routes every `--deep` brainstorm through a hardcoded 25-step
Open-Core SaaS catalog whose readiness auditor (`phase_560`) accepts
`completed_step_Count=25` from the caller and checks `tasks.md` via substring matching.
When applied to a regulated agricultural trade network (DuriOS — Vietnamese durian export
to China under GACC/MARD protocols), that approach either fabricates a 100% READY score or
forces domain-specific regulatory gates into generic SaaS buckets.

This plan builds the honest cross-repo diagnostic engine specified in the confirmed
`/ak:advise --ultra` Winner D handoff brief:

1. **Data-first `StepSpec` with two orthogonal labels** — `ReadinessLabel`
   (`ABSENT < DECLARED < IMPLEMENTED < GUARDED < REACHABLE < MEASURED`, plus `measurable: bool`
   where `measurable=False` renders as `UNMEASURABLE`) and `SequenceLabel`
   (`IN_ORDER | PREMATURE | INDETERMINATE`, plus violated prerequisites and basis).
   Never collapse the two into a single score.
2. **Six probe primitives** — `GrepSymbol`, `AstTypePresent`, `RuntimeExec` (allowlisted
   pure TS functions via `bun -e`, disabled with `--no-execute`), `ProductionCallerCount`
   (excluding tests and `src/server/ecosystem-rehearsal-handler.ts`), `ArtifactSchema`,
   and `CommandExit`. File or symbol existence alone caps at `DECLARED`.
3. **25-step Durian Export catalog (`REGULATED_TRUST_NETWORK`)** — 5 layers × 5 steps
   anchored in real GACC, MARD PUC (1,599), packhouse PHC (281), accredited lab cadmium
   0.050 mg/kg, NPPO phytosanitary, cold-chain 12–15 °C, ISO 6346 + customs seal,
   selective disclosure, federated trust, Decreto 52/2024 zero-custody, ASEAN corridors
   (`VN_CN`/`MY_CN`/`TH_CN`/`PH_CN`), and recomputed market arithmetic
   (`ceil(1_000_000 * 25_637 / 60_000_000) == 428 > 281`).
4. **Archetype classifier & `CatalogRegistry`** — deterministic keyword table that prints
   matched keywords, maps `OPEN_CORE_SAAS` to the byte-unchanged
   `TWENTY_FIVE_OPENCORE_STEPS` and `REGULATED_TRUST_NETWORK` to the durian catalog, and
   returns `UNRESOLVED` when evidence is insufficient instead of silently defaulting to
   open-core.
5. **Cross-repo read-only CLI (`idea scan --target-root ...`) & `phase_560` hardening** —
   replaces substring-only `audit_blueprint()` with structured section/checkbox/lens
   schema checks and derives step completion from probe/schema verification when callers
   do not pass an explicit telemetry override.

## Phases

| # | Phase | File | Status |
|---|-------|------|--------|
| 1 | [StepSpec, Six Probe Primitives & Market Facts Snapshot](./phase-01-probes-and-schema.md) | `src/core/opencore/grab_diagnostic_types.py`, `src/core/opencore/grab_probe_runner.py` | Pending |
| 2 | [25-Step Durian Catalog, Archetype Classifier & Sequence Engine](./phase-02-durian-catalog-and-engine.md) | `src/core/opencore/durian_export_25_step_catalog.py`, `src/core/opencore/archetype_catalog_registry.py` | Pending |
| 3 | [Cross-Repo `idea scan` CLI, `phase_560` Schema Hardening & Test Suite](./phase-03-cli-scan-and-tests.md) | `src/core/opencore/grab_cross_repo_scanner.py`, `src/cli/idea_commands.py`, `src/core/opencore/phase_560_opencore_saas_readiness_engine.py`, `tests/test_durian_grab_honest_diagnosis.py` | Pending |

## Acceptance Criteria

- [ ] `git diff src/core/opencore/phase_559_opencore_25_step_catalog.py` is empty (`TWENTY_FIVE_OPENCORE_STEPS` is byte-identical).
- [ ] `python3 -m src.cli.idea_commands` / `mekong idea scan --target-root /Users/macbook/durios --archetype auto` prints 25 step lines, each with `evidence_class`, `readiness` (`level` or `UNMEASURABLE`), `sequence` (`IN_ORDER | PREMATURE | INDETERMINATE`), and a reproducible probe `basis`, plus the V2 reference document SHA-256 snapshot digest.
- [ ] Running with `--replay` (or a second invocation) produces byte-identical JSON/table output.
- [ ] Step `multi-revenue-stack-arithmetic` recomputes `ceil(1_000_000 * 25_637 / 60_000_000) == 428 > 281` and flags pure-SaaS $1M ARR as mathematically impossible (`saas_only_feasible=False`).
- [ ] Steps with code present while mandatory prerequisites are `ABSENT`/`DECLARED` or covered by `NOT_AUTHORIZED` (e.g., `corridor-sequencing-integrity` with `MY_CN`/`TH_CN` declared before `PLATFORM-03`, or `verified-trade-room` before `PLATFORM-01`) are labelled `PREMATURE` mechanically.
- [ ] `ProductionCallerCount` excludes `test/` and `src/server/ecosystem-rehearsal-handler.ts`, so rehearsal-only imports (`isMarketplaceFeatureUnlocked`, `evaluateGaccRegistryWatch`) never count as production callers.
- [ ] Archetype classifier returns `UNRESOLVED` with `matched_keywords=()` on unrelated text instead of silently falling back to `OPEN_CORE_SAAS`; registering a synthetic third industry catalog in tests works without editing engine code.
- [ ] Every new or modified Python module is `<= 160` LOC (well under the 165/180/185 LOC guards); `ruff check` and `mypy` pass with 0 errors on all touched files; all new and restored unit tests pass.
- [ ] After scanning `/Users/macbook/durios`, `git -C /Users/macbook/durios status --porcelain` is unchanged and `bun run typecheck` in `/Users/macbook/durios` exits 0.
