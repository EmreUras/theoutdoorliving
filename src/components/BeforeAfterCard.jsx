"use client";
import { useEffect, useState } from "react";
import { FiMaximize2, FiX } from "react-icons/fi";

export default function BeforeAfterCard({
  beforeUrl,
  afterUrl,
  beforeLabel = "Before",
  afterLabel = "After",
}) {
  const [showAfter, setShowAfter] = useState(false);
  const [open, setOpen] = useState(false);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = showAfter ? afterUrl : beforeUrl;
  const currentLabel = showAfter ? afterLabel : beforeLabel;

  return (
    <>
      {/* Image card */}
      <figure
        className="
          group relative overflow-hidden rounded-2xl
          border border-white/12 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
          ring-1 ring-emerald-400/10
          transition
        "
      >
        <img
          src={current}
          alt={currentLabel}
          onClick={() => setShowAfter((v) => !v)}
          className="
            w-full h-64 object-cover select-none cursor-pointer
            transition-transform duration-500 group-hover:scale-[1.02]
          "
          loading="lazy"
        />

        {/* soft vignette */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35
         via-transparent to-black/10"
        />

        {/* label chip */}
        <figcaption
          className="
            absolute left-3 top-3 text-[11px] uppercase tracking-wide
            bg-black/55 backdrop-blur-sm text-emerald-100
            px-2.5 py-1 rounded-md border border-white/10
            shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
          "
        >
          {currentLabel}
        </figcaption>

        {/* zoom */}
        <button
          onClick={() => setOpen(true)}
          title="View larger"
          aria-label="View larger"
          className="
            absolute right-2 top-2 p-2 rounded-full
            bg-black/50 text-white hover:bg-black/70
            border border-white/10
          "
        >
          <FiMaximize2 className="h-4 w-4" />
        </button>

        {/* hint */}
        <span
          className="
            absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px]
            rounded-full px-2.5 py-1 bg-black/45 text-white/90 border border-white/10
            opacity-0 group-hover:opacity-100 transition
          "
        >
          Click to toggle
        </span>
      </figure>

      {/* Fullscreen viewer (fixed & safe on mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)} // click backdrop to close
        >
          {/* Close (always reachable) */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="fixed top-3 right-3 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Scrollable content; stop propagation */}
          <div
            className="h-full w-full overflow-auto p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* BEFORE */}
              <figure className="relative rounded-2xl border border-white/12 bg-black/25 p-2">
                <img
                  src={beforeUrl}
                  alt={beforeLabel}
                  className="w-full h-auto object-contain rounded-xl max-h-[70vh] md:max-h-[82vh]"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-3 left-3 text-xs bg-black/60 text-white rounded px-2 py-1">
                  {beforeLabel}
                </figcaption>
              </figure>

              {/* AFTER */}
              <figure className="relative rounded-2xl border border-white/12 bg-black/25 p-2">
                <img
                  src={afterUrl}
                  alt={afterLabel}
                  className="w-full h-auto object-contain rounded-xl max-h-[70vh] md:max-h-[82vh]"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-3 left-3 text-xs bg-black/60 text-white rounded px-2 py-1">
                  {afterLabel}
                </figcaption>
              </figure>
            </div>

            {/* bottom-close for thumb reach on phones */}
            <div className="mt-6 flex justify-center md:hidden">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 bg-white/10 text-white border border-white/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
