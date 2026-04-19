from dataclasses import dataclass, field

@dataclass
class Book:
    title: str
    author: str
    year: int = 0
    genre: str = ""
    isbn: str = ""
    description: str = ""
    cover_url: str = ""
    copies_sold_estimate: int = 0  # estimated from review volume
    sources: dict = field(default_factory=dict)
    # sources format: {"openlibrary": {"rating": 4.2, "reviews": 1200}, ...}

@dataclass
class ScrapeResult:
    books: list[Book] = field(default_factory=list)
    source: str = ""
    query: str = ""
    errors: list[str] = field(default_factory=list)
    scraped_at: str = ""