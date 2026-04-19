# CTO DISPATCH — BookScout Scraping Agent

## MISSION
Build a Python-based book scraping agent that:
1. Scrapes bestseller books (≥1M copies sold) from OpenLibrary + Google Books APIs
2. Sends a formatted Telegram digest every Monday at 8AM (ICT, UTC+7)
3. Integrates with existing Mekong CLI TelegramClient at `src/core/telegram_client.py`

## CONTEXT
- Working directory: `/Users/mac/mekong-cli/BookScout/agent/`
- Existing frontend MVP at `BookScout/` (index.html, style.css, app.js) — DO NOT MODIFY
- TelegramClient API: `from src.core.telegram_client import TelegramClient, send_alert`
- Env vars needed: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OPS_CHANNEL_ID` (from `.env`)
- Python 3.11+, use only stdlib + aiohttp + pydantic + python-dotenv + schedule

## TASK LIST (execute in order)

### 1. Create package structure
```
BookScout/agent/
├── __init__.py
├── __main__.py
├── models.py
├── scraper.py
├── telegram_digest.py
├── scheduler.py
├── requirements.txt
├── sources/
│   ├── __init__.py
│   ├── openlibrary.py
│   └── google_books.py
└── data/           (gitignored, created at runtime)
```

### 2. `models.py` — Data Models
```python
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
```

### 3. `sources/openlibrary.py` — OpenLibrary API
- Endpoint: `https://openlibrary.org/search.json?q={query}&limit=50`
- Search queries: "bestseller", "award winner", trending subjects
- Extract: title, author_name, first_publish_year, isbn, subject, cover_i
- Cover URL: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`
- Rate limit: 1 request per second
- Function: `async def search(query: str) -> list[Book]`

### 4. `sources/google_books.py` — Google Books API
- Endpoint: `https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=40&orderBy=relevance`
- Extract: title, authors, publishedDate, description, averageRating, ratingsCount, categories, imageLinks
- Use ratingsCount to estimate copies sold (ratingsCount * 200 = estimated copies)
- Free tier: 1000 req/day, no API key needed for basic search
- Function: `async def search(query: str) -> list[Book]`

### 5. `scraper.py` — Agent Orchestrator
```python
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
    
    async def scrape(self, queries=None, min_copies=None) -> list[Book]:
        """Run all sources, merge, filter ≥1M copies, deduplicate by title."""
        ...
    
    def _estimate_copies_sold(self, book: Book) -> int:
        """Estimate copies from rating count: ratingsCount * 200"""
        ...
    
    def _deduplicate(self, books: list[Book]) -> list[Book]:
        """Merge books with same title+author"""
        ...
    
    def export_json(self, books: list[Book], path: str):
        """Save to BookScout/data/weekly_digest.json"""
        ...
```

### 6. `telegram_digest.py` — Telegram Formatter + Sender
- Format each book as:
```
📚 *{title}*
✍️ {author} · {year}
⭐ Rating: {rating} ({reviews} reviews)
📊 ~{copies_sold_estimate:,} bản bán
🔗 [Goodreads](https://goodreads.com/search?q={title}) | [Tiki](https://tiki.vn/search?q={title})
```
- Header: `📖 *BookScout Weekly Digest*\n🗓 Tuần {week_number} — {date}\n━━━━━━━━━━━━━━━━━━━━`
- Footer: `\n🤖 _Powered by BookScout Agent_`
- Send via: `TelegramClient.send_message(chat_id, text, parse_mode="Markdown")`
- If message too long (>4096 chars), split into multiple messages
- Function: `def send_digest(books: list[Book]) -> bool`
- Function: `def format_digest(books: list[Book]) -> str` (for dry run)

### 7. `scheduler.py` — Weekly Scheduler
- Use `schedule` library
- Schedule: every Monday at 08:00 (ICT = UTC+7)
- Pipeline: scrape → filter → format → send
- Logging to stdout

### 8. `__main__.py` — CLI Entry
```bash
python -m BookScout.agent --now        # Run immediately
python -m BookScout.agent --daemon     # Run as scheduler daemon
python -m BookScout.agent --dry-run    # Scrape + print, don't send
python -m BookScout.agent --test-tg    # Test Telegram connection
```

### 9. `requirements.txt`
```
aiohttp>=3.9
pydantic>=2.0
python-dotenv>=1.0
schedule>=1.2
```

## CONSTRAINTS
- Use `async/await` with `aiohttp` for all HTTP requests
- ALL text output in Vietnamese (descriptions, logs, Telegram messages)
- Respect rate limits: 1 req/s OpenLibrary, 1000 req/day Google Books
- Handle network errors gracefully — log and continue
- Do NOT modify existing BookScout frontend files (index.html, style.css, app.js)
- Use `sys.path` manipulation in `__main__.py` to import from `src/core/telegram_client.py`
- Create `BookScout/data/` directory at runtime if not exists

## CONCLUSION
After implementing all files:
1. Run `pip install -r BookScout/agent/requirements.txt`
2. Test: `cd /Users/mac/mekong-cli && python -m BookScout.agent --dry-run`
3. Verify output shows ≥5 bestseller books with estimated copies ≥1M
4. Commit: `git add BookScout/agent/ && git commit -m "feat(bookscout): add book scraping agent with Telegram weekly digest"`
5. Report summary of what was built and test results
