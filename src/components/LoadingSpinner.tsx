interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Loading data...' }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-card backdrop-blur">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-ember" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
