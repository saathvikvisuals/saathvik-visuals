"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { FormEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GitBranch,
  Languages,
  Mail,
  Moon,
  MousePointer2,
  Palette,
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";
import { languageOptions, modes, process, projects, socialLinks, testimonials, translations, type LanguageKey, type ModeKey } from "@/data/portfolio";
import { palettes, paletteKeys } from "@/data/palettes";
import { cn } from "@/lib/utils";
import { roomForInterest, type DepthKey } from "@/lib/curation";
import { type InterestKey, useExperienceStore } from "@/store/experience-store";
import { CinematicBackground } from "./cinematic-background";
import { ExperienceProvider } from "./experience-provider";
import { ProjectMedia } from "./project-media";
import { AmbientVideoBackdrop } from "./ambient-video-backdrop";
import Link from "next/link";
import { EntranceExperience } from "./entrance-experience";

export function PortfolioExperience() {
  const [mounted, setMounted] = useState(false);
  const curated = useExperienceStore((state) => state.curated);
  const depth = useExperienceStore((state) => state.depth);
  const curationSignature = useExperienceStore((state) => state.curationSignature);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ExperienceProvider>
      <CinematicBackground />
      <EntranceExperience />
      <main className={cn("relative z-10 transition duration-700", !curated && "pointer-events-none blur-[2px] opacity-35")} data-depth={depth} data-curation={curationSignature}>
        <TopNav />
        <Hero />
        <Philosophy />
        <ProjectShowcase />
        <ClientExperience />
        <Process />
        <Contact />
        <Footer />
        <CustomCursor />
      </main>
    </ExperienceProvider>
  );
}

type PageCopy = {
  philosophyKicker: string;
  philosophyTitle: string;
  chips: string[];
  archiveEyebrow: string;
  archiveTitle: string;
  archiveText: string;
  clientTitle: string;
  contactLabel: string;
  email: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  visionPlaceholder: string;
  footerSignature: string;
  footerText: string;
  socialProfessional: string;
  socialSource: string;
  socialBrief: string;
  processItems: typeof process;
};

const curationProfiles: Record<InterestKey, { kicker: string; headline: string; subhead: string; selected: string; projectLine: string; philosophy: string }> = {
  founders: {
    kicker: "Business proof",
    headline: "Proof Room",
    subhead: "A portfolio version focused on clarity, trust, conversion, and product decisions.",
    selected: "Founder Selection",
    projectLine: "Projects arranged around business confidence, launch value, and decision-ready interfaces.",
    philosophy: "This version gives founders the shortest path to proof: what problem was understood, what system was built, and why the interface can support a business outcome."
  },
  visual: {
    kicker: "Visual worlds",
    headline: "Motion Room",
    subhead: "A portfolio version focused on cinematic composition, mood, motion, and memorable UI systems.",
    selected: "Visual Selection",
    projectLine: "Projects arranged around atmosphere, interaction rhythm, and brand memory.",
    philosophy: "This version treats every project like a designed world: typography, motion, image direction, and interface hierarchy work together before the visitor reads a paragraph."
  },
  commerce: {
    kicker: "Buying flows",
    headline: "Flow Room",
    subhead: "A portfolio version focused on service clarity, shopping confidence, booking, and responsive UX.",
    selected: "Commerce Selection",
    projectLine: "Projects arranged around browsing, trust, product/service selection, and action.",
    philosophy: "This version is built for clients who need the interface to reduce hesitation: clear services, guided choices, proof, and frictionless action."
  },
  culture: {
    kicker: "Culture systems",
    headline: "Story Room",
    subhead: "A portfolio version focused on heritage, travel, music, identity, and editorial product storytelling.",
    selected: "Culture Selection",
    projectLine: "Projects arranged around emotion, context, cultural depth, and story-led navigation.",
    philosophy: "This version presents design as a cultural system: every visual decision supports memory, place, sound, identity, and audience belonging."
  },
  all: {
    kicker: "Open the room",
    headline: "Visual Casebook",
    subhead: "A quiet gallery of product stories, interface craft, and visual systems.",
    selected: "Selected Work",
    projectLine: "The room changes around what the viewer came to see.",
    philosophy: "Most products don't fail because of bad code. They fail because users do not understand them. Saathvik Visuals designs the bridge between business intent and user clarity."
  }
};

const depthProfiles: Record<DepthKey, { label: string; line: string; featured: number; archive: number; archiveText: string }> = {
  quick: {
    label: "Quick scan",
    line: "The strongest screens stay first, with a tighter path for fast evaluation.",
    featured: 3,
    archive: 3,
    archiveText: "A compact scan of additional worlds, kept short for quick decision-making."
  },
  case: {
    label: "Case-study path",
    line: "Each selected project opens toward problem, structure, interface decisions, and outcome.",
    featured: 4,
    archive: 4,
    archiveText: "Extra projects stay secondary so the process-led case studies remain the main route."
  },
  gallery: {
    label: "Visual gallery",
    line: "The room favors larger visual moments, motion, palette, and atmosphere.",
    featured: 5,
    archive: 5,
    archiveText: "More visual worlds are kept open so the gallery feels broader and more cinematic."
  },
  hire: {
    label: "Hire-ready",
    line: "The work is framed around trust, project fit, responsiveness, and how to start.",
    featured: 3,
    archive: 4,
    archiveText: "Additional work supports credibility while keeping the contact path close."
  }
};

function getCurationProfile(interest: InterestKey, language: LanguageKey) {
  const base = curationProfiles[interest];
  if (language === "en") return base;
  const roomNames: Partial<Record<LanguageKey, Record<InterestKey, string>>> = {
    hi: { founders: "Proof Room", visual: "Motion Room", commerce: "Flow Room", culture: "Story Room", all: "Visual Casebook" },
    te: { founders: "Proof Room", visual: "Motion Room", commerce: "Flow Room", culture: "Story Room", all: "Visual Casebook" },
    fr: { founders: "Salle Preuve", visual: "Salle Motion", commerce: "Salle Flow", culture: "Salle Histoire", all: "Casebook Visuel" },
    es: { founders: "Sala Prueba", visual: "Sala Motion", commerce: "Sala Flujo", culture: "Sala Historia", all: "Casebook Visual" },
    de: { founders: "Proof Raum", visual: "Motion Raum", commerce: "Flow Raum", culture: "Story Raum", all: "Visual Casebook" }
  };
  const selectedLabels: Partial<Record<LanguageKey, string>> = {
    hi: "Curated Selection",
    te: "Curated Selection",
    fr: "Selection Curatee",
    es: "Seleccion Curada",
    de: "Kuratierte Auswahl"
  };
  const profileLines: Partial<Record<LanguageKey, string>> = {
    hi: "Projects ab aapki selected interest ke according arrange hue hain.",
    te: "Projects mee selected interest ki taggattu arrange ayyayi.",
    gu: "Projects tamari selected interest pramane arrange thay chhe.",
    fr: "Les projets sont maintenant organises selon votre intention.",
    es: "Los proyectos ahora se organizan segun tu intencion.",
    de: "Die Projekte sind jetzt nach deiner Auswahl geordnet."
  };
  return {
    ...base,
    headline: roomNames[language]?.[interest] ?? translations[language].selected,
    subhead: translations[language].subhead,
    selected: selectedLabels[language] ?? translations[language].selected,
    projectLine: profileLines[language] ?? translations[language].projectLine,
    philosophy: translations[language].philosophy
  };
}

