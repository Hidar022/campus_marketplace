import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import SellerProductCard from "../../components/products/SellerProductCard";
import ConfirmDialog from "../../components/products/ConfirmDialog";
import AddProduct from "./AddProduct";

import { useAuth } from "../../hooks/useAuth";
import { getMyProducts, updateProductStatus } from "../../services/products";

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="text-3xl font-black tracking-tight text-slate-900">
          {value}
        </p>

        <p className="pb-1 text-right text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-lg font-black tracking-tight text-slate-900">
        {title}
      </h2>

      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
        {count}
      </span>
    </div>
  );
}

function EmptySection({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
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
            d="M6 7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 16.5v-9Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 10h6M9 13h4"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default function MyProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);
  const [changingProductId, setChangingProductId] = useState(null);

  async function loadProducts() {
    if (!user?.id) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts(user.id);
      setProducts(data);
    } catch (loadError) {
      console.error("My products failed to load:", loadError);

      setError("We could not load your listings right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [user?.id]);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    setNotice(location.state.message);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setConfirmAction(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "active"),
    [products],
  );

  const soldProducts = useMemo(
    () => products.filter((product) => product.status === "sold"),
    [products],
  );

  const removedProducts = useMemo(
    () => products.filter((product) => product.status === "removed"),
    [products],
  );

  async function changeStatus(productId, status) {
    if (!user?.id) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const product = products.find((item) => item.id === productId);

    if (!product || product.seller_id !== user.id) {
      setError(
        "This listing could not be updated. It may no longer belong to you.",
      );
      return;
    }

    try {
      setChangingProductId(productId);
      setError("");
      setNotice("");

      const updatedProduct = await updateProductStatus({
        productId,
        sellerId: user.id,
        status,
      });

      if (!updatedProduct) {
        throw new Error("Listing ownership check failed");
      }

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === productId ? updatedProduct : item,
        ),
      );

      const messages = {
        active: "Your listing is active again.",
        sold: "Your listing has been marked as sold.",
        removed: "Your listing has been removed from the marketplace.",
      };

      setNotice(messages[status] || "Your listing was updated.");
    } catch (statusError) {
      console.error("Product status update failed:", statusError);

      setError(
        "This listing could not be updated. It may no longer belong to you.",
      );
    } finally {
      setChangingProductId(null);
      setConfirmAction(null);
    }
  }

  function requestStatusChange(product, status) {
    const actionText = {
      active: "restore this listing",
      sold: "mark this listing as sold",
      removed: "remove this listing",
    };

    setConfirmAction({
      productId: product.id,
      status,
      title:
        status === "removed"
          ? "Remove listing?"
          : status === "sold"
            ? "Mark listing as sold?"
            : "Restore listing?",
      message: `Are you sure you want to ${actionText[status]}?`,
      confirmLabel:
        status === "removed"
          ? "Remove listing"
          : status === "sold"
            ? "Mark as sold"
            : "Restore listing",
      danger: status === "removed",
    });
  }

  function handleEdit(product) {
    navigate(`/marketplace/my-products/${product.id}/edit`);
  }

  function handleProductCreated(createdProduct) {
    setProducts((currentProducts) => [createdProduct, ...currentProducts]);

    setShowAddProduct(false);
    setNotice("Your listing was published successfully.");
    setError("");
  }

  return (
    <MarketplaceLayout>
      <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        {/* Page header */}
        <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Seller dashboard
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              My Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage your campus listings, update their status, and keep track
              of what you are selling.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddProduct(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
            Add product
          </button>
        </div>

        {/* Notice */}
        {notice && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
              />
            </svg>

            <span className="flex-1">{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="font-bold text-emerald-700 hover:text-emerald-900"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4M12 16h.01"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Active"
            value={activeProducts.length}
            description="currently listed"
          />

          <StatCard
            label="Sold"
            value={soldProducts.length}
            description="completed sales"
          />

          <StatCard
            label="Total"
            value={products.length}
            description="all your listings"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-100" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-9 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {/* Active listings */}
            <section>
              <SectionHeader
                title="Active listings"
                count={activeProducts.length}
              />

              {activeProducts.length === 0 ? (
                <EmptySection
                  title="No active listings"
                  message="Products you publish will appear here while they are available for buyers."
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {activeProducts.map((product) => (
                    <SellerProductCard
                      key={product.id}
                      product={product}
                      changing={changingProductId === product.id}
                      onEdit={() => handleEdit(product)}
                      onMarkSold={() => requestStatusChange(product, "sold")}
                      onRemove={() => requestStatusChange(product, "removed")}
                      onRestore={() => requestStatusChange(product, "active")}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Sold listings */}
            <section>
              <SectionHeader
                title="Sold listings"
                count={soldProducts.length}
              />

              {soldProducts.length === 0 ? (
                <EmptySection
                  title="No sold listings"
                  message="Listings you mark as sold will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {soldProducts.map((product) => (
                    <SellerProductCard
                      key={product.id}
                      product={product}
                      changing={changingProductId === product.id}
                      onEdit={() => handleEdit(product)}
                      onMarkSold={() => requestStatusChange(product, "sold")}
                      onRemove={() => requestStatusChange(product, "removed")}
                      onRestore={() => requestStatusChange(product, "active")}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Removed listings */}
            <section>
              <SectionHeader
                title="Removed listings"
                count={removedProducts.length}
              />

              {removedProducts.length === 0 ? (
                <EmptySection
                  title="No removed listings"
                  message="Listings you remove from the marketplace will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {removedProducts.map((product) => (
                    <SellerProductCard
                      key={product.id}
                      product={product}
                      changing={changingProductId === product.id}
                      onEdit={() => handleEdit(product)}
                      onMarkSold={() => requestStatusChange(product, "sold")}
                      onRemove={() => requestStatusChange(product, "removed")}
                      onRestore={() => requestStatusChange(product, "active")}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProduct
          modal
          onClose={() => setShowAddProduct(false)}
          onSuccess={handleProductCreated}
        />
      )}

      {/* Confirmation dialog */}
      {confirmAction && (
        <ConfirmDialog
          open
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          danger={confirmAction.danger}
          loading={changingProductId === confirmAction.productId}
          onCancel={() => {
            if (!changingProductId) {
              setConfirmAction(null);
            }
          }}
          onConfirm={() =>
            changeStatus(confirmAction.productId, confirmAction.status)
          }
        />
      )}
    </MarketplaceLayout>
  );
}
