import { FormEvent, useState } from 'react';
import { ReviewMutationInput } from '../api';

interface ReviewFormProps {
  onSubmit: (input: ReviewMutationInput) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

const initialState: ReviewMutationInput = {
  username: '',
  rating: 5,
  comment: '',
};

export function ReviewForm({ onSubmit, submitting, error }: ReviewFormProps) {
  const [form, setForm] = useState<ReviewMutationInput>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Add review</h2>
        <p className="mt-2 text-sm text-slate-600">Share a rating from 1 to 5 and leave a short comment.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Username</span>
          <input
            type="text"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            required
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
            placeholder="reader01"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Rating</span>
          <select
            value={form.rating}
            onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Comment</span>
        <textarea
          value={form.comment}
          onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
          required
          rows={4}
          className="w-full rounded-[1.5rem] border border-amber-200 bg-amber-50/60 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
          placeholder="What stood out to you?"
        />
      </label>

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting review...' : 'Submit review'}
      </button>
    </form>
  );
}
