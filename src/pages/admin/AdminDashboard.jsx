import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdminDashboardStats } from "../../services/admin";
import { getRecentAdminProducts } from "../../services/adminProducts";

function DashboardIcon({ type }) {
  const paths = {
    users:
      "M16 20a4 4 0 0 0-8 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-5a3 3 0 1 0 0-6",

    products:
      "M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5",

    categories:
      "M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9ZM8 10h8M8 14h5",

    active: "M5 12.5 9.5 17 19 7",

    sold: "M5 12h14M12 5v14",

    admin: "M12 3.5 19 6v5.5c0 4.4-2.8 7.5-7 9-4.2-1.5-7-4.6-7-9V6l7-2.5Z",

    recent:
      "M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 4h6M9 12h6M9 16h4",
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

function StatCard({ title, value, description, icon, href, loading }) {
  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <DashboardIcon type={icon} />
        </div>

        {href && (
          <span className="text-xs font-semibold text-slate-400">View</span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        {loading ? (
          <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        )}

        <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "₦0";
  }

  return `₦${numericPrice.toLocaleString()}`;
}

function getStatusClasses(status) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "sold") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "removed") {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getStatusLabel(status) {
  if (status === "active") {
    return "Active";
  }

  if (status === "sold") {
    return "Sold";
  }

  if (status === "removed") {
    return "Removed";
  }

  return status || "Unknown";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    marketplaceUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    removedProducts: 0,
    totalCategories: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setError("");

      setLoadingStats(true);
      setLoadingProducts(true);

      const [dashboardStats, products] = await Promise.all([
        getAdminDashboardStats(),
        getRecentAdminProducts(5),
      ]);

      setStats(dashboardStats);
      setRecentProducts(products);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);

      setError(
        err?.message ||
          "Unable to load dashboard information. Please try again.",
      );
    } finally {
      setLoadingStats(false);
      setLoadingProducts(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Page heading */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor users, marketplace listings, and categories from one
              central workspace.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Administrator access
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800">
              Dashboard data could not be loaded.
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="w-fit rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Welcome panel */}
      <section className="mt-7 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-l-4 border-emerald-700 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-900">
                Welcome to the Campus Marketplace control center.
              </p>

              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
                Use the overview below to monitor the marketplace and quickly
                access the areas that need your attention.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loadingStats || loadingProducts}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={`h-4 w-4 ${
                  loadingStats || loadingProducts ? "animate-spin" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12a8 8 0 0 0-14.8-4M4 5v4h4M4 12a8 8 0 0 0 14.8 4M20 19v-4h-4"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Main statistics */}
      <section className="mt-8">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Marketplace overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Current marketplace statistics.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total users"
            value={stats.totalUsers}
            description={`${stats.marketplaceUsers} marketplace users`}
            icon="users"
            href="/admin/users"
            loading={loadingStats}
          />

          <StatCard
            title="Total products"
            value={stats.totalProducts}
            description={`${stats.activeProducts} currently active`}
            icon="products"
            href="/admin/products"
            loading={loadingStats}
          />

          <StatCard
            title="Categories"
            value={stats.totalCategories}
            description="Marketplace product categories"
            icon="categories"
            href="/admin/categories"
            loading={loadingStats}
          />

          <StatCard
            title="Administrators"
            value={stats.adminUsers}
            description="Accounts with admin access"
            icon="admin"
            href="/admin/users"
            loading={loadingStats}
          />
        </div>
      </section>

      {/* Product status */}
      <section className="mt-8">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Listing status
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Current state of marketplace listings.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <DashboardIcon type="active" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Active
                </p>

                <p className="mt-0.5 text-2xl font-black text-slate-950">
                  {loadingStats ? "—" : stats.activeProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                <DashboardIcon type="sold" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                  Sold
                </p>

                <p className="mt-0.5 text-2xl font-black text-slate-950">
                  {loadingStats ? "—" : stats.soldProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <DashboardIcon type="products" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                  Removed
                </p>

                <p className="mt-0.5 text-2xl font-black text-slate-950">
                  {loadingStats ? "—" : stats.removedProducts}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent products */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Recent listings
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              The latest products added to the marketplace.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="w-fit text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            View all products →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loadingProducts ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="hidden h-6 w-16 animate-pulse rounded-full bg-slate-100 sm:block" />
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="px-5 py-12 text-center sm:px-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <DashboardIcon type="recent" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No products yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Products added to the marketplace will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/admin/products/${product.id}`}
                  className="flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                      {product.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {product.profiles?.full_name || "Unknown seller"}
                        {product.categories?.name
                          ? ` • ${product.categories.name}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(product.created_at)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                        product.status,
                      )}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Management areas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Quickly access the main administration sections.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/admin/users"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <DashboardIcon type="users" />
            </div>

            <h3 className="mt-5 text-sm font-black text-slate-900">
              Manage users
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View registered members and manage marketplace accounts.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800">
              Open users →
            </span>
          </Link>

          <Link
            to="/admin/products"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <DashboardIcon type="products" />
            </div>

            <h3 className="mt-5 text-sm font-black text-slate-900">
              Manage products
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review listings and manage active, sold, or removed products.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800">
              Open products →
            </span>
          </Link>

          <Link
            to="/admin/categories"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <DashboardIcon type="categories" />
            </div>

            <h3 className="mt-5 text-sm font-black text-slate-900">
              Manage categories
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create and organize categories used across the marketplace.
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800">
              Open categories →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
