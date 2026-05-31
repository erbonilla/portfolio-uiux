# Portfolio Build Action Plan v2.0

**Owner:** Edgar Bonilla G. · `(ed)studio`
**Date:** 2026-05-29
**Stack:** Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind v4 → Vercel · installable, fully-responsive PWA
**Design system:** Vanguard Premium UI/UX Design System (alpha.1) — full token + component authority

---

## How to use this document

This is the **executable build plan** that turns the spec docs into ordered, verifiable steps. Work the phases top-to-bottom; each carries the exact commands/paths, a source-doc cross-reference, and a **verification** line with checkboxes.

The spec docs remain the **authority for detail**. When this plan says "per design-system §15," open that doc for the specifics:

| Doc | Authority for |
|---|---|
| `portfolio-premium-uiux-design-system.md` | **Token architecture** (primitives + semantics), theming (light/dark + radius modes), local text/effect styles, motion, **full component kit (Batches A–F)**, patterns, CSS/DTCG/React handoff, governance, QA |
| `portfolio-framework-tooling-setup-v2_0.md` | Stack, scaffold, PWA wiring, file tree, scripts, deploy |
| `portfolio-implementation-instructions-v2_0.md` | Responsive model, view-mode contract, footer socials, component map, DoD |
| `portfolio-design-system-sync-v2_0.md` | **Delta over the design system** — fluid type, safe-area, PWA surfaces, `data-view-mode`, footer-social rules |
| `portfolio-recruiter-hub-spec-v2_0.md` | Recruiter Hub: 5 panels, drawer, Panel 01 reflow |
| `portfolio-improvements-roadmap-v2_0.md` | Priorities, blockers, post-launch phases |

**Design-system relationship:** `portfolio-premium-uiux-design-system.md` is the **token + component source of truth** (the system the v2.0 docs called "Vanguard"). `portfolio-design-system-sync-v2_0.md` is a **delta** layered on top of it for this responsive-PWA build. Where they overlap, the sync doc's v2.0 additions extend — they do not replace — the design system.

> **Honesty carry-throughs:** the tools strip lists **Next.js** (now true) — not Vite; the Recruiter Hub audit count must match its rows; the view-mode toggle must really reflow the page; no `href="#"` / dead links ship; components consume **semantic tokens only** (no raw hex/numbers, no component-specific tokens this phase — design-system §39).

### Resolved decisions

- **Icon library:** **Lucide** (general UI incl. view-mode `Zap`/`Search`) + **Simple Icons** (brand/social) for launch. The design system's preferred **Solar linear** set is recorded as a **future design-system-alignment item**, not a launch blocker.
- **Component scope:** implement the **complete token layer now** (all primitives + semantics — Phase 3), but build **only the launch-subset components** the homepage + Recruiter Hub need (Phase 5). The **full Vanguard kit (Batches A–F) + 12 patterns is deferred** to the post-launch system-maturity phase.
- **Theming:** **dark glass is canonical** (`data-theme="dark"` default); light mode is the accessible companion mode. Radius modes (`default` / `rounded` / `no-corner-radius`) wire to the Recruiter Hub Live Tokenizer.

---

## Blockers & fallbacks (resolve when you can; build proceeds meanwhile)

| # | Blocker | Needed from owner | Fallback used until then |
|---|---|---|---|
| B1 | **Social URLs** | Real LinkedIn / Facebook / Instagram URLs | `socials.ts` keeps entries as `href: 'TODO'`; footer renders **only** entries where `href !== 'TODO'` → no dead links (impl §3). |
| B2 | **App-icon set** | `(ed)studio` wordmark export to generate 192 / 512 / maskable / apple-touch | Temporary placeholder set generated from `(ed)studio-primary.svg`; regenerate on final export. |
| B3 | **Contact endpoint** | Confirm/upgrade contact channel | `mailto:erbonilla@outlook.com` (confirmed). Upgrade (Formspree / Resend / Vercel fn) deferred to roadmap. |
| B4 | **Case-study destinations** | Internal `/work/*` vs external links | Default to **internal** `/work/[slug]` stub routes; revisit if external preferred. |

---

## Phase 0 — Environment & prerequisites

