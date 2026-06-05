'use client';

import { useEffect, useRef } from 'react';

/**
 * Subset of the grid2 config options surfaced by threejs-components v0.0.20.
 * Full default reference: docs/hero-fix/hero-fix-3/hero-webgl-grid-analysis-and-build.md § Appendix
 */
type GridConfig = Partial<{
  type: 'circle' | 'hexagon' | 'square' | 'triangle';
  /** Grid density — roughly n×n pegs for circle type */
  n: number;
  /** Array of hex ints for the peg colour gradient */
  colors: number[];
  /** Floor plane colour (hex int) */
  planeColor: number;
  light1Color: number;
  light1Intensity: number;
  light1PositionZ: number;
  light2Color: number;
  light2Intensity: number;
  light2PositionZ: number;
  materialParams: { metalness: number; roughness: number };
  /** Idle-bob frequency multiplier (default 1.0) */
  timeCoef: number;
  /** Max bulge height under the cursor (default 0.5) */
  depthScale: number;
  /** Inner ring of the annulus influence band */
  influenceRadius1: number;
  /** Outer ring of the annulus influence band */
  influenceRadius2: number;
  padding: number;
}>;

/**
 * The default export of grid2.js is a factory:
 *   (canvas: HTMLCanvasElement, config?: GridConfig) => { three, grid, dispose }
 */
type GridFactory = (
  canvas: HTMLCanvasElement,
  config?: GridConfig,
) => { three: unknown; grid: unknown; dispose: () => void };

/**
 * WebGL instanced cylinder grid background for the Hero section.
 *
 * Uses the open-source `threejs-components` grid2 background (vendored at
 * /vendor/threejs-components/grid2.js). Disclosure: this is third-party
 * animation code; tuning, layout, accessibility, and reduced-motion handling
 * are by Edgar Bonilla G.
 *
 * Guards:
 * - SSR-safe: all window/WebGL access inside useEffect
 * - prefers-reduced-motion: loop never starts when the user opts out
 * - Fail-silent: load failure renders nothing; the hero must remain complete
 * - dispose() on unmount: no GL context leak on client-side navigation
 */
export default function HeroCylinderGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Belt-and-suspenders: JS guard mirrors the CSS @media rule below.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    let cancelled = false;

    // Dynamic import keeps the vendored module out of the initial bundle.
    // webpackIgnore: true because the file lives in /public, not the src tree.
    // @ts-expect-error — grid2.js is a /public vendor file, not a TS module.
    import(/* webpackIgnore: true */ '/vendor/threejs-components/grid2.js')
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const createGrid = (mod.default ?? mod) as GridFactory;

        // Responsive density: fewer pegs on mobile keeps it smooth.
        const n = window.innerWidth < 768 ? 14 : 22;

        instanceRef.current = createGrid(canvasRef.current, {
          type: 'circle',
          n,
          // Brand orange → warm highlights — tonal, near-monochrome so the
          // field doesn't fight the portrait or the headline.
          colors: [0xff4f18, 0xff6a32, 0xffd9c7],
          planeColor: 0x1a0a04, // deep warm shadow floor
          light1Color: 0xffffff,
          light1Intensity: 500,
          light1PositionZ: 2,
          // Override the library default of 0x0000ff → warm brand rim instead.
          light2Color: 0xff4f18,
          light2Intensity: 800,
          light2PositionZ: -5,
          materialParams: { metalness: 0.9, roughness: 0.6 },
          // Calmer idle than the library default of 1.0.
          timeCoef: 0.6,
          depthScale: 0.5,
          influenceRadius1: 10,
          influenceRadius2: 22,
        });
      })
      .catch((err) => {
        // Fail silent — the hero must still be complete without the canvas.
        // This is the no-broken-state rule.
        console.warn(
          '[HeroCylinderGrid] WebGL grid failed to load; static hero is intact.',
          err,
        );
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
      className="heroCylinderGrid"
      data-engine="three.js"
    />
  );
}
