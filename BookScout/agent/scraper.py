import asyncio
import json
import os
from datetime import datetime
from collections import defaultdict

from .models import Book, ScrapeResult
from .sources.openlibrary import OpenLibrarySource
from .sources.google_books import GoogleBooksSource

class BookScoutAgent:
    BESTSELLER_QUERIES = [
        "bestseller fiction 2025",
        "bestseller nonfiction 2025",
        "most popular books 2026",
        "award winning books",
        "best selling books of all time",
        "sách bán chạy nhất",
    ]

    MIN_COPIES = 1_000_000

    def __init__(self):
        self.openlibrary = OpenLibrarySource()
        self.google_books = GoogleBooksSource()

    async def scrape(self, queries=None, min_copies=None) -> list[Book]:
        """Run all sources, merge, filter ≥1M copies, deduplicate by title."""
        if queries is None:
            queries = self.BESTSELLER_QUERIES
        if min_copies is None:
            min_copies = self.MIN_COPIES

        print(f"🔍 Bắt đầu scraping với {len(queries)} truy vấn...")

        all_books = []

        # Scrape from all sources
        for query in queries:
            print(f"📚 Truy vấn: '{query}'")

            # OpenLibrary
            try:
                ol_books = await self.openlibrary.search(query)
                print(f"  OpenLibrary: {len(ol_books)} sách")
                all_books.extend(ol_books)
            except Exception as e:
                print(f"  Lỗi OpenLibrary: {e}")

            # Google Books
            try:
                gb_books = await self.google_books.search(query)
                print(f"  Google Books: {len(gb_books)} sách")
                all_books.extend(gb_books)
            except Exception as e:
                print(f"  Lỗi Google Books: {e}")

        print(f"📊 Tổng cộng: {len(all_books)} sách trước khi xử lý")

        # Estimate copies for OpenLibrary books (they don't have rating counts)
        for book in all_books:
            if book.copies_sold_estimate == 0:
                book.copies_sold_estimate = self._estimate_copies_sold(book)

        # Deduplicate by title+author
        deduplicated_books = self._deduplicate(all_books)
        print(f"🔄 Sau dedup: {len(deduplicated_books)} sách")

        # Filter by minimum copies sold
        bestsellers = [book for book in deduplicated_books if book.copies_sold_estimate >= min_copies]
        print(f"⭐ Sách bán chạy (≥{min_copies:,} bản): {len(bestsellers)}")

        # Sort by copies sold (descending)
        bestsellers.sort(key=lambda x: x.copies_sold_estimate, reverse=True)

        return bestsellers

    def _estimate_copies_sold(self, book: Book) -> int:
        """Estimate copies from rating count: ratingsCount * 200"""
        google_data = book.sources.get('google_books', {})
        if google_data and google_data.get('reviews', 0) > 0:
            return google_data['reviews'] * 200

        # For OpenLibrary books without Google data, use title popularity heuristic
        title_lower = book.title.lower()
        if any(word in title_lower for word in ['bestseller', 'award', 'winner', 'popular']):
            return 2_000_000  # Assume bestseller status

        if book.year and book.year >= 2020:  # Recent books
            return 1_500_000

        return 800_000  # Default estimate below threshold

    def _deduplicate(self, books: list[Book]) -> list[Book]:
        """Merge books with same title+author"""
        book_map = {}

        for book in books:
            # Create normalized key
            key = f"{book.title.lower().strip()}|{book.author.lower().strip()}"

            if key in book_map:
                # Merge sources and take best data
                existing = book_map[key]

                # Merge sources
                existing.sources.update(book.sources)

                # Take higher copies sold estimate
                if book.copies_sold_estimate > existing.copies_sold_estimate:
                    existing.copies_sold_estimate = book.copies_sold_estimate

                # Take non-empty fields
                if book.description and not existing.description:
                    existing.description = book.description
                if book.cover_url and not existing.cover_url:
                    existing.cover_url = book.cover_url
                if book.isbn and not existing.isbn:
                    existing.isbn = book.isbn
                if book.year > existing.year:
                    existing.year = book.year
                if book.genre and not existing.genre:
                    existing.genre = book.genre

            else:
                book_map[key] = book

        return list(book_map.values())

    def export_json(self, books: list[Book], path: str):
        """Save to BookScout/data/weekly_digest.json"""
        os.makedirs(os.path.dirname(path), exist_ok=True)

        data = {
            'exported_at': datetime.now().isoformat(),
            'count': len(books),
            'books': []
        }

        for book in books:
            book_data = {
                'title': book.title,
                'author': book.author,
                'year': book.year,
                'genre': book.genre,
                'isbn': book.isbn,
                'description': book.description,
                'cover_url': book.cover_url,
                'copies_sold_estimate': book.copies_sold_estimate,
                'sources': book.sources
            }
            data['books'].append(book_data)

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"💾 Đã xuất {len(books)} sách ra {path}")