const localizedPageCopy: Partial<Record<LanguageKey, PageCopy>> = {
  en: {
    philosophyKicker: "Designing Products People Remember",
    philosophyTitle: "Premium design is not decoration. It is direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "More product worlds.",
    archiveText: "Additional launches kept compact so the strongest case studies stay cinematic.",
    clientTitle: "For clients, the work is framed around trust, clarity, and decision confidence.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project type, goal, timeline, and budget range",
    footerSignature: "A visual archive of product thinking, experiments, and the worlds built around them.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, and story-led digital experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Start a project brief",
    processItems: process
  },
  hi: {
    philosophyKicker: "Yaad rehne wale products",
    philosophyTitle: "Premium design sajavat nahi. Direction hai.",
    chips: ["Spashtata", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Aur product worlds.",
    archiveText: "Extra launches compact rakhe gaye hain taaki strongest case studies cinematic feel karein.",
    clientTitle: "Clients ke liye kaam trust, clarity, aur decision confidence ke around frame hota hai.",
    contactLabel: "Sampark",
    email: "Email",
    namePlaceholder: "Naam",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, aur banaye gaye worlds ka visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, aur story-led digital experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief shuru karein",
    processItems: [
      ["Discover", "Business goals, audience, limits, aur emotional direction."],
      ["Research", "Competitors, user expectations, product gaps, aur clarity problems."],
      ["Structure", "Information architecture, user journeys, aur conversion path."],
      ["Design", "Visual system, typography, layout, states, aur motion."],
      ["Prototype", "Interaction logic, scroll rhythm, microinteractions, aur presentation."],
      ["Launch", "Responsive polish, performance checks, handoff, aur iteration."]
    ]
  },
  te: {
    philosophyKicker: "Gurthundipoye products",
    philosophyTitle: "Premium design decoration kaadu. Direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Inka product worlds.",
    archiveText: "Strong case studies cinematic ga undadaniki additional launches compact ga chupistam.",
    clientTitle: "Clients kosam work trust, clarity, decision confidence around frame avutundi.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, mariyu build chesina worlds ki visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led digital experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start cheyyandi",
    processItems: process
  },
  fr: {
    philosophyKicker: "Des produits memorables",
    philosophyTitle: "Le design premium n'est pas decoration. C'est direction.",
    chips: ["Clarte", "Emotion", "Conversion"],
    archiveEyebrow: "Archive Visuelle",
    archiveTitle: "Plus de mondes produit.",
    archiveText: "Les autres lancements restent compacts pour garder les meilleures etudes de cas cinematographiques.",
    clientTitle: "Pour les clients, le travail est cadre autour de la confiance, de la clarte et de la decision.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Nom",
    emailPlaceholder: "Email",
    visionPlaceholder: "Vision du projet",
    footerSignature: "Une archive visuelle de pensee produit, d'experiences et de mondes construits.",
    footerText: "Saathvik Visuals - UI/UX, interfaces cinematographiques, concepts produit et experiences narratives.",
    socialProfessional: "Mises a jour",
    socialSource: "Source projet",
    socialBrief: "Demarrer un brief",
    processItems: process
  },
  es: {
    philosophyKicker: "Productos memorables",
    philosophyTitle: "El diseno premium no es decoracion. Es direccion.",
    chips: ["Claridad", "Emocion", "Conversion"],
    archiveEyebrow: "Archivo Visual",
    archiveTitle: "Mas mundos de producto.",
    archiveText: "Los lanzamientos extra se mantienen compactos para que los casos fuertes se sientan cinematicos.",
    clientTitle: "Para clientes, el trabajo se enmarca en confianza, claridad y seguridad de decision.",
    contactLabel: "Contacto",
    email: "Email",
    namePlaceholder: "Nombre",
    emailPlaceholder: "Email",
    visionPlaceholder: "Vision del proyecto",
    footerSignature: "Un archivo visual de pensamiento de producto, experimentos y mundos construidos.",
    footerText: "Saathvik Visuals - UI/UX, interfaces cinematicas, conceptos de producto y experiencias narrativas.",
    socialProfessional: "Actualizaciones",
    socialSource: "Fuente del proyecto",
    socialBrief: "Iniciar brief",
    processItems: process
  },
  de: {
    philosophyKicker: "Produkte, die bleiben",
    philosophyTitle: "Premium Design ist keine Dekoration. Es ist Richtung.",
    chips: ["Klarheit", "Emotion", "Conversion"],
    archiveEyebrow: "Visuelles Archiv",
    archiveTitle: "Mehr Produktwelten.",
    archiveText: "Weitere Launches bleiben kompakt, damit die staerksten Case Studies filmisch wirken.",
    clientTitle: "Fuer Kunden wird die Arbeit um Vertrauen, Klarheit und Entscheidungssicherheit gerahmt.",
    contactLabel: "Kontakt",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Projektvision",
    footerSignature: "Ein visuelles Archiv aus Produktdenken, Experimenten und gebauten Welten.",
    footerText: "Saathvik Visuals - UI/UX, filmische Interfaces, Produktkonzepte und storygefuhrte Erlebnisse.",
    socialProfessional: "Updates",
    socialSource: "Projektquelle",
    socialBrief: "Brief starten",
    processItems: process
  },
  gu: {
    philosophyKicker: "Yaad rehva jevu design",
    philosophyTitle: "Premium design decoration nathi. Te direction chhe.",
    chips: ["Spashtata", "Bhavna", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Vadhu product worlds.",
    archiveText: "Strong case studies cinematic lage te mate extra launches compact rakhya chhe.",
    clientTitle: "Clients mate kaam trust, clarity, ane decision confidence par frame thay chhe.",
    contactLabel: "Sampark",
    email: "Email",
    namePlaceholder: "Naam",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, ane build karela worlds nu visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, ane story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief sharu karo",
    processItems: [
      ["Shodh", "Business goals, audience, constraints, ane emotional direction."],
      ["Research", "Competitors, user expectations, product gaps, ane clarity problems."],
      ["Structure", "Information architecture, user journeys, ane conversion path."],
      ["Design", "Visual system, typography, layout, states, ane motion."],
      ["Prototype", "Interaction logic, scroll rhythm, microinteractions, ane presentation."],
      ["Launch", "Responsive polish, performance checks, handoff, ane iteration."]
    ]
  },
  mr: {
    philosophyKicker: "Lakshat rahnare products",
    philosophyTitle: "Premium design sajavat nahi. Ti direction aahe.",
    chips: ["Spashtata", "Bhavna", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Aankhi product worlds.",
    archiveText: "Strong case studies cinematic disnyasathi extra launches compact thevle aahet.",
    clientTitle: "Clients sathi kaam trust, clarity, ani decision confidence around frame hota.",
    contactLabel: "Sampark",
    email: "Email",
    namePlaceholder: "Naav",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, ani built worlds cha visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, ani story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start kara",
    processItems: process
  },
  ta: {
    philosophyKicker: "Ninaivil nirkum products",
    philosophyTitle: "Premium design decoration illai. Direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Melum product worlds.",
    archiveText: "Strong case studies cinematic feel kaaga extra launches compact.",
    clientTitle: "Clients kaaga work trust, clarity, decision confidence around frame aagum.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, built worlds kaana visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start",
    processItems: process
  },
  kn: {
    philosophyKicker: "Nenapalli uliva products",
    philosophyTitle: "Premium design decoration alla. Direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Innu product worlds.",
    archiveText: "Strong case studies cinematic aagalu extra launches compact.",
    clientTitle: "Clients ge work trust, clarity, decision confidence around frame aguttade.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, built worlds visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start",
    processItems: process
  },
  ml: {
    philosophyKicker: "Ormayil nilkkunna products",
    philosophyTitle: "Premium design decoration alla. Direction aanu.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Kooduthal product worlds.",
    archiveText: "Strong case studies cinematic aakkan extra launches compact.",
    clientTitle: "Clients inu work trust, clarity, decision confidence around frame cheyyunnu.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, built worlds visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start",
    processItems: process
  },
  bn: {
    philosophyKicker: "Mone thaka products",
    philosophyTitle: "Premium design decoration noy. Direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "Aro product worlds.",
    archiveText: "Strong case studies cinematic rakhar jonno extra launches compact.",
    clientTitle: "Clients er jonno work trust, clarity, decision confidence around frame hoy.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "Product thinking, experiments, built worlds er visual archive.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Brief start",
    processItems: process
  },
  ja: {
    philosophyKicker: "Memorable Products",
    philosophyTitle: "Premium design is direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "More product worlds.",
    archiveText: "Additional launches stay compact so case studies feel cinematic.",
    clientTitle: "Client work is framed around trust, clarity, and decision confidence.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "A visual archive of product thinking and built worlds.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Start brief",
    processItems: process
  },
  ko: {
    philosophyKicker: "Memorable Products",
    philosophyTitle: "Premium design is direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "More product worlds.",
    archiveText: "Additional launches stay compact so case studies feel cinematic.",
    clientTitle: "Client work is framed around trust, clarity, and decision confidence.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "A visual archive of product thinking and built worlds.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Start brief",
    processItems: process
  },
  ar: {
    philosophyKicker: "Memorable Products",
    philosophyTitle: "Premium design is direction.",
    chips: ["Clarity", "Emotion", "Conversion"],
    archiveEyebrow: "Visual Archive",
    archiveTitle: "More product worlds.",
    archiveText: "Additional launches stay compact so case studies feel cinematic.",
    clientTitle: "Client work is framed around trust, clarity, and decision confidence.",
    contactLabel: "Contact",
    email: "Email",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    visionPlaceholder: "Project vision",
    footerSignature: "A visual archive of product thinking and built worlds.",
    footerText: "Saathvik Visuals - UI/UX, cinematic interfaces, product concepts, story-led experiences.",
    socialProfessional: "Professional updates",
    socialSource: "Project source",
    socialBrief: "Start brief",
    processItems: process
  }
};

function getPageCopy(language: LanguageKey) {
  if (localizedPageCopy[language]) return localizedPageCopy[language]!;
  const t = translations[language];
  return {
    philosophyKicker: t.selected,
    philosophyTitle: t.philosophy,
    chips: [t.navWork, t.process, t.navContact],
    archiveEyebrow: t.selected,
    archiveTitle: t.projectLine,
    archiveText: t.subhead,
    clientTitle: `${t.satisfaction}: ${t.philosophy}`,
    contactLabel: t.navContact,
    email: "Email",
    namePlaceholder: t.navContact,
    emailPlaceholder: "Email",
    visionPlaceholder: t.brief,
    footerSignature: t.contactTitle,
    footerText: t.subhead,
    socialProfessional: t.satisfaction,
    socialSource: t.source,
    socialBrief: t.brief,
    processItems: [
      [t.process, t.philosophy],
      [t.navWork, t.projectLine],
      [t.selected, t.subhead],
      [t.mode, t.choose],
      [t.language, t.contactTitle],
      [t.brief, t.contact]
    ]
  };
}

function getProjectCopy(project: (typeof projects)[number], language: LanguageKey) {
  if (language === "en") {
    return { type: project.type, tag: project.tag, outcome: project.outcome };
  }

  const prefix: Partial<Record<LanguageKey, { concept: string; experience: string; outcome: string }>> = {
    hi: { concept: "Concept", experience: "Anubhav", outcome: "Dikhata hai" },
    te: { concept: "Concept", experience: "Experience", outcome: "Chupistundi" },
    fr: { concept: "Concept", experience: "Experience", outcome: "Montre" },
    es: { concept: "Concepto", experience: "Experiencia", outcome: "Muestra" },
    de: { concept: "Konzept", experience: "Erlebnis", outcome: "Zeigt" },
    ja: { concept: "Concept", experience: "Experience", outcome: "Shows" },
    ko: { concept: "Concept", experience: "Experience", outcome: "Shows" },
    ar: { concept: "Concept", experience: "Experience", outcome: "Shows" }
  };
  const copy = prefix[language] ?? prefix.hi!;
  return {
    type: `${copy.concept} - ${project.type}`,
    tag: `${copy.experience}: ${project.tag}`,
    outcome: `${copy.outcome}: ${project.outcome}`
  };
}

// Real testimonials are shown exactly as the client wrote them (any language) —
// never auto-translated, since that would put words in their mouth. The `language`
// field on each entry is just a display tag.
function getTestimonials() {
  return testimonials;
}

function TopNav() {
  const curated = useExperienceStore((state) => state.curated);
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];

  if (!curated) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6">
      <nav className="gallery-nav mx-auto flex items-center justify-between gap-3 rounded-[1.4rem] border hairline bg-[var(--card)] px-3 py-2 shadow-sm backdrop-blur-2xl">
        <a href="#top" className="flex items-center gap-3 text-sm font-bold text-[var(--ink)] no-underline" onClick={(event) => scrollToSection(event, "top")}>
          <Image className="h-10 w-10 rounded-[0.9rem] object-cover" src="/brand-favicon.png" alt="Saathvik Visuals" width={40} height={40} priority />
        </a>
        <div className="hidden items-center gap-1 text-[0.66rem] font-black uppercase text-[var(--muted)] md:flex">
          <a className="rounded-full px-3 py-2 hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--accent)]" href="#work" onClick={(event) => scrollToSection(event, "work")}>01 {t.navWork}</a>
          <a className="rounded-full px-3 py-2 hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--accent)]" href="#process" onClick={(event) => scrollToSection(event, "process")}>02 {t.navProcess}</a>
          <a className="rounded-full px-3 py-2 hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--accent)]" href="#contact" onClick={(event) => scrollToSection(event, "contact")}>03 {t.navContact}</a>
        </div>
        <div className="flex items-center gap-2">
          <PaletteMenu />
          <ThemeToggle />
          <NarrationButton />
          <LanguageMenu />
        </div>
      </nav>
    </header>
  );
}

function NarrationButton() {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stopRequestedRef = useRef(false);
  const language = useExperienceStore((state) => state.language);
  const interest = useExperienceStore((state) => state.interest);
  const depth = useExperienceStore((state) => state.depth);
  const mode = useExperienceStore((state) => state.mode);
  const curationSignature = useExperienceStore((state) => state.curationSignature);
  const t = translations[language];
  const profile = getCurationProfile(interest, language);

  useEffect(() => {
    return () => {
      stopRequestedRef.current = true;
      utteranceRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, []);

  function toggleNarration() {
    if (!("speechSynthesis" in window)) return;
    if (speaking || window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      stopRequestedRef.current = true;
      utteranceRef.current = null;
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    stopRequestedRef.current = false;
    window.speechSynthesis.cancel();
    const utterance = createNarrationUtterance({
      language,
      room: profile.headline,
      interest,
      depth,
      mode,
      signature: curationSignature
    });
    utteranceRef.current = utterance;
    utterance.onend = () => {
      if (utteranceRef.current === utterance) utteranceRef.current = null;
      if (!stopRequestedRef.current) setSpeaking(false);
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) utteranceRef.current = null;
      if (!stopRequestedRef.current) setSpeaking(false);
    };
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      className="audio-narration-trigger magnetic grid h-10 w-10 place-items-center rounded-full border hairline bg-[var(--card)] text-[var(--ink)]"
      onClick={toggleNarration}
      aria-label={speaking ? "Stop narrated portfolio summary" : "Play narrated portfolio summary"}
      title={speaking ? "Stop guide" : `${t.language} audio guide`}
    >
      {speaking ? <VolumeX size={17} className="text-[var(--accent)]" /> : <Volume2 size={17} />}
    </button>
  );
}

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  const offset = window.matchMedia("(max-width: 640px)").matches ? 18 : 96;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top, behavior: "smooth" });
}

