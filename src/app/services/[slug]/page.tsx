import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getService, services } from "@/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.intro
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link className="inline-flex items-center gap-2 rounded-full border hairline bg-[var(--card)] px-4 py-2 text-sm font-black text-[var(--ink)] no-underline" href="/services">
        <ArrowLeft size={16} />
        All services
      </Link>
      <section className="mt-6 rounded-[2.4rem] border hairline bg-[var(--card)] p-7 shadow-[0_30px_90px_var(--shadow-color)] backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">{service.pricing.from}</p>
        <h1 className="mode-font mt-3 text-4xl font-black sm:text-6xl">{service.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">{service.intro}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.8rem] border hairline bg-[color-mix(in_srgb,var(--card)_86%,transparent)] p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--accent)]">What is included</p>
            <div className="mt-4 grid gap-3">
              {service.deliverables.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-[var(--ink)]">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.8rem] border hairline bg-[color-mix(in_srgb,var(--card)_86%,transparent)] p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--accent)]">Stack and payment</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.stack.map((item) => (
                <span key={item} className="rounded-full border hairline px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-[1.4rem] border hairline bg-[var(--card)] p-4">
              <p className="m-0 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">Pricing starting point</p>
              <strong className="mt-2 block text-2xl text-[var(--ink)]">{service.pricing.from}</strong>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Advance: {service.pricing.advance}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{service.pricing.note}</p>
            </div>
            <Link className="magnetic mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-black text-white no-underline" href={`/contact?service=${service.key}`}>
              Request quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
