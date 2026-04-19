import asyncio
import aiohttp
from datetime import datetime
from ..models import Book, ScrapeResult

class OpenLibrarySource:
    BASE_URL = "https://openlibrary.org/search.json"
    RATE_LIMIT = 1.0  # 1 request per second

    def __init__(self):
        self._last_request = 0

    async def _rate_limit(self):
        """Ensure rate limit compliance"""
        now = asyncio.get_event_loop().time()
        elapsed = now - self._last_request
        if elapsed < self.RATE_LIMIT:
            await asyncio.sleep(self.RATE_LIMIT - elapsed)
        self._last_request = asyncio.get_event_loop().time()

    async def search(self, query: str) -> list[Book]:
        """Search OpenLibrary for books"""
        await self._rate_limit()

        params = {
            'q': query,
            'limit': 50,
            'fields': 'key,title,author_name,first_publish_year,isbn,subject,cover_i'
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_books(data, query)
                    else:
                        print(f"Lỗi OpenLibrary API: {response.status}")
                        return []
        except Exception as e:
            print(f"Lỗi kết nối OpenLibrary: {e}")
            return []

    def _parse_books(self, data: dict, query: str) -> list[Book]:
        """Parse OpenLibrary response to Book objects"""
        books = []

        for item in data.get('docs', []):
            try:
                title = item.get('title', 'Unknown')
                authors = item.get('author_name', [])
                author = authors[0] if authors else 'Unknown Author'
                year = item.get('first_publish_year', 0)

                # Get genre from subjects
                subjects = item.get('subject', [])
                genre = subjects[0] if subjects else ""

                # Get ISBN
                isbn_list = item.get('isbn', [])
                isbn = isbn_list[0] if isbn_list else ""

                # Build cover URL
                cover_i = item.get('cover_i')
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-M.jpg" if cover_i else ""

                book = Book(
                    title=title,
                    author=author,
                    year=year,
                    genre=genre,
                    isbn=isbn,
                    cover_url=cover_url,
                    sources={
                        'openlibrary': {
                            'key': item.get('key', ''),
                            'subjects': subjects[:3]  # Top 3 subjects
                        }
                    }
                )

                books.append(book)

            except Exception as e:
                print(f"Lỗi parse OpenLibrary item: {e}")
                continue

        return books