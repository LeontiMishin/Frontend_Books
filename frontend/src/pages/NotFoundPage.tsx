import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">404</p>
      <h1
        className="mt-3 text-4xl font-semibold text-slate-900"
        style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
      >
        Page not found
      </h1>
      <p className="mt-3 text-sm text-slate-600">The route you opened does not exist in this frontend application.</p>
      <Link
        to="/books"
        className="mt-6 inline-flex rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Go to books
      </Link>
    </section>
  );
}
