import { NavLink } from "react-router-dom";

import AuthenticatedHeader from "../components/common/AuthenticatedHeader";
import { useAuth } from "../hooks/useAuth";

function NavIcon({ type }) {
  const paths = {
    marketplace:
      "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 8h8M8 12h8M8 16h5",

    products:
      "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5",

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

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 1.35 5.65L19 10l-5.65 1.35L12 17l-1.35-5.65L5 10l5.65-1.35L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 16 .65 2.35L22 19l-2.35.65L19 22l-.65-2.35L16 19l2.35-.65L19 16Z"
      />
    </svg>
  );
}

const navigation = [
  {
    label: "Marketplace",
    description: "Browse listings",
    type: "marketplace",
    to: "/marketplace",
    available: true,
    end: true,
  },
  {
    label: "My Products",
    description: "Manage your listings",
    type: "products",
    to: "/marketplace/my-products",
    available: true,
    end: false,
  },
  {
    label: "Profile",
    description: "Account settings",
    type: "profile",
    to: "/marketplace/profile",
    available: true,
    end: true,
  },
];

export default function MarketplaceLayout({ children }) {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Campus member";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#f6f8f7] text-slate-900">
      {/* Global header */}
      <AuthenticatedHeader />

      {/* Application shell */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {/* Sidebar brand */}
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">
                C
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black tracking-tight text-slate-900">
                  Campus Marketplace
                </p>

                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  Your campus community
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-6">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Menu
            </p>

            <nav className="space-y-1" aria-label="Marketplace sections">
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
                          <NavIcon type={item.type} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-bold ${
                              isActive ? "text-emerald-900" : "text-slate-700"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span
                            className={`mt-0.5 block text-[11px] ${
                              isActive
                                ? "text-emerald-700/65"
                                : "text-slate-400"
                            }`}
                          >
                            {item.description}
                          </span>
                        </span>

                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                ) : (
                  <div
                    key={item.label}
                    title="This area will be available in a future batch"
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 opacity-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <NavIcon type={item.type} />
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

            {/* Small marketplace tip */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                    <SparkIcon />
                  </span>

                  <p className="text-xs font-black text-emerald-900">
                    Campus tip
                  </p>
                </div>

                <p className="mt-3 text-xs leading-5 text-emerald-900/65">
                  Clear photos and useful descriptions help your listings get
                  noticed.
                </p>
              </div>
            </div>
          </div>

          {/* Current user */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                {initials || "C"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                  Campus member
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
