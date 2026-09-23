import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminProducts,
  updateAdminProductStatus,
} from "../../services/adminProducts";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All listings",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "sold",
    label: "Sold",
  },
  {
    value: "removed",
    label: "Removed",
  },
];

function formatPrice(price) {
  if (price == null) return "—";

  return `₦${Number(price).toLocaleString()}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusClasses(status) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "sold") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-red-50 text-red-700";
}

function getStatusLabel(status) {
  if (status === "active") return "Active";
  if (status === "sold") return "Sold";
  if (status === "removed") return "Removed";

  return status;
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

function ProductIcon() {
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
        d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11ZM8 9h8M8 13h5"
      />
    </svg>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminProducts();

        setProducts(data);
      } catch (err) {
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const seller = product.profiles;

      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.categories?.name?.toLowerCase().includes(query) ||
        seller?.full_name?.toLowerCase().includes(query) ||
        seller?.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((product) => product.status === "active").length,
      sold: products.filter((product) => product.status === "sold").length,
      removed: products.filter((product) => product.status === "removed")
        .length,
    };
  }, [products]);

  async function handleStatusChange(productId, status) {
    try {
      setActionId(productId);
      setError("");

      const updatedProduct = await updateAdminProductStatus({
        productId,
        status,
      });

      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? updatedProduct : product,
        ),
      );
    } catch (err) {
      setError(err.message || "Unable to update listing.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Page heading */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Administration
        </p>

        <div className="mt-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review marketplace listings and manage their status.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Total listings
          </p>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "—" : stats.total}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            All marketplace listings
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Active
          </p>

          <p className="mt-3 text-2xl font-black text-emerald-700">
            {loading ? "—" : stats.active}
          </p>

          <p className="mt-1 text-xs text-slate-400">Currently visible</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Sold
          </p>

          <p className="mt-3 text-2xl font-black text-blue-700">
            {loading ? "—" : stats.sold}
          </p>

          <p className="mt-1 text-xs text-slate-400">Completed listings</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Removed
          </p>

          <p className="mt-3 text-2xl font-black text-red-700">
            {loading ? "—" : stats.removed}
          </p>

          <p className="mt-1 text-xs text-slate-400">Hidden from marketplace</p>
        </div>
      </section>

      {/* Products workspace */}
      <section className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Marketplace listings
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Search and filter listings across the marketplace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative sm:w-72">
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
                    placeholder="Search listings..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <ProductIcon />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-900">
                No listings found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "There are no marketplace listings yet."}
              </p>
            </div>
          )}

          {/* Desktop table */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Product
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Seller
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Price
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Listed
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const seller = product.profiles;
                    const category = product.categories;
                    const busy = actionId === product.id;

                    return (
                      <tr
                        key={product.id}
                        onClick={() =>
                          navigate(`/admin/products/${product.id}`)
                        }
                        className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <ProductIcon />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {product.name}
                              </p>

                              <p className="truncate text-xs capitalize text-slate-400">
                                {product.condition || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
                              {getInitials(seller?.full_name, seller?.email)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-800">
                                {seller?.full_name || "Unknown seller"}
                              </p>

                              <p className="truncate text-[10px] text-slate-400">
                                {seller?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {category?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-slate-800">
                          {formatPrice(product.price)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                              product.status,
                            )}`}
                          >
                            {getStatusLabel(product.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(product.created_at)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <select
                            value={product.status}
                            disabled={busy}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) =>
                              handleStatusChange(product.id, event.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                            <option value="removed">Removed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredProducts.map((product) => {
                const seller = product.profiles;
                const category = product.categories;
                const busy = actionId === product.id;

                return (
                  <article
                    key={product.id}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="cursor-pointer p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <ProductIcon />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-sm font-black text-emerald-700">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${getStatusClasses(
                              product.status,
                            )}`}
                          >
                            {getStatusLabel(product.status)}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-slate-400">Seller</p>

                            <p className="mt-1 truncate font-medium text-slate-700">
                              {seller?.full_name || "Unknown seller"}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-400">Category</p>

                            <p className="mt-1 truncate font-medium text-slate-700">
                              {category?.name || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-[11px] text-slate-400">
                            Listed {formatDate(product.created_at)}
                          </p>

                          <select
                            value={product.status}
                            disabled={busy}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) =>
                              handleStatusChange(product.id, event.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                            <option value="removed">Removed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
