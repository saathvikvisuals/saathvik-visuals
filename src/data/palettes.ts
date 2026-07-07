import type { ModeKey } from "./portfolio";

export type PaletteKey = "sapphire" | "amber" | "violet" | "rose" | "chrome" | "emerald" | "cyan" | "magenta";

export type Palette = {
  key: PaletteKey;
  label: string;
  mode: ModeKey;
  accent: string;
  accent2: string;
  glow: string;
};

// Two palettes per existing quiz mode, so choosing a palette also keeps the
// mode-driven copy (see lib/curation.ts) consistent with the visual pick.
export const palettes: Record<PaletteKey, Palette> = {
  sapphire: { key: "sapphire", label: "Sapphire Pulse", mode: "founder", accent: "#3b82f6", accent2: "#60a5fa", glow: "rgba(59, 130, 246, 0.35)" },
  amber: { key: "amber", label: "Amber Spotlight", mode: "founder", accent: "#f59e0b", accent2: "#fbbf24", glow: "rgba(245, 158, 11, 0.32)" },
  violet: { key: "violet", label: "Violet Noir", mode: "creative", accent: "#8b5cf6", accent2: "#a78bfa", glow: "rgba(139, 92, 246, 0.38)" },
  rose: { key: "rose", label: "Rose Quartz", mode: "creative", accent: "#ec4899", accent2: "#f472b6", glow: "rgba(236, 72, 153, 0.34)" },
  chrome: { key: "chrome", label: "Arctic Chrome", mode: "minimal", accent: "#94a3b8", accent2: "#e2e8f0", glow: "rgba(148, 163, 184, 0.28)" },
  emerald: { key: "emerald", label: "Emerald Frame", mode: "minimal", accent: "#10b981", accent2: "#34d399", glow: "rgba(16, 185, 129, 0.32)" },
  cyan: { key: "cyan", label: "Cyan Signal", mode: "future", accent: "#06b6d4", accent2: "#22d3ee", glow: "rgba(6, 182, 212, 0.35)" },
  magenta: { key: "magenta", label: "Nebula Magenta", mode: "future", accent: "#d946ef", accent2: "#e879f9", glow: "rgba(217, 70, 239, 0.36)" }
};

export const paletteKeys = Object.keys(palettes) as PaletteKey[];
