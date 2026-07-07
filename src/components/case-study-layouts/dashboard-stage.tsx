"use client";

import { motion } from "framer-motion";
import { ProcessArt } from "../visuals/process-art";
import { StageVideo } from "./stage-video";
import type { StageProps } from "./types";

/** Technical/systems framing — today's original 3-column case-step grid, extracted. */
export function DashboardStage({ stage, index, project, accent, seekRatio }: StageProps) {
  return (
    <motion.article
      className="case-step grid gap-5 rounded-[2rem] border hairline bg-[var(--card)] p-4 shadow-[0_24px_90px_var(--shadow-color)] backdrop-blur-2xl md:grid-cols-[180px_1fr_0.75fr] md:p-6"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <span className="mode-font text-6xl font-black text-[var(--accent)]/25">{stage.label}</span>
        <h2 className="mode-font m-0 mt-2 text-3xl font-black">{stage.title}</h2>
      </div>
      <motion.div className="relative min-h-64 overflow-hidden rounded-[1.5rem] bg-[var(--void)]" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        {stage.useVideo ? (
          <StageVideo slug={project.slug} seekRatio={seekRatio} />
        ) : (
          <ProcessArt accent={accent} variant={index} project={project.slug} palette={project.palette} />
        )}
      </motion.div>
      <p className="m-0 self-center text-lg leading-8 text-[var(--muted)]">{stage.copy}</p>
    </motion.article>
  );
}
