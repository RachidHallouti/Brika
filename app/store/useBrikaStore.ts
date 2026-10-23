
import { create } from "zustand";

interface BrikaStore {
  color: string;
  fuelLevel: number;
  isIgniting: boolean;
  ignitionCount: number;

  setColor: (color: string) => void;
  setFuelLevel: (fuel: number) => void;
  setIsIgniting: (value: boolean) => void;
  triggerIgnition: () => void;
}

export const useBrikaStore = create<BrikaStore>((set) => ({
  color: "#2563eb",
  fuelLevel: 100,
  isIgniting: false,
  ignitionCount: 0,

  setColor: (color) => set({ color }),

  setFuelLevel: (fuelLevel) =>
    set({
      fuelLevel,
      ...(fuelLevel <= 0 ? { isIgniting: false } : {}),
    }),

  setIsIgniting: (isIgniting) =>
    set((state) => ({
      isIgniting: state.fuelLevel > 0 && isIgniting,
    })),

  triggerIgnition: () =>
    set((state) => {
      if (state.fuelLevel <= 0) return state;

      return {
        isIgniting: true,
        ignitionCount: state.ignitionCount + 1,
      };
    }),
}));
