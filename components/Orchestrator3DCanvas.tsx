"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/lib/store";
import {
  DOMAIN_OPTIONS,
  LIGHTING_OPTIONS,
  COMPOSITION_OPTIONS,
  MATERIAL_OPTIONS,
} from "@/lib/constants";
import { Sparkles, RefreshCw } from "lucide-react";

// =========================================================================
// SATELLITE NODE 1: LIGHTING (Amber Octahedron)
// =========================================================================
function LightingSatellite({
  radius = 2.4,
  speed = 0.8,
}: {
  radius?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lighting = useStudioStore((s) => s.lighting);
  const setLighting = useStudioStore((s) => s.setLighting);
  const [hovered, setHovered] = useState(false);

  const cycleLighting = (e: any) => {
    e.stopPropagation();
    const currentIndex = LIGHTING_OPTIONS.indexOf(lighting);
    const nextIndex = (currentIndex + 1) % LIGHTING_OPTIONS.length;
    setLighting(LIGHTING_OPTIONS[nextIndex]);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.4;
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={cycleLighting}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 0.48 : 0.4}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={hovered ? 0.6 : 0.25}
        roughness={0.15}
        metalness={0.8}
      />
      <pointLight color="#F59E0B" intensity={1.5} distance={3} />
      <Html distanceFactor={8} position={[0, 1.2, 0]} center>
        <div
          onClick={cycleLighting}
          className="px-2 py-0.5 rounded-md bg-zinc-950/90 border border-amber-500/50 text-[10px] font-mono text-amber-300 shadow-lg cursor-pointer whitespace-nowrap select-none backdrop-blur-sm pointer-events-auto hover:bg-amber-950/80 transition-colors"
        >
          💡 {lighting}
        </div>
      </Html>
    </mesh>
  );
}

// =========================================================================
// SATELLITE NODE 2: COMPOSITION / FRAMING (Cyan Torus)
// =========================================================================
function CompositionSatellite({
  radius = 3.2,
  speed = -0.6,
}: {
  radius?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const composition = useStudioStore((s) => s.composition);
  const setComposition = useStudioStore((s) => s.setComposition);
  const [hovered, setHovered] = useState(false);

  const cycleComposition = (e: any) => {
    e.stopPropagation();
    const currentIndex = COMPOSITION_OPTIONS.indexOf(composition);
    const nextIndex = (currentIndex + 1) % COMPOSITION_OPTIONS.length;
    setComposition(COMPOSITION_OPTIONS[nextIndex]);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + Math.PI;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.position.y = Math.cos(t * 1.2) * 0.5;
      meshRef.current.rotation.x += 0.015;
      meshRef.current.rotation.z += 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={cycleComposition}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 0.42 : 0.35}
    >
      <torusGeometry args={[0.9, 0.3, 16, 32]} />
      <meshStandardMaterial
        color="#06B6D4"
        emissive="#06B6D4"
        emissiveIntensity={hovered ? 0.6 : 0.25}
        roughness={0.2}
        metalness={0.9}
      />
      <Html distanceFactor={8} position={[0, 1.2, 0]} center>
        <div
          onClick={cycleComposition}
          className="px-2 py-0.5 rounded-md bg-zinc-950/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-lg cursor-pointer whitespace-nowrap select-none backdrop-blur-sm pointer-events-auto hover:bg-cyan-950/80 transition-colors"
        >
          📐 {composition}
        </div>
      </Html>
    </mesh>
  );
}

// =========================================================================
// SATELLITE NODE 3: MATERIAL / SURFACE QUALITY (Purple Cube)
// =========================================================================
function MaterialSatellite({
  radius = 2.8,
  speed = 0.5,
}: {
  radius?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useStudioStore((s) => s.material);
  const setMaterial = useStudioStore((s) => s.setMaterial);
  const [hovered, setHovered] = useState(false);

  const cycleMaterial = (e: any) => {
    e.stopPropagation();
    const currentIndex = MATERIAL_OPTIONS.indexOf(material);
    const nextIndex = (currentIndex + 1) % MATERIAL_OPTIONS.length;
    setMaterial(MATERIAL_OPTIONS[nextIndex]);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + Math.PI * 0.5;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.position.y = Math.sin(t * 0.9) * 0.45;
      meshRef.current.rotation.x += 0.025;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={cycleMaterial}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 0.42 : 0.35}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#A855F7"
        emissive="#A855F7"
        emissiveIntensity={hovered ? 0.6 : 0.25}
        roughness={0.1}
        metalness={0.8}
      />
      <Html distanceFactor={8} position={[0, 1.2, 0]} center>
        <div
          onClick={cycleMaterial}
          className="px-2 py-0.5 rounded-md bg-zinc-950/90 border border-purple-500/50 text-[10px] font-mono text-purple-300 shadow-lg cursor-pointer whitespace-nowrap select-none backdrop-blur-sm pointer-events-auto hover:bg-purple-950/80 transition-colors"
        >
          ✨ {material}
        </div>
      </Html>
    </mesh>
  );
}

