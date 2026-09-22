import AuthenticatedHeader from "../components/common/AuthenticatedHeader";
import { NavLink } from "react-router-dom";

function NavIcon({ type }) {
  const paths = {
    marketplace: "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 8h8M8 12h8M8 16h5",
    products: "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5",
    profile: "M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0",
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

const navigation = [
  { label: "Marketplace", type: "marketplace", to: "/marketplace", available: true },
  { label: "My Products", type: "products", to: "#", available: false },
  { label: "Profile", type: "profile", to: "#", available: false },
];

export default function MarketplaceLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <AuthenticatedHeader />
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-white/60 px-4 py-7 lg:block">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <nav className="mt-4 space-y-1" aria-label="Marketplace sections">
            {navigation.map((item) => item.available ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-900/5" : "text-slate-500 hover:bg-white hover:text-emerald-700"}`}
              >
                <NavIcon type={item.type} />
                {item.label}
              </NavLink>
            ) : (
              <span key={item.label} title="This area will be available in a future batch" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400">
                <NavIcon type={item.type} />
                {item.label}
              </span>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-sm font-bold text-emerald-900">Keep it local</p>
            <p className="mt-2 text-xs leading-5 text-emerald-800/70">Discover useful finds from people who share your campus.</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
