"use client";

import { motion } from "framer-motion";
import { ProcessArt } from "../visuals/process-art";
import { StageVideo } from "./stage-video";
import type { StageProps } from "./types";

/** Numbered step-path progression — for booking/shopping/sequential-decision projects. */
export function JourneyStage({ stage, index, project, accent, seekRatio }: StageProps) {
  return (
    <motion.article
      className="case-step relative grid gap-5 rounded-[2rem] border hairline bg-[var(--card)] p-5 pl-9 shadow-[0_24px_90px_var(--shadow-color)] backdrop-blur-2xl md:grid-cols-[auto_1fr_0.8fr] md:items-center md:p-7 md:pl-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute bottom-0 left-4 top-0 w-px md:left-5" style={{ background: `${accent}33` }} />
      <div className="relative z-10 md:w-16">
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-sm" style={{ background: accent }}>
          {index + 1}
        </span>
      </div>
      <div>
        <h2 className="mode-font m-0 text-2xl font-black md:text-3xl">{stage.title}</h2>
        <p className="m-0 mt-3 text-base leading-7 text-[var(--muted)]">{stage.copy}</p>
      </div>
      <motion.div className="relative min-h-48 overflow-hidden rounded-[1.5rem] bg-[var(--void)] md:min-h-56" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        {stage.useVideo ? (
          <StageVideo slug={project.slug} seekRatio={seekRatio} videoFile={stage.videoFile} />
        ) : (
          <ProcessArt accent={accent} variant={index} project={project.slug} palette={project.palette} />
        )}
      </motion.div>
    </motion.article>
  );
}
