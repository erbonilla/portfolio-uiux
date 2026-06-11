# Hero Cylinder-Grid — Parity Fix & Migration Plan

**Why this exists:** the deployed hero (`HeroCylindersBackground.tsx`) is a *hand-rolled* approximation of the effect on `mohamedshehata.net`. Side-by-side with the reference screenshot and the actual library source, the differences are **structural, not cosmetic** — so no amount of tweaking the current file will close the gap. This plan fixes that.

**Decision:** migrate from the current hand-rolled Three.js scene (Path B) to the **real `threejs-components` `grid2` library** (Path A), then tune. Rationale recorded in §1.

**Stack:** Next.js (App Router) + TS → Vercel. Repo `erbonilla/portfolio-uiux`.
**Files in scope:** `src/components/sections/HeroCylindersBackground.tsx`, `HeroSection.tsx`, `sections.module.css`.

> Evidence labels used throughout (your portfolio vocabulary): **Documented** = read from the shipped `grid2` source or your repo; **Recommended** = suggested value to tune; **Measured** = to be confirmed in-browser during QA.

---

## 1. Root-cause comparison (why it doesn't match)

Read from your `HeroCylindersBackground.tsx` vs. the `grid2` source (v0.0.20) and the reference screenshot. Each row is a **real divergence**, ranked by visual impact.

| # | Aspect | Reference (`grid2`) — Documented | Your code — Documented | Why it looks different |
|---|---|---|---|---|
| 1 | **Packing density** | `radius = 50/n`, hex-offset rows, pegs **nearly touching** — a dense carpet | `SPACING 0.74` with `CYLINDER_RADIUS 0.28` → gaps ≈ peg width | Yours reads as a sparse *lawn*; reference is a packed *carpet*. **Biggest single difference.** |
| 2 | **Geometry** | `LatheGeometry`, 24 seg, **rounded top rim**, height ≈ `10×radius` (tall) | `CylinderGeometry` flat-top, base `height=1` then scaled | Hard-edged short pegs vs. soft-topped tall cylinders |
| 3 | **Camera / tilt** | `pos(0,−25,30)`, `lookAt(0,0,−10)`, aspect-driven fov, `cameraMaxAspect:1` | `pos(0,12.5,13.5)`, fov 38, `lookAt(0,0,0)` | Different recline → the reference's "looking across a field" tilt is absent |
| 4 | **Displacement shape** | **Annulus**: `(1−smoothstep(d,r1,r2))·smoothstep(d,0,r1)` → ring/crater crown; plus always-on per-peg idle bob | single `1−smoothstep(0,radius,d)` spike + a **baked-in "compositional hotspot"** offset cluster | Reference carves a traveling crater; yours pushes a blob and has a static bright corner |
| 5 | **Color model** | Continuous height lerp: `mix(planeColor, pegColor, smoothstep(z,0,depthScale/2))` | **4 hard buckets** (BASE/MID/HOT/PEAK via if/else) | Yours bands into steps; reference is a smooth gradient |
| 6 | **Lights** | **2 PointLights** chase the pointer (intensity 500 / 800), color-eased | 1 Directional + 1 Point, different positions/chase | Reference has a single traveling warm specular; yours is flatter/ambient |
| 7 | **Pointer follow** | `lerp 0.05` everywhere (heavy, liquid trail) | mixed `0.08 / 0.12 / 0.1` | Yours is snappier, less "weighted" |
| 8 | **Shadows** | `PCFSoftShadowMap`, 2048², pegs cast/receive | none | Reference pegs have contact shadow → depth; yours float |
| 9 | **Material** | custom `MeshPhysicalMaterial` + subsurface scattering, `metalness 1` | `MeshStandardMaterial`, `metalness 0.12`, emissive | Reference has waxy rim-glow; yours is matte + self-lit |
| 10 | **Scale-to-fill** | mesh auto-scales to viewport (`wWidth/100*1.6`) | fixed world units | Reference always fills; yours can under/overfill by aspect |

