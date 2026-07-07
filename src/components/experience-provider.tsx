"use client";

import Lenis from "lenis";
import { Howl } from "howler";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { modes } from "@/data/portfolio";
import { palettes } from "@/data/palettes";
import { useExperienceStore } from "@/store/experience-store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const mode = useExperienceStore((state) => state.mode);
  const palette = useExperienceStore((state) => state.palette);
  const theme = useExperienceStore((state) => state.theme);
  const language = useExperienceStore((state) => state.language);
  const audio = useExperienceStore((state) => state.audio);
  const shellRef = useRef<HTMLDivElement>(null);

  const clickSound = useMemo(
    () =>
      new Howl({
        src: [
          "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAACAgICAgICAgJCQkJiYmKCgoA=="
        ],
        volume: 0.12
      }),
    []
  );

  // Lenis drives the real scroll; GSAP's ticker replaces Lenis's own rAF loop so
  // ScrollTrigger (scrubbed/pinned sections + the theatre canvas) stays frame-locked
  // with the smooth-scroll interpolation instead of drifting a frame behind it.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.88 });
    lenis.on("scroll", ScrollTrigger.update);
    function tick(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const active = modes[mode];
    const activePalette = palettes[palette];
    root.setAttribute("data-theme", theme);
    root.style.setProperty("--accent", activePalette.accent);
    root.style.setProperty("--accent-2", activePalette.accent2);
    root.style.setProperty("--glow", activePalette.glow);
    root.style.setProperty("--mode-font", active.font);
    ensureBrandFavicon();
    if (audio) clickSound.play();
  }, [audio, clickSound, mode, palette, theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    function move(event: PointerEvent) {
      shellRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      shellRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={shellRef} className="experience-shell grain" data-mode={mode} suppressHydrationWarning>
      {children}
    </div>
  );
}

function ensureBrandFavicon() {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = "/brand-favicon.png";
}
