# Hero Refinement — Consolidated Code Reference

This file consolidates the most important code snippets from the refinement pass. Use it as a reference while patching the existing files.

## WebGL Influence Model

Use this inside the `for` loop in `animate(time: number)` after calculating pointer distance.

```ts
const pointerInfluence =
  activeBoost * (1 - smoothstep(0, pointerRadius, dist));

const ambientWave = reduceMotion
  ? 0
  : Math.max(0, Math.sin(t + item.x * 0.46 + item.z * 0.39)) * 0.08;

const primaryHotspot =
  1 - smoothstep(0, 6.8, Math.hypot(item.x + 5.6, item.z - 1.8));

const secondaryHotspot =
  1 - smoothstep(0, 4.2, Math.hypot(item.x + 1.8, item.z + 1.2));

const rightSideFade = smoothstep(-1.5, 9.5, item.x);

const compositionalInfluence =
  (primaryHotspot * 0.72 + secondaryHotspot * 0.32) *
  (1 - rightSideFade * 0.68);

const rightFade = smoothstep(1.5, 10.5, item.x);
const rearFade = smoothstep(5.5, 10.5, item.z);

const visibilityDampening =
  1 - clamp01(rightFade * 0.55 + rearFade * 0.25);

const ctaX = item.x + 4.2;
const ctaZ = item.z + 3.4;

const ctaValley =
  1 - smoothstep(0, 2.4, Math.hypot(ctaX, ctaZ));

const totalInfluence = clamp01(
  (
    pointerInfluence * 0.9 +
    ambientWave +
    compositionalInfluence -
    ctaValley * 0.22
  ) * visibilityDampening,
);
```

## Height Model

```ts
const columnVariation =
  0.88 + Math.sin(item.x * 0.73 + item.z * 1.17) * 0.16;

item.targetHeight =
  item.baseHeight + totalInfluence * MAX_HEIGHT * columnVariation;
```

## Color Model

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

## Motion Smoothing

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

## Pointer Smoothing

```ts
function updatePointerWorld() {
  pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.055);
  raycaster.setFromCamera(pointer, camera);
  raycaster.ray.intersectPlane(groundPlane, pointerWorld);
  pointerTargetWorld.lerp(pointerWorld, reduceMotion ? 1 : 0.085);
}
```

## Camera Setup

Preferred:

```ts
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(-3.4, 10.6, 14.8);
camera.lookAt(-2.2, 0, -1.8);
```

Safer fallback:

```ts
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(-2.8, 11.4, 14.2);
camera.lookAt(-2.0, 0, -1.2);
```

## Material Setup

Required:

```ts
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ffffff'),
  roughness: 0.42,
  metalness: 0.16,
  emissive: new THREE.Color('#250500'),
  emissiveIntensity: 0.34,
});
```

## Palette

```ts
const BASE_COLOR = new THREE.Color('#070202');
const LOW_COLOR = new THREE.Color('#220700');
const MID_COLOR = new THREE.Color('#5a1606');
const HOT_COLOR = new THREE.Color('#ff4f18');
const PEAK_COLOR = new THREE.Color('#ff7a3d');
```

## CSS Overlay

```css
.heroOverlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--static-black) 38%, transparent) 0%,
      color-mix(in srgb, var(--static-black) 18%, transparent) 32%,
      color-mix(in srgb, var(--static-black) 44%, transparent) 58%,
      color-mix(in srgb, var(--static-black) 82%, transparent) 100%
    ),
    radial-gradient(
      ellipse at 36% 58%,
      color-mix(in srgb, var(--color-brand-500) 22%, transparent),
      transparent 42%
    ),
    radial-gradient(
      ellipse at 70% 50%,
      color-mix(in srgb, var(--static-black) 72%, transparent),
      transparent 34%
    ),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--static-black) 72%, transparent) 0%,
      transparent 28%,
      transparent 68%,
      color-mix(in srgb, var(--static-black) 82%, transparent) 100%
    );
}
```

## Canvas Layer

```css
.heroCanvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
```

## Foreground Layer

```css
.hero > :global(.container) {
  position: relative;
  z-index: 2;
}
```
