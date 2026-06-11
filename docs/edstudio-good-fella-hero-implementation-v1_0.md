# `(ed)studio` — Good Fella Hero, Navigation & Menu Implementation

**Doc:** `edstudio-good-fella-hero-implementation-v1_0.md` · **Status:** Implementation-ready · **Date:** 2026-06-10
**Supersedes:** consolidates `edstudio-good-fella-hero-system-adjustment-spec.md` into a verified, executable change set.
**Repo:** `erbonilla/portfolio-uiux` · **Live:** <https://portfolio-uiux-smoky.vercel.app/> · **Reference:** <https://good-fella.com/>

---

## 0. Evidence base & verification status

| Source | Status |
|---|---|
| Live Vercel deployment | **Verified 2026-06-10.** Hero still reads "Creative UI/UX designer"; full desktop nav (Work / Range / Approach / About / Résumé / Contact); CTAs are "View case studies" / "Get in touch"; portrait + disciplines strip present. All current-state corrections in §3 are confirmed accurate against production. |
| `portfolio-premium-uiux-design-system.md` (Vanguard alpha) | **Verified.** All core tokens used below exist with these mappings (Documented): `--color-brand-500 #FF4F18` · `--color-neutral-950 #050505` · `--color-brand-950 #321006` · `surface/control/brand → brand/500` · `surface/control/brand-hover → brand/600 light / brand/400 dark` · `text/on-brand → black` · `icon/on-brand → black` · `text/brand → brand/700 light / brand/500 dark` · `border/brand → brand/500` · `state/focus-ring → brand/500` · `surface/bg/overlay → neutral/950` · `static/white` / `static/black` · `--radius-control-md`. |
| Contrast (Documented, design-system §"contrast table") | `#000 on #FF4F18` = 6.38:1 pass (CTA text) · `#FF4F18 on #050505` = 6.20:1 pass (menu active text, dark) · `#FFF on #050505` = 20.38:1 pass (hero title). |
| Hero-scale tokens (`--surface-bg-hero`, `--display-hero`, `--motion-duration-hero`, `--blur-glass`, safe-area vars) | **Documented in `portfolio-design-system-sync-v2_0.md` per CLAUDE.md; not independently re-verifiable from the files available to this doc.** Before coding, confirm they exist in `src/styles/tokens.css`. If any are missing, add them as sync-v2.0 deltas — do not invent new primitives. |
| Good Fella reference | Structural inspiration only (Documented in source spec). No typography, copy, logo behavior, or pricing positioning is copied. |

**Honesty constraints carried forward (non-negotiable):** semantic tokens only, no raw hex in components (the Three.js material palette is the single documented exception); no `href="#"`; no dead links; no invented metrics; WCAG 2.2 AA; active states never color-only.

---

## 1. Scope of change

Seven alignment moves — no foundational rebuild required (token layer, dark hero stage, WebGL field, accessible Drawer, tokenized buttons, focus system, safe-area, and reduced-motion guards already ship):

1. Correct hero positioning copy (Product DNA conflict — confirmed live).
2. Convert hero to a left-aligned editorial dark-stage composition.
3. Make the primary CTA **orange by default** (currently white-default).
4. Compact the header to brand / MENU / WORK TOGETHER / square plus / theme.
5. Promote the drawer to a universal full-screen menu (all breakpoints).
6. Add the orange active square marker to menu links (not color-only).
7. Keep everything inside existing Vanguard tokens and primitives.

**Branch:** `feature/good-fella-inspired-hero` (reversible visual-system branch).

---

## 2. Color & token mapping (authoritative for this change)

