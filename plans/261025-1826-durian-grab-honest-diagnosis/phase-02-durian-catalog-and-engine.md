---
phase: 2
title: "25-Step Durian Catalog, Archetype Classifier & Sequence Engine"
status: completed
effort: "1 phase"
created: 2026-10-25
---

# Phase 2 — 25-Step Durian Catalog, Archetype Classifier & Sequence Engine

## Context

Phase 1 provides the types and probe runner. Phase 2 populates the 25-step Durian Export
catalog (`REGULATED_TRUST_NETWORK`) across the 5 Grab-standard layers, builds the
deterministic keyword-table archetype classifier + `CatalogRegistry`, and implements the
mechanical `SequenceLabel` evaluator. `TWENTY_FIVE_OPENCORE_STEPS` in `phase_559` remains
completely untouched.

## Requirements

| # | Requirement |
|---|-------------|
| 2.1 | `durian_export_25_step_catalog.py` defines `TWENTY_FIVE_DURIAN_GRAB_STEPS: tuple[StepSpec, ...]` with 25 steps across 5 layers (5 steps each): `P1_SYSTEM_OF_RECORD`, `P2_SYSTEM_OF_VERIFICATION`, `P3_CLOSED_NETWORK`, `P4_TRANSACTION_NETWORK`, `P5_REGIONAL_INFRASTRUCTURE`. |
| 2.2 | Exact 25 slugs from the confirmed brief: (1) `organization-identity-and-roles`, (2) `puc-orchard-registry`, (3) `packhouse-site-consent`, (4) `lot-lineage-atomic-unit`, (5) `container-and-customs-seal-identity`, (6) `cadmium-heavy-metal-evaluator`, (7) `accredited-lab-test-evidence`, (8) `phytosanitary-certificate-object`, (9) `cold-chain-temperature-attestation`, (10) `blind-fault-exception-and-5min-mean`, (11) `verified-organization-profile`, (12) `selective-disclosure-share-grant`, (13) `federated-trust-handshake`, (14) `gacc-registry-watch`, (15) `dense-mekong-cluster-readiness`, (16) `verified-trade-room`, (17) `zero-custody-compliance-guard`, (18) `escrow-state-machine-no-custody`, (19) `usage-metering-non-binding-take-rate`, (20) `no-public-marketplace-without-license`, (21) `local-first-loopback-and-audit-chain`, (22) `asean-corridor-registry`, (23) `corridor-sequencing-integrity`, (24) `multi-revenue-stack-arithmetic`, (25) `model-portability-to-my`. |
| 2.3 | `archetype_catalog_registry.py` provides `CatalogRegistry` mapping `"OPEN_CORE_SAAS"` to an adapter around `TWENTY_FIVE_OPENCORE_STEPS` and `"REGULATED_TRUST_NETWORK"` to `TWENTY_FIVE_DURIAN_GRAB_STEPS`, plus `register_catalog(archetype, steps, keywords)` so a third industry catalog can be registered purely as data without modifying engine code. |
| 2.4 | `classify_archetype(idea_text: str) -> ArchetypeClassification` uses a deterministic keyword score table, returns `archetype` (`"REGULATED_TRUST_NETWORK"`, `"OPEN_CORE_SAAS"`, or `"UNRESOLVED"`), and records `matched_keywords: tuple[str, ...]`. When no keyword table reaches threshold (>= 1 domain keyword), it returns `"UNRESOLVED"` instead of defaulting to `"OPEN_CORE_SAAS"`. |
| 2.5 | Mechanical sequence evaluation `evaluate_sequence(step, readiness_by_slug)`: if `step.not_authorized_covers` is non-empty and the step has code violations (or if `step` is at `>= DECLARED` while any mandatory prerequisite is `ABSENT`/`DECLARED` or an unmet platform gate), return `SequenceVerdict.PREMATURE`; if any mandatory prerequisite is a `MARKET`/`LIVE_OPERATION` gate whose readiness is `UNMEASURABLE`, return `SequenceVerdict.INDETERMINATE`; otherwise `SequenceVerdict.IN_ORDER`. |
| 2.6 | Every module stays `<= 160` LOC. If the 25-step catalog declaration approaches 160 LOC, split layers P1–P3 and P4–P5 into a data helper module (`durian_export_steps_p1_p3.py` and `durian_export_25_step_catalog.py`). |

## Files

| File | Action | Purpose |
|------|--------|---------|
| `src/core/opencore/durian_export_steps_p1_p3.py` | create | Steps 1–15 (Layers P1–P3) declarative data |
| `src/core/opencore/durian_export_25_step_catalog.py` | create | Steps 16–25 (Layers P4–P5) + combined 25-step tuple |
| `src/core/opencore/archetype_catalog_registry.py` | create | `CatalogRegistry`, deterministic classifier, sequence evaluator |

## Validation

1. `len(TWENTY_FIVE_DURIAN_GRAB_STEPS) == 25` and `[s.step_number for s in TWENTY_FIVE_DURIAN_GRAB_STEPS] == list(range(1, 26))`.
2. `git diff src/core/opencore/phase_559_opencore_25_step_catalog.py` is empty.
3. Classifier tests: durian/GACC/sầu riêng prompt → `REGULATED_TRUST_NETWORK` with matched keywords; open-core/GitHub/MIT prompt → `OPEN_CORE_SAAS`; unrelated prompt `"mở quán cà phê nhỏ"` → `UNRESOLVED`.
4. Sequence evaluator tests: `corridor-sequencing-integrity` and `verified-trade-room` evaluate to `PREMATURE` when `MY_CN`/`TH_CN` or marketplace code exists before `PLATFORM-01`/`PLATFORM-03`.
