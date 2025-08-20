"use client";

import { useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function LightboxModal({
  open,
  items, // [{ kind: 'image'|'video', src }]
  index = 0,
  onClose,
  onIndex,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") onIndex?.((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onIndex?.((index - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, items?.length, onClose, onIndex]);

  if (!open) return null;
  const current = items[index];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <button
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        <FiX />
      </button>

      <button
        className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => onIndex?.((index - 1 + items.length) % items.length)}
        aria-label="Previous"
      >
        <FiChevronLeft />
      </button>
      <button
        className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => onIndex?.((index + 1) % items.length)}
        aria-label="Next"
      >
        <FiChevronRight />
      </button>

      <div className="max-w-5xl w-full">
        {current.kind === "image" ? (
          <img src={current.src} alt="" className="w-full h-auto rounded-xl" />
        ) : (
          <video
            src={current.src}
            controls
            autoPlay
            className="w-full h-auto rounded-xl"
          />
        )}
      </div>
    </div>
  );
}
