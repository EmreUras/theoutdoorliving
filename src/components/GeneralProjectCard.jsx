"use client";

import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const url = (p) =>
  supabase.storage.from("gp-media").getPublicUrl(p).data.publicUrl;

export default function GeneralProjectCard({ project }) {
  const media = useMemo(
    () => (project.media || []).map((m) => ({ ...m, src: url(m.path) })),
    [project.media]
  );

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // 🔑 Keyboard controls for the lightbox
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx((i) => (i - 1 + media.length) % media.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIdx((i) => (i + 1) % media.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, media.length]);

  const visible = media.slice(0, 5);
  const center = (visible.length - 1) / 2;

  return (
    <article
      className="
      relative rounded-3xl border border-white/10 bg-white/5
      ring-1 ring-emerald-400/20 shadow-[0_0_60px_rgba(16,185,129,0.18)]
      hover:shadow-[0_0_90px_rgba(16,185,129,0.28)] transition-shadow
      p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Fan / deck */}
        <div className="relative w-[240px] sm:w-[300px] md:w-[360px] h-[160px] sm:h-[190px] md:h-[220px]">
          {visible.map((m, i) => {
            const offset = i - center;
            const rot = offset * 6; // degrees
            const tx = offset * 18; // px
            const ty = Math.abs(offset) * 2; // px
            return (
              <button
                key={m.id}
                onClick={() => {
                  setIdx(i);
                  setOpen(true);
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                           rounded-xl overflow-hidden border border-white/10 bg-black/30
                           shadow-lg hover:scale-[1.02] transition will-change-transform"
                style={{
                  width: "64%",
                  height: "84%",
                  transform: `translate(-50%,-50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                  zIndex: 10 + i,
                }}
                aria-label="Open media"
              >
                {m.kind === "image" ? (
                  <img
                    src={m.src}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <video
                    src={m.src}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Text */}
        <div className="w-full md:flex-1 text-center md:text-left">
          {project.title && (
            <h3 className="text-2xl md:text-3xl font-anton mb-3 bg-gradient-to-br from-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              {project.title}
            </h3>
          )}
          {project.description && (
            <p className="mx-auto md:mx-0 max-w-2xl text-emerald-50/90 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            className="fixed top-3 right-3 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>

          <div
            className="h-full w-full overflow-auto p-4 md:p-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-[92vw] max-h-[82vh]">
              {media[idx]?.kind === "image" ? (
                <img
                  src={media[idx]?.src}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl border border-white/10"
                  alt=""
                />
              ) : (
                <video
                  src={media[idx]?.src}
                  controls
                  className="max-w-full max-h-[82vh] object-contain rounded-xl border border-white/10"
                />
              )}

              {/* nav */}
              {media.length > 1 && (
                <>
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                    onClick={() =>
                      setIdx((i) => (i - 1 + media.length) % media.length)
                    }
                    aria-label="Previous"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setIdx((i) => (i + 1) % media.length)}
                    aria-label="Next"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
