import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { Book, BooksQueryParams, deleteBook, getBooks, getErrorMessage, PaginationMeta } from '../api';

interface FilterState {
  title: string;
  year: string;
  language: string;
}

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 6,
  total: 0,
  totalPages: 1,
};

function parsePositiveNumber(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function BooksPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [filters, setFilters] = useState<FilterState>({
    title: searchParams.get('title') ?? '',
    year: searchParams.get('year') ?? '',
    language: searchParams.get('language') ?? '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo<BooksQueryParams>(
    () => ({
      title: searchParams.get('title') ?? '',
      year: searchParams.get('year') ?? '',
      language: searchParams.get('language') ?? '',
      sortBy: searchParams.get('sortBy') === 'year' ? 'year' : 'title',
      sortOrder: searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc',
      page: parsePositiveNumber(searchParams.get('page'), 1),
      limit: parsePositiveNumber(searchParams.get('limit'), 6),
    }),
    [searchParams],
  );

  useEffect(() => {
    setFilters({
      title: query.title ?? '',
      year: query.year ?? '',
      language: query.language ?? '',
    });
  }, [query.language, query.title, query.year]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoading(true);
      setError(null);

      try {
        const response = await getBooks(query, controller.signal);
        setBooks(response.items);
        setMeta(response.meta);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        setError(getErrorMessage(loadError));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => controller.abort();
  }, [query, refreshKey]);

  function updateSearchParams(next: Partial<Record<string, string>>) {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSearchParams({
      title: filters.title.trim(),
      year: filters.year.trim(),
      language: filters.language.trim(),
      page: '1',
    });
  }

  function handlePageChange(page: number) {
    updateSearchParams({ page: String(page) });
  }

  function handleLimitChange(limit: string) {
    updateSearchParams({ limit, page: '1' });
  }

  function handleSortChange(sortBy: string, sortOrder: string) {
    updateSearchParams({
      sortBy,
      sortOrder,
      page: '1',
    });
  }

  async function handleDelete(bookId: number) {
    const confirmed = window.confirm('Delete this book?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(bookId);
      await deleteBook(bookId);

      if (books.length === 1 && meta.page > 1) {
        updateSearchParams({ page: String(meta.page - 1) });
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Catalog view</p>
          <h2
            className="mt-3 text-3xl font-semibold text-slate-900"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
          >
            Explore the library collection
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Search by title, publication year and language, then sort the result set and browse page by page.
          </p>
        </div>

        <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-card">
          <div className="flex items-center gap-3 text-amber-900">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-700" />
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">Quick stats</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Books</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{meta.total}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Page</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{meta.page}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Limit</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{meta.limit}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleFilterSubmit} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_0.9fr_0.9fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              type="text"
              value={filters.title}
              onChange={(event) => setFilters((current) => ({ ...current, title: event.target.value }))}
              placeholder="Search by title"
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Year</span>
            <input
              type="number"
              min="0"
              value={filters.year}
              onChange={(event) => setFilters((current) => ({ ...current, year: event.target.value }))}
              placeholder="2024"
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Language</span>
            <input
              type="text"
              value={filters.language}
              onChange={(event) => setFilters((current) => ({ ...current, language: event.target.value }))}
              placeholder="English"
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Sort by</span>
            <select
              value={query.sortBy}
              onChange={(event) => handleSortChange(event.target.value, query.sortOrder ?? 'asc')}
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Order</span>
            <select
              value={query.sortOrder}
              onChange={(event) => handleSortChange(query.sortBy ?? 'title', event.target.value)}
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Limit</span>
            <select
              value={String(query.limit)}
              onChange={(event) => handleLimitChange(event.target.value)}
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            >
              {[6, 9, 12, 18].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({ title: '', year: '', language: '' });
              setSearchParams({ page: '1', limit: String(query.limit), sortBy: query.sortBy ?? 'title', sortOrder: query.sortOrder ?? 'asc' });
            }}
            className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate('/books/new')}
            className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Add book
          </button>
        </div>
      </form>

      {loading ? <LoadingSpinner label="Loading books..." /> : null}
      {!loading && error ? <ErrorState title="Books request failed" message={error} onRetry={() => setRefreshKey((current) => current + 1)} /> : null}

      {!loading && !error && books.length === 0 ? (
        <EmptyState
          title="No books found"
          description="Try different filters or add the first book to the collection."
        />
      ) : null}

      {!loading && !error && books.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} deleting={deletingId === book.id} />
            ))}
          </div>

          <Pagination meta={meta} onPageChange={handlePageChange} />
        </>
      ) : null}
    </section>
  );
}