1. Install **Node 20 LTS or 22 LTS** (Next 16 needs Node ≥20.9).
2. `corepack enable` (pnpm).
3. Pin toolchain in the new project: `.nvmrc` → `20`; `package.json` → `"packageManager":"pnpm@9.0.0"`, `"engines":{"node":">=20"}`.
4. Editor: ESLint, Prettier, Tailwind IntelliSense, Playwright Test.

**Verification:** `node -v` (≥20), `pnpm -v`.
- [ ] Node LTS active · [ ] pnpm via Corepack

---

## Phase 1 — Scaffold & dependencies

_Source: tooling §3–§4._

1. Scaffold + first commit:
   ```bash
   pnpm create next-app@latest edstudio-portfolio \
     --ts --app --eslint --tailwind --src-dir --import-alias "@/*" --use-pnpm
   cd edstudio-portfolio && git init && git add -A && git commit -m "chore: scaffold next app-router"
   pnpm dev   # confirm :3000
   ```
2. Runtime deps (v2.0 baseline):
   ```bash
   pnpm add motion lucide-react clsx class-variance-authority \
     @radix-ui/react-dialog @radix-ui/react-visually-hidden \
     @icons-pack/react-simple-icons @serwist/next
   ```
3. **Subset Radix primitives** (launch components beyond Dialog):
   ```bash
   pnpm add @radix-ui/react-progress @radix-ui/react-radio-group
   ```
   > The remaining full-kit primitives (tooltip, popover, dropdown-menu, select, checkbox, switch, slider, tabs, avatar, toast) are **deferred** with the rest of the kit — add them in the maturity phase.
4. Dev / tooling + testing:
   ```bash
   pnpm add -D prettier prettier-plugin-tailwindcss eslint-plugin-jsx-a11y sharp serwist
   pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event \
     @testing-library/jest-dom @vitejs/plugin-react @playwright/test @axe-core/playwright
   pnpm exec playwright install --with-deps
   ```

> Fonts via **next/font**: Syne (display) + Inter (body) + **JetBrains Mono** (code styles `code/md`, `code/sm`); system-monospace fallback. Icons = Lucide + Simple Icons (Solar deferred).

**Verification:** `pnpm dev` boots on :3000.
- [ ] Scaffold + first commit · [ ] All deps (incl. full-kit Radix) installed · [ ] Playwright browsers installed

---

## Phase 2 — Project structure & config

_Source: tooling §5–§9._

1. Create the App-Router tree (tooling §5): `src/app`, `src/components/{actions,forms,feedback,navigation,overlays,data,cards,layout,recruiter-hub,sections,ui}`, `src/content`, `src/hooks`, `src/styles`, `scripts`, `public/{assets,icons,og}`.
   - Component folders mirror the design-system categories (`components/actions/*`, `components/forms/*`, … per §29) so paths match the spec.
