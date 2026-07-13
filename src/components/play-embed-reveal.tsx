"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

type PlayEmbedRevealProps = {
  embedUrl: string;
  name: string;
  accent: string;
  playUrl: string;
};

/**
 * A big-reveal "insert coin" moment for playable projects: scrolling this
 * section into view spins up an anime-portal illustration, then the portal
 * iris-wipes open to unveil the live itch.io embed underneath — no click
 * required, matching the scroll-driven reveal language used elsewhere on
 * the case study page.
 */
export function PlayEmbedReveal({ embedUrl, name, accent, playUrl }: PlayEmbedRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15% 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const delay = reduceMotion ? 0 : 1200;
    const timer = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(timer);
  }, [inView, reduceMotion]);

  return (
    <div ref={containerRef} className="relative mx-auto my-24 max-w-3xl px-5 sm:px-8">
      <motion.div
        className="relative min-h-[440px] overflow-hidden rounded-[2.4rem] border hairline bg-[var(--card)] shadow-2xl"
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Portal layer — the anime-style reveal moment, fades out once opened */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 py-16 text-center"
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: revealed ? "none" : "auto" }}
        >
          <PortalIllustration accent={accent} active={inView && !reduceMotion} />
          <div className="relative z-10">
            <p className="m-0 text-xs font-black uppercase tracking-[0.4em]" style={{ color: accent }}>
              Playable build
            </p>
            <h3 className="mode-font mt-3 text-3xl font-black text-[var(--ink)] sm:text-4xl">Step into {name}</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm font-medium text-[var(--ink)]/60">
              Opening a live, playable build right here — no download, no waiting.
            </p>
          </div>
        </motion.div>

        {/* Iframe layer — iris-wipes open from the center once the portal has spun up */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: revealed ? "circle(75% at 50% 50%)" : "circle(0% at 50% 50%)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between gap-3 bg-[var(--card)] px-5 py-3">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--ink)]/50">Live build</span>
            <a href={playUrl} target="_blank" className="text-xs font-black no-underline" style={{ color: accent }}>
              Open full page ↗
            </a>
          </div>
          <iframe
            src={embedUrl}
            title={`${name} — playable embed`}
            className="block w-full flex-1 border-0 bg-black"
            allow="autoplay; fullscreen"
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function PortalIllustration({ accent, active }: { accent: string; active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden
        animate={active ? { rotate: 360 } : undefined}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute h-[140%] w-[140%] opacity-[0.14]"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${accent}, transparent 30%, transparent 60%, ${accent}, transparent)`,
        }}
      />
      <motion.div
        className="relative h-64 w-64"
        animate={active ? { scale: [0.96, 1.05, 0.96], opacity: [0.85, 1, 0.85] } : { opacity: 0.9 }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image className="object-contain" src="/illus-3.png" alt="" fill aria-hidden />
      </motion.div>
    </div>
  );
}
