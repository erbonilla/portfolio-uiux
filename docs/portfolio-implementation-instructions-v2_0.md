# Portfolio Implementation Instructions v2.0

**Owner:** Edgar Bonilla G. · `(ed)studio`
**Date:** May 29, 2026
**Supersedes:** `portfolio-implementation-instructions-v1_8.md`
**Stack:** Next.js (App Router) + React + TypeScript + Tailwind v4, deployed to Vercel
**Status:** Implementation-ready

## 0. What changed in v2.0

| # | Change | Driver |
|---|---|---|
| 1 | **Stack → Next.js + Vercel** (was Vite) | Explicit project decision; PWA + Vercel alignment. |
| 2 | **Full responsive PWA** | New requirement — installable, offline-capable, fluid 320→1440px+. |
| 3 | **Recruiter Hub view-mode switching is now in scope for launch** | New requirement — Quick Scan ↔ Deep Dive must actually reflow the page. |
| 4 | **Emojis replaced with icons** in the view-mode control | New requirement — Lucide icons, not `⚡`/`🔍`. |
| 5 | **Footer social icons** — LinkedIn, GitHub, Facebook, Instagram | New requirement, resolved with real URLs 2026-06-01. |
| 6 | Asset normalization (JPEG-as-PNG) | Carried from v1.8 (still required). |

## 1. Responsive PWA requirements

### 1.1 Breakpoint model
Mobile-first. Fluid by default; named breakpoints only where layout must change.