// =========================================================================
// CENTRAL GRAVITY CORE: DOMAIN ANCHOR (Icosahedron)
// =========================================================================
function DomainAnchor() {
  const meshRef = useRef<THREE.Mesh>(null);
  const domain = useStudioStore((s) => s.domain);
  const setDomain = useStudioStore((s) => s.setDomain);
  const brandColor = useStudioStore((s) => s.brandColor);
  const [hovered, setHovered] = useState(false);

  const cycleDomain = (e: any) => {
    e.stopPropagation();
    const currentIndex = DOMAIN_OPTIONS.indexOf(domain);
    const nextIndex = (currentIndex + 1) % DOMAIN_OPTIONS.length;
    setDomain(DOMAIN_OPTIONS[nextIndex]);
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
  });

  const anchorColor = useMemo(() => {
    if (brandColor && /^#[0-9A-Fa-f]{6}$/.test(brandColor)) {
      return brandColor;
    }
    return "#E8DFD8";
  }, [brandColor]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        onClick={cycleDomain}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 0.9}
      >
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={anchorColor}
          emissive={anchorColor}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.2}
          metalness={0.7}
          distort={0.25}
          speed={1.5}
        />
        <Html distanceFactor={8} position={[0, 1.5, 0]} center>
          <div
            onClick={cycleDomain}
            className="px-3 py-1 rounded-lg bg-zinc-950/95 border-2 border-amber-400 text-xs font-semibold text-white shadow-2xl cursor-pointer whitespace-nowrap select-none backdrop-blur-md pointer-events-auto hover:scale-105 transition-transform"
          >
            🏛️ DOMAIN: <span className="text-amber-400">{domain}</span>
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

// =========================================================================
// ORCHESTRATOR 3D SCENE ROOT
// =========================================================================
function SceneRoot() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, -4, -5]} intensity={0.6} color="#818CF8" />
      
      {/* Central Domain Gravity Anchor */}
      <DomainAnchor />

      {/* Orbiting Satellites */}
      <LightingSatellite radius={2.5} speed={0.7} />
      <CompositionSatellite radius={3.4} speed={-0.5} />
      <MaterialSatellite radius={2.9} speed={0.4} />

      {/* Subtle Orbital Tracks (Wireframe rings) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.48, 2.52, 64]} />
        <meshBasicMaterial color="#3F3F46" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.88, 2.92, 64]} />
        <meshBasicMaterial color="#3F3F46" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.38, 3.42, 64]} />
        <meshBasicMaterial color="#3F3F46" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={9.0}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

// =========================================================================
// EXPORTED ORCHESTRATOR 3D CANVAS WRAPPER
// =========================================================================
export default function Orchestrator3DCanvas() {
  const domain = useStudioStore((s) => s.domain);
  const setLighting = useStudioStore((s) => s.setLighting);
  const setComposition = useStudioStore((s) => s.setComposition);
  const setMaterial = useStudioStore((s) => s.setMaterial);

  // Theme-Locked Randomizer: Scrambles secondary parameters while locking main domain
  const handleThemeScramble = () => {
    const randomLighting =
      LIGHTING_OPTIONS[Math.floor(Math.random() * LIGHTING_OPTIONS.length)];
    const randomComposition =
      COMPOSITION_OPTIONS[Math.floor(Math.random() * COMPOSITION_OPTIONS.length)];
    const randomMaterial =
      MATERIAL_OPTIONS[Math.floor(Math.random() * MATERIAL_OPTIONS.length)];

    setLighting(randomLighting);
    setComposition(randomComposition);
    setMaterial(randomMaterial);
  };

  return (
    <div className="relative w-full h-[480px] rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 shadow-2xl overflow-hidden group">
      {/* 3D R3F Canvas */}
      <Canvas
        camera={{ position: [0, 2.5, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneRoot />
      </Canvas>

      {/* Floating HUD Controller Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1 rounded-xl bg-zinc-900/90 border border-zinc-700/60 backdrop-blur-md flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-200">
            3D Tactile Controller
          </span>
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            (Tap nodes to cycle • Drag to orbit)
          </span>
        </div>

        {/* Theme Locked Scramble Button */}
        <button
          onClick={handleThemeScramble}
          className="pointer-events-auto px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Lock Domain & Scramble</span>
        </button>
      </div>

      {/* Floating Bottom Quick Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Lighting
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Composition
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Material
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-500 font-mono text-[10px]">
          Anchor: {domain}
        </div>
      </div>
    </div>
  );
}
