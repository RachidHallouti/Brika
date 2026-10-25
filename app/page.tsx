
"use client";

import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Experiance from "./components/Experiance";
import { useBrikaStore } from "./store/useBrikaStore";

const COLORS = [
  { name: "Ocean", value: "#2563eb" },
  { name: "Obsidian", value: "#5e5c64" },
  { name: "Flame", value: "#e01b24" },
  { name: "Forest", value: "#26a269" },
  { name: "Pearl", value: "#c0bfbc" },
];

const BrikaScene = memo(function BrikaScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 12],
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
  );
});

function CustomizationPanel() {
  const color = useBrikaStore((s) => s.color);
  const setColor = useBrikaStore((s) => s.setColor);

  return (
    <aside
      className="
        pointer-events-auto
        fixed
        lg:static 
        bottom-0 left-4 right-4 z-20
        rounded-t-[20px]
        lg:rounded-[28px]
        border border-white/80
        bg-white/75
        p-5
        shadow-[0_20px_60px_rgba(20,30,40,0.10)]
        backdrop-blur-2xl
        lg:right-auto lg:w-[320px]
        lg:bottom-10 lg:left-12 md:p-6
        h-fit
      "
    >
      <div className="mb-6 flex items-center justify-between">
          

          <h2 style={{color}} className="text-xl font-semibold tracking-tight ">
            Customize Brika
          </h2>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 17h16" />
            <circle cx="9" cy="7" r="3" fill="#f8fafc" />
            <circle cx="16" cy="17" r="3" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      <div className="h-px bg-black/10" />

      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700">
            Case finish
          </label>
          <div className="flex items-center font-mono text-[11px] uppercase tracking-wider text-neutral-500">
  <span>#</span>

  <input
    value={color.slice(1)}
    maxLength={6}
    className="w-14 bg-transparent text-right uppercase outline-none"
    onChange={(e) => {
      setColor(`#${e.target.value}`);
    }}
  />
</div>
           
        </div>

        <div className="flex items-center gap-3">
          {COLORS.map((swatch) => {
            const active =
              color.toLowerCase() ===
              swatch.value.toLowerCase();

            return (
              <button
                key={swatch.value}
                type="button"
                title={swatch.name}
                aria-label={swatch.name}
                aria-pressed={active}
                onClick={() => setColor(swatch.value)}
                className={`
                  cursor-pointer
                  relative h-9 w-9 shrink-0
                  rounded-full border border-black/10
                  transition-all duration-200
                  hover:scale-110
                  ${
                    active
                      ? "ring-2 ring-[#ff633e] ring-offset-[3px]"
                      : ""
                  }
                `}
                style={{
                  backgroundColor: swatch.value,
                }}
              />
            );
          })}

          <label
            className="
              relative flex h-9 w-9 shrink-0
              cursor-pointer items-center justify-center
              rounded-full border border-dashed
              border-neutral-400
              text-lg text-neutral-600
              transition hover:border-black hover:bg-black/5
            "
            title="Choose custom color"
          >
            <span aria-hidden="true">+</span>
            <input
              type="color"
              aria-label="Choose custom case color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  const color = useBrikaStore((s) => s.color);
  return (
    <main className="relative isolate h-[100svh] overflow-hidden bg-[#e9ecef] font-sans text-[#202327] selection:bg-[#ff633e]/20">
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_50%_42%,#ffffff_0%,#edf0f2_48%,#cdd3d9_100%)]
        "
      />

      <div
        className="
          pointer-events-none absolute inset-0
          opacity-[0.035]
          [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)]
          [background-size:72px_72px]
        "
      />

      <BrikaScene />

      <header
        className="
          pointer-events-none absolute inset-x-0 top-0 z-20
          flex items-center justify-between
          px-5 py-6
          md:px-12 md:py-9
        "
      >
        <div className="flex text-[26px] font-black tracking-[-0.09em] items-center gap-3">
            BRIKA<span style={{ color }}>.</span>
          
        </div>

        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span style={{ backgroundColor: color }} className="relative inline-flex h-2 w-2 rounded-full" />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
            By Rochdi.dev
          </span>
        </div>
      </header>

      <section
        className="
          pointer-events-none p-10 absolute w-full flex justify-between top-18 z-10
          lg:top-[23%]
        "
      >
        <div className="max-w-[350px]
          md:left-12 
          lg:max-w-[540px]">
        <h1
          className="
          text-[clamp(2.8rem,5.5vw,5.5rem)]
          font-semibold
          leading-[0.98]
          tracking-[-0.075em]
          text-[#202327]
          "
          >
          Developped By
          <span className="block" style={{ color }}>
            Rachid Hallouti
          </span>
        </h1>
          </div>
      <CustomizationPanel />

      </section>

     


      <div
        className="
          pointer-events-none absolute
          bottom-20 right-1/2 z-10 translate-x-1/2
          hidden items-center gap-5 lg:flex
        "
      >
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#202327]">
            Scroll Down
          </span>

          
        </div>

        <div
          className="
            flex h-20 w-13 items-start justify-center
            rounded-full border border-neutral-400/70
            p-2
          "
        >
          <div style={{ backgroundColor: color }} className="h-4 w-2 animate-bounce rounded-full" />
        </div>
      </div>

      <div
        className="
          pointer-events-none absolute bottom-0 right-0
          hidden h-[35%] w-px bg-gradient-to-t
          from-[#ff633e]/50 to-transparent md:block
        "
      />
    </main>
  );
}
