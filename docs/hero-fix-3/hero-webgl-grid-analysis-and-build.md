# Hero WebGL Cylinder-Grid — Deep Analysis & Implementation Guide

**Reference section:** `mohamedshehata.net` hero / `.numbered-section.exp-fit` (the "Areas of Specialisation" block)
**Target:** `(ed)studio` portfolio Hero section — `portfolio-uiux` (Next.js + TypeScript → Vercel)
**Effect identity:** WebGL instanced "orange cylinders" grid that reacts to the pointer, driven by the open-source `threejs-components` library (`grid2` background).
**Repo:** https://github.com/erbonilla/portfolio-uiux · **Live:** https://portfolio-uiux-smoky.vercel.app/

> Status of this document: **Analysis is Documented** (read directly from the shipped `grid2.cdn.min.js` source, v0.0.20, and the markup you pasted). **Config values for your build are Recommended** starting points, not measurements of Shehata's exact tuning — his site overrides the library defaults and those overrides are not publicly readable. Where a number is the library default it is labelled **Documented**; where it is a suggested value for your brand it is labelled **Recommended**.

---

## PART 1 — DEEP TECHNICAL ANALYSIS (no implementation)

### 1.1 What the section actually is

The markup you pasted is the giveaway. The relevant nodes:

```html
<canvas id="exp-cyl-canvas" aria-hidden="true" data-engine="three.js r170" ...></canvas>
<!-- comment in source: WebGL orange cylinders grid (threejs-components Grid2Background) -->
```

This is **not** a hand-rolled shader. It is the `grid2` background from the npm package **`threejs-components`** (by the author who publishes the "VANTA-like" background collection). The site loads the prebuilt ES module and calls its default-export factory against the `<canvas>`. The `data-engine="three.js r170"` attribute is Three.js stamping the renderer; the library itself pins `three@0.180.0` internally.

The visible result — a tilted plane of short cylindrical "pegs" that bulge up toward the cursor under a warm light — is produced by **one `InstancedMesh`** of lathe-built cylinder geometry, lit by **two `PointLight`s that chase the pointer**, sitting on a receiving plane. Everything you see is that single instanced mesh plus its shadow on the plane.

### 1.2 Layout & structure (DOM + scene graph)

**DOM layer (what the browser composits):**

| Layer | Element | Role |
|---|---|---|
| Back | `<canvas id="exp-cyl-canvas" aria-hidden="true">` | Full-bleed WebGL background. `display:block`, sized to parent. `aria-hidden` because it is decorative. |
| Front | `.exp-content` (header, `<h2>`, the `.h-list` two-column list) | Real, selectable, accessible content layered **over** the canvas with normal z-stacking. |

The canvas is sized to its **parent** (`size:"parent"` in the library), not the window — so it fills the section, not the viewport. In the snippet it computed to `2005×884`. The content (`.ns-header`, `.ns-h2`, `.h-list`) is ordinary DOM with its own reveal animations (`.reveal.in`, stagger class `.d1`) that are **independent of the WebGL** — those are CSS/IO-driven fade-ins, not part of the Three scene.

**Scene graph (inside the canvas):**

```
Scene
└── InstancedMesh  (count = nx × ny cylinders)         ← the pegs
    ├── geometry: LatheGeometry (24 radial segments)   ← "cylinder" w/ rounded top edge
    ├── material: custom MeshPhysicalMaterial subclass ← adds subsurface-scattering term
    ├── PointLight #1  (warm/white, high intensity, +Z) ← follows pointer
    ├── PointLight #2  (blue-ish, lower, −Z)            ← follows pointer, rim/fill
    └── Mesh plane (100×100)                            ← receives shadow, gives the "floor"
Camera: PerspectiveCamera, position (0, −25, 30), lookAt (0,0,−10)   ← the signature tilt
OrbitControls (damped) targeting (0,0,−10)              ← subtle parallax, not user-zoom in practice
Raycaster → invisible plane → world-space pointer point ← drives the bulge + the lights
```

The **camera tilt** (`y = −25`, `z = 30`, looking at `z = −10`) is what makes the grid read as a receding floor rather than a flat wall. That single camera transform is most of the "expensive-looking" feel.

### 1.3 Geometry — why it looks like cylinders

The peg is **not** a `CylinderGeometry`. It's a `LatheGeometry` built from a hand-authored 2-D profile that is revolved. The profile starts at the outer radius, then walks a quarter-sine curve to round off the top rim (`Math.sin((e+1)/o * PI/2)`), giving a **cylinder with a softly chamfered top edge** rather than a hard 90° lip. Default radial segments:

