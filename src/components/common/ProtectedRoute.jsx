import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until Supabase finishes checking the existing session.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

          <p className="text-sm text-slate-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  // No authenticated user → send them to login.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is authenticated → allow the protected route.
  return <Outlet />;
}
