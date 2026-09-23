export default function ConfirmDialog({
  productName,
  onCancel,
  onConfirm,
  busy,
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-5 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-dialog-title"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600">
          Remove listing
        </p>
        <h2
          id="remove-dialog-title"
          className="mt-2 text-xl font-black tracking-tight text-slate-900"
        >
          Remove this listing?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {productName ? `${productName} will` : "This product will"} no longer
          appear in the marketplace. You can keep it in your records with a
          removed status.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60"
          >
            {busy ? "Removing..." : "Remove listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
