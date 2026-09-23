import { Link } from "react-router-dom";

function getRelationName(relation) {
  return relation?.name || relation?.[0]?.name || "Uncategorized";
}

function getSellerName(profile) {
  return profile?.full_name || profile?.[0]?.full_name || "Campus seller";
}

function formatPrice(price) {
  return price == null
    ? "Price on request"
    : `₦${Number(price).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export default function ProductCard({ product }) {
  const categoryName = getRelationName(product.categories);
  const seller = product.profiles?.[0] || product.profiles || {};
  const sellerName = getSellerName(product.profiles);

  return (
    <Link
      to={`/marketplace/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.09)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0,#f1f5f3_58%,#e2e8e5_100%)] text-slate-400">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-light text-emerald-700 shadow-sm"
              aria-hidden="true"
            >
              +
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
              No image
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-[15px] font-bold leading-5 text-slate-900">
            {product.name}
          </h2>
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
            {product.condition || "Available"}
          </span>
        </div>

        <p className="mt-4 text-xl font-black tracking-tight text-emerald-700">
          {formatPrice(product.price)}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-black text-emerald-700">
            {sellerName.charAt(0).toUpperCase()}
          </span>
          <p className="min-w-0 truncate text-xs font-semibold text-slate-700">
            {sellerName}
            {seller.department ? (
              <span className="block truncate text-[11px] font-normal text-slate-400">
                {seller.department}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </Link>
  );
}
