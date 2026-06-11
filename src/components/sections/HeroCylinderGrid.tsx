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
  materialParams: {
    metalness: number;
    roughness: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    reflectivity?: number;
    specularIntensity?: number;
    specularColor?: number;
    emissive?: number;
    emissiveIntensity?: number;
  };
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

    // Skip WebGL render loop in automated test environments to prevent CPU starvation.
    const isAutomation = typeof navigator !== 'undefined' && navigator.webdriver;
    if (isAutomation) return;

    let cancelled = false;

    // Dynamic import keeps the vendored module out of the initial bundle.
    // webpackIgnore: true because the file lives in /public, not the src tree.
    // @ts-expect-error — grid2.js is a /public vendor file, not a TS module.
    import(/* webpackIgnore: true */ '/vendor/threejs-components/grid2.js')
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const createGrid = (mod.default ?? mod) as GridFactory;

        // Dense carpet: small, tightly packed cylinders like the reference field.
        const n = window.innerWidth < 768 ? 32 : 52;

        instanceRef.current = createGrid(canvasRef.current, {
          type: 'circle',
          n,
          // Brighter hot-red gradient only: no tan/cream entries, so raised
          // pegs stay vivid without drifting into a muted brown button look.
          colors: [0xb20a00, 0xf21a08, 0xff3412, 0xff4d1e, 0xff6428],
          planeColor: 0x240600, // dark warm maroon gaps, not dead black
          light1Color: 0xfff2dc,
          light1Intensity: 950,
          light1PositionZ: 2.4,
          // Warm rim light, not the library default blue, pushed into hot red.
          light2Color: 0xff2a08,
          light2Intensity: 2600,
          light2PositionZ: -6,
          // Glossy lacquered material: sharp speculars on the curved sides and
          // raised top rims without introducing a pale/tan diffuse color.
          materialParams: {
            metalness: 0.42,
            roughness: 0.22,
            clearcoat: 0.9,
            clearcoatRoughness: 0.12,
            reflectivity: 0.72,
            specularIntensity: 0.55,
            specularColor: 0xff5a2a,
            emissive: 0x3a0600,
            emissiveIntensity: 0.32,
          },
          // Tall pillars: enough rise to expose side walls across the field.
          depthScale: 3.8,
          // Wide influence band so the terrain feels raised and dimensional,
          // while still preserving darker valleys between red columns.
          influenceRadius1: 13,
          influenceRadius2: 64,
          // Calm idle bob (default 1.0 is too frenetic for a portfolio hero).
          timeCoef: 0.6,
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
