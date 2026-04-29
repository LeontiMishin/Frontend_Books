interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-amber-300 bg-amber-50/70 p-8 text-center shadow-card">
      <h2 className="text-xl font-semibold text-amber-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-amber-900">{description}</p>
    </div>
  );
}
