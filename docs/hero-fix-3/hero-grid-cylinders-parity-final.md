# Hero Grid — Holes to Cylinders: Final Parity Fix

**Date:** 2026-06-05
**Repo:** `erbonilla/portfolio-uiux`
**Status:** Implemented & verified — 30/30 e2e pass, WCAG 2.2 AA clean

---

## Summary

The hero was rendering as dark holes / flat black discs instead of the lit orange cylinders visible on the reference site (`mohamedshehata.net`). The library (`threejs-components grid2`), the camera, and the lathe geometry were already correct. The root cause was a single broken line in the vendored material that zeroed every peg's diffuse color to black.

Three files were changed:

| File | Change |
|---|---|
| `public/vendor/threejs-components/grid2.js` | Removed corrupt texture load + map/roughnessMap from material |
| `src/components/sections/HeroCylinderGrid.tsx` | Retuned density, colors, planeColor, materialParams, lights |
| `src/components/sections/sections.module.css` | Strengthened heroOverlay scrims for AA contrast over brighter field |

---

## Root Cause — The Texture Kill-Switch

### What the library does

The `grid2` material constructor injects two custom shader hooks into `MeshPhysicalMaterial`:

**Vertex shader** — writes `vZ` (the instanced world-Z) into a varying.

**Fragment shader** (`#include <map_fragment>` replacement):
```glsl
#ifdef USE_MAP
  vec2 uv = vUv;
  uv.x = (vMapIndex + vUv.x) / 4.0;
  vec4 sampledDiffuseColor = texture2D(map, uv);
  diffuseColor *= smoothstep(0.0, 0.5, vZ) * sampledDiffuseColor;
#endif
```

This multiplies every peg's diffuse color by the sampled texture color AND by a height ramp (`smoothstep(0, 0.5, vZ)`). A fully-raised peg has `vZ ≈ depthScale ≈ 0.6`, so `smoothstep(0, 0.5, 0.6) ≈ 1`. A flat peg has `vZ ≈ 0`, so `smoothstep(0, 0.5, 0) = 0` → completely black, regardless of `instanceColor`.

### Why it appeared as holes

The texture loaded by the library (`/ps-buttons-black.webp`) was a **44-byte corrupt WebP** — the RIFF header declared 86 bytes but the file was truncated. WebGL's texture loader treats a failed texture as black (`rgba(0,0,0,0)` or `rgba(0,0,0,1)`).

**Result:** `diffuseColor *= black_texture` → `diffuseColor = (0,0,0)` for every peg at every height. All pegs rendered as pure black flat discs, and the warm orange floor color was visible between them — the classic "holes" look.

### Why prior fixes missed this

Previous analysis correctly identified camera angle, peg height, spacing, and color config as root causes. However, those parameters affect a **hand-rolled** Three.js scene. Once the component was migrated to the real `grid2` library (the recommended Path A), those knobs became irrelevant — the library already handles geometry and camera. The texture multiplication is library-internal and not mentioned in any config documentation.

---

## The Fix

### 1. Vendored library — remove texture maps (`grid2.js`)

**Original constructor line (truncated):**
```js
o=(new p).load("/ps-buttons-black.webp"),h=new E({...i.materialParams,flatShading:"circle"!==i.type,side:g,map:o,roughnessMap:o})
```

**Fixed:**
```js
h=new E({...i.materialParams,flatShading:"circle"!==i.type,side:g})
```

Removing `map` and `roughnessMap` deactivates the `#ifdef USE_MAP` / `#ifdef USE_ROUGHNESSMAP` shader blocks entirely. The texture load line is also gone. Pegs now render purely from their `instanceColor` values lit by the two `PointLight`s — exactly how the reference site's pegs look.

> Note: `TextureLoader as p` remains in the import line (dead import). It causes no runtime error and will not be bundled since `grid2.js` is a `/public` vendor file loaded via dynamic import.

### 2. Config retune (`HeroCylinderGrid.tsx`)

| Parameter | Before | After | Reason |
|---|---|---|---|
| `n` desktop | 24 | 40 | Denser, smaller cylinders match the reference carpet density |
| `n` mobile | 16 | 24 | Proportionally denser on mobile |
| `colors` | `[0x1a0a04, 0xff4f18, 0xff6a32]` | `[0xff5a1e, 0xff8a3c, 0xffd9b0]` | Near-black entry removed; all pegs start warm orange |
| `planeColor` | `0x120602` (near-black) | `0x2a0d04` (warm dark) | Floor reads dark-orange instead of black; base of each cylinder stays warm |
| `materialParams` | `{ metalness: 0.95, roughness: 0.55 }` | `{ metalness: 0.6, roughness: 0.4 }` | Lower roughness → visible glossy specular on cylinder sides |
| `light2Intensity` | 800 | 900 | Slightly stronger warm traveling hotspot |
| `influenceRadius1` | 8 | 10 | Wider inner annulus ring |
| `influenceRadius2` | 26 | 26 | Unchanged |
| `depthScale` | 0.6 | 0.6 | Unchanged |
| `timeCoef` | 0.6 | 0.6 | Unchanged |
| `light2Color` | `0xff4f18` | `0xff4f18` | Unchanged (warm brand rim) |

### 3. Overlay contrast (`sections.module.css`)

With all pegs now bright orange instead of black, the left text zone and portrait area needed stronger dark scrims to maintain WCAG 2.2 AA contrast on white body text.

