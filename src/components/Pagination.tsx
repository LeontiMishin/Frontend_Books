import { PaginationMeta } from '../api';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function buildVisiblePages(currentPage: number, totalPages: number): number[] {
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-card">
        Page {meta.page} of {meta.totalPages} • limit {meta.limit} • total {meta.total}
      </div>
    );
  }

  const visiblePages = buildVisiblePages(meta.page, meta.totalPages);

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-card md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{meta.page}</span> of{' '}
        <span className="font-semibold text-slate-900">{meta.totalPages}</span> • limit{' '}
        <span className="font-semibold text-slate-900">{meta.limit}</span> • total{' '}
        <span className="font-semibold text-slate-900">{meta.total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-10 min-w-10 rounded-full px-4 text-sm font-semibold transition ${
              page === meta.page ? 'bg-moss text-white' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
