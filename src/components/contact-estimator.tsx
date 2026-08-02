"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateEstimate, estimateOptions, type EstimateFormValues } from "@/lib/estimate";
import { socialLinks } from "@/data/portfolio";

const initialForm: EstimateFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "business",
  timeline: "standard",
  budget: "20to40",
  addOns: [],
  goals: ""
};

export function ContactEstimator({ compact = false, initialProjectType }: { compact?: boolean; initialProjectType?: string }) {
  const [form, setForm] = useState<EstimateFormValues>(() => ({
    ...initialForm,
    projectType: initialProjectType ?? initialForm.projectType
  }));
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");
  const estimate = useMemo(
    () =>
      calculateEstimate({
        projectType: form.projectType,
        timeline: form.timeline,
        budget: form.budget,
        addOns: form.addOns
      }),
    [form.addOns, form.budget, form.projectType, form.timeline]
  );

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setNotice("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimate
        })
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Could not send the project brief right now.");
      }

      setStatus("sent");
      setNotice(payload.message ?? "Project brief received.");
      setForm({ ...initialForm, projectType: initialProjectType ?? initialForm.projectType });
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Could not send the project brief right now.");
    }
  }

  function toggleAddOn(value: string) {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.includes(value) ? current.addOns.filter((item) => item !== value) : [...current.addOns, value]
    }));
  }

  return (
    <div className={cn("grid gap-6", compact ? "lg:grid-cols-[0.95fr_1.05fr]" : "lg:grid-cols-[1.05fr_0.95fr]")}>
      <div className="glass rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Quotation preview</p>
        <h3 className="mode-font mt-3 text-3xl font-black sm:text-4xl">A starting range, not a fixed promise.</h3>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
          The preview shows a working budget range, the expected advance, and the scope assumptions behind it. Final pricing still adjusts to pages, integrations, and turnaround.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <EstimateCard label="Recommended scope" value={estimate.baseLabel} />
          <EstimateCard label="Starting estimate" value={formatInr(estimate.total)} highlight />
          <EstimateCard label="Timeline" value={estimate.timelineLabel} />
          <EstimateCard label="Advance to begin" value={formatInr(estimate.advance)} />
        </div>

        <div className="mt-6 rounded-[1.6rem] border hairline bg-[color-mix(in_srgb,var(--card)_80%,transparent)] p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="m-0 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">Quote math</p>
            <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--muted)]">40% advance</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b hairline pb-3 text-sm">
            <span className="text-[var(--muted)]">Base project</span>
            <strong>{formatInr(estimate.baseCost)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4 border-b hairline py-3 text-sm">
            <span className="text-[var(--muted)]">Selected add-ons</span>
            <strong>{formatInr(estimate.addOnCost)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4 border-b hairline py-3 text-sm">
            <span className="text-[var(--muted)]">Timeline adjustment</span>
            <strong>{formatInr(estimate.timelineAdjustment)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <span className="text-sm font-black text-[var(--ink)]">Balance after advance</span>
            <strong className="text-lg">{formatInr(estimate.finalPayment)}</strong>
          </div>
        </div>

        <p className="mt-4 text-xs font-bold leading-5 text-[var(--muted)]">
          Advance is kept at 40% for kickoff. Add-ons stay visible so the client can see what changes the budget.
        </p>

        {!compact && (
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-black text-white no-underline" href={socialLinks.email}>
              Email directly <Mail size={16} />
            </a>
            <a className="magnetic inline-flex min-h-12 items-center justify-center gap-2 rounded-full border hairline bg-[var(--card)] px-6 text-sm font-black text-[var(--ink)] no-underline" href={socialLinks.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp quote <Phone size={16} />
            </a>
          </div>
        )}
      </div>

      <form className="glass rounded-[2rem] p-6 sm:p-8" onSubmit={submitContact}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Project brief</p>
            <h3 className="mode-font mt-3 text-3xl font-black sm:text-4xl">Share the project and I will follow up with a tailored quotation.</h3>
          </div>
          {compact ? (
            <Link className="hidden rounded-full border hairline px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--ink)] no-underline sm:inline-flex" href="/contact">
              Full inquiry page <ArrowRight size={14} />
            </Link>
          ) : null}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Input value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="Full name" />
          <Input value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} placeholder="Work email" type="email" />
          <Input value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} placeholder="Phone or WhatsApp" />
          <Input value={form.company} onChange={(value) => setForm((current) => ({ ...current, company: value }))} placeholder="Brand or company" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <Select value={form.projectType} onChange={(value) => setForm((current) => ({ ...current, projectType: value }))} options={estimateOptions.projectTypes} />
          <Select value={form.timeline} onChange={(value) => setForm((current) => ({ ...current, timeline: value }))} options={estimateOptions.timelines} />
          <Select value={form.budget} onChange={(value) => setForm((current) => ({ ...current, budget: value }))} options={estimateOptions.budgets} />
        </div>

        <div className="mt-5">
          <p className="m-0 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">Add-ons</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {estimateOptions.addOns.map((item) => {
              const selected = form.addOns.includes(item.value);
              return (
                <button
                  key={item.value}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-bold transition",
                    selected
                      ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--ink)]"
                  )}
                  type="button"
                  onClick={() => toggleAddOn(item.value)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          className="mt-5 min-h-36 w-full rounded-[1.4rem] border hairline bg-[var(--card)] p-4 outline-none focus:border-[var(--accent)]"
          placeholder="Tell me about the project goals, pages or flows you need, launch timing, and anything clients should understand quickly."
          value={form.goals}
          onChange={(event) => setForm((current) => ({ ...current, goals: event.target.value }))}
          minLength={20}
          required
        />
        <p className="mt-2 text-xs font-bold leading-5 text-[var(--muted)]">This helps me turn the estimate into a proper client-ready quotation.</p>

        <button
          className="magnetic mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-black text-white disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={status === "sending"}
        >
          Send project brief <BriefcaseBusiness size={17} />
        </button>

        {notice ? (
          <p className={cn("mt-4 rounded-2xl border px-4 py-3 text-sm font-bold", status === "sent" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-amber-400/40 bg-amber-400/10 text-amber-300")}>
            {notice}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <input
      className="min-h-12 rounded-[1.2rem] border hairline bg-[var(--card)] px-4 outline-none focus:border-[var(--accent)]"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      required
    />
  );
}

function Select({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        className="min-h-14 w-full appearance-none rounded-[1.2rem] border hairline bg-[var(--card)] px-4 pr-11 text-[0.95rem] font-medium leading-none text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function EstimateCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-[1.4rem] border p-4", highlight ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" : "border-[var(--line)] bg-[var(--card)]")}>
      <p className="m-0 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted)]">{label}</p>
      <strong className="mt-2 block text-lg text-[var(--ink)]">{value}</strong>
    </div>
  );
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
