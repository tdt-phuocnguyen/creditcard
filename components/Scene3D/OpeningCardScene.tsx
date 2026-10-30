"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CARD_ASPECT, createCardBody, createCardFaceGeometry, createCardFaceTexture } from "./cardFace";
import { SceneCanvas } from "./SceneCanvas";
import type { SceneProps } from "./SceneHost";
import { StudioEnvironment } from "./StudioEnvironment";

const CARD_W = 3.4;
const CARD_H = CARD_W / CARD_ASPECT;
/** ID-1 corner radius is ~3.7% of the card width. */
const CARD_R = CARD_W * 0.037;

type Pose = { x: number; y: number; rx: number; ry: number; rz: number };

/** "hero": slide 1 entrance. "calm": slide 19 — settled, more frontal, slower. */
export type CardPose = "hero" | "calm";

const POSES: Record<CardPose, { start: Pose; rest: Pose; entry: number; float: number }> = {
  hero: {
    start: { x: 0.9, y: -0.55, rx: 0.55, ry: -1.15, rz: 0.22 },
    rest: { x: 0, y: 0.05, rx: 0.17, ry: -0.44, rz: 0.07 },
    entry: 1.6,
    float: 1,
  },
  calm: {
    start: { x: 0, y: -0.25, rx: 0.32, ry: -0.3, rz: 0.04 },
    rest: { x: 0, y: 0, rx: 0.1, ry: -0.18, rz: 0.02 },
    entry: 1.4,
    float: 0.5,
  },
};

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Card({ pose, reducedMotion }: { pose: CardPose; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const startedAt = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const face = useMemo(() => createCardFaceTexture(), []);
  const body = useMemo(() => createCardBody(CARD_W, CARD_H, CARD_R), []);
  const faceGeometry = useMemo(() => createCardFaceGeometry(CARD_W - 0.03, CARD_H - 0.03, CARD_R - 0.015), []);
  const { invalidate } = useThree();
  const config = POSES[pose];

  useEffect(
    () => () => {
      face.dispose();
      body.geometry.dispose();
      faceGeometry.dispose();
    },
    [face, body, faceGeometry],
  );

  // Gentle parallax from the pointer anywhere on the page (not just the canvas).
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { start, rest, entry, float } = config;
    if (reducedMotion) {
      g.position.set(rest.x, rest.y, 0);
      g.rotation.set(rest.rx, rest.ry, rest.rz);
      return;
    }
    const t = state.clock.elapsedTime;
    if (startedAt.current === null) startedAt.current = t;
    const p = easeOutQuart(Math.min(1, (t - startedAt.current) / entry));

    const p2 = pointer.current;
    const k = 1 - Math.exp(-delta * 2.5);
    p2.sx += (p2.x - p2.sx) * k;
    p2.sy += (p2.y - p2.sy) * k;

    const floatY = Math.sin(t * 0.7) * 0.05 * float;
    const floatR = Math.sin(t * 0.43) * 0.035 * float;

    g.position.set(lerp(start.x, rest.x, p), lerp(start.y, rest.y, p) + floatY * p, 0);
    g.rotation.set(
      lerp(start.rx, rest.rx, p) + p2.sy * 0.07 * p,
      lerp(start.ry, rest.ry, p) + floatR + p2.sx * 0.11 * p,
      lerp(start.rz, rest.rz, p),
    );
  });

  return (
    <group ref={group}>
      <mesh geometry={body.geometry}>
        <meshPhysicalMaterial
          color="#2a303c"
          metalness={0.9}
          roughness={0.34}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* face graphics a hair above the front surface */}
      <mesh geometry={faceGeometry} position={[0, 0, body.frontZ + 0.0015]}>
        <meshStandardMaterial
          map={face}
          emissiveMap={face}
          emissive="#ffffff"
          emissiveIntensity={0.4}
          transparent
          metalness={0.2}
          roughness={0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Scene A — the premium metal card for the opening (and, calmer, the closing). */
export function CardScene({ step: _step, reducedMotion, onReady, onLost, pose = "hero" }: SceneProps & { pose?: CardPose }) {
  return (
    <SceneCanvas reducedMotion={reducedMotion} onReady={onReady} onLost={onLost} camera={{ position: [0, 0, 9.4], fov: 30 }}>
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 6]} intensity={1.1} color="#e6eeff" />
      <directionalLight position={[-5, -1, 2]} intensity={0.6} color="#4ea1ff" />
      <StudioEnvironment intensity={1} />
      <Card pose={pose} reducedMotion={reducedMotion} />
      <Sparkles
        count={pose === "hero" ? 46 : 24}
        scale={[7.5, 4.6, 2.5]}
        position={[0, 0, -0.6]}
        size={1.6}
        speed={reducedMotion ? 0 : 0.18}
        opacity={0.32}
        color="#55d6e8"
      />
    </SceneCanvas>
  );
}

export default function OpeningCardScene(props: SceneProps) {
  return <CardScene {...props} pose="hero" />;
}
