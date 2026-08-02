import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <section className="rounded-[2.4rem] border hairline bg-[var(--card)] p-7 shadow-[0_30px_90px_var(--shadow-color)] backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Services</p>
        <h1 className="mode-font mt-3 text-4xl font-black sm:text-6xl">Services built for real businesses.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">A clearer studio-style offer map, with each service leading to a dedicated page, pricing starting points, and a simple advance structure.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link key={service.key} href={`/services/${service.key}`} className="rounded-[1.7rem] border hairline bg-[color-mix(in_srgb,var(--card)_86%,transparent)] p-5 no-underline transition hover:-translate-y-1 hover:border-[var(--accent)]">
              <div className="flex items-center justify-between gap-4">
                <strong className="text-lg text-[var(--ink)]">{service.title}</strong>
                <ArrowRight size={18} className="text-[var(--accent)]" />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.short}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                <ShieldCheck size={14} />
                {service.pricing.from} / {service.pricing.advance}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