**Conclusion:** items 1–4 alone guarantee a different look, and they're baked into the architecture of the hand-roll (geometry type, spacing constants, camera, influence math). Re-deriving all of `grid2` by hand is exactly the work the library already did. Adopt it.

> Honesty note: the reference uses third-party code. Adopting `grid2` is therefore *more* honest than shipping a hand-roll that imitates it without credit — you'll disclose it (Phase 6).

---

## 2. Target outcome (what "the same" means)

From the screenshot, parity = all of:
- Dense, nearly-touching cylinders filling the right ~65% of the band.
- A traveling warm hotspot with deep near-black falloff; one bright point.
- Tall pegs with soft tops; visible contact shadows giving depth.
- A crater/valley that follows the cursor, not a single bump.
- Smooth color gradient from near-black floor → orange → bright peak.
- Left third readable for the headline (their layout keeps copy off the dense zone).

---

## 3. Migration plan (phased)

### Phase 0 — Branch & baseline
```bash
git checkout -b fix/hero-grid-parity
```
- Screenshot current hero at 1440/768/360 for before/after.
- Record current Lighthouse LCP (baseline).

---

### Phase 1 — Vendor the real library
```bash
npm i three@0.180.0
mkdir -p public/vendor/threejs-components
npm pack threejs-components@0.0.20
tar -xzf threejs-components-0.0.20.tgz
cp package/build/backgrounds/grid2.cdn.min.js public/vendor/threejs-components/grid2.js
rm -rf package threejs-components-0.0.20.tgz
```
**Decide the CDN-import question** (the file imports `three` + `postprocessing` from jsDelivr at runtime):
- Accept it (simplest), **or** self-host those two modules under `public/vendor/` and rewrite the two top `import` lines.
- Record the choice; do not claim "no third-party runtime calls" if you keep the jsDelivr imports.

**Texture 404:** the library requests `/ps-buttons-black.webp` (a gamepad sprite). It will 404 on your domain. Either drop a 1×1 transparent `public/ps-buttons-black.webp` so the request 200s, or edit the texture path in the vendored file. **No broken requests ship** (your rule).

---

### Phase 2 — Replace the component body

Rewrite `HeroCylindersBackground.tsx` to drive the library instead of a hand-built scene. Keep the same file name and the same `<div ref>` mount contract so `HeroSection.tsx` needs no change.

```tsx
'use client';

import { useEffect, useRef } from 'react';

type GridConfig = Partial<{
  type: 'circle' | 'hexagon' | 'square' | 'triangle';
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
  config?: GridConfig,
) => { three: unknown; grid: unknown; dispose: () => void };

export default function HeroCylindersBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const instanceRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;

    import(/* webpackIgnore: true */ '/vendor/threejs-components/grid2.js')
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const createGrid = ((mod as { default?: GridFactory }).default ??
          (mod as unknown as GridFactory)) as GridFactory;

        const small = window.innerWidth < 768;
        instanceRef.current = createGrid(canvasRef.current, {
          type: 'circle',
          n: small ? 16 : 24,             // dense carpet — match reference packing
          colors: [0xff4f18, 0xff6a32, 0xffd9c7],
          planeColor: 0x120602,           // near-black warm floor
          light1Color: 0xffffff,
          light1Intensity: 500,
          light1PositionZ: 2,
          light2Color: 0xff4f18,          // warm, NOT the default blue
          light2Intensity: 800,
          light2PositionZ: -5,
          materialParams: { metalness: 0.95, roughness: 0.55 },
          timeCoef: 0.6,
          depthScale: 0.5,
          influenceRadius1: 10,
          influenceRadius2: 22,
        });
      })
      .catch((err) => {
        console.warn('Hero grid failed; static hero remains.', err);
      });

    return () => {
      cancelled = true;
      instanceRef.current?.dispose?.();
      instanceRef.current = null;
    };
  }, []);

  // The library sizes the canvas to its PARENT, so the wrapper must have size.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
```

