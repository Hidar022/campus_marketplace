import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getAdminUserById } from "../../services/admin";

function getInitials(name, email) {
  const value = name || email || "User";

  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function DetailIcon({ type }) {
  const paths = {
    email:
      "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11ZM5 7l7 5 7-5",

    phone:
      "M7 4.5 9.5 7 8 9.5c1.2 2.4 3.1 4.3 5.5 5.5L16 13.5 18.5 16c.5.5.6 1.2.3 1.8l-.7 1.4c-.3.6-1 .9-1.7.8C9.8 19 5 14.2 4 7.6c-.1-.7.2-1.4.8-1.7l1.4-.7c.6-.3 1.3-.2 1.8.3Z",

    department: "M4 20h16M6 20V7l6-3 6 3v13M9 10h1M14 10h1M9 14h1M14 14h1",

    student:
      "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11ZM8 9h8M8 13h5",

    calendar:
      "M6 4v3M18 4v3M4 9h16M5.5 6h13A1.5 1.5 0 0 1 20 7.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6Z",
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

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminUserById(id);

        setUser(data);
      } catch (err) {
        setError(err.message || "Unable to load user.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to users
        </button>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-bold text-red-800">
            Unable to load this user
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error || "The requested user could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.full_name, user.email);
  const isAdmin = user.role === "admin";

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
      >
        <span aria-hidden="true">←</span>
        Back to users
      </button>

      {/* Profile header */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="bg-emerald-700 px-5 py-7 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-emerald-800 shadow-sm">
              {initials}
            </div>

            <div className="min-w-0 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">
                  {user.full_name || "Unnamed user"}
                </h1>

                <span
                  className={
                    isAdmin
                      ? "rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                      : "rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                  }
                >
                  {isAdmin ? "Administrator" : "Member"}
                </span>
              </div>

              <p className="mt-1 text-sm text-emerald-50">
                {user.email || "No email address"}
              </p>

              <p className="mt-3 text-xs text-emerald-100">
                Joined {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Basic account summary */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Account type
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {isAdmin ? "Administrator" : "Marketplace member"}
            </p>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Department
            </p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {user.department || "Not provided"}
            </p>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Student ID
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {user.student_id || "Not provided"}
            </p>
          </div>
        </div>
      </section>

      {/* Personal information */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Personal information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Account information associated with this marketplace member.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <DetailIcon type="email" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Email
              </span>
            </div>

            <p className="mt-3 break-all text-sm font-semibold text-slate-800">
              {user.email || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <DetailIcon type="phone" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Phone
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {user.phone || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <DetailIcon type="department" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Department
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {user.department || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <DetailIcon type="student" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Student ID
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {user.student_id || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2">
            <div className="flex items-center gap-3 text-emerald-700">
              <DetailIcon type="calendar" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Account created
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </section>

      {/* Quick action */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">User account</h2>

            <p className="mt-1 text-sm text-slate-400">
              This account is currently registered in the marketplace system.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
          >
            Back to users
          </Link>
        </div>
      </section>
    </div>
  );
}
