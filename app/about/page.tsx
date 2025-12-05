const milestones = [
  { year: "2021", detail: "Launched MedLink in 4 pilot cities." },
  { year: "2022", detail: "Partnered with 100+ hospitals and clinics." },
  { year: "2023", detail: "Introduced tele-consult scheduling nationwide." },
  { year: "2024", detail: "Reached 1M patient searches with 4.8★ rating." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          About MedLink
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Our mission is to help every patient feel confident choosing care.
        </h1>
        <p className="text-sm text-slate-500">
          We combine verified medical data, human-centered design, and
          responsive support to connect patients with the clinicians and
          hospitals that match their needs. Whether it’s a routine checkup or
          urgent specialty care, MedLink reduces friction so providers can focus
          on healing.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            How we help patients
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-500">
            <li>
              Clear filters for specialization, location, ratings, and fees.
            </li>
            <li>
              Telehealth indicators and hospital emergency readiness badges.
            </li>
            <li>
              Reminders, checklists, and human support for every appointment.
            </li>
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            How we help doctors & hospitals
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-500">
            <li>
              Digital storefronts with availability, insurance, and services.
            </li>
            <li>Patient insights to manage demand and reduce waitlists.</li>
            <li>
              Tools to highlight quality programs and tele-consult options.
            </li>
          </ul>
        </article>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Milestones</h2>
        <ol className="space-y-4 text-sm text-slate-500">
          {milestones.map((milestone) => (
            <li
              key={milestone.year}
              className="flex flex-col gap-1 rounded-2xl bg-slate-50/70 p-4 md:flex-row md:items-center md:gap-6"
            >
              <span className="text-base font-semibold text-slate-900">
                {milestone.year}
              </span>
              <span>{milestone.detail}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