**Delete** all the hand-rolled scene code (geometry constants, instance loop, manual lights, manual raycaster). That removal is the point — the divergences in §1 live there.

> Note on the mount: the library reads `size:"parent"` and sizes to `canvas.parentNode`. Your existing `.heroCanvas` wrapper (`position:absolute; inset:0`) already provides that box, so it works unchanged. Confirm the wrapper has non-zero height at mount.

---

### Phase 3 — Tune to the screenshot (one knob at a time)

Match the *reference look*, verifying after each change:

1. **Density (`n`)** — start 24. The screenshot is dense; if pegs look sparse, raise toward 26–28. Mobile 14–16. *(fixes §1.1)*
2. **`depthScale`** — 0.5 → raise to ~0.6–0.7 for the taller "wall around the crater" read. *(§1.4)*
3. **`influenceRadius1/2`** — widen to ~8 / 26 for the broad crater in the shot; narrow for a tighter ripple. *(§1.4)*
4. **`planeColor`** — keep very dark warm (`0x120602`) so falloff goes near-black like the reference. *(§1.5)*
5. **`light2`** — warm orange, intensity ~800; this is the traveling hotspot. Confirm it is NOT blue. *(§1.6)*
6. **`timeCoef`** — 0.5–0.7 calm idle.
7. **`colors`** — `[0xff4f18, 0xff6a32, 0xffd9c7]`; add a near-black entry first (`[0x1a0a04, 0xff4f18, 0xff6a32]`) if you want more pegs sitting dark and fewer lit, matching the screenshot's mostly-dark field.

Knobs **not** exposed by config (these are why the hand-roll drifted; only touch via a documented fork): pointer `lerp 0.05`, camera transform, 24 lathe segments, shadow map size. The defaults already match the reference — leave them.

---

### Phase 4 — Layout & legibility (match their composition)

The reference keeps copy in the **left third** over the darkest part of the field; the dense lit cylinders sit right. Your hero is two-column (copy left, portrait right) — so the bright zone would collide with your portrait. Two options:

- **Option A (closest to reference):** bias the grid's hotspot/composition right-of-center and ensure the portrait has its own solid/gradient backing so cylinders don't muddy it. Your `.heroPortrait::before` already masks; verify it still reads over the brighter field.
- **Option B:** keep the existing left-scrim (`.heroOverlay`) and simply ensure contrast. Strengthen the left gradient stop if the headline loses legibility against newly-brighter pegs.

CSS check in `sections.module.css`:
```css
/* already present — verify these still hold with the denser, brighter grid */
.heroCanvas { position:absolute; inset:0; z-index: var(--z-index-base); overflow:hidden; }
.heroOverlay { /* keep; bump the left black stop toward 88% if text contrast drops */ }
.hero > :global(.container) { position:relative; z-index:2; }
```
Re-test AA contrast on the headline and `.heroMeta` over the brightest frame of the animation. *(fixes the legibility risk introduced by §1.1/§1.5 brightness)*

---

### Phase 5 — Performance & lifecycle