2. `next.config.ts` — wrap with Serwist `withSerwistInit` from `@serwist/next` (service-worker source `src/app/sw.ts`, `swDest: 'public/sw.js'`, disabled in dev); `images.formats:['image/avif','image/webp']`; `experimental.optimizePackageImports:['lucide-react','@icons-pack/react-simple-icons']`. **Correction (verified):** stable `@serwist/next` injects a webpack config and does *not* support Turbopack — the production `build` script therefore runs `next build --webpack` while `dev` stays on Turbopack (SW disabled in dev). Only the experimental `@serwist/turbopack` preview supports Turbopack builds.
3. `src/app/manifest.ts` — typed manifest (name, short_name `(ed)studio`, `display:'standalone'`, `background_color:'#050505'`, `theme_color:'#FF4F18'`, icons 192/512/maskable).
4. `src/app/layout.tsx` — next/font (Syne `--font-display`, Inter `--font-body`, JetBrains Mono `--font-code`); `metadata`; `viewport` (`themeColor`, `viewportFit:'cover'`); **`<html data-theme="dark">`** (canonical); skip link + `<main id="main-content">`.
5. `globals.css` — `@import "tailwindcss"` then `tokens.css` / `base.css` / `typography.css`; `@theme inline` mapping brand/canvas/surface + font vars.
6. `package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `test`, `test:watch`, `test:e2e`, `assets:normalize`, plus optional `tokens:export` (DTCG, design-system §32).
7. Add `vitest.config.ts` + `playwright.config.ts`.

**Verification:** `pnpm typecheck` passes; layout renders with fonts; `/manifest.webmanifest` resolves; `data-theme="dark"` present on `<html>`.
- [ ] Category-based tree created · [ ] config/manifest/layout/globals wired · [ ] scripts + test configs added

---

## Phase 3 — Design-system foundation (tokens & styles)

_Source: design-system §8–§21, §25–§26, §31; design-sync v2.0 §2–§3 (delta)._

Implement the design system's CSS custom-property model as the project's token layer, then layer the v2.0 delta on top.

1. **Primitives** (`src/styles/tokens.css`, `:root`) — raw values from design-system §8–§14: color ramps (`--color-{neutral,brand,accent,tertiary,success,warning,danger,info}-{50…950}`), dimensions (`--size-*`, incl. the **2px `size/0-5` micro-gap**), radius (tight `0/2/9999` + rounded + no-corner sets), typography primitives (family/weight/size/line-height/letter-spacing), opacity, stroke-width, z-index, shadow recipes (§13), motion (§14, with the documented valid-easing fallbacks).
2. **Semantic aliases** — design-system §15–§21, **aliasing primitives only** (no raw values): `--surface-bg-*`, `--surface-control-*`, `--text-*`, `--icon-*`, `--border-*`, `--state-*`, `--space-{inset,stack,inline,section}-*`, `--component-size-*`, `--radius-{control,surface,overlay,pill,focus-ring}`, `--elevation-*`, motion semantics.
3. **Theming** — light values in `:root`; **`[data-theme="dark"]`** overrides per §15 (note the intentional accent-led mapping: dark `--text-default` = `--color-brand-500`). Dark is canonical/default.
4. **Radius modes** — `[data-radius="rounded"]` and `[data-radius="no-corner-radius"]` remap `--radius-control-*` / `--radius-surface-*` per §31. These back the Recruiter Hub Live Tokenizer (DEFAULT / ROUNDED / BRUTALIST SHARP = default / rounded / no-corner).
5. **Local styles** — `typography.css`: the 22 text styles (`display/*`, `heading/*`, `title/*`, `body/*`, `label/*`, `caption/*`, `code/*`) bound to semantic typography vars (§18, §25); effect/shadow utilities (§26); glass material recipe (§19.3: `surface/bg/default` + `border/default` + `elevation/shadow/lg` + `blur/glass 4px`).
6. **v2.0 delta** (design-sync §2–§3) — add on top: fluid type `--display-hero: clamp(2.5rem,8vw,5rem)`, `--display-section: clamp(1.75rem,4vw,3rem)`; safe-area `--safe-top/--safe-bottom`; PWA surfaces `--pwa-theme-color`/`--pwa-bg-color`; responsive `--gutter` (16/32/56 by breakpoint); **view-mode CSS** `[data-view-mode="quick"] { .tile-teaser,.story-longform,.tile-roles,.range-card-desc { display:none } }` (default `deep`).

**Verification:** every semantic token resolves to a primitive (no raw values); dark↔light toggle works; radius modes visibly change corners; fluid type scales with no breakpoint jumps; contrast spot-checks pass design-system §22 (WCAG 2.2 AA).
- [ ] Primitives in place · [ ] Semantics alias-only · [ ] Dark/light + radius modes · [ ] 22 text styles + effects · [ ] v2.0 delta layered

---

## Phase 4 — Assets

_Source: tooling §8._

1. Author `scripts/normalize-assets.mjs` (sharp → jpg/webp/avif). In **one commit** it must:
   - Re-encode the JPEG-as-`.png` screenshots to correct formats.
   - **Fix the typo:** `osteoplus-screenshoot.png` / `-m` → `osteoplus-screenshot.png` / `-m`.
   - Emit optimized hero + screenshots into `public/assets/`.
2. Move brand SVGs into `public/assets`; seed `public/icons` (placeholder per B2) and `public/og`.

**Verification:** `pnpm assets:normalize` runs clean; normalized + correctly-named files load in `pnpm dev`.
- [ ] `normalize-assets.mjs` re-encodes **and** renames typo in one commit · [ ] Assets in `public/{assets,icons,og}`

---

## Phase 5 — Component library (launch subset)

_Source: design-system §27–§29, §33; global rules §27; React handoff §33._

Build **only what the homepage + Recruiter Hub need**. Each component follows the design-system spec for its name: **semantic tokens only**, variants + states (`default/hover/pressed/focus/disabled/loading` where relevant), accessibility notes, and the **§29 React prop mapping**. Pattern: variant/size via `data-*` + CSS (handoff §33); Radix primitive underneath where one exists. Icon slots use Lucide (Solar deferred).

| Component | Path | From batch | Used by |
|---|---|---|---|
| Button | `components/actions/button` | A | CTAs, contact, hub |
| Icon Button | `components/actions/icon-button` | A | nav, hub controls |
| Link | `components/actions/link` | A | inline + footer |
| Badge / Chip | `components/feedback/badge` | C | status chips, tags |
| Progress Bar | `components/feedback/progress-bar` | C | hub System Audit |
| Form Field | `components/forms/form-field` | B | Contact / Booking |
| Card | `components/data/card` | F | case-study + range tiles |
| Drawer | `components/overlays/drawer` | E | Recruiter Hub + mobile menu |
| Top Navigation | `components/navigation/top-navigation` | D | SiteHeader |

Rules: one primary Button per action group; icon-only controls require `aria-label`; status never by color alone (§22); determinate Progress Bar exposes `aria-valuenow/min/max`; Drawer traps/restores focus + ESC. Components are **Beta** until QA (§36). Short doc per component (§28 fields) or a single `COMPONENTS.md`.

> **Accelerator (21st.dev Magic MCP):** these subset components may be scaffolded from the 21st.dev community library (https://21st.dev/community/components), but 21st.dev output ships with raw shadcn/Tailwind styling — each must be **retokenized to Vanguard semantic tokens**, conformed to the §29 anatomy + prop mapping, and passed through the semantic-tokens-only check before it ships. Treat it as a starting point, not the final component.

> **Deferred:** the rest of Batches A–F (Button Group, Text Field/Area, Select, Search Field, Checkbox, Radio, Switch, Slider, Tag, Alert, Toast, Spinner, Skeleton, Empty State, Tabs, Breadcrumbs, Pagination, Side Nav, Menu Item, Tooltip, Popover, Dropdown, Modal, Avatar, List Item, Table, Page/Section Header, Divider) move to the maturity phase. The **token layer (Phase 3) is built in full now**, so these drop in later without retokenizing.

**Verification:** each subset component renders all variants/states in light + dark; keyboard + focus correct; no raw token values; axe clean on a preview route.
- [ ] Button · [ ] Icon Button · [ ] Link · [ ] Badge/Chip · [ ] Progress Bar · [ ] Form Field · [ ] Card · [ ] Drawer · [ ] Top Navigation · [ ] Prop mappings match §29

---

## Phase 6 — Patterns (launch-relevant only)

_Source: design-system §30._

With the subset scope, build **only the two patterns the portfolio actually uses**, realized directly in the build rather than as a standalone library:
- **Navigation layout** (§30) — the site shell: Top Navigation + mobile Drawer + active-page state. Realized in Phase 8.
- **Detail page layout** (§30) — the case-study route (`/work/[slug]`, B4): Page-header-style title + Card + section rhythm. Realized in the case-study route (roadmap Phase 2; stub now).

> **Deferred:** the other 10 patterns (Authentication, Settings, Data table w/ filters, Empty/Error/Loading states, Confirmation modal, Dashboard shell, Toast flow, Form-validation flow) move to the maturity phase, since they depend on deferred components.

**Verification:** navigation + detail-page behaviors per §30 hold (current-page state, heading order, responsive collapse).
- [ ] Navigation layout (site shell) · [ ] Detail-page layout (case-study stub)

---

## Phase 7 — Content models

_Source: tooling §5; impl §3–§4._

Populate `src/content/`: `caseStudies.ts` (Osteóplus, Atlan; images → normalized assets; destinations per B4 default `/work/[slug]`), `rangeProjects.ts`, `tools.ts` (**Next.js, not Vite**), `navItems.ts`, `approach.ts`, and `socials.ts`:
```ts
export type Social = { id: string; label: string; href: string };
export const socials: Social[] = [
  { id: 'linkedin',  label: 'Edgar Bonilla on LinkedIn',  href: 'TODO' },
  { id: 'facebook',  label: 'Edgar Bonilla on Facebook',  href: 'TODO' },
  { id: 'instagram', label: 'Edgar Bonilla on Instagram', href: 'TODO' },
];
// Render only entries where href !== 'TODO'.
```

**Verification:** types compile; tools strip shows Next.js; socials guard present.
- [ ] Models typed/populated · [ ] `tools.ts` Next.js · [ ] `socials.ts` guarded

---

## Phase 8 — Layout & portfolio sections (responsive)

_Source: impl §1, §3, §5; design-sync §4–§5; consumes Phase 5 kit._

1. **Shell** — `SiteHeader` (use Top Navigation), `MobileMenu` (Drawer), `SiteFooter`, `SkipToContent`. Fixed header/footer pad with `--safe-top`/`--safe-bottom`.
2. **Sections** — Hero, ToolStrip, Story, CaseStudies (Card), Range (Card grid), Approach, About, Contact (`mailto`, B3). Build from kit components; don't re-invent primitives.
3. **Responsive model** (impl §1.1): 320–599 single-col / 600–767 range 2-up / 768–1023 8-col + nav-crowding safeguard / 1024–1439 12-col + 2-col hero + range 3-up / ≥1440 cap `--container-max` 1320px. `clamp()` type, `minmax()` grids, ≥44px targets, no fixed px content widths.
4. **Footer social row** — Simple Icons (`SiLinkedin`/`SiFacebook`/`SiInstagram`), `currentColor`→`--text-muted`, hover `--text-brand` (monochrome), `aria-label` + VisuallyHidden, `target="_blank" rel="noopener noreferrer"`, ≥44px, rendered only for real URLs (B1).
5. **Server/client split** (impl §5): `'use client'` on header, mobile menu, anything stateful/Motion; Hero/ToolStrip/Story/Footer can be server components.

**Verification:** no horizontal overflow at 320/375/768/1024/1440; reachable at 200% zoom; footer socials labeled + keyboard-reachable.
- [ ] Shell + sections from kit · [ ] Breakpoint model + fluid type/grids · [ ] Footer socials guarded · [ ] Correct server/client split

---

## Phase 9 — Recruiter Hub

_Source: recruiter-hub spec §3–§7; impl §2; reuses Drawer/Modal/Tabs/Progress Bar from Phase 5._

1. **Trigger + drawer** — `RecruiterHubTrigger` pill; Radix Dialog right-drawer (focus trap, inert, ESC, scrim, focus return; Motion slide+fade `--motion-duration-layout`/`--easing-expressive`; reduced-motion → instant + scrim fade; trigger z 400, drawer z 500).
2. **Panel 01 — Adaptable view mode (LAUNCH SCOPE, real reflow):** radiogroup `Zap`→`30s Quick Scan`, `Search`→`5m Deep Dive` (**Lucide, `aria-hidden`, never emoji**); `ViewModeContext` (default `deep`) sets `data-view-mode` on `<main>`; CSS from Phase 3 does the reflow; arrow-key nav + `aria-live="polite"`.
3. **Panels 02–05:** Persona filter (real DOM annotations); **Live tokenizer** (DEFAULT/ROUNDED/BRUTALIST SHARP → `:root[data-radius]` from Phase 3, monospace live readout); **System audit** (PASS/TODO/FAIL by text+color, Progress Bar with `aria-valuenow/min/max`, **count must match rows**); Booking (`mailto:erbonilla@outlook.com`, visible labels).

**Verification:** drawer focus/ESC/return; view-mode visibly reflows + keyboard + announced; tokenizer changes real radii; audit count = rows; whole hub operable under reduced motion.
- [ ] Trigger + drawer · [ ] Panel 01 real reflow + Lucide icons · [ ] Panels 02–05 honest · [ ] Audit count = rows

---

## Phase 10 — PWA

_Source: impl §1.3; tooling §6; design-sync §8._

Manifest icons under `public/icons/` (192/512/maskable/apple-touch — placeholder per B2); manifest `theme_color #FF4F18` / `background_color #050505` match `--pwa-theme-color`/`--pwa-bg-color`; `theme-color` + `apple-mobile-web-app-*` via Next exports; optional `/offline`; service worker **production only**.

**Verification:** `/manifest.webmanifest` valid; installable (Chrome/Edge desktop+Android, iOS Add-to-Home-Screen); SW active in prod build.
- [ ] Icon set (placeholder OK) · [ ] Manifest colors match tokens · [ ] Installable; SW active in prod

---

## Phase 11 — Testing & QA

_Source: tooling §10; impl §6–§7; design-sync §8; hub spec §7; design-system §22, §40._

**Vitest (unit):** hero `h1`; nav labels; hub open/close; **view-mode switch Quick↔Deep**; no `href="#"`; **footer socials with accessible names**; representative component states render.

**Playwright + axe (e2e):** homepage loads; keyboard reaches nav + hub; ESC closes drawer; **responsive 375/768/1280 no overflow**; reduced-motion; axe no critical (WCAG 2.2 AA).

**Design QA (impeccable):** run `npx impeccable detect src/` to flag UI anti-patterns / "slop" (deterministic rules, no LLM) in CI and pre-push; use its design commands (`/typeset`, `/colorize`, `/animate`) during Phases 3 / 5 / 8 to refine type, color, and motion against the Vanguard tokens (it respects the existing design system rather than overwriting it).

**Design-system QA (code-relevant, design-system §40 + governance §34–§39):**
- Semantic-token-only usage (no raw hex/numbers in components); no component-specific tokens.
- Contrast matrix per §22 (key pairs pass; flag warnings like `#FF4F18` on white = large/non-text only).
- Every component documents states + a11y; patterns use only system components.
- Slash→CSS naming consistent; changelog/versioning conventions noted.

**Verification:** `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` all green.
- [ ] Unit goals · [ ] Playwright + axe · [ ] Design-system QA (tokens/contrast/states) · [ ] a11y + perf checklists

---

## Phase 12 — Deploy to Vercel

_Source: tooling §11._

Push to GitHub → import (Next.js auto-detected) → `next build` → set env vars → verify PWA in production (manifest + SW active; SW disabled in dev by config).

**Verification:** production deploy live; manifest + SW verified.
- [ ] Pushed + imported · [ ] `next build` deploys · [ ] Manifest + SW verified in prod

---

## First-run / Definition of Done

```bash
pnpm assets:normalize
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm start
pnpm test:e2e
```

**DoD** (impl §9 + design-system completeness):
1. Installable, responsive PWA; no horizontal overflow 320→1440px.
2. Recruiter Hub view-mode switches Quick↔Deep and **visibly reflows**; Lucide icons (not emojis); keyboard-operable.
3. Footer LinkedIn/Facebook/Instagram with accessible names + real destinations — or omit any without a real URL (never dead).
4. **Token layer complete** (all primitives + semantics, dark/light + radius modes); components consume semantic tokens only; tools strip truthful (Next.js).
5. **Launch-subset components** (Button, Icon Button, Link, Badge/Chip, Progress Bar, Form Field, Card, Drawer, Top Navigation) built, documented (Beta), light+dark previews. Full kit + remaining patterns deferred to maturity.
6. Nav, drawer, mobile menu pass keyboard testing.
7. Assets re-encoded, correctly named (typo fixed), loading in preview.
8. Build, typecheck, lint, unit, e2e + axe (WCAG 2.2 AA) pass.
9. Deployed to Vercel; manifest + SW verified in production.

---

## Roadmap beyond launch

_Source: roadmap §7 + design-system follow-ups._

- **Phase 2 — Case-study depth:** `/work/osteoplus`, `/work/atlan` (Detail-page pattern); per-page metadata + OG; wired contact (resolves B3).
- **Phase 3 — Range galleries:** real thumbnails; filters (Data-table-with-filters pattern) if needed.
- **Phase 4 — System maturity:** **complete the component kit** (remaining Batches A–F) + the **other 10 patterns** (§29–§30) on top of the already-complete token layer; Figma ↔ code token sync + design-system Figma build/QA (§41 sequence); DTCG token export (§32); **Solar-linear icon migration** (the deferred icon-set alignment); governed component-specific-token phase.
