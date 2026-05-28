# Codebase Alignment Analysis — Bazi v5.1 Sprint

## Executive Summary
This report presents a read-only codebase audit of the **Aura Cafe (FnB-Container-Caffe)** repository to align it with **Bazi v5.1 Sprint** requirements. 
Key findings show that while the site is structurally sound, there are major FOUT (Flash of Unstyled Text) risks due to missing font preloads (R1), brand naming inconsistencies ("Gold" labels used for Silver/Chrome colors) in `brand-guideline.html` (R2), and critical color leaks of banned Thổ (Earth) and Hỏa (Fire) elements across the admin dashboard portals (R3). Actionable, line-specific changes are detailed below.

---

## 1. Font Preloading & FOUT Optimization (R1)

### 1.1 Font Scan & Discovery
A complete scan was performed across all 12 root HTML files:
*   `index.html`
*   `menu.html`
*   `checkout.html`
*   `success.html`
*   `failure.html`
*   `loyalty.html`
*   `track-order.html`
*   `kds.html`
*   `table-reservation.html`
*   `about-us.html`
*   `contact.html`
*   `brand-guideline.html`

In **all 12 root files**, the three core Google Fonts (**Cormorant Garamond**, **Space Grotesk**, and **JetBrains Mono**) are loaded dynamically via:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'">
```
And in some files (such as `brand-guideline.html`), they are loaded directly with `rel="stylesheet"`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 1.2 Identified Issues
1.  **Missing `<link rel="preload">` tags**: None of the 12 HTML pages contain any font preloading tags. Preloading is highly recommended because fonts loaded via CSS stylesheets (even with `display=swap`) suffer from a delay while the browser downloads the stylesheet, parses it, and then requests the font files.
2.  **FOUT and Reflow Risk**: Because these fonts are loaded with `display=swap`, the browser will initially render the text using system fallbacks (like `Times New Roman` or standard `sans-serif`) and then flash to the custom brand typography once loaded. For a luxury cafe brand like AURA, this causes noticeable visual jitter.

### 1.3 Actionable Recommendations
To achieve FOUT optimization, the following preload tags must be inserted in the `<head>` of all 12 root HTML pages, immediately after the `<meta>` tags and **before** any stylesheet imports:

```html
<!-- preconnect to font servers -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- preload critical font files (WOFF2 format) -->
<link rel="preload" href="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmW5slhv3kqkk9yQStepq297QT_w.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQoQDjQSkFsp0FOBQYElyycToq5A.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v18/tGLy8u1col2tc7b9_93AMsS8fknP-asG.woff2" as="font" type="font/woff2" crossorigin>
```

*(Note: The above woff2 URLs correspond to the regular 400 weights of the respective families served by Google Fonts. Using `crossorigin` is mandatory for font preloads.)*

---

## 2. Brand Swatch Uniformity (R2)

### 2.1 Aesthetic Shift: Bazi v5.1 Chrome/Silver Alignment
The brand tokens (`css/brand-tokens.css`) already map the variable names like `--aura-gold-master` and `--gradient-gold` to Bazi-compliant Silver/Chrome elements (`#C9D6DF` and `#E8EEF3`). However, `brand-guideline.html` is riddled with textual references to "Gold", "Luxurious metallic gold", and "gold foil", which violates the Bazi v5.1 Chrome/Silver aesthetic requirement. 

### 2.2 Table of Required Text Replacements in `brand-guideline.html`
Below are the exact lines containing the word "Gold" or associated gold references and the recommended replacements to shift the branding terminology to Bazi-compliant Kim (Metal) naming:

| Line Number | Existing Content snippet | Proposed Replacement (Chrome/Silver) | Rationale |
|---|---|---|---|
| **590** | `<h3 style="color:var(--gold); margin-bottom:16px;">Gold Accents</h3>` | `<h3 style="color:var(--gold); margin-bottom:16px;">Chrome & Silver Accents</h3>` | Shift heading description to match the actual Silver hex code. |
| **594** | `<div class="meta-chip"><strong>Gold Master</strong><code>--aura-gold-master · #C9D6DF</code></div>` | `<div class="meta-chip"><strong>Chrome Master</strong><code>--aura-chrome-master · #C9D6DF</code></div>` | Rename color swatch and variable name to align with Chrome. |
| **598** | `<div class="meta-chip"><strong>Gold Electric</strong><code>--aura-gold-electric · #E8EEF3</code></div>` | `<div class="meta-chip"><strong>Chrome Electric</strong><code>--aura-chrome-electric · #E8EEF3</code></div>` | Rename color swatch and variable to Chrome. |
| **602** | `<div class="meta-chip"><strong>Gold Metallic</strong><code>--aura-gold-metallic · #C9D6DF</code></div>` | `<div class="meta-chip"><strong>Chrome Metallic</strong><code>--aura-chrome-metallic · #C9D6DF</code></div>` | Align naming with Silver/Chrome metallic aesthetics. |
| **606** | `<div class="meta-chip"><strong>Gold Matte</strong><code>--aura-gold-matte · #3A6B80</code></div>` | `<div class="meta-chip"><strong>Steel Matte</strong><code>--aura-steel-matte · #3A6B80</code></div>` | Rename variable to Steel/Kim. |
| **610** | `<div class="meta-chip"><strong>Amber Neon</strong><code>--aura-gold-amber · #FFB300</code></div>` | `<div class="meta-chip"><strong>Aura Neon Glow</strong><code>--aura-neon-glow · #6B9FB8</code></div>` | **CRITICAL COLOR LEAK**: `#FFB300` is yellow/Amber (Earth). Replace with Chrome Light `#6B9FB8` (Kim). |
| **708** | `Neon kim vàng (Gold Electric) cho signage lớn` | `Neon Chrome Sáng (Chrome Electric) cho signage lớn` | Update brand signage specification to Chrome. |
| **715** | `<p>"AURA CAFE" neon LED gold #E8EEF3 trên mặt container` | `<p>"AURA CAFE" neon LED chrome #E8EEF3 trên mặt container` | Align text descriptor with the Chrome color. |
| **723** | `<p class="spec">Depth: 2mm · Infill: #C9D6DF gold foil</p>` | `<p class="spec">Depth: 2mm · Infill: #C9D6DF chrome foil</p>` | Convert "gold foil" emblem print spec to "chrome foil". |
| **795** | `in gold foil emblem mặt trước + wordmark mặt sau.` | `in chrome foil emblem mặt trước + wordmark mặt sau.` | Align packaging specifications with Silver/Chrome. |
| **845** | `<p class="spec">Cotton: 100% · GSM: 220 · Stitch: gold #C9D6DF</p>` | `<p class="spec">Cotton: 100% · GSM: 220 · Stitch: silver #C9D6DF</p>` | Convert uniform stitch specification from gold to silver. |
| **855** | `thêu emblem gold metallic 4cm.` | `thêu emblem chrome metallic 4cm.` | Align cap embroidery spec with Chrome. |
| **857** | `<p class="spec">Wool: merino · Thread: metallic gold</p>` | `<p class="spec">Wool: merino · Thread: metallic silver</p>` | Update uniform thread specifications. |
| **893** | `dimmable 30-100%. Spot mảnh hướng xuống bàn, neon line gold` | `dimmable 30-100%. Spot mảnh hướng xuống bàn, neon line chrome` | Convert interior design neon details to Chrome. |

---

## 3. Admin Dashboard Color Leak Cleanup (R3)

### 3.1 Audited Files & Discovery
A comprehensive audit of the 8 portal files in the `/admin` folder was completed:
1.  `admin/launch-monitor.html`
2.  `admin/dashboard.html`
3.  `admin/login.html`
4.  `admin/loyalty-dashboard.html`
5.  `admin/orders.html`
6.  `admin/pos.html`
7.  `admin/reservations.html`
8.  `admin/staff.html`

We identified multiple **banned colors** (Gold/Thổ, Cam đỏ/Hỏa, Nâu đất/Thổ) which violate Bazi v5.1 rules (Thổ khắc Thủy; Hỏa hao Thủy).

### 3.2 List of exact color leaks by file

#### File: `admin/launch-monitor.html`
*   **Banned Color (Gold/Thổ)**: `#FFD700` and dark bronze `#2e2510`
    *   *Line 83*: `.tier-gold    { background:#2e2510; color:#FFD700; }`
