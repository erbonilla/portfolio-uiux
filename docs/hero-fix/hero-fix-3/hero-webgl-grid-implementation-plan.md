# Hero WebGL Cylinder-Grid — Implementation Plan

**Project:** `(ed)studio` portfolio — `portfolio-uiux`
**Stack:** Next.js (App Router) + TypeScript → Vercel
**Repo:** https://github.com/erbonilla/portfolio-uiux · **Live:** https://portfolio-uiux-smoky.vercel.app/
**Goal:** Add the `threejs-components` `grid2` WebGL cylinder field as a decorative back-layer behind the existing two-column Hero, on the brand canvas `#FF4F18`, without harming legibility, accessibility, LCP, or the no-broken-state rule.

**Approach chosen:** **Path A — vendor the prebuilt `grid2` library** (fastest, matches reference, inherits the lifecycle perf guards). Path B (hand-rolled) is recorded as the fallback in the Appendix only.

**Estimated effort:** ~1 focused day (6–8 working hours) across 7 phases.

---

## Pre-flight (do this before writing any code)

| # | Task | Done-when |
|---|---|---|
| 0.1 | Create a feature branch: `git checkout -b feat/hero-webgl-grid` | Branch exists, clean working tree |
| 0.2 | Confirm where the Hero currently lives (component path + whether it's a Server or Client Component) | You can name the file you'll edit in Phase 4 |
| 0.3 | Confirm the brand-canvas token name used in CSS (`--surface-bg-canvas` or equivalent) | Token name written into the plan's CSS in Phase 4 |
| 0.4 | Note current Lighthouse LCP element + score on the deployed hero (baseline) | Baseline numbers recorded for the Phase 6 comparison |
| 0.5 | Decide disclosure wording location (About/colophon) — you'll write it in Phase 7 | Location identified |

> **Honesty gate:** this plan ships third-party animation code. The disclosure task (Phase 7) is **not optional** and is a release blocker, consistent with your evidence-discipline rule.

---

## Phase 1 — Dependencies & vendoring

**Objective:** Get `three` and the `grid2` module into the repo as controlled, committed assets rather than runtime hot-links you don't own.

### Tasks

1.1 Install Three.js at the version the library targets:
```bash
npm i three@0.180.0
npm i -D @types/three
```

1.2 Vendor the `grid2` build into `public/`:
```bash
mkdir -p public/vendor/threejs-components
npm pack threejs-components@0.0.20
tar -xzf threejs-components-0.0.20.tgz
cp package/build/backgrounds/grid2.cdn.min.js public/vendor/threejs-components/grid2.js
rm -rf package threejs-components-0.0.20.tgz
```

1.3 **Decide the CDN-import question** (the vendored file imports `three@0.180.0` and `postprocessing` from `cdn.jsdelivr.net` at the top):
- **Option A (accept):** leave the imports; the browser fetches `three` + `postprocessing` from jsDelivr at runtime. Simpler. Acceptable for a portfolio.
- **Option B (zero runtime CDN):** edit the two top `import` lines in `public/vendor/threejs-components/grid2.js` to resolve against your bundled copies, or self-host those two modules in `public/vendor/` too.

Record your choice in the commit message. **If you keep Option A, do not later claim "no third-party runtime calls" anywhere** — that would violate the honesty rule.

1.4 Add a `texture` decision note: the library's default surface map is `/ps-buttons-black.webp` (a PlayStation-buttons sprite) which **will 404 on your domain**. You will null/override it in Phase 3 config. Flag it now so it isn't forgotten.

### Exit criteria
- `public/vendor/threejs-components/grid2.js` exists and is committed.
- `three@0.180.0` in `package.json`.
- CDN-import choice (A or B) recorded.

### Commit
```
git add . && git commit -m "chore(hero): vendor threejs-components grid2 + three@0.180 (CDN imports: <A|B>)"
```

---

## Phase 2 — The client component (SSR-safe shell)

**Objective:** A self-contained, client-only component that owns the canvas, the init, and the teardown — but with the config stubbed minimally so this phase is purely about getting *something* on screen safely.

### Task 2.1 — Create `components/HeroCylinderGrid.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";

type GridConfig = Partial<{
  type: "circle" | "hexagon" | "square" | "triangle";
  n: number;
  colors: number[];
  planeColor: number;
  light1Color: number; light1Intensity: number; light1PositionZ: number;
  light2Color: number; light2Intensity: number; light2PositionZ: number;
  materialParams: { metalness: number; roughness: number };
  timeCoef: number;
  depthScale: number;
  influenceRadius1: number;
  influenceRadius2: number;
  padding: number;
}>;

type GridFactory = (
  canvas: HTMLCanvasElement,
  config?: GridConfig
) => { three: unknown; grid: unknown; dispose: () => void };

export default function HeroCylinderGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let cancelled = false;

    import(/* webpackIgnore: true */ "/vendor/threejs-components/grid2.js")
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const createGrid = (mod.default ?? mod) as GridFactory;
        instanceRef.current = createGrid(canvasRef.current, {
          // minimal stub for Phase 2 — real tuning lands in Phase 3
          type: "circle",
          n: 20,
        });
      })
      .catch((err) => {
        console.warn("Hero grid failed to load; rendering static hero.", err);
      });

    return () => {
      cancelled = true;
      instanceRef.current?.dispose?.();
      instanceRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-grid-canvas"
      data-engine="three.js"
    />
  );
}
```

### Built-in guarantees this phase locks in
- **SSR-safe:** all `window`/`three` access is inside `useEffect`.
- **Reduced-motion:** loop never starts when the user asks for less motion.
- **No broken state:** load failure logs and renders nothing — the hero must still be perfect without it.
- **No leaks:** `dispose()` on unmount (matters for client-side navigation).

### Exit criteria
- File compiles under TypeScript with no `any` leaks beyond the typed `unknown`s.
- Importing the component anywhere does not break the build.

### Commit
```
git commit -am "feat(hero): SSR-safe HeroCylinderGrid client component (stub config)"
```

---

## Phase 3 — Brand tuning (config)

**Objective:** Replace the stub config with values that make the field read as a tonal, in-brand orange — and kill the 404 texture / blue light from the library defaults.

### Task 3.1 — Swap the config block in `HeroCylinderGrid.tsx`

```tsx
instanceRef.current = createGrid(canvasRef.current, {
  type: "circle",
  n: typeof window !== "undefined" && window.innerWidth < 768 ? 14 : 22,
  colors: [0xff4f18, 0xff6a32, 0xffd9c7],   // brand orange → warm highlights
  planeColor: 0x1a0a04,                      // deep warm shadow floor
  light1Color: 0xffffff,
  light1Intensity: 500,
  light1PositionZ: 2,
  light2Color: 0xff4f18,                     // override the default BLUE rim → warm
  light2Intensity: 800,
  light2PositionZ: -5,
  materialParams: { metalness: 0.9, roughness: 0.6 },
  timeCoef: 0.6,                             // calmer idle than default 1.0
  depthScale: 0.5,
  influenceRadius1: 10,
  influenceRadius2: 22,
});
```

### Task 3.2 — Resolve the texture 404
Confirm in DevTools Network tab whether `/ps-buttons-black.webp` is requested.
- If the untextured render already looks like clean orange cylinders → leave it; the 404 is cosmetic but **must be eliminated** (no broken requests shipped). Easiest: add an empty `public/ps-buttons-black.webp` (1×1 transparent webp) so the request 200s, **or** edit the vendored file's texture path to a neutral asset you control.
- Record which fix you used.

### Tuning order (one variable at a time, eyeball after each)
1. `n` density (18–26 desktop / ~14 mobile)
2. `depthScale` bulge height (0.4–0.7)
3. `influenceRadius1/2` crown width (tight 12/18 ↔ broad 8/26)
4. `timeCoef` idle speed (0.4–0.8)
5. light tints/intensities

> The pointer-trail weight (`lerp 0.05`) is **not** config-exposed. If you decide it must change, that's the trigger to switch to Path B — note it and stop; don't fork the vendored file casually.

### Exit criteria
- Field reads as in-brand orange, no blue rim, no 404 in Network tab.
- Looks intentional at 360 / 768 / 1440 widths.

### Commit
```
git commit -am "feat(hero): brand-tuned grid config; resolve ps-buttons texture 404"
```

---

## Phase 4 — Layout integration

**Objective:** Mount the canvas as a back-layer inside the real Hero, content above it, headline + portrait fully legible.

### Task 4.1 — Mount via `next/dynamic` (ssr:false) in the Hero

In your hero component (must be a Client Component to use `dynamic({ ssr:false })`, or wrap the dynamic import in a small client wrapper if your hero is a Server Component):

```tsx
import dynamic from "next/dynamic";