The library brings its own IntersectionObserver (pause off-screen), visibilitychange (pause hidden tab), debounced ResizeObserver, and pixel-ratio cap — **you inherit all of it** and should delete your hand-rolled equivalents (they're gone with the rewrite).

Verify (Measured):
- Scroll hero out of view → render loop stops (console logs `Stop rendering`).
- Hidden tab → pauses.
- Route change → `dispose()` runs, no GL-context-lost warning.
- Mobile (`n=16`) is smooth; if not, lower `n` before touching shadows.
- LCP unchanged vs. Phase 0 baseline (canvas is `ssr:false` + dynamic import, so headline/portrait stay the LCP element).

---

### Phase 6 — Disclosure & docs (release blocker)

1. Add a colophon/About line:
   > "Hero background uses the open-source `threejs-components` (grid2) WebGL field; configuration, layout, accessibility, and reduced-motion handling are mine."
2. If you kept the jsDelivr runtime imports (Phase 1), ensure no copy claims zero third-party runtime calls.
3. Update your versioned doc-set (delta) with: the **Path B → Path A reversal and its rationale** (hand-roll could not reach parity; library is canonical and more honest), the CDN-import choice, the texture-404 fix, and the shipped config. This mirrors your earlier Vite → Next.js reversal record.

---

### Phase 7 — QA acceptance (evidence-labelled)

| # | Check | Target |
|---|---|---|
| 7.1 | Side-by-side with reference screenshot: density, tilt, crater, hotspot all read as "same family" | Measured |
| 7.2 | Smooth color gradient (no 4-step banding) | Measured |
| 7.3 | Traveling warm specular follows cursor with heavy trail | Measured |
| 7.4 | Headline + portrait legible over brightest frame (AA) | Measured |
| 7.5 | `prefers-reduced-motion` → no canvas, hero complete | Measured |
| 7.6 | Off-screen + hidden-tab pause confirmed | Measured |
| 7.7 | No 404 (texture resolved); no console errors | Measured |
| 7.8 | `dispose()` on unmount, no leak | Measured |
| 7.9 | Library disclosed; doc delta recorded | Documented |

Any row short of target = release blocker. A correct static hero beats a flashy mismatched one.

---

## 4. Rollback

- The hero is complete without the canvas (reduced-motion + failure paths prove it). Feature-flag or `display:none` the canvas to revert instantly.
- Full revert: `git revert` the merge; vendored files + `three` go with it.
- The old hand-rolled file is in git history if you ever want it back — but the whole point of this plan is that it can't reach parity, so prefer the library.

---

## 5. If you must stay hand-rolled (not recommended)

If for some reason you keep Path B, the **minimum** changes to approach parity, in priority order:
1. Cut `SPACING` to ≈ `2 × CYLINDER_RADIUS` (touching pegs) and raise `GRID_X/Z` to refill. *(§1.1)*
2. Swap `CylinderGeometry` for a `LatheGeometry` with a rounded-rim profile, taller pegs. *(§1.2)*
3. Move camera to `pos(0,−25,30)`, `lookAt(0,0,−10)`. *(§1.3)*
4. Replace the single-falloff + baked hotspot with the annulus formula `(1−smoothstep(d,r1,r2))·smoothstep(d,0,r1)` and a per-peg idle bob. *(§1.4)*
5. Replace the 4 color buckets with a continuous `lerp/mix` by height. *(§1.5)*
6. Two pointer-chasing PointLights; drop the directional. *(§1.6)*
7. Unify pointer follow to a single heavy `lerp 0.05`. *(§1.7)*
8. Enable `PCFSoftShadowMap` + per-instance cast/receive. *(§1.8)*

That list is essentially "rebuild `grid2`," which is why Path A is the recommendation.

---

## Appendix — `grid2` config defaults (Documented, v0.0.20)
```js
{
  type:'circle', n:50, padding:0,
  light1Color:0xffffff, light1Intensity:500, light1PositionZ:2,
  light2Color:0x0000ff, light2Intensity:1000, light2PositionZ:-5,  // default BLUE → override warm
  planeColor:0x202020, colors:[0xffffff,0xffffff],
  materialParams:{ metalness:1, roughness:1 },
  timeCoef:1, depthScale:0.5, influenceRadius1:10, influenceRadius2:20,
}
```
Hard-coded (not config): camera `(0,−25,30)`/lookAt`(0,0,−10)`; OrbitControls damping 0.1; pointer/color/light lerp 0.05; 24 lathe segments; soft shadows 2048²; `minPixelRatio:2`; `cameraMaxAspect:1`; texture `/ps-buttons-black.webp`; mesh scale-to-fill `wWidth/100*1.6`.
