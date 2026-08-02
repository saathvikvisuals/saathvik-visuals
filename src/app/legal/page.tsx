import Link from "next/link";

const sections = [
  ["Terms of Service", "Engagements start from an accepted quotation, written confirmation, or advance payment. Scope changes and third-party dependencies can alter timelines and price."],
  ["Commercial Policy", "Milestones, revisions, refunds, and maintenance are governed by the active quotation and the policy document. Advance payments are generally non-refundable once work begins."],
  ["Privacy and Confidentiality", "Client information is used only for the engagement, stored securely, and not shared without consent except when required by law."],
  ["Payments and IP", "Ownership of custom deliverables transfers on final payment, and third-party tools remain under their own licenses."]
];

export default function LegalPage() {
  return (
    <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <section className="rounded-[2.4rem] border hairline bg-[var(--card)] p-7 shadow-[0_30px_90px_var(--shadow-color)] backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--accent)]">Legal</p>
        <h1 className="mode-font mt-3 text-4xl font-black sm:text-6xl">Terms, commercial policy, and privacy summary.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">This page presents the uploaded policy content in a website-friendly format, so clients can review it without opening the source document.</p>
        <div className="mt-8 grid gap-4">
          {sections.map(([title, copy]) => (
            <div key={title} className="rounded-[1.6rem] border hairline bg-[color-mix(in_srgb,var(--card)_86%,transparent)] p-5">
              <strong className="block text-lg text-[var(--ink)]">{title}</strong>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-black text-white no-underline" href="/contact">Start a project</Link>
          <Link className="rounded-full border hairline bg-[var(--card)] px-5 py-3 text-sm font-black text-[var(--ink)] no-underline" href="/">Back home</Link>
        </div>
      </section>
    </main>
  );
}
