import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminProductById,
  updateAdminProductStatus,
} from "../../services/adminProducts";

function formatPrice(price) {
  if (price == null) return "—";

  return `₦${Number(price).toLocaleString()}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
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

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminProductById(id);

        setProduct(data);
      } catch (err) {
        setError(err.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleStatusChange(event) {
    const status = event.target.value;

    try {
      setActionLoading(true);
      setError("");

      const updatedProduct = await updateAdminProductStatus({
        productId: product.id,
        status,
      });

      setProduct((current) => ({
        ...current,
        ...updatedProduct,
      }));
    } catch (err) {
      setError(err.message || "Unable to update listing status.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-72 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to products
        </button>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-bold text-red-800">
            Unable to load this product
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error || "The requested listing could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const seller = product.profiles;
  const category = product.categories;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
      >
        <span aria-hidden="true">←</span>
        Back to products
      </button>

      {/* Product overview */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
          {/* Image */}
          <div className="flex min-h-[280px] items-center justify-center bg-slate-50 p-5 lg:min-h-[360px]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-[340px] w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-full min-h-[240px] w-full items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-400">
                No product image
              </div>
            )}
          </div>

          {/* Main information */}
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(
                  product.status,
                )}`}
              >
                {getStatusLabel(product.status)}
              </span>

              {category?.name && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {category.name}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-3 text-2xl font-black text-emerald-700">
              {formatPrice(product.price)}
            </p>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Condition
              </p>

              <p className="mt-1 text-sm font-bold capitalize text-slate-800">
                {product.condition || "Not specified"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Listing status
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Change how this listing appears in the marketplace.
                  </p>
                </div>

                <select
                  value={product.status}
                  disabled={actionLoading}
                  onChange={handleStatusChange}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="removed">Removed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller information */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Seller information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Account information belonging to the seller of this listing.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
            {getInitials(seller?.full_name, seller?.email)}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-slate-900">
              {seller?.full_name || "Unknown seller"}
            </p>

            <p className="mt-1 break-all text-sm text-slate-400">
              {seller?.email || "No email"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">Phone</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {seller?.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {seller?.department || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Student ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {seller?.student_id || "Not provided"}
            </p>
          </div>
        </div>
      </section>

      {/* Listing information */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 className="text-base font-black text-slate-900">
          Listing information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Category</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {category?.name || "Not categorized"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Condition</p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
              {product.condition || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Listed</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatDate(product.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Last updated</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatDate(product.updated_at)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