| Element | Token | Resolved value (dark) | Status |
|---|---|---|---|
| Hero stage | `--surface-bg-hero` | `#050505` (≈ neutral-950) | Documented (sync v2.0) — verify in repo |
| Primary CTA fill | `--surface-control-brand` | `#FF4F18` | Verified |
| Primary CTA hover | `--surface-control-brand-hover` | brand-400 `#FF7248`-class hotter orange | Verified (dark alias = brand/400) |
| CTA text/icon | `--text-on-brand` / `--icon-on-brand` | black (6.38:1 on brand) | Verified |
| Hero title | `--static-white` | `#FFFFFF` (20.38:1) | Verified |
| Hero muted text | `color-mix(in srgb, var(--static-white) 68–80%, transparent)` | — | Documented (source spec pattern) |
| Menu overlay surface | `--surface-bg-overlay` | neutral-950 | Verified |
| Active menu text | `--text-brand` | brand/500 in dark (6.20:1 on stage) | Verified |
| Active menu marker | `--surface-bg-brand` | brand/500 square | Verified |
| Focus ring | `--state-focus-ring` | brand/500 | Verified |
| Borders on brand controls | `--border-brand` | brand/500 | Verified |

Three.js palette (hardcoded by necessity — `MeshStandardMaterial` cannot read CSS custom properties; documented exception):

```
BASE #050505 ≈ --color-neutral-950
MID  #321006 ≈ --color-brand-950
HOT  #ff4f18 ≈ --color-brand-500
PEAK #ff7248 ≈ --color-brand-400
```

---

## 3. Hero — `src/components/sections/HeroSection.tsx`

### 3.1 Copy corrections (required)

| Current (verified live) | New |
|---|---|
| Kicker "Hey, I'm Edgar Bonilla G., a" | `Edgar Bonilla G. · Product UI/UX` |
| H1 "Creative **UI/UX** designer" | `Product UI/UX systems.` / `Built for pressure.` (two stacked spans) |
| `aria-label="Creative services"` | `aria-label="Portfolio focus areas"` |
| CTAs "View case studies" / "Get in touch" | "View work" (primary, `#work`) / "Work together" (secondary, `#contact`) |

> **Copy decision flagged (owner input):** the source spec proposes the discipline strip item "Endurance **interfaces**"; the live site says "Endurance **coaching**". Treat as an intentional copy change to approve, not a silent swap. Lead paragraph reuses `aboutCopy.positioning` — no new claims introduced.

### 3.2 Component

```tsx
const disciplines = [
  "Health & rehab PWAs",
  "Endurance interfaces", // ← pending owner approval vs. "Endurance coaching"
  "Design systems",
];

export function HeroSection() {
  return (
    <section id="top" className={cn(s.section, s.hero)}>
      <div className={s.heroCanvas} aria-hidden="true">
        <HeroCylindersBackground />
      </div>
      <div className={s.heroOverlay} aria-hidden="true" />

      <div className="container">
        <div className={s.heroGrid}>
          <div className={s.heroContent}>
            <p className={cn(s.heroKicker, "ts-label-md")}>
              Edgar Bonilla G. · Product UI/UX
            </p>

            <h1 className={cn(s.heroTitle, "ts-display-hero")}>
              <span>Product UI/UX systems.</span>
              <span>Built for pressure.</span>
            </h1>

            <p className={cn(s.lead, s.heroLead, "ts-body-lg")}>
              {aboutCopy.positioning}
            </p>

            <div className={s.heroCtas}>
              <ButtonLink href="#work" variant="primary" size="lg">
                View work
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary" size="lg">
                Work together
              </ButtonLink>
            </div>

            <p className={cn(s.heroMeta, "ts-label-md")}>
              Based in Costa Rica · Open to roles · Spanish and English
            </p>
          </div>

          <div className={s.heroPortrait}>
            <Image
              src="/assets/next-hero-photo.jpg"
              alt="Portrait of Edgar Bonilla G."
              width={1122}
              height={1402}
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </div>
        </div>

        <ul className={s.heroDisciplines} aria-label="Portfolio focus areas">
          {disciplines.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
    </section>
  );
}
```

Keep: dynamic `HeroCylindersBackground` import, decorative canvas mount, overlay layer, `container`, `ButtonLink`, real anchors only, portrait (CSS-hidden < 768px).

### 3.3 Hero CSS — `sections.module.css` (hero rules only; do not touch the token file)

