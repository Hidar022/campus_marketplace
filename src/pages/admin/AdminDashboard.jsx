const adminSections = [
  {
    title: "Users",
    description:
      "View registered campus members and manage marketplace accounts.",
    label: "Coming next",
  },
  {
    title: "Products",
    description:
      "Review marketplace listings and manage inappropriate or inactive products.",
    label: "Coming next",
  },
  {
    title: "Categories",
    description:
      "Create and organize the categories used across the marketplace.",
    label: "Coming next",
  },
];

function SectionIcon({ type }) {
  const paths = {
    users:
      "M16 20a4 4 0 0 0-8 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-5a3 3 0 1 0 0-6",
    products:
      "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5",
    categories:
      "M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9ZM8 10h8M8 14h5",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

export default function AdminDashboard() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Page heading */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage users, listings, and marketplace categories from one
              central workspace.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Administrator access
          </div>
        </div>
      </section>

      {/* Welcome panel */}
      <section className="mt-7 overflow-hidden rounded-2xl border border-emerald-100 bg-white">
        <div className="border-l-4 border-emerald-700 px-5 py-5 sm:px-6">
          <p className="text-sm font-black text-slate-900">
            Welcome to the Campus Marketplace control center.
          </p>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
            This workspace is reserved for administrators. Management tools will
            be added here step by step as the admin system is completed.
          </p>
        </div>
      </section>

      {/* Admin areas */}
      <section className="mt-8">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Management areas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            The main areas of the marketplace administration system.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminSections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <SectionIcon type={section.title.toLowerCase()} />
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {section.label}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-black text-slate-900">
                {section.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
