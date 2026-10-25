
"use client";

import { memo, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experiance from "./components/Experiance";
import { useBrikaStore } from "./store/useBrikaStore";
import { useMediaQuery } from "react-responsive";
import {motion} from "motion/react";
import { ArrowUp, Settings2 } from "lucide-react";

const COLORS = [
    { name: "Cobalt", value: "#2563eb" },
  { name: "Graphite", value: "#5e5c64" },
  { name: "Vermilion", value: "#E6533D" },
   { name: "Emerald", value: "#26a269" },
   { name: "Silver", value: "#c0bfbc" },
];

const ACCENTCOLORS = [
  { name: "Steel", value: "#AEBAC3" },
  { name: "Jet Black", value: "#121619" },
  { name: "Copper", value: "#B76E4B" },
  { name: "Champagne", value: "#D4B483" },
  { name: "Ivory", value: "#F4EBDD" },
];

const BrikaScene = memo(function BrikaScene() {
  const isMobile = useMediaQuery({maxWidth: 1024});

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, isMobile?13.5:12],
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
  const accentColor = useBrikaStore((s) => s.accentColor);
  const setAccentColor = useBrikaStore((s) => s.setAccentColor);
const mobile = useMediaQuery({ maxWidth: 1024 });
const [mounted, setMounted] = useState(false);
const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

const isMobile = mounted && mobile;

  const [hexP, setHexP] = useState(color.slice(1));
  const [hexA, setHexA] = useState(accentColor.slice(1));

useEffect(() => {
  setHexP(color.slice(1));
}, [color]);

useEffect(() => {
  setHexA(color.slice(1));
}, [accentColor]);

const handleHexChange = (value: string,hexSetter: Function,ColorSetter: Function) => {
  const cleaned = value
    .replace(/[^0-9a-f]/gi, "")
    .slice(0, 6);

  hexSetter(cleaned);

  if (cleaned.length === 6) {
    ColorSetter(`#${cleaned}`);
  }
};


  return (
    <motion.aside
    animate={{
    y: isMobile && !isOpen ? "calc(100% - 82px)" : "0%",
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 32,
  }}
      className="
        pointer-events-auto
        bottom-0
        fixed
        lg:static 
         left-4 right-4 z-20
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
          {isMobile ? ( <button onClick={() => setIsOpen(!isOpen)}>
{!isOpen ? (
            <ArrowUp className="h-4 w-4 text-black/50" />):(<ArrowUp className="h-4 w-4 text-black/50 rotate-180" />)
           }
          </button> ): (
            <Settings2 className="h-4 w-4 text-black/50" />
          )}
        </div>
      </div>

      <div className="h-px bg-black/10" />

      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700">
            Color
          </label>
          <div className="flex items-center  text-[11px] uppercase tracking-wider text-neutral-500">
  <span>#</span>

  <input
    value={hexP}
    maxLength={6}
    className="w-14 bg-transparent text-right uppercase outline-none"
    onChange={(e) => {
      handleHexChange(e.target.value,setHexP,setColor)}
    }
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
      <div className="h-px mt-6 bg-black/10" />

      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700">
            Accent Color
          </label>
          <div className="flex items-center  text-[11px] uppercase tracking-wider text-neutral-500">
  <span>#</span>

  <input
    value={hexA}
    maxLength={6}
    className="w-14 bg-transparent text-right uppercase outline-none"
    onChange={(e) => {
      handleHexChange(e.target.value,setHexA,setAccentColor)}
    }
  />
</div>
           
        </div>

        <div className="flex items-center gap-3">
          {ACCENTCOLORS.map((swatch) => {
            const active =
              accentColor.toLowerCase() ===
              swatch.value.toLowerCase();

            return (
              <button
                key={swatch.value}
                type="button"
                title={swatch.name}
                aria-label={swatch.name}
                aria-pressed={active}
                onClick={() => setAccentColor(swatch.value)}
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
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
    </motion.aside>
  );
}

export default function Home() {
  const color = useBrikaStore((s) => s.color);
  return (
    <main className="relative font-space   isolate h-[100svh] overflow-hidden bg-[#e9ecef]  text-[#202327] select-none">
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
          

          <motion.a whileHover={{ color }} className="text-base pointer-events-auto font-semibold uppercase tracking-[0.16em] text-neutral-600" href="https://rochdi.dev" target="_blank" rel="noopener noreferrer">
            By Rochdi.dev
          </motion.a>
        </div>
      </header>

      <section
        className="
           p-10 absolute w-full flex justify-between top-18 z-10
          lg:top-[23%]
          pointer-events-none
        "
      >
        <div className="max-w-[350px]
          md:left-12 
          hidden lg:block
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
          <motion.a whileHover={{ opacity: 0.7 }}  className="block pointer-events-auto" style={{ color }} href="https://rochdi.dev" target="_blank" rel="noopener noreferrer">
            Rachid Hallouti
          </motion.a>
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
