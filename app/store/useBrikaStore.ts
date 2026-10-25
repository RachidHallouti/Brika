
import { create } from "zustand";

interface BrikaStore {
  color: string;

  setColor: (color: string) => void;
 
  
}

export const useBrikaStore = create<BrikaStore>((set) => ({
  color: "#2563eb",
  fuelLevel: 1,
  setColor: (color) => set({ color }),
}));
