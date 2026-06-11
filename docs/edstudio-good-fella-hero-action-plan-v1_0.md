# `(ed)studio` — Good Fella Hero Action Plan v1.0

**Doc:** `edstudio-good-fella-hero-action-plan-v1_0.md` · **Status:** Executable · **Date:** 2026-06-10
**Framework:** mirrors `docs/portfolio-action-plan-v2_0.md` — phased, checklist-driven, gate-per-phase, evidence-labelled.
**Companion spec (authority for code detail):** `edstudio-good-fella-hero-implementation-v1_0.md`
**Repo:** `erbonilla/portfolio-uiux` · **Branch:** `feature/good-fella-inspired-hero` · **Live:** <https://portfolio-uiux-smoky.vercel.app/>

---

## 0. How to use this plan

- Execute phases **in order**; each phase ends with a **gate** that must pass before the next begins.
- Every claim carries a label: **Documented** (in spec/design system), **Verified** (checked against live site or design-system file 2026-06-10), **Recommended**, **Expected**, or **Owner decision**.
- Conventions in force (Verified, CLAUDE.md): semantic tokens only · no raw hex in components (Three.js palette = single documented exception) · no `href="#"` · no dead links · no invented metrics · WCAG 2.2 AA · active states never color-only · branch first, no direct commits to `main` · push only when asked.
- Standard gate command (run at the end of every code phase):

```bash
pnpm typecheck && pnpm lint && pnpm test
```

- Full gate (Phases 9–12): add `pnpm build` and `CI=1 pnpm test:e2e`.

**Scope summary (Verified against live 2026-06-10):** 7 alignment moves, no foundational rebuild — (1) hero copy correction, (2) left-aligned editorial hero, (3) orange-default primary CTA, (4) compact header chrome, (5) universal full-screen menu, (6) active square markers, (7) all inside Vanguard tokens.

---

## Phase 0 — Preflight & token verification

**Goal:** Confirm every token the change set relies on actually exists. No code yet.
**Files read:** `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/typography.css`, `docs/portfolio-design-system-sync-v2_0.md`

