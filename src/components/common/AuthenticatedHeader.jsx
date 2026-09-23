import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/auth";

export default function AuthenticatedHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Campus user";

  const navItems = [
    { label: "Marketplace", to: "/marketplace", available: true },
    { label: "My Products", to: "/marketplace/my-products", available: true },
    { label: "Profile", to: "#", available: false },
  ];

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-4">
          <Link
            to="/marketplace"
            className="flex shrink-0 items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-black text-white shadow-sm shadow-emerald-900/15">
              C
            </span>
            <span>
              <span className="block text-base font-black tracking-tight text-slate-950 sm:text-lg">
                Campus Marketplace
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-slate-500">
                YOUR CAMPUS COMMUNITY
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-right lg:block">
              <p className="max-w-40 truncate text-sm font-bold text-slate-800">
                {displayName}
              </p>
              <p className="max-w-48 truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-marketplace-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-marketplace-menu"
            className="border-t border-slate-100 py-3 md:hidden"
          >
            <nav
              className="grid gap-1"
              aria-label="Mobile marketplace navigation"
            >
              {navItems.map((item) =>
                item.available ? (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-3 text-sm font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <span
                    key={item.label}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-400"
                  >
                    {item.label}{" "}
                    <span className="font-normal">(coming soon)</span>
                  </span>
                ),
              )}
            </nav>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 px-3 pt-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
