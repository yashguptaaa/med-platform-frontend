interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {description && (
          <p className="max-w-2xl text-base text-slate-500 leading-relaxed">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
