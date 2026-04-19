import aiohttp
from datetime import datetime
from ..models import Book, ScrapeResult

class GoogleBooksSource:
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"

    async def search(self, query: str) -> list[Book]:
        """Search Google Books API"""
        params = {
            'q': query,
            'maxResults': 40,
            'orderBy': 'relevance'
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._parse_books(data, query)
                    else:
                        print(f"Lỗi Google Books API: {response.status}")
                        return []
        except Exception as e:
            print(f"Lỗi kết nối Google Books: {e}")
            return []

    def _parse_books(self, data: dict, query: str) -> list[Book]:
        """Parse Google Books response to Book objects"""
        books = []

        for item in data.get('items', []):
            try:
                volume_info = item.get('volumeInfo', {})

                title = volume_info.get('title', 'Unknown')
                authors = volume_info.get('authors', [])
                author = authors[0] if authors else 'Unknown Author'

                # Parse year from publishedDate
                published_date = volume_info.get('publishedDate', '')
                year = 0
                if published_date:
                    try:
                        year = int(published_date.split('-')[0])
                    except:
                        year = 0

                # Get description
                description = volume_info.get('description', '')

                # Get rating and rating count
                average_rating = volume_info.get('averageRating', 0)
                ratings_count = volume_info.get('ratingsCount', 0)

                # Estimate copies sold: ratingsCount * 200
                copies_sold_estimate = ratings_count * 200 if ratings_count else 0

                # Get categories (genre)
                categories = volume_info.get('categories', [])
                genre = categories[0] if categories else ""

                # Get cover URL
                image_links = volume_info.get('imageLinks', {})
                cover_url = image_links.get('thumbnail', '') or image_links.get('smallThumbnail', '')

                # Get ISBN
                industry_identifiers = volume_info.get('industryIdentifiers', [])
                isbn = ""
                for identifier in industry_identifiers:
                    if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                        isbn = identifier.get('identifier', '')
                        break

                book = Book(
                    title=title,
                    author=author,
                    year=year,
                    genre=genre,
                    isbn=isbn,
                    description=description[:500] + "..." if len(description) > 500 else description,
                    cover_url=cover_url,
                    copies_sold_estimate=copies_sold_estimate,
                    sources={
                        'google_books': {
                            'rating': average_rating,
                            'reviews': ratings_count,
                            'categories': categories[:3]
                        }
                    }
                )

                books.append(book)

            except Exception as e:
                print(f"Lỗi parse Google Books item: {e}")
                continue

        return books