const HeroCylinderGrid = dynamic(() => import("@/components/HeroCylinderGrid"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="hero">
      <HeroCylinderGrid />
      <div className="hero-content">
        {/* existing left column (positioning copy) + right column (portrait) */}
      </div>
    </section>
  );
}
```

> If the current Hero is a Server Component and you don't want to convert it, create `components/HeroGridMount.tsx` ("use client") that does the `dynamic` import, and render that single client island inside the server Hero.

### Task 4.2 — CSS (back-layer, readability scrim, reduced-motion fallback)

```css
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--surface-bg-canvas, #ff4f18);  /* use your real token */
}

.hero-grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  -webkit-mask-image: radial-gradient(120% 120% at 60% 40%, #000 55%, transparent 100%);
          mask-image: radial-gradient(120% 120% at 60% 40%, #000 55%, transparent 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

/* legibility scrim behind copy/portrait so text never fights the pegs */
.hero-content::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(255, 79, 24, 0.92) 0%,
    rgba(255, 79, 24, 0.35) 45%,
    transparent 70%
  );
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-grid-canvas { display: none; }   /* belt-and-suspenders with the JS guard */
}
```

### Exit criteria
- Canvas sits behind content; clicking/selecting hero text works (canvas `aria-hidden`, content `z-index:1`).
- Headline and portrait legible at all breakpoints with the scrim.
- Reduced-motion: canvas absent, hero still complete and balanced.

### Commit
```
git commit -am "feat(hero): integrate WebGL grid as back-layer with legibility scrim + reduced-motion fallback"
```

---

## Phase 5 — Mobile & performance hardening

**Objective:** Confirm the inherited lifecycle guards work and the hero stays smooth on mid-range hardware.

### Tasks
5.1 **Density already responsive** via the `n` ternary in Phase 3 — verify the smaller `n` actually applies on a real/emulated phone.

5.2 **Verify auto-pause off-screen:** scroll the hero out of view, watch DevTools Performance / console — rendering should stop (the library uses an IntersectionObserver). Scroll back → resumes.

5.3 **Verify tab-hidden pause:** switch tabs, confirm the loop halts (visibilitychange).

5.4 **LCP check:** confirm the LCP element is your headline/portrait, **not** the canvas (it should be — canvas is `ssr:false` + dynamic, mounts post-hydration). Compare to the Phase 0.4 baseline.

5.5 **If jank on mid-range phones:** the heavy cost is the 2048² soft shadow map, which is **not** config-exposed. Options, in order of preference: (a) accept it, (b) lower `n` further on mobile, (c) Path-B-only: edit shadow map size in a forked file. Do **not** silently fork without noting it.

### Exit criteria
- Smooth (no visible stutter) on a mid-range Android emulation.
- Off-screen and hidden-tab pausing both confirmed.
- LCP not regressed vs. baseline.

### Commit
```
git commit -am "perf(hero): verify off-screen/hidden pause + responsive density; LCP unchanged"
```

---

## Phase 6 — QA & acceptance (evidence-labelled)

Run the full checklist. Use your portfolio's evidence vocabulary on each row so the result is auditable.

| # | Check | Target label |
|---|---|---|
| 6.1 | Canvas renders behind hero content; headline fully legible | Measured |
| 6.2 | Pointer crown follows cursor with the heavy lerp trail | Measured |
| 6.3 | `prefers-reduced-motion: reduce` → no canvas, hero still complete | Measured |
| 6.4 | Off-screen scroll pauses the render loop | Measured |
| 6.5 | Hidden tab pauses the render loop | Measured |
| 6.6 | Unmount / client-side route change calls `dispose()`, no GL context warning | Measured |
| 6.7 | **No 404s in Network tab** (texture resolved) | Measured |
| 6.8 | Looks intentional at 360 / 768 / 1024 / 1440 | Measured |
| 6.9 | Keyboard/screen-reader: canvas absent from a11y tree (`aria-hidden`) | Measured |
| 6.10 | Third-party animation lib disclosed (Phase 7) | Documented |

**Release rule:** any row that can't reach its target label is a blocker. A correct static hero beats a flashy broken one — same principle as "a three-panel honest Hub beats a five-panel theatrical one."

---

## Phase 7 — Disclosure & docs (release blocker)

**Objective:** Keep the credibility mechanism intact — disclose the third-party code the same way AI assistance is disclosed.

### Tasks
7.1 Add a colophon/About line, e.g.:
> "Hero background uses the open-source `threejs-components` (grid2) WebGL field, configured and integrated by me; tuning, layout, accessibility, and reduced-motion handling are mine."

7.2 If you kept Option A in Phase 1.3 (runtime jsDelivr imports), make sure no copy anywhere claims zero third-party runtime calls.

7.3 Update your versioned documentation set (delta over the current version, per your workflow) with: the Path-A decision, the CDN-import choice, the texture-404 fix used, and the config values shipped.

### Exit criteria
- Disclosure line live on the deployed site.
- Doc-set delta recorded.

### Commit + ship
```
git commit -am "docs(hero): disclose threejs-components usage; record decisions + shipped config"
git push -u origin feat/hero-webgl-grid
# open PR → preview deploy on Vercel → re-run Phase 6 on the preview URL → merge
```

---

## Rollback plan

If the effect causes problems post-merge:
1. **Fast disable (no revert):** the hero must already be complete without the canvas (Phase 2 guarantee). Setting `.hero-grid-canvas { display:none }` or feature-flagging the `<HeroCylinderGrid />` mount instantly returns the static hero.
2. **Full revert:** `git revert` the feature merge; vendored files and `three` dep go with it.
3. Because the canvas is decorative and isolated, neither path touches hero content or layout.

---

## Sequenced summary

| Phase | Output | Blocker? |
|---|---|---|
| 0 Pre-flight | branch, baseline, decisions | — |
| 1 Deps & vendoring | committed `grid2.js` + `three` | — |
| 2 Component | SSR-safe canvas shell | — |
| 3 Tuning | in-brand orange, no 404/blue | — |
| 4 Layout | back-layer + scrim + RM fallback | — |
| 5 Perf | responsive density, pause verified | — |
| 6 QA | evidence-labelled checklist | **yes** |
| 7 Disclosure | colophon line + doc delta | **yes** |

---

## Appendix — Path B (fallback only)

If a requirement forces hand-rolling (e.g. you must change the `lerp 0.05` trail weight or the 2048² shadow map, neither config-exposed), reimplement in raw `three`:

1. `InstancedMesh(latheGeometry, material, nx*ny)` — lathe profile: outer radius → quarter-sine rounded rim → revolve, 24 segments.
2. Half-cell row-staggered offset grid layout.
3. `PerspectiveCamera` at `(0,−25,30)` lookAt `(0,0,−10)`; `OrbitControls` `enableDamping`, `dampingFactor 0.1`, same target.
4. Two `PointLight`s repositioned to the smoothed pointer each frame; soft shadows.
5. Pointer: `pointermove` → NDC → `Raycaster` onto invisible plane → world point; `pointerPosition.lerp(target, 0.05)` per frame.
6. Per-instance: band `(1−smoothstep(d,r1,r2))*smoothstep(d,0,r1)` × `0.5*(cos(phase+t)+1)` × `depthScale` → instance Z; `setMatrixAt`; height color `mix(planeColor, pegColor, smoothstep(z,0,depthScale/2))`; `instanceMatrix.needsUpdate = true`.
7. Re-implement the IntersectionObserver + visibilitychange pause guards yourself (you lose them when you leave the library).

A stock `MeshPhysicalMaterial` (`metalness ~0.9`) gets ~90% of the look; the library's subsurface-scattering term mainly affects thin-peg rim glow and can be skipped.

---

## Config reference (library defaults — for comparison)

```js
{
  type: "circle", n: 50, padding: 0,
  light1Color: 0xffffff, light1Intensity: 500, light1PositionZ: 2,
  light2Color: 0x0000ff, light2Intensity: 1000, light2PositionZ: -5,  // default BLUE — override
  planeColor: 0x202020,
  colors: [0xffffff, 0xffffff],
  materialParams: { metalness: 1, roughness: 1 },
  timeCoef: 1, depthScale: 0.5, influenceRadius1: 10, influenceRadius2: 20,
}
```
Hard-coded (not config; Path-B levers): camera `(0,−25,30)`/lookAt`(0,0,−10)`; OrbitControls damping 0.1; pointer/color/light lerp 0.05; 24 lathe segments; soft shadows 2048²; `minPixelRatio:2`; `cameraMaxAspect:1`; default texture `/ps-buttons-black.webp`.
