"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BeforeAfterFlip({
  before,
  after,
  labelBefore = "Before",
  labelAfter = "After",
  className = "",
  aspect = "aspect-[4/3]",
}) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl ring-1 ring-white/10 cursor-pointer ${aspect} ${className}`}
      onClick={() => setShowAfter((s) => !s)}
      title={showAfter ? labelAfter : labelBefore}
    >
      {/* before */}
      <img
        src={before}
        alt={labelBefore}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-400 ${
          showAfter ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* after */}
      <AnimatePresence>
        {showAfter && (
          <motion.img
            key="after"
            src={after}
            alt={labelAfter}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
        {showAfter ? labelAfter : labelBefore}
      </div>
    </div>
  );
}
