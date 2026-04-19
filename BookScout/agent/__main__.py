import sys
import argparse
import asyncio
from dotenv import load_dotenv

from .scheduler import BookScoutScheduler
from .scraper import BookScoutAgent
from .telegram_digest import TelegramDigestSender

def main():
    # Load environment variables
    load_dotenv()

    parser = argparse.ArgumentParser(description='BookScout Agent - Book scraping with Telegram digest')
    parser.add_argument('--now', action='store_true', help='Chạy digest ngay lập tức')
    parser.add_argument('--daemon', action='store_true', help='Chạy scheduler daemon')
    parser.add_argument('--dry-run', action='store_true', help='Scrape và in kết quả, không gửi Telegram')
    parser.add_argument('--test-tg', action='store_true', help='Test kết nối Telegram')

    args = parser.parse_args()

    if not any([args.now, args.daemon, args.dry_run, args.test_tg]):
        parser.print_help()
        return

    scheduler = BookScoutScheduler()

    if args.test_tg:
        print("🧪 Test kết nối Telegram...")
        telegram_sender = TelegramDigestSender()
        success = telegram_sender.test_connection()
        sys.exit(0 if success else 1)

    elif args.dry_run:
        print("🏃 Dry run - Scraping và in kết quả...")
        agent = BookScoutAgent()
        telegram_sender = TelegramDigestSender()

        try:
            # Run scraping
            books = asyncio.run(agent.scrape())

            if books:
                print(f"\n📚 Tìm thấy {len(books)} sách bestseller:\n")

                # Print formatted digest
                digest = telegram_sender.format_digest(books)
                print(digest)

                print(f"\n📊 Summary:")
                print(f"  - Tổng số sách: {len(books)}")
                print(f"  - Ước tính bán chạy nhất: {books[0].copies_sold_estimate:,} bản")
                print(f"  - Ước tính ít nhất: {books[-1].copies_sold_estimate:,} bản")

            else:
                print("❌ Không tìm thấy sách bán chạy nào")

        except Exception as e:
            print(f"❌ Lỗi dry run: {e}")
            sys.exit(1)

    elif args.now:
        print("⚡ Chạy digest ngay lập tức...")
        scheduler.run_now()

    elif args.daemon:
        print("🤖 Khởi động scheduler daemon...")
        scheduler.start_daemon()

if __name__ == '__main__':
    main()