import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";
import { productToForm } from "../../components/products/productFormUtils";
import MarketplaceLayout from "../../layouts/MarketplaceLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getCategories,
  getMyProductById,
  updateProduct,
} from "../../services/products";

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
      <p className="text-sm font-medium text-slate-600">Loading listing...</p>
    </div>
  );
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          getMyProductById(id, user.id),
          getCategories(),
        ]);
        if (!mounted) return;
        if (!productData) {
          setError("This listing does not exist or does not belong to you.");
        } else {
          setProduct(productData);
          setCategories(categoryData);
        }
      } catch (loadError) {
        console.error("Product edit data failed to load:", loadError);
        if (mounted)
          setError(
            "We could not load this listing. Please return to My Products and try again.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (user?.id) loadData();
    return () => {
      mounted = false;
    };
  }, [id, user?.id]);

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      setError("");
      const updatedProduct = await updateProduct({
        productId: id,
        sellerId: user.id,
        ...values,
      });
      if (!updatedProduct) {
        setError(
          "This listing could not be updated. It may no longer belong to you.",
        );
        return;
      }
      navigate("/marketplace/my-products", {
        replace: true,
        state: { message: "Your listing was updated successfully." },
      });
    } catch (submitError) {
      console.error("Product update failed:", submitError);
      setError("We could not update this listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            Keep your listing current
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Edit listing
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Update the details buyers see on your campus marketplace listing.
          </p>
        </div>
        {loading ? (
          <LoadingState />
        ) : error && !product ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              Listing unavailable
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {error}
            </p>
            <button
              type="button"
              onClick={() => navigate("/marketplace/my-products")}
              className="mt-6 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
            >
              Return to My Products
            </button>
          </div>
        ) : product ? (
          <ProductForm
            categories={categories}
            initialValues={productToForm(product)}
            submitLabel="Save changes"
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/marketplace/my-products")}
          />
        ) : null}
      </div>
    </MarketplaceLayout>
  );
}
