# CSS Patch — Hero Canvas and Overlay

Patch this file:

```txt
src/components/sections/sections.module.css
```

Replace only the existing `.heroCanvas` and `.heroOverlay` blocks.

## Replacement CSS

```css
.heroCanvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--static-black) 42%, transparent) 0%,
      color-mix(in srgb, var(--static-black) 22%, transparent) 34%,
      color-mix(in srgb, var(--static-black) 46%, transparent) 68%,
      color-mix(in srgb, var(--static-black) 72%, transparent) 100%
    ),
    radial-gradient(
      circle at 34% 43%,
      color-mix(in srgb, var(--color-brand-500) 24%, transparent),
      transparent 36%
    ),
    radial-gradient(
      circle at 12% 18%,
      color-mix(in srgb, var(--color-brand-400) 14%, transparent),
      transparent 32%
    );
}
```

## Keep This Rule Unchanged

```css
.hero > :global(.container) {
  position: relative;
  z-index: 2;
}
```

## Layer Model

```txt
z-index 0  .heroCanvas    Three.js cylinder grid
z-index 1  .heroOverlay   readability gradient + orange glow
z-index 2  .container     Hero text, CTAs, portrait
```

## If the Background Is Too Bright

Reduce in the WebGL component:

```ts
const MAX_HEIGHT = 3.5;
```

to:

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

## If the Text Loses Contrast

Increase the overlay middle stop:

```css
color-mix(in srgb, var(--static-black) 22%, transparent) 34%
```

to:

```css
color-mix(in srgb, var(--static-black) 30%, transparent) 34%
```

Avoid reverting to the previous very heavy overlay unless the intended result is an almost-black background.
