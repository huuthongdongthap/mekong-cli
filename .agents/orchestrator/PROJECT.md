# Project: Bazi v5.1 Sprint UI/UX & Brand Alignment

## Architecture
- Repository: `FnB-Container-Caffe`
- 12 Root HTML Pages (index.html, menu.html, checkout.html, success.html, failure.html, loyalty.html, track-order.html, kds.html, table-reservation.html, about-us.html, contact.html, brand-guideline.html)
- 8 Admin pages in `admin/` folder (launch-monitor.html, dashboard.html, login.html, loyalty-dashboard.html, orders.html, pos.html, reservations.html, staff.html)
- Main Stylesheet: `css/brand-tokens.css` and local stylesheets.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Font Preloading (R1) | Add link preconnect and preload tags to 12 root HTML files | none | DONE |
| 2 | Brand Swatch Uniformity (R2) | Replace 'Gold' text & purge Amber leaks in brand-guideline.html | M1 | DONE |
| 3 | Admin Clean Up (R3) | Purge Fire/Earth color leaks & mismatch variables in 8 admin pages | M2 | DONE |
| 4 | Verification & Quality | Run Vite build, Jest tests, and rg scans to verify zero leaks | M3 | IN_PROGRESS |

## Interface Contracts
- Style compatibility: Admin pages must use Bazi v5.1-compliant silver, chrome, navy, wood green, and steel/slate colors. Banned colors must be completely removed.
- Font compatibility: All root HTML pages must pre-fetch Cormorant Garamond, Space Grotesk, and JetBrains Mono fonts.

## Code Layout
- HTML pages at root: `FnB-Container-Caffe/*.html`
- Admin pages: `FnB-Container-Caffe/admin/*.html`
- CSS / Brand assets: `FnB-Container-Caffe/css/*`
