import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { getMyProducts } from "../../services/products";
import { getMyProfile, updateMyProfile } from "../../services/profile";

function ProfileIcon({ type, className = "h-5 w-5" }) {
  const paths = {
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
    phone:
      "M7 4h2l1 3-2 1.5a11 11 0 0 0 7.5 7.5L17 14l3 1v2a2 2 0 0 1-2 2C10.268 19 5 13.732 5 6a2 2 0 0 1 2-2Z",
    building:
      "M4 21h16M6 21V5l6-2 6 2v16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1",
    id: "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 4h6M9 12h6M9 16h4",
    calendar:
      "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    edit: "M13.5 6.5 17.5 10.5M5 19l3.5-.8L18.8 7.9a2.1 2.1 0 0 0-3-3L5.5 15.2 5 19Z",
    close: "M6 6l12 12M18 6 6 18",
    check: "m5 12 4 4L19 6",
    email: "M4 6h16v12H4V6Zm0 1 8 6 8-6",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CM"
  );
}

function formatMemberSince(date) {
  if (!date) return "Campus member";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatError(error) {
  if (!error) return "Something went wrong.";

  if (error.code === "42501") {
    return "You do not have permission to update this profile.";
  }

  return error.message || "Something went wrong. Please try again.";
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
        <ProfileIcon type={icon} className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function ActivityCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function EditProfileModal({ profile, saving, error, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    department: profile?.department || "",
    studentId: profile?.student_id || "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      studentId: form.studentId.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Account settings
            </p>

            <h2
              id="edit-profile-title"
              className="mt-1 text-xl font-black tracking-tight text-slate-900"
            >
              Edit your profile
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep your marketplace information up to date.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <ProfileIcon type="close" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-6 sm:px-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Your login email cannot be changed here.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="e.g. 08012345678"
                />
              </div>

              <div>
                <label
                  htmlFor="studentId"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Student ID
                </label>

                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Your student ID"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Department
              </label>

              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Your department"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <ProfileIcon type="check" className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  async function loadProfile() {
    if (!user?.id) return;

    setLoading(true);
    setPageError("");

    try {
      const [profileData, productData] = await Promise.all([
        getMyProfile(user.id),
        getMyProducts(user.id),
      ]);

      setProfile(profileData);
      setProducts(productData);
    } catch (error) {
      setPageError(formatError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const stats = useMemo(() => {
    const active = products.filter(
      (product) => product.status === "active",
    ).length;

    const sold = products.filter((product) => product.status === "sold").length;

    return {
      active,
      sold,
      total: products.length,
    };
  }, [products]);

  async function handleSave(changes) {
    if (!user?.id) return;

    setSaving(true);
    setEditError("");

    try {
      const updatedProfile = await updateMyProfile({
        userId: user.id,
        ...changes,
      });

      setProfile(updatedProfile);
      setEditing(false);
      setSuccessMessage("Your profile has been updated successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3500);
    } catch (error) {
      setEditError(formatError(error));
    } finally {
      setSaving(false);
    }
  }

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Campus member";

  const initials = getInitials(displayName);

  if (loading) {
    return (
      <div className="min-h-full bg-[#f6f8f7] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-7 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

          <div className="mt-8 h-56 rounded-2xl bg-white" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="h-28 rounded-2xl bg-white" />
            <div className="h-28 rounded-2xl bg-white" />
            <div className="h-28 rounded-2xl bg-white" />
          </div>

          <div className="mt-6 h-80 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f6f8f7]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            Account
          </p>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Your profile
          </h1>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Manage your campus information and keep your marketplace account up
            to date.
          </p>
        </div>

        {pageError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {pageError}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700">
              <ProfileIcon type="check" className="h-4 w-4" />
            </span>

            {successMessage}
          </div>
        )}

        {/* Profile hero */}
        <section className="relative mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-emerald-700 sm:h-28" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-11 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-xl font-black text-emerald-800 shadow-sm sm:h-[88px] sm:w-[88px]">
                  {initials}
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {displayName}
                  </h2>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {profile?.email || user?.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditError("");
                  setEditing(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <ProfileIcon type="edit" className="h-4 w-4" />
                Edit profile
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Campus member
              </span>

              {profile?.department && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {profile.department}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <ProfileIcon type="calendar" className="h-3.5 w-3.5" />
                Member since {formatMemberSince(profile?.created_at)}
              </span>
            </div>
          </div>
        </section>

        {/* Marketplace activity */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-base font-black text-slate-900">
              Marketplace activity
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              A quick look at your listings.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ActivityCard
              label="Active listings"
              value={stats.active}
              description="Currently visible"
            />

            <ActivityCard
              label="Sold items"
              value={stats.sold}
              description="Successfully sold"
            />

            <ActivityCard
              label="Total listings"
              value={stats.total}
              description="All your listings"
            />
          </div>
        </section>

        {/* Personal information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Personal information
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Information connected to your campus marketplace account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditError("");
                setEditing(true);
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              <ProfileIcon type="edit" className="h-4 w-4" />
              Update details
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon="user"
              label="Full name"
              value={profile?.full_name}
            />

            <InfoItem
              icon="email"
              label="Email"
              value={profile?.email || user?.email}
            />

            <InfoItem
              icon="phone"
              label="Phone number"
              value={profile?.phone}
            />

            <InfoItem
              icon="building"
              label="Department"
              value={profile?.department}
            />

            <InfoItem
              icon="id"
              label="Student ID"
              value={profile?.student_id}
            />

            <InfoItem
              icon="user"
              label="Account type"
              value={
                profile?.role === "admin" ? "Administrator" : "Campus member"
              }
            />
          </div>
        </section>
      </div>

      {editing && (
        <EditProfileModal
          profile={profile}
          saving={saving}
          error={editError}
          onClose={() => {
            if (!saving) {
              setEditing(false);
              setEditError("");
            }
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
