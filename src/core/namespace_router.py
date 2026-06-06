"""Namespace-Aware Context Router — Phase 2 Dynamic Context Loading.

Splits the 573-skill catalog into namespace buckets, detects the active
namespace from user input, and returns only the relevant subset.

Namespaces (aligned with Mekong CLI layers):
    founder  biz  product  engineering  ops  studio  raas  finance  legal  trading  utils

Fallback: if detection confidence < threshold → load full catalog (safe default).
"""
from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# ── Namespace keyword map ───────────────────────────────────────────
# Maps namespace → keywords that signal the user is operating in that domain.
# Used for lightweight keyword scoring on the user's goal/input.
NAMESPACE_KEYWORDS: dict[str, list[str]] = {
    "founder": ["annual", "okr", "swot", "fundraise", "pitch", "cap-table", "ipo",
                "vision", "strategy", "board", "founder"],
    "biz": ["sales", "marketing", "pricing", "brand", "campaign", "lead",
            "customer", "revenue", "growth", "seo", "ads", "crm", "zalo"],
    "product": ["plan", "roadmap", "sprint", "brainstorm", "scope", "feature",
                "backlog", "user-story", "mvp", "prd", "requirement"],
    "engineering": ["code", "review", "test", "deploy", "refactor", "bug",
                    "ci", "docker", "k8s", "api", "database", "schema",
                    "migration", "lint", "typescript", "python", "build"],
    "ops": ["audit", "health", "security", "status", "monitor", "alert",
            "incident", "compliance", "itgc", "sox"],
    "studio": ["dealflow", "venture", "expert", "vc", "portfolio", "pitch-deck"],
    "raas": ["raas", "subscription", "tenant", "pilot", "credit", "pricing-vn",
             "usage-meter", "convert"],
    "finance": ["invoice", "accounting", "bhxh", "tax", "thue", "ke-toan",
                "invoice-batch", "close-report", "forecast", "budget", "expense"],
    "legal": ["legal", "contract", "nda", "ip", "compliance", "gdpr"],
    "trading": ["trade", "position", "portfolio-trade", "signal", "backtest",
                "algo", "strategy-trade", "risk"],
    "utils": ["git", "commit", "diff", "log", "status", "clean", "doctor",
              "prime", "context-prime", "commands-status"],
}

# Skill name → namespace mapping (computed lazily from NAMESPACE_KEYWORDS)
_NAMESPACE_FOR_KEYWORD: dict[str, str] = {}
for ns, kws in NAMESPACE_KEYWORDS.items():
    for kw in kws:
        _NAMESPACE_FOR_KEYWORD[kw] = ns

# Commands that span multiple namespaces (load broader context)
CROSS_NAMESPACE_COMMANDS = {
    "ship", "cook", "plan", "review", "test", "quick-start", "cto-dashboard",
    "dev-feature", "dev-bug-sprint", "deploy",
}

# Skills directory
SKILLS_DIR = Path(__file__).resolve().parent.parent.parent / ".claude" / "skills"


@dataclass
class NamespaceResult:
    """Result of namespace detection."""
    namespace: str
    confidence: float
    matched_keywords: list[str]
    skill_count_total: int = 0
    skill_count_filtered: int = 0

    @property
    def reduction_pct(self) -> float:
        if self.skill_count_total == 0:
            return 0.0
        return (1 - self.skill_count_filtered / self.skill_count_total) * 100


