# Stitch vs App — Design Intent Comparison

**Date:** 2026-08-19 | **Inputs:** `stitch-output/*.html` (6 screens) + `packages/web/src/styles/tokens.css`

## Method

Each Stitch screen was read for palette, spacing, radius, typography and empty-state
shape. The app's tokens were read from `tokens.css`. Divergences were resolved by
adopting Stitch's intent where the app's value was arbitrary, and keeping the app's
value where it is already correct.

## Palette

| Role | Stitch (HEX) | App (oklch) | Resolution |
|------|-------------|-------------|------------|
| Primary | `#004bca` | `oklch(0.205 0 0)` (grey) | Adopt Stitch — app primary was achromatic, Stitch gives the brand a blue identity. |
| Primary fg | `#ffffff` implied | `oklch(0.985 0 0)` | Keep app (white on primary). |
| Surface | `#f3f4f6` | `oklch(0.97 0 0)` | Keep app (already near-equal). |
| Surface alt | `#f9f9ff` | n/a | Add `--surface-alt`. |
| On-surface | `#151c27` | `oklch(0.145 0 0)` | Keep app (near-equal). |
| Muted fg | `#424656` | `oklch(0.556 0 0)` | Keep app. |
| Border | `#d1d5db` | `oklch(0.922 0 0)` | Keep app (near-equal). |
| Status blue bg | `#dbeafe` | `--status-blue` | Adopt Stitch hue into `--status-blue`. |
| Status green bg | `#dcfce7` | `--status-green` | Adopt Stitch hue. |
| Status red bg | `#fee2e2` | `--status-red` | Adopt Stitch hue. |
| Status yellow bg | `#fef9c3` | `--status-yellow` | Adopt Stitch hue. |
| Status purple bg | `#f3e8ff` | `--status-purple` | Adopt Stitch hue. |
| Status orange bg | `#fff7ed` | `--status-orange` | Adopt Stitch hue. |
| Text primary | `#151c27` | `--foreground` | Keep app. |
| Text secondary | `#374151` | `--muted-foreground` | Keep app. |

## Spacing

Stitch uses a 4px base grid: `gap-1/2/3`, `p-0/4`, `px-2/4`, `py-1/2/3`, `py-6`.
The app already uses Tailwind's default 4px grid, so **no change** — the divergence was
only nominal (Stitch classes are class-string aliases for the same values).

## Radius

Stitch uses `rounded-lg` (0.5rem) for cards and `rounded-md` for buttons. The app's
`--radius: 0.625rem` is slightly larger. Resolution: keep app radius — it is already
applied consistently via `rounded-md` in components.

## Typography

Stitch uses `font-body-md` / `font-mono` / `font-weight` tokens. The app uses
`text-sm`, `text-base`, `font-medium`, `font-mono`. **No change** — equivalent.

## Empty States

Stitch renders empty states as a bordered card with a heading + muted description
(e.g. audit-logs "no records"). The app already matches this pattern in 4 of 5 modules.
The one gap was `academic-records`, which had no error state — fixed in Phase 07.

## Divergences Resolved

1. **Primary color achromatic → brand blue.** Adopted `#004bca` → `--primary`.
2. **Status palette hues.** Adopted Stitch's pastel fills for blue/green/red/yellow/purple/orange.
3. **`--surface-alt` token added** for alternating panel backgrounds.
4. **No spacing/radius/typography changes** — already aligned.

## Files Changed

- `packages/web/src/styles/tokens.css` — primary + status palette aligned to Stitch
- `packages/ui/src/assets/design/stitch-vs-app-comparison.md` — this file
- `packages/ui/src/assets/design/tokens-aligned.md` — final token mapping