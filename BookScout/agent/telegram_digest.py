"""BookScout — Telegram Digest Sender.

Formats bestseller book data into a beautiful Telegram digest message
and sends it via direct Telegram Bot API calls.
"""

import json
import os
import ssl
import urllib.parse
import urllib.request
from datetime import datetime
from urllib.parse import quote

from .models import Book


class TelegramDigestSender:
    """Formats and sends weekly book digest to Telegram."""

    MAX_MESSAGE_LENGTH = 4096
    API_BASE = "https://api.telegram.org/bot{token}/{method}"

    def __init__(self):
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self.chat_id = os.getenv("TELEGRAM_OPS_CHANNEL_ID", "")

    @property
    def is_configured(self) -> bool:
        return bool(self.bot_token and self.chat_id)

    # ── Telegram API ──

    def _send_telegram(self, text: str, parse_mode: str = "Markdown") -> bool:
        """Send message via direct Telegram Bot API (urllib)."""
        if not self.is_configured:
            print("❌ TELEGRAM_BOT_TOKEN hoặc TELEGRAM_OPS_CHANNEL_ID chưa được thiết lập")
            return False

        url = self.API_BASE.format(token=self.bot_token, method="sendMessage")
        data = urllib.parse.urlencode({
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": parse_mode,
        }).encode()

        ctx = ssl.create_default_context()
        req = urllib.request.Request(url, data=data)

        try:
            resp = urllib.request.urlopen(req, timeout=30, context=ctx)
            result = json.loads(resp.read().decode())
            if result.get("ok"):
                msg_id = result.get("result", {}).get("message_id", "?")
                print(f"✅ Telegram message sent (ID: {msg_id})")
                return True
            else:
                print(f"❌ Telegram API error: {result}")
                return False
        except Exception as e:
            print(f"❌ Telegram send failed: {e}")
            return False

    # ── Formatting ──

    def format_digest(self, books: list[Book]) -> str:
        """Format books into Telegram digest message."""
        if not books:
            return (
                "📖 *BookScout Weekly Digest*\n\n"
                "❌ Không tìm thấy sách bán chạy nào tuần này.\n\n"
                "🤖 _Powered by BookScout Agent_"
            )

        now = datetime.now()
        week_number = now.isocalendar()[1]
        date_str = now.strftime("%d/%m/%Y")

        header = (
            f"📖 *BookScout Weekly Digest*\n"
            f"🗓 Tuần {week_number} — {date_str}\n"
            f"📊 {len(books)} sách bestseller (≥1M bản)\n"
            f"━━━━━━━━━━━━━━━━━━━━\n\n"
        )

        book_entries = []
        for i, book in enumerate(books[:10], 1):  # Top 10
            book_entries.append(self._format_book(book, i))

        footer = "\n\n🤖 _Powered by BookScout Agent_"

        return header + "\n".join(book_entries) + footer

    def _format_book(self, book: Book, index: int) -> str:
        """Format single book entry for Telegram."""
        title_encoded = quote(book.title)
        goodreads_link = f"https://goodreads.com/search?q={title_encoded}"
        tiki_link = f"https://tiki.vn/search?q={title_encoded}"

        parts = [f"*{index}. {book.title}*"]
        parts.append(f"✍️ {book.author} · {book.year if book.year else 'N/A'}")

        # Rating from Google Books
        gb = book.sources.get("google_books", {})
        if gb.get("rating"):
            parts.append(f"⭐ {gb['rating']}/5 ({gb.get('reviews', 0):,} reviews)")

        parts.append(f"📊 ~{book.copies_sold_estimate:,} bản bán")

        if book.genre:
            parts.append(f"📚 {book.genre}")

        parts.append(f"🔗 [Goodreads]({goodreads_link}) | [Tiki]({tiki_link})")

        return "\n".join(parts)

    # ── Public API ──

    def send_digest(self, books: list[Book]) -> bool:
        """Send digest via Telegram (auto-splits if >4096 chars)."""
        if not self.is_configured:
            print("❌ Telegram chưa được cấu hình")
            return False

        full_message = self.format_digest(books)

        if len(full_message) <= self.MAX_MESSAGE_LENGTH:
            return self._send_telegram(full_message)
        else:
            return self._send_split_messages(books)

    def _send_split_messages(self, books: list[Book]) -> bool:
        """Split digest into multiple messages (3 books per message)."""
        books_per_msg = 3
        chunks = [books[i:i + books_per_msg] for i in range(0, min(len(books), 10), books_per_msg)]
        success = 0

        for i, chunk in enumerate(chunks):
            now = datetime.now()
            week_number = now.isocalendar()[1]
            date_str = now.strftime("%d/%m/%Y")

            header = (
                f"📖 *BookScout ({i + 1}/{len(chunks)})*\n"
                f"🗓 Tuần {week_number} — {date_str}\n"
                f"━━━━━━━━━━━━━━━━━━━━\n\n"
            )

            entries = []
            start_idx = i * books_per_msg + 1
            for j, book in enumerate(chunk):
                entries.append(self._format_book(book, start_idx + j))

            footer = ""
            if i == len(chunks) - 1:
                footer = "\n\n🤖 _Powered by BookScout Agent_"

            if self._send_telegram(header + "\n".join(entries) + footer):
                success += 1

        return success == len(chunks)

    def test_connection(self) -> bool:
        """Test Telegram bot connection."""
        return self._send_telegram(
            "🧪 *BookScout Agent Test*\n\n"
            "✅ Kết nối Telegram thành công!\n"
            f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )