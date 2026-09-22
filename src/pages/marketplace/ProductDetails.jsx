import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import { getProductById } from "../../services/products";

function getRelation(relation) {
  return relation?.[0] || relation || {};
}

function formatPrice(price) {
  return price == null ? "Price on request" : `₦${Number(price).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function LoadingState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
      <p className="text-sm font-medium text-slate-600">Loading product details...</p>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const productData = await getProductById(id);
        if (mounted) setProduct(productData);
      } catch (err) {
        console.error("Product details failed to load:", err);
        if (mounted) setError("This product could not be found or is no longer available.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  const category = getRelation(product?.categories);
  const seller = getRelation(product?.profiles);

  return (
    <MarketplaceLayout>
      <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <span aria-hidden="true">←</span> Back to marketplace
        </button>

        {loading ? <LoadingState /> : error ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Product unavailable</h1>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <Link to="/marketplace" className="mt-6 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">Return to marketplace</Link>
          </div>
        ) : product ? (
          <article className="grid overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
            <div className="aspect-square max-h-[620px] bg-slate-100 lg:aspect-auto">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0,#f1f5f3_58%,#e2e8e5_100%)] text-slate-400">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-light text-emerald-700 shadow-sm" aria-hidden="true">+</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em]">No image available</span>
                </div>
              )}
            </div>
            <div className="flex flex-col p-6 sm:p-9">
              <div className="flex flex-wrap gap-2">
                {category.name ? <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">{category.name}</span> : null}
                {product.condition ? <span className="rounded-md bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">{product.condition}</span> : null}
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
              <p className="mt-5 text-3xl font-black tracking-tight text-emerald-700">{formatPrice(product.price)}</p>
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">About this listing</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description || "The seller has not added a description yet."}</p>
              </div>
              <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800/60">Seller</h2>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-emerald-700 shadow-sm">{(seller.full_name || "C").charAt(0).toUpperCase()}</span>
                  <div>
                    <p className="text-base font-bold text-slate-900">{seller.full_name || "Campus seller"}</p>
                    {seller.department ? <p className="mt-0.5 text-sm text-slate-600">{seller.department}</p> : null}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {seller.phone ? <a href={`tel:${seller.phone}`} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">Call seller</a> : null}
                  {seller.email ? <a href={`mailto:${seller.email}`} className="rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300">Email seller</a> : null}
                  {!seller.phone && !seller.email ? <p className="text-sm text-slate-500">No contact details shared.</p> : null}
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </MarketplaceLayout>
  );
}
