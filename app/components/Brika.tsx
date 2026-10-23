
"use client";

import * as THREE from "three";
import { JSX, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import gsap from "gsap";
import { useBrikaStore } from "../store/useBrikaStore";

type GLTFResult = GLTF & {
  nodes: {
    case_Baked: THREE.Mesh;
    button_Baked: THREE.Mesh;
    gas_Baked: THREE.Mesh;
    metal_Baked: THREE.Mesh;
    pac_Baked: THREE.Mesh;
    plastic_top_Baked: THREE.Mesh;
    tube_in_Baked: THREE.Mesh;
    tube_Baked: THREE.Mesh;
    wheel001_Baked: THREE.Mesh;
    wheel_Baked: THREE.Mesh;
  };
  materials: {
    "case_Baked.001": THREE.MeshPhysicalMaterial;
    button_Baked: THREE.MeshPhysicalMaterial;
    gas_Baked: THREE.MeshPhysicalMaterial;
    metal_Baked: THREE.MeshPhysicalMaterial;
    pac_Baked: THREE.MeshPhysicalMaterial;
    "plastic top_Baked": THREE.MeshPhysicalMaterial;
    "tube in_Baked": THREE.MeshPhysicalMaterial;
    tube_Baked: THREE.MeshPhysicalMaterial;
    "wheel.001_Baked": THREE.MeshPhysicalMaterial;
    "wheel_Baked.1001": THREE.MeshPhysicalMaterial;
  };
};

type BrikaProps = Omit<
  JSX.IntrinsicElements["group"],
  "color"
> & {
  fuel?: number;
  color?: THREE.ColorRepresentation;
};

const MODEL_URL = "/models/brika_lp.glb";

// Local coordinates before the model's scale={60}.
const WHEEL_POSITION: [number, number, number] = [
  0, 0.044, 0.003
];

const BUTTON_POSITION: [number, number, number] = [
  0, 0.038, 0.007
];

const FLAME_POSITION: [number, number, number] = [
  0, 0.057, -0.003
];

function Flame() {
  const flameRef = useRef<THREE.Group>(null);
  const isIgniting = useBrikaStore((s) => s.isIgniting);

  useFrame(({ clock }) => {
    if (!flameRef.current || !isIgniting) return;

    const t = clock.elapsedTime;

    flameRef.current.scale.set(
      1 + Math.sin(t * 21) * 0.07,
      1 + Math.sin(t * 17) * 0.12,
      1 + Math.sin(t * 19) * 0.07
    );
  });

  if (!isIgniting) return null;

  return (
    <group ref={flameRef} position={FLAME_POSITION}>
      <mesh position={[0, 0.009, 0]}>
        <coneGeometry args={[0.004, 0.022, 16]} />
        <meshBasicMaterial
          color="#ff9b19"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.005, 0.0005]}>
        <coneGeometry args={[0.002, 0.012, 12]} />
        <meshBasicMaterial
          color="#78baff"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[0, 0.014, 0]}
        color="#ff9b32"
        intensity={0.3}
        distance={0.2}
        decay={2}
      />
    </group>
  );
}

export function Brika({
  fuel = 100,
  color = "#2563eb",
  ...props
}: BrikaProps) {
  const { nodes, materials } = useGLTF(
    MODEL_URL
  ) as unknown as GLTFResult;

  const wheelRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Group>(null);

  const ignitionCount = useBrikaStore(
    (s) => s.ignitionCount
  );
  const isIgniting = useBrikaStore(
    (s) => s.isIgniting
  );
  const setIsIgniting = useBrikaStore(
    (s) => s.setIsIgniting
  );

  const fuelBounds = useMemo(() => {
    const geometry = nodes.gas_Baked.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const bounds = geometry.boundingBox!;

    return { bottom: bounds.min.y };
  }, [nodes.gas_Baked.geometry]);

  const fuelScale = THREE.MathUtils.clamp(
    fuel / 100,
    0,
    1
  );

  const fuelOffset =
    fuelBounds.bottom * (1 - fuelScale);

  const caseMaterial = useMemo(() => {
    const material =
      materials["case_Baked.001"].clone();

    material.roughness = 0.7;
    material.thickness = 0.005;
    material.ior = 1.46;
    material.side = THREE.FrontSide;
    material.depthWrite = true;
    material.normalScale.set(0.15, 0.15);

    return material;
  }, [materials]);

  useEffect(() => {
    return () => caseMaterial.dispose();
  }, [caseMaterial]);

  const caseColor = useMemo(
    () => new THREE.Color(color),
    [color]
  );

  // Spin the wheel once for every ignition event.
  useEffect(() => {
    if (ignitionCount === 0 || !wheelRef.current) {
      return;
    }

    const tween = gsap.to(wheelRef.current.rotation, {
      x: `+=${Math.PI * 1.5}`,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });

    return () => tween.kill();
  }, [ignitionCount]);

  // Press the button while ignition is active.
  useEffect(() => {
    if (!buttonRef.current) return;

    const tween = gsap.to(buttonRef.current.position, {
      y: isIgniting
        ? BUTTON_POSITION[1] - 0.002
        : BUTTON_POSITION[1],
      duration: 0.12,
      ease: "power2.out",
      overwrite: true,
    });

    return () => tween.kill();
  }, [isIgniting]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.case_Baked.geometry}
        material={caseMaterial}
        material-color={caseColor}
      />

      <group
        ref={buttonRef}
        position={BUTTON_POSITION}
      >
        <mesh
          geometry={nodes.button_Baked.geometry}
          material={materials.button_Baked}
        />
      </group>

      {fuelScale > 0 && (
        <group position={[0, -0.007, 0]}>
          <mesh
            geometry={nodes.gas_Baked.geometry}
            material={materials.gas_Baked}
            scale={[1, fuelScale, 1]}
            position={[0, fuelOffset, 0]}
          />
        </group>
      )}

      <mesh
        geometry={nodes.metal_Baked.geometry}
        material={materials.metal_Baked}
        position={[0, 0.043, -0.003]}
      />

      <mesh
        geometry={nodes.pac_Baked.geometry}
        material={materials.pac_Baked}
        position={[0, 0.036, -0.013]}
      />

      <mesh
        geometry={nodes.plastic_top_Baked.geometry}
        material={materials["plastic top_Baked"]}
        position={[0, 0.03, 0]}
      />

      <mesh
        geometry={nodes.tube_in_Baked.geometry}
        material={materials["tube in_Baked"]}
        position={[0, 0.02, -0.006]}
      />

      <mesh
        geometry={nodes.tube_Baked.geometry}
        material={materials.tube_Baked}
        position={[0, -0.005, -0.006]}
      />

      <group
        ref={wheelRef}
        position={WHEEL_POSITION}
      >
        <mesh
          geometry={nodes.wheel001_Baked.geometry}
          material={materials["wheel.001_Baked"]}
        />

        <mesh
          geometry={nodes.wheel_Baked.geometry}
          material={materials["wheel_Baked.1001"]}
        />
      </group>

      <Flame />

      {/* Invisible interaction mesh around the lighter */}
      <mesh
        position={[0, 0.025, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (fuelScale <= 0) return;

          e.target.setPointerCapture(e.pointerId);
          useBrikaStore.getState().triggerIgnition();
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          setIsIgniting(false);
        }}
        onPointerCancel={() => setIsIgniting(false)}
        onLostPointerCapture={() => setIsIgniting(false)}
      >
        <boxGeometry args={[0.03, 0.1, 0.025]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
