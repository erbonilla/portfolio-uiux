# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

`(ed)studio` — the personal UI/UX portfolio of **Edgar Bonilla G.** A fully-responsive, installable **PWA** built on **Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind v4**, deployed to **Vercel**. It showcases UI/UX work for digital health, wellness, fitness, sports, and lifestyle, and includes a **Recruiter Hub** drawer with a launch-scope view-mode reflow (Quick Scan ↔ Deep Dive).

- **Repo:** https://github.com/erbonilla/portfolio-uiux.git
- **Owner contact:** erbonilla@outlook.com

## Current state (read first)

**The app is scaffolded and builds.** Next 16 (App Router) + React 19 + Tailwind v4 live at the repo root (`src/`, `package.json`, `next.config.ts`); runtime/dev/test deps are installed and `pnpm build` is green. Git is initialized (`main`; remote `origin` → the GitHub repo above) — **no commits pushed yet**. PWA uses **Serwist** (`@serwist/next`), not next-pwa.

> **Build-tool correction (verified 2026-05-29):** stable `@serwist/next` injects a **webpack** config and does **not** support Turbopack — only the experimental `@serwist/turbopack` preview does. So `dev` stays on Turbopack (SW is disabled in dev anyway) and **`build` runs `next build --webpack`** so Serwist can bundle the service worker. The original "Serwist supports Turbopack builds" premise was inaccurate; Serwist is still the chosen SW lib, the production build just opts into webpack.

**Phases 2–11 are built and green (2026-05-29).** Token layer (`src/styles/{tokens,base,typography}.css`), launch-subset components (`src/components/**`, see `COMPONENTS.md`), content models (`src/content/**`), full shell + sections (`src/components/{layout,sections}`), the Recruiter Hub with all 5 working panels (`src/components/recruiter-hub/**`), `/work/[slug]` stub + `/offline`, and the Serwist PWA are all in place. The full gate passes: `pnpm assets:normalize && typecheck && lint && test (17 unit) && build && test:e2e (10 e2e incl. axe WCAG 2.2 AA)`. View-mode reflow, live tokenizer, persona annotations, drawer focus/ESC, and 320→1440 no-overflow are all verified in a real browser.

Only **Phase 12 (deploy)** remains — push to GitHub + import to Vercel (owner action). Work lives on branch `feat/portfolio-build-phase2-12`, **not yet committed**. Open blockers below (B1 social URLs, B2 final app-icon export, B3 contact endpoint) are unresolved by design and use their documented fallbacks.

Asset reality differed from the docs: the screenshots were already valid PNGs (not JPEG-as-PNG); the `screenshoot` typo was real and is fixed; and `(ed)studio-primary/secondary.svg` were PNG data mislabelled `.svg` (re-encoded to `.png`). Only `(ed)studio-text-primary.svg` is a true vector (the wordmark).

## Documentation map (authority for detail)

Always defer to these docs; they are the source of truth. When in doubt, cite the doc + section.

| Doc | Authority for |
|---|---|
| `docs/portfolio-action-plan-v2_0.md` | **The executable build plan** — phased, checklist-driven. Start here to build. |
| `docs/portfolio-premium-uiux-design-system.md` | Token architecture (primitives + semantics), theming (light/dark + radius modes), local text/effect styles, motion, full component kit + patterns, CSS/DTCG/React handoff, governance, QA. |
| `docs/portfolio-framework-tooling-setup-v2_0.md` | Stack, scaffold commands, PWA wiring, file tree, scripts, deploy. |
| `docs/portfolio-implementation-instructions-v2_0.md` | Responsive model, view-mode contract, footer socials, component map, DoD. |
| `docs/portfolio-design-system-sync-v2_0.md` | Delta over the design system: fluid type, safe-area, PWA surfaces, `data-view-mode`, footer-social rules. |
| `docs/portfolio-recruiter-hub-spec-v2_0.md` | Recruiter Hub: 5 panels, drawer, Panel 01 reflow. |
| `docs/portfolio-improvements-roadmap-v2_0.md` | Priorities, blockers, post-launch phases. |
| `docs/README-portfolio-docs-v2_0.md` | Index + requirements-coverage matrix. |
| `docs/product-dna-v1_0.md` | **Product/Project DNA** — one-page synthesis of identity, audience, design principles, the Recruiter Hub signature behavior, system/tech DNA, honesty non-negotiables, and success signals. Orientation, not binding detail. |

## Key decisions (already made — don't relitigate)