- [ ] 0.1 Confirm core tokens (Verified in design system — expect present): `--surface-control-brand`, `--surface-control-brand-hover`, `--text-on-brand`, `--icon-on-brand`, `--text-brand`, `--border-brand`, `--state-focus-ring`, `--surface-bg-brand`, `--surface-bg-overlay`, `--static-white`, `--static-black`, `--radius-control-md`, `--radius-surface-md`.
- [ ] 0.2 Confirm sync-v2.0 hero-scale tokens (Documented in sync v2.0; **not independently re-verified** — this is the one real preflight risk): `--surface-bg-hero`, `--display-hero` + `ts-display-hero` helper, `--motion-duration-hero`, `--motion-duration-layout`, `--motion-duration-hover`, `--motion-easing-expressive`, `--blur-glass`, `--nav-h` / `--nav-h-mobile`, safe-area vars, `--container-max`.
- [ ] 0.3 If any 0.2 token is missing → add it to `tokens.css` as a sync-v2.0 delta with a code comment citing the sync doc section. **Do not invent new primitives.**
- [ ] 0.4 Confirm `hero-rise` and `portrait-settle` keyframes exist (Expected — current hero animates); note their location.
- [ ] 0.5 Confirm `ButtonLink` exposes `data-variant` on its root (Expected — spec's `:global([data-variant])` selectors depend on it). If not, plan the smallest additive change.
- [ ] 0.6 Confirm `Drawer` props: `open`, `onOpenChange`, `side`, `size`, `title`, `trigger` (Expected per spec §8.1). Note current `DrawerSize` union.
- [ ] 0.7 Confirm `aboutCopy.positioning` exists in `src/content/**` (Expected — lead paragraph reuses it; no new claims).

**Gate 0:** every checkbox resolved; missing tokens added or escalated. Output: a short preflight note (commit message or PR description bullet list).

---

## Phase 1 — Branch & baseline capture

**Goal:** Reversible branch with a recorded "before" state.

- [ ] 1.1 `git checkout -b feature/good-fella-inspired-hero`
- [ ] 1.2 Capture baseline screenshots of the live/local hero, header, and open mobile drawer at 320 / 768 / 1440 (Recommended — supports the before/after PR narrative and any rollback).
- [ ] 1.3 Record baseline gate result: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` (Expected green — Verified state per CLAUDE.md).

**Gate 1:** branch exists; baseline green; screenshots stored (e.g. `docs/qa/good-fella-baseline/`).

---

## Phase 2 — Hero copy & content alignment

**Goal:** Kill the Product-DNA conflict. Copy only — no layout yet.
**Files:** `src/components/sections/HeroSection.tsx`, `src/content/**` if copy is content-modelled

- [ ] 2.1 Kicker → `Edgar Bonilla G. · Product UI/UX` (replaces "Hey, I'm Edgar Bonilla G., a" — Verified live).
- [ ] 2.2 H1 → two stacked spans: `Product UI/UX systems.` / `Built for pressure.` (replaces "Creative UI/UX designer" — Verified live).
- [ ] 2.3 `aria-label="Creative services"` → `aria-label="Portfolio focus areas"`.
- [ ] 2.4 CTAs → `View work` (primary, `#work`) / `Work together` (secondary, `#contact`). Real anchors only.
- [ ] 2.5 **Owner decision (blocking this item only):** discipline strip — keep live "Endurance coaching" or adopt spec's "Endurance interfaces". Apply the approved string; do not silently swap.
- [ ] 2.6 Lead paragraph remains `aboutCopy.positioning` — verify no new unverifiable claims entered the hero.
- [ ] 2.7 Grep the repo for any remaining "Creative UI/UX designer" / "Creative services" strings (metadata, OG copy, tests).

**Gate 2:** standard gate green; visual diff shows copy-only change.
**Commit:** `Align hero positioning with product UIUX DNA`

---

## Phase 3 — Hero layout: editorial dark-stage composition

**Goal:** Left-aligned Good Fella structure; orange-default primary CTA.
**Files:** `src/components/sections/HeroSection.tsx`, `src/components/sections/sections.module.css`
**Authority:** implementation doc §3.2–§3.3 (full TSX + CSS).

- [ ] 3.1 Restructure JSX to `heroGrid` → `heroContent` (left) + `heroPortrait` (right) + `heroDisciplines` strip. Keep: dynamic `HeroCylindersBackground` import, `aria-hidden` canvas + overlay layers, `container`, `ButtonLink`.
- [ ] 3.2 Apply hero CSS block: stage on `--surface-bg-hero`; `min-height: calc(100svh - var(--nav-h*))`; readability overlay (left-dark linear gradient + right brand radial glow) — `color-mix` over tokens only.
- [ ] 3.3 `heroTitle`: left-aligned column, `max-width: 12ch`, uppercase, `text-wrap: balance`, `--static-white` (20.38:1 — Verified contrast table).
- [ ] 3.4 Primary CTA **orange by default**: `--surface-control-brand` fill, `--text-on-brand` text (6.38:1 — Verified), hover/focus → `--surface-control-brand-hover` (brand-400 dark — Verified alias). This reverses the live white-default behavior (Verified).
- [ ] 3.5 Secondary CTA subordinate: transparent + 28% white border; hover/focus → white fill, black text.
- [ ] 3.6 Disciplines strip: code font, uppercase, brand-square `::before` markers via `--surface-bg-brand`.
- [ ] 3.7 Portrait: 4/5 aspect, `--radius-surface-md`, 14% white border, hidden < 768px, `portrait-settle` at 140ms.
- [ ] 3.8 Preserve stagger pattern 0/80/140/190/240/280ms via `--motion-duration-hero` + expressive easing.
- [ ] 3.9 Manual check: canvas does not block pointer/focus; CTAs clickable over the visual field.

**Gate 3:** standard gate green; 320/768/1440 spot-check — no horizontal overflow, headline ≤ 12ch, CTA states correct in dark **and** light theme.
**Commit:** `Refactor hero layout to editorial dark-stage composition`

---

## Phase 4 — WebGL field right-bias (optional, reversible)

**Goal:** Heat mass right, copy field clear. **Recommended starting values, tune visually.**
**File:** `src/components/sections/HeroCylindersBackground.tsx`

- [ ] 4.1 Apply composition values: `GRID_X 38 · GRID_Z 24 · SPACING 0.72`; hotspot `hotX = item.x - 5.6`, `hotZ = item.z - 1.6`.
- [ ] 4.2 Preserve (do not touch): `aria-hidden`, `pointer-events: none`, reduced-motion static frame + RAF stop, `geometry/material/renderer.dispose()`.
- [ ] 4.3 Palette stays hardcoded (`#050505 / #321006 / #ff4f18 / #ff7248` ≈ neutral-950 / brand-950 / brand-500 / brand-400) — documented exception; keep the mapping comment in-file for the colophon trail.
- [ ] 4.4 Verify reduced-motion still renders one static frame (toggle `prefers-reduced-motion` in DevTools).

**Gate 4:** standard gate green; visual sign-off by owner on the bias values (in-browser tuning expected).
**Commit:** fold into Phase 3 commit or `Tune hero visual field composition` if separate.

---

## Phase 5 — Drawer `full` size extension

**Goal:** Smallest possible primitive change enabling the full-screen menu.
**Files:** `src/components/overlays/drawer/Drawer.module.css`, Drawer types

- [ ] 5.1 Extend type: `type DrawerSize = "sm" | "md" | "lg" | "full"`.
- [ ] 5.2 Add CSS: `.content[data-size="full"] { width: 100vw; max-width: none; }` for both sides.
- [ ] 5.3 Confirm untouched: `safe-top`/`safe-bottom`, scrim + slide animations, reduced-motion slide removal, focus trap, Escape close, focus return (Verified behaviors per CLAUDE.md launch state).
- [ ] 5.4 If Drawer has unit tests, extend for the new size value.

**Gate 5:** standard gate green; existing drawer e2e still passes (`CI=1 pnpm test:e2e` drawer specs only, if filterable).

---

## Phase 6 — Universal full-screen menu

**Goal:** `MobileMenu` becomes the all-breakpoints menu with active square markers.
**Files:** `src/components/layout/MobileMenu.tsx`, `MobileMenu.module.css`
**Authority:** implementation doc §5.

- [ ] 6.1 Add `activeHref?: string` prop; prepend `{ label: "Home", href: "#top" }` to items.
- [ ] 6.2 Drawer config: `side="left" size="full" title="Menu"`; trigger = `IconButton ariaLabel="Open menu"` ghost.
- [ ] 6.3 Links: `data-active` + `aria-current="page"`; `onClick` closes drawer; **orange text (`--text-brand`, 6.20:1 dark — Verified) + square marker (`--surface-bg-brand`)** — never color-only.
- [ ] 6.4 Oversized link styling: Syne, `clamp(4xl, 8vw, 7xl)`, uppercase, 56px min-height, hover `translateX` gated behind `prefers-reduced-motion: no-preference`.
- [ ] 6.5 Meta rail: "Accepting roles and selected projects" + `mailto:erbonilla@outlook.com` (real link — Verified address).
- [ ] 6.6 Keyboard pass: trigger → trap → links → Escape → focus returns to trigger.

**Gate 6:** standard gate green; manual keyboard + screen-reader spot-check of active state announcement.
**Commit:** `Promote menu drawer to full-screen navigation`

---

## Phase 7 — Compact top navigation

**Goal:** Good Fella chrome: brand · MENU · WORK TOGETHER · [+] · theme.
**Files:** `src/components/navigation/top-navigation/TopNavigation.tsx`, `TopNavigation.module.css`
**Authority:** implementation doc §4.1–§4.2.

- [ ] 7.1 Add `compact?: boolean` prop; render link list only when `!compact`; set `data-compact` on root `<nav>`.
- [ ] 7.2 Remove the ≥768px menu-trigger hide; trigger renders at **all** breakpoints.
- [ ] 7.3 Compact CSS: hide `.list`, `justify-content: space-between` on `.inner`.
- [ ] 7.4 Darken glass variant: 86% `--surface-bg-hero` mix + `blur(var(--blur-glass))` + 8% white bottom border.
- [ ] 7.5 `.link { min-height: 44px; }` (AA target).
- [ ] 7.6 Keep non-compact path fully working — `compact` is additive; existing tests must not break.

**Gate 7:** standard gate green; both compact and non-compact render correctly.
**Commit:** `Add compact top navigation and universal menu trigger`

---

## Phase 8 — Header integration & `SquarePlusLink`

**Goal:** Wire it all together in `SiteHeader`.
**Files:** `src/components/layout/SiteHeader.tsx`, new `SquarePlusLink.tsx` + `.module.css`
**Authority:** implementation doc §4.3–§4.4.

- [ ] 8.1 Create `SquarePlusLink` — a `next/link` (never `<a>` inside `<button>`): `--component-size-control-md` square, brand fill, `--icon-on-brand` Lucide `Plus`, `aria-label="Go to contact"`, brand-hover transition on `--motion-duration-hover`.
- [ ] 8.2 Update `SiteHeader`: `variant="glass" compact`, actions = `Work together` ButtonLink (primary, md, `#contact`) + `SquarePlusLink href="#contact"` + `ThemeToggle` (visually subordinate to CTA).
- [ ] 8.3 **Owner decision:** square plus ≤767px — recommend hide to prevent overflow (contact path preserved via menu meta rail); keep focusable if shown.
- [ ] 8.4 Header stays sticky + safe-area padded; verify no overflow at 320px with CTA hidden / 768px with CTA shown.
- [ ] 8.5 Keyboard order check: skip link → brand → menu → WORK TOGETHER → plus → theme.

**Gate 8:** standard gate green; tab order correct; zero horizontal overflow 320→1440.
**Commit:** `Tune hero CTA and menu active states to Vanguard tokens` (or split header wiring into its own commit if diff is large).

---

## Phase 9 — Responsive & view-mode verification

**Goal:** Prove the breakpoint contract and view-mode stability. Verification only — fixes loop back to the owning phase.

| Width | Must hold |
|---:|---|
| 320–599 | Brand + menu only · portrait hidden · headline ≤ 12ch · full-screen menu · no overflow |
| 600–767 | Full/near-full drawer · visual background-only · CTAs wrap |
| 768–1023 | Compact nav · CTA visible iff no overflow |
| 1024–1439 | Two-column hero (left editorial / right visual) |
| ≥1440 | Container caps `--container-max: 1320px` · visual bleeds as background only |

- [ ] 9.1 Walk all five widths + 375px in a real browser (both themes).
- [ ] 9.2 View-mode contract: toggle Quick Scan / Deep Dive — **hero unchanged in both** (carries core positioning); `[data-view-mode="quick"]` still only hides `tile-teaser`, `story-longform`, `tile-roles`, `range-card-desc`; nothing stranded.
- [ ] 9.3 200% zoom: all hero/menu content reachable.

**Gate 9:** all rows pass; defects ticketed back to Phases 3–8 and re-gated.

---

## Phase 10 — Accessibility & automated QA gate

**Goal:** Full release gate. **Release-blocking.**

- [ ] 10.1 `pnpm typecheck && pnpm lint && pnpm test && pnpm build` — green.
- [ ] 10.2 `CI=1 pnpm test:e2e` — all 30 e2e incl. dark/light axe WCAG 2.2 AA — green. Update/extend specs broken by intentional changes (compact nav, full drawer, new hero copy); add coverage for: orange-default CTA, menu active marker, universal trigger.
- [ ] 10.3 Manual a11y sweep: icon-only controls named · no `href="#"` introduced (grep) · no dead links · focus visible everywhere · drawer trap/Escape/return · reduced motion disables animation **and** WebGL RAF · canvas never traps focus or blocks pointer.
- [ ] 10.4 Lighthouse: PWA still installable; `theme_color`/`background_color` still match `--pwa-theme-color`/`--pwa-bg-color`.

**Gate 10:** zero axe violations; e2e green; manual sweep clean.

---

## Phase 11 — Design QA & polish

**Goal:** Visual quality pass before review.

- [ ] 11.1 Run `npx impeccable detect src/` (slop detection — Documented tooling, CLAUDE.md); resolve or justify findings.
- [ ] 11.2 Compare against Good Fella reference for **structure only** — confirm no copied typography/copy/logo behavior (honesty constraint).
- [ ] 11.3 Side-by-side with Phase 1 baseline screenshots; capture "after" set at the same widths.
- [ ] 11.4 Tune WebGL bias values in-browser if Phase 4 was applied; record final values.
- [ ] 11.5 Grep components touched for raw hex/numbers — semantic tokens only (Three.js file excepted, comment present).

**Gate 11:** owner visual sign-off on the after-set.

---

## Phase 12 — PR, merge & deploy verification

**Goal:** Ship reversibly; verify production.

- [ ] 12.1 Open PR `feature/good-fella-inspired-hero → main` with: scope summary (7 moves), before/after screenshots, gate results, the two owner decisions and their resolutions, sync-v2.0 token preflight note, and a colophon/disclosure note if any new third-party code entered (Expected: none — Lucide already in use).
- [ ] 12.2 Review against this plan's gates; squash or keep the 5-commit sequence per repo preference.
- [ ] 12.3 Merge → Vercel deploy; verify on production: hero copy, orange CTA default, compact nav, full-screen menu, OG/share previews unaffected, `/work/*` and Recruiter Hub untouched.
- [ ] 12.4 Re-run Lighthouse + a quick axe pass against the production URL.
- [ ] 12.5 Update docs: note the change in the action plan / roadmap; if any sync-v2.0 token was added in Phase 0, record it in the design-system sync doc (specs supersede, no diff-only docs).

**Gate 12 (Definition of Done):** production matches the spec; full QA checklist below 100% checked; docs updated.

---

## Risk register & rollback

| Risk | Likelihood | Mitigation |
|---|---|---|
| Sync-v2.0 tokens missing from `tokens.css` | Medium (only unverified item) | Phase 0 gate; add as documented deltas before any component work |
| `ButtonLink` lacks `data-variant` hook | Low | Phase 0.5 check; smallest additive change if needed |
| Compact nav breaks existing nav tests/e2e | Medium (intentional behavior change) | `compact` is additive + opt-in; update specs in Phase 10.2, not by deleting assertions |
| Full-screen drawer regresses focus trap | Low | Phase 5.3 preserves all behaviors; e2e re-run at Gate 5 |
| WebGL bias degrades mobile perf | Low | Optional phase; values reversible; reduced-motion path untouched |
| CTA contrast regression in light theme | Low | Tokens are theme-aware (Verified aliases); Phase 3 gate checks both themes |

**Rollback:** every phase is a discrete commit on a feature branch — revert the branch or individual commits; `main` never receives direct commits. Baseline screenshots (Phase 1) define the restore target.

---

## Owner decisions required (blocking only their own items)

1. **Discipline strip copy** — "Endurance coaching" (live) vs "Endurance interfaces" (spec). *Blocks 2.5.*
2. **Square plus ≤767px** — hide (recommended) or keep. *Blocks 8.3.*
3. **WebGL right-bias** — apply Phase 4 or defer. *Blocks 4.x only.*

---

## Consolidated Definition of Done

- [ ] Hero copy product-focused; no "creative designer" anywhere in repo
- [ ] H1 = "Product UI/UX systems. / Built for pressure."
- [ ] Discipline copy decision applied as approved
- [ ] Hero on `--surface-bg-hero`; sync-v2.0 tokens confirmed/added with doc citation
- [ ] Primary CTA orange by default; secondary subordinate; both themes pass
- [ ] Compact header: brand · MENU · WORK TOGETHER · [+] · theme; sticky, safe-area, no overflow
- [ ] Menu trigger at all breakpoints; full-screen menu desktop + mobile
- [ ] Active menu state = orange text **+** square marker (not color-only)
- [ ] `SquarePlusLink` is a real link with accessible name; no nested interactive elements
- [ ] No `href="#"`; no dead links; no invented metrics; semantic tokens only (Three.js exception documented)
- [ ] Reduced motion disables animation + WebGL loop; canvas never blocks pointer/focus
- [ ] 320 / 375 / 768 / 1024 / 1440 pass; 200% zoom reachable; ≥44px targets
- [ ] View-mode contract intact; hero stable in Quick Scan and Deep Dive
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green
- [ ] `CI=1 pnpm test:e2e` green incl. dark/light axe WCAG 2.2 AA
- [ ] Lighthouse PWA installable; `theme_color`/`background_color` aligned
- [ ] `npx impeccable detect src/` clean or findings justified
- [ ] PR includes before/after, gates, decisions, token preflight note
- [ ] Production verified post-deploy; docs updated

---

## Effort estimate (Expected — solo, familiar codebase)

| Phase | Estimate |
|---|---:|
| 0–1 Preflight + branch | 0.5 day |
| 2 Copy | 0.5 day |
| 3 Hero layout/CSS | 1 day |
| 4 WebGL bias (optional) | 0.5 day |
| 5–6 Drawer + menu | 1 day |
| 7–8 Nav + header | 1 day |
| 9–11 Verification + QA + polish | 1–1.5 days |
| 12 PR + deploy verify | 0.5 day |
| **Total** | **~5.5–6.5 days** |

Estimates are planning aids, not commitments — label remains **Expected**.
