# Hero Grid — "Holes → Cylinders" Fix Plan

**Symptom (your screenshot, Image 1):** the hero shows big flat black **discs in shallow orange wells** — it reads as a sheet of *holes*, not a field of cylinders.
**Reference (Image 2):** tightly packed **standing cylinders** with visible side walls, warm-lit, low oblique camera, a crater carved around the cursor.

This document pinpoints exactly why yours renders as holes and gives two fix routes: **(A) a precise patch to your current hand-rolled file** (fastest path to "looks right"), and **(B) the full library migration** (canonical match). Both are below; do A now if you want an immediate fix, or skip to B for the real thing.

---

## 1. Root cause — why it's holes, not cylinders

Read directly from `src/components/sections/HeroCylindersBackground.tsx`. Four compounding causes, in order of impact:

### Cause 1 — Pegs are flat at rest (the big one)
```
const BASE_HEIGHT = 0.08;   // line 44
item.targetHeight = item.baseHeight + totalInfluence * MAX_HEIGHT;  // line 231
```
At rest `totalInfluence ≈ 0`, so **every cylinder is 0.08 units tall** — basically a coin lying flat. Only the handful of pegs under the cursor ever stand up. So the *default* state of the whole field is flat dark tops. **A field of flat dark tops over an orange floor IS the "holes" look.** The reference keeps every peg tall all the time.

### Cause 2 — Camera looks straight down the barrels
```
camera.position.set(0, 12.5, 13.5);  // line 73 — high, steep
camera.lookAt(0, 0, 0);
```
You view the pegs from nearly above, so you see their **tops**, never their **side walls**. A cylinder only reads as a cylinder when you can see its vertical wall. The reference camera is low and oblique (`pos 0,−25,30`, `lookAt 0,0,−10`) — you see the sides of every peg.

### Cause 3 — Spacing leaves the floor showing
```
const SPACING = 0.74;  CYLINDER_RADIUS = 0.28;  // gap ≈ 0.18 between rims
```
The orange floor shows through the gaps between flat discs → reinforces "wells / holes." The reference packs pegs almost touching (`radius = 50/n`), so there's no floor gap in the lit zone.

### Cause 4 — Dark, self-lit material
```
color: BASE_COLOR ('#050505'), metalness: 0.12,
emissive: '#210300', emissiveIntensity: 0.42
```
Near-black tops with low metalness barely catch the warm light, so tops stay black (the "hole" fill). The reference uses bright orange `colors` with high `metalness` so the cylinder bodies glow.

**Net:** flat + top-down + gappy + dark = holes. Fix any one and it improves; fix all four and it becomes cylinders.

---

## 2. ROUTE A — Patch the current hand-rolled file (fast fix)

Keeps your existing architecture; just corrects the four causes. Edit `HeroCylindersBackground.tsx`.

### A1. Make pegs tall at rest (Cause 1) — most important
Replace the geometry constants (lines 40–45):
```ts
const GRID_X          = 30;
const GRID_Z          = 30;
const SPACING         = 0.58;   // ↓ from 0.74 — pack tighter (Cause 3)
const CYLINDER_RADIUS = 0.27;   // gap now ~0.04, nearly touching
const BASE_HEIGHT     = 2.4;    // ↑↑ from 0.08 — pegs STAND at rest (Cause 1)
const MAX_HEIGHT      = 2.6;    // extra rise added by the cursor on top of base
```
Then change the height formula so the cursor carves a **crater** out of tall pegs (not the only thing that makes them rise). Replace line 231:
```ts
// pegs are tall by default; the pointer pushes a localized swell ABOVE base,
// and the idle wave gently varies height so the field breathes.
item.targetHeight =
  item.baseHeight
  + pointerInfluence * MAX_HEIGHT      // local swell near cursor
  + ambientWave * 0.8;                  // subtle breathing everywhere
```
Remove the `compositionalHotspot` term entirely (the baked bright corner is not in the reference and fights the look). Delete lines computing `hotX/hotZ/compositionalHotspot` and drop it from `totalInfluence` — or simply set `compositionalHotspot = 0`.

