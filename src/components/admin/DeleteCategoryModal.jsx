export default function DeleteCategoryModal({
  category,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!category) {
    return null;
  }

  const productCount = category.products?.length ?? 0;
  const hasProducts = productCount > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
      >
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <h2
          id="delete-category-title"
          className="mt-4 text-lg font-semibold text-slate-900"
        >
          Delete category?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            "{category.name}"
          </span>
          ?
        </p>

        {hasProducts ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-800">
            This category is currently assigned to{" "}
            <span className="font-semibold">
              {productCount} product{productCount === 1 ? "" : "s"}
            </span>
            . It cannot be deleted until those products are moved to another
            category.
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            This action cannot be undone.
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting || hasProducts}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete category"}
          </button>
        </div>
      </div>
    </div>
  );
}
