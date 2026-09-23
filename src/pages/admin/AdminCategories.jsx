import { useEffect, useMemo, useState } from "react";

import CategoryFormModal from "../../components/admin/CategoryFormModal";
import DeleteCategoryModal from "../../components/admin/DeleteCategoryModal";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../../services/categories";

function CategoryIcon() {
  return (
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
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9ZM8 10h8M8 14h5"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1 14 0 7 7 0 0 1 14 0Z"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.5 6.5 3 3M5 19l3.5-.75L18.5 8.25a2.12 2.12 0 0 0-3-3L5.5 15.25 5 19Z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 7h14M10 11v5M14 11v5M8 7l1-3h6l1 3m-9 0 .7 12h8.6L17 7"
      />
    </svg>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getProductCount(category) {
  return category.products?.length ?? 0;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCategories();

      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query)
      );
    });
  }, [categories, search]);

  const totalProducts = useMemo(() => {
    return categories.reduce(
      (total, category) => total + getProductCount(category),
      0,
    );
  }, [categories]);

  const categoriesInUse = useMemo(() => {
    return categories.filter((category) => getProductCount(category) > 0)
      .length;
  }, [categories]);

  function openCreateForm() {
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(category) {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCategory) {
        const updatedCategory = await updateCategory({
          categoryId: editingCategory.id,
          name,
          description,
        });

        setCategories((current) =>
          current
            .map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category,
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        );

        setSuccess("Category updated successfully.");
      } else {
        const newCategory = await createCategory({
          name,
          description,
        });

        setCategories((current) =>
          [...current, newCategory].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );

        setSuccess("Category created successfully.");
      }

      setShowForm(false);
      setEditingCategory(null);

      setForm({
        name: "",
        description: "",
      });
    } catch (err) {
      console.error(err);

      if (err.code === "23505") {
        setError("A category with this name already exists.");
      } else {
        setError(err.message || "Failed to save category.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(category) {
    setError("");
    setSuccess("");
    setCategoryToDelete(category);
  }

  async function confirmDelete() {
    if (!categoryToDelete) {
      return;
    }

    const productCount = getProductCount(categoryToDelete);

    /*
     * We already know from the modal whether this category
     * has products. This second check protects us in case
     * the function is triggered another way.
     */
    if (productCount > 0) {
      setCategoryToDelete(null);

      setError(
        `"${categoryToDelete.name}" cannot be deleted because it is being used by ${productCount} product${
          productCount === 1 ? "" : "s"
        }.`,
      );

      return;
    }

    try {
      setDeletingId(categoryToDelete.id);
      setError("");
      setSuccess("");

      await deleteCategory(categoryToDelete.id);

      setCategories((current) =>
        current.filter((category) => category.id !== categoryToDelete.id),
      );

      setCategoryToDelete(null);

      setSuccess("Category deleted successfully.");
    } catch (err) {
      console.error(err);

      /*
       * PostgreSQL/Supabase may also reject the delete if
       * another product was assigned to the category after
       * the list was loaded.
       */
      setError(err.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Organize marketplace listings into clear product categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
          >
            <PlusIcon />
            Add category
          </button>
        </div>

        {/* =====================================================
            FEEDBACK
        ====================================================== */}
        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-lg leading-none text-red-400 transition hover:text-red-700"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <p>{success}</p>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="shrink-0 text-lg leading-none text-emerald-500 transition hover:text-emerald-700"
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total categories</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Categories in use</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {categoriesInUse}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Products assigned</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalProducts}
            </p>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon />
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* =====================================================
            CATEGORY LIST
        ====================================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CategoryIcon />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {search ? "No categories found" : "No categories yet"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Create your first marketplace category to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <PlusIcon />
                  Add category
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================== */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Description
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Products
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCategories.map((category) => {
                      const productCount = getProductCount(category);
                      const deleting = deletingId === category.id;

                      return (
                        <tr
                          key={category.id}
                          className="transition hover:bg-slate-50"
                        >
                          {/* Category */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CategoryIcon />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {category.name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Marketplace category
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="max-w-md px-6 py-4 text-sm text-slate-500">
                            <p className="line-clamp-2">
                              {category.description || "No description"}
                            </p>
                          </td>

                          {/* Product count */}
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {productCount}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(category.created_at)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditForm(category)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                <EditIcon />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                disabled={deleting}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <TrashIcon />

                                {deleting ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================== */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredCategories.map((category) => {
                  const productCount = getProductCount(category);
                  const deleting = deletingId === category.id;

                  return (
                    <article key={category.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <CategoryIcon />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {category.name}
                          </h3>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                        <div>
                          <p className="text-xs text-slate-400">Products</p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {productCount}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Created</p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {formatDate(category.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <EditIcon />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deleting}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <TrashIcon />

                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =======================================================
          CREATE / EDIT MODAL
      ======================================================== */}
      <CategoryFormModal
        open={showForm}
        editingCategory={editingCategory}
        form={form}
        saving={saving}
        onChange={handleChange}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      {/* =======================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}
      <DeleteCategoryModal
        category={categoryToDelete}
        deleting={deletingId === categoryToDelete?.id}
        onClose={() => {
          if (!deletingId) {
            setCategoryToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
