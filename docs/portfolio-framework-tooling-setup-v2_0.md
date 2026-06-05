# Framework, Tooling & Initial Setup v2.0 — Next.js + Vercel

**Project:** Edgar Bonilla G. · `(ed)studio` portfolio (PWA)
**Date:** May 29, 2026
**Supersedes:** `portfolio-framework-tooling-setup-v1_1.md`
**Stack:** Next.js (App Router) + React + TypeScript, deployed to Vercel

---

## 0. Why this supersedes the Vite recommendation

v1.1 recommended Vite because the portfolio was static. This version moves to **Next.js by explicit project decision**, and that decision is now justified by three new requirements:

- **PWA, fully responsive** — Next.js has first-class metadata, manifest, and route-level layout APIs that make a responsive, installable PWA straightforward.
- **Deploy to Vercel** — Next.js is Vercel's native framework; zero-config builds, image optimization, and previews come for free.
- **Recruiter Hub mode switching** — a richer interactive layer benefits from Next.js's server/client component split and route structure as case studies grow.

Trade-off acknowledged: Next.js adds a server runtime and framework surface the static site didn't strictly need. That cost is now paid for by the PWA + Vercel + roadmap direction.

## 1. Stack table

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Native Vercel target; metadata/manifest APIs; layouts; image optimization. |
| UI | **React 19** (bundled with Next 16) | Component model; server + client components. |
| Language | **TypeScript 5+** | Typed content models. |
| Styling | **CSS custom properties + Tailwind v4** | Vanguard tokens stay the source of truth; Tailwind for responsive layout. |
| Animation | **Motion for React** | Scroll/drawer/route animation, reduced-motion aware. |
| Icons | **Lucide React + Simple Icons React** | UI icons + brand/social/tool logos; no CDN. |
| Dialog | **Radix Dialog + Visually Hidden** | Recruiter Hub focus trap, inert, ESC, focus return. |
| PWA | **Serwist** (`@serwist/next`) | Service worker + manifest wiring for the App Router; stable Serwist builds through webpack. |
| Class helpers | **clsx + class-variance-authority** | Conditional classes; component variants. |
| Fonts | **next/font (Syne + Inter)** | Self-hosted, zero-CLS, automatic subsetting. |
| Unit tests | **Vitest + Testing Library** | Fast component tests. |
| E2E + a11y | **Playwright + @axe-core/playwright** | Keyboard, drawer, responsive, reduced-motion, axe. |
| Lint/format | **ESLint (next/core-web-vitals) + jsx-a11y + Prettier** | Catches a11y + fake links; consistent format. |
| Package manager | **pnpm** | Fast, deterministic. |
| Deployment | **Vercel** | Native; preview deploys; analytics optional. |

## 2. Prerequisites

- **Node.js 20 LTS or 22 LTS** (Next 16 requires Node 20.9+; use current LTS).
- **pnpm** via Corepack: `corepack enable`.
- **Git**, **VS Code/Cursor** with ESLint, Prettier, Tailwind IntelliSense, Playwright Test.

```bash
echo "20" > .nvmrc
```
`package.json`: `"packageManager": "pnpm@9.0.0"`, `"engines": { "node": ">=20" }`.

## 3. Create the project

```bash
pnpm create next-app@latest edstudio-portfolio \
  --ts --app --eslint --tailwind --src-dir --import-alias "@/*" --use-pnpm
cd edstudio-portfolio
git init && git add -A && git commit -m "chore: scaffold next app-router"
pnpm dev   # confirm starter runs on :3000
```

## 4. Install dependencies

```bash
# runtime
pnpm add motion lucide-react clsx class-variance-authority \
  @radix-ui/react-dialog @radix-ui/react-visually-hidden \
  @icons-pack/react-simple-icons @serwist/next serwist

# dev / tooling
pnpm add -D prettier prettier-plugin-tailwindcss eslint-plugin-jsx-a11y sharp

# testing
pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom @vitejs/plugin-react @playwright/test @axe-core/playwright
pnpm exec playwright install --with-deps
```

`next/font` covers Syne + Inter (no Fontsource needed). `sharp` is used by Next image optimization and the asset normalization script.

## 5. File structure (App Router)

```txt
edstudio-portfolio/
  public/
    assets/  hero-portfolio-2.jpg  osteoplus-screenshot.jpg  atlan-screenshot.jpg
    icons/   icon-192.png  icon-512.png  maskable-512.png  apple-touch-icon.png
    og/      home.png  osteoplus.png  atlan.png
  src/
    app/
      layout.tsx              # root layout: fonts, metadata, viewport, <main>
      page.tsx                # homepage composition
      manifest.ts             # PWA manifest (typed)
      work/[slug]/page.tsx    # case-study route (optional)
      not-found.tsx
    components/
      cards/ CaseStudyCard.tsx ComingSoonCard.tsx RangeCard.tsx
      layout/ SiteHeader.tsx MobileMenu.tsx SiteFooter.tsx SkipToContent.tsx
      overlays/ RecruiterHubDrawer.tsx
      recruiter-hub/ ViewModePanel.tsx PersonaFilterPanel.tsx LiveTokenizerPanel.tsx
                     SystemAuditPanel.tsx BookingPanel.tsx
                     useViewMode.ts usePersonaAnnotations.ts useLiveTokens.ts
      sections/ HeroSection.tsx ToolStrip.tsx StoryPanel.tsx CaseStudiesSection.tsx
                RangeSection.tsx ApproachSection.tsx AboutSection.tsx ContactSection.tsx
      ui/ Button.tsx Chip.tsx IconButton.tsx FormField.tsx ProgressBar.tsx
    content/ approach.ts caseStudies.ts navItems.ts rangeProjects.ts tools.ts socials.ts
    hooks/ useActiveSection.ts usePrefersReducedMotion.ts
    styles/ tokens.css base.css typography.css
  scripts/ normalize-assets.mjs
  next.config.mjs  tsconfig.json  vitest.config.ts  playwright.config.ts
```

