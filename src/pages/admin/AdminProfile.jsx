import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminProfile";

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0"
      />
    </svg>
  );
}

function MailIcon() {
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
        d="M4 6.5h16v11H4v-11Zm0 0 8 6 8-6"
      />
    </svg>
  );
}

function PhoneIcon() {
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
        d="M6.5 4.5h2l1.2 4-2 1.5a15.7 15.7 0 0 0 6.3 6.3l1.5-2 4 1.2v2a1.5 1.5 0 0 1-1.5 1.5C10.8 19 5 13.2 5 6a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function BuildingIcon() {
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
        d="M4 20h16M6 20V6h8v14M14 10h4v10M9 9h2m-2 3h2m-2 3h2m7-2h.01"
      />
    </svg>
  );
}

function ShieldIcon() {
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
        d="M12 3.5 19 6v5.5c0 4.4-2.8 7.5-7 9-4.2-1.5-7-4.6-7-9V6l7-2.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.2 12 1.8 1.8 3.8-4"
      />
    </svg>
  );
}

function CalendarIcon() {
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
        d="M6 4v3m12-3v3M4.5 9.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6 5Z"
      />
    </svg>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) {
    return "A";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function AdminProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    loadProfile();
  }, [user?.id]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProfile(user.id);

      setProfile(data);

      setForm({
        fullName: data.full_name ?? "",
        phone: data.phone ?? "",
        department: data.department ?? "",
      });
    } catch (err) {
      console.error("Failed to load admin profile:", err);

      setError(
        err?.message || "Unable to load your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCancel() {
    if (!profile) {
      return;
    }

    setForm({
      fullName: profile.full_name ?? "",
      phone: profile.phone ?? "",
      department: profile.department ?? "",
    });

    setEditing(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedProfile = await updateAdminProfile({
        userId: user.id,
        fullName: form.fullName,
        phone: form.phone,
        department: form.department,
      });

      setProfile(updatedProfile);

      setForm({
        fullName: updatedProfile.full_name ?? "",
        phone: updatedProfile.phone ?? "",
        department: updatedProfile.department ?? "",
      });

      setEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update admin profile:", err);

      setError(
        err?.message || "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

            <div className="mt-8 h-52 rounded-2xl bg-white shadow-sm" />

            <div className="mt-6 h-72 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            {error || "Your profile could not be loaded."}
          </div>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.full_name);

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Manage your administrator account information.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Profile header */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 sm:h-28" />

          <div className="px-5 pb-5 sm:px-7 sm:pb-7">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "Admin"}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.full_name || "Administrator"}
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Administrator
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4 20 4.2-1 9.9-9.9a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Zm10.2-12.2 2.8 2.8"
                    />
                  </svg>
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Main information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Personal information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your administrator account details.
              </p>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="admin-full-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="admin-full-name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Email */}
                <div className="mt-5">
                  <label
                    htmlFor="admin-email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="admin-email"
                    value={profile.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Email is managed by your authentication account.
                  </p>
                </div>

                {/* Phone */}
                <div className="mt-5">
                  <label
                    htmlFor="admin-phone"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Phone number
                  </label>

                  <input
                    id="admin-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Department */}
                <div className="mt-5">
                  <label
                    htmlFor="admin-department"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Department
                  </label>

                  <input
                    id="admin-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Enter department"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Buttons */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="divide-y divide-slate-100">
                <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <ProfileIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Full name
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900">
                      {profile.full_name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <MailIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email address
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900">
                      {profile.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <PhoneIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone number
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <BuildingIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {profile.department || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Account information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Account information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administrator access and account details.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Role */}
              <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldIcon />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Account role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Administrator
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Full access to marketplace administration features.
                  </p>
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <CalendarIcon />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Account created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              {/* Student ID */}
              {profile.student_id && (
                <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <ProfileIcon />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Student ID
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {profile.student_id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
