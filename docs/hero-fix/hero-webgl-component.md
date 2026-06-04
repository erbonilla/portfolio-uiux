# Replacement File — `HeroCylindersBackground.tsx`

Replace the full contents of:

```txt
src/components/sections/HeroCylindersBackground.tsx
```

with this file.

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

const BASE_COLOR = new THREE.Color('#070202');
const LOW_COLOR = new THREE.Color('#220700');
const MID_COLOR = new THREE.Color('#5a1606');
const HOT_COLOR = new THREE.Color('#ff4f18');
const PEAK_COLOR = new THREE.Color('#ff7a3d');

const GRID_X = 42;
const GRID_Z = 26;
const SPACING = 0.68;
const CYLINDER_RADIUS = 0.255;
const BASE_HEIGHT = 0.075;
const MAX_HEIGHT = 3.5;

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

    const stage = mount.closest('section') ?? mount;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050100', 0.047);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(-1.6, 11.8, 14.2);
    camera.lookAt(-1.2, 0, -1.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));

    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ff2a05', 0.55));

    const key = new THREE.DirectionalLight('#ff4a1a', 3.4);
    key.position.set(-6, 12, 8);
    scene.add(key);

    const rim = new THREE.DirectionalLight('#ff7a3d', 1.5);
    rim.position.set(5, 6, -5);
    scene.add(rim);

    const fill = new THREE.PointLight('#ff5a18', 5.2, 22, 1.6);
    fill.position.set(-5.5, 4.2, 3.4);
    scene.add(fill);

    const geometry = new THREE.CylinderGeometry(
      CYLINDER_RADIUS,
      CYLINDER_RADIUS,
      1,
      28,
      1,
      false,
    );

    /*
     * Critical fix:
     * Keep the material base color white. Instance colors are the actual palette.
     * If this is BASE_COLOR / #050505, HOT and PEAK colors are visually crushed.
     */
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.42,
      metalness: 0.16,
      emissive: new THREE.Color('#250500'),
      emissiveIntensity: 0.34,
    });

    const count = GRID_X * GRID_Z;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(count * 3),
      3,
    );

    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const instances: InstanceState[] = [];
    const offsetX = ((GRID_X - 1) * SPACING) / 2;
    const offsetZ = ((GRID_Z - 1) * SPACING) / 2;

    let index = 0;

    for (let z = 0; z < GRID_Z; z++) {
      for (let x = 0; x < GRID_X; x++) {
        const px = x * SPACING - offsetX;
        const pz = z * SPACING - offsetZ;
        const jitter = Math.sin(x * 1.77 + z * 0.83) * 0.025;
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

        index++;
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
    let isPointerInside = false;
    let frameId = 0;

    function resize() {
      const rect = mount.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function updatePointerFromEvent(event: PointerEvent) {
      const rect = stage.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      isPointerInside = inside;

      if (!inside) {
        pointerTarget.set(999, 999);
        return;
      }

      pointerTarget.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    }

    function onPointerLeaveWindow() {
      isPointerInside = false;
      pointerTarget.set(999, 999);
    }

    function updatePointerWorld() {
      pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.085);
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(groundPlane, pointerWorld);
      pointerTargetWorld.lerp(pointerWorld, reduceMotion ? 1 : 0.13);
    }

    function resolveColor(influence: number) {
      if (influence > 0.82) return PEAK_COLOR;
      if (influence > 0.48) return HOT_COLOR;
      if (influence > 0.2) return MID_COLOR;
      if (influence > 0.06) return LOW_COLOR;
      return BASE_COLOR;
    }

    function animate(time: number) {
      updatePointerWorld();

      const t = reduceMotion ? 0 : time * 0.00075;
      const pointerRadius = 5.8;
      const activeBoost = isPointerInside && !reduceMotion ? 1 : 0;

      for (let i = 0; i < instances.length; i++) {
        const item = instances[i];

        const dx = item.x - pointerTargetWorld.x;
        const dz = item.z - pointerTargetWorld.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        const pointerInfluence =
          activeBoost * (1 - smoothstep(0, pointerRadius, dist));

        const ambientWave = reduceMotion
          ? 0
          : Math.max(0, Math.sin(t + item.x * 0.5 + item.z * 0.44)) * 0.18;

        const hotX = item.x + 4.8;
        const hotZ = item.z - 2.2;
        const compositionalHotspot =
          1 - smoothstep(0, 9.2, Math.sqrt(hotX * hotX + hotZ * hotZ));

        const totalInfluence = clamp01(
          pointerInfluence + ambientWave + compositionalHotspot * 0.68,
        );

        item.targetHeight = item.baseHeight + totalInfluence * MAX_HEIGHT;
        item.targetColor.copy(resolveColor(totalInfluence));

        item.currentHeight = lerp(
          item.currentHeight,
          item.targetHeight,
          reduceMotion ? 1 : 0.105,
        );

        item.currentColor.lerp(
          item.targetColor,
          reduceMotion ? 1 : 0.09,
        );

        dummy.position.set(item.x, item.currentHeight / 2, item.z);
        dummy.scale.set(1, item.currentHeight, 1);
        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, item.currentColor);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      fill.position.x = lerp(
        fill.position.x,
        isPointerInside ? pointerTargetWorld.x : -5.5,
        reduceMotion ? 1 : 0.055,
      );

      fill.position.z = lerp(
        fill.position.z,
        isPointerInside ? pointerTargetWorld.z + 2.2 : 3.4,
        reduceMotion ? 1 : 0.055,
      );

      renderer.render(scene, camera);

      if (!reduceMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    resize();
    animate(0);

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    window.addEventListener('pointermove', updatePointerFromEvent, {
      passive: true,
    });
    window.addEventListener('pointerleave', onPointerLeaveWindow);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', updatePointerFromEvent);
      window.removeEventListener('pointerleave', onPointerLeaveWindow);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
```