## 6. Configure Next.js + PWA

`next.config.ts`:
```ts
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react", "@icons-pack/react-simple-icons"] },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
```

`src/app/manifest.ts`:
```ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Edgar Bonilla G. — (ed)studio',
    short_name: '(ed)studio',
    description: 'UI/UX for digital health, wellness, fitness, sports, and lifestyle.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#FF4F18',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

## 7. Root layout: fonts, metadata, responsive viewport

`src/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from 'next';
import { Syne, Inter } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], weight: ['700','800'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Edgar Bonilla G. — UI/UX for digital health, wellness & fitness',
  description: 'Accessible product interfaces and visual systems for health, wellness, endurance, and digital content.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: '(ed)studio' },
  openGraph: { images: ['/og/home.png'] },
};

export const viewport: Viewport = {
  themeColor: '#FF4F18',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',           // respects iOS safe-area insets
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
```

`globals.css` imports the token/base/type layers:
```css
@import "tailwindcss";
@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/typography.css";

@theme inline {
  --color-brand: var(--color-brand-500);
  --color-canvas: var(--surface-bg-canvas);
  --color-surface: var(--surface-bg-default);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

## 8. Asset normalization

Keep the asset normalization script available for future image drops and to preserve the fixed `osteoplus-screenshot*` naming.
```bash
pnpm assets:normalize    # runs scripts/normalize-assets.mjs (sharp → jpg/webp/avif)
```
Current launch screenshots are already normalized. With Next, you can also import them through `next/image` for per-request optimization.

## 9. Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "assets:normalize": "node scripts/normalize-assets.mjs"
  }
}
```

## 10. Testing

`vitest.config.ts` uses `@vitejs/plugin-react` + `jsdom`. Unit goals: hero `h1` renders; nav labels render; Recruiter Hub opens/closes; **view-mode toggle switches Quick Scan ↔ Deep Dive**; no `href="#"`; **footer renders LinkedIn/GitHub/Facebook/Instagram links with accessible names**.

Playwright goals: homepage loads; keyboard reaches nav + hub controls; ESC closes drawer; **responsive — mobile (375), tablet (768), desktop (1280) all render without overflow**; reduced-motion respected; axe no critical violations.

## 11. Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel — framework auto-detected as Next.js.
3. Build command `next build --webpack`, output handled automatically (no `dist` config).
4. No SPA rewrite needed — App Router handles routing server-side.
5. Set any env vars (e.g. contact endpoint) in Vercel project settings.
6. Verify the PWA: manifest served at `/manifest.webmanifest`, installable, service worker active in production (disabled in dev by config).

## 12. First-run checklist

```bash
pnpm assets:normalize
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm start
pnpm test:e2e
```
Manual: install prompt appears; layout holds 320→1440px; Recruiter Hub mode switch works and is keyboard-operable; footer social links have labels and real (or clearly-TODO) destinations; reduced motion respected.

## 13. References

- Next.js App Router: https://nextjs.org/docs/app
- Next.js PWA / manifest: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- next/font: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Vercel deploy: https://vercel.com/docs/frameworks/nextjs
- Tailwind v4: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Motion for React: https://motion.dev/docs/react-installation
- Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
- Serwist: https://serwist.pages.dev/docs/next

## 14. WebGL Hero Background Migration (Path B → Path A)

In June 2026, the hand-rolled Three.js hero background (Path B) was reversed in favor of migrating to the open-source `threejs-components` (grid2) library (Path A).

**Rationale**: The hand-rolled attempt could not reach visual parity with the library's effects (such as the specific crater displacement math, peg density, color gradients, and heavy pointer follow). Rebuilding these features manually amounted to rewriting the library, which violates the goal of maintaining a maintainable portfolio. Adopting the actual library is both functionally superior and more honest, provided it is properly credited.

**Decisions & Fixes**:
- **CDN Imports (Path A)**: We vendored the library to `public/vendor/threejs-components/grid2.js` but kept its internal runtime jsDelivr imports for `three` and `postprocessing`. Because of this, we explicitly do not claim "zero third-party runtime calls".
- **Texture 404 Fix**: The library originally hardcoded a fetch to `/ps-buttons-black.webp`. To prevent a 404 without altering the minified vendor source, a 1x1 transparent `public/ps-buttons-black.webp` was added.
- **Config**: We tuned the background to use the brand's orange palette (`0xff4f18`, `0xff6a32`, `0xffd9c7`), added a warm rim light, disabled the default blue tint, and configured a dense field (desktop `n=22`, mobile `n=14`).
- **Disclosure**: A colophon was added to the About section explicitly acknowledging the third-party animation code, clarifying what elements were authored by the owner (tuning, layout, accessibility, reduced-motion guards).