*   **Banned Color (Cam đỏ/Hỏa)**: `#F87171` (red)
    *   *Line 16*: `--red:     #F87171;`
    *   *Line 108*: `.auth-err { font-size:.75rem; color:var(--red); margin-top:8px; display:none; }`
*   **Banned Color (Nâu đất/Thổ)**: `#CD7F32` (Bronze) and `#4a2e1a` (dark brown)
    *   *Line 81*: `.tier-bronze  { background:#4a2e1a; color:#CD7F32; }`
*   **Color Variable Mismatch**:
    *   *Line 15*: `--amber:   #FBBF24;` (Yellow/Earth).
    *   *Line 269*: `dot.style.background = '#FBBF24';` (yellow status indicator).

#### File: `admin/dashboard.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#FF5252` (red)
    *   *Line 16*: `--red:#FF5252;`
    *   *Line 62*: `.kpi-change.down{color:var(--red)}`
    *   *Line 90*: `.badge-cancel{color:var(--red);background:rgba(255,82,82,.1)}`
*   **Mismatched/Misleading Variable Names**:
    *   *Line 15*: `--gold:#C9D6DF; --gold-e:#E8EEF3; --amber:#6B9FB8; --orange:#3A6B80;`
    *   *Note*: The actual hex codes used here are fully compliant Silver/Chrome values, but the variables are named after banned elements (`gold`, `amber`, `orange`). These should be cleaned up.

#### File: `admin/login.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#FF5252` (red)
    *   *Line 26*: `--red: #FF5252;`
    *   *Line 158*: `color: var(--red);`
*   **Mismatched Variable Names**:
    *   *Lines 20-23*: `--gold: #C9D6DF; --gold-e: #E8EEF3; --amber: #6B9FB8; --gold-dim: rgba(201,214,223,0.15);`
    *   *Note*: Naming must be refactored to align with Silver/Chrome terms.

#### File: `admin/loyalty-dashboard.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#FFA500` (orange)
    *   *Line 16*: `--success: #22C55E; --warn: #FFA500; --danger: #EF4444;`
    *   *Line 314*: `{ label: 'Đã dùng', ... backgroundColor: 'rgba(255,165,0,.4)', borderColor: '#FFA500', ... }`
*   **Banned Color (Nâu đất/Thổ)**: `#A5703F` (Bronze/Brown)
    *   *Line 256*: `const TIER_COLOR = { bronze: '#A5703F', silver: '#9CA8B5', gold: '#C9D6DF', platinum: '#E8EEF3' };`
*   **Banned Color (Cam đỏ/Hỏa)**: `#EF4444` (red)
    *   *Line 16*: `--danger: #EF4444;`
*   **Mismatched Variable Names**:
    *   *Line 15*: `--muted: #6B7280; --text: #C9D6DF; --gold: var(--aura-chrome-light);`

#### File: `admin/orders.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#FF9800` (orange)
    *   *Line 18*: `--warning:  #FF9800;`
*   **Banned Color (Cam đỏ/Hỏa)**: `#f44336` (red)
    *   *Line 19*: `--danger:   #f44336;`
*   **Banned Color (Cam đỏ/Hỏa)**: inline style `red`
    *   *Line 335*: `tbody.innerHTML = '<tr><td colspan="7" style="color:red;text-align:center;padding:40px;">`

#### File: `admin/pos.html` & `admin/staff.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#EF4444` (red)
    *   *pos.html Line 11 & staff.html Line 10*: `--danger:#EF4444`
*   **Mismatched Variable Names**:
    *   *pos.html Line 11 & staff.html Line 10*: `--gold:#C9D6DF; --eg:#E8EEF3; --amber:#6B9FB8;`

#### File: `admin/reservations.html`
*   **Banned Color (Cam đỏ/Hỏa)**: `#FF5252` (red)
    *   *Line 15*: `--red:#FF5252;`
    *   *Lines 63 & 65 & 239*: references to `var(--red)` for cancelled badges and error states.
*   **Mismatched Variable Names**:
    *   *Line 14*: `--gold:#C9D6DF; --gold-e:#E8EEF3; --amber:#6B9FB8; --orange:#3A6B80;`

---

