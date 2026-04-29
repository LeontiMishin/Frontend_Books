import { FormEvent } from 'react';
import type { Author, Genre, Publisher } from '../api';

export interface BookFormValues {
  title: string;
  isbn: string;
  year: string;
  pageCount: string;
  language: string;
  description: string;
  authorId: string;
  publisherId: string;
  genreIds: number[];
  fallbackGenreIds: string;
}

interface BookFormProps {
  mode: 'create' | 'edit';
  values: BookFormValues;
  authors: Author[];
  publishers: Publisher[];
  genres: Genre[];
  lookupErrors: string[];
  submitError: string | null;
  submitting: boolean;
  onChange: <K extends keyof BookFormValues>(field: K, value: BookFormValues[K]) => void;
  onToggleGenre: (genreId: number) => void;
  onSubmit: () => Promise<void>;
}

export function BookForm({
  mode,
  values,
  authors,
  publishers,
  genres,
  lookupErrors,
  submitError,
  submitting,
  onChange,
  onToggleGenre,
  onSubmit,
}: BookFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card md:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
          {mode === 'create' ? 'Create new book' : 'Edit book'}
        </p>
        <h2
          className="mt-3 text-3xl font-semibold text-slate-900"
          style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
        >
          {mode === 'create' ? 'Add a new title to the library' : 'Update the selected book'}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">ISBN</span>
          <input
            type="text"
            value={values.isbn}
            onChange={(event) => onChange('isbn', event.target.value)}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Year</span>
          <input
            type="number"
            min="0"
            value={values.year}
            onChange={(event) => onChange('year', event.target.value)}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Page count</span>
          <input
            type="number"
            min="1"
            value={values.pageCount}
            onChange={(event) => onChange('pageCount', event.target.value)}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Language</span>
          <input
            type="text"
            value={values.language}
            onChange={(event) => onChange('language', event.target.value)}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </label>

        {authors.length > 0 ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Author</span>
            <select
              value={values.authorId}
              onChange={(event) => onChange('authorId', event.target.value)}
              required
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            >
              <option value="">Select author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name || `${author.firstName || ''} ${author.lastName || ''}`.trim() || `Author #${author.id}`}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Author ID</span>
            <input
              type="number"
              min="1"
              value={values.authorId}
              onChange={(event) => onChange('authorId', event.target.value)}
              required
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>
        )}

        {publishers.length > 0 ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Publisher</span>
            <select
              value={values.publisherId}
              onChange={(event) => onChange('publisherId', event.target.value)}
              required
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            >
              <option value="">Select publisher</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Publisher ID</span>
            <input
              type="number"
              min="1"
              value={values.publisherId}
              onChange={(event) => onChange('publisherId', event.target.value)}
              required
              className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>
        )}
      </div>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Description</span>
        <textarea
          rows={5}
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          className="w-full rounded-[1.5rem] border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
        />
      </label>

      <div className="mt-6 rounded-[1.5rem] border border-amber-100 bg-amber-50/60 p-5">
        <h3 className="text-base font-semibold text-slate-900">Genres</h3>

        {genres.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {genres.map((genre) => {
              const checked = values.genreIds.includes(genre.id);
              return (
                <label
                  key={genre.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    checked
                      ? 'border-moss bg-emerald-50 text-emerald-950'
                      : 'border-amber-200 bg-white/80 text-slate-700 hover:border-amber-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleGenre(genre.id)}
                    className="h-4 w-4 rounded border-slate-300 text-moss focus:ring-moss"
                  />
                  <span className="text-sm font-medium">{genre.name}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Genre IDs</span>
            <input
              type="text"
              value={values.fallbackGenreIds}
              onChange={(event) => onChange('fallbackGenreIds', event.target.value)}
              className="w-full rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 outline-none transition focus:border-amber-400"
              placeholder="1, 2, 3"
            />
            <p className="text-xs text-slate-500">Use comma-separated IDs when genre lookup is unavailable.</p>
          </label>
        )}
      </div>

      {lookupErrors.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {lookupErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      {submitError ? <p className="mt-5 text-sm font-medium text-red-700">{submitError}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : mode === 'create' ? 'Create book' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
