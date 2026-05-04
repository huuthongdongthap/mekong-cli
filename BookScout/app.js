/* ═══════════════════════════════════════════
   BookScout — App Logic
   Visual Book Search + Crawl Animation Engine
   ═══════════════════════════════════════════ */

// ── Data Sources Configuration ──
const SOURCES = [
    { id: 'goodreads', name: 'Goodreads', icon: '📗', type: 'Community Reviews', color: '#553B08', delay: 1200 },
    { id: 'nyt', name: 'NYT Books', icon: '📰', type: 'Bestseller Lists', color: '#1A1A2E', delay: 800 },
    { id: 'kirkus', name: 'Kirkus Reviews', icon: '⭐', type: 'Professional Reviews', color: '#2D1B69', delay: 1500 },
    { id: 'librarything', name: 'LibraryThing', icon: '📚', type: 'Library Community', color: '#0D2137', delay: 1000 },
    { id: 'bookrot', name: 'BookRiot', icon: '🔥', type: 'Curated Lists', color: '#3D0C11', delay: 900 },
    { id: 'tiki', name: 'Tiki.vn', icon: '🛒', type: 'VN Marketplace', color: '#003D29', delay: 1100 },
];

// ── Simulated Book Database ──
const BOOKS_DB = {
    'best fiction 2026': [
        { title: 'The Covenant of Water', author: 'Abraham Verghese', genre: 'Literary Fiction', emoji: '🌊', desc: 'Một tuyệt phẩm kể về ba thế hệ gia đình ở Kerala, Ấn Độ — cuốn sách được hàng triệu người yêu thích.', year: 2024, pages: 720, sources: { goodreads: { rating: 4.42, reviews: 285000 }, nyt: { rating: 4.8, reviews: 1200 }, kirkus: { rating: 4.5, reviews: 340 }, librarything: { rating: 4.3, reviews: 8600 }, bookrot: { rating: 4.6, reviews: 45 }, tiki: { rating: 4.7, reviews: 1200 } } },
        { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Contemporary Fiction', emoji: '🎮', desc: 'Câu chuyện về tình bạn, sáng tạo và trò chơi điện tử — đẹp đẽ và đầy cảm xúc.', year: 2023, pages: 416, sources: { goodreads: { rating: 4.18, reviews: 920000 }, nyt: { rating: 4.7, reviews: 980 }, kirkus: { rating: 4.6, reviews: 280 }, librarything: { rating: 4.1, reviews: 12000 }, bookrot: { rating: 4.5, reviews: 60 }, tiki: { rating: 4.4, reviews: 800 } } },
        { title: 'Demon Copperhead', author: 'Barbara Kingsolver', genre: 'Literary Fiction', emoji: '🏔️', desc: 'Giải Pulitzer — phiên bản hiện đại David Copperfield trong bối cảnh Appalachian.', year: 2023, pages: 560, sources: { goodreads: { rating: 4.35, reviews: 465000 }, nyt: { rating: 4.9, reviews: 1500 }, kirkus: { rating: 4.7, reviews: 420 }, librarything: { rating: 4.4, reviews: 9800 }, bookrot: { rating: 4.8, reviews: 55 }, tiki: { rating: 4.5, reviews: 650 } } },
        { title: 'Intermezzo', author: 'Sally Rooney', genre: 'Literary Fiction', emoji: '♟️', desc: 'Tiểu thuyết mới nhất của Sally Rooney — về hai anh em và mối quan hệ phức tạp.', year: 2024, pages: 448, sources: { goodreads: { rating: 3.89, reviews: 380000 }, nyt: { rating: 4.3, reviews: 850 }, kirkus: { rating: 4.2, reviews: 310 }, librarything: { rating: 3.9, reviews: 7200 }, bookrot: { rating: 4.1, reviews: 70 }, tiki: { rating: 4.0, reviews: 1500 } } },
        { title: 'James', author: 'Percival Everett', genre: 'Historical Fiction', emoji: '🚣', desc: 'Kể lại Adventures of Huckleberry Finn từ góc nhìn Jim — sâu sắc và đầy nghệ thuật.', year: 2024, pages: 320, sources: { goodreads: { rating: 4.38, reviews: 210000 }, nyt: { rating: 4.8, reviews: 920 }, kirkus: { rating: 4.9, reviews: 380 }, librarything: { rating: 4.5, reviews: 6500 }, bookrot: { rating: 4.7, reviews: 42 }, tiki: { rating: 4.3, reviews: 320 } } },
        { title: 'The Women', author: 'Kristin Hannah', genre: 'Historical Fiction', emoji: '🎖️', desc: 'Câu chuyện về nữ y tá trong chiến tranh Việt Nam — cảm động và mạnh mẽ.', year: 2024, pages: 480, sources: { goodreads: { rating: 4.45, reviews: 720000 }, nyt: { rating: 4.6, reviews: 1100 }, kirkus: { rating: 4.4, reviews: 290 }, librarything: { rating: 4.3, reviews: 11000 }, bookrot: { rating: 4.5, reviews: 65 }, tiki: { rating: 4.6, reviews: 2100 } } },
    ],
    'self improvement books': [
        { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', emoji: '⚛️', desc: 'Phương pháp xây dựng thói quen tốt và loại bỏ thói quen xấu — best-seller toàn cầu.', year: 2018, pages: 320, sources: { goodreads: { rating: 4.37, reviews: 1200000 }, nyt: { rating: 4.5, reviews: 2200 }, kirkus: { rating: 4.3, reviews: 180 }, librarything: { rating: 4.2, reviews: 15000 }, bookrot: { rating: 4.4, reviews: 90 }, tiki: { rating: 4.8, reviews: 45000 } } },
        { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance / Psychology', emoji: '💰', desc: '20 bài học vượt thời gian về sự giàu có, lòng tham và hạnh phúc.', year: 2020, pages: 256, sources: { goodreads: { rating: 4.31, reviews: 890000 }, nyt: { rating: 4.4, reviews: 1800 }, kirkus: { rating: 4.2, reviews: 210 }, librarything: { rating: 4.1, reviews: 9500 }, bookrot: { rating: 4.3, reviews: 55 }, tiki: { rating: 4.7, reviews: 32000 } } },
        { title: 'Think Again', author: 'Adam Grant', genre: 'Psychology', emoji: '🔄', desc: 'Nghệ thuật tư duy lại — vì sao thay đổi suy nghĩ là sức mạnh, không phải điểm yếu.', year: 2021, pages: 320, sources: { goodreads: { rating: 4.15, reviews: 410000 }, nyt: { rating: 4.6, reviews: 1500 }, kirkus: { rating: 4.4, reviews: 250 }, librarything: { rating: 4.0, reviews: 7200 }, bookrot: { rating: 4.2, reviews: 40 }, tiki: { rating: 4.5, reviews: 18000 } } },
        { title: 'Ikigai', author: 'Héctor García & Francesc Miralles', genre: 'Philosophy', emoji: '🌸', desc: 'Bí mật sống thọ và hạnh phúc từ người Nhật — tìm mục đích sống.', year: 2017, pages: 208, sources: { goodreads: { rating: 3.95, reviews: 650000 }, nyt: { rating: 4.0, reviews: 900 }, kirkus: { rating: 3.8, reviews: 120 }, librarything: { rating: 3.7, reviews: 5200 }, bookrot: { rating: 3.9, reviews: 35 }, tiki: { rating: 4.6, reviews: 28000 } } },
        { title: 'The 5 AM Club', author: 'Robin Sharma', genre: 'Self-Help', emoji: '🌅', desc: 'Phương pháp dậy sớm để làm chủ buổi sáng và cuộc sống.', year: 2018, pages: 336, sources: { goodreads: { rating: 3.87, reviews: 320000 }, nyt: { rating: 3.9, reviews: 680 }, kirkus: { rating: 3.5, reviews: 90 }, librarything: { rating: 3.6, reviews: 4100 }, bookrot: { rating: 3.8, reviews: 28 }, tiki: { rating: 4.5, reviews: 22000 } } },
        { title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', emoji: '🎯', desc: 'Quy tắc tập trung sâu trong thế giới phân tâm — biến tập trung thành siêu năng lực.', year: 2016, pages: 296, sources: { goodreads: { rating: 4.18, reviews: 520000 }, nyt: { rating: 4.3, reviews: 1100 }, kirkus: { rating: 4.1, reviews: 160 }, librarything: { rating: 4.0, reviews: 8200 }, bookrot: { rating: 4.2, reviews: 50 }, tiki: { rating: 4.6, reviews: 15000 } } },
    ],
    'science fiction best rated': [
        { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', emoji: '🚀', desc: 'Một nhà khoa học tỉnh dậy một mình trên tàu vũ trụ với sứ mệnh cứu Trái Đất.', year: 2021, pages: 496, sources: { goodreads: { rating: 4.52, reviews: 980000 }, nyt: { rating: 4.7, reviews: 1800 }, kirkus: { rating: 4.6, reviews: 350 }, librarything: { rating: 4.5, reviews: 14000 }, bookrot: { rating: 4.8, reviews: 85 }, tiki: { rating: 4.7, reviews: 5200 } } },
        { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', emoji: '🏜️', desc: 'Kinh điển khoa học viễn tưởng về hành tinh sa mạc Arrakis và gia tộc Atreides.', year: 1965, pages: 688, sources: { goodreads: { rating: 4.26, reviews: 1100000 }, nyt: { rating: 4.8, reviews: 2500 }, kirkus: { rating: 4.7, reviews: 450 }, librarything: { rating: 4.3, reviews: 22000 }, bookrot: { rating: 4.6, reviews: 120 }, tiki: { rating: 4.5, reviews: 8500 } } },
        { title: 'The Three-Body Problem', author: 'Liu Cixin', genre: 'Hard Sci-Fi', emoji: '🌌', desc: 'Kiệt tác sci-fi Trung Quốc — khi nhân loại đối mặt với nền văn minh ngoài hành tinh.', year: 2014, pages: 400, sources: { goodreads: { rating: 4.06, reviews: 620000 }, nyt: { rating: 4.5, reviews: 1400 }, kirkus: { rating: 4.4, reviews: 280 }, librarything: { rating: 4.1, reviews: 11000 }, bookrot: { rating: 4.3, reviews: 75 }, tiki: { rating: 4.6, reviews: 12000 } } },
        { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Literary Sci-Fi', emoji: '☀️', desc: 'Nobel laureate viết về AI và tình yêu — nhìn thế giới qua mắt một người bạn nhân tạo.', year: 2021, pages: 320, sources: { goodreads: { rating: 3.82, reviews: 380000 }, nyt: { rating: 4.4, reviews: 1100 }, kirkus: { rating: 4.5, reviews: 320 }, librarything: { rating: 3.9, reviews: 8800 }, bookrot: { rating: 4.2, reviews: 60 }, tiki: { rating: 4.1, reviews: 3200 } } },
        { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', emoji: '🔴', desc: 'Phi hành gia bị bỏ lại trên sao Hỏa — dùng khoa học để sinh tồn.', year: 2014, pages: 384, sources: { goodreads: { rating: 4.40, reviews: 1050000 }, nyt: { rating: 4.6, reviews: 2100 }, kirkus: { rating: 4.5, reviews: 390 }, librarything: { rating: 4.4, reviews: 18000 }, bookrot: { rating: 4.7, reviews: 95 }, tiki: { rating: 4.6, reviews: 9800 } } },
        { title: 'Exhalation', author: 'Ted Chiang', genre: 'Short Stories / Sci-Fi', emoji: '💨', desc: 'Tuyển tập truyện ngắn thiên tài — mỗi câu chuyện là một vũ trụ tư duy.', year: 2019, pages: 352, sources: { goodreads: { rating: 4.30, reviews: 175000 }, nyt: { rating: 4.7, reviews: 850 }, kirkus: { rating: 4.8, reviews: 310 }, librarything: { rating: 4.4, reviews: 6000 }, bookrot: { rating: 4.6, reviews: 50 }, tiki: { rating: 4.3, reviews: 2800 } } },
    ],
    'vietnamese literature': [
        { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', genre: 'Classic / Adventure', emoji: '🦗', desc: 'Tác phẩm kinh điển văn học thiếu nhi Việt Nam — hành trình của chú Dế Mèn.', year: 1941, pages: 180, sources: { goodreads: { rating: 4.12, reviews: 8500 }, nyt: { rating: 0, reviews: 0 }, kirkus: { rating: 0, reviews: 0 }, librarything: { rating: 4.0, reviews: 320 }, bookrot: { rating: 0, reviews: 0 }, tiki: { rating: 4.8, reviews: 45000 } } },
        { title: 'Truyện Kiều', author: 'Nguyễn Du', genre: 'Classic Poetry', emoji: '🌺', desc: 'Kiệt tác thơ lục bát 3254 câu — biểu tượng văn hóa Việt Nam.', year: 1820, pages: 200, sources: { goodreads: { rating: 4.05, reviews: 5200 }, nyt: { rating: 0, reviews: 0 }, kirkus: { rating: 0, reviews: 0 }, librarything: { rating: 4.2, reviews: 180 }, bookrot: { rating: 0, reviews: 0 }, tiki: { rating: 4.9, reviews: 62000 } } },
        { title: 'Tắt Đèn', author: 'Ngô Tất Tố', genre: 'Realist Fiction', emoji: '🕯️', desc: 'Tiểu thuyết hiện thực phê phán — cuộc sống nông dân Việt Nam trước cách mạng.', year: 1937, pages: 240, sources: { goodreads: { rating: 3.92, reviews: 4800 }, nyt: { rating: 0, reviews: 0 }, kirkus: { rating: 0, reviews: 0 }, librarything: { rating: 3.8, reviews: 150 }, bookrot: { rating: 0, reviews: 0 }, tiki: { rating: 4.7, reviews: 38000 } } },
        { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', genre: 'Coming-of-age', emoji: '🎠', desc: 'Best-seller Việt Nam — hành trình ngọt ngào trở về tuổi thơ.', year: 2008, pages: 220, sources: { goodreads: { rating: 4.18, reviews: 12000 }, nyt: { rating: 0, reviews: 0 }, kirkus: { rating: 0, reviews: 0 }, librarything: { rating: 4.1, reviews: 280 }, bookrot: { rating: 0, reviews: 0 }, tiki: { rating: 4.9, reviews: 85000 } } },
        { title: 'Nỗi Buồn Chiến Tranh', author: 'Bảo Ninh', genre: 'War Literature', emoji: '🎖️', desc: 'Tác phẩm được dịch ra 20 ngôn ngữ — chiến tranh qua góc nhìn binh sĩ.', year: 1990, pages: 320, sources: { goodreads: { rating: 4.15, reviews: 18500 }, nyt: { rating: 4.3, reviews: 420 }, kirkus: { rating: 4.5, reviews: 180 }, librarything: { rating: 4.2, reviews: 850 }, bookrot: { rating: 4.4, reviews: 35 }, tiki: { rating: 4.8, reviews: 52000 } } },
        { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', genre: 'Romance', emoji: '👁️', desc: 'Câu chuyện tình buồn đẹp — đã được chuyển thể thành phim.', year: 1990, pages: 260, sources: { goodreads: { rating: 4.08, reviews: 9200 }, nyt: { rating: 0, reviews: 0 }, kirkus: { rating: 0, reviews: 0 }, librarything: { rating: 4.0, reviews: 220 }, bookrot: { rating: 0, reviews: 0 }, tiki: { rating: 4.9, reviews: 72000 } } },
    ],
    'mystery thriller top rated': [
        { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Psychological Thriller', emoji: '🤐', desc: 'Một phụ nữ bắn chồng rồi không nói nữa — bí ẩn đến trang cuối cùng.', year: 2019, pages: 336, sources: { goodreads: { rating: 4.07, reviews: 1350000 }, nyt: { rating: 4.3, reviews: 1900 }, kirkus: { rating: 4.1, reviews: 280 }, librarything: { rating: 4.0, reviews: 12000 }, bookrot: { rating: 4.2, reviews: 75 }, tiki: { rating: 4.5, reviews: 18000 } } },
        { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', emoji: '🔪', desc: 'Khi vợ mất tích — chồng trở thành nghi phạm. Twist kinh điển.', year: 2012, pages: 432, sources: { goodreads: { rating: 4.10, reviews: 2800000 }, nyt: { rating: 4.5, reviews: 2800 }, kirkus: { rating: 4.4, reviews: 420 }, librarything: { rating: 4.1, reviews: 25000 }, bookrot: { rating: 4.3, reviews: 110 }, tiki: { rating: 4.4, reviews: 15000 } } },
        { title: 'The Girl on the Train', author: 'Paula Hawkins', genre: 'Mystery', emoji: '🚂', desc: 'Cô gái trên tàu chứng kiến điều bí ẩn — và bị cuốn vào vụ mất tích.', year: 2015, pages: 336, sources: { goodreads: { rating: 3.89, reviews: 2200000 }, nyt: { rating: 4.2, reviews: 2100 }, kirkus: { rating: 4.0, reviews: 350 }, librarything: { rating: 3.8, reviews: 20000 }, bookrot: { rating: 3.9, reviews: 85 }, tiki: { rating: 4.3, reviews: 12000 } } },
        { title: 'The Maid', author: 'Nita Prose', genre: 'Mystery', emoji: '🧹', desc: 'Molly — cô hầu phòng khác biệt phát hiện xác chết trong khách sạn sang trọng.', year: 2022, pages: 320, sources: { goodreads: { rating: 3.78, reviews: 580000 }, nyt: { rating: 4.1, reviews: 980 }, kirkus: { rating: 4.0, reviews: 240 }, librarything: { rating: 3.7, reviews: 6800 }, bookrot: { rating: 3.9, reviews: 55 }, tiki: { rating: 4.2, reviews: 5500 } } },
        { title: 'In the Woods', author: 'Tana French', genre: 'Mystery', emoji: '🌲', desc: 'Thám tử điều tra vụ giết người ở Dublin — và ký ức kinh hoàng tuổi thơ trỗi dậy.', year: 2007, pages: 464, sources: { goodreads: { rating: 3.95, reviews: 450000 }, nyt: { rating: 4.4, reviews: 1200 }, kirkus: { rating: 4.5, reviews: 310 }, librarything: { rating: 4.0, reviews: 9500 }, bookrot: { rating: 4.3, reviews: 60 }, tiki: { rating: 4.1, reviews: 3200 } } },
        { title: 'Verity', author: 'Colleen Hoover', genre: 'Thriller', emoji: '📝', desc: 'Nhà văn phát hiện bản thảo bí mật — sự thật đáng sợ hơn tiểu thuyết.', year: 2018, pages: 314, sources: { goodreads: { rating: 4.26, reviews: 1800000 }, nyt: { rating: 4.0, reviews: 1500 }, kirkus: { rating: 3.8, reviews: 200 }, librarything: { rating: 4.0, reviews: 8500 }, bookrot: { rating: 4.1, reviews: 90 }, tiki: { rating: 4.4, reviews: 9800 } } },
    ],
};

// ── Fuzzy Search Engine ──
function searchBooks(query) {
    const q = query.toLowerCase().trim();

    // Direct category match
    for (const [key, books] of Object.entries(BOOKS_DB)) {
        if (q.includes(key) || key.includes(q)) return books;
    }

    // Fuzzy: search across all books
    const allBooks = Object.values(BOOKS_DB).flat();
    const results = allBooks.filter(book => {
        const searchable = `${book.title} ${book.author} ${book.genre} ${book.desc}`.toLowerCase();
        const words = q.split(/\s+/);
        return words.some(word => searchable.includes(word));
    });

    if (results.length > 0) return results;

    // Default: return a mix of top books from all categories
    return allBooks.sort((a, b) => calcTrustScore(b) - calcTrustScore(a)).slice(0, 6);
}

// ── Trust Score Calculation ──
function calcTrustScore(book) {
    const weights = { critic: 0.40, user: 0.35, awards: 0.15, recency: 0.10 };
    const sources = book.sources;

    // Critic score (Kirkus, NYT)
    let criticScores = [];
    if (sources.kirkus?.rating > 0) criticScores.push(sources.kirkus.rating);
    if (sources.nyt?.rating > 0) criticScores.push(sources.nyt.rating);
    const criticAvg = criticScores.length ? criticScores.reduce((a, b) => a + b, 0) / criticScores.length : 0;

    // User score (Goodreads, LibraryThing, Tiki)
    let userScores = [];
    if (sources.goodreads?.rating > 0) userScores.push(sources.goodreads.rating);
    if (sources.librarything?.rating > 0) userScores.push(sources.librarything.rating);
    if (sources.tiki?.rating > 0) userScores.push(sources.tiki.rating);
    const userAvg = userScores.length ? userScores.reduce((a, b) => a + b, 0) / userScores.length : 0;

    // Review volume bonus (more reviews = more trustworthy)
    const totalReviews = Object.values(sources).reduce((sum, s) => sum + (s.reviews || 0), 0);
    const volumeBonus = Math.min(totalReviews / 500000, 1) * 0.5; // max 0.5 bonus

    // Recency bonus
    const currentYear = 2026;
    const age = currentYear - book.year;
    const recencyScore = age <= 2 ? 5.0 : age <= 5 ? 4.5 : age <= 10 ? 4.0 : 3.5;

    const rawScore = (criticAvg * weights.critic + userAvg * weights.user + (criticAvg > 0 ? 4.5 : 3.5) * weights.awards + recencyScore * weights.recency);
    const finalScore = Math.min((rawScore / 5 * 100 + volumeBonus * 10), 99);

    return Math.round(finalScore);
}

// ── DOM Refs ──
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const crawlSection = document.getElementById('crawlSection');
const sourcesGrid = document.getElementById('sourcesGrid');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const crawlProgressFill = document.getElementById('crawlProgressFill');
const activeSourceCount = document.getElementById('activeSourceCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// ── State ──
let currentBooks = [];
let isSearching = false;

// ── Event Listeners ──
searchBtn.addEventListener('click', () => startSearch());
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') startSearch(); });

document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        searchInput.value = chip.dataset.query;
        startSearch();
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sortResults(btn.dataset.sort);
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ── Start Search ──
async function startSearch() {
    const query = searchInput.value.trim();
    if (!query || isSearching) return;

    isSearching = true;
    searchBtn.querySelector('.btn-text').style.display = 'none';
    searchBtn.querySelector('.btn-loader').style.display = 'block';

    // Reset
    resultsSection.style.display = 'none';
    crawlSection.style.display = 'block';
    crawlProgressFill.style.width = '0%';

    // Scroll to crawl section
    crawlSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Build source cards
    sourcesGrid.innerHTML = SOURCES.map((src, i) => `
        <div class="source-card" id="source-${src.id}" style="--source-color: ${src.color}; animation-delay: ${i * 0.08}s;">
            <div class="source-card-header">
                <div class="source-info">
                    <div class="source-logo">${src.icon}</div>
                    <div>
                        <div class="source-name">${src.name}</div>
                        <div class="source-type">${src.type}</div>
                    </div>
                </div>
                <div class="source-status waiting" id="status-${src.id}">
                    <span class="source-status-dot"></span>
                    <span>Chờ...</span>
                </div>
            </div>
            <div class="source-progress">
                <div class="source-progress-bar">
                    <div class="source-progress-fill" id="progress-${src.id}"></div>
                </div>
            </div>
            <div class="source-stats" id="stats-${src.id}" style="display:none;">
                <div class="source-stat">📖 <span class="source-stat-value" id="found-${src.id}">0</span> sách</div>
                <div class="source-stat">⭐ <span class="source-stat-value" id="rating-${src.id}">-</span> avg</div>
            </div>
            <div class="crawl-log" id="log-${src.id}"></div>
        </div>
    `).join('');

    // Get results
    currentBooks = searchBooks(query);

    // Animate crawl sequence
    await animateCrawl(currentBooks);

    // Show results
    displayResults(currentBooks, 'trust');

    isSearching = false;
    searchBtn.querySelector('.btn-text').style.display = 'block';
    searchBtn.querySelector('.btn-loader').style.display = 'none';
}

// ── Crawl Animation ──
async function animateCrawl(books) {
    const totalSources = SOURCES.length;
    let completedSources = 0;

    for (let i = 0; i < SOURCES.length; i++) {
        const src = SOURCES[i];
        const card = document.getElementById(`source-${src.id}`);
        const status = document.getElementById(`status-${src.id}`);
        const progress = document.getElementById(`progress-${src.id}`);
        const stats = document.getElementById(`stats-${src.id}`);
        const found = document.getElementById(`found-${src.id}`);
        const rating = document.getElementById(`rating-${src.id}`);
        const log = document.getElementById(`log-${src.id}`);

        // Activate
        card.classList.add('active');
        status.className = 'source-status crawling';
        status.innerHTML = '<span class="source-status-dot"></span><span>Đang crawl...</span>';
        activeSourceCount.textContent = i + 1;

        // Log messages
        addLog(log, `Kết nối ${src.name}...`, 'info');
        await sleep(200);
        addLog(log, `Đang tìm kiếm...`, 'info');

        // Animate progress
        let progressVal = 0;
        const progressInterval = setInterval(() => {
            progressVal = Math.min(progressVal + Math.random() * 15, 90);
            progress.style.width = progressVal + '%';
        }, 100);

        await sleep(src.delay);
        clearInterval(progressInterval);

        // Calculate source-specific data
        const booksWithSource = books.filter(b => b.sources[src.id]?.rating > 0);
        const avgRating = booksWithSource.length
            ? (booksWithSource.reduce((sum, b) => sum + b.sources[src.id].rating, 0) / booksWithSource.length).toFixed(1)
            : '—';

        // Complete
        progress.style.width = '100%';
        card.classList.remove('active');
        card.classList.add('done');
        status.className = 'source-status done';
        status.innerHTML = '<span class="source-status-dot"></span><span>Hoàn tất</span>';

        stats.style.display = 'flex';
        found.textContent = booksWithSource.length;
        rating.textContent = avgRating;

        addLog(log, `✓ Tìm thấy ${booksWithSource.length} kết quả`, 'success');

        completedSources++;
        crawlProgressFill.style.width = ((completedSources / totalSources) * 100) + '%';
    }

    await sleep(500);
}

function addLog(container, message, type) {
    const line = document.createElement('div');
    line.className = 'crawl-log-line';
    line.innerHTML = `<span class="log-${type}">› ${message}</span>`;
    container.prepend(line);
    while (container.children.length > 3) container.removeChild(container.lastChild);
}

// ── Display Results ──
function displayResults(books, sortBy) {
    sortResults(sortBy || 'trust');
    resultsSection.style.display = 'block';
    resultsCount.textContent = `(${books.length} sách)`;

    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function sortResults(sortBy) {
    let sorted = [...currentBooks];

    switch (sortBy) {
        case 'trust':
            sorted.sort((a, b) => calcTrustScore(b) - calcTrustScore(a));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.sources.goodreads?.rating || 0) - (a.sources.goodreads?.rating || 0));
            break;
        case 'reviews':
            sorted.sort((a, b) => {
                const totalA = Object.values(a.sources).reduce((s, v) => s + (v.reviews || 0), 0);
                const totalB = Object.values(b.sources).reduce((s, v) => s + (v.reviews || 0), 0);
                return totalB - totalA;
            });
            break;
    }

    renderBooks(sorted);
}

function renderBooks(books) {
    resultsGrid.innerHTML = books.map((book, i) => {
        const trustScore = calcTrustScore(book);
        const scoreClass = trustScore >= 85 ? 'excellent' : trustScore >= 70 ? 'good' : 'average';
        const totalReviews = Object.values(book.sources).reduce((s, v) => s + (v.reviews || 0), 0);

        const sourceBadges = Object.entries(book.sources)
            .filter(([_, data]) => data.rating > 0)
            .map(([srcId, data]) => {
                const src = SOURCES.find(s => s.id === srcId);
                return `<div class="source-badge">
                    <span class="source-badge-icon">${src?.icon || '📖'}</span>
                    <span class="source-badge-rating">${data.rating}</span>
                    <span class="source-badge-name">${src?.name || srcId}</span>
                </div>`;
            }).join('');

        return `
        <div class="book-card" style="animation-delay: ${i * 0.1}s" onclick="openBookModal(${i})">
            <div class="trust-score">
                <div class="trust-score-value ${scoreClass}">${trustScore}</div>
                <div class="trust-score-label">Trust</div>
            </div>
            <div class="book-card-top">
                <div class="book-cover">${book.emoji}</div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-genre">${book.genre}</div>
                </div>
            </div>
            <div class="book-sources">${sourceBadges}</div>
            <div class="book-stats">
                <div class="book-stat">⭐ <span class="book-stat-value">${book.sources.goodreads?.rating || '—'}</span> GR</div>
                <div class="book-stat">💬 <span class="book-stat-value">${formatNumber(totalReviews)}</span> reviews</div>
                <div class="book-stat">📅 <span class="book-stat-value">${book.year}</span></div>
                <div class="book-stat">📄 <span class="book-stat-value">${book.pages}</span> trang</div>
            </div>
        </div>`;
    }).join('');
}

// ── Modal ──
function openBookModal(index) {
    const book = currentBooks[index] || currentBooks.sort((a, b) => calcTrustScore(b) - calcTrustScore(a))[index];
    if (!book) return;

    const trustScore = calcTrustScore(book);
    const totalReviews = Object.values(book.sources).reduce((s, v) => s + (v.reviews || 0), 0);

    const sourceItems = Object.entries(book.sources)
        .filter(([_, data]) => data.rating > 0)
        .sort((a, b) => b[1].rating - a[1].rating)
        .map(([srcId, data]) => {
            const src = SOURCES.find(s => s.id === srcId);
            return `<div class="modal-source-item">
                <div class="modal-source-left">
                    <span class="modal-source-icon">${src?.icon || '📖'}</span>
                    <span class="modal-source-name">${src?.name || srcId}</span>
                </div>
                <div class="modal-source-right">
                    <span class="modal-source-rating">⭐ ${data.rating}</span>
                    <span class="modal-source-reviews">${formatNumber(data.reviews)} reviews</span>
                </div>
            </div>`;
        }).join('');

    modalContent.innerHTML = `
        <div class="modal-book-header">
            <div class="modal-cover">${book.emoji}</div>
            <div class="modal-book-info">
                <h2>${book.title}</h2>
                <p class="modal-author">${book.author} · ${book.year} · ${book.pages} trang</p>
                <div class="modal-trust-score">
                    <div class="modal-trust-value">${trustScore}</div>
                    <div class="modal-trust-meta">
                        <strong>Trust Score™</strong><br>
                        ${formatNumber(totalReviews)} reviews từ ${Object.values(book.sources).filter(s => s.rating > 0).length} nguồn
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3>📝 Giới thiệu</h3>
            <p class="modal-description">${book.desc}</p>
        </div>

        <div class="modal-section">
            <h3>📊 Xếp hạng theo nguồn</h3>
            <div class="modal-sources-list">${sourceItems}</div>
        </div>

        <div class="modal-affiliate-links">
            <button class="affiliate-btn primary" onclick="window.open('https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}', '_blank')">
                📗 Xem trên Goodreads
            </button>
            <button class="affiliate-btn" onclick="window.open('https://tiki.vn/search?q=${encodeURIComponent(book.title)}', '_blank')">
                🛒 Mua trên Tiki
            </button>
            <button class="affiliate-btn" onclick="window.open('https://www.fahasa.com/catalogsearch/result/?q=${encodeURIComponent(book.title)}', '_blank')">
                📕 Mua trên Fahasa
            </button>
        </div>
    `;

    modalOverlay.style.display = 'flex';
    requestAnimationFrame(() => {
        modalOverlay.classList.add('visible');
    });
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('visible');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ── Utilities ──
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// ── Make openBookModal global ──
window.openBookModal = openBookModal;