| Range | Target | Layout rules |
|---|---|---|
| 320–599px | Phone | Single column. Hamburger nav. Hero stacks: name → positioning → CTAs → meta → portrait. Range grids 1-up. CTAs full-width-friendly. |
| 600–767px | Large phone / small tablet | Range grids 2-up; hero still stacked. |
| 768–1023px | Tablet | 8-col grid; nav crowding safeguard (tighten link gap/size so 6 targets + Hub pill don't collide); hero may stay stacked or go 2-col at the top of the range. |
| 1024–1439px | Desktop | 12-col; hero two-column (text left, portrait right); range grids 3-up. |
| ≥1440px | Wide | Container caps at `--container-max` (1320px), centered. |

### 1.2 Fluidity rules
- Use `clamp()` for hero display type so headings scale without a dozen breakpoints, e.g. `font-size: clamp(2.5rem, 8vw, 5rem)`.
- Use CSS grid `repeat(auto-fit, minmax(…, 1fr))` for range grids where exact column counts aren't mandated, so they reflow continuously.
- No fixed pixel widths on content containers; use `max-width` + fluid padding (`--gutter` scales by breakpoint).
- Respect iOS safe areas: `viewport-fit=cover` (set in layout) + `padding: env(safe-area-inset-*)` on the fixed header and footer.
- Tap targets ≥ 44×44px on touch.
- Test at 320px (smallest common), 360/390 (modern phones), 768, 1024, 1280, 1440.

### 1.3 PWA requirements
- `manifest.webmanifest` via `src/app/manifest.ts` (name, icons 192/512 + maskable, `theme_color #FF4F18`, `background_color #050505`, `display standalone`).
- Service worker via Serwist (`@serwist/next`, enabled in production only). Production builds use `next build --webpack`; dev stays on Turbopack with the service worker disabled.
- App icons + Apple touch icon under `public/icons/`, generated from the (ed)studio wordmark.
- Optional `/offline` fallback route.
- `theme-color` and `apple-mobile-web-app-*` via Next `viewport`/`metadata` exports.
- Installability verified in Chrome/Edge (desktop + Android) and "Add to Home Screen" (iOS Safari).

## 2. Recruiter Hub — view-mode switching (Panel 01, now launch scope)

The control must **actually reflow the page**, not just toggle a label. See `portfolio-recruiter-hub-spec-v2_0.md` for full panel detail; the implementation contract:

### 2.1 Control
A two-option segmented control (radiogroup) labeled **Adaptable view mode** with the helper line "Optimize the page layout for the user's available time."

| Option | Icon (Lucide) | Label |
|---|---|---|
| Quick Scan | `Zap` | `30s Quick Scan` |
| Deep Dive | `Search` | `5m Deep Dive` |

**Emoji replacement is explicit:** render `<Zap aria-hidden />` and `<Search aria-hidden />` from `lucide-react` — do **not** use `⚡` or `🔍`. Each option has a visible text label, so the icons are decorative (`aria-hidden="true"`).

### 2.2 Behavior
The active mode is shared app state (React context, no browser storage). It drives a `data-view-mode="quick" | "deep"` attribute on `<main>` (or a context consumed by sections):

| Surface | Quick Scan | Deep Dive |
|---|---|---|
| Case-study teasers | Collapse to one line | Full teaser |
| Story long-form | Hidden | Shown |
| Tile body | Headline + status chip + CTA only | + role rows, evidence captions |
| Range card descriptions | Hidden (title + tag only) | Shown |

Implement via CSS driven by the data attribute (cheap, reduced-motion safe), e.g. `[data-view-mode="quick"] .tile-teaser { display: none; }`. Announce the active mode (`aria-live="polite"`). Arrow-key navigation within the radiogroup.

### 2.3 State shape
```ts
type ViewMode = 'quick' | 'deep';
// ViewModeContext provides { mode, setMode }. Default: 'deep' (full portfolio is the baseline).
```

## 3. Footer social icons (new)

Add a social row to `SiteFooter` with **LinkedIn, GitHub, Facebook, Instagram**, using Simple Icons React components.

```tsx
import { SiLinkedin, SiGithub, SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
```

| Network | Icon | href (content/socials.ts) |
|---|---|---|
| LinkedIn | `SiLinkedin` | `https://www.linkedin.com/in/edgarbonillag/` |
| GitHub | `SiGithub` | `https://github.com/erbonilla` |
| Facebook | `SiFacebook` | `https://www.facebook.com/oxygenozar` |
| Instagram | `SiInstagram` | `https://www.instagram.com/coacherbonilla` |

Requirements:
- Each link is an icon-only control → needs an accessible name: `aria-label="Edgar Bonilla on LinkedIn"` (+ `<VisuallyHidden>` text or label).
- `target="_blank" rel="noopener noreferrer"`.
- Icons inherit `currentColor` (`--text-muted`, hover → `--text-brand`); do not hardcode brand-network colors unless intentional.
- Tap target ≥ 44×44px.
- Keep the build-time guard that omits any entry whose `href` is still the placeholder. That preserves the no-fake-links rule if a future social entry is drafted before its real URL exists.

```ts
// src/content/socials.ts
export type Social = { id: string; label: string; href: string };
export const socials: Social[] = [
  { id: 'linkedin',  label: 'Edgar Bonilla on LinkedIn', href: 'https://www.linkedin.com/in/edgarbonillag/' },
  { id: 'github',    label: 'Edgar Bonilla on GitHub', href: 'https://github.com/erbonilla' },
  { id: 'facebook',  label: 'Oxygeno Coaching on Facebook', href: 'https://www.facebook.com/oxygenozar' },
  { id: 'instagram', label: 'Coach Edgar Bonilla on Instagram', href: 'https://www.instagram.com/coacherbonilla' },
];
// Render only entries where href !== 'TODO'.
```

## 4. Carried requirements (still apply)

Skip link + `<main id="main-content">`; one `<h1>`; semantic `<h2>`/`<h3>`; no `href="#"` on cards; Radix Dialog drawer with focus trap; mail-first contact (or wired endpoint); icon migration off the Iconify CDN; Motion for animation with reduced-motion guard; tools strip honesty (**Vite is no longer the stack — list Next.js, since it is now true**); asset re-encode + typo rename in one commit.

> Note: the tools-strip honesty rule now flips — Next.js *is* the real stack in v2.0, so listing it is correct. Remove Vite if it was added in a v1.8 draft.

## 5. Component map (App Router)

Server components by default; mark interactive ones `'use client'`: `SiteHeader`, `MobileMenu`, `RecruiterHubDrawer` + all `recruiter-hub/*`, anything using Motion or state. `HeroSection`, `StoryPanel`, `ToolStrip`, `SiteFooter` can be server components (footer social links are plain anchors).

## 6. Accessibility acceptance criteria (testable)

Carried from v1.8, plus:
- View-mode radiogroup: keyboard-operable, arrow-key nav, active mode announced, icons `aria-hidden`.
- Footer social links: accessible names, keyboard reachable, visible focus, ≥44px targets.
- Responsive: no horizontal overflow at 320/375/768/1024/1440; content reachable at 200% zoom.
- PWA: manifest valid; installable; `theme-color` present.

## 7. Performance acceptance criteria

Carried from v1.8, plus: Next image optimization for hero + screenshots; route-level code splitting; service worker caches static assets; Lighthouse PWA category passes; performance ≥ 90 mobile.

## 8. Production backlog (delta)

| Priority | Item | Decision? |
|---:|---|---|
| P0 | Provide real LinkedIn/Facebook/Instagram URLs | **Yes — blocked** |
| P0 | Wire view-mode reflow (not just label toggle) | No |
| P0 | Replace view-mode emojis with Lucide icons | No |
| P0 | PWA manifest + icons + service worker | No |
| P0 | Responsive pass 320→1440px | No |
| P0 | Re-encode assets, fix extensions + typo | Yes |
| P1 | Generate app icon set from (ed)studio wordmark | Yes |
| P1 | First complete case-study page | Yes |

## 9. Definition of done

1. Installable, responsive PWA; no horizontal overflow 320→1440px.
2. Recruiter Hub view-mode control switches Quick Scan ↔ Deep Dive and visibly reflows the page; uses Lucide icons, not emojis; keyboard-operable.
3. Footer shows LinkedIn/Facebook/Instagram with accessible names and real destinations (or omits any entry without a real URL — never a dead link).
4. Tokens centralized; tools strip truthful (Next.js).
5. Nav, drawer, mobile menu pass keyboard testing.
6. Assets re-encoded, correctly named, loading in preview.
7. Build, typecheck, lint, unit, e2e + axe pass.
8. Deployed to Vercel; manifest + service worker verified in production.
