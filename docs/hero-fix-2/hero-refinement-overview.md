# Hero WebGL Refinement Pass — Overview and Implementation Plan

## Objective

Refine the current Portfolio Hero WebGL cylinder background so it more closely matches the premium editorial feel of the reference section from:

```txt
https://mohamedshehata.net/
```

The current Hero now works: the cylinder grid is visible, the background animates, and pointer interaction is present. The next pass should focus on composition, restraint, depth, and readability.

## Current State

The current implementation is functionally successful:

- WebGL scene renders.
- Cylinders are visible.
- Pointer interaction works.
- CTA clickability is preserved.
- Build, typecheck, lint, accessibility checks, and e2e tests reportedly pass.

The remaining gap is aesthetic and compositional.

## Main Difference From the Reference

The reference page does not feel like a full-width animated pattern. It feels like a designed spatial scene:

- Strong activity is concentrated around the content zone.
- The right side falls into darkness.
- The field is asymmetric.
- Cylinder heights feel clustered and organic.
- Motion feels heavy and viscous, not decorative or busy.
- Foreground text remains dominant.

The current Portfolio Hero is close, but the cylinder field is still too evenly distributed across the lower half and too visible around the portrait.

## Refinement Goals

1. Push visual energy toward the left-center text area.
2. Suppress cylinder activity behind and around the portrait.
3. Reduce far-right pattern visibility.
4. Make the cylinder field less uniform.
5. Slow down ambient animation.
6. Add more cursor inertia.
7. Preserve CTA readability.
8. Keep implementation reversible and scoped to the Hero.

## Files To Update

Primary files:

```txt
src/components/sections/HeroCylindersBackground.tsx
src/components/sections/sections.module.css
```

No content, copy, portrait, or CTA changes are required.

## Recommended Implementation Order

1. Patch the CSS overlay.
2. Add right-side and rear dampening in the WebGL influence model.
3. Replace the single broad hotspot with two compositional hotspots.
4. Reduce ambient wave amplitude and speed.
5. Add deterministic height variation.
6. Adjust camera angle.
7. Add a CTA readability valley.
8. Re-run validation.

## Expected Final Result

After this refinement pass, the Hero should read as:

- Dark, cinematic, and spatial.
- Orange/red cylinder energy concentrated behind the Hero copy.
- Portrait zone calmer and darker.
- Far-right side mostly black with subtle cylinder traces.
- Pointer interaction visible but smooth and delayed.
- CTA area readable without a heavy panel.
- Overall closer to the reference page's premium WebGL treatment.

## Validation Commands

Run:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

If e2e tests fail because port `3000` is busy:

```bash
lsof -ti :3000 | xargs kill -9
pnpm test:e2e
```

## Rollback Strategy

The refinement is fully reversible.

To rollback:

1. Restore the previous `HeroCylindersBackground.tsx`.
2. Restore the previous `.heroOverlay` block.
3. Re-run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

No data migration or structural app change is involved.
