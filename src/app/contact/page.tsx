import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { CinematicBackground } from "@/components/cinematic-background";
import { ContactEstimator } from "@/components/contact-estimator";
import { ExperienceProvider } from "@/components/experience-provider";
import { getService } from "@/data/services";
import { BackToStudioLink } from "@/components/back-to-studio-link";
import { socialLinks } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a quotation with Saathvik Visuals. Share your scope, get a cleaner budget estimate, and understand the advance payment before kickoff."
};

const serviceQueryMap: Record<string, string> = {
  "customised-saas-products": "web3-products",
  "web-development": "web-development",
  "ui-ux-design": "ui-ux-design",
  "dashboards": "dashboards",
  "seo-growth": "seo-growth",
  "brand-systems": "brand-systems"
};

export default function ContactPage({ searchParams }: { searchParams: { service?: string } }) {
  const requested = searchParams.service ? serviceQueryMap[searchParams.service] ?? searchParams.service : undefined;
  const service = requested ? getService(requested) : undefined;

  return (
    <ExperienceProvider>
      <CinematicBackground />
      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <BackToStudioLink />

        <section className="mt-8 rounded-[2.6rem] border hairline bg-[color-mix(in_srgb,var(--card)_82%,transparent)] p-7 shadow-[0_30px_90px_var(--shadow-color)] backdrop-blur-2xl sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Contact and quotation</p>
          <h1 className="mode-font mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Request a quotation with a clear budget path.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Share the project shape, then get a service-aware estimate that explains the starting budget, the advance, and the next step without fixed-price noise.
          </p>
          {service ? (
            <div className="mt-6 rounded-[1.5rem] border hairline bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
              <strong className="block text-[var(--ink)]">Service selected: {service.title}</strong>
              <span className="mt-1 block">The quotation form below is prefilled for this service, but the final quote still depends on scope and integrations.</span>
            </div>
          ) : null}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Budget" value="Starting estimate only" />
            <MiniStat label="Advance" value="40% upfront" />
            <MiniStat label="Reply" value="Email or WhatsApp" />
          </div>
        </section>

        <section className="mt-8 pb-8">
          <ContactEstimator initialProjectType={service?.key} />
        </section>

        <a
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500 text-white shadow-[0_18px_40px_-12px_rgba(16,185,129,0.55)] transition hover:scale-[1.03]"
          href={socialLinks.whatsapp}
          rel="noreferrer"
          target="_blank"
          aria-label="Message on WhatsApp"
        >
          <MessageCircleMore size={22} />
        </a>
      </main>
    </ExperienceProvider>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border hairline bg-[var(--card)] px-4 py-4">
      <p className="m-0 text-[0.65rem] font-black uppercase tracking-[0.22em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 m-0 text-sm font-black text-[var(--ink)]">{value}</p>
    </div>
  );
}
