import { useEffect, useMemo, useState } from "react";

import ProductCard from "../../components/marketplace/ProductCard";
import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import { useAuth } from "../../hooks/useAuth";
import { getCategories, getProducts } from "../../services/products";

function LoadingState({ label = "Loading marketplace..." }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center shadow-sm">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700">⌕</div>
      <h2 className="mt-5 text-lg font-bold text-slate-900">
        {filtered ? "No products found" : "The marketplace is waiting for listings"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {filtered ? "Try a different search term or clear the category filter." : "There are no active products available right now. Check back soon."}
      </p>
    </div>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadMarketplace() {
      try {
        setLoading(true);
        setError("");
        const [productData, categoryData] = await Promise.all([getProducts(), getCategories()]);
        if (mounted) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Marketplace data failed to load:", err);
        if (mounted) setError("We could not load the marketplace right now. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMarketplace();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryId = product.category_id || product.categories?.id || product.categories?.[0]?.id;
      const categoryName = product.categories?.name || product.categories?.[0]?.name || "";
      const matchesCategory = selectedCategory === "all" || String(categoryId) === String(selectedCategory);
      const matchesSearch = !normalizedSearch || [product.name, product.description, categoryName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const hasFilters = Boolean(search.trim()) || selectedCategory !== "all";

  return (
    <MarketplaceLayout>
      <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <section className="relative overflow-hidden rounded-2xl bg-emerald-900 px-6 py-7 text-white shadow-[0_12px_35px_rgba(6,78,59,0.15)] sm:px-9 sm:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[34px] border-emerald-800/60" />
          <div className="absolute bottom-[-70px] right-24 h-36 w-36 rounded-full border-[18px] border-emerald-700/30" />
          <div className="relative max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">Your campus marketplace</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {displayName}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">Discover useful products, services and good finds from your campus community.</p>
            <label className="relative mt-6 block max-w-2xl">
              <span className="sr-only">Search products</span>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, books, electronics..."
                className="w-full rounded-xl border border-white/20 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-900 shadow-lg shadow-emerald-950/10 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-300/30"
              />
            </label>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="browse-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">Explore by interest</p>
              <h2 id="browse-heading" className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Browse categories</h2>
            </div>
            <span className="hidden text-xs font-medium text-slate-400 sm:block">{categories.length} categories</span>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Product categories">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${selectedCategory === "all" ? "bg-emerald-700 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"}`}
            >
              <span className="mr-1.5">✓</span>All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(String(category.id))}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${String(category.id) === String(selectedCategory) ? "bg-emerald-700 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-live="polite">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">Fresh on campus</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Latest products</h2>
            </div>
            {!loading && !error ? <span className="text-xs font-medium text-slate-400">{visibleProducts.length} {visibleProducts.length === 1 ? "listing" : "listings"}</span> : null}
          </div>
          {loading ? <LoadingState /> : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm font-medium text-red-700 shadow-sm">{error}</div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState filtered={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </section>
      </div>
    </MarketplaceLayout>
  );
}