- **Design-system relationship:** `portfolio-premium-uiux-design-system.md` (Vanguard, alpha.1) is the token + component source of truth; `portfolio-design-system-sync-v2_0.md` is a **delta** layered on top for the responsive PWA — it extends, never replaces.
- **Icons:** **Lucide** (general UI, incl. view-mode `Zap`/`Search`) + **Simple Icons** (brand/social). The design system's preferred **Solar linear** set is a *future alignment item*, not a launch requirement.
- **Theming:** **dark glass is canonical** (`<html data-theme="dark">` default); light mode is the accessible companion. Radius modes (`default`/`rounded`/`no-corner-radius`) back the Recruiter Hub Live Tokenizer.
- **Scope:** implement the **complete token layer now** (all primitives + semantics), but build **only the launch-subset components** (Button, Icon Button, Link, Badge/Chip, Progress Bar, Form Field, Card, Drawer, Top Navigation). The **full component kit + 12 patterns is deferred** to the post-launch maturity phase.

## Open blockers (need owner input; build proceeds via fallback)

- **Social URLs** (LinkedIn/Facebook/Instagram) — until provided, `socials.ts` keeps `href:'TODO'` and the footer renders only real entries (no dead links).
- **App-icon source** — placeholder set from `(ed)studio-primary.svg` until the wordmark export is supplied.
- **Contact endpoint** — `mailto:erbonilla@outlook.com` confirmed; Formspree/Resend/Vercel-fn upgrade deferred.
- **Case-study destinations** — default to internal `/work/[slug]` stubs.

## Conventions & guardrails

- **Semantic tokens only** in components — never raw hex/numbers; no component-specific tokens this phase. Primitives are reference values aliased by semantics (design-system §39).
- **Naming:** slash names in Figma → CSS custom properties in code (`color/brand/500` → `--color-brand-500`).
- **Honesty rules (non-negotiable):** the tools strip lists **Next.js, not Vite**; the Recruiter Hub view-mode toggle must **actually reflow** the page; the audit panel's count must match its rows; **no `href="#"` or dead links**; no invented metrics.
- **Accessibility target:** WCAG 2.2 AA. Icon-only controls need accessible names; status never by color alone; visible focus everywhere; reduced-motion respected; no horizontal overflow 320→1440px.
- **Assets:** screenshots are JPEG data with `.png` extensions — must be re-encoded (sharp). Fix the typo `osteoplus-screenshoot*` → `osteoplus-screenshot*` in the same commit (see action plan Phase 4).

## Commands (pnpm)

Package manager is **pnpm** (via Corepack):

```bash
pnpm dev               # next dev --turbopack (:3000)
pnpm build             # next build
pnpm start             # next start
pnpm lint              # next lint (+ jsx-a11y)
pnpm typecheck         # tsc --noEmit
pnpm test              # vitest run
pnpm test:e2e          # playwright test (+ axe)
pnpm assets:normalize  # scripts/normalize-assets.mjs (re-encode + rename)
```

First-run gate: `pnpm assets:normalize && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm start`, then `pnpm test:e2e`.

## Tooling & skills

- **Context7 MCP** (`.mcp.json`, project-scoped, remote HTTP `https://mcp.context7.com/mcp`) — pulls up-to-date library docs (Next 16, Tailwind v4, Radix, Motion) into context. Requires approval in Claude Code on first load (`/mcp`). A free `CONTEXT7_API_KEY` raises rate limits — pass it as a header in local config, **do not commit secrets**.
- **impeccable** (frontend design-quality skill by pbakaus) — 23 design commands (`/typeset`, `/colorize`, `/animate`, …) + deterministic "slop" detection (`npx impeccable detect src/`). Install per-user via `/plugin marketplace add pbakaus/impeccable` or `npx impeccable skills install`. Use it for design QA in action-plan Phase 11 and to refine type/color/motion in Phases 3 / 5 / 8.
- **21st.dev Magic MCP** (`.mcp.json` → `magic`, package `@21st-dev/magic`) — AI component generator + the 21st.dev community library (https://21st.dev/community/components). Needs `API_KEY` via env `TWENTYFIRST_API_KEY` (free key at https://21st.dev/magic/console); approve in `/mcp` on first load. **Accelerator only:** any generated/imported component MUST be retokenized to Vanguard semantic tokens (no raw shadcn/Tailwind values) and match the design-system §29 anatomy + prop mapping before it ships. Importing components requires the app scaffolded first (Tailwind present).

## Working agreement

- Before implementing, read the relevant doc section and the matching phase in `docs/portfolio-action-plan-v2_0.md`.
- Keep changes consistent with the four key decisions above; if a decision needs to change, update the action plan and this file together.
- Commit/push only when asked. The default branch should not receive direct commits — branch first.
