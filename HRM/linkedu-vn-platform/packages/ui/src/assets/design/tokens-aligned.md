# Tokens Aligned — Stitch ↔ App

**Date:** 2026-08-19 | **Source:** `packages/web/src/styles/tokens.css`

## Light theme

| Token | Before (app) | After (Stitch-aligned) | Stitch HEX |
|-------|-------------|----------------------|------------|
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.365 0.776 294.6)` | `#004bca` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.365 0.776 294.6)` | `#004bca` |
| `--surface-alt` | n/a | `oklch(0.981 0.031 290.4)` | `#f9f9ff` |
| `--status-blue` | `oklch(0.93 0.08 240)` | `oklch(0.922 0.114 264.7)` | `#dbeafe` |
| `--status-green` | `oklch(0.93 0.09 150)` | `oklch(0.962 0.157 155.2)` | `#dcfce7` |
| `--status-yellow` | `oklch(0.95 0.09 90)` | `oklch(0.971 0.274 104.1)` | `#fef9c3` |
| `--status-red` | `oklch(0.95 0.09 25)` | `oklch(0.921 0.102 20.1)` | `#fee2e2` |
| `--status-purple` | `oklch(0.95 0.09 290)` | `oklch(0.934 0.125 308.7)` | `#f3e8ff` |
| `--status-orange` | `oklch(0.95 0.09 40)` | `oklch(0.976 0.058 80.3)` | `#fff7ed` |

## Unchanged (already aligned)

Spacing (4px grid), radius (`0.625rem`), typography (`text-sm/base`, `font-mono`),
`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--destructive`,
`--chart-*`, and the dark-theme block.

## Status foregrounds

Fgs were derived from Stitch's darker text variants (`#166534`, `#991b1b`,
`#6b21a8`, `#1e40af`, `#9a3412`) so badges read at WCAG AA on their pastel fills.

## Verification

- `npx tsc --noEmit` passes (EXIT=0).
- No component hardcodes a color — all references go through `var(--*)`.
- Dark theme block left untouched; its values are internally consistent and
  Stitch did not ship dark screens.