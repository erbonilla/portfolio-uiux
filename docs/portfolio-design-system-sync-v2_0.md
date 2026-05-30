# Vanguard Portfolio UI System — Design System Sync v2.0

**Owner:** Edgar Bonilla G. · `(ed)studio`
**Date:** May 29, 2026
**Supersedes:** `portfolio-design-system-sync-v1_8.md`
**Stack:** Next.js (App Router)

This document is a **delta** over v1.8. Everything in v1.8 §4–§15 (token set, usage rules, typography, contrast, radius, motion, icon policy, component scope, Tailwind policy, token-name mapping) still applies unless overridden below.

## 1. System name
Unchanged: **Vanguard Portfolio UI System**.

## 2. Token additions for v2.0

```css
:root {
  /* responsive fluid type (hero) */
  --display-hero: clamp(2.5rem, 8vw, 5rem);
  --display-section: clamp(1.75rem, 4vw, 3rem);

  /* safe-area insets for fixed header/footer (PWA / notched devices) */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);

  /* PWA brand surfaces */
  --pwa-theme-color: var(--color-brand-500);   /* #FF4F18 */
  --pwa-bg-color: var(--color-neutral-950);     /* #050505 */

  /* responsive gutter */
  --gutter: 16px;          /* phone default */
}
@media (min-width: 768px)  { :root { --gutter: 32px; } }
@media (min-width: 1024px) { :root { --gutter: 56px; } }
```

`--nav-h` / `--nav-h-mobile`, status colors, `--font-mono`, elevation, z-index, and `[data-radius]` modes carry over from v1.8 unchanged.

## 3. View-mode contract (new)

The Recruiter Hub Panel 01 sets a document-level attribute consumed by section CSS:

```css
/* default = deep (full portfolio) */
[data-view-mode="quick"] .tile-teaser,
[data-view-mode="quick"] .story-longform,
[data-view-mode="quick"] .tile-roles,
[data-view-mode="quick"] .range-card-desc { display: none; }
```

Rules:
- `data-view-mode` lives on `<main>` (or `<html>`), values `quick | deep`, default `deep`.
- Only visibility/layout reflow — never hides content the page can't otherwise reach (Deep Dive remains the complete, default state).
- Reduced-motion safe (pure display/layout, no required animation).

## 4. Footer social icons (new)

| Token / rule | Value |
|---|---|
| Icon source | Simple Icons React (`SiLinkedin`, `SiFacebook`, `SiInstagram`) |
| Color | `currentColor` → `--text-muted`; hover/focus `--text-brand` |
| Size | 20–24px glyph inside a ≥44×44px hit area |
| Radius | `--radius-control-md` on the hit area if it has a hover surface |
| Accessible name | required (`aria-label` + visually-hidden text) |
| Network brand colors | not used by default (monochrome to match footer chrome); only if intentional |

Do not introduce per-network brand colors as new tokens. The footer reads as one monochrome material system (v1.8 §7 color rules).

## 5. Responsive system (new)

- Mobile-first; fluid via `clamp()` and `minmax()` grids.
- Named breakpoints: 600 / 768 / 1024 / 1440 (matches Site Shell §8.1 + the range-grid spec).
- Container caps at `--container-max` (1320px) ≥1440px.
- Fixed header/footer pad with `--safe-top` / `--safe-bottom`.
- Tap targets ≥ 44×44px.
- No horizontal overflow 320→1440px (QA-enforced).

## 6. Icon policy delta

- View-mode control uses **Lucide `Zap` (Quick Scan)** and **Lucide `Search` (Deep Dive)** — never emoji.
- Footer socials use **Simple Icons** components.
- Everything else per v1.8 §10 (Cursor still has no Simple Icons mark — self-hosted glyph or omit).

## 7. Tools strip note

The stack is now **Next.js** (not Vite). The tools strip listing Next.js is therefore truthful; keep it. Remove Vite if a v1.8 draft added it.

## 8. QA checklist delta

Carry v1.8 §14, plus:
- [ ] `--display-hero` / `--display-section` scale smoothly with no breakpoint jumps.
- [ ] Safe-area insets applied to fixed header/footer.
- [ ] `data-view-mode` reflow works and hides nothing unreachable in Deep Dive.
- [ ] Footer social icons monochrome, labeled, ≥44px targets, real destinations.
- [ ] Manifest `theme_color` / `background_color` match `--pwa-theme-color` / `--pwa-bg-color`.
- [ ] No horizontal overflow at 320/375/768/1024/1440.

## 9. Changelog

| Version | Date | Change |
|---|---|---|
| `v1.7` | 2026-05-29 | Apparel→portfolio rename; softer radius/motion; Lucide/Simple Icons; Vite target. |
| `v1.8` | 2026-05-29 | Added status/mono/elevation/z-index tokens, `[data-radius]` modes, token-name mapping. |
| `v2.0` | 2026-05-29 | Next.js target. Added fluid type, safe-area, PWA, view-mode, and footer-social tokens/rules. View-mode icons (Lucide Zap/Search) replace emojis. Tools-strip note flipped to Next.js. |