```css
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: calc(100svh - var(--nav-h-mobile));
  padding-top: clamp(var(--space-section-lg), 12vh, var(--space-section-2xl));
  padding-bottom: var(--space-section-lg);
  background-color: var(--surface-bg-hero);
}

@media (min-width: 1024px) {
  .hero {
    min-height: calc(100svh - var(--nav-h));
    padding-top: clamp(var(--space-section-lg), 14vh, var(--space-section-2xl));
    padding-bottom: var(--space-section-md);
  }
}

.heroCanvas { position: absolute; inset: 0; z-index: var(--z-index-base); overflow: hidden; }

.heroOverlay {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    linear-gradient(90deg,
      color-mix(in srgb, var(--static-black) 92%, transparent) 0%,
      color-mix(in srgb, var(--static-black) 76%, transparent) 42%,
      color-mix(in srgb, var(--static-black) 42%, transparent) 70%,
      color-mix(in srgb, var(--static-black) 72%, transparent) 100%),
    radial-gradient(circle at 74% 34%,
      color-mix(in srgb, var(--color-brand-500) 26%, transparent),
      transparent 36%);
}

.hero > :global(.container) { position: relative; z-index: 2; }

.heroGrid { display: grid; gap: var(--space-section-sm); align-items: end; }

@media (min-width: 1024px) {
  .heroGrid {
    min-height: min(720px, calc(100svh - var(--nav-h) - var(--space-section-md)));
    grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
    gap: var(--space-section-lg);
  }
}

.heroContent {
  display: flex; flex-direction: column;
  gap: var(--space-stack-lg);
  max-width: 760px;
  color: var(--static-white);
}
.heroContent > * {
  animation: hero-rise var(--motion-duration-hero) var(--motion-easing-expressive) both;
}

.heroKicker { color: color-mix(in srgb, var(--static-white) 72%, transparent); }

.heroTitle {
  display: flex; flex-direction: column; align-items: flex-start;
  max-width: 12ch;
  color: var(--static-white);
  text-align: left;           /* was right-aligned — core Good Fella shift */
  text-transform: uppercase;
  text-wrap: balance;
}
.heroTitle span {
  color: var(--static-white);
  font-weight: var(--font-weight-bold);
  opacity: var(--opacity-90);
}

.heroLead { max-width: 56ch; color: color-mix(in srgb, var(--static-white) 78%, transparent); }

.heroCtas { display: flex; flex-wrap: wrap; gap: var(--space-inline-sm); align-items: center; }

/* Primary CTA: ORANGE BY DEFAULT (was white-default / orange-hover) */
.heroCtas :global([data-variant="primary"]) {
  background-color: var(--surface-control-brand);
  border-color: var(--border-brand);
  color: var(--text-on-brand);
  box-shadow: none;
}
.heroCtas :global([data-variant="primary"]:hover),
.heroCtas :global([data-variant="primary"]:focus-visible) {
  background-color: var(--surface-control-brand-hover);
  border-color: var(--surface-control-brand-hover);
  color: var(--text-on-brand);
  box-shadow: var(--shadow-sm);
}

/* Secondary CTA: subordinate ghost → white fill on hover */
.heroCtas :global([data-variant="secondary"]) {
  background-color: transparent;
  border-color: color-mix(in srgb, var(--static-white) 28%, transparent);
  color: var(--static-white);
}
.heroCtas :global([data-variant="secondary"]:hover),
.heroCtas :global([data-variant="secondary"]:focus-visible) {
  background-color: var(--static-white);
  border-color: var(--static-white);
  color: var(--static-black);
}

.heroMeta { color: color-mix(in srgb, var(--static-white) 70%, transparent); }

.heroDisciplines {
  display: flex; flex-wrap: wrap; gap: var(--space-inline-md);
  list-style: none; margin: var(--space-section-lg) 0 0; padding: 0;
  color: color-mix(in srgb, var(--static-white) 58%, transparent);
  font-family: var(--font-family-code);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
.heroDisciplines li::before {
  content: ""; display: inline-block;
  width: var(--size-1); height: var(--size-1);
  margin-right: var(--space-inline-sm); vertical-align: middle;
  background-color: var(--surface-bg-brand);
}

.heroPortrait {
  position: relative; aspect-ratio: 4 / 5; overflow: hidden;
  border: var(--stroke-width-default) solid color-mix(in srgb, var(--static-white) 14%, transparent);
  border-radius: var(--radius-surface-md);
  background-color: var(--surface-bg-hero);
  animation: portrait-settle var(--motion-duration-hero) var(--motion-easing-expressive) 140ms both;
}
@media (max-width: 767px) { .heroPortrait { display: none; } }
```

