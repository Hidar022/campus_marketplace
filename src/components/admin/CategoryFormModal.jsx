export default function CategoryFormModal({
  open,
  editingCategory,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  const editing = !!editingCategory;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="category-modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              {editing ? "Edit category" : "Add category"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the category information."
                : "Create a new marketplace category."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-5 sm:p-6">
          <div>
            <label
              htmlFor="category-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category name
            </label>

            <input
              id="category-name"
              name="name"
              value={form.name}
              onChange={onChange}
              disabled={saving}
              autoFocus
              placeholder="e.g. Electronics"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="category-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="category-description"
              name="description"
              value={form.description}
              onChange={onChange}
              disabled={saving}
              rows={4}
              placeholder="Briefly describe this category..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
