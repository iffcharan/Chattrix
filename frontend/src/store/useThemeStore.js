import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chattrix-theme") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("chattrix-theme", theme);
    set({ theme });
  },
}));