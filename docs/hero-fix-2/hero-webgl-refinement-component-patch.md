# Hero WebGL Component Refinement Patch

## Target File

Patch:

```txt
src/components/sections/HeroCylindersBackground.tsx
```

This document provides targeted code changes rather than a full file replacement.

## 1. Add a Low-Intensity Color

Near the existing palette constants, add `LOW_COLOR`.

Current shape:

```ts
const BASE_COLOR = new THREE.Color('#070202');
const MID_COLOR = new THREE.Color('#5a1606');
const HOT_COLOR = new THREE.Color('#ff4f18');
const PEAK_COLOR = new THREE.Color('#ff7a3d');
```

Recommended shape:

```ts
const BASE_COLOR = new THREE.Color('#070202');
const LOW_COLOR = new THREE.Color('#220700');
const MID_COLOR = new THREE.Color('#5a1606');
const HOT_COLOR = new THREE.Color('#ff4f18');
const PEAK_COLOR = new THREE.Color('#ff7a3d');
```

## 2. Tune Camera Angle

The reference has a more oblique, editorial perspective. Replace the camera setup with:

```ts
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(-3.4, 10.6, 14.8);
camera.lookAt(-2.2, 0, -1.8);
```

If this pushes the grid too low, use the safer variant:

```ts
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(-2.8, 11.4, 14.2);
camera.lookAt(-2.0, 0, -1.2);
```

## 3. Keep Material Base Color White

This is mandatory. Do not regress to a dark material color.

Correct:

```ts
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ffffff'),
  roughness: 0.42,
  metalness: 0.16,
  emissive: new THREE.Color('#250500'),
  emissiveIntensity: 0.34,
});
```

Incorrect:

```ts
const material = new THREE.MeshStandardMaterial({
  color: BASE_COLOR.clone(),
});
```

The instance colors will be visually crushed if the base material color is dark.

## 4. Add Organic Base Height Variation

Inside the grid population loop, replace simple jitter/base height logic with deterministic variation.

Recommended:

```ts
const px = x * SPACING - offsetX;
const pz = z * SPACING - offsetZ;

const noise =
  Math.sin(x * 1.37 + z * 0.91) * 0.5 +
  Math.sin(x * 0.47 - z * 1.63) * 0.5;

const baseHeight = BASE_HEIGHT + noise * 0.018;
```

Then use `baseHeight` consistently:

```ts
instances.push({
  x: px,
  z: pz,
  baseHeight,
  currentHeight: baseHeight,
  targetHeight: baseHeight,
  currentColor: BASE_COLOR.clone(),
  targetColor: BASE_COLOR.clone(),
});

dummy.position.set(px, baseHeight / 2, pz);
dummy.scale.set(1, baseHeight, 1);
```

## 5. Slow the Ambient Animation

Inside `animate(time: number)`, reduce the global timebase.

Replace:

```ts
const t = reduceMotion ? 0 : time * 0.00075;
```

With:

```ts
const t = reduceMotion ? 0 : time * 0.00042;
```

Then reduce the ambient wave:

```ts
const ambientWave = reduceMotion
  ? 0
  : Math.max(0, Math.sin(t + item.x * 0.46 + item.z * 0.39)) * 0.08;
```

This makes the background feel heavier and less busy.

## 6. Replace the Single Hotspot With Two Compositional Hotspots

Replace the existing compositional hotspot logic with this:

```ts
const primaryHotspot =
  1 - smoothstep(0, 6.8, Math.hypot(item.x + 5.6, item.z - 1.8));

const secondaryHotspot =
  1 - smoothstep(0, 4.2, Math.hypot(item.x + 1.8, item.z + 1.2));

const rightSideFade = smoothstep(-1.5, 9.5, item.x);

const compositionalInfluence =
  (primaryHotspot * 0.72 + secondaryHotspot * 0.32) *
  (1 - rightSideFade * 0.68);
```

Purpose:

- Stronger activity behind text.
- Less activity near portrait.
- Less full-width grid wallpaper effect.

## 7. Add Right-Side and Rear Dampening

After compositional influence is calculated, add:

```ts
const rightFade = smoothstep(1.5, 10.5, item.x);
const rearFade = smoothstep(5.5, 10.5, item.z);

const visibilityDampening =
  1 - clamp01(rightFade * 0.55 + rearFade * 0.25);
```

