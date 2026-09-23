import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminUsers } from "../../services/admin";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 20a4 4 0 0 0-8 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-5a3 3 0 1 0 0-6"
      />
    </svg>
  );
}

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
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminUsers();

        setUsers(data);
      } catch (err) {
        setError(err.message || "Unable to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.department?.toLowerCase().includes(query) ||
        user.student_id?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const totalUsers = users.length;

  const regularUsers = users.filter((user) => user.role === "user").length;

  const adminUsers = users.filter((user) => user.role === "admin").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Page heading */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Administration
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View and manage registered members of the campus marketplace.
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Total users
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "—" : totalUsers}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Registered marketplace accounts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Members
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "—" : regularUsers}
          </p>

          <p className="mt-1 text-xs text-slate-400">Regular campus accounts</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Administrators
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "—" : adminUsers}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Accounts with admin access
          </p>
        </div>
      </section>

      {/* Users list */}
      <section className="mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Registered users
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Search members by name, email, department, or student ID.
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="m20 20-4-4" />
                  </svg>
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <UserIcon />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-900">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {search
                  ? "Try a different search term."
                  : "There are no registered users yet."}
              </p>
            </div>
          )}

          {/* Desktop table */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      User
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Department
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Student ID
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Role
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                            {getInitials(user.full_name, user.email)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {user.full_name || "Unnamed user"}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.department || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.student_id || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            user.role === "admin"
                              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"
                              : "rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  className="cursor-pointer p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                      {getInitials(user.full_name, user.email)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {user.full_name || "Unnamed user"}
                        </p>

                        <span
                          className={
                            user.role === "admin"
                              ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700"
                              : "rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {user.email || "No email"}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400">Department</p>
                          <p className="mt-1 font-medium text-slate-700">
                            {user.department || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">Student ID</p>
                          <p className="mt-1 font-medium text-slate-700">
                            {user.student_id || "—"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-[11px] text-slate-400">
                        Joined {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
