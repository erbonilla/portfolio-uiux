# Hero Section WebGL Update Plan

## 1. Brief description

Update the Portfolio Hero from a flat orange editorial stage into a layered, recruiter-facing Hero with a **decorative Three.js cylinder-grid background** adapted from the referenced `Areas of Specialisation` section pattern.

The update preserves the existing semantic Hero content:

- intro line: `Hey, I’m Edgar Bonilla G., a`
- primary role headline
- short UI/UX positioning statement
- three specialization tags
- primary/secondary CTAs
- location/language availability line
- portrait image

The proposed change is visual and interaction-focused only. The Hero remains HTML-first for accessibility and SEO, while the new WebGL layer sits behind the content as `aria-hidden` decoration.

**Assumptions kept reversible:**

- The portfolio is a Next.js + React + TypeScript + Tailwind project.
- The Hero is currently implemented as a React component, likely under `app`, `components`, or `src/components`.
- The portrait asset already exists and should not be replaced.
- The implementation should be isolated so it can be removed by deleting one background component and one wrapper reference.

---

## 2. Step-by-step implementation plan

### Step 1 — Add Three.js dependency

```bash
npm install three
npm install -D @types/three
```

### Step 2 — Create an isolated client-only WebGL background component

Create:

```txt
components/HeroCylindersBackground.tsx
```

Responsibilities:

- Mount a Three.js renderer into a full-section `<canvas>`.
- Render an instanced grid of low cylinders.
- Animate cylinder height, color, and emissive intensity.
- Use pointer proximity to create a soft elevated orange cluster.
- Cap device pixel ratio for performance.
- Respect `prefers-reduced-motion`.
- Dispose geometry, material, renderer, and listeners on unmount.

### Step 3 — Layer the canvas behind the existing Hero content

The Hero section should become a relative stacking context:

```tsx
<section className="relative isolate overflow-hidden bg-black text-white">
  <HeroCylindersBackground />
  <div className="relative z-10">...</div>
</section>
```

The foreground content remains normal HTML. The canvas should not contain text or meaningful content.

### Step 4 — Adapt the current orange/black visual system

Use the current portfolio’s high-energy orange as the active state and black/dark red for the base state.

Recommended palette:

```ts
const BASE = new THREE.Color('#070201');
const MID = new THREE.Color('#5a0b03');
const HOT = new THREE.Color('#ff3b12');
const PEAK = new THREE.Color('#ff6a00');
```

### Step 5 — Preserve Hero readability

Add a dark overlay above the canvas and below the content:

```tsx
<div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/35 to-black/65" />
```

This keeps the headline, CTAs, and portrait legible even when the pointer-driven cylinders brighten.

### Step 6 — Tune animation behavior

Target behavior:

- Ambient cylinder wave: slow, subtle, continuous.
- Pointer response: fast enough to feel interactive, not twitchy.
- Return-to-rest: damped and smooth.
- Reduced motion: static or near-static field.

Recommended timing values:

```ts
pointerLerp = 0.08;
heightLerp = 0.10;
colorLerp = 0.08;
ambientSpeed = 0.0007;
pointerRadius = 5.4;
```

### Step 7 — Verify the Hero

Check:

- No hydration errors.
- Canvas does not block CTA clicks.
- Tab order is unchanged.
- Hero content remains readable at desktop, tablet, and mobile widths.
- CPU/GPU load is acceptable after 30–60 seconds idle.
- Reduced-motion users do not receive aggressive continuous motion.

---

## 3. Adapted code

### 3.1 `components/HeroCylindersBackground.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type InstanceState = {
  x: number;
  z: number;
  baseHeight: number;
  currentHeight: number;
  targetHeight: number;
  currentColor: THREE.Color;
  targetColor: THREE.Color;
};

const BASE_COLOR = new THREE.Color('#070201');
const MID_COLOR = new THREE.Color('#5a0b03');
const HOT_COLOR = new THREE.Color('#ff3b12');
const PEAK_COLOR = new THREE.Color('#ff6a00');

