"""Prompt Cache Manager — Anthropic cache_control injection.

Splits system prompts into cached (static/semi-static) and dynamic blocks,
injects cache_control breakpoints, and tracks cache performance metrics.

Usage:
    from src.core.prompt_cache_manager import PromptCacheManager

    mgr = PromptCacheManager()
    cached_system = mgr.build_cached_system(system_prompt, command_content=None)
    # Returns: [{"type": "text", "text": "...", "cache_control": {...}}, ...]
    # Pass to APIAdapter as system=cached_system (list, not string)
"""
from __future__ import annotations

import hashlib
import logging
import os
import time
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)

# Token thresholds per model (below this, caching is skipped silently)
MIN_TOKENS_PER_MODEL: dict[str, int] = {
    "claude-opus-4-8": 1024,
    "claude-sonnet-4-6": 1024,
    "claude-sonnet-4": 1024,
    "claude-haiku-4-5": 4096,
    "claude-haiku-4": 4096,
    "claude-mythos": 4096,
}

# Default minimum
DEFAULT_MIN_TOKENS = 1024

# Markers in system prompt for splitting
COMMAND_HEADER_MARKER = "## Your assigned command:"
TASK_MARKER = "## Task:"
IDENTITY_MARKER = "You are"


@dataclass
class CacheStats:
    """Track prompt cache performance."""
    total_requests: int = 0
    cache_hits: int = 0
    cache_writes: int = 0
    cache_read_tokens: int = 0
    cache_creation_tokens: int = 0
    total_input_tokens: int = 0
    estimated_cost_saved: float = 0.0
    _start_time: float = field(default_factory=time.time)

    @property
    def hit_rate(self) -> float:
        if self.total_requests == 0:
            return 0.0
        return self.cache_hits / self.total_requests

    @property
    def savings_pct(self) -> float:
        if self.total_input_tokens == 0:
            return 0.0
        return (self.cache_read_tokens / self.total_input_tokens) * 100

    def record_request(self, usage: dict[str, int] | None = None, cost_per_mtok: float = 3.0) -> None:
        self.total_requests += 1
        if not usage:
            return
        read_tokens = usage.get("cache_read_input_tokens", 0)
        creation_tokens = usage.get("cache_creation_input_tokens", 0)
        input_tokens = usage.get("input_tokens", 0)
        if read_tokens > 0:
            self.cache_hits += 1
        if creation_tokens > 0:
            self.cache_writes += 1
        self.cache_read_tokens += read_tokens
        self.cache_creation_tokens += creation_tokens
        self.total_input_tokens += input_tokens + read_tokens + creation_tokens
        # Cost saved: cached reads at 10% vs full price
        self.estimated_cost_saved += (read_tokens * cost_per_mtok * 0.001) * 0.9

    def log_summary(self) -> None:
        logger.info(
            "[Cache] requests=%d hits=%d hit_rate=%.1f%% reads=%d savings=$%.4f",
            self.total_requests,
            self.cache_hits,
            self.hit_rate * 100,
            self.cache_read_tokens,
            self.estimated_cost_saved,
        )


