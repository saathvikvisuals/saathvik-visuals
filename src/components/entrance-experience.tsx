"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { modes, type ModeKey } from "@/data/portfolio";
import { type InterestKey, useExperienceStore } from "@/store/experience-store";
import { cn } from "@/lib/utils";
import { curationQuestions, deriveCurationResult, type AnswerKey, type CurationChoice, type CurationResult, type DepthKey } from "@/lib/curation";

type Phase = "welcome" | "concept" | "questions" | "compose" | "entering";

const WELCOME_MS = 1200;
const COMPOSE_MS = 700;
const ENTER_MS = 1200;

export function EntranceExperience() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, CurationChoice>>>({});
  const setMode = useExperienceStore((state) => state.setMode);
  const setInterest = useExperienceStore((state) => state.setInterest);
  const setDepth = useExperienceStore((state) => state.setDepth);
  const setCurationSignature = useExperienceStore((state) => state.setCurationSignature);
  const setCurated = useExperienceStore((state) => state.setCurated);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(max-width: 640px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    const forceIntro = new URLSearchParams(window.location.search).has("intro");
    // Session-scoped on purpose: the curation quiz should ask again on every
    // new visit (new tab/window, or after the browser closes), not just once
    // ever — it only stays quiet across in-session route changes/refreshes.
    const saved = sessionStorage.getItem("sv-curation");

    if (forceIntro) {
      sessionStorage.removeItem("sv-entrance-seen");
      setCurated(false);
      setPhase("welcome");
      setOpen(true);
    } else if (saved) {
      try {
        const parsed = JSON.parse(saved) as { mode?: ModeKey; interest?: InterestKey; depth?: DepthKey; signature?: string };
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.interest) setInterest(parsed.interest);
        if (parsed.depth) setDepth(parsed.depth);
        if (parsed.signature) setCurationSignature(parsed.signature);
        setCurated(true);
      } catch {
        sessionStorage.removeItem("sv-curation");
        setOpen(true);
      }
    } else {
      setCurated(false);
      setOpen(true);
    }

    const timer = window.setTimeout(() => setPhase("concept"), WELCOME_MS);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", updateMobile);
    };
  }, [setCurated, setCurationSignature, setDepth, setInterest, setMode]);

  const result = useMemo(() => deriveCurationResult(answers), [answers]);
  const activeQuestion = curationQuestions[step];
  const progress =
    phase === "questions" ? ((step + 1) / curationQuestions.length) * 100 : phase === "entering" ? 100 : phase === "concept" ? 30 : 18;

  function selectChoice(choice: CurationChoice) {
    const nextAnswers = { ...answers, [activeQuestion.key]: choice };
    setAnswers(nextAnswers);

    if (step < curationQuestions.length - 1) {
      window.setTimeout(() => setStep((value) => value + 1), 180);
      return;
    }

    const nextResult = deriveCurationResult(nextAnswers);
    setMode(nextResult.mode);
    setInterest(nextResult.interest);
    setDepth(nextResult.depth);
    setCurationSignature(nextResult.signature);
    sessionStorage.setItem("sv-curation", JSON.stringify(nextResult));
    sessionStorage.setItem("sv-entrance-seen", "true");
    setPhase("compose");
    window.setTimeout(() => openPortfolioWithLoader(), COMPOSE_MS);
  }

  function openPortfolioWithLoader() {
    if (phase === "entering") return;
    setCurated(true);
    setPhase("entering");
    window.setTimeout(() => {
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }, ENTER_MS);
  }

  function skipToDefault() {
    setMode("minimal");
    setInterest("all");
    setDepth("quick");
    setCurationSignature("open");
    sessionStorage.setItem("sv-entrance-seen", "true");
    openPortfolioWithLoader();
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn("entrance-overlay fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[color-mix(in_srgb,var(--void)_94%,transparent)] p-4 backdrop-blur-2xl sm:p-5", isMobile && "mobile-entrance-overlay")}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className={cn(
              "entrance-card relative my-auto w-full max-w-5xl overflow-x-hidden overflow-y-auto rounded-[2.5rem] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_40px_140px_var(--shadow-color)] backdrop-blur-2xl sm:p-10 sm:max-h-[92svh]",
              isMobile && "mobile-entrance-card"
            )}
            initial={{ y: 28, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 22, stiffness: 140 }}
          >
            <div aria-hidden className="entrance-card-ring" />
            <div className="mb-7 flex items-center gap-4">
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]">
                <motion.span
                  className="relative block h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, white))", boxShadow: "0 0 14px var(--glow)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              {(phase === "welcome" || phase === "concept" || phase === "questions") && (
                <button
                  className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition hover:text-[var(--ink)]"
                  onClick={skipToDefault}
                >
                  Skip
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {phase === "welcome" && <WelcomeScreen />}
              {phase === "concept" && <ConceptScreen onContinue={() => setPhase("questions")} />}
              {phase === "questions" && activeQuestion && (
                <QuestionScreen
                  key={activeQuestion.key}
                  question={activeQuestion}
                  answer={answers[activeQuestion.key]?.id}
                  onSelect={selectChoice}
                />
              )}
              {phase === "compose" && <ComposeScreen result={result} />}
              {phase === "entering" && <EnteringScreen result={result} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WelcomeScreen() {
  return (
    <motion.div key="welcome" className="grid min-h-[460px] place-items-center text-center" exit={{ opacity: 0, scale: 0.96 }}>
      <div>
        <motion.div className="relative mx-auto grid h-56 w-56 place-items-center" animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1.2 }}>
            <Image className="object-contain" src="/illus-2.png" alt="" fill priority aria-hidden />
          </motion.div>
          <Image className="relative z-10 rounded-[1.55rem] shadow-2xl" src="/brand-favicon.png" alt="Saathvik Visuals" width={88} height={88} priority />
          <motion.span className="absolute inset-8 rounded-[2rem] border border-[var(--accent)]/10" animate={{ rotate: [0, 5, 0], scale: [0.88, 1.22, 0.88], opacity: [0.18, 0.5, 0.18] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
        <motion.p className="mt-9 text-xs font-black uppercase tracking-[0.34em] text-[var(--muted)]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 1 }}>
          Welcome to Saathvik Visuals
        </motion.p>
        <motion.h1 className="mx-auto mt-4 max-w-xl font-[var(--font-libre)] text-5xl font-normal leading-[0.96] text-[var(--ink)] sm:text-7xl" initial={{ opacity: 0, y: 24, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          Let the room build itself.
        </motion.h1>
        <motion.div className="mx-auto mt-10 h-1 w-48 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
          <motion.span className="block h-full rounded-full bg-[var(--accent)]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 1.6, duration: 3.1, ease: "easeInOut" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Explains the "room" concept before the quiz starts — user feedback was that
 * visitors reached the curated result without understanding what a "room" is
 * or why answering questions reshapes the site. Manual "Continue" (not a
 * timer) so it's actually read, not skipped through like the welcome beat.
 */
function ConceptScreen({ onContinue }: { onContinue: () => void }) {
  const roomKeys = Object.keys(modes) as ModeKey[];

  return (
    <motion.div key="concept" className="grid min-h-[460px] place-items-center text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
      <div className="mx-auto max-w-lg">
        <motion.div
          className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.97, 1.02, 0.97] }}
          transition={{ opacity: { duration: 0.6 }, scale: { duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Image className="object-contain" src="/illus-1.png" alt="Four glowing doorways converging into one" fill priority />
        </motion.div>
        <motion.p className="mt-9 text-xs font-black uppercase tracking-[0.34em] text-[var(--accent)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Before you answer anything
        </motion.p>
        <motion.h2 className="mode-font mt-4 text-3xl font-black leading-tight text-[var(--ink)] sm:text-4xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Every visitor gets a different room.
        </motion.h2>
        <motion.p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--muted)]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          This isn&rsquo;t one fixed site — it&rsquo;s rebuilt around you. Three quick questions decide which &ldquo;room&rdquo; you land in: the project order, the visual tone, and which case studies come first all change based on your answers.
        </motion.p>
        <motion.div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          {roomKeys.map((key) => (
            <span key={key} className="rounded-full border border-[var(--line)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: modes[key].accent }}>
              {modes[key].label} room
            </span>
          ))}
        </motion.div>
        <motion.button
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-black text-white shadow-[0_10px_40px_-8px_var(--glow)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, type: "spring", damping: 18, stiffness: 200 }}
          whileHover={{ scale: 1.05, boxShadow: "0 14px 50px -6px var(--glow)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
        >
          Show me my room <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function QuestionScreen({ question, answer, onSelect }: { question: (typeof curationQuestions)[number]; answer?: string; onSelect: (choice: CurationChoice) => void }) {
  return (
    <motion.div key={question.key} className="min-h-[460px]" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
      <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
        <div>
          <Image className="rounded-[1.1rem]" src="/brand-favicon.png" alt="Saathvik Visuals" width={58} height={58} priority />
          <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{question.eyebrow}</p>
          <h2 className="mode-font mt-3 max-w-2xl text-4xl font-black leading-none text-[var(--ink)] sm:text-6xl">{question.title}</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted)]">Each answer changes the room, project order, visual mode, and first impression.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {question.choices.map((choice, i) => (
            <motion.button
              key={choice.id}
              className={cn(
                "group min-h-36 rounded-[1.45rem] border p-4 text-left backdrop-blur-xl transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)]",
                answer === choice.id ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
              )}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", damping: 20, stiffness: 180 }}
              whileHover={{ y: -4, boxShadow: `0 20px 50px -12px ${choice.mode ? modes[choice.mode].accent : "var(--accent)"}66` }}
              whileTap={{ scale: 0.97, y: 0 }}
              onClick={() => onSelect(choice)}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)]">
                  {answer === choice.id ? <Check size={17} className="text-[var(--ink)]" /> : <span className="h-4 w-4 rounded-full" style={{ background: choice.mode ? modes[choice.mode].accent : "var(--accent)" }} />}
                </span>
                <ArrowRight className="opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" size={18} />
              </span>
              <strong className="mt-5 block text-xl">{choice.label}</strong>
              <span className={cn("mt-2 block text-sm leading-6", answer === choice.id ? "text-white/66" : "text-[var(--muted)]")}>{choice.line}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ComposeScreen({ result }: { result: CurationResult }) {
  return (
    <motion.div key="compose" className="grid min-h-[460px] place-items-center text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div>
        <div className="relative mx-auto h-28 w-28">
          <Image className="rounded-[1.4rem] shadow-2xl" src="/brand-favicon.png" alt="Saathvik Visuals" fill sizes="112px" priority />
          <motion.span className="absolute -inset-5 rounded-[2rem] border border-[var(--accent)]/10" animate={{ scale: [0.86, 1.12, 0.86], opacity: [0.2, 0.65, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">Designing in a few seconds</p>
        <h2 className="mode-font mx-auto mt-3 max-w-lg text-4xl font-black leading-none text-[var(--ink)]">Building {result.room}.</h2>
        <div className="mx-auto mt-7 grid max-w-sm gap-2 text-left text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
          {["Selecting projects", "Changing visual system", "Preparing the casebook"].map((item, index) => (
            <motion.div key={item} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.18 }}>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EnteringScreen({ result }: { result: CurationResult }) {
  return (
    <motion.div
      key="entering"
      className="grid min-h-[460px] place-items-center text-center"
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <div>
        <div className="relative mx-auto grid h-24 w-24 place-items-center">
          <Image className="rounded-[1.25rem] shadow-2xl" src="/brand-favicon.png" alt="Saathvik Visuals" width={78} height={78} priority />
          <motion.span
            className="absolute -inset-4 rounded-[1.8rem] border border-[var(--accent)]/10"
            animate={{ rotate: 360, scale: [0.96, 1.08, 0.96] }}
            transition={{ rotate: { duration: 1.4, repeat: Infinity, ease: "linear" }, scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
          />
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">Opening your curated room</p>
        <h2 className="mode-font mx-auto mt-3 max-w-2xl text-5xl font-black leading-none text-[var(--ink)] sm:text-7xl">{result.room}</h2>
        <div className="mx-auto mt-9 h-1.5 w-64 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]">
          <motion.span className="block h-full rounded-full bg-[var(--accent)]" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
    </motion.div>
  );
}