Then compute `totalInfluence` like this:

```ts
const totalInfluence = clamp01(
  (pointerInfluence * 0.9 + ambientWave + compositionalInfluence) *
    visibilityDampening,
);
```

This keeps the right side mostly dark and closer to the reference.

## 8. Add a CTA Readability Valley

The current cylinders rise strongly behind the CTA area. Add a local reduction zone.

Before `totalInfluence`, add:

```ts
const ctaX = item.x + 4.2;
const ctaZ = item.z + 3.4;

const ctaValley =
  1 - smoothstep(0, 2.4, Math.hypot(ctaX, ctaZ));
```

Then subtract it lightly:

```ts
const totalInfluence = clamp01(
  (
    pointerInfluence * 0.9 +
    ambientWave +
    compositionalInfluence -
    ctaValley * 0.22
  ) * visibilityDampening,
);
```

If the CTA zone becomes too visually empty, reduce the subtraction:

```ts
ctaValley * 0.14
```

## 9. Add Column Height Variation

Replace:

```ts
item.targetHeight = item.baseHeight + totalInfluence * MAX_HEIGHT;
```

With:

```ts
const columnVariation =
  0.88 + Math.sin(item.x * 0.73 + item.z * 1.17) * 0.16;

item.targetHeight =
  item.baseHeight + totalInfluence * MAX_HEIGHT * columnVariation;
```

This breaks the uniform “bar chart” look.

## 10. Improve Color Resolution

Replace a basic three-step color selection with this:

```ts
if (totalInfluence > 0.84) {
  item.targetColor.copy(PEAK_COLOR);
} else if (totalInfluence > 0.52) {
  item.targetColor.copy(HOT_COLOR);
} else if (totalInfluence > 0.22) {
  item.targetColor.copy(MID_COLOR);
} else if (totalInfluence > 0.06) {
  item.targetColor.copy(LOW_COLOR);
} else {
  item.targetColor.copy(BASE_COLOR);
}
```

This gives a darker transition ramp, closer to the reference.

## 11. Increase Pointer Inertia

Replace pointer smoothing:

```ts
pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.085);
pointerTargetWorld.lerp(pointerWorld, reduceMotion ? 1 : 0.13);
```

With:

```ts
pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.055);
pointerTargetWorld.lerp(pointerWorld, reduceMotion ? 1 : 0.085);
```

Then replace height/color smoothing:

```ts
item.currentHeight = lerp(
  item.currentHeight,
  item.targetHeight,
  reduceMotion ? 1 : 0.105,
);

item.currentColor.lerp(
  item.targetColor,
  reduceMotion ? 1 : 0.09,
);
```

With:

```ts
item.currentHeight = lerp(
  item.currentHeight,
  item.targetHeight,
  reduceMotion ? 1 : 0.075,
);

item.currentColor.lerp(
  item.targetColor,
  reduceMotion ? 1 : 0.065,
);
```

The pointer reaction will feel more viscous and less snappy.

## 12. Keep Window-Level Pointer Tracking

The refined interaction should continue using window-level tracking, not canvas-only tracking.

Required pattern:

```ts
const stage = mount.closest('section') ?? mount;

window.addEventListener('pointermove', updatePointerFromEvent, {
  passive: true,
});
window.addEventListener('pointerleave', onPointerLeaveWindow);
```

Cleanup:

```ts
window.removeEventListener('pointermove', updatePointerFromEvent);
window.removeEventListener('pointerleave', onPointerLeaveWindow);
```

Do not attach pointer tracking only to the canvas mount. The foreground Hero content sits above the canvas and can otherwise interfere with interaction consistency.

## 13. Tuning Values

If the refined field is too dark:

```ts
primaryHotspot * 0.72
```

Increase to:

```ts
primaryHotspot * 0.82
```

If the portrait zone is still too busy:

```ts
rightSideFade * 0.68
```

Increase to:

```ts
rightSideFade * 0.78
```

If the CTA valley is too obvious:

```ts
ctaValley * 0.22
```

Reduce to:

```ts
ctaValley * 0.14
```

If pointer response feels too slow:

```ts
0.055
```

Increase to:

```ts
0.07
```
