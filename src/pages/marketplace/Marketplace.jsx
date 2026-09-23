import { useEffect, useMemo, useState } from "react";

import ProductCard from "../../components/marketplace/ProductCard";
import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import { useAuth } from "../../hooks/useAuth";
import { getCategories, getProducts } from "../../services/products";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

      <p className="text-sm font-medium text-slate-600">
        Loading marketplace...
      </p>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <GridIcon />
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        {filtered
          ? "No products found"
          : "The marketplace is waiting for listings"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {filtered
          ? "Try a different search term or choose another category."
          : "There are no active products available right now. Check back soon."}
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

        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (mounted) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Marketplace data failed to load:", err);

        if (mounted) {
          setError(
            "We could not load the marketplace right now. Please try again.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
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
      const categoryId =
        product.category_id ||
        product.categories?.id ||
        product.categories?.[0]?.id;

      const categoryName =
        product.categories?.name || product.categories?.[0]?.name || "";

      const matchesCategory =
        selectedCategory === "all" ||
        String(categoryId) === String(selectedCategory);

      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.description, categoryName]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const firstName = displayName.split(" ")[0];

  const hasFilters = Boolean(search.trim()) || selectedCategory !== "all";

  return (
    <MarketplaceLayout>
      <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-7 sm:py-8 lg:px-9">
        {/* Page heading */}
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Campus marketplace
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Find something useful
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Browse products and services offered by people in your campus
                community.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-xl bg-emerald-50 px-4 py-3 text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                Welcome
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-900">
                {firstName}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <label className="relative block w-full">
              <span className="sr-only">Search marketplace products</span>

              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <SearchIcon />
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, books, electronics, fashion..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>
        </header>

        {/* Categories */}
        <section className="py-7" aria-labelledby="browse-heading">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Browse
              </p>

              <h2
                id="browse-heading"
                className="mt-1 text-lg font-black tracking-tight text-slate-900"
              >
                Categories
              </h2>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </span>
          </div>

          <div
            className="mt-4 flex gap-2 overflow-x-auto pb-1"
            aria-label="Product categories"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                selectedCategory === "all"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
              }`}
            >
              All products
            </button>

            {categories.map((category) => {
              const isSelected =
                String(category.id) === String(selectedCategory);

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(String(category.id))}
                  className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Product section */}
        <section aria-live="polite">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Fresh on campus
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Latest listings
              </h2>
            </div>

            {!loading && !error ? (
              <span className="text-xs font-medium text-slate-400">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "listing" : "listings"}
              </span>
            ) : null}
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState filtered={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MarketplaceLayout>
  );
}
