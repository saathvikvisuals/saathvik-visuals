"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProcessArt } from "../visuals/process-art";
import { StageVideo } from "./stage-video";
import type { StageProps } from "./types";

/** Magazine-style alternating text/image blocks with a pull-quote title — for editorial/cultural projects. */
export function EditorialStage({ stage, index, project, accent, seekRatio }: StageProps) {
  const reverse = index % 2 === 1;
  return (
    <motion.article
      className="case-step grid items-center gap-8 rounded-[2rem] border hairline bg-[var(--card)] p-6 shadow-[0_24px_90px_var(--shadow-color)] backdrop-blur-2xl md:grid-cols-2 md:p-10"
      initial={{ opacity: 0, x: reverse ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className={cn("relative min-h-56 overflow-hidden rounded-[1.5rem] bg-[var(--void)] md:min-h-72", reverse && "md:order-2")} whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        {stage.useVideo ? (
          <StageVideo slug={project.slug} seekRatio={seekRatio} videoFile={stage.videoFile} />
        ) : (
          <ProcessArt accent={accent} variant={index} project={project.slug} palette={project.palette} />
        )}
      </motion.div>
      <div className={cn(reverse && "md:order-1")}>
        <span className="font-mono text-xs font-black uppercase tracking-[0.3em]" style={{ color: accent }}>{stage.label}</span>
        <h2 className="mode-font m-0 mt-3 text-4xl leading-tight font-black" style={{ color: accent }}>{stage.title}</h2>
        <p className="m-0 mt-4 text-lg leading-8 text-[var(--muted)]">{stage.copy}</p>
      </div>
    </motion.article>
  );
}