- `type:"circle"` (the grid2 default) → **24 segments** → smooth cylinder
- `hexagon` → 6, `square` → 4, `triangle` → 3 (the library can also do faceted variants)

Height of each peg ≈ `10 × radius`; `radius = 50 / n` where `n` is the grid density. So density and peg size are coupled: more pegs ⇒ thinner pegs.

The pegs are laid out by a generator (`#O`) on an offset grid. For the circle type the rows are offset by half a cell (`t%2/2`) — a **brick/hex offset**, not a square lattice — which is why the field looks organic rather than checkerboard.

### 1.4 Mouse interaction — the exact mechanism

This is the heart of the effect. Three things track the pointer, all routed through one raycast:

1. **Pointer → world point.** A `pointermove` listener (library's own pointer manager, attached to `document.body`, filtered to the canvas rect) produces a normalized device coordinate. A `Raycaster` shoots from the camera through that NDC onto the **invisible plane** (`intersectObject(plane)`). The hit point is divided by the mesh scale to get a grid-space target `r`.

2. **Smoothed follow (the "weight").** The raw target `r` is **not** used directly. Every frame:
   ```
   grid.pointerPosition.lerp(r, 0.05)
   ```
   A 0.05 lerp factor = a heavy, ~liquid trailing motion. The bulge and the lights lag the cursor by roughly a dozen frames, which is the "premium" damped feel. (Lower = heavier/slower, higher = snappier.)

3. **Per-peg displacement.** In the per-instance update (`#k`), for each peg the code computes the planar distance `c` from peg to `pointerPosition`, then a smooth falloff band:
   ```
   l = (1 − smoothstep(c, influenceRadius1, influenceRadius2))  // outer fade-out
        × smoothstep(c, 0, influenceRadius1)                    // inner fade-in
   ```
   This is a **ring/annulus influence**: pegs very close and pegs far away are pushed least; pegs in the mid-band rise most — that's the subtle "ripple crown" around the cursor rather than a single spike. Then:
   ```
   z = idleBob × depthScale × l
   ```
   where `idleBob = 0.5 × (cos(perInstancePhase + time) + 1)` is a per-peg sine oscillation (each peg has a random phase `#A`), so even at rest the field breathes. Defaults: `depthScale:0.5`, `influenceRadius1:10`, `influenceRadius2:20`.

4. **Lights chase too.** Both `PointLight`s are repositioned every frame to `(pointerPosition.x, pointerPosition.y, ±Z)`. So the **highlight travels with the cursor**, which is what sells the 3-D — the bulge alone would be flat without the moving specular.

5. **Per-peg color lerp.** Each peg's color eases toward its target (`#P.lerp(#M, 0.05)`), and the final color is mixed between the plane color and the peg color by height (`mix(planeColor, pegColor, smoothstep(z, 0, depthScale/2))`). Risen pegs brighten; flat ones sink into the floor color. This is the gradient-shimmer you see under the cursor.

**On pointer leave** (`onLeave`): the target is reset to `(0,0)` (raycast with no coords), so the crown migrates back to center and the field settles to its idle breathing.

### 1.5 Animation behavior, states & timing

| Property | Value | Source |
|---|---|---|
| Render loop | `requestAnimationFrame`, delta-timed via `THREE.Clock` | Documented |
| Idle animation | per-peg sine bob, frequency scaled by `timeCoef` | Documented (`timeCoef:1`) |
| Pointer follow easing | `lerp 0.05` per frame (~heavy trail) | Documented |
| Color follow easing | `lerp 0.05` per frame | Documented |
| Light color/intensity easing | `lerp 0.05` toward `color2/intensity2` | Documented |
| Camera | Perspective, `pos(0,−25,30)`, `lookAt(0,0,−10)` | Documented |
| OrbitControls | `enableDamping:true`, `dampingFactor:0.1`, target `(0,0,−10)` | Documented |
| Shadows | `PCFSoftShadowMap`, 2048² shadow map on light #1 | Documented |
| Pixel ratio | `minPixelRatio:2`, capped by device | Documented |
| Camera aspect | `cameraMaxAspect:1` (portrait-biased framing) | Documented |

**Lifecycle / perf states (built into the library, free):**
- **IntersectionObserver** on the canvas: rendering **auto-stops when the canvas scrolls out of view** and resumes on re-entry. (`Start rendering` / `Stop rendering` console logs come from here.)
- **visibilitychange**: pauses on hidden tab, resumes on focus.
- **ResizeObserver** on the parent: debounced 100 ms resize.

These three are why the effect doesn't tank battery — it only runs when visible. You inherit them for free.

### 1.6 The one detail people miss

The library's default surface texture map is **`/ps-buttons-black.webp`** — a PlayStation-buttons sprite atlas (the package ships a "DualSense buttons" demo). Each peg samples one of 4 sub-tiles via a `mapIndex` instanced attribute. **Shehata's site overrides this** to plain orange, so the pegs read as solid cylinders, not buttoned caps. For your build you will either (a) point `map` at a neutral/transparent texture, or (b) use the variant without a map and rely on `colors` + material. This is the single most important override to get the clean "orange cylinder" look instead of the demo's gamepad look. **Plan to supply your own texture path or null it out** — the default path will 404 on your domain and the pegs will render untextured (which, conveniently, is close to what you want).

---

## PART 2 — IMPLEMENTATION INSTRUCTIONS (Next.js + TypeScript + Vercel)

> Goal: same animation, layered **behind** your existing two-column Hero (text left, portrait right) on the brand canvas `#FF4F18`. The cylinders should read as a tonal, near-monochrome orange field so they don't fight the portrait or the headline.

### 2.0 Decision up front: vendored library vs. hand-rolled

You have two honest paths. Pick one and record the rationale (your stack-decision discipline).

- **Path A — use `threejs-components` `grid2` (recommended).** Fastest, matches the reference exactly, inherits the perf lifecycle. Cost: a ~16 KB module + `three@0.180` + `postprocessing` pulled from jsDelivr at runtime, and a dependency you didn't write. **Disclosure obligation:** this is third-party animation code — note it in your About/colophon the same way you disclose AI assistance. Consistent with your evidence-discipline rule.
- **Path B — reimplement the instanced-grid yourself in raw `three`.** Full control, no CDN runtime dep, nothing to disclose beyond "Three.js". Cost: you re-author the lathe profile, the influence-band math, the pointer raycast, and the lifecycle observers (≈150 lines). Section 2.6 sketches this.

The instructions below default to **Path A** and flag where Path B diverges.

### 2.1 Install

You do not strictly need npm for Path A (the library imports `three` from a CDN internally), but vendoring is cleaner on Vercel and avoids a runtime CDN dependency in your critical path. Recommended:

```bash
npm i three@0.180.0
npm i three-stdlib            # OrbitControls if you go Path B
```

For Path A you will load the library's prebuilt module. The robust option is to **copy the file into your repo** rather than hot-link jsDelivr, so a CDN outage can't break your hero:

```bash
# from repo root
mkdir -p public/vendor/threejs-components
npm pack threejs-components@0.0.20
tar -xzf threejs-components-0.0.20.tgz
cp package/build/backgrounds/grid2.cdn.min.js public/vendor/threejs-components/grid2.js
```

> Note: `grid2.cdn.min.js` itself imports `three@0.180.0` and `postprocessing` from `cdn.jsdelivr.net`. If you want **zero** runtime CDN calls you must edit those two `import` lines at the top of the copied file to point at your bundled paths, or accept the CDN fetch. For a portfolio this CDN fetch is acceptable; just be aware of it. (Honesty note: don't claim "no third-party runtime calls" if you keep the jsDelivr imports.)

### 2.2 The component (SSR-safe)

Three.js touches `window`/`document`, so the canvas component must be **client-only** and the init must run in `useEffect`. Create `components/HeroCylinderGrid.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

type GridConfig = Partial<{
  type: "circle" | "hexagon" | "square" | "triangle";
  n: number;                 // density; pegs = roughly n×n for circle
  colors: number[];          // hex ints, e.g. [0xff4f18, 0xff7a3c]
  planeColor: number;        // the "floor" color
  light1Color: number; light1Intensity: number; light1PositionZ: number;
  light2Color: number; light2Intensity: number; light2PositionZ: number;
  materialParams: { metalness: number; roughness: number };
  timeCoef: number;          // idle-bob speed
  depthScale: number;        // bulge height
  influenceRadius1: number;  // inner ring
  influenceRadius2: number;  // outer ring
  padding: number;
}>;

// Default export of grid2.js is a factory: (canvas, config) => { three, grid, dispose }
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

    // Respect reduced-motion: do not start the loop at all.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let cancelled = false;

    // Dynamic import keeps three out of the server bundle and out of the
    // initial client bundle until the hero mounts.
    import(/* webpackIgnore: true */ "/vendor/threejs-components/grid2.js")
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const createGrid = (mod.default ?? mod) as GridFactory;
        instanceRef.current = createGrid(canvasRef.current, {
          type: "circle",
          n: 22,
          // Brand canvas #FF4F18 → keep the field tonal & near-mono:
          colors: [0xff4f18, 0xff6a32, 0xffd9c7],
          planeColor: 0x1a0a04,          // deep warm shadow floor
          light1Color: 0xffffff,
          light1Intensity: 500,
          light1PositionZ: 2,
          light2Color: 0xff4f18,         // warm rim instead of the demo's blue
          light2Intensity: 800,
          light2PositionZ: -5,
          materialParams: { metalness: 0.9, roughness: 0.6 },
          timeCoef: 0.6,                 // calmer idle than the default 1.0
          depthScale: 0.5,
          influenceRadius1: 10,
          influenceRadius2: 22,
        });
      })
      .catch((err) => {
        // Fail silent & invisible — the hero must still read perfectly
        // without the canvas. This is the honesty/no-broken-state rule.
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

Key points baked in above, each tied to one of your principles:
- **`prefers-reduced-motion` short-circuits the whole thing** (accessibility, and your "honest, no theatrics" stance).
- **Failure renders nothing, never a broken canvas** (your no-dead-state rule).
- **`dispose()` on unmount** — the factory returns a `dispose` that tears down listeners and GL context. Wiring it prevents leaks on route changes (you're an SPA-ish Next app).
- `aria-hidden="true"` matches the reference and keeps it out of the a11y tree.

### 2.3 Layering it into your existing Hero

Your Hero is two-column (text left, portrait right) on the brand canvas. Put the canvas as an absolutely-positioned **back layer** inside the hero section, content above it:

```tsx
// app/(home)/Hero.tsx  (or wherever your hero lives) — client component
import dynamic from "next/dynamic";

const HeroCylinderGrid = dynamic(() => import("@/components/HeroCylinderGrid"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="hero">
      <HeroCylinderGrid />
      <div className="hero-content">
        {/* your existing left column (positioning copy) + right column (portrait) */}
      </div>
    </section>
  );
}
```

```css
/* hero styles */
.hero {
  position: relative;
  isolation: isolate;            /* new stacking context; keeps canvas behind */
  overflow: hidden;
  background: var(--surface-bg-canvas, #ff4f18);
}
.hero-grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  /* let the brand canvas bleed through edges so the grid feels embedded */
  -webkit-mask-image: radial-gradient(120% 120% at 60% 40%, #000 55%, transparent 100%);
          mask-image: radial-gradient(120% 120% at 60% 40%, #000 55%, transparent 100%);
}
.hero-content {
  position: relative;
  z-index: 1;                    /* above the canvas */
}
/* portrait readability: optional left-edge scrim so text stays legible over the field */
.hero-content::before {
  content: "";
  position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg, rgba(255,79,24,0.92) 0%, rgba(255,79,24,0.35) 45%, transparent 70%);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-grid-canvas { display: none; }   /* belt-and-suspenders with the JS guard */
}
```

The `mask-image` radial and the left scrim are what keep your **headline legible** — Shehata's grid sits behind sparse content; yours sits behind a portrait + paragraph, so you need the readability gradient or the copy will fight the pegs.

### 2.4 Tuning to match the reference feel (Recommended starting values)

Adjust in this order, one at a time:

1. **`n` (density).** 18–26. Higher = finer, more "screen of pegs"; lower = chunkier. Mobile: drop to ~14 (see 2.5).
2. **Pointer trail weight.** This is the `lerp 0.05` inside the library loop — to make it heavier/lighter without editing the vendored file, you can't from config; if you need it, that's a reason to go Path B. The default 0.05 already matches the reference's premium drag.
3. **`depthScale`.** 0.4–0.7. Higher = taller bulge under cursor.
4. **`influenceRadius1/2`.** Widen the gap (e.g. 8 / 26) for a broader, gentler crown; narrow it (12 / 18) for a tight, punchy ripple.
5. **`timeCoef`.** 0.4–0.8 for a calm portfolio idle; 1.0 is the lively default.
6. **Lights.** Keep `light1` white and bright for the specular travel; tint `light2` warm (`0xff4f18`) so the rim stays in-brand instead of the demo's blue `0x0000ff`.

### 2.5 Mobile & performance

- **Density down on small screens.** Read `window.innerWidth` in the effect and pass a smaller `n` (e.g. `< 768 ? 14 : 22`).
- **The library already** caps pixel ratio, pauses off-screen (IntersectionObserver) and on hidden tab. You inherit this — don't rebuild it.
- **Shadows are the heavy cost** (2048² soft shadow map). If you see jank on mid-range phones, that's the first thing to dial back — but it requires editing the vendored file (it's not exposed in config), so treat shadow-trimming as a Path-B-only lever.
- **LCP:** the canvas is decorative and lazy (`ssr:false`, dynamic import). Ensure your headline/portrait are the LCP element, not the canvas. They will be, because the canvas mounts after hydration.

### 2.6 Path B sketch (if you reimplement instead of vendoring)

If you'd rather own the code (no CDN runtime calls, nothing extra to disclose), the minimum faithful reproduction is:

1. `InstancedMesh(latheGeometry, material, nx*ny)` — build the lathe profile exactly as in 1.3 (outer radius → quarter-sine rounded rim → revolve, 24 segments).
2. Offset grid layout with half-cell row stagger (1.3).
3. `PerspectiveCamera` at `(0,−25,30)` looking at `(0,0,−10)`; `OrbitControls` with `enableDamping`, `dampingFactor 0.1`, same target.
4. Two `PointLight`s repositioned to the smoothed pointer each frame; soft shadows.
5. Pointer: `pointermove` → NDC → `Raycaster` onto an invisible plane → world point; store as target; `pointerPosition.lerp(target, 0.05)` per frame.
6. Per-instance update: distance band `(1−smoothstep(d,r1,r2))*smoothstep(d,0,r1)`, times per-peg `0.5*(cos(phase+t)+1)`, times `depthScale` → instance Z; `setMatrixAt`; height-based color `mix(planeColor, pegColor, smoothstep(z,0,depthScale/2))`; `instanceMatrix.needsUpdate = true`.
7. Wrap the loop in your own IntersectionObserver + visibilitychange guards so it doesn't run off-screen.

You can skip the subsurface-scattering material override (1.1) — a stock `MeshPhysicalMaterial` with `metalness ~0.9` gets you 90% of the look. The scattering term mostly affects the rim glow on thin pegs.

### 2.7 Acceptance checklist (your evidence-label vocabulary)

| Check | Label when done |
|---|---|
| Canvas renders behind hero content, headline fully legible | Measured (eyeball at 360px, 768px, 1440px) |
| Pointer crown follows cursor with the heavy lerp trail | Measured |
| `prefers-reduced-motion: reduce` → no canvas, hero still complete | Measured |
| Off-screen scroll pauses the render loop (check console / DevTools perf) | Measured |
| Unmount/route-change calls `dispose()`, no GL context leak | Measured |
| No 404s in network tab (texture path nulled or supplied) | Measured |
| Third-party animation lib disclosed in colophon/About | Documented |
| Default `/ps-buttons-black.webp` not silently 404ing | Measured |

### 2.8 Honesty / disclosure note (non-optional for your portfolio)

Path A ships code you didn't author. Your portfolio's credibility mechanism is that you disclose assistance and don't pass others' work as your own. Add a one-liner wherever you already disclose AI assistance, e.g.:

> "Hero background uses the open-source `threejs-components` (grid2) WebGL field, configured and integrated by me; tuning, layout, accessibility, and reduced-motion handling are mine."

That sentence is both accurate and flattering — it shows you can integrate and harden third-party WebGL, which is the real recruiter signal here.

---

## Appendix — Library config reference (Documented defaults, from grid2 source v0.0.20)

```js
{
  type: "circle",          // circle | hexagon | square | triangle
  n: 50,                   // grid density (note: 50 is dense; 18–26 reads better behind content)
  padding: 0,
  light1Color: 0xffffff, light1Intensity: 500, light1PositionZ: 2,
  light2Color: 0x0000ff, light2Intensity: 1000, light2PositionZ: -5,   // default light2 is BLUE — override to warm
  planeColor: 0x202020,
  colors: [0xffffff, 0xffffff],
  materialParams: { metalness: 1, roughness: 1 },
  timeCoef: 1,
  depthScale: 0.5,
  influenceRadius1: 10,
  influenceRadius2: 20,
}
```

Hard-coded (not in config — Path-B levers only): camera `(0,−25,30)`/lookAt`(0,0,−10)`; OrbitControls damping 0.1; pointer/color/light lerp 0.05; 24 lathe segments for `circle`; soft shadows 2048²; `minPixelRatio:2`; `cameraMaxAspect:1`; default texture map `/ps-buttons-black.webp`.
