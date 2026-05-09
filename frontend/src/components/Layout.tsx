import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-600" />
                Library Information System
              </div>
              <div>
                <h1
                  className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
                >
                  Book collection dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Browse, filter and manage books, then jump into detailed records with ratings and reviews.
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-moss text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`
                }
              >
                Books
              </NavLink>
              <NavLink
                to="/books/new"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-ember text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`
                }
              >
                <span className="text-base leading-none">+</span>
                Add book
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="page-enter flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
