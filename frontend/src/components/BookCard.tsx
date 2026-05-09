import { Link } from 'react-router-dom';
import type { Book as BookItem } from '../api';

interface BookCardProps {
  book: BookItem;
  onDelete: (id: number) => void;
  deleting?: boolean;
}

export function BookCard({ book, onDelete, deleting = false }: BookCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Book #{book.id}</p>
          <h2
            className="mt-2 text-2xl font-semibold text-slate-900"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
          >
            {book.title}
          </h2>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
          Book
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Author:</span> {book.author?.name || 'Unknown author'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Year:</span> {book.year || 'Unknown'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Language:</span> {book.language || 'Unknown'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Genres:</span>{' '}
          {book.genres.length > 0 ? book.genres.map((genre) => genre.name).join(', ') : 'No genres'}
        </p>
      </div>

      <div className="mt-6 flex flex-1 items-end justify-between gap-3">
        <Link
          to={`/books/${book.id}`}
          className="rounded-full bg-moss px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          View
        </Link>

        <button
          type="button"
          onClick={() => onDelete(book.id)}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
