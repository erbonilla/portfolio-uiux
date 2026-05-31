# Product / Project DNA — `(ed)studio` Portfolio

> The single-page genome of the product: who it's for, what it believes, how it
> behaves, and the non-negotiables that keep every future decision honest. If a
> proposed change can't be traced back to something on this page, question it.

**Product:** `(ed)studio` — the personal UI/UX portfolio of **Edgar Bonilla G.**
**Owner / contact:** erbonilla@outlook.com
**Repo:** https://github.com/erbonilla/portfolio-uiux.git
**DNA version:** v1.0 · **Date:** 2026-05-31
**Status:** Built & green (Phases 2–11); Phase 12 (deploy) pending — owner action.
**Authored by:** Product Design (team-level synthesis from the v2.0 doc set)

---

## 1. One-line identity

A fully-responsive, installable **PWA portfolio** that proves Edgar can take
accessible health, wellness, fitness, sports, and lifestyle interfaces *from
structure to shipped*, and lets a hiring manager operate it on their own terms.

**Elevator:** "Product UI/UX designer for high-pressure, everyday use — clinical
clarity, endurance-grade legibility, and tokenized systems that stay readable as
products grow."

---

## 2. Why this exists (purpose & job-to-be-done)

| Reader | Their job | What the product must do |
|---|---|---|
| **Hiring manager / recruiter** (primary) | Decide, fast, whether Edgar fits a role | Be scannable in 30s, deep in 5m; let them switch modes themselves; never make them chase dead links or invented metrics |
| **Design lead / peer** | Judge craft, systems thinking, a11y rigor | Show a real token layer, real reflow, real WCAG 2.2 AA behavior — not screenshots of claims |
| **Prospective client** | Gauge domain fit (digital health, sport) | Frame work around reader, constraint, and decision |

**Core JTBD:** *"When I'm evaluating Edgar under time pressure, help me get exactly
the depth I need — no more, no less — and trust everything I read."*

---

## 3. Positioning & brand DNA

- **Name:** `(ed)studio`. Lowercase, parenthetical, quiet confidence.
- **Positioning statement:** *UI/UX designer for accessible health, wellness,
  fitness, sports, and lifestyle products.*
- **Promise:** "I take product interfaces from structure to shipped responsive
  screens, with visual systems that stay readable as products grow."
- **Specialization edge:** domains where **clear interaction design supports
  trust, safety, and momentum** — post-care confusion, endurance fatigue, glare,
  cognitive load.
- **Proof posture:** WCAG 2.2 AA as a *baseline* (not a feature), plain-language
  decisions, and product stories that expose problem → tradeoff → interface logic.
- **Locale:** Based in Costa Rica · Open to roles · Spanish and English.

**Brand feel:** dark glass is canonical. Calm, rigorous, specific. Energy comes
from a single brand ember (`#FF4F18`) against near-black (`#050505`), not from
decoration.

---

## 4. Design principles (the spine)

1. **Honesty over polish.** No invented metrics, no `href="#"`, no dead social
   links, no toggle that only swaps its own label. The tools strip says
   *Next.js* because that's true. (See §9 — these are non-negotiable.)
2. **Clarity under pressure.** Every screen is designed for the worst reading
   condition first: small targets, fatigue, glare, stress, motion.
3. **Reader controls depth.** The same page serves a 30-second scan and a
   5-minute read — the *reader* chooses, the page genuinely reflows.
4. **Systems, not screens.** Semantic tokens only in components; primitives are
   reference values aliased by semantics. Design and code stay in lockstep.
5. **Accessibility is structural.** AA contrast, visible focus everywhere, status
   never by color alone, reduced-motion respected, no horizontal overflow
   320→1440px. Built in, not bolted on.
6. **Mobile-first & installable.** Fluid by default (`clamp()`, `minmax()`),
   safe-area aware, ≥44px targets, works offline.

---

## 5. Signature behavior — the Recruiter Hub

The product's defining interaction and its strongest proof-of-craft. A persistent
`RECRUITER HUD` pill opens a right-side **Hiring Manager Hub** drawer (Radix
Dialog: focus trap, ESC, scrim, focus return). Five panels, each *demonstrating*
the discipline it describes:

