"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguageKey, ModeKey } from "@/data/portfolio";
import { palettes, type PaletteKey } from "@/data/palettes";
import type { DepthKey } from "@/lib/curation";

export type InterestKey = "founders" | "visual" | "commerce" | "culture" | "all";
export type ThemeKey = "dark" | "light";

type ExperienceStore = {
  mode: ModeKey;
  palette: PaletteKey;
  theme: ThemeKey;
  language: LanguageKey;
  interest: InterestKey;
  depth: DepthKey;
  curationSignature: string;
  curated: boolean;
  audio: boolean;
  setMode: (mode: ModeKey) => void;
  setPalette: (palette: PaletteKey) => void;
  setTheme: (theme: ThemeKey) => void;
  toggleTheme: () => void;
  setLanguage: (language: LanguageKey) => void;
  setInterest: (interest: InterestKey) => void;
  setDepth: (depth: DepthKey) => void;
  setCurationSignature: (signature: string) => void;
  setCurated: (curated: boolean) => void;
  toggleAudio: () => void;
};

export const useExperienceStore = create<ExperienceStore>()(
  persist(
    (set) => ({
      mode: "creative",
      palette: "violet",
      theme: "dark",
      language: "en",
      interest: "all",
      depth: "quick",
      curationSignature: "open",
      curated: false,
      audio: false,
      setMode: (mode) => set({ mode }),
      // Picking a palette also syncs the quiz-driven mode so copy stays consistent with the color choice.
      setPalette: (palette) => set({ palette, mode: palettes[palette].mode }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setLanguage: (language) => set({ language }),
      setInterest: (interest) => set({ interest }),
      setDepth: (depth) => set({ depth }),
      setCurationSignature: (curationSignature) => set({ curationSignature }),
      setCurated: (curated) => set({ curated }),
      toggleAudio: () => set((state) => ({ audio: !state.audio }))
    }),
    {
      name: "sv-experience",
      partialize: (state) => ({
        mode: state.mode,
        palette: state.palette,
        theme: state.theme,
        language: state.language,
        audio: state.audio
      })
    }
  )
);