### 3.4 WebGL field — `HeroCylindersBackground.tsx`

**Keep the component.** Preserve: `aria-hidden`, `pointer-events: none`, reduced-motion static frame + RAF stop, `geometry/material/renderer.dispose()`.

Optional right-bias composition (Recommended, reversible — leaves the left copy field clear):

```ts
const GRID_X = 38;
const GRID_Z = 24;
const SPACING = 0.72;
// hotspot moved right:
const hotX = item.x - 5.6;
const hotZ = item.z - 1.6;
```

---

## 4. Navigation — compact chrome

**Target desktop layout:** `(ed)studio · · · MENU · WORK TOGETHER · [+] · theme`

### 4.1 `TopNavigation.tsx` — add `compact` prop

```tsx
export interface TopNavigationProps {
  brand: React.ReactNode;
  items: TopNavItem[];
  actions?: React.ReactNode;
  menuTrigger?: React.ReactNode;
  variant?: TopNavVariant;
  activeHref?: string;
  compact?: boolean;
  "aria-label"?: string;
}
```

Render the link list only when `!compact`; always render `menuTrigger`; set `data-compact={compact || undefined}` on the root `<nav>`.

### 4.2 `TopNavigation.module.css`

Remove the `≥768px` menu-trigger hide; add:

```css
.menuTrigger { display: inline-flex; }                /* all breakpoints */
.root[data-compact="true"] .list { display: none; }
.root[data-compact="true"] .inner { justify-content: space-between; }

/* darker glass over the hero */
.root[data-variant="glass"] {
  background-color: color-mix(in srgb, var(--surface-bg-hero) 86%, transparent);
  border-bottom-color: color-mix(in srgb, var(--static-white) 8%, transparent);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
}

.link { min-height: 44px; }                           /* AA target size */
```

### 4.3 `SiteHeader.tsx`

```tsx
<TopNavigation
  variant="glass"
  compact
  brand={<Brand />}
  items={items}
  activeHref={activeHref}
  actions={
    <>
      <ButtonLink href="#contact" variant="primary" size="md">
        Work together
      </ButtonLink>
      <SquarePlusLink href="#contact" />
      <ThemeToggle />
    </>
  }
  menuTrigger={<MobileMenu items={items} activeHref={activeHref} />}
/>
```

Keep sticky + safe-area behavior. CTA may hide ≤767px if it would overflow (see §8).

### 4.4 New `SquarePlusLink` (navigational → a link, never `<a>` in `<button>`)

```tsx
import { Plus } from "lucide-react";
import Link from "next/link";
import styles from "./SquarePlusLink.module.css";

export function SquarePlusLink({ href }: { href: string }) {
  return (
    <Link href={href} className={styles.root} aria-label="Go to contact">
      <Plus aria-hidden="true" />
    </Link>
  );
}
```

```css
.root {
  display: inline-flex; align-items: center; justify-content: center;
  width: var(--component-size-control-md);
  height: var(--component-size-control-md);
  color: var(--icon-on-brand);
  background-color: var(--surface-control-brand);
  border: var(--stroke-width-default) solid var(--border-brand);
  border-radius: var(--radius-control-md);
  transition:
    background-color var(--motion-duration-hover) var(--motion-easing-default),
    border-color var(--motion-duration-hover) var(--motion-easing-default);
}
.root:hover, .root:focus-visible {
  background-color: var(--surface-control-brand-hover);
  border-color: var(--surface-control-brand-hover);
}
.root svg { width: var(--component-size-icon-sm); height: var(--component-size-icon-sm); }
```

**Do not globally rewrite `Button.module.css`** — existing `Button`/`ButtonLink` already meet variants, 44/52px min-heights, and semantic colors.

---

