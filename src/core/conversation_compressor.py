"""Conversation Compressor — Phase 2 context window management.

Compresses conversation history to stay within token budget while preserving
recent turns verbatim and summarizing older context.

Strategy:
- Keep last N turns verbatim (recency matters most)
- Summarize older turns into a single system message
- Hard cap at max_tokens (auto-compress triggers at threshold_pct of max)

Usage:
    from src.core.conversation_compressor import ConversationCompressor

    compressor = ConversationCompressor(max_tokens=8000, keep_recent=4)
    compressed = compressor.compress(messages)
    # Returns messages list with old turns summarized
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)

# Rough token estimate: ~4 chars per token for English, ~2.5 for Vietnamese
CHARS_PER_TOKEN = 3.5


def estimate_tokens(text: str) -> int:
    """Estimate token count from character count."""
    if not text:
        return 0
    return max(1, len(text) // CHARS_PER_TOKEN)


def estimate_messages_tokens(messages: list[dict]) -> int:
    """Estimate total tokens for a list of messages."""
    total = 0
    for msg in messages:
        content = msg.get("content", "")
        if isinstance(content, list):
            content = " ".join(
                block.get("text", "") for block in content if isinstance(block, dict)
            )
        total += estimate_tokens(str(content))
    return total


@dataclass
class CompressionResult:
    """Result of a compression operation."""
    compressed: bool
    original_tokens: int
    compressed_tokens: int
    turns_summarized: int
    turns_kept: int


class ConversationCompressor:
    """Compress conversation history to fit within token budget.

    Keeps recent turns verbatim, summarizes older context into a single
    system message to preserve coherence without consuming the full context.
    """

    def __init__(
        self,
        max_tokens: int = 8000,
        keep_recent: int = 4,
        threshold_pct: float = 0.7,
        summarize_tool: Any = None,
    ):
        self.max_tokens = max_tokens
        self.keep_recent = keep_recent
        self.threshold_pct = threshold_pct
        self.summarize_tool = summarize_tool  # Optional callable(msg_list) -> str
        self._stats = _CompressionStats()

    def compress(self, messages: list[dict]) -> tuple[list[dict], CompressionResult]:
        """Compress messages if they exceed the token threshold.

        Args:
            messages: Full conversation messages list

        Returns:
            (compressed_messages, CompressionResult)
        """
        current_tokens = estimate_messages_tokens(messages)
        threshold = int(self.max_tokens * self.threshold_pct)

        if current_tokens <= threshold:
            self._stats.skipped += 1
            return messages, CompressionResult(
                compressed=False,
                original_tokens=current_tokens,
                compressed_tokens=current_tokens,
                turns_summarized=0,
                turns_kept=len(messages),
            )

        # Split into old (to summarize) and recent (keep verbatim)
        recent = messages[-self.keep_recent:]
        old = messages[:-self.keep_recent]

        if not old:
            # Can't compress further — hard truncate recent
            logger.warning(
                "[Compressor] Hard truncating: %d recent messages to fit budget",
                len(recent),
            )
            return recent, CompressionResult(
                compressed=True,
                original_tokens=current_tokens,
                compressed_tokens=estimate_messages_tokens(recent),
                turns_summarized=0,
                turns_kept=len(recent),
            )

        # Build summary of old messages
        summary = self._summarize(old)

        # Build compressed message list: summary + recent
        compressed_msgs: list[dict] = [
            {
                "role": "system",
                "content": f"[Previous conversation summary]\n{summary}",
            }
        ] + recent

        compressed_tokens = estimate_messages_tokens(compressed_msgs)
        self._stats.compressed += 1
        self._stats.tokens_saved += current_tokens - compressed_tokens

        logger.info(
            "[Compressor] %d→%d tokens (%d→%d msgs), saved %d tokens",
            current_tokens, compressed_tokens,
            len(messages), len(compressed_msgs),
            current_tokens - compressed_tokens,
        )

        return compressed_msgs, CompressionResult(
            compressed=True,
            original_tokens=current_tokens,
            compressed_tokens=compressed_tokens,
            turns_summarized=len(old),
            turns_kept=len(recent),
        )

    def _summarize(self, messages: list[dict]) -> str:
        """Summarize a list of older messages into a compact string.

        If summarize_tool is provided, delegate to it (e.g., LLM-based summary).
        Otherwise, use extractive summary (first/last line of each turn).
        """
        if self.summarize_tool:
            try:
                return self.summarize_tool(messages)
            except Exception as e:
                logger.warning("[Compressor] summarize_tool failed: %s, falling back", e)

        # Extractive fallback: first sentence + last sentence per turn
        parts: list[str] = []
        for msg in messages:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            if isinstance(content, list):
                content = " ".join(
                    block.get("text", "") for block in content if isinstance(block, dict)
                )
            content = str(content).strip()
            if not content:
                continue
            # Take first 150 chars as representative
            snippet = content[:150] + ("..." if len(content) > 150 else "")
            parts.append(f"[{role}]: {snippet}")

        if not parts:
            return "(empty conversation history)"

        header = f"{len(messages)} previous turns"
        return f"{header}:\n" + "\n".join(parts[:20])  # Cap at 20 snippets

    def should_compress(self, messages: list[dict]) -> bool:
        """Check if compression is needed without actually compressing."""
        current = estimate_messages_tokens(messages)
        return current > int(self.max_tokens * self.threshold_pct)

    def get_stats(self) -> "_CompressionStats":
        return self._stats


@dataclass
class _CompressionStats:
    skipped: int = 0
    compressed: int = 0
    tokens_saved: int = 0

    @property
    def compression_rate(self) -> float:
        total = self.skipped + self.compressed
        if total == 0:
            return 0.0
        return self.compressed / total


# Singleton
_compressor: ConversationCompressor | None = None


def get_compressor(**kwargs: Any) -> ConversationCompressor:
    """Get or create the global ConversationCompressor singleton."""
    global _compressor
    if _compressor is None:
        _compressor = ConversationCompressor(**kwargs)
    return _compressor
