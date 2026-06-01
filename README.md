# (ed)studio — portfolio

The personal UI/UX portfolio of **Edgar Bonilla G.** — an installable, fully-responsive **PWA** showcasing accessible product design for health, rehabilitation, wellness, endurance, and lifestyle products.

**Live:** https://portfolio-uiux-smoky.vercel.app · **Contact:** erbonilla@outlook.com

## Highlights

- **Recruiter Hub** — a drawer with five working panels, including a view-mode toggle that genuinely reflows the page (30-second Quick Scan ↔ 5-minute Deep Dive), a live radius tokenizer, persona annotations, and a dated, self-deriving launch checklist.
- **Accessibility-first** — WCAG 2.2 AA: visible focus everywhere, reduced-motion support, semantic landmarks, labeled icon controls, and no horizontal overflow from 320 → 1440px. Verified in CI with axe.
- **Token-driven design system** — primitive + semantic CSS custom properties (dark glass canonical), built on the Vanguard system.
- **Honesty rules** — no dead links, no invented metrics, concept work labeled as such.
- **PWA** — installable, offline-ready via a Serwist service worker.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind v4 · Radix primitives · Motion · Serwist · deployed on Vercel. Package manager: **pnpm** (via Corepack).

## Develop

```bash
pnpm install
pnpm dev          # next dev --turbopack (http://localhost:3000)
```

### Quality gate

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint (+ jsx-a11y)
pnpm test         # vitest (unit)
pnpm build        # next build --webpack (Serwist bundles the SW)
pnpm test:e2e     # playwright + axe (WCAG 2.2 AA)
```

> The production build uses webpack (`--webpack`) because stable `@serwist/next` injects a webpack config and does not support Turbopack; dev stays on Turbopack (the SW is disabled in dev).

## Configuration

Copy [`.env.example`](.env.example) to `.env.local`, and set the same vars in the Vercel project:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for `metadataBase`, OG/Twitter images, sitemap, robots, JSON-LD, canonical. Set to the final custom domain. |
| `NEXT_PUBLIC_FORMSPREE_ID` | Enables the contact form to POST to Formspree. When unset, the form falls back to a prefilled `mailto:`. |

Both are optional — the app has safe fallbacks — but setting them unlocks correct share previews and a working contact form.