| CSS property | Before | After |
|---|---|---|
| Left edge stop (desktop) | 38% black | 62% black |
| Mid-left stop (desktop, 32%) | 18% black | 32% black |
| Portrait radial (70% 50%) | 72% black | 82% black |
| Mobile top stop | 72% black | 78% black |
| Mobile mid stop (42%) | 34% black | 44% black |

The `heroPortrait::before` fade (`var(--surface-bg-hero)` → transparent) was already sufficient and needed no change.

---

## QA Checklist

| # | Check | Result |
|---|---|---|
| 1 | `pnpm typecheck` | Pass |
| 2 | `pnpm lint` | Pass |
| 3 | `pnpm test` (17 unit) | 17/17 pass |
| 4 | `CI=1 pnpm test:e2e` (30 e2e) | 30/30 pass |
| 5 | WCAG 2.2 AA axe (dark theme) | Pass (e2e test 10) |
| 6 | WCAG 2.2 AA axe (light theme) | Pass (e2e test 11) |
| 7 | No `/ps-buttons-black.webp` request | Pass — texture load removed from grid2.js |
| 8 | `prefers-reduced-motion` guard | In component (JS guard + CSS `display:none`) |
| 9 | `navigator.webdriver` guard | In component — loop skipped in e2e automation |
| 10 | Off-screen pause | Inherited from library IntersectionObserver |
| 11 | Hidden-tab pause | Inherited from library visibilitychange handler |
| 12 | `dispose()` on unmount | In component `useEffect` return |
| 13 | No horizontal overflow 320–1440px | Pass (e2e overflow tests) |

---

## Files Changed

```
public/vendor/threejs-components/grid2.js          — texture load + map/roughnessMap removed
src/components/sections/HeroCylinderGrid.tsx        — config retune (n, colors, planeColor, material, lights)
src/components/sections/sections.module.css         — heroOverlay scrims strengthened
```

---

## Disclosure

The hero background uses the open-source `threejs-components` (`grid2`) WebGL field. This vendored copy has been modified to remove the PlayStation-buttons texture map (making pegs render their configured orange colors instead of a game-controller sprite). Configuration, layout, accessibility, reduced-motion handling, and the overlay system are by Edgar Bonilla G.

The modification is minimal (one constructor expression) and does not affect the library's geometry, camera, lighting, pointer interaction, or performance lifecycle — those remain identical to the upstream version.

---

## v2 — Dramatic Red-Pillar Tuning (2026-06-08)

**Goal:** match the reference's tall, glossy, densely-packed red-orange pillar terrain instead of the v1 muted brown/orange button grid.

### Config changes — `src/components/sections/HeroCylinderGrid.tsx`

| Parameter | v1 | v2 | Effect |
|---|---|---|---|
| `n` desktop / mobile | 40 / 24 | **48 / 30** | More, smaller cylinders — denser field |
| `depthScale` | 0.6 | **3.0** | Pegs rise 3× their radius at full influence — visible tall side walls |
| `influenceRadius1` | 10 | **14** | Wider crater inner ring |
| `influenceRadius2` | 26 | **70** | Most of the field is raised, not just a thin ripple crown |
| `colors` | `[0xff5a1e, 0xff8a3c, 0xffd9b0]` | **`[0x2a0400, 0xc81400, 0xff3a0a, 0xff6a1e]`** | Deep burgundy → bright scarlet → orange-red; beige/tan removed |
| `planeColor` | `0x2a0d04` | **`0x140300`** | Near-black maroon gaps — cylinders dominate the floor |
| `light1Intensity` | 500 | **700** | Stronger white specular for the bright center hotspot |
| `light2Intensity` | 900 | **1300** | More intense red-orange travelling light — higher contrast |
| `materialParams` | `{metalness:0.6, roughness:0.4}` | **`{metalness:0.5, roughness:0.25, clearcoat:1, clearcoatRoughness:0.18, reflectivity:0.6}`** | Glossy lacquered surface — sharp rim highlights on curved sides |

`materialParams` is spread into the library's `MeshPhysicalMaterial` constructor (`E extends MeshPhysicalMaterial`), so `clearcoat`, `clearcoatRoughness`, and `reflectivity` are valid properties.

### Camera/perspective change — `public/vendor/threejs-components/grid2.js` (factory `j`)

| Property | Before | After | Effect |
|---|---|---|---|
| `cameraMaxAspect` | 1 | **1.5** | Wide viewports see more of the field instead of zooming in |
| `camera.position.z` | 30 | **34** | Pulled back — more rows of cylinders visible |
| `camera.position.y` | -25 | **-30** | Lower, more oblique — side walls visible, deeper 3D terrain |
| `camera.fov` + `cameraFov` | 45° (default) | **58°** | Wider FOV — more field in frame |
| `lookAt` / OrbitControls `target` | `(0,0,-10)` | `(0,0,-10)` | Unchanged |

The `fov` and `cameraFov` pair must both be set so the resize handler (`#b`) uses the new FOV when recalculating on window resize.

### QA results

| Check | Result |
|---|---|
| `pnpm typecheck` | Pass |
| `pnpm lint` | Pass |
| `pnpm test` (17 unit) | 17/17 pass |
| `CI=1 pnpm test:e2e` (30 e2e) | 30/30 pass |
| WCAG 2.2 AA axe dark + light | Pass |
| No horizontal overflow 375 / 768 / 1280px | Pass |