const GRID_X = 34;
const GRID_Z = 22;
const SPACING = 0.74;
const CYLINDER_RADIUS = 0.28;
const BASE_HEIGHT = 0.08;
const MAX_HEIGHT = 3.2;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroCylindersBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050100', 0.055);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 12.5, 13.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    const ambient = new THREE.AmbientLight('#ff2a05', 0.22);
    scene.add(ambient);

    const key = new THREE.DirectionalLight('#ff4a1a', 2.7);
    key.position.set(-5, 10, 8);
    scene.add(key);

    const fill = new THREE.PointLight('#ff6a00', 3.2, 24, 1.8);
    fill.position.set(-4, 4, 4);
    scene.add(fill);

    const geometry = new THREE.CylinderGeometry(
      CYLINDER_RADIUS,
      CYLINDER_RADIUS,
      1,
      28,
      1,
      false,
    );

    const material = new THREE.MeshStandardMaterial({
      color: BASE_COLOR,
      roughness: 0.48,
      metalness: 0.12,
      emissive: new THREE.Color('#210300'),
      emissiveIntensity: 0.42,
    });

    const count = GRID_X * GRID_Z;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const instances: InstanceState[] = [];

    let index = 0;
    const offsetX = ((GRID_X - 1) * SPACING) / 2;
    const offsetZ = ((GRID_Z - 1) * SPACING) / 2;

    for (let z = 0; z < GRID_Z; z += 1) {
      for (let x = 0; x < GRID_X; x += 1) {
        const px = x * SPACING - offsetX;
        const pz = z * SPACING - offsetZ;
        const jitter = Math.sin(x * 1.7 + z * 0.9) * 0.03;
        const baseHeight = BASE_HEIGHT + jitter;

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
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, BASE_COLOR);
        index += 1;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const pointer = new THREE.Vector2(999, 999);
    const pointerTarget = new THREE.Vector2(999, 999);
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointerWorld = new THREE.Vector3(999, 0, 999);
    const pointerTargetWorld = new THREE.Vector3(999, 0, 999);

    let width = 1;
    let height = 1;
    let frameId = 0;
    let isPointerInside = false;

    function resize() {
      const rect = mount.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function updatePointerWorld() {
      pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.08);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(groundPlane, pointerWorld);
      pointerTargetWorld.lerp(pointerWorld, reduceMotion ? 1 : 0.12);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = mount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      pointerTarget.set(x, y);
      isPointerInside = true;
    }

    function onPointerLeave() {
      isPointerInside = false;
      pointerTarget.set(999, 999);
    }

    function animate(time: number) {
      updatePointerWorld();

      const t = reduceMotion ? 0 : time * 0.0007;
      const pointerRadius = 5.4;
      const activeBoost = isPointerInside && !reduceMotion ? 1 : 0;

      for (let i = 0; i < instances.length; i += 1) {
        const item = instances[i];
        const dx = item.x - pointerTargetWorld.x;
        const dz = item.z - pointerTargetWorld.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        const pointerInfluence = activeBoost * (1 - smoothstep(0, pointerRadius, distance));
        const ambientWave = reduceMotion
          ? 0
          : Math.max(0, Math.sin(t + item.x * 0.55 + item.z * 0.42)) * 0.16;

        const compositionalHotspot =
          1 - smoothstep(0, 8.8, Math.sqrt((item.x + 4.2) ** 2 + (item.z - 1.8) ** 2));

        const totalInfluence = clamp01(pointerInfluence + ambientWave + compositionalHotspot * 0.52);

        item.targetHeight = item.baseHeight + totalInfluence * MAX_HEIGHT;

        if (totalInfluence > 0.76) {
          item.targetColor.copy(PEAK_COLOR);
        } else if (totalInfluence > 0.36) {
          item.targetColor.copy(HOT_COLOR);
        } else if (totalInfluence > 0.12) {
          item.targetColor.copy(MID_COLOR);
        } else {
          item.targetColor.copy(BASE_COLOR);
        }

        item.currentHeight = lerp(item.currentHeight, item.targetHeight, reduceMotion ? 1 : 0.1);
        item.currentColor.lerp(item.targetColor, reduceMotion ? 1 : 0.08);

        dummy.position.set(item.x, item.currentHeight / 2, item.z);
        dummy.scale.set(1, item.currentHeight, 1);
        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, item.currentColor);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      fill.position.x = lerp(fill.position.x, pointerTargetWorld.x, reduceMotion ? 1 : 0.06);
      fill.position.z = lerp(fill.position.z, pointerTargetWorld.z + 2.4, reduceMotion ? 1 : 0.06);

      renderer.render(scene, camera);

      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    resize();
    animate(0);

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
```

---

### 3.2 Example adapted Hero component

Use this as the integration pattern. Keep the existing copy, links, and portrait source from the current project.

```tsx
import Image from 'next/image';
import HeroCylindersBackground from '@/components/HeroCylindersBackground';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      <HeroCylindersBackground />

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/35 to-black/70" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_38%_42%,rgba(255,60,18,0.22),transparent_34%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:px-10 lg:px-12">
        <div className="max-w-2xl">
          <p className="mb-6 text-sm font-medium tracking-[-0.01em] text-white/80">
            Hey, I’m Edgar Bonilla G., a
          </p>

          <h1 className="text-balance text-[clamp(4rem,11vw,9.5rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white">
            Creative
            <br />
            UI/UX
            <br />
            <span className="block text-[0.34em] leading-none tracking-[0.22em]">
              Designer
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/78 md:text-lg">
            UI/UX designer building accessible product interfaces for health,
            rehabilitation, wellness, and endurance products.
          </p>

          <ul className="mt-6 flex max-w-xl flex-wrap gap-x-5 gap-y-2 text-sm font-bold uppercase tracking-[0.16em] text-white/86">
            <li>Health &amp; rehab PWAs</li>
            <li>Endurance coaching</li>
            <li>Design systems</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex h-12 items-center justify-center border border-white bg-white px-7 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              View case studies
            </a>

            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center border border-white/70 px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Get in touch
            </a>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/68">
            Based in Costa Rica · Open to roles · Spanish and English
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] md:max-w-none">
          <div className="absolute -inset-5 rounded-[2rem] bg-orange-600/20 blur-3xl" />

          <div className="relative overflow-hidden border border-white/16 bg-black/25 shadow-2xl backdrop-blur-sm">
            <Image
              src="/images/edgar-portrait.jpg"
              alt="Portrait of Edgar Bonilla G."
              width={840}
              height={1040}
              priority
              className="aspect-[4/5] h-auto w-full object-cover grayscale-[15%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 3.3 If the current Hero already has a component

Apply the smaller diff instead of replacing the full component.

```tsx
import HeroCylindersBackground from '@/components/HeroCylindersBackground';
```

Wrap the existing Hero content:

```tsx
<section className="relative isolate min-h-screen overflow-hidden bg-black text-white">
  <HeroCylindersBackground />

  <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/35 to-black/70" />

  <div className="relative z-10">
    {/* existing Hero content */}
  </div>
</section>
```

Make sure the WebGL component is behind the content and does not receive pointer/click events from CTA buttons.

---

### 3.4 Optional reveal utility for Hero foreground

Use only if the project does not already have a reveal system.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        'transition duration-700 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

Example use:

```tsx
<Reveal>
  <p>Hey, I’m Edgar Bonilla G., a</p>
</Reveal>

<Reveal delay={90}>
  <h1>Creative UI/UX Designer</h1>
</Reveal>

<Reveal delay={160}>
  <p>UI/UX designer building accessible product interfaces...</p>
</Reveal>
```

---

## Verification checklist

- The Hero still exposes one primary `<h1>`.
- The decorative canvas is `aria-hidden`.
- The portrait keeps a meaningful `alt` value.
- CTA links remain clickable because the canvas uses `pointer-events: none`.
- The WebGL component is client-only.
- Renderer, geometry, material, listeners, and observers are disposed on unmount.
- `prefers-reduced-motion` is handled.
- The change is reversible by removing `HeroCylindersBackground` and the two overlay layers.
