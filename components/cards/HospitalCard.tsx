  import type { Hospital } from "@/types";
import { PrimaryButton } from "../ui/PrimaryButton";

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
        <img 
          src={hospital.images?.[0] || "/hospital-placeholder.png"} 
          alt={hospital.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {hospital.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{hospital.city}</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-100">
          {hospital.rating.toFixed(1)} ★
        </span>
      </div>
      
      <p className="text-sm text-slate-500 line-clamp-2">{hospital.address}</p>
      
      <div className="mt-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {hospital.specializations.slice(0, 3).map((s) => (
            <span 
              key={s.id}
              className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/50"
            >
              {s.name}
            </span>
          ))}
          {hospital.specializations.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
              +{hospital.specializations.length - 3} more
            </span>
          )}
        </div>

        <PrimaryButton
          href={`/hospitals/${hospital.id}`}
          className="w-full"
          variant="secondary"
        >
          View details
        </PrimaryButton>
      </div>
      </div>
    </article>
  );
}
