export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import { Hospital } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getHospital(id: string): Promise<Hospital | null> {
  try {
    const res = await api.get<{ data: Hospital }>(`/hospitals/${id}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hospital = await getHospital(id);

  if (!hospital) {
    return {
      title: "Hospital Not Found",
    };
  }

  return {
    title: `${hospital.name} - MedLink`,
    description: `Book appointments at ${hospital.name} in ${hospital.city}. Top-rated care for ${hospital.specializations.map(s => s.name).join(", ")}.`,
  };
}

export default async function HospitalDetailsPage({ params }: Props) {
  const { id } = await params;
  const hospital = await getHospital(id);

  if (!hospital) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/hospitals"
        className="mb-6 inline-block text-sm font-medium text-slate-500 hover:text-sky-600"
      >
        ← Back to Hospitals
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                {hospital.images && hospital.images.length > 0 ? (
                  <img
                    src={hospital.images[0]}
                    alt={hospital.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-400">
                    {hospital.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{hospital.name}</h1>
                  <p className="mt-2 text-lg text-slate-600">{hospital.city}</p>
                  <p className="text-slate-500">{hospital.address}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700 self-start">
                  <span className="text-lg font-bold">{hospital.rating.toFixed(1)}</span>
                  <span className="text-sm">★ Rating</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Specializations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {hospital.specializations.map((spec) => (
                  <span
                    key={spec.id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              eyebrow="Team"
              title="Doctors at this Hospital"
              description="Expert physicians available for appointments."
            />
            <div className="mt-6">
              {hospital.doctors && hospital.doctors.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Doctor</th>
                        <th className="px-6 py-4 font-semibold">Specialization</th>
                        <th className="px-6 py-4 font-semibold">Experience</th>
                        <th className="px-6 py-4 font-semibold">Rating</th>
                        <th className="px-6 py-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hospital.doctors.map((doctor) => (
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
                            <Link
                              href={`/doctors/${doctor.id}`}
                              className="inline-flex items-center justify-center rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500">No doctors listed yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-sky-600 p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold">Book an Appointment</h3>
            <p className="mt-2 text-sky-100">
              Contact us to schedule your visit at {hospital.name}.
            </p>
            <Link
              href="/help"
              className="mt-6 block w-full rounded-full bg-white px-4 py-3 text-center font-bold text-sky-600 transition hover:bg-sky-50"
            >
              Contact Support
            </Link>
          </div>
          
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">Location</h3>
            <p className="mt-2 text-sm text-slate-500">{hospital.address}</p>
            <div className="mt-4 aspect-video w-full rounded-xl bg-slate-100 overflow-hidden">
              {hospital.googleMapLink ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={hospital.googleMapLink}
                ></iframe>
              ) : hospital.latitude && hospital.longitude ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}&hl=es;z=14&output=embed`}
                ></iframe>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  Map not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
