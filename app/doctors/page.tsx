export const dynamic = "force-dynamic";

import { DoctorCard } from "@/components/cards/DoctorCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Doctor, PaginatedResponse } from "@/types";

const specializations = [
  "All",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "ENT",
  "General Medicine",
  "Emergency Care",
];

const sortOptions = [
  { label: "Rating", value: "rating" },
  { label: "Experience", value: "experience" },
];

type DoctorsSearchParams = {
  specialization?: string;
  city?: string;
  sortBy?: "rating" | "experience";
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
};

const toStringParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

import { api } from "@/lib/api";

async function loadDoctors(searchParams: DoctorsSearchParams) {
  try {
    // Only send parameters that the backend currently supports
    const apiParams: Record<string, string> = {};
    if (searchParams.city) {
      apiParams.city = searchParams.city;
    }
    if (searchParams.specialization && searchParams.specialization !== "All") {
      apiParams.specialization = searchParams.specialization;
    }
    if (searchParams.sortBy) {
      apiParams.sortBy = searchParams.sortBy;
    }
    if (searchParams.order) {
      apiParams.order = searchParams.order;
    }
    
    const res = await api.get("/doctors", { params: apiParams });
    
    return {
      data: res.data.data,
      meta: { page: 1, limit: 100, total: res.data.data.length, totalPages: 1 },
    };
  } catch (error) {
    console.error("Failed to load doctors", error);
    return {
      data: [] as Doctor[],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  }
}

export default async function DoctorsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await searchParamsPromise;
  const params: DoctorsSearchParams = {
    specialization: toStringParam(searchParams?.specialization),
    city: toStringParam(searchParams?.city),
    sortBy:
      (toStringParam(searchParams?.sortBy) as DoctorsSearchParams["sortBy"]) ??
      "rating",
    order:
      (toStringParam(searchParams?.order) as DoctorsSearchParams["order"]) ??
      "desc",
    page: toStringParam(searchParams?.page),
    limit: toStringParam(searchParams?.limit),
  };

  const { data, meta } = await loadDoctors(params);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <SectionHeader
          eyebrow="Search"
          title="Find Doctors"
          description="Compare experience, ratings, and availability before you book."
        />
        <form
          className="mt-6 grid gap-4 md:grid-cols-[1fr,1fr,1fr]"
          method="GET"
        >
          <label className="text-sm text-slate-500">
            Specialization
            <select
              name="specialization"
              defaultValue={params.specialization ?? "All"}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            >
              {specializations.map((spec) => (
                <option key={spec}>{spec}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-500">
            City
            <input
              name="city"
              defaultValue={params.city ?? ""}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
              placeholder="City or ZIP"
            />
          </label>
          <label className="text-sm text-slate-500">
            Sort by
            <select
              name="sortBy"
              defaultValue={params.sortBy}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="order" value={params.order ?? "desc"} />
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 md:w-auto"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Results"
          title="Available doctors"
          description={
            meta.total
              ? `Showing ${data.length} of ${meta.total} doctors`
              : "No doctors match the selected filters yet"
          }
        />
        {data.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Try adjusting your filters to see more results.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Specialization</th>
                  <th className="px-6 py-4 font-semibold">Hospital</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((doctor: Doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={doctor.image || "/doctor-placeholder.png"} 
                          alt={doctor.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-900">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doctor.specializations.map((s) => s.name).join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      {doctor.hospitals.map((h) => h.name).join(", ")}
                    </td>
                    <td className="px-6 py-4">{doctor.city}</td>
                    <td className="px-6 py-4">{doctor.yearsOfExperience} years</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{doctor.rating.toFixed(1)}</span>
                        <span className="text-amber-400">★</span>
                        {doctor.reviewCount !== undefined && (
                          <span className="text-xs text-slate-400">({doctor.reviewCount} reviews)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/doctors/${doctor.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-center text-xs text-slate-400">
          Use filters above to refine by specialization, city, or ratings.
        </p>
      </section>
    </div>
  );
}
