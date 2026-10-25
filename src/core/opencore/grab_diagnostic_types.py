"""Core types, dual labels, and declarative probe contracts for the 25-step Grab-standard diagnostic engine."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Union


class EvidenceClass(str, Enum):
    STATIC_SOURCE = "STATIC_SOURCE"
    RUNTIME_BEHAVIOR = "RUNTIME_BEHAVIOR"
    LIVE_OPERATION = "LIVE_OPERATION"
    MARKET = "MARKET"


class ReadinessLevel(str, Enum):
    ABSENT = "ABSENT"
    DECLARED = "DECLARED"
    IMPLEMENTED = "IMPLEMENTED"
    GUARDED = "GUARDED"
    REACHABLE = "REACHABLE"
    MEASURED = "MEASURED"

    @property
    def rank(self) -> int:
        order = (
            ReadinessLevel.ABSENT,
            ReadinessLevel.DECLARED,
            ReadinessLevel.IMPLEMENTED,
            ReadinessLevel.GUARDED,
            ReadinessLevel.REACHABLE,
            ReadinessLevel.MEASURED,
        )
        return order.index(self)


class SequenceVerdict(str, Enum):
    IN_ORDER = "IN_ORDER"
    PREMATURE = "PREMATURE"
    INDETERMINATE = "INDETERMINATE"


@dataclass(frozen=True)
class ReadinessLabel:
    level: ReadinessLevel
    measurable: bool
    probe_basis: str

    def render(self) -> str:
        return self.level.value if self.measurable else "UNMEASURABLE"


@dataclass(frozen=True)
class SequenceLabel:
    verdict: SequenceVerdict
    violated_prerequisites: tuple[str, ...]
    basis: str


@dataclass(frozen=True)
class GrepSymbol:
    symbol: str
    min_occurrences: int = 1
    exclude_paths: tuple[str, ...] = ("src/server/ecosystem-rehearsal-handler.ts",)
    target_level: ReadinessLevel = ReadinessLevel.IMPLEMENTED
    kind: str = "GrepSymbol"


@dataclass(frozen=True)
class AstTypePresent:
    type_names: tuple[str, ...]
    target_glob: str = "src/**/*.ts"
    kind: str = "AstTypePresent"


@dataclass(frozen=True)
class RuntimeExec:
    module_path: str
    function_name: str
    fixture_expr: str
    expected_basis: str
    kind: str = "RuntimeExec"


@dataclass(frozen=True)
class ProductionCallerCount:
    symbol: str
    min_callers: int = 1
    exclude_paths: tuple[str, ...] = ("src/server/ecosystem-rehearsal-handler.ts",)
    kind: str = "ProductionCallerCount"


@dataclass(frozen=True)
class ArtifactSchema:
    artifact_path: str
    schema_kind: str
    required_keys: tuple[str, ...] = ()
    expected_equals: dict[str, object] = field(default_factory=dict)
    require_non_null: tuple[str, ...] = ()
    kind: str = "ArtifactSchema"


@dataclass(frozen=True)
class CommandExit:
    command: str
    argv: tuple[str, ...]
    cwd_relative: str = "."
    kind: str = "CommandExit"


ProbeDeclaration = Union[
    GrepSymbol,
    AstTypePresent,
    RuntimeExec,
    ProductionCallerCount,
    ArtifactSchema,
    CommandExit,
]


@dataclass(frozen=True)
class StepSpec:
    step_number: int
    layer: str
    slug: str
    industry_anchor: str
    evidence_class: EvidenceClass
    probe: ProbeDeclaration
    mandatory_prerequisites: tuple[str, ...] = ()
    not_authorized_covers: tuple[str, ...] = ()
    microcontract: dict[str, str] = field(default_factory=dict)
