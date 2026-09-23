import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function AdminNavIcon({ type }) {
  const paths = {
    dashboard:
      "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 8h3v3H8V8Zm5 0h3v3h-3V8ZM8 13h3v3H8v-3Zm5 0h3v3h-3v-3Z",

    users:
      "M16 20a4 4 0 0 0-8 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-5a3 3 0 1 0 0-6",

    products:
      "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5",

    categories:
      "M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9ZM8 10h8M8 14h5",

    profile: "M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

const navigation = [
  {
    label: "Dashboard",
    description: "Marketplace overview",
    type: "dashboard",
    to: "/admin",
    available: true,
    end: true,
  },
  {
    label: "Users",
    description: "Manage members",
    type: "users",
    to: "/admin/users",
    available: true,
    end: true,
  },
  {
    label: "Products",
    description: "Manage listings",
    type: "products",
    to: "/admin/products",
    available: false,
  },
  {
    label: "Categories",
    description: "Manage categories",
    type: "categories",
    to: "/admin/categories",
    available: false,
  },
  {
    label: "Profile",
    description: "Admin account",
    type: "profile",
    to: "/admin/profile",
    available: false,
  },
];

export default function AdminLayout() {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Administrator";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#f6f8f7] text-slate-900">
      {/* Admin header */}
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex h-[70px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
              C
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-slate-900">
                Campus Marketplace
              </p>

              <p className="text-[11px] font-medium text-slate-400">
                Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-slate-800">{displayName}</p>

              <p className="mt-0.5 text-[10px] text-slate-400">Administrator</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
              {initials || "A"}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-100 px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Administration
            </p>

            <p className="mt-2 text-sm font-black text-slate-900">
              Control Center
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Manage the campus marketplace from one place.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-6">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Menu
            </p>

            <nav className="space-y-1" aria-label="Admin sections">
              {navigation.map((item) =>
                item.available ? (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-white text-emerald-700 shadow-sm"
                              : "bg-slate-100 text-slate-400 group-hover:text-emerald-700"
                          }`}
                        >
                          <AdminNavIcon type={item.type} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-bold ${
                              isActive ? "text-emerald-900" : "text-slate-700"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span className="mt-0.5 block text-[11px] text-slate-400">
                            {item.description}
                          </span>
                        </span>
                      </>
                    )}
                  </NavLink>
                ) : (
                  <div
                    key={item.label}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 opacity-50"
                    title="This section will be available in a future batch"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <AdminNavIcon type={item.type} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-500">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {item.description}
                      </span>
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Soon
                    </span>
                  </div>
                ),
              )}
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                  {initials || "A"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {displayName}
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-700">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
