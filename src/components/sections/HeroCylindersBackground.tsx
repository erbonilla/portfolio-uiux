'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Decorative Three.js cylinder-grid background for the Hero section.
 *
 * Palette mapped to design-system tokens:
 *   BASE  #050505  ≈ --color-neutral-950
 *   MID   #321006  ≈ --color-brand-950
 *   HOT   #ff4f18  ≈ --color-brand-500
 *   PEAK  #ff7248  ≈ --color-brand-400
 *
 * This component is the single scoped exception to the "semantic tokens only"
 * rule — Three.js MeshStandardMaterial cannot consume CSS custom properties
 * at runtime without nontrivial overhead. All other Hero surfaces use tokens.
 *
 * aria-hidden on mount; pointer-events:none on the canvas. Fully disposable:
 * remove this file + its mount to revert the Hero to the lava-orange band.
 */

type InstanceState = {
  x: number;
  z: number;
  baseHeight: number;
  currentHeight: number;
  targetHeight: number;
  currentColor: THREE.Color;
  targetColor: THREE.Color;
};

/* ── palette ── */
const BASE_COLOR = new THREE.Color('#050505'); /* --color-neutral-950 */
const MID_COLOR  = new THREE.Color('#321006'); /* --color-brand-950   */
const HOT_COLOR  = new THREE.Color('#ff4f18'); /* --color-brand-500   */
const PEAK_COLOR = new THREE.Color('#ff7248'); /* --color-brand-400   */

/* ── grid geometry ── */
const GRID_X        = 34;
const GRID_Z        = 22;
const SPACING       = 0.74;
const CYLINDER_RADIUS = 0.28;
const BASE_HEIGHT   = 0.08;
const MAX_HEIGHT    = 3.2;

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function smoothstep(e0: number, e1: number, v: number) {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function HeroCylindersBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount: HTMLDivElement | null = mountRef.current;
    if (!mount) return;
    const el: HTMLDivElement = mount;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    /* ── scene ── */
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
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    el.appendChild(renderer.domElement);

    /* ── lights ── */
    scene.add(new THREE.AmbientLight('#ff2a05', 0.22));

    const key = new THREE.DirectionalLight('#ff4a1a', 2.7);
    key.position.set(-5, 10, 8);
    scene.add(key);

    const fill = new THREE.PointLight('#ff6a00', 3.2, 24, 1.8);
    fill.position.set(-4, 4, 4);
    scene.add(fill);

    /* ── instanced cylinder mesh ── */
    const geometry = new THREE.CylinderGeometry(
      CYLINDER_RADIUS, CYLINDER_RADIUS, 1, 28, 1, false,
    );
    const material = new THREE.MeshStandardMaterial({
      color: BASE_COLOR.clone(),
      roughness: 0.48,
      metalness: 0.12,
      emissive: new THREE.Color('#210300'),
      emissiveIntensity: 0.42,
    });

    const count = GRID_X * GRID_Z;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(count * 3), 3,
    );
    scene.add(mesh);

    /* ── populate instances ── */
    const dummy = new THREE.Object3D();
    const instances: InstanceState[] = [];
    const offsetX = ((GRID_X - 1) * SPACING) / 2;
    const offsetZ = ((GRID_Z - 1) * SPACING) / 2;
    let idx = 0;

    for (let z = 0; z < GRID_Z; z++) {
      for (let x = 0; x < GRID_X; x++) {
        const px = x * SPACING - offsetX;
        const pz = z * SPACING - offsetZ;
        const jitter = Math.sin(x * 1.7 + z * 0.9) * 0.03;
        const baseH = BASE_HEIGHT + jitter;

        instances.push({
          x: px,
          z: pz,
          baseHeight: baseH,
          currentHeight: baseH,
          targetHeight: baseH,
          currentColor: BASE_COLOR.clone(),
          targetColor: BASE_COLOR.clone(),
        });

        dummy.position.set(px, baseH / 2, pz);
        dummy.scale.set(1, baseH, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        mesh.setColorAt(idx, BASE_COLOR);
        idx++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    /* ── pointer tracking ── */
    const pointer       = new THREE.Vector2(999, 999);
    const pointerTarget = new THREE.Vector2(999, 999);
    const raycaster     = new THREE.Raycaster();
    const groundPlane   = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointerWorld       = new THREE.Vector3(999, 0, 999);
    const pointerTargetWorld = new THREE.Vector3(999, 0, 999);
    let isPointerInside = false;

    /* ── size helpers ── */
    let width = 1, height = 1;

    function resize() {
      const rect = el.getBoundingClientRect();
      width  = Math.max(1, rect.width);
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

    function onPointerMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      pointerTarget.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      );
      isPointerInside = true;
    }

    function onPointerLeave() {
      isPointerInside = false;
      pointerTarget.set(999, 999);
    }

    /* ── render loop ── */
    let frameId = 0;

    function animate(time: number) {
      updatePointerWorld();

      const t            = reduceMotion ? 0 : time * 0.0007;
      const pointerRadius = 5.4;
      const activeBoost  = isPointerInside && !reduceMotion ? 1 : 0;

      for (let i = 0; i < instances.length; i++) {
        const item = instances[i];
        const dx = item.x - pointerTargetWorld.x;
        const dz = item.z - pointerTargetWorld.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        const pointerInfluence = activeBoost * (1 - smoothstep(0, pointerRadius, dist));
        const ambientWave = reduceMotion
          ? 0
          : Math.max(0, Math.sin(t + item.x * 0.55 + item.z * 0.42)) * 0.16;

        /* compositional hotspot: soft bright cluster upper-left */
        const hotX = item.x + 4.2;
        const hotZ = item.z - 1.8;
        const compositionalHotspot =
          1 - smoothstep(0, 8.8, Math.sqrt(hotX * hotX + hotZ * hotZ));

        const totalInfluence = clamp01(
          pointerInfluence + ambientWave + compositionalHotspot * 0.52,
        );

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
    observer.observe(el);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    /* ── cleanup ── */
    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      aria-hidden="true"
    />
  );
}
