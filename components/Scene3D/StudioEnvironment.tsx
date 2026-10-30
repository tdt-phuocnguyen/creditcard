"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio lighting for metallic / glassy materials. Built from
 * Lightformers, so no HDR files are fetched at runtime (works offline).
 * Cool key light, cyan and violet rims — the deck's restrained palette.
 */
export function StudioEnvironment({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={intensity}>
      <color attach="background" args={["#05080f"]} />
      {/* soft overhead key */}
      <Lightformer form="rect" intensity={2.2} color="#dbe7ff" position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      {/* cyan rim, right */}
      <Lightformer form="rect" intensity={3} color="#55d6e8" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.2, 1]} />
      {/* electric blue rim, left */}
      <Lightformer form="rect" intensity={2.4} color="#4ea1ff" position={[-6, 0.5, 1]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
      {/* faint violet fill from below */}
      <Lightformer form="ring" intensity={1.2} color="#8b7cff" position={[0, -4, 3]} scale={3} />
      {/* thin highlight strip for edge glints */}
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 2, 6]} scale={[8, 0.25, 1]} />
    </Environment>
  );
}