### 3.3 Proposed Bazi-Aligned Color Replacements
To completely purge color leaks in the Admin system, we recommend mapping these status values and branding colors to Bazi-compliant parameters:
*   **Navy (Thủy/Water)**: Primary buttons and headers should transition to deep navy: `#0A1A2E` (background) and `#1A2A4E` (active selections).
*   **Chrome/Silver (Kim/Metal)**: Text highlights, dashboard indicators, and tier markings should transition to `#E8EEF3`, `#C9D6DF`, and `#6B9FB8`.
*   **Forest Green (Mộc/Wood)**: Use Forest `#2D5A3D` or `#4A7C59` for success states, active badges, and stable KPIs.
*   **Slate/Muted Steel (Kim-Thủy/Metal-Water)**: Replace warning yellow/orange and danger red with Slate/Charcoal `#3A6B80` (Steel-blue) and muted blue-gray `#4B5563` to convey warnings/cancellations without leaking banned elements.

#### Replacement Table for Admin Banned Colors:

| File Name | Line No. | Banned Snippet / Color | Proposed Bazi-Aligned Snippet | Rationale |
|---|---|---|---|---|
| `admin/launch-monitor.html` | 83 | `.tier-gold { background:#2e2510; color:#FFD700; }` | `.tier-gold { background:#1E293B; color:#C9D6DF; }` | Replace banned gold/brown with Slate background and Silver text. |
| `admin/launch-monitor.html` | 81 | `.tier-bronze { background:#4a2e1a; color:#CD7F32; }` | `.tier-bronze { background:#0F172A; color:#94A3B8; }` | Replace Earth bronze with Steel-Blue Slate tones. |
| `admin/launch-monitor.html` | 15-16 | `--amber: #FBBF24; --red: #F87171;` | `--amber: #6B9FB8; --red: #3A6B80;` | Replace banned yellow/red with Steel-Blue and Slate variables. |
| `admin/launch-monitor.html` | 269 | `dot.style.background = '#FBBF24';` | `dot.style.background = '#6B9FB8';` | Use Chrome-light instead of Amber for yellow states. |
| `admin/loyalty-dashboard.html` | 16 | `--warn: #FFA500; --danger: #EF4444;` | `--warn: #4A7C59; --danger: #3A6B80;` | Map warnings to Mộc (Wood) and danger/cancels to Slate/Steel (Metal). |
| `admin/loyalty-dashboard.html` | 256 | `bronze: '#A5703F'` (TIER_COLOR) | `bronze: '#94A3B8'` (Steel) | Convert Earth Bronze to Steel Gray. |
| `admin/orders.html` | 18-19 | `--warning: #FF9800; --danger: #f44336;` | `--warning: #6B9FB8; --danger: #3A6B80;` | Replace warm orange/red warning and danger with cool metals. |
| `admin/orders.html` | 335 | `style="color:red;"` | `style="color:var(--aura-chrome-matte);"` | Replace hardcoded red error with brand Matte Slate `#3A6B80`. |
| `admin/pos.html` | 11 | `--danger:#EF4444` | `--danger:#3A6B80` | Align POS error/danger colors with Slate. |
| `admin/reservations.html` | 15 | `--red:#FF5252;` | `--red:#3A6B80;` | Re-map reservations red variable to Slate. |

---

## 4. Synthesis of Variable Cleanup
Across `dashboard.html`, `login.html`, `pos.html`, `reservations.html`, and `staff.html`, the variable names in `:root` should be explicitly renamed to avoid the words `gold`, `amber`, and `orange`. 

### Proposed Refactored `:root` Block:
```css
:root {
    --bg: #1A1A2E;
    --card: #1A1A1A;
    --text: #F5F5F5;
    --muted: #8A8A8A;
    
    /* Bazi v5.1 Chrome & Silver Renaming */
    --chrome-silver: #C9D6DF;       /* Formerly --gold */
    --chrome-light: #E8EEF3;        /* Formerly --gold-e / --eg */
    --chrome-steel: #6B9FB8;        /* Formerly --amber */
    --chrome-slate: #3A6B80;        /* Formerly --orange */
    
    /* Status indicators */
    --success: #2D5A3D;             /* Forest Green (Mộc) */
    --danger: #4B5563;              /* Muted Slate Gray (Steel) */
}
```
Implementing this unified `:root` refactoring across all admin files will permanently resolve legacy name mismatches while remaining perfectly true to the required Bát Tự foundations.