| # | Panel | Reader-facing value | The honesty bar it clears |
|---|---|---|---|
| 01 | **View mode** (Quick Scan ↔ Deep Dive) | Optimize the page for the time you have | Must *actually reflow* the page via `data-view-mode`, not relabel |
| 02 | **Reader notes** (persona annotations) | Add notes per persona | Real DOM-text annotations, not faked overlays |
| 03 | **Radius preview** (live tokenizer) | See the system retheme live | Mutates real `:root[data-radius]` CSS variables |
| 04 | **Launch checklist** (system audit) | Review launch checks | Count, rows, and progress bar must agree; real or dated snapshot |
| 05 | **Request a session** (booking) | Reach out | Opens real `mailto:` until an endpoint is wired |

**View-mode contract** (the heart of principle #3):

```ts
type ViewMode = 'quick' | 'deep';   // default: 'deep' — full portfolio is the baseline
// data-view-mode on <main>; CSS-driven, reduced-motion safe
```

| Surface | Quick Scan (`quick`) | Deep Dive (`deep`) |
|---|---|---|
| Case-study teaser | one line | full teaser |
| Tile body | headline + status chip + CTA | + role rows + evidence |
| Story long-form | hidden | shown |
| Range card description | hidden (title + tag only) | shown |

Quick Scan only ever *hides* what Deep Dive can still reach — it never strands
content. Control is a keyboard-operable radiogroup; active mode announced
(`aria-live="polite"`); icons (Lucide `Zap` / `Search`) are decorative, never
emoji.

---

## 6. Content DNA

The work is presented with restraint — **named reader, named constraint, named
decision, zero unverified outcomes.**

**Case studies (launch subset):**
- **Osteóplus** — *Digital health · Concept · Solo · 2026.* "Turning a medical
  repository into a recovery dashboard." Reframed a content-heavy portal around
  large touch targets, plain-language guidance, and a booking path that doesn't
  depend on calling the clinic.
- **Atlan Performance** — *Sports & endurance · Built · Solo · 2026.* "Open-water
  telemetry for tired eyes." Cadence and cardiovascular signals translated into
  high-contrast pacing views built for glare, fatigue, and motion.

**Approach (how the work gets made):** Clinical rigor → Endurance science →
Tokenized systems.

**Range (breadth, framed honestly as focus areas, not fabricated projects):**
studio mark & logo system, typography poster series, editorial layouts, Atlan
launch campaign, brand motion stills, marketing banners & OG images.

**Voice:** clear, rigorous, calm, specific. Standalone action language on
buttons/links. Contact explains its mail-first behavior before submission. No
public em dashes; reduced slogan cadence (see `ux-writing-audit.md`).

---

## 7. System DNA (tokens, theme, motion)

**System name:** Vanguard Portfolio UI System. Token layer is implemented in
full (all primitives + semantics); only the launch-subset components are built.

- **Theming:** dark glass canonical (`<html data-theme="dark">`); light is the
  accessible companion. Radius modes `default / rounded / no-corner-radius` back
  the Live Tokenizer.
- **Brand surfaces:** `--pwa-theme-color: #FF4F18`, `--pwa-bg-color: #050505`.
- **Fluid type:** `--display-hero: clamp(2.5rem, 8vw, 5rem)`,
  `--display-section: clamp(1.75rem, 4vw, 3rem)`.
- **Responsive gutter:** 16px → 32px (≥768) → 56px (≥1024); container caps at
  `--container-max` 1320px ≥1440px.
- **Safe areas:** `--safe-top` / `--safe-bottom` on fixed header/footer.
- **Breakpoints:** 600 / 768 / 1024 / 1440.
- **Icons:** Lucide (UI) + Simple Icons (brand/social). Adobe & OpenAI self-hosted
  (Simple Icons v13 dropped them); brand badge sits on default surface for AA.
- **Motion:** Motion library, expressive easing, always reduced-motion guarded.
- **Naming:** Figma slash names → CSS custom properties (`color/brand/500` →
  `--color-brand-500`). Semantic tokens only in components — never raw hex.

---

## 8. Technical DNA

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| Styling | Tailwind v4 + CSS custom-property token layer |
| Components | Radix primitives (Dialog, Progress, Radio Group, VisuallyHidden) |
| PWA | **Serwist** (`@serwist/next`) — webpack build, SW prod-only |
| Animation | `motion` v12 |
| Hosting | Vercel |
| Package mgr | pnpm (via Corepack) |
| Quality gate | `assets:normalize → typecheck → lint → test (vitest) → build → test:e2e (Playwright + axe WCAG 2.2 AA)` |

**Build-tool truth:** `dev` runs Turbopack; **`build` runs `next build --webpack`**
because stable Serwist injects a webpack config and does *not* support Turbopack.
Server components by default; `'use client'` only where interactive (header,
mobile menu, the whole Recruiter Hub, anything stateful or animated).

---

## 9. Non-negotiables (the immune system)

These are the rules that protect the brand's central promise — honesty. Treat any
violation as a launch blocker.

1. The tools strip lists **Next.js, not Vite** (it's true now).
2. The view-mode toggle **actually reflows** the page.
3. The audit panel's **count matches its rows** and the progress bar.
4. **No `href="#"` and no dead links** — including socials.
5. **No invented metrics** or unverified outcomes, anywhere public.
6. Icon-only controls have accessible names; **status never by color alone**;
   visible focus everywhere; reduced-motion respected; **no horizontal overflow
   320→1440px**.

---

## 10. Constraints & open blockers (proceed via fallback, never via fakery)

| Blocker | Fallback in place | Resolved by |
|---|---|---|
| **B1 — Social URLs** (LinkedIn/Facebook/Instagram) | `socials.ts` keeps `href:'TODO'`; footer renders only real entries via `visibleSocials` | Owner-supplied real URLs |
| **B2 — App-icon source** | Placeholder set from `(ed)studio-primary.svg` | Final wordmark export |
| **B3 — Contact endpoint** | `mailto:erbonilla@outlook.com` confirmed | Formspree/Resend/Vercel fn (deferred) |
| **B4 — Case-study destinations** | Internal `/work/[slug]` stubs | Decision: internal pages vs external links |

Asset reality note: screenshots are JPEG data normalized via `pnpm
assets:normalize`; the `screenshoot` typo is fixed; only
`(ed)studio-text-primary.svg` is a true vector.

---

## 11. Roadmap DNA (sequence of intent)

- **Phase 1 ✅** — Responsive PWA homepage on Next.js/Vercel.
- **Phase 2** — Case-study *depth*: full `/work/osteoplus`, `/work/atlan`,
  metadata + OG, wired contact.
- **Phase 3** — Range galleries: real thumbnails replace decorative previews.
- **Phase 4** — System maturity: Figma↔code token sync, token export, full
  component kit + the 12 deferred patterns.
- **Phase 12 (now)** — Deploy: push to GitHub + import to Vercel (owner action).

---

## 12. Success signals (how we know the DNA is expressed)

- A recruiter forms a fit judgment in **≤30s on Quick Scan**, with a real path to
  5-minute depth on demand.
- **Lighthouse:** PWA category passes; performance ≥90 mobile; installable;
  `theme-color` present.
- **Zero** honesty violations (§9) at every release.
- **axe / WCAG 2.2 AA** clean; full keyboard operability of nav, drawer, mobile
  menu, and view-mode control.
- No horizontal overflow at 320 / 375 / 768 / 1024 / 1440; content reachable at
  200% zoom.

---

## 13. Source-of-truth map

| Doc | Authority for |
|---|---|
| `docs/portfolio-action-plan-v2_0.md` | The executable, phased build plan |
| `docs/portfolio-premium-uiux-design-system.md` | Token architecture, theming, motion, full component kit |
| `docs/portfolio-design-system-sync-v2_0.md` | v2.0 delta: fluid type, safe-area, PWA, view-mode, socials |
| `docs/portfolio-implementation-instructions-v2_0.md` | Responsive model, view-mode contract, footer socials, DoD |
| `docs/portfolio-recruiter-hub-spec-v2_0.md` | The 5 panels, drawer, Panel 01 reflow |
| `docs/portfolio-improvements-roadmap-v2_0.md` | Priorities, blockers, post-launch phases |
| `docs/ux-writing-audit.md` | Voice, copy decisions, remaining copy backlog |
| `CLAUDE.md` | Working agreement, key decisions, guardrails |

> When in doubt, cite the doc + section. This DNA file summarizes intent; the docs
> above hold the binding detail.