## 5. Full-screen menu — `MobileMenu.tsx` (name kept; behavior now universal)

```tsx
export function MobileMenu({ items, activeHref }: { items: NavItem[]; activeHref?: string }) {
  const [open, setOpen] = React.useState(false);
  const menuItems = [{ label: "Home", href: "#top" }, ...items];

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      side="left"
      size="full"
      title="Menu"
      trigger={<IconButton ariaLabel="Open menu" icon={<Menu />} variant="ghost" />}
    >
      <nav aria-label="Menu">
        <ul className={styles.list}>
          {menuItems.map((item) => {
            const active = activeHref === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={styles.link}
                  data-active={active || undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.marker} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className={styles.meta} aria-label="Contact">
        <p className="ts-label-md">Accepting roles and selected projects</p>
        <a href="mailto:erbonilla@outlook.com">erbonilla@outlook.com</a>
      </aside>
    </Drawer>
  );
}
```

### 5.1 `MobileMenu.module.css` — oversized links + active square

```css
.list { display: flex; flex-direction: column; gap: var(--space-stack-xs); list-style: none; margin: 0; padding: 0; }

.link {
  display: flex; align-items: center; gap: var(--space-inline-lg);
  min-height: 56px;
  padding: var(--space-inset-md) var(--space-inset-sm);
  border-radius: var(--radius-control-md);
  color: var(--static-white);
  text-decoration: none;
  font-family: var(--font-family-heading);   /* Syne */
  font-size: clamp(var(--font-size-4xl), 8vw, var(--font-size-7xl));
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-tight);
  transition:
    color var(--motion-duration-hover) var(--motion-easing-default),
    transform var(--motion-duration-hover) var(--motion-easing-default);
}

.marker { width: var(--size-4); height: var(--size-4); flex: 0 0 auto; background-color: transparent; }

.link:hover, .link:focus-visible, .link[data-active] { color: var(--text-brand); }
.link[data-active] .marker { background-color: var(--surface-bg-brand); }  /* not color-only */

.meta {
  display: flex; flex-direction: column; gap: var(--space-stack-sm);
  margin-top: var(--space-section-sm); padding-top: var(--space-inset-xl);
  border-top: var(--stroke-width-divider) solid var(--border-subtle);
  color: var(--text-muted);
}
.meta a { color: var(--static-white); overflow-wrap: anywhere; }
.meta a:hover, .meta a:focus-visible { color: var(--text-brand); }

@media (prefers-reduced-motion: no-preference) {
  .link:hover, .link:focus-visible { transform: translateX(var(--size-1)); }
}
```

### 5.2 Drawer `full` size — `Drawer.module.css` + type

```css
.content[data-size="full"] { width: 100vw; max-width: none; }
.content[data-side="left"][data-size="full"],
.content[data-side="right"][data-size="full"] { width: 100vw; }
```

```ts
type DrawerSize = "sm" | "md" | "lg" | "full";
```

Keep unchanged: `safe-top`/`safe-bottom`, scrim + slide animations, reduced-motion slide removal, focus trap, Escape close, focus return.

---

## 6. Motion model (existing semantics only)

| Motion | Token / value | Use |
|---|---:|---|
| Hero entrance | `--motion-duration-hero` (1000ms) | Staggered copy + visual |
| Layout | `--motion-duration-layout` (600ms) | Drawer/menu |
| Hover | `--motion-duration-hover` (100ms) | CTA, nav, menu |
| Expressive easing | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero / large panels |

Child stagger (keep current pattern): 0 / 80 / 140 / 190 / 240 / 280 ms. `prefers-reduced-motion: reduce` disables nonessential motion **and** the WebGL RAF loop.

---

## 7. View-mode contract

The hero is **stable in both Quick Scan and Deep Dive** — it carries core positioning. The existing `[data-view-mode="quick"]` rules continue to target only supporting detail (`tile-teaser`, `story-longform`, `tile-roles`, `range-card-desc`). Quick Scan must never strand content unreachable elsewhere.

---

## 8. Responsive behavior

