import schedule
import time
import asyncio
from datetime import datetime
import os

from .scraper import BookScoutAgent
from .telegram_digest import TelegramDigestSender

class BookScoutScheduler:
    def __init__(self):
        self.agent = BookScoutAgent()
        self.telegram_sender = TelegramDigestSender()

    def run_weekly_digest(self):
        """Run the weekly digest pipeline"""
        print(f"🚀 Bắt đầu weekly digest: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        try:
            # Run async scraping
            books = asyncio.run(self._scrape_and_process())

            if books:
                # Export to JSON
                data_dir = os.path.join(os.path.dirname(__file__), 'data')
                json_path = os.path.join(data_dir, 'weekly_digest.json')
                self.agent.export_json(books, json_path)

                # Send Telegram digest
                success = self.telegram_sender.send_digest(books)
                if success:
                    print("✅ Weekly digest hoàn tất")
                else:
                    print("❌ Lỗi gửi Telegram digest")
            else:
                print("⚠️ Không tìm thấy sách bán chạy nào")

        except Exception as e:
            print(f"❌ Lỗi chạy weekly digest: {e}")

    async def _scrape_and_process(self) -> list:
        """Async scraping pipeline"""
        books = await self.agent.scrape()
        print(f"📊 Tìm thấy {len(books)} sách bestseller")
        return books

    def start_daemon(self):
        """Start scheduler daemon"""
        # Schedule every Monday at 08:00 ICT (UTC+7)
        schedule.every().monday.at("08:00").do(self.run_weekly_digest)

        print("📅 Scheduler khởi động - Chạy mỗi thứ 2 lúc 8:00 sáng (ICT)")
        print("🔄 Đang chờ lịch trình...")

        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                print("\n🛑 Dừng scheduler")
                break
            except Exception as e:
                print(f"❌ Lỗi scheduler: {e}")
                time.sleep(300)  # Wait 5 minutes on error

    def run_now(self):
        """Run digest immediately (for testing)"""
        print("⚡ Chạy digest ngay lập tức...")
        self.run_weekly_digest()

    def test_components(self):
        """Test individual components"""
        print("🧪 Test các component...")

        # Test Telegram
        print("\n1. Test Telegram connection:")
        telegram_ok = self.telegram_sender.test_connection()

        if telegram_ok:
            print("✅ Telegram OK")
        else:
            print("❌ Telegram FAILED")

        # Test scraping (quick)
        print("\n2. Test scraping (1 query):")
        try:
            test_books = asyncio.run(
                self.agent.scrape(queries=["bestseller books"], min_copies=500_000)
            )
            print(f"✅ Scraping OK - {len(test_books)} sách tìm thấy")
        except Exception as e:
            print(f"❌ Scraping FAILED: {e}")

        print("\n🧪 Test hoàn tất")