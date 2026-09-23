import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getMyProfile } from "../../services/profile";

import { useEffect, useState } from "react";

export default function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user?.id) {
        if (mounted) {
          setProfile(null);
          setLoadingProfile(false);
        }
        return;
      }

      try {
        const data = await getMyProfile(user.id);

        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load admin profile:", error);

        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    }

    if (!authLoading) {
      loadProfile();
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, authLoading]);

  if (authLoading || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />

          <p className="text-sm font-medium text-slate-500">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/marketplace" replace />;
  }

  return <Outlet />;
}
