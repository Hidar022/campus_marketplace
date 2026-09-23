import { useEffect, useState } from "react";

import { getEmptyProductForm } from "./productFormUtils";

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

function FieldLabel({ htmlFor, children, required = false }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-slate-700">
      {children}

      {required ? <span className="ml-1 text-emerald-700">*</span> : null}
    </label>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export default function ProductForm({
  categories,
  initialValues,
  submitLabel,
  submitting,
  error,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => ({
    ...getEmptyProductForm(),
    ...initialValues,
  }));

  const [fieldErrors, setFieldErrors] = useState({});
  const [previewFailed, setPreviewFailed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  /*
   * Clean up temporary blob URLs when the component is removed.
   * This prevents unused object URLs from staying in memory.
   */
  useEffect(() => {
    return () => {
      if (form.imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imageUrl);
      }
    };
  }, [form.imageUrl]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (name === "imageUrl") {
      setPreviewFailed(false);
      setSelectedFile(null);
    }
  }

  function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    /*
     * Only allow image files.
     */
    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({
        ...current,
        imageUrl: "Please choose a valid image file.",
      }));

      return;
    }

    /*
     * Limit image size to 5MB.
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFieldErrors((current) => ({
        ...current,
        imageUrl: "Image must be smaller than 5MB.",
      }));

      return;
    }

    /*
     * Remove the previous temporary preview URL.
     */
    if (form.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imageUrl);
    }

    /*
     * Create a temporary browser preview.
     *
     * IMPORTANT:
     * This is only a preview URL.
     * It is not yet a permanent Supabase Storage URL.
     */
    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);

    setForm((current) => ({
      ...current,
      imageUrl: previewUrl,
    }));

    setFieldErrors((current) => ({
      ...current,
      imageUrl: "",
    }));

    setPreviewFailed(false);
  }

  function validate() {
    const nextErrors = {};

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();
    const numericPrice = Number(form.price);

    if (!trimmedName) {
      nextErrors.name = "Enter a product name.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Add a meaningful description.";
    }

    if (
      form.price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      nextErrors.price = "Enter a valid price of zero or more.";
    }

    /*
     * IMPORTANT:
     * categoryId is still validated exactly as before.
     */
    if (!form.categoryId) {
      nextErrors.categoryId = "Choose a category.";
    }

    if (!form.condition) {
      nextErrors.condition = "Choose the product condition.";
    }

    setFieldErrors(nextErrors);

    return {
      valid: Object.keys(nextErrors).length === 0,
      numericPrice,
      trimmedName,
      trimmedDescription,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    /*
     * Prevent accidental double submission.
     */
    if (submitting) return;

    const result = validate();

    if (!result.valid) return;

    /*
     * Keep the existing ProductForm API.
     *
     * selectedFile is included so AddProduct can later upload
     * the actual file to Supabase Storage.
     */
    onSubmit({
      ...form,
      name: result.trimmedName,
      description: result.trimmedDescription,
      price: result.numericPrice,

      /*
       * Keep categoryId exactly as the selected Supabase category ID.
       */
      categoryId: form.categoryId,

      /*
       * If the user selected a file, this is currently a blob URL.
       * If they pasted a URL, this is the actual URL.
       */
      imageUrl: form.imageUrl.trim(),

      /*
       * The actual File object is available for the upload step.
       */
      imageFile: selectedFile,
    });
  }

  const categoryList = Array.isArray(categories) ? categories : [];
  const hasCategories = categoryList.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General submission error */}
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-black"
          >
            !
          </span>

          <div>
            <p className="font-bold">Could not publish listing</p>

            <p className="mt-0.5 text-xs leading-5 text-red-600">{error}</p>
          </div>
        </div>
      ) : null}

      {/* ============================================================
          PRODUCT INFORMATION
      ============================================================ */}
      <section
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="product-information-heading"
      >
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
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
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5"
                />
              </svg>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Listing details
              </p>

              <h2
                id="product-information-heading"
                className="mt-1 text-lg font-black tracking-tight text-slate-900"
              >
                Product information
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Give buyers the details they need to understand your listing.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          {/* Product name */}
          <div>
            <FieldLabel htmlFor="product-name" required>
              Product name
            </FieldLabel>

            <input
              id="product-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="off"
              placeholder="e.g. HP EliteBook laptop"
              className={inputClass}
            />

            <FieldError message={fieldErrors.name} />
          </div>

          {/* Category + Condition */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* CATEGORY */}
            <div>
              <FieldLabel htmlFor="product-category" required>
                Category
              </FieldLabel>

              <select
                id="product-category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={submitting}
                className={`${inputClass} ${
                  !form.categoryId ? "text-slate-500" : "text-slate-900"
                }`}
              >
                <option value="">
                  {hasCategories
                    ? "Select a category"
                    : "No categories available"}
                </option>

                {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {hasCategories ? (
                <FieldError message={fieldErrors.categoryId} />
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  No categories were returned from the marketplace.
                </p>
              )}
            </div>

            {/* CONDITION */}
            <div>
              <FieldLabel htmlFor="product-condition" required>
                Condition
              </FieldLabel>

              <select
                id="product-condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                disabled={submitting}
                className={`${inputClass} capitalize`}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>

              <FieldError message={fieldErrors.condition} />
            </div>
          </div>

          {/* Price */}
          <div>
            <FieldLabel htmlFor="product-price" required>
              Price
            </FieldLabel>

            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₦
              </span>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={handleChange}
                disabled={submitting}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <FieldError message={fieldErrors.price} />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="product-description" required>
                Description
              </FieldLabel>

              <span className="text-[11px] font-medium text-slate-400">
                {form.description.length} characters
              </span>
            </div>

            <textarea
              id="product-description"
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Describe the item, its condition, and anything a buyer should know."
              className={`${inputClass} resize-y leading-6`}
            />

            <FieldError message={fieldErrors.description} />
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT IMAGE
      ============================================================ */}
      <section
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="product-image-heading"
      >
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />

                <circle cx="9" cy="9" r="1.5" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4 16 4.5-4.5a2 2 0 0 1 2.8 0L14 14l1.5-1.5a2 2 0 0 1 2.8 0L20 14.2"
                />
              </svg>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Optional
              </p>

              <h2
                id="product-image-heading"
                className="mt-1 text-lg font-black tracking-tight text-slate-900"
              >
                Product image
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Add a picture of the item so buyers can see what you are
                offering.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          {/* Upload from device */}
          <label
            htmlFor="product-image-file"
            className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition ${
              submitting
                ? "cursor-not-allowed opacity-60"
                : "hover:border-emerald-400 hover:bg-emerald-50/40"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm transition group-hover:bg-emerald-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14"
                />
              </svg>
            </span>

            <span className="mt-3 text-sm font-bold text-slate-700">
              Upload a product image
            </span>

            <span className="mt-1 text-xs text-slate-400">
              PNG, JPG or WEBP · Max 5MB
            </span>

            <input
              id="product-image-file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              disabled={submitting}
              onChange={handleImageSelect}
            />
          </label>

          <FieldError message={fieldErrors.imageUrl} />

          {/* Selected file information */}
          {selectedFile ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-emerald-900">
                  {selectedFile.name}
                </p>

                <p className="mt-0.5 text-[11px] text-emerald-700">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-emerald-700">
                Selected
              </span>
            </div>
          ) : null}

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              or use image URL
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Image URL */}
          <div>
            <FieldLabel htmlFor="product-image">Image URL</FieldLabel>

            <input
              id="product-image"
              name="imageUrl"
              type="url"
              value={form.imageUrl.startsWith("blob:") ? "" : form.imageUrl}
              onChange={handleChange}
              disabled={submitting}
              placeholder="https://example.com/product-image.jpg"
              className={inputClass}
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Or paste a publicly accessible image URL.
            </p>
          </div>

          {/* Image preview */}
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {form.imageUrl && !previewFailed ? (
              <img
                src={form.imageUrl}
                alt="Product preview"
                onError={() => setPreviewFailed(true)}
                className="h-52 w-full object-cover sm:h-56"
              />
            ) : (
              <div className="flex h-52 flex-col items-center justify-center gap-2 px-6 text-center text-slate-400 sm:h-56">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-emerald-700 shadow-sm">
                  +
                </span>

                <p className="text-xs font-semibold">
                  {previewFailed
                    ? "This image could not be previewed"
                    : "Your image preview will appear here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          ACTIONS
      ============================================================ */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Publishing...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