function createNarrationUtterance({
  language,
  room,
  interest,
  depth,
  mode,
  signature
}: {
  language: LanguageKey;
  room: string;
  interest: InterestKey;
  depth: DepthKey;
  mode: ModeKey;
  signature: string;
}) {
  const languageCode: Record<LanguageKey, string> = {
    en: "en-US",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    fr: "fr-FR",
    es: "es-ES",
    de: "de-DE",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA"
  };
  const projectFocus: Record<InterestKey, string> = {
    founders: "business clarity, trust, premium product positioning, and lead conversion",
    visual: "cinematic interfaces, motion, visual systems, and memorable brand worlds",
    commerce: "service journeys, shopping confidence, booking flow, and mobile conversion",
    culture: "story-led experiences, travel, music, identity, and cultural product design",
    all: "selected UI UX projects, visual systems, and product case studies"
  };
  const depthLine: Record<DepthKey, string> = {
    quick: "This version keeps the scan short and leads with the strongest proof.",
    case: "This version opens more process, from problem framing to structure, interface, prototype, and outcome.",
    gallery: "This version gives more space to screenshots, atmosphere, and visual direction.",
    hire: "This version keeps trust signals and the project brief path close for client decisions."
  };
  const modeLine: Record<ModeKey, string> = {
    founder: "The visual mode is focused, calm, and business-readable.",
    creative: "The visual mode is cinematic, expressive, and motion-led.",
    minimal: "The visual mode is editorial, light, and direct.",
    future: "The visual mode feels like a modern product launch with depth and movement."
  };
  const english = `Welcome to ${room}. This curated Saathvik Visuals portfolio is shaped around ${projectFocus[interest]}. ${depthLine[depth]} ${modeLine[mode]} You can explore the featured work, open individual case studies, review the design process, and start a project brief from the contact section. Your selection path is ${signature.replaceAll(":", ", ")}.`;
  const localized: Partial<Record<LanguageKey, string>> = {
    hi: `Saathvik Visuals mein swagat hai. Yeh ${room} version ${projectFocus[interest]} par focus karta hai. ${depthLine[depth]} Aap featured work dekh sakte hain, case studies khol sakte hain, process samajh sakte hain, aur contact section se paid project brief start kar sakte hain.`,
    te: `Saathvik Visuals ki welcome. Ee ${room} version ${projectFocus[interest]} meeda focus chestundi. ${depthLine[depth]} Meeru featured work choodachu, case studies open cheyyachu, process ardham chesukovachu, contact section lo project brief start cheyyachu.`,
    ta: `Saathvik Visuals ku welcome. Indha ${room} version ${projectFocus[interest]} mela focus pannum. ${depthLine[depth]} Neenga featured work paakalaam, case studies open pannalaam, process purinjukalaam, contact section la project brief start pannalaam.`,
    fr: `Bienvenue dans ${room}. Cette version de Saathvik Visuals est organisee autour de ${projectFocus[interest]}. ${depthLine[depth]} Vous pouvez voir les projets, ouvrir les etudes de cas, comprendre le processus, puis demarrer un brief projet depuis la section contact.`,
    es: `Bienvenido a ${room}. Esta version de Saathvik Visuals esta curada alrededor de ${projectFocus[interest]}. ${depthLine[depth]} Puedes explorar los trabajos, abrir casos de estudio, revisar el proceso y enviar un brief de proyecto desde contacto.`,
    de: `Willkommen in ${room}. Diese Version von Saathvik Visuals ist auf ${projectFocus[interest]} ausgerichtet. ${depthLine[depth]} Du kannst Arbeiten ansehen, Case Studies oeffnen, den Prozess pruefen und im Kontaktbereich ein Projektbriefing starten.`
  };
  const utterance = new SpeechSynthesisUtterance(localized[language] ?? english);
  utterance.lang = languageCode[language];
  utterance.rate = language === "en" ? 0.92 : 0.88;
  utterance.pitch = 0.96;
  utterance.volume = 0.9;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => voice.lang.toLowerCase().startsWith(languageCode[language].slice(0, 2).toLowerCase())) ?? null;
  return utterance;
}

