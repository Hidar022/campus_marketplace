import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/auth";

export default function AuthenticatedHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-bold text-emerald-700">
            Campus Marketplace
          </h1>

          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
