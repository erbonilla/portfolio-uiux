# Portfolio Documentation Index v2.0

**Owner:** Edgar Bonilla G. · `(ed)studio`
**Prepared:** May 29, 2026
**Supersedes:** `README-portfolio-docs-v1_8.md`
**Stack:** Next.js (App Router) + React + TypeScript + Tailwind v4 → Vercel (responsive PWA)

## What v2.0 covers

This set applies four new project requirements on top of the v1.8 baseline:

1. **Fully responsive PWA** — installable, offline-capable, fluid 320→1440px+.
2. **Next.js + Vercel** — replaces the prior Vite recommendation (explicit decision; PWA/Vercel alignment).
3. **Recruiter Hub mode switching at launch** — `30s Quick Scan` ↔ `5m Deep Dive` that **actually reflows the page**, with emojis replaced by **Lucide icons** (`Zap`, `Search`).
4. **Footer social icons** — LinkedIn, Facebook, Instagram (Simple Icons), labeled, monochrome.

## Files

| File | Purpose |
|---|---|
| `portfolio-framework-tooling-setup-v2_0.md` | Next.js + Vercel stack, PWA wiring, reproducible setup, file tree, testing, deploy. |
| `portfolio-implementation-instructions-v2_0.md` | Responsive + PWA + view-mode + footer-socials specs, component map, acceptance criteria, DoD. |
| `portfolio-design-system-sync-v2_0.md` | Delta tokens: fluid type, safe-area, PWA, view-mode contract, footer-social rules. |
| `portfolio-recruiter-hub-spec-v2_0.md` | Panel 01 promoted to launch scope with real reflow; emoji→icon. |
| `portfolio-improvements-roadmap-v2_0.md` | Updated P0s, blocked items, phased plan. |
| `product-dna-v1_0.md` | Product/Project DNA — one-page synthesis of identity, audience, principles, signature behavior, system/tech DNA, non-negotiables, and success signals. |

The v1.8 docs remain valid for anything not overridden here (full token set, contrast rules, token-name mapping, accessibility detail).

## Requirements coverage

| Requirement | Where | Status |
|---|---|---|
| Fully responsive, all screen sizes | impl §1.1–1.2, design-sync §5 | ✅ specified |
| PWA | impl §1.3, tooling §6–§7, design-sync §2 | ✅ specified |
| Next.js + Vercel | tooling v2.0 (whole doc) | ✅ specified |
| Recruiter Hub mode switching | impl §2, hub §3 | ✅ specified (real reflow) |
| Emoji → icons | impl §2.1, hub §3.1, design-sync §6 | ✅ Lucide `Zap`/`Search` |
| Footer social icons | impl §3, design-sync §4 | ✅ LinkedIn, GitHub, Facebook, and Instagram wired |
| Documentation as Markdown | this set | ✅ delivered |

## Blocked (needs owner input — not guessed)

- **Social URLs** are resolved as of 2026-06-01. The footer still renders only entries with real URLs, so future placeholders will not create dead links.
- **App icon source** (the (ed)studio wordmark export) to generate the PWA icon set.
- **Contact endpoint** finalization. The code is Formspree-ready via `NEXT_PUBLIC_FORMSPREE_ID` and falls back to `mailto:` when unset.
