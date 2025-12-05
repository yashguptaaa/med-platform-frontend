import { ContactForm } from "@/components/forms/ContactForm";

const faqs = [
  {
    question: "Is MedLink free for patients?",
    answer:
      "Yes. Searching, filtering, and booking through MedLink is completely free for patients.",
  },
  {
    question: "How are doctors verified?",
    answer:
      "We validate active licenses, years of experience, and patient satisfaction before listing a clinician.",
  },
  {
    question: "Do you support tele-consultation?",
    answer:
      "Many providers offer video visits. Look for the telehealth badge on doctor and hospital profiles.",
  },
  {
    question: "How long does booking confirmation take?",
    answer:
      "Most appointments confirm instantly. Complex procedures may take up to 2 business hours.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Help & contact
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          We’re here to support your care journey.
        </h1>
        <p className="text-sm text-slate-500">
          Reach out with product questions, partnership ideas, or feedback. We
          typically respond within one business day.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Contact details
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li>Email: hello@medlink.health</li>
              <li>Phone: +1 (415) 555-0189</li>
              <li>Address: 500 Market Street, Suite 1200, San Francisco, CA</li>
            </ul>
          </div>
          <ContactForm />
        </section>
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-slate-900"
              >
                <summary>{faq.question}</summary>
                <p className="mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
