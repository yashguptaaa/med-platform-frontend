import type { Doctor } from "@/types";
import { PrimaryButton } from "../ui/PrimaryButton";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
        <img 
          src={doctor.image || "/doctor-placeholder.png"} 
          alt={doctor.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{doctor.name}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {doctor.specializations.map((s) => s.name).join(", ")}
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-100">
          {doctor.rating.toFixed(1)}
          {doctor.reviewCount !== undefined && (
            <span className="ml-1 text-violet-400 font-normal">{doctor.reviewCount} reviewers</span>
          )}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="line-clamp-1">{doctor.hospitals.map((h) => h.name).join(", ")}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{doctor.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{doctor.yearsOfExperience}+ years experience</span>
        </div>
      </div>

      <PrimaryButton
        href={`/doctors/${doctor.id}`}
        className="mt-auto w-full"
        variant="secondary"
      >
        View profile
      </PrimaryButton>
      </div>
    </article>
  );
}

