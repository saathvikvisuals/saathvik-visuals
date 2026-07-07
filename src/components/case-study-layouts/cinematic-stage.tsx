"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProcessArt } from "../visuals/process-art";
import { StageVideo } from "./stage-video";
import type { StageProps } from "./types";

/** Full-bleed alternating panels with overlaid labels — for cinematic/atmosphere-led projects. */
export function CinematicStage({ stage, index, project, accent, seekRatio }: StageProps) {
  const reverse = index % 2 === 1;
  return (
    <motion.article
      className={cn(
        "case-step grid overflow-hidden rounded-[2.4rem] border hairline shadow-[0_30px_100px_rgba(15,23,42,0.12)] md:grid-cols-2",
      )}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.05, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className={cn("relative min-h-[40vh] overflow-hidden bg-[var(--void)] md:min-h-[50vh]", reverse && "md:order-2")} whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        {stage.useVideo ? (
          <StageVideo slug={project.slug} seekRatio={seekRatio} />
        ) : (
          <ProcessArt accent={accent} variant={index} project={project.slug} palette={project.palette} />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-6 font-mono text-xs font-black uppercase tracking-[0.3em] text-white/75">{stage.label}</span>
      </motion.div>
      <div className={cn("flex flex-col justify-center gap-4 bg-[var(--card)] p-8 backdrop-blur-2xl md:p-12", reverse && "md:order-1")}>
        <h2 className="mode-font m-0 text-4xl font-black leading-[0.96] md:text-5xl">{stage.title}</h2>
        <p className="m-0 text-lg leading-8 text-[var(--muted)]">{stage.copy}</p>
      </div>
    </motion.article>
  );
}
