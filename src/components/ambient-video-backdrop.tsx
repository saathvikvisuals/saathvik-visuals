"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";

/**
 * Heavily blurred, dimmed loop of real project footage used as atmosphere behind
 * a glass panel — not a literal video player, just texture. Falls back to a plain
 * static gradient (no <video>) under prefers-reduced-motion.
 */
export function AmbientVideoBackdrop({ slugs, tone = "light" }: { slugs: string[]; tone?: "light" | "dark" }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div className="absolute inset-0 flex">
        {slugs.map((slug, index) => (
          <AmbientClip key={slug} slug={slug} index={index} play={!reduceMotion} />
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            tone === "dark"
              ? "linear-gradient(180deg, rgba(2,6,23,0.78), rgba(2,6,23,0.92))"
              : "linear-gradient(180deg, color-mix(in srgb, var(--paper, #fbfaf8) 80%, transparent), color-mix(in srgb, var(--paper, #fbfaf8) 95%, transparent))",
        }}
      />
    </div>
  );
}

function AmbientClip({ slug, index, play }: { slug: string; index: number; play: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <video
      className="h-full flex-1 scale-110 object-cover opacity-60"
      style={{ filter: "blur(38px) saturate(1.3)", transitionDelay: `${index * 80}ms` }}
      src={`/project-videos/${slug}.webm`}
      autoPlay={play}
      muted
      loop
      playsInline
      preload="none"
      onError={() => setFailed(true)}
    />
  );
}
