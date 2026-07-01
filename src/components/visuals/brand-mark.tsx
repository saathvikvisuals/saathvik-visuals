"use client";

import { motion } from "framer-motion";
import { modes } from "@/data/portfolio";
import { useExperienceStore } from "@/store/experience-store";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  const mode = useExperienceStore((state) => state.mode);
  const active = modes[mode];

  return (
    <motion.svg
      aria-label="Saathvik Visuals"
      viewBox="0 0 96 96"
      className={className ?? (compact ? "h-10 w-10" : "h-14 w-14")}
      initial={{ rotate: -8, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <defs>
        <linearGradient id={`mark-${mode}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={active.paper} />
          <stop offset="100%" stopColor={active.accent} stopOpacity="0.24" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="28" fill={`url(#mark-${mode})`} />
      <path d="M22 61c8 9 25 10 33 2 7-8 1-17-13-20-13-3-16-8-9-14 7-6 21-3 30 6" fill="none" stroke={active.ink} strokeWidth="7" strokeLinecap="round" />
      <path d="M68 28v41" stroke={active.accent} strokeWidth="7" strokeLinecap="round" />
      <circle cx="73" cy="24" r="4" fill={active.accent} />
    </motion.svg>
  );
}
