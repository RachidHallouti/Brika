
"use client";

import * as THREE from "three";
import { JSX, useEffect, useMemo, useRef } from "react";
import { useGLTF,Billboard ,useScroll, useVideoTexture} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three-stdlib";

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
  color?: THREE.ColorRepresentation;
} & {
  accentColor?: THREE.ColorRepresentation;

}

const MODEL_URL = "/models/brika_lp.glb";

const WHEEL_POSITION: [number, number, number] = [
  0, 0.044, 0.003
];

const BUTTON_POSITION: [number, number, number] = [
  0, 0.038, 0.007
];

const FLAME_POSITION: [number, number, number] = [
  0, 0.055, -0.0075
];

function Flame() {
  const flameRef = useRef<THREE.Group>(null);
  const flameMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const scroll = useScroll();
  const flameTexture = useVideoTexture(
    "/textures/flame.webm"
  );
  useFrame(() => {
    if(!flameMaterialRef.current) return;
    flameMaterialRef.current.opacity = scroll.offset 
    
  });
  return (
    <group ref={flameRef} position={FLAME_POSITION}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.02, 0.02]} />
          <meshBasicMaterial
            ref = {flameMaterialRef}
            opacity={0}
            map={flameTexture}
            alphaMap={flameTexture}
            transparent
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
  const { nodes, materials } = useGLTF(
    MODEL_URL
  ) as unknown as GLTFResult;

  const wheelRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Group>(null);
  const gasRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  



  const fuelBounds = useMemo(() => {
    const geometry = nodes.gas_Baked.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const bounds = geometry.boundingBox!;

    return { bottom: bounds.min.y };
  }, [nodes.gas_Baked.geometry]);


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


useFrame(() => {
  const progress = scroll.offset;

  if (wheelRef.current) {
    wheelRef.current.rotation.x =
      progress * Math.PI * 50;
  }

  if (buttonRef.current) {
    buttonRef.current.position.y =
      BUTTON_POSITION[1] - progress * 0.0005;
  }

   if (gasRef.current) {
    const level = THREE.MathUtils.clamp(
      1 - progress * 0.8,
      0,
      1
    );

    gasRef.current.scale.y = level;

    gasRef.current.position.y =
      fuelBounds.bottom * (1 - level);
  }
});

  
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
          material-color={accentColor}
        />
      </group>

      
        <group position={[0, -0.007, 0]}>
          <mesh
          ref={gasRef}
            geometry={nodes.gas_Baked.geometry}
            material={materials.gas_Baked}
          />
        </group>
      

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

      <Flame  />
      
    
    </group>
  );
}

useGLTF.preload(MODEL_URL);
