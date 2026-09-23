import { Link } from "react-router-dom";

function formatPrice(price) {
  return price == null
    ? "Price on request"
    : `₦${Number(price).toLocaleString("en-NG", {
        maximumFractionDigits: 0,
      })}`;
}

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  sold: "bg-amber-50 text-amber-700",
  removed: "bg-slate-100 text-slate-500",
};

export default function SellerProductCard({
  product,
  onEdit,
  onMarkSold,
  onRemove,
  onRestore,
  changing,
}) {
  const categoryName =
    product.categories?.name ||
    product.categories?.[0]?.name ||
    "Uncategorized";

  const isActive = product.status === "active";
  const isSold = product.status === "sold";
  const isRemoved = product.status === "removed";

  const isChanging = changing === true;

  return (
    <article className="flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-shadow duration-200 hover:shadow-md">
      {/* Product image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0,#f1f5f3_58%,#e2e8e5_100%)] text-slate-400">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-emerald-700 shadow-sm">
              +
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        {/* Category + status */}
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              {categoryName}
            </p>

            <h2 className="mt-1 line-clamp-2 text-base font-bold leading-5 text-slate-900">
              {product.name}
            </h2>
          </div>

          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
              statusStyles[product.status] || statusStyles.removed
            }`}
          >
            {product.status}
          </span>
        </div>

        {/* Price */}
        <p className="mt-4 text-xl font-black tracking-tight text-emerald-700">
          {formatPrice(product.price)}
        </p>

        {/* Condition + date */}
        <p className="mt-1 text-xs capitalize text-slate-500">
          {product.condition}{" "}
          {product.created_at
            ? `· Listed ${formatDate(product.created_at)}`
            : ""}
        </p>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {/* Edit */}
          <Link
            to={`/marketplace/my-products/${product.id}/edit`}
            onClick={onEdit}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            Edit
          </Link>

          {/* Active product actions */}
          {isActive && (
            <>
              <button
                type="button"
                onClick={() => onMarkSold(product)}
                disabled={isChanging}
                className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChanging ? "Updating..." : "Mark as sold"}
              </button>

              <button
                type="button"
                onClick={() => onRemove(product)}
                disabled={isChanging}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChanging ? "Updating..." : "Remove"}
              </button>
            </>
          )}

          {/* Sold product actions */}
          {isSold && (
            <button
              type="button"
              onClick={() => onRestore(product)}
              disabled={isChanging}
              className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChanging ? "Updating..." : "Mark as active"}
            </button>
          )}

          {/* Removed product actions */}
          {isRemoved && (
            <button
              type="button"
              onClick={() => onRestore(product)}
              disabled={isChanging}
              className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChanging ? "Restoring..." : "Restore listing"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
