"use client";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  body,
  cancel,
  confirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[250] grid place-items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={cancel}
      />
      <div className="relative w-[92vw] max-w-md rounded-2xl bg-[#0b1713] border border-white/10 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-emerald-100 font-semibold text-lg">{title}</h3>
          <button
            onClick={cancel}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white transition"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {body && <p className="text-emerald-50/80 mt-3">{body}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={cancel}
            className="rounded-lg px-3 py-2 border border-white/15 text-emerald-50/90 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="rounded-lg px-4 py-2 bg-gradient-to-br from-rose-400 to-red-400 text-black font-medium hover:brightness-110"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