function PaletteMenu() {
  const [open, setOpen] = useState(false);
  const palette = useExperienceStore((state) => state.palette);
  const setPalette = useExperienceStore((state) => state.setPalette);
  const active = palettes[palette];

  return (
    <div className="palette-menu-root relative">
      <button
        className="palette-trigger magnetic flex h-10 items-center gap-2 rounded-full border hairline px-3 text-xs font-black text-[var(--ink)] shadow-sm"
        onClick={() => setOpen((value) => !value)}
        aria-label="Choose color palette"
        aria-expanded={open}
      >
        <span
          className="h-4 w-4 rounded-full shadow-sm"
          style={{ background: `linear-gradient(135deg, ${active.accent}, ${active.accent2})` }}
        />
        <span className="hidden sm:inline">{active.label}</span>
        <Palette size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button aria-hidden className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} tabIndex={-1} />
            <motion.div
              className="palette-panel absolute right-0 top-12 z-50 w-72"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              {paletteKeys.map((key) => (
                <button
                  key={key}
                  className="palette-swatch"
                  onClick={() => {
                    setPalette(key);
                    setOpen(false);
                  }}
                  aria-label={`Switch to ${palettes[key].label} palette`}
                  aria-pressed={palette === key}
                >
                  <span
                    className="palette-swatch-dot"
                    style={{ background: `linear-gradient(135deg, ${palettes[key].accent}, ${palettes[key].accent2})` }}
                  />
                  <span className="palette-swatch-label">{palettes[key].label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeToggle() {
  const theme = useExperienceStore((state) => state.theme);
  const toggleTheme = useExperienceStore((state) => state.toggleTheme);

  return (
    <button
      className="theme-toggle magnetic grid h-10 w-10 place-items-center rounded-full border hairline text-[var(--ink)]"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const language = useExperienceStore((state) => state.language);
  const setLanguage = useExperienceStore((state) => state.setLanguage);
  const active = languageOptions.find((item) => item.key === language) ?? languageOptions[0];

  return (
    <div className="language-menu-root relative">
      <button
        className="language-trigger magnetic flex h-10 items-center gap-2 rounded-full border hairline bg-[var(--card)] px-3 text-xs font-black text-[var(--ink)] shadow-sm"
        onClick={() => setOpen((value) => !value)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <Languages size={15} className="text-[var(--accent)]" />
        <span>{active.short}</span>
        <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="language-panel absolute right-0 top-12 z-50 grid max-h-[70vh] w-64 gap-1 overflow-auto rounded-3xl border hairline bg-[var(--card)] p-2 shadow-2xl backdrop-blur-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
          >
            {languageOptions.map((item) => (
              <button
                key={item.key}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition",
                  language === item.key ? "bg-[var(--accent)] text-white" : "text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)]"
                )}
                onClick={() => {
                  setLanguage(item.key);
                  setOpen(false);
                }}
              >
                <span>
                  <strong className="block">{item.native}</strong>
                  <small className={language === item.key ? "text-white/72" : "text-[var(--muted)]"}>{item.label}</small>
                </span>
                <span className="text-xs font-black">{item.short}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const language = useExperienceStore((state) => state.language);
  const interest = useExperienceStore((state) => state.interest);
  const depth = useExperienceStore((state) => state.depth);
  const t = translations[language];
  const profile = getCurationProfile(interest, language);
  const headline = interest === "all" ? profile.headline : roomForInterest(interest, depth);
  const sectionRef = useRef<HTMLElement>(null);

  // A one-time curtain-rise reveal on load: GSAP's clip-path timeline gives the
  // "theatre curtain" opening moment that framer-motion's opacity/transform fades
  // (used for the headline and everything below) can't produce cleanly.
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-stage relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-28 text-center sm:px-8"
    >
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
          <AnimatedKicker text={profile.kicker} />
          <AnimatedHeadline text={headline} />
          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.75 }}
          >
            {language === "en" ? profile.subhead : t.subhead}
          </motion.p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-sm font-bold text-white no-underline shadow-xl" href="#work" onClick={(event) => scrollToSection(event, "work")}>
              {t.explore} <ArrowUpRight size={17} />
            </a>
            <a className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full border hairline bg-[var(--card)] px-6 text-sm font-bold text-[var(--ink)] no-underline backdrop-blur-xl" href="#contact" onClick={(event) => scrollToSection(event, "contact")}>
              {t.contact} <MousePointer2 size={17} />
            </a>
          </div>
        </motion.div>
      </div>
      <ScrollCue />
    </section>
  );
}

function ScrollCue() {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <span className="text-[0.62rem] font-black uppercase tracking-[0.32em] text-[var(--muted)]">Scroll to explore</span>
      <motion.span
        className="h-9 w-px"
        style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function AnimatedKicker({ text }: { text: string }) {
  return (
    <motion.p
      className="mb-5 m-0 text-sm font-black uppercase tracking-[0.28em] text-[var(--accent)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
    >
      {text}
    </motion.p>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  return (
    <h1 className="hero-title mx-auto max-w-4xl text-center text-6xl leading-[0.96] tracking-normal sm:text-7xl lg:text-8xl">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 42, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.06 * index, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}{index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </h1>
  );
}

function Philosophy() {
  const language = useExperienceStore((state) => state.language);
  const interest = useExperienceStore((state) => state.interest);
  const t = translations[language];
  const profile = getCurationProfile(interest, language);
  const pageCopy = getPageCopy(language);

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--accent)]">{pageCopy.philosophyKicker}</p>
          <motion.h2
            className="mode-font mt-3 text-4xl font-black leading-tight sm:text-6xl"
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
          >
            {pageCopy.philosophyTitle}
          </motion.h2>
        </div>
        <motion.div
          className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <span
            aria-hidden="true"
            className="mode-font pointer-events-none absolute -left-2 -top-6 select-none text-[10rem] font-black leading-none opacity-[0.07] sm:text-[14rem]"
            style={{ color: "var(--accent)" }}
          >
            &ldquo;
          </span>
          <p className="relative m-0 text-2xl leading-10 text-[var(--ink)]">{language === "en" ? profile.philosophy : t.philosophy}</p>
          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            {pageCopy.chips.map((item, index) => (
              <motion.div
                key={item}
                className="rounded-2xl border hairline bg-[var(--card)] p-4 text-sm font-bold"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Check className="mb-3" style={{ color: "var(--accent)" }} size={18} />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectShowcase() {
  const language = useExperienceStore((state) => state.language);
  const interest = useExperienceStore((state) => state.interest);
  const depth = useExperienceStore((state) => state.depth);
  const mode = useExperienceStore((state) => state.mode);
  const curationSignature = useExperienceStore((state) => state.curationSignature);
  const t = translations[language];
  const profile = getCurationProfile(interest, language);
  const depthProfile = depthProfiles[depth];
  const curatedProjects = getCuratedProjects(interest, depth, mode, curationSignature);
  const featuredProjects = curatedProjects.slice(0, depthProfile.featured);
  const archivePool = curatedProjects.length > depthProfile.featured ? curatedProjects.slice(depthProfile.featured) : getFallbackProjects(curatedProjects, depth, mode, curationSignature);
  const archiveProjects = archivePool.slice(0, depthProfile.archive);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Desktop gets a GSAP-pinned horizontal swipe through the featured work; narrow
  // viewports skip the pin entirely and fall back to native horizontal scroll-snap
  // (see .project-reel-pin in globals.css) so mobile never fights a scrubbed pin.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || window.matchMedia("(max-width: 900px)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 0)}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const distance = Math.max(track.scrollWidth - window.innerWidth, 0);
          gsap.set(track, { x: -distance * self.progress });
        }
      });
      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, [featuredProjects.length]);

  return (
    <section id="work" className="py-20" data-depth={depth}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[var(--accent)]">{profile.selected} / {depthProfile.label}</p>
            <motion.h2
              className="mode-font mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl"
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
            >
              {profile.projectLine}
            </motion.h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">{depthProfile.line}</p>
          </div>
          <a className="inline-flex items-center gap-2 text-sm font-black text-[var(--accent)] no-underline" href={socialLinks.github} target="_blank">
            <GitBranch size={18} /> GitHub
          </a>
        </div>
      </div>
      <div ref={sectionRef} className="project-reel-pin relative mt-14">
        <div ref={trackRef} className="project-reel flex gap-8 px-5 will-change-transform sm:px-8">
          {featuredProjects.map((project, index) => (
            <div key={project.name} className="project-slide w-[90vw] shrink-0 sm:w-[78vw] lg:w-[64vw]">
              <ProjectScene project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
        <ProjectArchive items={archiveProjects} depthProfile={depthProfile} />
      </div>
    </section>
  );
}

type ProjectItem = (typeof projects)[number];

const depthProjectPriority: Record<DepthKey, string[]> = {
  quick: ["linkedin-creator", "airbnb-nomad", "netflix-altitude", "spotify-drive", "aarna-salon", "jaabili", "naad", "aryav", "pawly"],
  case: ["linkedin-creator", "airbnb-nomad", "spotify-drive", "aryav", "aarna-salon", "naad", "jaabili", "pawly", "netflix-altitude"],
  gallery: ["netflix-altitude", "spotify-drive", "airbnb-nomad", "linkedin-creator", "jaabili", "aryav", "naad", "aarna-salon", "pawly"],
  hire: ["aarna-salon", "linkedin-creator", "pawly", "airbnb-nomad", "aryav", "spotify-drive", "naad", "jaabili", "netflix-altitude"]
};

function getCuratedProjects(interest: InterestKey, depth: DepthKey, mode: ModeKey, signature: string) {
  const primary = interest === "all" ? [...projects] : projects.filter((project) => project.interests.includes(interest));
  return rankProjects(primary, interest, depth, mode, signature);
}

function getFallbackProjects(selected: ProjectItem[], depth: DepthKey, mode: ModeKey, signature: string) {
  return rankProjects(projects.filter((project) => !selected.includes(project)), "all", depth, mode, signature);
}

function rankProjects(items: ProjectItem[], interest: InterestKey, depth: DepthKey, mode: ModeKey, signature: string) {
  const priority = depthProjectPriority[depth];
  const offset = signatureScore(signature) % Math.max(items.length, 1);
  return [...items]
    .sort((a, b) => {
      const aScore = projectScore(a, interest, depth, mode, priority);
      const bScore = projectScore(b, interest, depth, mode, priority);
      if (aScore !== bScore) return bScore - aScore;
      return rotatedIndex(priority.indexOf(a.slug), offset, priority.length) - rotatedIndex(priority.indexOf(b.slug), offset, priority.length);
    });
}

function projectScore(project: ProjectItem, interest: InterestKey, depth: DepthKey, mode: ModeKey, priority: string[]) {
  let score = 100 - priority.indexOf(project.slug);
  if (interest !== "all" && project.interests.includes(interest)) score += 50;
  if (depth === "hire" && (project.type.includes("Client-style") || project.interests.includes("commerce"))) score += 30;
  if (depth === "gallery" && project.interests.includes("visual")) score += 28;
  if (depth === "case" && project.interests.includes("founders")) score += 24;
  if (mode === "future" && project.interests.includes("culture")) score += 18;
  if (mode === "minimal" && project.interests.includes("commerce")) score += 18;
  return score;
}

function rotatedIndex(index: number, offset: number, length: number) {
  const safeIndex = index < 0 ? length : index;
  return (safeIndex + offset) % Math.max(length, 1);
}

function signatureScore(signature: string) {
  return signature.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function ProjectScene({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];
  const translatedProject = getProjectCopy(project, language);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const imageScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.98, 1.035, 0.99]);
  const isReverse = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
        className={cn(
        "project-scene relative grid min-h-[76vh] items-center gap-7 overflow-hidden rounded-[2.6rem] border hairline bg-[var(--card)] p-4 shadow-[0_34px_110px_rgba(15,23,42,0.10)] backdrop-blur-2xl md:grid-cols-[1.34fr_0.66fr] md:p-6 lg:p-8",
        isReverse && "md:grid-cols-[0.82fr_1.18fr]"
      )}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className={cn(
          "project-image-shell relative min-h-[42vh] overflow-hidden rounded-[2rem] border hairline bg-slate-950 shadow-2xl md:min-h-[66vh]",
          isReverse && "md:order-2"
        )}
        style={{ y: imageY, scale: imageScale }}
      >
        <ProjectMedia
          slug={project.slug}
          image={project.image}
          alt={`${project.name} interface screenshot`}
          sizes="(min-width: 1024px) 62vw, 94vw"
          priority={index < 2}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/18 via-transparent to-[color-mix(in_srgb,var(--accent)_18%,transparent)]" />
      </motion.div>

      <motion.div
        className={cn("relative z-10 grid content-center rounded-[2rem] bg-[var(--card)] p-5 backdrop-blur-xl md:p-7", isReverse && "md:order-1")}
        initial={{ opacity: 0, x: isReverse ? -34 : 34 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.12, duration: 0.72 }}
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="mode-font text-8xl font-black leading-none text-[var(--accent)]/20">0{index + 1}</span>
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
        <p className="m-0 text-xs font-black uppercase tracking-[0.22em] text-[var(--accent)]">{translatedProject.type}</p>
        <h3 className="mode-font mt-3 text-4xl font-black leading-none text-[var(--ink)] sm:text-5xl">{project.name}</h3>
        <p className="mt-5 max-w-lg text-xl font-black leading-7 text-[var(--ink)]">{translatedProject.tag}</p>
        <p className="line-clamp-2 mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">{translatedProject.outcome}</p>

        <div className="mt-7 flex gap-2">
          {project.palette.map((color) => (
            <span key={color} className="h-9 w-9 rounded-full border border-black/10 shadow-sm" style={{ background: color }} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-sm font-black text-white no-underline" href={`/work/${project.slug}`}>
            {t.liveWork} <ArrowUpRight size={17} />
          </Link>
          <a className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full border hairline bg-[var(--card)] px-6 text-sm font-black text-[var(--ink)] no-underline" href={project.github} target="_blank">
            {t.source} <GitBranch size={17} />
          </a>
        </div>
      </motion.div>
    </motion.article>
  );
}

function ProjectArchive({ items, depthProfile }: { items: typeof projects; depthProfile: (typeof depthProfiles)[DepthKey] }) {
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];
  const pageCopy = getPageCopy(language);

  return (
    <section className="archive-panel rounded-[2.4rem] border hairline bg-slate-950 p-4 text-white shadow-[0_40px_120px_rgba(15,23,42,0.18)] sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-[0.28em] text-white/50">{pageCopy.archiveEyebrow}</p>
          <h3 className="mode-font m-0 mt-2 text-4xl font-black sm:text-5xl">{pageCopy.archiveTitle}</h3>
        </div>
        <p className="m-0 max-w-md text-sm leading-6 text-white/58">{language === "en" ? depthProfile.archiveText : pageCopy.archiveText}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {items.map((project, index) => (
          <motion.a
            key={project.name}
            className="archive-tile group relative min-h-72 overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 text-white no-underline"
            href={`/work/${project.slug}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
          >
            <ProjectMedia slug={project.slug} image={project.image} alt={`${project.name} screenshot`} sizes="(min-width: 768px) 18vw, 92vw" className="transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/22 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="m-0 text-xs font-black uppercase tracking-[0.18em] text-white/58">0{index + 5}</p>
              <h4 className="mode-font m-0 mt-1 text-2xl font-black">{project.name}</h4>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-black text-white/80">{t.liveWork} <ArrowUpRight size={14} /></span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function ClientExperience() {
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];
  const pageCopy = getPageCopy(language);
  const reviews = getTestimonials();

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.6rem] px-5 py-20 sm:px-8">
      <AmbientVideoBackdrop slugs={["aarna-salon", "naad", "jaabili"]} />
      <div className="relative z-10">
        <p className="text-sm font-black uppercase text-[var(--accent)]">{t.satisfaction}</p>
        <motion.h2
          className="mode-font mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl"
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          {pageCopy.clientTitle}
        </motion.h2>

        {reviews.length === 0 ? (
          <div className="glass mt-9 rounded-[2rem] p-10 text-center">
            <p className="m-0 text-lg leading-7 text-[var(--muted)]">
              Client reviews are on the way — every one shown here will be a real response from someone Saathvik has built for.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {reviews.map((item, index) => (
              <motion.figure
                key={`${item.name}-${index}`}
                className="glass relative m-0 rotate-0 rounded-[1.6rem] p-7"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.2 : 1.4}deg)` }}
                initial={{ opacity: 0, y: 24, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08 }}
              >
                <blockquote className="handwritten-quote m-0 text-2xl leading-snug text-[var(--ink)]">"{item.quote}"</blockquote>
                <figcaption className="mt-6 flex items-end justify-between gap-3 border-t hairline pt-4">
                  <div>
                    <strong className="block text-sm font-black uppercase tracking-wide text-[var(--accent)]">{item.name}</strong>
                    {item.project && (
                      item.projectUrl ? (
                        <a className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--muted)] no-underline hover:text-[var(--accent)]" href={item.projectUrl} target="_blank" rel="noreferrer">
                          {item.project} <ArrowUpRight size={11} />
                        </a>
                      ) : (
                        <span className="mt-1 block text-xs font-bold text-[var(--muted)]">{item.project}</span>
                      )
                    )}
                  </div>
                  {item.language && item.language.toLowerCase() !== "english" && (
                    <span className="rounded-full border hairline px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wide text-[var(--muted)]">{item.language}</span>
                  )}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Process() {
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];
  const pageCopy = getPageCopy(language);

  return (
    <section id="process" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <p className="text-sm font-black uppercase text-[var(--accent)]">{t.process}</p>
      <div className="relative mt-12 grid gap-10">
        <div className="absolute bottom-6 left-[27px] top-6 hidden w-px sm:block" style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }} />
        {pageCopy.processItems.map(([title, text], index) => (
          <motion.div
            key={title}
            className={cn("relative grid items-start gap-5 sm:grid-cols-[56px_1fr]", index % 2 === 1 && "sm:pl-12")}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (index % 4) * 0.05 }}
          >
            <div
              className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 text-sm font-black"
              style={{ borderColor: "var(--accent)", background: "var(--paper)", color: "var(--accent)" }}
            >
              0{index + 1}
            </div>
            <div className={cn(index % 2 === 1 && "sm:max-w-2xl")}>
              <h3 className="mode-font m-0 text-3xl font-black sm:text-4xl">{title}</h3>
              <p className="m-0 mt-2 max-w-xl text-[var(--muted)]">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const language = useExperienceStore((state) => state.language);
  const t = translations[language];
  const pageCopy = getPageCopy(language);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setNotice("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Could not send the message right now.");
      }

      setStatus("sent");
      setNotice(payload.message ?? "Brief received. I will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Could not send the message right now.");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="glass relative overflow-hidden rounded-[2.4rem] p-7 sm:p-12">
        <AmbientVideoBackdrop slugs={["spotify-drive", "netflix-altitude", "linkedin-creator"]} />
        <div className="relative z-10">
        <p className="text-sm font-black uppercase text-[var(--accent)]">{pageCopy.contactLabel}</p>
        <motion.h2
          className="mode-font mt-3 max-w-4xl text-5xl font-black leading-tight sm:text-7xl"
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          {t.contactTitle}
        </motion.h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <a className="magnetic rounded-3xl border hairline bg-[var(--card)] p-5 text-[var(--ink)] no-underline" href={socialLinks.email}>
              <Mail className="mb-5 text-[var(--accent)]" />
              <strong className="block">{pageCopy.email}</strong>
              <span className="mt-1 block text-sm text-[var(--muted)]">saathvikk202@gmail.com</span>
            </a>
            <a className="magnetic rounded-3xl border hairline bg-[var(--card)] p-5 text-[var(--ink)] no-underline" href={socialLinks.linkedin} target="_blank">
              <SocialIcon type="linkedin" />
              <strong className="mt-5 block">LinkedIn</strong>
              <span className="mt-1 block text-sm text-[var(--muted)]">saathvik-kalepu</span>
            </a>
            <a className="magnetic rounded-3xl border hairline bg-[var(--card)] p-5 text-[var(--ink)] no-underline" href={socialLinks.instagram} target="_blank">
              <SocialIcon type="instagram" />
              <strong className="mt-5 block">Instagram</strong>
              <span className="mt-1 block text-sm text-[var(--muted)]">@sunny__fr18</span>
            </a>
            <a className="magnetic rounded-3xl border hairline bg-[var(--card)] p-5 text-[var(--ink)] no-underline" href={socialLinks.github} target="_blank">
              <GitBranch className="mb-5 text-[var(--accent)]" />
              <strong className="block">GitHub</strong>
              <span className="mt-1 block text-sm text-[var(--muted)]">github.com/saathvikvisuals</span>
            </a>
          </div>
          <form className="grid gap-3" onSubmit={submitContact}>
            <input
              className="min-h-12 rounded-2xl border hairline bg-[var(--card)] px-4 outline-none focus:border-[var(--accent)]"
              placeholder={pageCopy.namePlaceholder}
              value={form.name}
              onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
              required
            />
            <input
              className="min-h-12 rounded-2xl border hairline bg-[var(--card)] px-4 outline-none focus:border-[var(--accent)]"
              placeholder={pageCopy.emailPlaceholder}
              type="email"
              value={form.email}
              onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
              required
            />
            <textarea
              className="min-h-32 rounded-2xl border hairline bg-[var(--card)] p-4 outline-none focus:border-[var(--accent)]"
              placeholder={pageCopy.visionPlaceholder}
              value={form.message}
              onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))}
              minLength={10}
              required
            />
            <p className="m-0 px-1 text-xs font-bold leading-5 text-[var(--muted)]">Minimum 10 characters.</p>
            <button className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-sm font-black text-white disabled:cursor-wait disabled:opacity-60" type="submit" disabled={status === "sending"}>
              {t.brief} <BriefcaseBusiness size={17} />
            </button>
            {notice && (
              <p className={cn("m-0 rounded-2xl border px-4 py-3 text-sm font-bold", status === "sent" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-amber-400/40 bg-amber-400/10 text-amber-300")}>
                {notice}
              </p>
            )}
          </form>
        </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const language = useExperienceStore((state) => state.language);
  const pageCopy = getPageCopy(language);

  return (
    <footer className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
      <div className="footer-panel relative grid gap-8 overflow-hidden rounded-[2.2rem] border border-white/10 p-6 text-white shadow-[0_34px_120px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8 lg:grid-cols-[1fr_auto]">
        <AmbientVideoBackdrop slugs={["aryav", "pawly", "airbnb-nomad"]} tone="dark" />
        <div className="relative z-10">
          <Image className="rounded-[1.1rem]" src="/brand-favicon.png" alt="Saathvik Visuals" width={54} height={54} />
          <p className="signature-note mt-7 max-w-xl text-5xl leading-none text-white">{pageCopy.footerSignature}</p>
          <p className="mt-6 max-w-lg text-sm leading-6 text-white/58">{pageCopy.footerText}</p>
        </div>
        <div className="relative z-10 grid content-end gap-3 sm:grid-cols-2 lg:w-[420px]">
          <SocialLink href={socialLinks.linkedin} label="LinkedIn" detail={pageCopy.socialProfessional} type="linkedin" />
          <SocialLink href={socialLinks.instagram} label="Instagram" detail="@sunny__fr18" type="instagram" />
          <SocialLink href={socialLinks.github} label="GitHub" detail={pageCopy.socialSource} type="github" />
          <SocialLink href={socialLinks.email} label={pageCopy.email} detail={pageCopy.socialBrief} type="mail" />
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, detail, type }: { href: string; label: string; detail: string; type: "linkedin" | "instagram" | "github" | "mail" }) {
  return (
    <a className="magnetic rounded-2xl border border-white/10 bg-white/7 p-4 text-white no-underline hover:bg-white/12" href={href} target={href.startsWith("mailto:") ? undefined : "_blank"}>
      <SocialIcon type={type} />
      <strong className="mt-4 block">{label}</strong>
      <span className="mt-1 block text-sm text-white/54">{detail}</span>
    </a>
  );
}

function SocialIcon({ type }: { type: "linkedin" | "instagram" | "github" | "mail" }) {
  if (type === "github") return <GitBranch className="text-[var(--accent)]" size={22} />;
  if (type === "mail") return <Mail className="text-[var(--accent)]" size={22} />;
  return (
    <svg className="text-[var(--accent)]" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {type === "linkedin" ? (
        <path d="M6.8 9.2V19H3.6V9.2h3.2ZM5.2 5c1 0 1.8.7 1.8 1.7S6.2 8.4 5.2 8.4 3.4 7.7 3.4 6.7 4.2 5 5.2 5Zm6.8 4.2v1.4c.5-.9 1.6-1.7 3.2-1.7 3.4 0 4 2.2 4 5.1v5h-3.2v-4.4c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19H9.5V9.2H12Z" fill="currentColor" />
      ) : (
        <>
          <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="2" />
          <circle cx="16.7" cy="7.3" r="1" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  // GSAP quickTo drives both the pointer trail and the scroll-linked scale so a
  // single engine owns the element's transform (mixing framer-motion's transform
  // writes with GSAP's here would have them silently overwrite each other).
  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 0.75 });
    const moveX = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power3" });
    const moveY = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power3" });
    const moveScale = gsap.quickTo(dot, "scale", { duration: 0.4, ease: "power2" });

    function move(event: PointerEvent) {
      moveX(event.clientX);
      moveY(event.clientY);
    }
    window.addEventListener("pointermove", move);

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => moveScale(0.75 + self.progress * 0.6)
    });

    return () => {
      window.removeEventListener("pointermove", move);
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-8 w-8 rounded-full border border-[var(--accent)] mix-blend-difference md:block"
      style={{ boxShadow: "0 0 22px var(--glow)" }}
    />
  );
}
