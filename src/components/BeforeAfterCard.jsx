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

  return (
    <>
      {/* Image card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <img
          src={showAfter ? afterUrl : beforeUrl}
          onClick={() => setShowAfter((v) => !v)}
          className="w-full h-64 object-cover cursor-pointer select-none"
          alt={showAfter ? afterLabel : beforeLabel}
        />
        <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white rounded px-2 py-1">
          {showAfter ? afterLabel : beforeLabel}
        </span>

        <button
          onClick={() => setOpen(true)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          aria-label="View larger"
          title="View larger"
        >
          <FiMaximize2 />
        </button>
      </div>

      {/* Fullscreen viewer (fixed & safe on mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)} // click backdrop to close
        >
          {/* Close button fixed to viewport so it's ALWAYS visible */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="fixed top-3 right-3 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Scrollable content area; clicking inside shouldn't close */}
          <div
            className="h-full w-full overflow-auto p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* BEFORE */}
              <figure className="relative rounded-2xl border border-white/10 bg-black/20 p-2">
                <img
                  src={beforeUrl}
                  alt={beforeLabel}
                  className="
                    w-full h-auto object-contain rounded-xl
                    max-h-[70vh] md:max-h-[82vh]
                  "
                  loading="lazy"
                />
                <figcaption className="absolute bottom-3 left-3 text-xs bg-black/60 text-white rounded px-2 py-1">
                  {beforeLabel}
                </figcaption>
              </figure>

              {/* AFTER */}
              <figure className="relative rounded-2xl border border-white/10 bg-black/20 p-2">
                <img
                  src={afterUrl}
                  alt={afterLabel}
                  className="
                    w-full h-auto object-contain rounded-xl
                    max-h-[70vh] md:max-h-[82vh]
                  "
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
