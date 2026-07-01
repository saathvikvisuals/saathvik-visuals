"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";
import { modes, type ModeKey } from "@/data/portfolio";
import { useExperienceStore } from "@/store/experience-store";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.THREE.Clock")) return;
    originalWarn(...args);
  };
}

// Each mode's particle field reflects its own stated intent (see modes[].description
// in data/portfolio.ts) instead of all four looking like the same field in a different
// color: minimal stays quiet and sparse, future leans into depth and system motion.
const FIELD_BY_MODE: Record<ModeKey, { count: number; spread: number; size: number; opacity: number; speed: number; pageOpacity: number }> = {
  minimal: { count: 40, spread: 8, size: 0.016, opacity: 0.16, speed: 0.01, pageOpacity: 0.18 },
  founder: { count: 90, spread: 9, size: 0.02, opacity: 0.22, speed: 0.018, pageOpacity: 0.28 },
  creative: { count: 200, spread: 13, size: 0.026, opacity: 0.3, speed: 0.034, pageOpacity: 0.42 },
  future: { count: 260, spread: 14, size: 0.024, opacity: 0.32, speed: 0.05, pageOpacity: 0.48 },
};

export function CinematicBackground() {
  const mode = useExperienceStore((state) => state.mode);
  const accent = modes[mode].accent;
  const field = FIELD_BY_MODE[mode];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700" style={{ opacity: field.pageOpacity }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <ParticleField color={accent} field={field} />
      </Canvas>
    </div>
  );
}

function ParticleField({ color, field }: { color: string; field: (typeof FIELD_BY_MODE)[ModeKey] }) {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(field.count * 3);
    for (let i = 0; i < field.count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * field.spread * 1.7;
      values[i * 3 + 1] = (Math.random() - 0.5) * field.spread;
      values[i * 3 + 2] = (Math.random() - 0.5) * field.spread;
    }
    return values;
  }, [field.count, field.spread]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * field.speed;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={field.size} sizeAttenuation depthWrite={false} opacity={field.opacity} />
    </Points>
  );
}