class PromptCacheManager:
    """Manages Anthropic prompt caching via cache_control injection.

    Splits system prompts into tiers:
    - Tier 1 (1h TTL): Agent identity + hub expertise (rarely changes)
    - Tier 2 (5m TTL): Command content + static instructions
    - Tier 3 (no cache): Dynamic goal + context (changes per request)
    """

    def __init__(self, enabled: bool = True):
        self.enabled = enabled and bool(os.environ.get("ANTHROPIC_API_KEY"))
        self.stats = CacheStats()
        self._prewarm_hashes: set[str] = set()

    def build_cached_system(
        self,
        system_prompt: str,
        command_content: str | None = None,
        model: str = "claude-sonnet-4-6",
        ttl_1h: bool = True,
    ) -> list[dict[str, Any]] | str:
        """Build system blocks with cache_control breakpoints.

        Args:
            system_prompt: Full system prompt string (agent identity + goal)
            command_content: Optional command markdown content (semi-static)
            model: Model ID for token threshold check
            ttl_1h: Use 1h TTL for identity block (vs 5m)

        Returns:
            List of content blocks with cache_control markers, or plain string
            if caching is disabled or prompt is too short.
        """
        if not self.enabled:
            return system_prompt

        # Check minimum token threshold
        min_tokens = MIN_TOKENS_PER_MODEL.get(model.split("-")[0] + "-" + model.split("-")[1] if len(model.split("-")) > 1 else model, DEFAULT_MIN_TOKENS)
        if len(system_prompt.split()) < min_tokens // 4:  # rough estimate: 4 chars per token
            return system_prompt

        blocks: list[dict[str, Any]] = []
        identity_part, dynamic_part = self._split_prompt(system_prompt, command_content)

        # Tier 1: Identity (1h TTL)
        if identity_part.strip():
            ttl = "1h" if ttl_1h else "5m"
            blocks.append({
                "type": "text",
                "text": identity_part,
                "cache_control": {"type": "ephemeral", "ttl": ttl},
            })

        # Tier 2: Command content (5m TTL)
        if command_content and command_content.strip():
            blocks.append({
                "type": "text",
                "text": command_content,
                "cache_control": {"type": "ephemeral"},
            })

        # Tier 3: Dynamic (no cache_control)
        if dynamic_part.strip():
            blocks.append({
                "type": "text",
                "text": dynamic_part,
            })

        # Fallback: if splitting failed, cache the whole thing
        if not blocks:
            blocks.append({"type": "text", "text": system_prompt, "cache_control": {"type": "ephemeral"}})

        return blocks

    def _split_prompt(
        self, system_prompt: str, command_content: str | None = None
    ) -> tuple[str, str]:
        """Split system prompt into identity (static) and goal (dynamic) parts.

        Strategy:
        1. If command_content is provided, everything before the command marker is identity
        2. Otherwise, split at TASK_MARKER or last known static boundary
        3. Fallback: first 60% is identity, last 40% is dynamic
        """
        if command_content:
            marker_idx = system_prompt.find(COMMAND_HEADER_MARKER)
            if marker_idx > 0:
                return system_prompt[:marker_idx].strip(), system_prompt[marker_idx:].strip()

        # Try splitting at task marker
        task_idx = system_prompt.find(TASK_MARKER)
        if task_idx > 0:
            return system_prompt[:task_idx].strip(), system_prompt[task_idx:].strip()

        # Fallback: split at ~60/40
        lines = system_prompt.split("\n")
        split_idx = int(len(lines) * 0.6)
        return "\n".join(lines[:split_idx]).strip(), "\n".join(lines[split_idx:]).strip()

    def build_tool_cache_blocks(self, tools: list[dict[str, Any]]) -> list[dict[str, Any]] | None:
        """Add cache_control to tool definitions (stable, rarely change).

        Returns tools with cache_control on each, or None if no tools.
        Only worth caching if tools are large (>1K tokens each).
        """
        if not tools or not self.enabled:
            return None
        total_tool_size = sum(len(str(t)) for t in tools)
        if total_tool_size < 4000:  # ~1K tokens — too small to cache
            return None
        return [
            {**tool, "cache_control": {"type": "ephemeral"}} for tool in tools
        ]

    def should_prewarm(self, prompt_hash: str, ttl_seconds: int = 300) -> bool:
        """Check if cache should be pre-warmed for this prompt hash."""
        if prompt_hash in self._prewarm_hashes:
            return False
        self._prewarm_hashes.add(prompt_hash)
        return True

    def record_usage(self, usage: dict[str, int] | None, cost_per_mtok: float = 3.0) -> None:
        """Record API response usage for stats tracking."""
        self.stats.record_request(usage, cost_per_mtok)

    def get_stats(self) -> CacheStats:
        """Return current cache statistics."""
        return self.stats


# Global singleton
_cache_manager: PromptCacheManager | None = None


def get_cache_manager() -> PromptCacheManager:
    """Get or create the global PromptCacheManager singleton."""
    global _cache_manager
    if _cache_manager is None:
        _cache_manager = PromptCacheManager()
    return _cache_manager
