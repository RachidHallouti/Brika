
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import Experiance from "./components/Experiance";
import { useBrikaStore } from "./store/useBrikaStore";

export default function Home() {
  const color = useBrikaStore((s) => s.color);
  const fuel = useBrikaStore((s) => s.fuelLevel);
  const isIgniting = useBrikaStore((s) => s.isIgniting);

  const setColor = useBrikaStore((s) => s.setColor);
  const setFuelLevel = useBrikaStore(
    (s) => s.setFuelLevel
  );
  const setIsIgniting = useBrikaStore(
    (s) => s.setIsIgniting
  );
  const triggerIgnition = useBrikaStore(
    (s) => s.triggerIgnition
  );

  const sceneRef = useRef<HTMLDivElement>(null);
  const ignitionTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const lastIgnition = useRef(0);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;

      if (fuel <= 0) return;

      event.preventDefault();

      const now = performance.now();

      // Avoid excessive ignition triggers
      if (now - lastIgnition.current < 650) {
        return;
      }

      lastIgnition.current = now;
      triggerIgnition();

      if (ignitionTimer.current) {
        clearTimeout(ignitionTimer.current);
      }

      ignitionTimer.current = setTimeout(() => {
        setIsIgniting(false);
      }, 650);
    };

    element.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      element.removeEventListener("wheel", handleWheel);

      if (ignitionTimer.current) {
        clearTimeout(ignitionTimer.current);
      }
    };
  }, [fuel, triggerIgnition, setIsIgniting]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#e9ecef]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#e9ecef_55%,#cbd5e1_100%)]" />

      {/* 3D scene */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
      >
        <Canvas
          camera={{
            position: [0, 0, 11],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <Experiance />
          </Suspense>
        </Canvas>
      </div>

      {/* Header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <h1 className="text-xl font-black tracking-tight text-neutral-900">
          BRIKA®
        </h1>

        <span className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
          Interactive lighter
        </span>
      </header>

      {/* Controls */}
      <aside className="absolute right-4 bottom-5 left-4 z-20 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl backdrop-blur-xl md:top-1/2 md:right-8 md:bottom-auto md:left-auto md:w-72 md:-translate-y-1/2">
        <h2 className="mb-6 text-xl font-semibold text-neutral-900">
          Customize Brika
        </h2>

        <div className="mb-6">
          <label
            htmlFor="brika-color"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Case color
          </label>

          <input
            id="brika-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-12 w-16 cursor-pointer"
          />
        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between">
            <label
              htmlFor="brika-fuel"
              className="text-sm font-medium text-neutral-700"
            >
              Fuel level
            </label>

            <span className="text-sm font-semibold text-neutral-900">
              {fuel}%
            </span>
          </div>

          <input
            id="brika-fuel"
            type="range"
            min="0"
            max="100"
            value={fuel}
            onChange={(e) =>
              setFuelLevel(Number(e.target.value))
            }
            className="w-full cursor-pointer accent-neutral-900"
          />
        </div>

        <button
          type="button"
          onPointerDown={(e) => {
            if (fuel <= 0) return;

            e.currentTarget.setPointerCapture(e.pointerId);
            triggerIgnition();
          }}
          onPointerUp={() => setIsIgniting(false)}
          onPointerCancel={() => setIsIgniting(false)}
          onLostPointerCapture={() => setIsIgniting(false)}
          disabled={fuel <= 0}
          className={`w-full touch-none select-none rounded-xl px-5 py-4 text-sm font-bold tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            isIgniting
              ? "bg-orange-500 text-white"
              : "bg-neutral-900 text-white"
          }`}
        >
          {isIgniting ? "IGNITING..." : "HOLD TO IGNITE"}
        </button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Scroll down over the lighter to ignite
        </p>
      </aside>
    </main>
  );
}