class NamespaceRouter:
    """Detects active namespace from user input and filters skills accordingly.

    Usage:
        router = NamespaceRouter()
        result = router.detect("review this pull request for security issues")
        # → NamespaceResult(namespace="engineering", confidence=0.8, ...)

        relevant_skills = router.filter_skills(result)
        # → ["code-reviewer", "security-scanner", ...]
    """

    def __init__(
        self,
        skills_dir: Path | None = None,
        min_confidence: float = 0.25,
        cache_size: int = 200,
    ):
        self.skills_dir = skills_dir or SKILLS_DIR
        self.min_confidence = min_confidence
        self._skill_index: dict[str, str] = {}  # skill_name → namespace
        self._namespace_skills: dict[str, list[str]] = {}  # namespace → [skills]
        self._total_skills = 0
        self._detection_cache: dict[str, NamespaceResult] = {}
        self._build_index()

    # ── Index building ──────────────────────────────────────────────

    def _build_index(self) -> None:
        """Scan skills dir and index each skill by namespace (lazy, once)."""
        if not self.skills_dir.exists():
            logger.warning("Skills dir not found: %s", self.skills_dir)
            return

        for skill_dir in self.skills_dir.iterdir():
            if not skill_dir.is_dir():
                continue
            skill_md = skill_dir / "SKILL.md"
            if not skill_md.exists():
                continue
            name = skill_dir.name
            namespace = self._classify_skill(name, skill_md)
            self._skill_index[name] = namespace
            self._namespace_skills.setdefault(namespace, []).append(name)
            self._total_skills += 1

        logger.info(
            "[Router] Indexed %d skills across %d namespaces",
            self._total_skills,
            len(self._namespace_skills),
        )

    def _classify_skill(self, name: str, skill_md: Path) -> str:
        """Classify a single skill into a namespace by name + frontmatter."""
        # 1. Name keyword match
        lower = name.lower().replace("-", "_")
        for kw, ns in _NAMESPACE_FOR_KEYWORD.items():
            if kw.replace("-", "_") in lower:
                return ns

        # 2. Frontmatter description scan (first 200 chars)
        try:
            text = skill_md.read_text(errors="ignore")[:400].lower()
            for kw, ns in _NAMESPACE_FOR_KEYWORD.items():
                if kw in text:
                    return ns
        except OSError:
            pass

        return "utils"  # default bucket

    # ── Detection ───────────────────────────────────────────────────

    def detect(self, user_input: str, command_name: str | None = None) -> NamespaceResult:
        """Detect the active namespace for a user request.

        Args:
            user_input: The raw user goal/input text
            command_name: Optional matched command name (overrides detection)

        Returns:
            NamespaceResult with namespace, confidence, matched keywords
        """
        # Command override: if we already matched a command, use its namespace
        if command_name:
            cmd_ns = self._skill_index.get(command_name, "utils")
            return NamespaceResult(
                namespace=cmd_ns, confidence=1.0, matched_keywords=[command_name],
                skill_count_total=self._total_skills,
                skill_count_filtered=len(self._namespace_skills.get(cmd_ns, [])),
            )

        # Check cache
        cache_key = user_input[:120].lower().strip()
        if cache_key in self._detection_cache:
            return self._detection_cache[cache_key]

        # Keyword scoring
        lower = user_input.lower()
        scores: dict[str, float] = {}
        matched: dict[str, list[str]] = {}

        for kw, ns in _NAMESPACE_FOR_KEYWORD.items():
            # Word-boundary match with optional plural/s
            pattern = r'\b' + re.escape(kw) + r's?\b'
            hits = len(re.findall(pattern, lower))
            if hits:
                scores[ns] = scores.get(ns, 0.0) + hits * 0.3
                matched.setdefault(ns, []).append(kw)

        # Pick winner
        if scores:
            best_ns = max(scores, key=scores.get)
            best_score = scores[best_ns]
            confidence = min(best_score, 1.0)
        else:
            best_ns = "utils"
            confidence = 0.1

        result = NamespaceResult(
            namespace=best_ns,
            confidence=confidence,
            matched_keywords=matched.get(best_ns, []),
            skill_count_total=self._total_skills,
            skill_count_filtered=len(self._namespace_skills.get(best_ns, [])),
        )

        self._detection_cache[cache_key] = result
        return result

    # ── Filtering ───────────────────────────────────────────────────

    def filter_skills(
        self,
        result: NamespaceResult,
        always_include: list[str] | None = None,
    ) -> list[str]:
        """Return skill names relevant to the detected namespace.

        Args:
            result: NamespaceResult from detect()
            always_include: Skill names to always include regardless of namespace

        Returns:
            List of skill directory names relevant to this request
        """
        if result.confidence < self.min_confidence:
            logger.debug(
                "[Router] Low confidence %.2f for ns=%s, loading all %d skills",
                result.confidence, result.namespace, self._total_skills,
            )
            return list(self._skill_index.keys())

        relevant = list(self._namespace_skills.get(result.namespace, []))

        # Cross-namespace commands get adjacent skills
        if result.namespace in ("engineering", "biz", "founder"):
            for adj_ns in ["utils", "ops"]:
                relevant.extend(self._namespace_skills.get(adj_ns, []))

        # Always-include overrides
        if always_include:
            for skill in always_include:
                if skill not in relevant:
                    relevant.append(skill)

        # Deduplicate preserving order
        seen: set[str] = set()
        deduped = []
        for s in relevant:
            if s not in seen:
                seen.add(s)
                deduped.append(s)

        logger.info(
            "[Router] ns=%s conf=%.2f filtered=%d/%d skills (%.0f%% reduction)",
            result.namespace, result.confidence,
            len(deduped), self._total_skills, result.reduction_pct,
        )
        return deduped

    # ── Stats ───────────────────────────────────────────────────────

    def get_namespace_distribution(self) -> dict[str, int]:
        """Return skill count per namespace (for observability)."""
        return {ns: len(skills) for ns, skills in self._namespace_skills.items()}

    def get_skill_namespace(self, skill_name: str) -> str:
        """Return the namespace for a specific skill."""
        return self._skill_index.get(skill_name, "utils")
