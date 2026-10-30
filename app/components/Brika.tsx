
"use client";

import * as THREE from "three";
import { JSX, useEffect, useMemo, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import {
  useGLTF,
  Billboard,
  useScroll,
  useVideoTexture,
  PresentationControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { motion as m } from "r3f-motion";

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

type BrikaProps = Omit<JSX.IntrinsicElements["group"], "color"> & {
  color?: THREE.ColorRepresentation;
  accentColor?: THREE.ColorRepresentation;
};

const MODEL_URL = "/models/brika_lp.glb";

const WHEEL_POSITION: [number, number, number] = [-0.0004, 0.044, 0.003];
const BUTTON_POSITION: [number, number, number] = [0, 0.038, 0.007];
const FLAME_POSITION: [number, number, number] = [0, 0.055, -0.0075];

function Flame({
  materialRef,
}: {
  materialRef: RefObject<THREE.MeshBasicMaterial | null>;
}) {
  const flameTexture = useVideoTexture("/textures/flame.webm");

  return (
    <group position={FLAME_POSITION}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.02, 0.02]} />
          <meshBasicMaterial
            ref={materialRef}
            map={flameTexture}
            alphaMap={flameTexture}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

export function Brika({
  color = "#2563eb",
  accentColor = "#000",
  ...props
}: BrikaProps) {
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult;

  const scroll = useScroll();

  const wheelRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Group>(null);
  const gasRef = useRef<THREE.Mesh>(null);
  const flameMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const fuelBounds = useMemo(() => {
    const geometry = nodes.gas_Baked.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    return {
      bottom: geometry.boundingBox!.min.y,
    };
  }, [nodes.gas_Baked.geometry]);

  // Custom case material
  const caseMaterial = useMemo(() => {
    const material = materials["case_Baked.001"].clone();

    material.roughness = 0.7;
    material.thickness = 0.005;
    material.ior = 1.46;
    material.side = THREE.FrontSide;
    material.depthWrite = true;
    material.normalScale.set(0.15, 0.15);

    return material;
  }, [materials]);

  const caseColor = useMemo(() => new THREE.Color(color), [color]);

  useEffect(() => {
    return () => caseMaterial.dispose();
  }, [caseMaterial]);

  useEffect(() => {
    const wheel = wheelRef.current;
    const button = buttonRef.current;
    const gas = gasRef.current;
    const flame = flameMaterialRef.current;

    if (!wheel || !button || !gas || !flame) return;

    // Initial states
    gsap.set(wheel.rotation, { x: 0 });
    gsap.set(button.position, { y: BUTTON_POSITION[1] });
    gsap.set(gas.scale, { y: 1 });
    gsap.set(gas.position, { y: 0 });
    gsap.set(flame, { opacity: 0 });

    const timeline = gsap.timeline({
      paused: true,
    });

    // 1. Wheel rotation
    timeline.to(
      wheel.rotation,
      {
        x: `+=${Math.PI * 50}`,
        duration: 1,
        ease: "none",
      },
      0
    );

    // 2. Button movement
    timeline.to(
      button.position,
      {
        y: BUTTON_POSITION[1] - 0.0005,
        duration: 0.2,
        ease: "power1.inOut",
      },
      0.15
    );

    // 3. Fuel consumption
    timeline.to(
      gas.scale,
      {
        y: 0.2,
        duration: 0.7,
        ease: "none",
      },
      0.2
    );

    timeline.to(
      gas.position,
      {
        y: fuelBounds.bottom * 0.8,
        duration: 0.7,
        ease: "none",
      },
      0.2
    );

    // 4. Flame appearance
    timeline.to(
      flame,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power1.in",
      },
      0.45
    );

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [fuelBounds]);

  // Synchronize GSAP with Drei scroll progress
  useFrame(() => {
    timelineRef.current?.progress(scroll.offset);
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.case_Baked.geometry}
        material={caseMaterial}
        material-color={caseColor}
      />

      <m.group
  ref={buttonRef}
  position={BUTTON_POSITION}
  
>
  <m.mesh
  whileHover={{ scale: 1.04 }}
  whileTap={{ 
    y:-0.001,
  }}
  onPointerOver={() => (document.body.style.cursor = "pointer")}
  onPointerOut={() => (document.body.style.cursor = "auto")}
    geometry={nodes.button_Baked.geometry}
    material={materials.button_Baked}
    material-color={accentColor}
  />
</m.group>

      <mesh
        ref={gasRef}
        geometry={nodes.gas_Baked.geometry}
        material={materials.gas_Baked}
        position={[0, -0.007, 0]}
      />

      <mesh
        geometry={nodes.metal_Baked.geometry}
        material={materials.metal_Baked}
        position={[0, 0.043, -0.003]}
      />

      <mesh
        geometry={nodes.pac_Baked.geometry}
        material={materials.pac_Baked}
        material-color={accentColor}
        position={[0, 0.036, -0.013]}
      />

      <mesh
        geometry={nodes.plastic_top_Baked.geometry}
        material={materials["plastic top_Baked"]}
        material-color={accentColor}
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

     
  <m.group
  whileHover={{ scale: 1.02 }}
  ref={wheelRef}
  onPointerOver={() => (document.body.style.cursor = "pointer")}
  onPointerOut={() => (document.body.style.cursor = "auto")}
  onClick={() => {
    if (!wheelRef.current) return;

    gsap.to(wheelRef.current.rotation, {
      x: `+=${5}`,
      duration: 1,
      ease: "power2.out",
      overwrite: "auto",
    });
  }}
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
</m.group>

      

      <Flame materialRef={flameMaterialRef} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
