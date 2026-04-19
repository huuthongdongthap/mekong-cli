import sys
import os
from datetime import datetime, timedelta
from urllib.parse import quote
import math

# Add parent directory to sys.path for telegram_client import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

try:
    from core.telegram_client import TelegramClient
except ImportError:
    print("Cảnh báo: Không thể import TelegramClient. Chạy ở chế độ debug.")
    TelegramClient = None

from .models import Book

class TelegramDigestSender:
    MAX_MESSAGE_LENGTH = 4096

    def __init__(self):
        if TelegramClient:
            self.telegram_client = TelegramClient()
        else:
            self.telegram_client = None

    def format_digest(self, books: list[Book]) -> str:
        """Format books into Telegram digest message"""
        if not books:
            return "📖 *BookScout Weekly Digest*\n\n❌ Không tìm thấy sách bán chạy nào tuần này.\n\n🤖 _Powered by BookScout Agent_"

        # Header with week info
        now = datetime.now()
        week_number = now.isocalendar()[1]
        date_str = now.strftime("%d/%m/%Y")

        header = f"📖 *BookScout Weekly Digest*\n🗓 Tuần {week_number} — {date_str}\n━━━━━━━━━━━━━━━━━━━━\n\n"

        # Format each book
        book_entries = []
        for i, book in enumerate(books[:10], 1):  # Top 10 books
            entry = self._format_book(book, i)
            book_entries.append(entry)

        # Footer
        footer = f"\n\n🤖 _Powered by BookScout Agent_"

        full_message = header + "\n".join(book_entries) + footer

        return full_message

    def _format_book(self, book: Book, index: int) -> str:
        """Format single book entry"""
        # Get rating info
        rating_info = ""
        google_data = book.sources.get('google_books', {})
        if google_data:
            rating = google_data.get('rating', 0)
            reviews = google_data.get('reviews', 0)
            if rating and reviews:
                rating_info = f"⭐ {rating}/5 ({reviews:,} reviews)"

        # Encode title for search URLs
        title_encoded = quote(book.title)

        # Build links
        goodreads_link = f"https://goodreads.com/search?q={title_encoded}"
        tiki_link = f"https://tiki.vn/search?q={title_encoded}"

        entry_parts = [
            f"*{index}. {book.title}*",
            f"✍️ {book.author} · {book.year if book.year else 'N/A'}",
        ]

        if rating_info:
            entry_parts.append(rating_info)

        entry_parts.append(f"📊 ~{book.copies_sold_estimate:,} bản bán")

        if book.genre:
            entry_parts.append(f"📚 {book.genre}")

        entry_parts.append(f"🔗 [Goodreads]({goodreads_link}) | [Tiki]({tiki_link})")

        return "\n".join(entry_parts)

    def send_digest(self, books: list[Book]) -> bool:
        """Send digest via Telegram"""
        if not self.telegram_client:
            print("❌ TelegramClient không khả dụng")
            return False

        try:
            full_message = self.format_digest(books)

            # Split message if too long
            if len(full_message) <= self.MAX_MESSAGE_LENGTH:
                # Send as single message
                success = self._send_message(full_message)
                return success
            else:
                # Split into multiple messages
                return self._send_split_messages(books)

        except Exception as e:
            print(f"❌ Lỗi gửi digest: {e}")
            return False

    def _send_message(self, message: str) -> bool:
        """Send single Telegram message"""
        try:
            chat_id = os.getenv('TELEGRAM_OPS_CHANNEL_ID')
            if not chat_id:
                print("❌ TELEGRAM_OPS_CHANNEL_ID không được thiết lập")
                return False

            # Use TelegramClient.send_message method
            result = self.telegram_client.send_message(
                chat_id=chat_id,
                text=message,
                parse_mode="Markdown"
            )

            if result:
                print("✅ Đã gửi digest thành công")
                return True
            else:
                print("❌ Gửi digest thất bại")
                return False

        except Exception as e:
            print(f"❌ Lỗi gửi message: {e}")
            return False

    def _send_split_messages(self, books: list[Book]) -> bool:
        """Send digest as multiple messages if too long"""
        # Split books into chunks
        books_per_message = 3
        book_chunks = [books[i:i+books_per_message] for i in range(0, len(books), books_per_message)]

        success_count = 0

        for i, chunk in enumerate(book_chunks):
            # Create header for this chunk
            now = datetime.now()
            week_number = now.isocalendar()[1]
            date_str = now.strftime("%d/%m/%Y")

            header = f"📖 *BookScout Weekly Digest ({i+1}/{len(book_chunks)})*\n🗓 Tuần {week_number} — {date_str}\n━━━━━━━━━━━━━━━━━━━━\n\n"

            # Format books in this chunk
            book_entries = []
            start_index = i * books_per_message + 1
            for j, book in enumerate(chunk):
                entry = self._format_book(book, start_index + j)
                book_entries.append(entry)

            # Add footer to last message
            footer = ""
            if i == len(book_chunks) - 1:
                footer = f"\n\n🤖 _Powered by BookScout Agent_"

            message = header + "\n".join(book_entries) + footer

            if self._send_message(message):
                success_count += 1

        return success_count == len(book_chunks)

    def test_connection(self) -> bool:
        """Test Telegram connection"""
        if not self.telegram_client:
            print("❌ TelegramClient không khả dụng")
            return False

        try:
            chat_id = os.getenv('TELEGRAM_OPS_CHANNEL_ID')
            if not chat_id:
                print("❌ TELEGRAM_OPS_CHANNEL_ID không được thiết lập")
                return False

            test_message = "🧪 *BookScout Agent Test*\n\nKiểm tra kết nối Telegram thành công!"

            result = self._send_message(test_message)
            return result

        except Exception as e:
            print(f"❌ Lỗi test connection: {e}")
            return False