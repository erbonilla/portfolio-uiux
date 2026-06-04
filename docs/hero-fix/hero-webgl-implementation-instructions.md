# Hero WebGL Cylinder Background — Implementation Instructions

## Objective

Update the Portfolio Hero section so it uses a visible, interactive Three.js cylinder-grid background inspired by the reference section from `mohamedshehata.net`, while preserving the existing Hero content, portrait, CTAs, navigation, and dark-stage visual direction.

Current problem: the Hero background renders mostly black. The Three.js scene is mounted, but the instanced cylinder colors are visually crushed and the pointer interaction is not reliably driven across the full Hero area.

## Root Cause

The key issue is in `src/components/sections/HeroCylindersBackground.tsx`.

The instanced mesh uses per-instance colors through `mesh.setColorAt(...)`, but the material itself is initialized with a nearly black base color:

```ts
const material = new THREE.MeshStandardMaterial({
  color: BASE_COLOR.clone(),
});
```

In Three.js, `MeshStandardMaterial.color` participates in the final diffuse color. When the material base is almost black, hot orange instance colors are multiplied through that dark base and become nearly invisible.

Correct fix:

```ts
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#ffffff"),
});
```

Instance colors should own the palette. The material should not darken them.

## Secondary Issues

### Pointer events are too locally scoped

The existing implementation listens on the internal mount element. Since Hero text and portrait sit above the canvas, pointer movement over foreground elements can fail to drive the interaction.

Use `window.addEventListener("pointermove", ...)` and calculate whether the pointer is inside the Hero section bounds.

### Overlay opacity is too strong

The overlay protects readability, but the previous black gradient is heavy enough to suppress an already-dark WebGL scene.

Keep the overlay, but reduce the black stops after fixing the material color.

## Implementation Plan

### 1. Confirm dependencies

```bash
pnpm list three @types/three
```

Expected:

```json
{
  "dependencies": {
    "three": "^0.184.0"
  },
  "devDependencies": {
    "@types/three": "^0.184.1"
  }
}
```

If missing:

```bash
pnpm add three
pnpm add -D @types/three
```

### 2. Replace the WebGL component

Replace:

```txt
src/components/sections/HeroCylindersBackground.tsx
```

with the implementation in `hero-webgl-component.md`.

Key changes:

- Material base color changed to white.
- Instance colors render correctly.
- Baseline red/orange visibility increased.
- Pointer listener moved to `window`.
- Pointer bounds resolved against the nearest Hero `section`.
- Static compositional hotspot retained.
- Reduced-motion behavior preserved.
- Full dispose chain retained.

### 3. Patch the Hero CSS

In:

```txt
src/components/sections/sections.module.css
```

replace only:

```css
.heroCanvas { ... }
.heroOverlay { ... }
```

with the patch in `hero-css-patch.md`.

### 4. Keep HeroSection structure

The current `HeroSection.tsx` structure is correct.

Keep this order:

```tsx
<section id="top" className={cn(s.section, s.hero)}>
  <div className={s.heroCanvas} aria-hidden="true">
    <HeroCylindersBackground />
  </div>
  <div className={s.heroOverlay} aria-hidden="true" />
  <div className="container">
    ...
  </div>
</section>
```

Do not move the canvas below the foreground content.

### 5. Validate locally

```bash
pnpm lint
pnpm build
pnpm dev
```

Open:

```txt
http://localhost:3000
```

## Expected Behavior

- Orange/red cylinder cluster visible immediately on Hero load.
- Background dark but not flat black.
- Subtle ambient cylinder movement without pointer input.
- Pointer movement anywhere over the Hero raises and brightens nearby cylinders.
- Interaction works over text, CTAs, and portrait.
- CTAs remain clickable.
- Hero remains dark in both light and dark themes.
- Reduced-motion users receive a static but visible render.

## Tuning

If too intense:

```ts
const MAX_HEIGHT = 3.5;
```

Try:

```ts
const MAX_HEIGHT = 2.8;
```

Then reduce:

```ts
compositionalHotspot * 0.68
```

to:

```ts
compositionalHotspot * 0.55
```

If still too dark after the material fix, reduce overlay opacity rather than increasing WebGL colors.

## Rollback

1. Remove the `HeroCylindersBackground` import and mount from `HeroSection.tsx`.
2. Remove `.heroCanvas` and `.heroOverlay`.
3. Restore the original Hero background color.
4. Delete `HeroCylindersBackground.tsx`.
5. Remove Three.js only if unused elsewhere:

```bash
pnpm remove three
pnpm remove -D @types/three
```
