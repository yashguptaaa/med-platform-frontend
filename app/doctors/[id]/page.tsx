import { api } from "@/lib/api";
import { Doctor } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BookAppointmentButton } from "@/components/doctors/BookAppointmentButton";

interface Props {
  params: Promise<{ id: string }>;
}

async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const res = await api.get<{ data: Doctor }>(`/doctors/${id}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
    };
  }

  return {
    title: `${doctor.name} - MedLink`,
    description: `Book an appointment with ${doctor.name}, a specialist in ${doctor.specializations.map(s => s.name).join(", ")} with ${doctor.yearsOfExperience} years of experience.`,
  };
}

export default async function DoctorDetailsPage({ params }: Props) {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/doctors"
        className="mb-6 inline-block text-sm font-medium text-slate-500 hover:text-sky-600"
      >
        ← Back to Doctors
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-400">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{doctor.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctor.specializations.map((spec) => (
                      <span
                        key={spec.id}
                        className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700"
                      >
                        {spec.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-slate-600">
                    {doctor.yearsOfExperience} years of experience • {doctor.city}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-amber-700">
                  <span className="text-lg font-bold">{doctor.rating.toFixed(1)}</span>
                  <span className="text-sm">★ Rating</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              eyebrow="Affiliations"
              title="Practicing at"
              description="Visit this doctor at the following locations."
            />
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Hospital Name</th>
                    <th className="px-6 py-4 font-semibold">City</th>
                    <th className="px-6 py-4 font-semibold">Address</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctor.hospitals && doctor.hospitals.length > 0 ? (
                    doctor.hospitals.map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {hospital.name}
                        </td>
                        <td className="px-6 py-4">{hospital.city}</td>
                        <td className="px-6 py-4 text-slate-500">{hospital.address}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/hospitals/${hospital.id}`}
                            className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No hospitals listed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-sky-600 p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold">Book Appointment</h3>
            <p className="mt-2 text-sky-100">
              Schedule a consultation with {doctor.name} today.
            </p>
            <BookAppointmentButton 
              doctorId={doctor.id} 
              doctorName={doctor.name}
              hospitalId={doctor.hospitals?.[0]?.id || ""}
            />
          </div>
          
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">Availability</h3>
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
                const slot = doctor.availability?.find((s: any) => s.dayOfWeek === dayIndex);
                
                return (
                  <div key={dayIndex} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 w-24">{dayName}</span>
                    {slot ? (
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Not yet provided</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
