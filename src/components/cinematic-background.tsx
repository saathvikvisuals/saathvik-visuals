"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { palettes } from "@/data/palettes";
import { useExperienceStore } from "@/store/experience-store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.THREE.Clock")) return;
    originalWarn(...args);
  };
}

const GLOW_VERTEX = `
  uniform float uSize;
  uniform float uPull;
  varying float vAlpha;
  void main() {
    vec3 pos = mix(position, normalize(position) * 1.6, uPull);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (320.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = clamp(1.0 - (-mvPosition.z / 16.0), 0.08, 1.0);
  }
`;

const GLOW_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, glow * vAlpha * uOpacity);
  }
`;

const BEAM_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float fade = smoothstep(1.0, 0.0, vUv.y) * smoothstep(0.0, 0.35, vUv.y);
    float rim = smoothstep(1.0, 0.4, abs(vUv.x - 0.5) * 2.0);
    gl_FragColor = vec4(uColor, fade * rim * uOpacity * 0.55);
  }
`;

const BEAM_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

type PerfProfile = { count: number; reduced: boolean };

function usePerfProfile(): PerfProfile {
  return useMemo(() => {
    if (typeof window === "undefined") return { count: 1, reduced: false };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 768;
    const count = reduced ? 0.35 : narrow ? 0.55 : 1;
    return { count, reduced };
  }, []);
}

function useScrollProgress(reduced: boolean) {
  const progress = useRef(0);
  useEffect(() => {
    if (reduced) return;
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      }
    });
    return () => trigger.kill();
  }, [reduced]);
  return progress;
}

function bump(t: number, center: number, width: number) {
  return THREE.MathUtils.clamp(1 - Math.abs(t - center) / width, 0, 1);
}

function GlowField({ count, spread, size, color, pull, weightRef }: { count: number; spread: number; size: number; color: string; pull: number; weightRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = spread * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      values[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      values[i * 3 + 2] = r * Math.cos(phi) * 0.6;
    }
    return values;
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: size },
      uPull: { value: pull },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    }),
    [color, pull, size]
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const target = weightRef.current;
    uniforms.uOpacity.value = THREE.MathUtils.damp(uniforms.uOpacity.value, target, 4, delta);
    uniforms.uPull.value = THREE.MathUtils.damp(uniforms.uPull.value, pull, 3, delta);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={GLOW_VERTEX}
        fragmentShader={GLOW_FRAGMENT}
      />
    </points>
  );
}

