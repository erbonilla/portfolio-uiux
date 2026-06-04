# Hero CSS Overlay Refinement

## Target File

Patch:

```txt
src/components/sections/sections.module.css
```

Replace only the existing `.heroOverlay` block unless you also need to add missing `pointer-events: none` to `.heroCanvas`.

## Keep Canvas Layer Non-Interactive

Confirm `.heroCanvas` includes:

```css
.heroCanvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
```

The canvas must not intercept clicks. CTAs and navigation must stay interactive.

## Replace `.heroOverlay`

Use this overlay:

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

## Why This Overlay Is Better

The overlay has four jobs:

1. Preserve text readability.
2. Keep the portrait area calmer.
3. Darken the far right.
4. Keep the orange glow concentrated near the content zone.

Layer breakdown:

```txt
Layer 1: horizontal dark gradient
Layer 2: orange content glow
Layer 3: portrait-zone suppression
Layer 4: top/bottom vignette
```

## Keep Foreground Container Above Overlay

Do not change:

```css
.hero > :global(.container) {
  position: relative;
  z-index: 2;
}
```

Required stacking:

```txt
z-index 0  .heroCanvas
z-index 1  .heroOverlay
z-index 2  .container
```

## Tuning

### If the background is too dark

Reduce this stop:

```css
color-mix(in srgb, var(--static-black) 82%, transparent) 100%
```

To:

```css
color-mix(in srgb, var(--static-black) 70%, transparent) 100%
```

### If the portrait area is too busy

Increase:

```css
color-mix(in srgb, var(--static-black) 72%, transparent)
```

To:

```css
color-mix(in srgb, var(--static-black) 82%, transparent)
```

In this radial layer:

```css
radial-gradient(
  ellipse at 70% 50%,
  color-mix(in srgb, var(--static-black) 72%, transparent),
  transparent 34%
)
```

### If the text is losing contrast

Increase the mid horizontal stop:

```css
color-mix(in srgb, var(--static-black) 18%, transparent) 32%
```

To:

```css
color-mix(in srgb, var(--static-black) 28%, transparent) 32%
```

### If the orange glow feels too weak

Increase:

```css
color-mix(in srgb, var(--color-brand-500) 22%, transparent)
```

To:

```css
color-mix(in srgb, var(--color-brand-500) 30%, transparent)
```

## Responsive Consideration

If mobile becomes too visually dense, add:

```css
@media (max-width: 767px) {
  .heroOverlay {
    background:
      linear-gradient(
        to bottom,
        color-mix(in srgb, var(--static-black) 72%, transparent) 0%,
        color-mix(in srgb, var(--static-black) 34%, transparent) 42%,
        color-mix(in srgb, var(--static-black) 86%, transparent) 100%
      ),
      radial-gradient(
        ellipse at 50% 58%,
        color-mix(in srgb, var(--color-brand-500) 18%, transparent),
        transparent 46%
      );
  }
}
```

This keeps the mobile Hero readable and less visually noisy.
