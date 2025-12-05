export const dynamic = "force-dynamic";

import { HospitalCard } from "@/components/cards/HospitalCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Hospital, PaginatedResponse } from "@/types";

const cities = ["All", "San Francisco", "Seattle", "Austin", "Chicago", "Denver"];
const specs = [
  "All",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "Emergency Care",
];

type HospitalSearchParams = {
  city?: string;
  specialization?: string;
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
};

const toStringParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

import { api } from "@/lib/api";

async function loadHospitals(searchParams: HospitalSearchParams) {
  try {
    // Only send parameters that the backend currently supports
    const apiParams: Record<string, string> = {};
    if (searchParams.city && searchParams.city !== "All") {
      apiParams.city = searchParams.city;
    }
    if (searchParams.specialization && searchParams.specialization !== "All") {
      apiParams.specialization = searchParams.specialization;
    }
    if (searchParams.order) {
      apiParams.sortBy = "rating"; // Currently only sorting by rating is supported in UI
      apiParams.order = searchParams.order;
    }
    
    const res = await api.get("/hospitals", { params: apiParams });
    return {
      data: res.data.data,
      meta: { page: 1, limit: 100, total: res.data.data.length, totalPages: 1 },
    };
  } catch (error) {
    console.error("Failed to load hospitals", error);
    return {
      data: [] as Hospital[],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  }
}

export default async function HospitalsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const searchParams = await searchParamsPromise;
  const params: HospitalSearchParams = {
    city: toStringParam(searchParams?.city),
    specialization: toStringParam(searchParams?.specialization),
    order: (toStringParam(searchParams?.order) as "asc" | "desc") ?? "desc",
    page: toStringParam(searchParams?.page),
    limit: toStringParam(searchParams?.limit),
  };

  const { data, meta } = await loadHospitals(params);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <SectionHeader
          eyebrow="Explore"
          title="Hospitals Nearby"
          description="Every hospital is verified for insurance, accreditation, and emergency readiness."
        />
        <form className="mt-6 grid gap-4 md:grid-cols-3" method="GET">
          <label className="text-sm text-slate-500">
            City
            <select
              name="city"
              defaultValue={params.city ?? "All"}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-500">
            Specialization
            <select
              name="specialization"
              defaultValue={params.specialization ?? "All"}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {specs.map((spec) => (
                <option key={spec}>{spec}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-500">
            Order
            <select
              name="order"
              defaultValue={params.order}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="desc">Highest rating</option>
              <option value="asc">Lowest rating</option>
            </select>
          </label>
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
          title="Highlighted hospitals"
          description={
            meta.total
              ? `Showing ${data.length} of ${meta.total} hospitals`
              : "No hospitals match your filters yet"
          }
        />
        {data.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Adjust filters above to discover more hospitals.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Hospital</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((hospital: Hospital) => (
                  <tr key={hospital.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                          {hospital.images && hospital.images.length > 0 ? (
                            <img
                              src={hospital.images[0]}
                              alt={hospital.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                              {hospital.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-slate-900">{hospital.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{hospital.city}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={hospital.address}>
                      {hospital.address}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{hospital.rating.toFixed(1)}</span>
                        <span className="text-amber-400">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/hospitals/${hospital.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-center text-xs text-slate-400">
          Use filters to narrow down by city, specialization, or rating.
        </p>
      </section>
    </div>
  );
}
