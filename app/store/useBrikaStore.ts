
import { create } from "zustand";

interface BrikaStore {
  color: string;
  accentColor: string;

  setColor: (color: string) => void;
  setAccentColor: (accentColor: string) => void;
 
  
}

export const useBrikaStore = create<BrikaStore>((set) => ({
  color: "#2563eb",
  accentColor : "#121619",
  fuelLevel: 1,
  setColor: (color) => set({ color }),
  setAccentColor: (accentColor) => set({ accentColor }),

}));