### A2. Lower, oblique camera (Cause 2) — second most important
Replace lines 72–74:
```ts
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 7.5, 15.5);   // lower & further back → see the SIDES
camera.lookAt(0, 1.2, -3);            // aim slightly down-field, like the reference
```
(If you want the reference's stronger recline, push toward `position (0, 5, 18)`, `lookAt (0, 1.5, -5)`. Tune live.)

### A3. Tighter packing is already done in A1 (Cause 3) via `SPACING 0.58`.

### A4. Brighter, warmer material so bodies glow (Cause 4)
Replace the material (lines ~108–113):
```ts
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ff4f18'),  // bodies are ORANGE, not near-black
  roughness: 0.42,
  metalness: 0.65,                      // ↑ catches the warm light
  emissive: new THREE.Color('#1a0500'),
  emissiveIntensity: 0.18,              // ↓ less self-lit; let lights do the work
});
```
And make the **color model continuous** instead of 4 hard buckets. Replace the if/else block (the `targetColor.copy(...)` ladder) with a height-driven mix:
```ts
// continuous gradient: dark floor → hot → peak by how tall/influenced the peg is
const c = item.targetColor;
c.copy(MID_COLOR).lerp(HOT_COLOR, clamp01(totalInfluence * 1.6));
c.lerp(PEAK_COLOR, clamp01((totalInfluence - 0.55) * 2.2));
```
Keep `currentColor.lerp(targetColor, 0.08)` as-is for smoothing.

### A5. Reduce fog so tall pegs aren't swallowed
```ts
scene.fog = new THREE.FogExp2('#0a0200', 0.035);  // ↓ from 0.055
```

### A6. Add a simple contact shadow feel (optional but sells depth)
Full shadow maps are heavy; cheap alternative — darken peg bases via vertex-ish trick is non-trivial in instanced meshes, so either accept no shadows for Route A or move to Route B which has real soft shadows. If you want shadows now:
```ts
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mesh.castShadow = true; mesh.receiveShadow = true;
key.castShadow = true;        // the directional light
// add a ground plane to receive:
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x0a0200 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
```

### Route A expected result
Tall packed orange cylinders seen from the side, a warm swell that follows the cursor, smooth color. It will look *much* closer. It still won't be pixel-identical to the reference because the camera framing, the annulus crater math, the lathe rounded-rim tops, and the 2-light chase differ — for those, do Route B.

### Route A acceptance
- [ ] At rest, the field is **standing cylinders**, not flat discs — Measured
- [ ] Side walls visible (camera is oblique) — Measured
- [ ] No orange floor gaps between pegs in the lit area — Measured
- [ ] Cursor pushes a localized swell; no static bright corner — Measured
- [ ] Color is a smooth gradient, no 4-step banding — Measured
- [ ] Headline/portrait still legible (re-check the left scrim) — Measured

---

## 3. ROUTE B — Migrate to the real `grid2` library (canonical match)

This is the only way to get the *exact* reference look, because the crater shape, rounded-rim geometry, 2-light pointer chase, scale-to-fill, and soft shadows are all baked into the library and tuned by its author. Summary (full steps in the prior parity plan):

1. **Vendor it:**
   ```bash
   npm i three@0.180.0
   mkdir -p public/vendor/threejs-components
   npm pack threejs-components@0.0.20
   tar -xzf threejs-components-0.0.20.tgz
   cp package/build/backgrounds/grid2.cdn.min.js public/vendor/threejs-components/grid2.js
   rm -rf package threejs-components-0.0.20.tgz
   ```
2. **Replace the component body** to call the factory against a `<canvas>` (keep the file name + wrapper so `HeroSection.tsx` is untouched):
   ```tsx
   import(/* webpackIgnore: true */ '/vendor/threejs-components/grid2.js').then((mod) => {
     const createGrid = (mod.default ?? mod);
     instanceRef.current = createGrid(canvasRef.current, {
       type: 'circle',
       n: window.innerWidth < 768 ? 16 : 24,   // dense
       colors: [0x1a0a04, 0xff4f18, 0xff6a32],  // mostly-dark field + hot pegs (matches Image 2)
       planeColor: 0x120602,
       light1Color: 0xffffff, light1Intensity: 500, light1PositionZ: 2,
       light2Color: 0xff4f18, light2Intensity: 800, light2PositionZ: -5,  // warm, NOT blue
       materialParams: { metalness: 0.95, roughness: 0.55 },
       timeCoef: 0.6, depthScale: 0.6, influenceRadius1: 8, influenceRadius2: 26,
     });
   });
   ```
   Delete the entire hand-rolled scene (geometry, instance loop, lights, raycaster) — that code is the source of every divergence.
3. **Texture 404:** the library requests `/ps-buttons-black.webp`. Add a 1×1 transparent webp at that path or edit the vendored path. No broken requests ship.
4. **`light2` defaults to BLUE** in the library — override to warm as shown, or you'll get blue rims.
5. **Inherit free perf:** off-screen pause, hidden-tab pause, resize, pixel-ratio cap all come with it; delete your hand-rolled equivalents.
6. **Disclose** the library in your colophon (release blocker) and record the Path B→A reversal in your doc-set.

In `grid2`, the reference's signature crater comes from its **annulus influence** `(1−smoothstep(d,r1,r2))·smoothstep(d,0,r1)` plus per-peg idle bob — the exact thing your hand-roll lacks. Widening `influenceRadius1/2` to `8/26` gives the broad crater visible in Image 2.

---

## 4. Recommendation

- **Want it fixed today, keep your code:** do **Route A**. The two lines that matter most are `BASE_HEIGHT 0.08 → 2.4` and the camera `(0,12.5,13.5) → (0,7.5,15.5)`. Those alone turn holes into cylinders.
- **Want it to actually match the reference:** do **Route B**. It's less code to maintain and inherits the crater + shadows + lights you'd otherwise have to re-derive.

Either way, the legibility caveat stands: the reference keeps copy over the dark zone; your hero puts a portrait where the bright cylinders are, so re-check contrast after the field brightens.

---

## Appendix — the two highest-leverage numbers

| Change | From | To | Fixes |
|---|---|---|---|
| `BASE_HEIGHT` | `0.08` | `~2.4` | Pegs stand at rest (Cause 1) — **#1 fix** |
| `camera.position.y / z` | `12.5 / 13.5` | `~7.5 / 15.5` | See cylinder sides (Cause 2) — **#2 fix** |
| `SPACING` | `0.74` | `~0.58` | Close floor gaps (Cause 3) |
| `material.color` / `metalness` | `#050505` / `0.12` | `#ff4f18` / `0.65` | Bodies glow (Cause 4) |
| color buckets | 4 hard if/else | continuous `lerp/mix` | No banding |
| `compositionalHotspot` | baked corner | remove (`0`) | Kills the static bright patch |
