import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";
import { getEmptyProductForm } from "../../components/products/productFormUtils";
import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import { useAuth } from "../../hooks/useAuth";
import { createProduct, getCategories } from "../../services/products";

function LoadingCategories() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-sm text-slate-600 shadow-sm">
      Loading categories...
    </div>
  );
}

export default function AddProduct({ modal = false, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const categoryData = await getCategories();
        if (mounted) setCategories(categoryData);
      } catch (loadError) {
        console.error("Categories failed to load for product form:", loadError);
        if (mounted)
          setError("We could not load product categories. Please try again.");
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(values) {
    if (!user?.id) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const createdProduct = await createProduct({
        sellerId: user.id,
        ...values,
      });
      if (modal) {
        onSuccess(createdProduct);
      } else {
        navigate("/marketplace/my-products", {
          replace: true,
          state: { message: "Your listing was published successfully." },
        });
      }
    } catch (submitError) {
      console.error("Product creation failed:", submitError);
      setError(
        "We could not publish this listing. Please review your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const form = loadingCategories ? (
    <LoadingCategories />
  ) : (
    <ProductForm
      categories={categories}
      initialValues={getEmptyProductForm()}
      submitLabel="Publish listing"
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
      onCancel={modal ? onClose : () => navigate("/marketplace/my-products")}
    />
  );

  if (modal) {
    return (
      <div
        className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-4 backdrop-blur-[2px] sm:items-center sm:py-8"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-listing-title"
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-[#f8faf9] shadow-2xl"
        >
          <div className="flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Share something useful
              </p>
              <h1
                id="create-listing-title"
                className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl"
              >
                Create a listing
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Add something useful to your campus marketplace.
              </p>
            </div>
            <button
              autoFocus
              type="button"
              onClick={onClose}
              aria-label="Close create listing dialog"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              ×
            </button>
          </div>
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-4 sm:p-6">
            {form}
          </div>
        </div>
      </div>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="mx-auto max-w-3xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/marketplace/my-products")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <span aria-hidden="true">←</span> My Products
        </button>
        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Share something useful
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Create a listing
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Tell your campus community what you are offering and make it easy
            for the right buyer to find you.
          </p>
        </div>
        {form}
      </div>
    </MarketplaceLayout>
  );
}
