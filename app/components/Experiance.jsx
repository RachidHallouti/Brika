
"use client";

import {
  Environment,
  OrbitControls,
  ScrollControls,
  Lightformer,
  Float,
} from "@react-three/drei";

import { Brika } from "./Brika";
import { useBrikaStore } from "../store/useBrikaStore";

export default function Experience() {
  const color = useBrikaStore((state) => state.color);
  const accentColor = useBrikaStore((state) => state.accentColor);

  return (
    
    <ScrollControls
        pages={3}
        damping={1}
        horizontal={false}
      >
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={0.3} />

      <directionalLight
        position={[4, 6, 5]}
        intensity={3}
      />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={1}
      />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={4}
          position={[3, 4, 5]}
          scale={[4, 6, 1]}
        />

        <Lightformer
          form="rect"
          intensity={2}
          position={[-4, 2, 2]}
          scale={[2, 5, 1]}
        />

        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 5, -4]}
          scale={[5, 2, 1]}
        />
      </Environment>

      <Float
        
      >
        <Brika
          scale={60}
          rotation-y={-Math.PI / 2}
          position-y={-0.5}
          color={color}
          accentColor={accentColor}
        />
      </Float>
      </ScrollControls>
    
  );
}
