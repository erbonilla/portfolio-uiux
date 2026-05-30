# Portfolio Improvements Roadmap v2.0

**Project:** Edgar Bonilla G. · `(ed)studio` portfolio (PWA)
**Date:** May 29, 2026
**Supersedes:** `portfolio-improvements-roadmap-v1_1.md`
**Stack:** Next.js + Vercel

This is a **delta** over v1.1. Carried items still apply; new and changed items below.

## 1. New requirements landed in v2.0

| Requirement | Status |
|---|---|
| Fully responsive PWA (320→1440px+, installable) | In scope, P0 |
| Next.js + Vercel (replaces Vite) | In scope, P0 |
| Recruiter Hub mode switching at launch (real reflow) | In scope, P0 |
| Replace view-mode emojis with icons (Lucide `Zap`/`Search`) | In scope, P0 |
| Footer social icons (LinkedIn, Facebook, Instagram) | In scope — **blocked on real URLs** |

## 2. P0 (updated)

| Item | Recommendation |
|---|---|
| Stack migration | Next.js App Router; deploy to Vercel; `next/font`, `next/image`, typed manifest. |
| PWA | `@ducanh2912/next-pwa`; manifest 192/512 + maskable; theme `#FF4F18`, bg `#050505`; offline fallback optional. |
| Responsive | Mobile-first, `clamp()` type, `minmax()` grids, safe-area insets, ≥44px targets; QA no overflow 320→1440px. |
| Recruiter Hub mode switch | `data-view-mode` reflow (Quick Scan ↔ Deep Dive), not a label toggle; keyboard + announced. |
| Emoji → icon | Lucide `Zap` (Quick Scan), `Search` (Deep Dive), `aria-hidden`. |
| Footer socials | Simple Icons, monochrome, labeled, ≥44px; render only entries with real URLs. **Blocked** until URLs given. |
| Carried P0 | Fake links, contact truthfulness, Radix focus trap, audit count fix, asset re-encode + typo rename. |

## 3. Blocked items (need input — not guessed)

| Item | Needed from owner |
|---|---|
| Social links | Real LinkedIn, Facebook, Instagram URLs. Until provided, the footer omits any placeholder entry rather than shipping a dead link. |
| App icon set | Source (ed)studio wordmark export to generate 192/512/maskable/apple-touch icons. |
| Contact endpoint | mailto confirmed (`erbonilla@outlook.com`); upgrade path (Formspree/Resend/Vercel function) TBD. |
| Case-study destinations | Internal `/work/*` pages vs external marketing-site links. |

## 4. Carried (P1/P2)

Case-study depth (Osteóplus, Atlan), range thumbnails, Recruiter Hub content (30s/5m views, evidence checklist), tools-strip accuracy (now Next.js is correct), OG images, SEO/sitemap, MDX, privacy-conscious analytics, Figma token sync. See v1.1 §3–§4 for detail.

## 5. Copy improvements
Unchanged from v1.1 §5 (hero role clarity, story refinement, contact phrasing).

## 6. Launch checklists (delta)

**Content**
- [ ] Real LinkedIn / Facebook / Instagram URLs (blocked).
- [ ] App icons generated from wordmark.
- [ ] mailto confirmed; view-mode copy "Optimize the page layout for the user's available time" present.
- [ ] Carried content checklist (v1.1 §7).

**Technical**
- [ ] `next build` succeeds; deploys to Vercel.
- [ ] Manifest valid; PWA installable; service worker active in prod.
- [ ] No horizontal overflow 320/375/768/1024/1440.
- [ ] View-mode reflow verified + keyboard-operable.
- [ ] View-mode uses icons, not emojis.
- [ ] Footer socials labeled; no dead links.
- [ ] Tools strip lists Next.js (true), not Vite.
- [ ] typecheck, lint, unit, Playwright + axe pass.

## 7. Phases

**Phase 1 — Responsive PWA homepage on Next.js/Vercel.** Migrate; normalize assets; responsive pass; PWA manifest + SW; Recruiter Hub mode switch + footer socials (if URLs ready); deploy preview.
**Phase 2 — Case-study depth.** `/work/osteoplus`, `/work/atlan`; metadata + OG; wired contact.
**Phase 3 — Range galleries.** Replace placeholders; filters if needed.
**Phase 4 — System maturity.** Figma↔code token sync; token export; component-kit expansion.
