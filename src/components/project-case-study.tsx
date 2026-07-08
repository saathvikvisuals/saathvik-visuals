"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { useEffect } from "react";
import { translations, type projects, type Story, type StoryStage } from "@/data/portfolio";
import { ExperienceProvider } from "./experience-provider";
import { CinematicBackground } from "./cinematic-background";
import { ProjectMedia } from "./project-media";
import { getStageLayout } from "./case-study-layouts";
import { palettes } from "@/data/palettes";
import { useExperienceStore } from "@/store/experience-store";

type Project = (typeof projects)[number];

// Safety net for projects without a bespoke `story` (e.g. future auto-imported
// entries from project-intake.json) so the page never breaks mid-migration.
function fallbackStory(project: Project): Story {
  return {
    layout: "dashboard",
    hook: "Every detail should feel intentional before it feels beautiful.",
    stages: [
      { label: "01", title: "Problem", copy: project.problem },
      { label: "02", title: "Research", copy: "Mapped audience needs, decision moments, brand cues, and the points where trust is either built or lost." },
      { label: "03", title: "Structure", copy: "Reduced the idea into a clear journey: first impression, orientation, exploration, proof, and action." },
      { label: "04", title: "Interface", copy: project.solution, useVideo: true },
      { label: "05", title: "Prototype", copy: "Motion, hover states, responsive behavior, and scroll rhythm were treated as part of the product language.", useVideo: true },
      { label: "06", title: "Outcome", copy: project.outcome },
    ],
  };
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <ExperienceProvider>
      <CinematicBackground />
      <ProjectCaseStudyInner project={project} />
    </ExperienceProvider>
  );
}

function ProjectCaseStudyInner({ project }: { project: Project }) {
  const palette = useExperienceStore((state) => state.palette);
  const language = useExperienceStore((state) => state.language);
  const activePalette = palettes[palette];
  const t = translations[language];
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 80]);

  const story = project.story ?? fallbackStory(project);
  const Stage = getStageLayout(story.layout);

  // Spread repeat video stages across different moments of the one recorded
  // clip per project (0, 0.5, ...) so adjacent video stages don't look identical.
  const videoStageCount = story.stages.filter((s) => s.useVideo).length;
  let videoStagesSeen = 0;
  const seekRatios = story.stages.map((stage) => {
    if (!stage.useVideo) return 0;
    const ratio = videoStageCount > 1 ? (videoStagesSeen / (videoStageCount - 1)) * 0.5 : 0;
    videoStagesSeen += 1;
    return ratio;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [project.slug]);

  return (
    <main className="case-study relative z-10 min-h-screen">
        <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border hairline bg-[var(--card)] px-3 py-2 shadow-sm backdrop-blur-2xl">
            <Link className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-black text-[var(--ink)] no-underline" href="/" scroll>
              <ArrowLeft size={17} /> <Image className="rounded-[0.75rem]" src="/brand-favicon.png" alt="Saathvik Visuals" width={34} height={34} />
            </Link>
            <div className="flex gap-2">
              <a className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-xs font-black text-white no-underline" href={project.url} target="_blank">
                {t.liveWork} <ArrowUpRight size={15} />
              </a>
              <a className="inline-flex h-10 items-center gap-2 rounded-full border hairline bg-[var(--card)] px-4 text-xs font-black text-[var(--ink)] no-underline" href={project.github} target="_blank">
                {t.source} <GitBranch size={15} />
              </a>
            </div>
          </div>
        </nav>

        <section className="relative mx-auto grid min-h-screen max-w-7xl content-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="m-0 text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{project.type}</p>
            <h1 className="hero-title mode-font mt-4 text-6xl font-black leading-none sm:text-8xl">{project.name}</h1>
            <p className="mt-6 max-w-lg text-2xl font-black leading-9 text-[var(--ink)]">{project.tag}</p>
            <p className="signature-note mt-8 max-w-md text-4xl leading-none text-[var(--accent)]">{story.hook}</p>
            <div className="mt-8 flex gap-2">
              {project.palette.map((color) => (
                <span key={color} className="h-10 w-10 rounded-full border border-black/10 shadow-sm" style={{ background: color }} />
              ))}
            </div>
          </motion.div>

          <motion.div className="relative min-h-[56vh] overflow-hidden rounded-[2.4rem] border hairline bg-slate-950 shadow-2xl" style={{ scale: heroScale, y: heroY }}>
            <ProjectMedia slug={project.slug} image={project.image} alt={`${project.name} screenshot`} sizes="(min-width: 1024px) 62vw, 94vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-transparent to-[color-mix(in_srgb,var(--accent)_18%,transparent)]" />
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="case-timeline grid gap-6">
            {story.stages.map((stage: StoryStage, index: number) => (
              <Stage
                key={stage.label}
                stage={stage}
                index={index}
                project={project}
                accent={activePalette.accent}
                seekRatio={seekRatios[index]}
              />
            ))}
          </div>
        </section>
    </main>
  );
}