function WireCluster({ color, weightRef }: { color: string; weightRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [Math.sin(i * 1.8) * 3.2, Math.cos(i * 2.1) * 2, Math.sin(i * 1.3) * 2.4] as [number, number, number],
        scale: 0.5 + (i % 3) * 0.28,
        speed: 0.12 + i * 0.03
      })),
    []
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = weightRef.current;
    const current = group.current.userData.opacity ?? 0;
    const next = THREE.MathUtils.damp(current, target, 4, delta);
    group.current.userData.opacity = next;
    group.current.visible = next > 0.02;
    const scale = 0.6 + next * 0.4;
    group.current.scale.setScalar(scale);
    group.current.children.forEach((child, i) => {
      child.rotation.x += delta * nodes[i].speed;
      child.rotation.y += delta * nodes[i].speed * 0.8;
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      if (material) material.opacity = next * 0.85;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

function GlassPanes({ color, weightRef }: { color: string; weightRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const panes = useMemo(
    () => [
      { position: [-2.4, 0.4, -1] as [number, number, number], rotation: [0.1, 0.4, 0] as [number, number, number] },
      { position: [2.2, -0.6, 0.6] as [number, number, number], rotation: [-0.15, -0.3, 0.1] as [number, number, number] },
      { position: [0, 1.2, -2] as [number, number, number], rotation: [0.2, 0, -0.05] as [number, number, number] }
    ],
    []
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = weightRef.current;
    const current = group.current.userData.opacity ?? 0;
    const next = THREE.MathUtils.damp(current, target, 4, delta);
    group.current.userData.opacity = next;
    group.current.visible = next > 0.02;
    group.current.scale.setScalar(0.7 + next * 0.3);
    group.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={group}>
      {panes.map((pane, i) => (
        <mesh key={i} position={pane.position} rotation={pane.rotation}>
          <planeGeometry args={[2.6, 3.4, 1, 1]} />
          <MeshTransmissionMaterial
            color={color}
            thickness={0.6}
            roughness={0.12}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.04}
            anisotropy={0.2}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.15}
            backside
          />
        </mesh>
      ))}
    </group>
  );
}

function LightBeam({ color, weightRef }: { color: string; weightRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } }),
    [color]
  );

  useFrame((_, delta) => {
    const target = weightRef.current;
    uniforms.uOpacity.value = THREE.MathUtils.damp(uniforms.uOpacity.value, target, 4, delta);
    if (group.current) {
      group.current.visible = uniforms.uOpacity.value > 0.02;
      group.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group ref={group} position={[0, 0, -1]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]}>
          <planeGeometry args={[1.4, 7, 1, 1]} />
          <shaderMaterial
            ref={i === 0 ? materialRef : undefined}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            uniforms={uniforms}
            vertexShader={BEAM_VERTEX}
            fragmentShader={BEAM_FRAGMENT}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress, reduced }: { progress: React.MutableRefObject<number>; reduced: boolean }) {
  const { camera, pointer } = useThree();
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 9),
        new THREE.Vector3(3.2, -0.8, 6.4),
        new THREE.Vector3(-3, 0.9, 5.2),
        new THREE.Vector3(2.2, 1.6, 6),
        new THREE.Vector3(0, 0.2, 3.6)
      ]),
    []
  );

  useFrame((_, delta) => {
    const t = reduced ? 0 : progress.current;
    const point = curve.getPointAt(THREE.MathUtils.clamp(t, 0, 0.999));
    const lookPoint = curve.getPointAt(THREE.MathUtils.clamp(t + 0.04, 0, 0.999));
    const parallaxX = reduced ? 0 : pointer.x * 0.35;
    const parallaxY = reduced ? 0 : pointer.y * 0.22;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, point.x + parallaxX, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, point.y + parallaxY, 2.4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, point.z, 2.4, delta);
    camera.lookAt(lookPoint.x, lookPoint.y, lookPoint.z - 2);
  });

  return null;
}

function TheatreScene({ accent, accent2, reduced, count }: { accent: string; accent2: string; reduced: boolean; count: number }) {
  const progress = useScrollProgress(reduced);
  const heroWeight = useRef(1);
  const wireWeight = useRef(0);
  const glassWeight = useRef(0);
  const beamWeight = useRef(0);
  const portalWeight = useRef(0);

  useFrame(() => {
    const t = reduced ? 0 : progress.current;
    heroWeight.current = bump(t, 0, 0.22);
    wireWeight.current = bump(t, 0.28, 0.2);
    glassWeight.current = bump(t, 0.52, 0.2);
    beamWeight.current = bump(t, 0.74, 0.2);
    portalWeight.current = bump(t, 1, 0.24);
  });

  return (
    <>
      <CameraRig progress={progress} reduced={reduced} />
      <ambientLight intensity={0.6} />
      <GlowField count={Math.round(140 * count)} spread={7} size={0.05} color={accent} pull={0} weightRef={heroWeight} />
      <WireCluster color={accent2} weightRef={wireWeight} />
      <GlassPanes color={accent} weightRef={glassWeight} />
      <LightBeam color={accent2} weightRef={beamWeight} />
      <GlowField count={Math.round(90 * count)} spread={3.6} size={0.045} color={accent} pull={1} weightRef={portalWeight} />
    </>
  );
}

export function CinematicBackground() {
  const palette = useExperienceStore((state) => state.palette);
  const active = palettes[palette];
  const perf = usePerfProfile();

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <TheatreScene accent={active.accent} accent2={active.accent2} reduced={perf.reduced} count={perf.count} />
      </Canvas>
    </div>
  );
}
