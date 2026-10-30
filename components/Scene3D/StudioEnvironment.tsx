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
      {/* broad, soft, neutral key in front: gentle sheen across the face */}
      <Lightformer form="rect" intensity={0.9} color="#c9d6ee" position={[0, 1.2, 7]} scale={[9, 5, 1]} />
      {/* top strip: crisp highlight along the upper edges */}
      <Lightformer form="rect" intensity={2.2} color="#eef3ff" position={[0, 4.5, 1.5]} rotation-x={Math.PI / 2} scale={[9, 1.2, 1]} />
      {/* cyan rim from behind-right: grazes the right edges only */}
      <Lightformer form="rect" intensity={4.5} color="#55d6e8" position={[5, 0.4, -3]} rotation-y={-Math.PI / 3} scale={[2.5, 6, 1]} />
      {/* electric-blue rim from behind-left */}
      <Lightformer form="rect" intensity={3.2} color="#4ea1ff" position={[-5, -0.2, -3]} rotation-y={Math.PI / 3} scale={[2.5, 6, 1]} />
      {/* faint violet bounce from below */}
      <Lightformer form="ring" intensity={0.9} color="#8b7cff" position={[0, -4.5, 1]} rotation-x={-Math.PI / 2} scale={3} />
    </Environment>
  );
}