| Width | Behavior |
|---:|---|
| 320–599 | Brand + menu only; portrait hidden; headline ≤ `12ch`; full-screen menu; no horizontal overflow |
| 600–767 | Full/near-full drawer; visual remains background-only; CTAs wrap |
| 768–1023 | Compact nav; WORK TOGETHER CTA visible if no overflow |
| 1024–1439 | Two-column hero: left editorial, right visual/portrait |
| ≥1440 | Container caps at `--container-max: 1320px`; visual bleeds as background only |

---

## 9. Accessibility requirements (release-gating)

No `href="#"` · no dead links · no invented metrics · icon-only controls have accessible names · active/status never color-only (orange text **+** square marker) · visible focus everywhere (`--state-focus-ring`) · menu keyboard-reachable, focus-trapped, Escape-closes, focus returns to trigger · reduced motion respected (incl. WebGL) · no horizontal overflow 320→1440 · reachable at 200% zoom · ≥44px targets · canvas never traps focus or blocks pointer interaction with controls.

Keyboard order: skip link → brand → menu → WORK TOGETHER → plus → theme → (in drawer) menu links.

---

## 10. QA checklist

- [ ] Hero copy no longer conflicts with Product DNA (no "creative designer")
- [ ] H1 = "Product UI/UX systems. / Built for pressure."
- [ ] Discipline-strip copy decision ("interfaces" vs "coaching") explicitly approved
- [ ] Hero uses `--surface-bg-hero`; sync-v2.0 tokens confirmed present in `tokens.css`
- [ ] Primary CTA orange by default; secondary subordinate
- [ ] Header safe-area padded; no horizontal overflow; menu trigger at all breakpoints
- [ ] Full-screen menu works desktop + mobile; active state = orange text + square marker
- [ ] `aria-label`s on icon-only controls; no `href="#"` introduced
- [ ] Reduced motion disables animation + WebGL loop; canvas never blocks pointer/focus
- [ ] 320 / 375 / 768 / 1024 / 1440 viewports pass
- [ ] Axe / WCAG 2.2 AA clean (existing e2e suite)
- [ ] Lighthouse PWA installable; `theme_color` / `background_color` still match `--pwa-theme-color` / `--pwa-bg-color`

---

## 11. Branch, commits, validation

```bash
git checkout -b feature/good-fella-inspired-hero

git commit -m "Align hero positioning with product UIUX DNA"
git commit -m "Refactor hero layout to editorial dark-stage composition"
git commit -m "Add compact top navigation and universal menu trigger"
git commit -m "Promote menu drawer to full-screen navigation"
git commit -m "Tune hero CTA and menu active states to Vanguard tokens"

pnpm typecheck && pnpm lint && pnpm test && pnpm build
CI=1 pnpm test:e2e
```

Per the working agreement: branch first, no direct commits to `main`, push only when asked.

---

## 12. Good Fella translation matrix (reference)

| Good Fella pattern | `(ed)studio` translation |
|---|---|
| "Your Frontend team. One monthly fee." | "Product UI/UX systems. Built for pressure." |
| Orange CTA + square plus | `Work together` brand button + `SquarePlusLink` → `#contact` |
| Minimal nav + menu trigger | Compact `TopNavigation` + universal menu |
| Dark stage | `--surface-bg-hero` permanent near-black |
| ASCII/particle person | Existing Three.js cylinder field, right-biased |
| Huge menu links, orange active marker | Full-screen Drawer, orange text + square marker |
| Contact/availability in menu | Costa Rica · open to roles · email · résumé |
| Monospace technical captions | Existing label/code typography meta strip |

---

## 13. Open items for owner

1. **"Endurance interfaces" vs "Endurance coaching"** in the discipline strip — approve one.
2. **Sync-v2.0 token presence** — confirm `--surface-bg-hero`, `--display-hero`, `--motion-duration-hero`, `--blur-glass` exist in `src/styles/tokens.css` before relying on them.
3. **Square plus on small screens** — keep focusable link or hide ≤767px to avoid overflow (recommend hide; CTA semantics preserved via the menu's contact meta).
4. **WebGL right-bias values** (`hotX - 5.6`, `hotZ - 1.6`) — Recommended starting point; tune visually in-browser.
