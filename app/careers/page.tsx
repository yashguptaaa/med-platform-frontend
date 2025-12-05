import { api } from "@/lib/api";
import type { Job } from "@/types";

async function loadJobs(): Promise<Job[]> {
  try {
    const res = await api.get<{ data: Job[] }>("/jobs");
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to load jobs", error);
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await loadJobs();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Careers
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Work with us</h1>
        <p className="text-sm text-slate-500">
          Join a team accelerating access to compassionate healthcare. We offer
          remote-friendly roles, inclusive benefits, and mission-driven work.
        </p>
      </section>

      {!jobs || jobs.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          No open roles right now. Check back soon or reach out at careers@medlink.health.
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
                <p className="text-xs text-slate-500">
                  {job.location} · {job.department}
                </p>
              </div>
              <p className="text-sm text-slate-500">{job.description}</p>
              <button className="mt-auto rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-400">
                Apply now
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
